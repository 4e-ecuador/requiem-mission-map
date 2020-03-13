<?php

namespace sgr;

use DateTime;

class header
{
    private $_eTag;
    private $_lastModDate;

    public function __construct()
    {
        $gitLogString = $this->getGitLogString();

        $gitCommitHash        = substr($gitLogString, 0, strpos($gitLogString, ' '));
        $latestCommitDateTime = trim(substr($gitLogString, strpos($gitLogString, ' ')));

        // iso8601 date
        $lastModifiedDate = DateTime::createFromFormat('c', $latestCommitDateTime);
        if($lastModifiedDate) {
            $lastModifiedDate->setTimezone(new DateTimeZone('GMT'));
            // <day-name>, <day> <month> <year> <hour>:<minute>:<second>
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified
            header("Last-Modified: " . $lastModifiedDate->format('D, d M Y H:i:s') . " GMT");
        }

        header('ETag: "' . $gitCommitHash . '"');
        header("Cache-Control: public, max-age=3600");

        $this->_eTag        = $gitCommitHash;
        $this->_lastModDate = $lastModifiedDate;
    }

    private function getGitLogString() : string
    {
        $output = [];
        exec('git log -1 --pretty=format:"%H %cd" --date=iso8601-strict', $output);
        if(count($output) >= 1) {

            return $output[0];
        }
        return '';
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
