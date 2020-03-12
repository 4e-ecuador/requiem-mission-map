<?php

require __DIR__ . '/vendor/autoload.php';

$_file = filter_input(INPUT_GET, 'f', FILTER_SANITIZE_STRING);

$_output = new sgr/output();
$_header = new sgr/header();

if(empty($_file)) {
    $html = file_get_contents('index.html');
    print $_output->sanitizeHtml($html, $_header->getETag());
    die();
}

if($_file === 'mission-list') {
    $_output->outputJson('missions.json');
    die();
}
