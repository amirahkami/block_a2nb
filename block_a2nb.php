<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

defined('MOODLE_INTERNAL') || die();

use moodle_url;
use context_module;

class block_a2nb extends block_base {

    public function init() {
        $this->title = get_string('pluginname', 'block_a2nb');
    }

    public function applicable_formats() {
        return array(
            'site-index' => true,
            'course-view' => true,
            'mod' => false,
            'my' => true
        );
    }

    public function instance_allow_multiple() {
        return true;
    }

    public function get_content() {

        global $OUTPUT;

        if ($this->content !== null) {
            return $this->content;
        }

        $this->content = new stdClass();

        // Get course id
        $courseid = $this->page->course->id;

        // register js
        $this->page->requires->js(new \moodle_url('https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'));
        $this->page->requires->js_call_amd('block_a2nb/export', 'init');
        
        $assignments = $this->get_assignments($courseid);

        // render template
        $this->content->text = $OUTPUT->render_from_template('block_a2nb/head', []);
        $this->content->text .= $OUTPUT->render_from_template('block_a2nb/main', ['assignments' => $assignments]);
        $this->content->text .= $OUTPUT->render_from_template('block_a2nb/foot', []);

        // render footer
        $this->content->footer = 'Version: ';
        return $this->content;
    }

    

    private function get_assignments(int $courseid) {
        global $DB;
        // Fetch assignments for this course
        $assignments = $DB->get_records('assign', ['course' => $courseid], 'duedate ASC');
        
        $assignlist = [];
        
        foreach ($assignments as $assign) {            
            // TODO: if course id is the same

            $cm = get_coursemodule_from_instance('assign', $assign->id, $courseid, false, MUST_EXIST);
            $assignlist[] = [
                'name' => format_string($assign->name),
                'course' => format_string($assign->course),
                'description' => format_text($assign->intro, $assign->introformat),
                'instructions' => $assign->activity,
                'due_date' => userdate($assign->duedate, '%A, %d.%m.%Y, %H:%M'),
                'url' => new moodle_url('/mod/assign/view.php', ['id' => $cm->id]),
            ];


            #echo html_writer::tag('pre', s(print_r($assign, true)));
        }

        return $assignlist;
    }
}