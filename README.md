# A2NB

## What it does?
#### Moodle Assignment → Jupyter Notebook

Export a Moodle Assignment as a Jupyter Notebook (.ipynb) so learners can work online in a managed or cloud-based Jupyter environment, or locally on their own machines—even offline.

* Adds an **“Export to Notebook (.ipynb)”** action on Course pages.
* Generates a notebook with:

  * Assignment title, description, and instructions (Markdown cells)
  * Embedded Code blocks
  * Basic metadata

## Requirements

* Moodle 3.9+ (recommended)

## Installation

1. Clone the plugin repository into your Moodle codebase at `blocks/a2nb`.
2. As an administrator, go to **Site administration** to complete the installation.
3. Add the plugin as a new block in a course.


## Usage

1. Create or open a Moodle course.
2. On the course page, click **Export to Notebook (.ipynb)**.
3. Download the generated notebook file.
4. Open the `.ipynb` in Jupyter (e.g., JupyterLab/Notebook), complete the answer cells, and submit your work as required (e.g., by uploading the `.ipynb` back to Moodle as a file submission).


## File naming

By default, notebooks are named like:

```
<course-shortname>_<assignment-name>.ipynb
```