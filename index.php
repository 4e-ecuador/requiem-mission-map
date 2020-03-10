<?php

$_file = filter_input(INPUT_GET, 'f', FILTER_SANITIZE_STRING);

$output = [];
exec('git log -1 --pretty=format:"%H %cd"', $output);
$eTag   = substr($output[0], 0, strpos($output[0], ' '));
header('ETag: "' . $eTag . '"');
header("Cache-Control: public, max-age=3600");

if(empty($_file)) {
    function sanitize_html_output($buffer) {
        $search = array(
            '/\>[^\S ]+/s',     // strip whitespaces after tags, except space
            '/[^\S ]+\</s',     // strip whitespaces before tags, except space
            '/(\s)+/s',         // shorten multiple whitespace sequences
            '/<!--(.|\s)*?-->/' // Remove HTML comments
        );
        $replace = array(
            '>',
            '<',
            '\\1',
            ''
        );
        $buffer = preg_replace($search, $replace, $buffer);

        return $buffer;
    }

    ob_start("sanitize_html_output");
    include('index.html');
    ob_end_flush();
    die();
}
if($_file === 'mission-list') {
    header("Content-type: text/javascript");
    header("Content-Disposition: inline; filename=\"missions.json\"");
    $content = file_get_contents('missions.json');
    print json_encode(json_decode($content));
    die();
}
