// LiveJournal Support Toolbar
// Rich Adams (http://wblinks.com)

// Category Defs
////////////////////////////////////////////////////////////////////////////////////////////////////
var ljst_cat_user     = new Array("Communities", "Entries", "G/Unk", "Issues", "Mobile", "ScrapBook", "Styles", "Syndication", "Userpics", "Web", "(All Public)", "Documentation", "Russian", "Independent");
var ljst_cat_real     = new Array("communities", "entries", "general", "issues", "mobile", "scrapbook", "styles", "syn", "userpics", "web-ui", "_nonprivate", "docs", "russian", "independent");
var ljst_cat_default  = 10; // (All)
var ljst_cat_pref     = "extensions.ljs_toolbar.cat";
var ljst_cat_limit    = new Array(10,20,20,100,10,10,20,10,10,15,200,999,999,999);

// Variable Decls
////////////////////////////////////////////////////////////////////////////////////////////////////
var ljst_pref_manager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var ljst_loading      = false; // By default
var ljst_firsttime    = true;

// URLs
////////////////////////////////////////////////////////////////////////////////////////////////////
var LJST_URL_OVERRIDES     = "http://www.livejournal.com/support/see_overrides.bml?user=";
var LJST_URL_LAYER_ID      = "http://www.livejournal.com/customize/advanced/layerbrowse.bml?id=";
var LJST_URL_LAYER_USER    = "http://www.livejournal.com/customize/advanced/layers.bml?user=";
var LJST_URL_MEMCACHE      = "http://www.livejournal.com/admin/memcache_purge.bml?username=";
var LJST_URL_STYLE_DEBUG   = "http://www.livejournal.com/admin/support/style_debug.bml?user=";
var LJST_URL_STYLE_INFO    = "http://www.livejournal.com/admin/styleinfo.bml?user=";
var LJST_URL_REQUEST       = "http://www.livejournal.com/support/see_request.bml?id=";
var LJST_URL_PRIVS         = "http://www.livejournal.com/admin/priv/index.bml?user=";
var LJST_URL_EDIT_BBB      = "http://www.livejournal.com/admin/fileedit/index.bml?file=support-currentproblems&w=1";
var LJST_URL_EDIT_FULL_BBB = "http://www.livejournal.com/admin/fileedit/index.bml?file=support-currentproblems-full&w=1";
var LJST_URL_OPEN          = "http://www.livejournal.com/support/help.bml?sort=date&state=&cat=";
var LJST_URL_GREEN         = "http://www.livejournal.com/support/help.bml?sort=date&state=green&cat=";
var LJST_URL_CLOSED        = "http://www.livejournal.com/support/help.bml?sort=date&state=closed&cat=";
var LJST_URL_YOUREPLIED    = "http://www.livejournal.com/support/help.bml?sort=date&state=youreplied&cat=";
var LJST_URL_API           = "http://lj.wblinks.com/ljs_toolbar.php?cat=";
var LJST_URL_RECENT_TOUCH  = "http://www.livejournal.com/admin/support/touches.bml?user=";
var LJST_URL_PROFILE       = "http://www.livejournal.com/userinfo.bml?mode=full&user=";
var LJST_URL_FAQ           = "http://www.livejournal.com/support/faqbrowse.bml?view=full&faqid=";
var LJST_URL_REQ_HISTORY   = "http://www.livejournal.com/support/history.bml?user=";
var LJST_URL_STAT_HISTORY  = "http://www.livejournal.com/admin/statushistory.bml?user=";
var LJST_URL_CLUSTER_STAT  = "http://www.livejournal.com/admin/clusterstatus.bml";
var LJST_URL_OFFSITE_STAT  = "http://status.livejournal.org";
var LJST_URL_DEPT_STATS    = "http://www.livejournal.com/admin/support/dept.bml";
var LJST_URL_FOG_BUGZ      = "http://www.livejournal.com/admin/support/bugreport.bml";
var LJST_URL_ADMIN_CONSOLE = "http://www.livejournal.com/admin/console/";
var LJST_URL_BETA          = "http://www.livejournal.com/betatest.bml";
var LJST_URL_WIKI          = "http://wiki.livejournal.org";
var LJST_URL_IRC           = "http://support.livejournal.org/cgi-bin/irc.cgi";
var LJST_URL_FAQ_SEARCH    = "http://www.livejournal.com/support/faqsearch.bml";
var LJST_URL_REQ_SEARCH    = "http://support.livejournal.org/cgi-bin/ssearch";
var LJST_URL_COM_SETTINGS  = "http://www.livejournal.com/community/settings.bml?comm=";
var LJST_URL_ENTRY_PROPS   = "http://www.livejournal.com/admin/entryprops.bml"
var LJST_URL_ENTRY_FRDR    = "http://www.livejournal.com/directory.bml?Widget%5BGeoSearchLocation%5D_country=&Widget%5BGeoSearchLocation%5D_stateother=&Widget%5BGeoSearchLocation%5D_city=&ut_days=14&age_min=&age_max=&int_like=&fr_user=&opt_format=pics&opt_pagesize=100&start_search=1&fro_user=";
var LJST_URL_ENTRIES_WGW   = "http://community.livejournal.com/support_entries/4262.html";
var LJST_URL_EMAIL_GQ_LOG  = "http://www.livejournal.com/tools/recent_emailposts.bml?user=";
var LJST_URL_SPIN_VOX_LOG  = "http://www.livejournal.com/admin/spinvoxlog.bml?user=";
var LJST_URL_SCRAPBOOK     = "http://pics.livejournal.com/";
var LJST_URL_FEED_VALID    = "http://validator.w3.org/feed/";
var LJST_URL_USERPICS      = "http://www.livejournal.com/allpics.bml?inactive=1&user=";
var LJST_URL_BABELFISH     = "http://babelfish.altavista.com/";
var LJST_URL_JIRA          = "http://jira.sup.com/";

// Init
////////////////////////////////////////////////////////////////////////////////////////////////////
// Attach refresh to onload event
window.addEventListener("load", function(e) { ljst_reload(); }, false);

// Set to auto-refesh every 30 seconds
setInterval("ljst_reload()", 30000);

// URL functions
////////////////////////////////////////////////////////////////////////////////////////////////////
// Generic function to load a URL
function ljst_loadURL(url)
{
    // Open it in a new tab
    var _browser         = document.getElementById("content");
    var _tab             = _browser.addTab(url);
    _browser.selectedTab = _tab;
}

// Generic function to get an input from the user and goto a URL appending the input
function ljst_loadURLParam(url, paramName)
{
    var _input = prompt(paramName,"");
    if (_input != null)
    {
        ljst_loadURL(url + _input);
    }
}

// Category Setter/Getter
////////////////////////////////////////////////////////////////////////////////////////////////////
function ljst_getCat()
{    
    // If pref doesn't exist, use the default
    ljst_cat = (ljst_pref_manager.prefHasUserValue(ljst_cat_pref)) ? ljst_pref_manager.getIntPref(ljst_cat_pref) : ljst_cat_default;

    // Update labels
    ljst_updateCatLabels();
}

function ljst_setCat(cat)
{
    // Set the pref
    ljst_pref_manager.setIntPref(ljst_cat_pref, cat);
    ljst_cat = cat;
    
    // Update labels
    ljst_updateCatLabels();
    
    // Show loading animation
    ljst_firsttime = true;
    
    // Reload information
    ljst_reload();
}

// This will update any labels that need changing when we change cat
function ljst_updateCatLabels()
{
    var _label = document.getElementById("ljst-cat");
    _label.setAttribute("label",ljst_cat_user[ljst_cat]);
    
    _label = document.getElementById("ljst-open");
    _label.setAttribute("tooltiptext", ljst_cat_user[ljst_cat] + " Open");
    _label = document.getElementById("ljst-green");
    _label.setAttribute("tooltiptext", ljst_cat_user[ljst_cat] + " Green");
    _label = document.getElementById("ljst-closed");
    _label.setAttribute("tooltiptext", ljst_cat_user[ljst_cat] + " Closed");
    _label = document.getElementById("ljst-youreplied");
    _label.setAttribute("tooltiptext", "You Replied in " + ljst_cat_user[ljst_cat]);
    
    ljst_refreshCatLinks();
}

// Loading Animation
////////////////////////////////////////////////////////////////////////////////////////////////////
function ljst_toggleLoading()
{
    var _open    = document.getElementById("ljst-open");
    var _green   = document.getElementById("ljst-green");
    var _loading = document.getElementById("ljst-loading");
    
    // Only do this on a first time load
    if (ljst_firsttime)
    {
        _open.style.display    = (ljst_loading) ? "inline" : "none";
        _green.style.display   = (ljst_loading) ? "inline" : "none";
        _loading.style.display = (ljst_loading) ? "none" : "inline";
        
        if (ljst_loading) { ljst_firsttime = false; }
        
        ljst_loading = (ljst_loading) ? false : true;
    }
}

// Ajax Call/Callback
////////////////////////////////////////////////////////////////////////////////////////////////////
function ljst_reload()
{
    // Get the cat
    ljst_getCat();
    
    // Loading Gif
    ljst_toggleLoading();
    
    // Do the AJAX request
    var self     = this;
    var _xmlhttp = false;    
    var _url     = LJST_URL_API + ljst_cat_real[ljst_cat];
    
    self._xmlhttp = new XMLHttpRequest();
    self._xmlhttp.open('GET', _url, true);
    
    self._xmlhttp.onreadystatechange = function() {
        if (self._xmlhttp.readyState == 4) {
            ljst_ajax_callback(self._xmlhttp.responseText);
        }
    }
    
    self._xmlhttp.send(null);
}

// Strip the information from the response, and load into correct elements.
function ljst_ajax_callback(text)
{    
    var _array  = text.split(/\n/);
    var _open   = document.getElementById("ljst-open");
    var _green  = document.getElementById("ljst-green");
    
    // Stop animation
    ljst_toggleLoading();
    
    // If we actually got a response
    if (text.length)
    {        
        _open.setAttribute("label",_array[0]);
        _green.setAttribute("label",_array[1]);
        
        var _total = parseInt(_array[1]) + parseInt(_array[2]);
        if (_array[2] != "0")
        {
            _green.setAttribute("label",_total + " (" + _array[1] + "+" + _array[2] + " SNH)");
        }
        
        // Highlight red if over category limit
        _green.style.color = (_total >= ljst_cat_limit[ljst_cat]) ? 'red' : 'black';
        
    }
    else
    {
        // Timeout or no repsonse
        _open.setAttribute("label", "-");
        _green.setAttrivute("label", "-");
    }
}

// Category Links
////////////////////////////////////////////////////////////////////////////////////////////////////
function ljst_removeAllCatLinks()
{
    for (var i = 0; i < ljst_cat_real.length; i++)
    {
        var _obj = document.getElementById("ljst-" + ljst_cat_real[i]);
        if (null == _obj) { continue; }
        if ("undefined" == typeof(_obj)) { continue; }
        _obj.style.display = "none";
    }
}

function ljst_showCatLinks()
{
    var _obj = document.getElementById("ljst-" + ljst_cat_real[ljst_cat]);
    if (null != _obj && typeof(_obj) != "undefined")
    {
        _obj.style.display = "inline";
    }
}

function ljst_refreshCatLinks()
{
    ljst_removeAllCatLinks();
    ljst_showCatLinks();
}

// URL Functions
////////////////////////////////////////////////////////////////////////////////////////////////////
// URLs needing input from user
function ljst_viewOverrides()      { ljst_loadURLParam(LJST_URL_OVERRIDES,"Enter the username : "); }
function ljst_viewLayerId()        { ljst_loadURLParam(LJST_URL_LAYER_ID,"Enter the Layer ID : "); }
function ljst_viewLayerUser()      { ljst_loadURLParam(LJST_URL_LAYER_USER,"Enter the username : "); }
function ljst_purgeMemCache()      { ljst_loadURLParam(LJST_URL_MEMCACHE,"Enter the username : "); }
function ljst_viewStyleDebug()     { ljst_loadURLParam(LJST_URL_STYLE_DEBUG,"Enter the username : "); }
function ljst_loadRequest()        { ljst_loadURLParam(LJST_URL_REQUEST,"Request #"); }
function ljst_viewPrivs()          { ljst_loadURLParam(LJST_URL_PRIVS,"Enter the username : "); }
function ljst_recentTouches()      { ljst_loadURLParam(LJST_URL_RECENT_TOUCH, "Enter the username : "); }
function ljst_viewProfile()        { ljst_loadURLParam(LJST_URL_PROFILE, "Enter the username : "); }
function ljst_loadFAQ()            { ljst_loadURLParam(LJST_URL_FAQ, "FAQ #"); }
function ljst_viewRequestHistory() { ljst_loadURLParam(LJST_URL_REQ_HISTORY,"Enter the username : "); }
function ljst_viewStatusHistory()  { ljst_loadURLParam(LJST_URL_STAT_HISTORY,"Enter the username : "); }
function ljst_viewStyleInfo()      { ljst_loadURLParam(LJST_URL_STYLE_INFO,"Enter the username : "); }
function ljst_viewCommSettings()   { ljst_loadURLParam(LJST_URL_COM_SETTINGS,"Enter the community name : "); }
function ljst_viewEntryDSearch()   { ljst_loadURLParam(LJST_URL_ENTRY_FRDR,"Enter the username : "); }
function ljst_viewEmailGWLog()     { ljst_loadURLParam(LJST_URL_EMAIL_GQ_LOG,"Enter the username : "); }
function ljst_viewSpinVoxLog()     { ljst_loadURLParam(LJST_URL_SPIN_VOX_LOG,"Enter the username : "); }
function ljst_viewScrapBook()      { ljst_loadURLParam(LJST_URL_SCRAPBOOK,"Enter the username : "); }
function ljst_viewUserpics()       { ljst_loadURLParam(LJST_URL_USERPICS,"Enter the username : "); }

// Stand-alone URLs
function ljst_editBBB()            { ljst_loadURL(LJST_URL_EDIT_BBB); }
function ljst_loadOpen()           { ljst_loadURL(LJST_URL_OPEN + ljst_cat_real[ljst_cat]); }
function ljst_loadGreen()          { ljst_loadURL(LJST_URL_GREEN + ljst_cat_real[ljst_cat]); }
function ljst_loadClosed()         { ljst_loadURL(LJST_URL_CLOSED + ljst_cat_real[ljst_cat]); }
function ljst_loadYouReplied()     { ljst_loadURL(LJST_URL_YOUREPLIED + ljst_cat_real[ljst_cat]); }
function ljst_viewClusterStatus()  { ljst_loadURL(LJST_URL_CLUSTER_STAT); }
function ljst_viewOffsiteStatus()  { ljst_loadURL(LJST_URL_OFFSITE_STAT); }
function ljst_viewDeptStats()      { ljst_loadURL(LJST_URL_DEPT_STATS); }
function ljst_gotoIRC()            { ljst_loadURL(LJST_URL_IRC); }
function ljst_gotoFogBugz()        { ljst_loadURL(LJST_URL_FOG_BUGZ); }
function ljst_gotoAdminConsole()   { ljst_loadURL(LJST_URL_ADMIN_CONSOLE); }
function ljst_gotoBetaTest()       { ljst_loadURL(LJST_URL_BETA); }
function ljst_viewSupportWiki()    { ljst_loadURL(LJST_URL_WIKI); }
function ljst_searchFAQ()          { ljst_loadURL(LJST_URL_FAQ_SEARCH); }
function ljst_searchRequest()      { ljst_loadURL(LJST_URL_REQ_SEARCH); }
function ljst_loadIRC()            { ljst_loadURL(LJST_URL_IRC); }
function ljst_loadEntryProps()     { ljst_loadURL(LJST_URL_ENTRY_PROPS); }
function ljst_loadEntryWGW()       { ljst_loadURL(LJST_URL_ENTRIES_WGW); }
function ljst_gotoFeedValid()      { ljst_loadURL(LJST_URL_FEED_VALID); }
function ljst_gotoBabelfish()      { ljst_loadURL(LJST_URL_BABELFISH); }
function ljst_gotoJira()           { ljst_loadURL(LJST_URL_JIRA); }
