<?php

namespace sgr;

use DateTime;

class header
{
    private $_eTag;
    private $_lastModDate;

    public function __construct() {
        $output = [];
        exec('git log -1 --pretty=format:"%H %cd" --date=iso8601-strict', $output);
        $eTag = substr($output[0], 0, strpos($output[0], ' '));
        $latestCommitDateTime = trim(substr($output[0], strpos($output[0], ' ')));

        // iso8601 date
        $lastModifiedDate = DateTime::createFromFormat('c', $latestCommitDateTime);
        if($lastModifiedDate) {
            $lastModifiedDate->setTimezone(new DateTimeZone('GMT'));
            // <day-name>, <day> <month> <year> <hour>:<minute>:<second>
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified
            header("Last-Modified: " . $lastModifiedDate->format('D, d M Y H:i:s') . " GMT");
        }

        header('ETag: "' . $eTag . '"');
        header("Cache-Control: public, max-age=3600");

        $this->_eTag        = $eTag;
        $this->_lastModDate = $lastModifiedDate;
    }

    public function getLastModifiedDate() : DateTime
    {
        return $this->_lastModDate;
    }

    public function getETag() : string
    {
        return $this->_eTag;
    }
}
