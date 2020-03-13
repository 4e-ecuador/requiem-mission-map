<?php

require __DIR__ . '/vendor/autoload.php';

$_file   = filter_input(INPUT_GET, 'f', FILTER_SANITIZE_STRING);

$_output = new sgr\output();
$_header = new sgr\header();

if(empty($_file)) {
    $html = file_get_contents('index.html');
    print $_output->sanitizeHtml($html, $_header->getETag());
    die();
}
switch ($_file) {
    case 'mission-list':
        $_output->outputJson('missions.json');
        break;
    case 'js':
        $_output->outputJs();
        break;
    case 'css':
        $_output->outputCss();
        break;
}
die();
