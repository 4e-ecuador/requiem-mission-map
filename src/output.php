<?php

namespace sgr;

class output
{

    public function sanitizeHtml($buffer, $eTag)
    {
        $search = array(
            '/\>[^\S ]+/s',      // strip whitespaces after tags, except space
            '/[^\S ]+\</s',      // strip whitespaces before tags, except space
            '/(\s)+/s',          // shorten multiple whitespace sequences
            '/<!--(.|\s)*?-->/', // Remove HTML comments
            '{dynamicVersion}'
        );
        $replace = array(
            '>',
            '<',
            '\\1',
            '',
            $eTag
        );
        $buffer = preg_replace($search, $replace, $buffer);

        return $buffer;
    }

    public function outputJson($filename)
    {
        header("Content-type: application/json");
        header("Content-Disposition: inline; filename=\"" . $filename . "\"");

        $content = file_get_contents($filename);

        print json_encode(json_decode($content));
    }

}
