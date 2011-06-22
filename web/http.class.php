<?
class HTTP
{
    // This will return the data from the current URL, using cache as necessary
    ////////////////////////////////////////////////////////////////////////////////////////////////
    public static function getResponse($uri)
    {
        global $SITE_CONFIG;
        
        $cache_file = $SITE_CONFIG['cache_folder']."/".sha1($uri);
                
        // If caching enabled.
        if ($SITE_CONFIG['cache_enabled'])
        {
            // If the cache file exists, and is not expired
            if (file_exists($cache_file) && (filectime($cache_file)+$SITE_CONFIG['cache_time'] >= time()))
            {
                $handle = fopen($cache_file,"r");
                $data   = fread($handle, filesize($cache_file));
                fclose($handle);
                return $data;
            }
        }
    
        $response = file_get_contents($uri);
        
        // Store in cache if enabled
        if ($SITE_CONFIG['cache_enabled'])
        {
            $handle = fopen($cache_file, "w");
            fwrite($handle, $response);
            fclose($handle);
        }
        
        return $response;    
    }
}
?>
