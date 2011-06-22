<?
////////////////////////////////////////////////////////////////////////////////////////////////////
// LJ Support Screen Scraper
// Author : Rich Adams (wblinks.com)
////////////////////////////////////////////////////////////////////////////////////////////////////

// Includes
////////////////////////////////////////////////////////////////////////////////////////////////////
include_once("http.class.php");
include_once("config.php");

// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to remove <b> and </b> HTML tags.
function cleanText($s)
{
	$s = str_replace("<b>","",$s);
	$s = str_replace("</b>","",$s);
	return $s;
}

// This will display an error
function error()
{
    echo "ERROR: Unable to retrieve."; exit();
}

// This will get the counts we need
function getCounts($cat)
{
    $url     = "http://www.livejournal.com/support/help.bml?sort=date&state=&cat=".$cat."&usescheme=lynx";
    $content = HTTP::getResponse($url);

    // Extract <b> tags
    preg_match_all("/<b>.*?<\/b>/", $content, $b);

    if (count($b) < 1) { error(); }
    if (count($b[0]) < 4) { error(); }

    $result    = array();
    $result[0] = cleanText($b[0][0]);
    $result[1] = cleanText($b[0][1]);
    $result[2] = cleanText($b[0][2]);
    $result[3] = cleanText($b[0][3]);
    return $result;
}

// Input
////////////////////////////////////////////////////////////////////////////////////////////////////
$cat = "styles"; // Default is styles
if (isset($_GET['cat'])) { $cat = strip_tags($_GET['cat']); }

// Now do the actual scraping
////////////////////////////////////////////////////////////////////////////////////////////////////
$counts = getCounts($cat);

// If it's the public count we're doing we need to remove issues count.
$issues_counts = array(0,0,0,0);
if ($cat == "_nonprivate") { $issues_counts = getCounts("issues"); }	

// Output
////////////////////////////////////////////////////////////////////////////////////////////////////
// Order is OPEN, GREEN, SNH, YELLOW
echo ($counts[3]-$issues_counts[3])."\n";
echo ($counts[0]-$issues_counts[0])."\n";
echo ($counts[1]-$issues_counts[1])."\n";
echo ($counts[2]-$issues_counts[2])."\n";
?>
