<?php
// Global settings for block_simpleblock.
defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {
    $settings->add(new admin_setting_configtextarea(
        'block_a2nb/defaultmessage',
        get_string('defaultmessage', 'block_a2nb'),
        get_string('defaultmessage_desc', 'block_a2nb'),
        '<p>Hello from Simple block!</p>',
        PARAM_RAW
    ));
}
