define(['jquery', 'core/notification'], function($, Notification) {
    'use strict';

    /* global loadPyodide */

    /**
     * Loads Pyodide and the nbformat package using micropip.
     * Caches the Pyodide instance in `window.pyodide`.
     *
     * @returns {Promise<Object>} The loaded Pyodide instance.
     */
    async function loadPyodideAndPackages() {
        if (!window.pyodide) {
            Notification.addNotification({
                message: 'Loading in browser Python environment...',
                type: 'info'
            });

            window.pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
            });

            await window.pyodide.loadPackage("micropip");

            await window.pyodide.runPythonAsync(`
                import micropip
                await micropip.install("nbformat")
            `);
        }

        return window.pyodide;
    }

    /**
     * Generates a Jupyter Notebook (.ipynb) for a given assignment name,
     * using nbformat from Python inside Pyodide.
     * @param {string} name
     * @param {string} description
     * @param {string} instructions
     */
    async function generateNotebook(name, description, instructions) {
        const pyodide = await loadPyodideAndPackages();

        // Clean up name for filename
        const safeName = name
            .replace(/[^\w\s-]/g, '') // Remove symbols
            .replace(/\s+/g, '_'); // Spaces to underscores


        // placeholder and extract code block
        const temp = document.createElement('div');
        temp.innerHTML = instructions || '';
        const codeBlocks = [];

        temp.querySelectorAll('pre').forEach(pre => {
            const code = (pre.textContent || '').trim();
            if (code) { codeBlocks.push(code); }
            pre.remove();
        });

        const cleanedInstructions = temp.innerHTML;
        const codesJson = JSON.stringify(codeBlocks);

        // Python code to generate notebook using nbformat
        const pythonCode = `
import nbformat as nbf
import json

nb = nbf.v4.new_notebook()
cells = []

cells.append(nbf.v4.new_markdown_cell('### Assignment: ${name}\\n>This notebook was generated from Moodle A2NB Plugin.'))
cells.append(nbf.v4.new_markdown_cell('#### Description:\\n${description}'))
cells.append(nbf.v4.new_markdown_cell("""#### Instructions:\\n${cleanedInstructions}"""))


codes = json.loads(${JSON.stringify(codesJson)})
for code in codes:
    cells.append(nbf.v4.new_code_cell(code))


nb.cells = cells
nb_str = nbf.writes(nb)
nb_str
        `;

        try {
            const notebookStr = await pyodide.runPythonAsync(pythonCode);

            // Create a downloadable blob
            const blob = new Blob([notebookStr], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${safeName}.ipynb`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            Notification.exception(error);
        }
    }

    /**
     * Initializes event delegation for all buttons with `.create-ipynb`.
     * Reads assignment name from `data-assignment` attribute.
     */
    function init() {
        $(document).on('click', '.create-ipynb', function () {
            const name = $(this).data('name');
            const description = $(this).data('description');
            const instructions = $(this).data('instructions');

            if (!name || !description || !instructions) {
                Notification.alert('Assignment infos not fully provided.');
                return;
            }

            Notification.addNotification({
                message: `Generating notebook for "${name}"...`,
                type: 'info'
            });

            generateNotebook(name, description, instructions);
        });
    }

    return {
        init: init
    };
});
