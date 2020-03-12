<?php

namespace sgr;

use MatthiasMullie\Minify;

class output
{

    public function sanitizeHtml($buffer, $eTag)
    {
        $search = array(
            '/\>[^\S ]+/s',      // strip whitespaces after tags, except space
            '/[^\S ]+\</s',      // strip whitespaces before tags, except space
            '/(\s)+/s',          // shorten multiple whitespace sequences
            '/<!--(.|\s)*?-->/', // Remove HTML comments
            '/{dynamicVersion}/',
            '/(\s)+/s',          // shorten multiple whitespace sequences
        );
        $replace = array(
            '>',
            '<',
            '\\1',
            '',
            $eTag,
            '\\1'
        );
        $buffer = preg_replace($search, $replace, $buffer);

        return $buffer;
    }

    public function outputJson($filename)
    {
        $this->javascriptHeader($filename);

        $content = file_get_contents($filename);

        print json_encode(json_decode($content));
    }

    public function outputJs($clearCache = false)
    {
        $sourcePath = 'js/requiem-munich.js';
        $minifiedPath = 'js/requiem-munich.min.js';
        if(!file_exists($minifiedPath) || $clearCache) {
            $minifier = new Minify\JS($sourcePath);
            if(file_exists($minifiedPath)) {
                unlink($minifiedPath);
            }
            $minifier->minify($minifiedPath);
        }
        $this->javascriptHeader('requiem-munich.min.js');

        print file_get_contents($minifiedPath);
    }

    public function outputCss($clearCache = false)
    {
        $sourcePath = 'css/requiem-munich.css';
        $minifiedPath = 'css/requiem-munich.min.css';
        if(!file_exists($minifiedPath) || $clearCache) {
            $minifier = new Minify\CSS($sourcePath);
            if(file_exists($minifiedPath)) {
                unlink($minifiedPath);
            }
            $minifier->minify($minifiedPath);
        }
        $this->cssHeader('requiem-munich.min.js');

        print file_get_contents($minifiedPath);
    }

    private function jsonHeader($filename)
    {
        header("Content-type: application/json");
        $this->fileHeader($filename);
    }

    private function cssHeader($filename)
    {
        header("Content-type: text/css");
        $this->fileHeader($filename);
    }

    private function javascriptHeader($filename)
    {
        header("Content-type: text/javascript");
        $this->fileHeader($filename);
    }

    private function fileHeader($filename)
    {
        header("Content-Disposition: inline; filename=\"" . $filename . "\"");
    }
}
