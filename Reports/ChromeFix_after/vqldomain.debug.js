//! vqldomain.debug.js
//

(function() {

Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tab.TabResources

tab.TabResources = function tab_TabResources() {
}
tab.TabResources.getResourceName = function tab_TabResources$getResourceName(filePath) {
    return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
}
tab.TabResources.lookupResourceAlias = function tab_TabResources$lookupResourceAlias(id) {
    return (Object.keyExists(tab.TabResources._resourceMap, id)) ? tab.TabResources._resourceMap[id] : '';
}
tab.TabResources.lookupFullResourceAlias = function tab_TabResources$lookupFullResourceAlias(id) {
    var parts = (id).split('/');
    var key = (parts.length > 0) ? parts[parts.length - 1] : id;
    return tab.TabResources.lookupResourceAlias(key);
}
tab.TabResources.lookupTabRes = function tab_TabResources$lookupTabRes(id) {
    return tab.TabResources.lookupResourceAlias(id);
}
tab.TabResources.lookupDefaultTabRes = function tab_TabResources$lookupDefaultTabRes(id) {
    return (':/' + tsConfig.locale + '/' + tab.TabResources.lookupResourceAlias(id));
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizUriType

tab.VizUriType = function() { };
tab.VizUriType.prototype = {
    invalid: 0, 
    viewing: 1, 
    authoring: 2, 
    authorNewWorkbook: 3, 
    admin: 4, 
    sharedView: 5
}
tab.VizUriType.registerEnum('tab.VizUriType', false);


////////////////////////////////////////////////////////////////////////////////
// tab.VizUriModel

tab.VizUriModel = function tab_VizUriModel(location) {
    this._vizUriType = 0;
    if (!Object.getKeyCount(tab.VizUriModel._uriTypeToUriTypeString)) {
        tab.VizUriModel._initializeUriTypeToUriTypeStringMap();
    }
    if (ss.isValue(location)) {
        this._fillVizUriModel(location);
    }
}
tab.VizUriModel.createForCurrentWindowLocation = function tab_VizUriModel$createForCurrentWindowLocation(window) {
    if (tab.MiscUtil.isNullOrEmpty(window)) {
        window = tabBootstrap.Utility.get_locationWindow();
    }
    var uriModel = new tab.VizUriModel(tab.WindowHelper.getLocation(window));
    return uriModel;
}
tab.VizUriModel.createForViewingSheet = function tab_VizUriModel$createForViewingSheet(repositoryUrl) {
    var vizUriModel = tab.VizUriModel._createForCurrentWindowLocationConstants();
    vizUriModel._vizUriType = 1;
    var repoPathObject = new tab.RepoPathObject(repositoryUrl);
    vizUriModel._workbookId = repoPathObject.get_workbookId();
    vizUriModel._sheetId = repoPathObject.get_sheetId();
    vizUriModel._customizedView = repoPathObject.get_customizedView();
    vizUriModel._authoringSheetName = '';
    return vizUriModel;
}
tab.VizUriModel.createForCurrentWindowLocationAndVizState = function tab_VizUriModel$createForCurrentWindowLocationAndVizState(repoUrl, currentSheetName) {
    var vizUriModel = tab.VizUriModel.createForCurrentWindowLocation();
    var repoPathObject = new tab.RepoPathObject(repoUrl);
    vizUriModel._workbookId = repoPathObject.get_workbookId();
    vizUriModel._sheetId = repoPathObject.get_sheetId();
    vizUriModel._customizedView = repoPathObject.get_customizedView();
    vizUriModel._authoringSheetName = currentSheetName;
    return vizUriModel;
}
tab.VizUriModel.createForAuthoringUnpublishedSheet = function tab_VizUriModel$createForAuthoringUnpublishedSheet(repoUrl, authoringSheetName) {
    var vizUriModel = tab.VizUriModel.createForAuthoringPublishedSheet(repoUrl);
    vizUriModel._authoringSheetName = authoringSheetName;
    return vizUriModel;
}
tab.VizUriModel.createForAuthoringPublishedSheet = function tab_VizUriModel$createForAuthoringPublishedSheet(repoUrl) {
    var vizUriModel = tab.VizUriModel._createForCurrentWindowLocationConstants();
    vizUriModel._vizUriType = 2;
    var repoPathObject = new tab.RepoPathObject(repoUrl);
    vizUriModel._workbookId = repoPathObject.get_workbookId();
    vizUriModel._sheetId = repoPathObject.get_sheetId();
    vizUriModel._authoringSheetName = '';
    return vizUriModel;
}
tab.VizUriModel.createInvalid = function tab_VizUriModel$createInvalid() {
    var vizUriModel = new tab.VizUriModel();
    vizUriModel._vizUriType = 0;
    return vizUriModel;
}
tab.VizUriModel._initializeUriTypeToUriTypeStringMap = function tab_VizUriModel$_initializeUriTypeToUriTypeStringMap() {
    var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(tab.VizUriModel._uriTypeStringToUriType));
    while ($enum1.moveNext()) {
        var uriTypeString = $enum1.current;
        tab.VizUriModel._uriTypeToUriTypeString[tab.VizUriModel._uriTypeStringToUriType[uriTypeString]] = uriTypeString;
    }
}
tab.VizUriModel._createForCurrentWindowLocationConstants = function tab_VizUriModel$_createForCurrentWindowLocationConstants(window) {
    if (tab.MiscUtil.isNullOrEmpty(window)) {
        window = tabBootstrap.Utility.get_locationWindow();
    }
    var location = tab.WindowHelper.getLocation(window);
    var vizUriModel = new tab.VizUriModel();
    vizUriModel._queryParams = tab.VizUriModel._getRelevantQueryParameters(location);
    vizUriModel._hash = location.hash;
    vizUriModel._origin = tab.BrowserSupport.getOrigin(location);
    return vizUriModel;
}
tab.VizUriModel._getRelevantQueryParameters = function tab_VizUriModel$_getRelevantQueryParameters(location) {
    var queryParams = tab.MiscUtil.getUriQueryParameters(location.href);
    var $enum1 = ss.IEnumerator.getEnumerator(tab.VizUriModel._ignoredParams);
    while ($enum1.moveNext()) {
        var ignoredParam = $enum1.current;
        if (Object.keyExists(queryParams, ignoredParam)) {
            delete queryParams[ignoredParam];
        }
    }
    return queryParams;
}
tab.VizUriModel.encodeUserName = function tab_VizUriModel$encodeUserName(username) {
    var encoded = tab.MiscUtil.percentEncode(username.replaceAll('/', '%2F'), tab.VizUriModel._usernameValidChars);
    return encoded.replaceAll('%40', '@');
}
tab.VizUriModel.prototype = {
    explicitNotGuest: false,
    _workbookId: '',
    _sheetId: '',
    _authoringSheetName: '',
    _queryParams: null,
    _customizedView: '',
    _hash: '',
    _origin: '',
    
    get_isViewingUri: function tab_VizUriModel$get_isViewingUri() {
        return this._vizUriType === 1;
    },
    
    get_isAuthoringUri: function tab_VizUriModel$get_isAuthoringUri() {
        return this._vizUriType === 2;
    },
    
    get_isAuthorNewWorkbookUri: function tab_VizUriModel$get_isAuthorNewWorkbookUri() {
        return this._vizUriType === 3;
    },
    
    get_isInvalid: function tab_VizUriModel$get_isInvalid() {
        return !this._vizUriType;
    },
    
    get_isAdminUri: function tab_VizUriModel$get_isAdminUri() {
        return this._vizUriType === 4;
    },
    
    get_isSharedViewUri: function tab_VizUriModel$get_isSharedViewUri() {
        return this._vizUriType === 5;
    },
    
    get_absoluteUri: function tab_VizUriModel$get_absoluteUri() {
        return this._getAbsoluteUri();
    },
    
    get_uri: function tab_VizUriModel$get_uri() {
        return this._getRelativeUri();
    },
    
    get_path: function tab_VizUriModel$get_path() {
        return this._getPath();
    },
    
    get_queryParams: function tab_VizUriModel$get_queryParams() {
        return this._queryParams;
    },
    
    get_retry: function tab_VizUriModel$get_retry() {
        return this._getBooleanQueryParam(':retry');
    },
    set_retry: function tab_VizUriModel$set_retry(value) {
        this._setBooleanQueryParam(':retry', value);
        return value;
    },
    
    get_originalView: function tab_VizUriModel$get_originalView() {
        return this._getBooleanQueryParam(':original_view');
    },
    set_originalView: function tab_VizUriModel$set_originalView(value) {
        this._setBooleanQueryParam(':original_view', value);
        if (value) {
            this._customizedView = '';
        }
        return value;
    },
    
    get_showSaveAs: function tab_VizUriModel$get_showSaveAs() {
        return this._getBooleanQueryParam(':showSaveAs');
    },
    set_showSaveAs: function tab_VizUriModel$set_showSaveAs(value) {
        this._setBooleanQueryParam(':showSaveAs', value);
        return value;
    },
    
    _getBooleanQueryParam: function tab_VizUriModel$_getBooleanQueryParam(key) {
        return Object.keyExists(this._queryParams, key) && tab.MiscUtil.toBoolean(this._queryParams[key][0], false);
    },
    
    _setBooleanQueryParam: function tab_VizUriModel$_setBooleanQueryParam(key, val) {
        if (val) {
            this._queryParams[key] = [];
            this._queryParams[key].add('yes');
        }
        else {
            delete this._queryParams[key];
        }
    },
    
    removeQueryParam: function tab_VizUriModel$removeQueryParam(queryParam) {
        delete this._queryParams[queryParam];
        return this;
    },
    
    removeAllQueryParams: function tab_VizUriModel$removeAllQueryParams() {
        Object.clearKeys(this._queryParams);
        return this;
    },
    
    fullPageLoad: function tab_VizUriModel$fullPageLoad(window) {
        window = window || tabBootstrap.Utility.get_locationWindow();
        this.setWindowLocation();
        window.setTimeout(function() {
            tab.WindowHelper.reload(window, true);
        }, 300);
    },
    
    replaceState: function tab_VizUriModel$replaceState(window) {
        if (tab.MiscUtil.isNullOrEmpty(window)) {
            window = tabBootstrap.Utility.get_locationWindow();
        }
        tab.HistoryUtil.replaceState(window, {}, '', this.get_uri());
    },
    
    setWindowLocation: function tab_VizUriModel$setWindowLocation(window) {
        if (tab.MiscUtil.isNullOrEmpty(window)) {
            window = tabBootstrap.Utility.get_locationWindow();
        }
        tab.WindowHelper.setLocationHref(window, this.get_uri());
    },
    
    setTopWindowLocation: function tab_VizUriModel$setTopWindowLocation() {
        this.setWindowLocation(window.top);
    },
    
    matchesCurrentWindowLocationUri: function tab_VizUriModel$matchesCurrentWindowLocationUri(window) {
        return this.get_uri() === tab.VizUriModel.createForCurrentWindowLocation(window).get_uri();
    },
    
    matchesCurrentWindowLocationAbsoluteUri: function tab_VizUriModel$matchesCurrentWindowLocationAbsoluteUri() {
        return this.get_absoluteUri() === tab.VizUriModel.createForCurrentWindowLocation().get_absoluteUri();
    },
    
    matchesCurrentWindowLocationPath: function tab_VizUriModel$matchesCurrentWindowLocationPath(window) {
        return this.get_path() === tab.VizUriModel.createForCurrentWindowLocation(window).get_path();
    },
    
    removeHash: function tab_VizUriModel$removeHash() {
        this._hash = '';
    },
    
    _getAbsoluteUri: function tab_VizUriModel$_getAbsoluteUri() {
        var relativeUri = this._getRelativeUri();
        var absoluteUri = this._origin;
        if (!relativeUri.startsWith('/')) {
            absoluteUri += '/';
        }
        absoluteUri += relativeUri;
        return absoluteUri;
    },
    
    _getRelativeUri: function tab_VizUriModel$_getRelativeUri() {
        var uri = new ss.StringBuilder();
        uri.append(this._getPath());
        var queryParamsString = tab.MiscUtil.replaceUriQueryParameters('', this._queryParams);
        if (!tab.MiscUtil.isNullOrEmpty(queryParamsString)) {
            uri.append(queryParamsString);
        }
        uri.append(this._getHash());
        return uri.toString();
    },
    
    _getPath: function tab_VizUriModel$_getPath() {
        var uri = new ss.StringBuilder();
        if (!tab.MiscUtil.isNullOrEmpty(tsConfig.site_root) && !this.get_isAdminUri()) {
            uri.append(tsConfig.site_root);
        }
        uri.append('/');
        uri.append(this._getUriModuleStringFromUroModuleName(this._vizUriType));
        if (this._vizUriType === 2) {
            uri.append('/');
            uri.append(this._workbookId);
            uri.append('/');
            uri.append(this._sheetId);
            if (!tab.MiscUtil.isNullOrEmpty(this._authoringSheetName)) {
                uri.append('/');
                uri.append(encodeURIComponent(this._authoringSheetName));
            }
        }
        else if (this._vizUriType === 1) {
            uri.append('/');
            uri.append(this._workbookId);
            uri.append('/');
            uri.append(this._sheetId);
            if (!tab.MiscUtil.isNullOrEmpty(this._customizedView)) {
                uri.append('/');
                uri.append(this._customizedView);
            }
        }
        else if (this._vizUriType === 4) {
            uri.append('/');
            uri.append(this._workbookId);
            uri.append('/');
            uri.append(this._sheetId);
        }
        else if (this._vizUriType === 3) {
            uri.append('/');
            uri.append(this._workbookId);
        }
        else if (this._vizUriType === 5) {
            uri.append('/');
            uri.append(tsConfig.guid);
        }
        return uri.toString();
    },
    
    _getHash: function tab_VizUriModel$_getHash() {
        if (this.explicitNotGuest) {
            return '#guest=n';
        }
        return this._hash;
    },
    
    _fillVizUriModel: function tab_VizUriModel$_fillVizUriModel(location) {
        var uriTypeStrings = _.keys(tab.VizUriModel._uriTypeStringToUriType);
        var module = tab.UriPathStripper.getModuleFromPath(location.pathname, uriTypeStrings);
        this._vizUriType = this._getUriModuleNameFromUrlModuleString(module);
        var meat = tab.UriPathStripper.getMeatFromPath(location.pathname, uriTypeStrings);
        if (this._vizUriType === 1) {
            this._fillViewingVizUriModel(meat);
        }
        else if (this._vizUriType === 2) {
            this._fillAuthoringVizUriModel(meat);
        }
        else if (this._vizUriType === 3) {
            this._fillAuthorNewWorkbookModel(meat);
        }
        else if (this._vizUriType === 4) {
            this._fillAdminVizUriModel(meat);
        }
        this._queryParams = tab.VizUriModel._getRelevantQueryParameters(location);
        this._hash = location.hash;
        this._origin = tab.BrowserSupport.getOrigin(location);
    },
    
    _fillViewingVizUriModel: function tab_VizUriModel$_fillViewingVizUriModel(meat) {
        var pieces = meat.split('/');
        this._workbookId = pieces[0];
        this._sheetId = pieces[1];
        if (pieces.length > 2) {
            if (pieces.length === 3) {
                this._customizedView = pieces[2];
            }
            this._customizedView = pieces[2] + '/' + pieces[3];
        }
    },
    
    _fillAuthoringVizUriModel: function tab_VizUriModel$_fillAuthoringVizUriModel(meat) {
        var pieces = meat.split('/');
        this._workbookId = pieces[0];
        this._sheetId = pieces[1];
        if (pieces.length > 2) {
            this._authoringSheetName = decodeURIComponent(pieces[2]);
        }
    },
    
    _fillAdminVizUriModel: function tab_VizUriModel$_fillAdminVizUriModel(meat) {
        var pieces = meat.split('/');
        this._workbookId = pieces[0];
        this._sheetId = pieces[1];
    },
    
    _fillAuthorNewWorkbookModel: function tab_VizUriModel$_fillAuthorNewWorkbookModel(meat) {
        this._workbookId = meat;
    },
    
    _getUriModuleStringFromUroModuleName: function tab_VizUriModel$_getUriModuleStringFromUroModuleName(uriModule) {
        return tab.VizUriModel._uriTypeToUriTypeString[uriModule];
    },
    
    _getUriModuleNameFromUrlModuleString: function tab_VizUriModel$_getUriModuleNameFromUrlModuleString(uriModuleString) {
        return tab.VizUriModel._uriTypeStringToUriType[uriModuleString];
    },
    
    updateForViewingSheet: function tab_VizUriModel$updateForViewingSheet(repoUrl) {
        if (!this.get_isViewingUri() && !this.get_isAuthoringUri() && !this.get_isAdminUri() && !this.get_isSharedViewUri()) {
            throw new Error('Cannot call UpdateForViewingNewTab() from a VizUriModel that does not have VizUriType Viewing');
        }
        var repoPathObject = new tab.RepoPathObject(repoUrl);
        this._workbookId = repoPathObject.get_workbookId();
        this._sheetId = repoPathObject.get_sheetId();
        this._authoringSheetName = '';
        return this;
    },
    
    updateForCustomizedView: function tab_VizUriModel$updateForCustomizedView(cv) {
        if (!this.get_isViewingUri()) {
            throw new Error('Cannot call UpdateForCustomizedView() from a VizUriModel that does not have VizUriType Viewing');
        }
        this._sheetId = cv.startViewId || this._sheetId;
        this._customizedView = String.format('{0}/{1}', tab.VizUriModel.encodeUserName(cv.owner.username), cv.urlId);
        this._authoringSheetName = '';
        this.set_originalView(false);
        return this;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RepoPathObject

tab.RepoPathObject = function tab_RepoPathObject(repoPath) {
    var pieces = repoPath.split('/');
    this._workbookId = pieces[0].replace(new RegExp('^ds:'), '');
    this._sheetId = pieces[1];
    if (pieces.length > 2) {
        if (pieces.length === 3) {
            throw new Error("new RepoPathObject() encountered repo path'" + repoPath + "' with a badly formed customized view");
        }
        this._customizedView = pieces[2] + '/' + pieces[3];
    }
    else {
        this._customizedView = '';
    }
}
tab.RepoPathObject.prototype = {
    _workbookId: null,
    _sheetId: null,
    _customizedView: null,
    
    get_workbookId: function tab_RepoPathObject$get_workbookId() {
        return this._workbookId;
    },
    
    get_sheetId: function tab_RepoPathObject$get_sheetId() {
        return this._sheetId;
    },
    
    get_customizedView: function tab_RepoPathObject$get_customizedView() {
        return this._customizedView;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.UriPathStripper

tab.UriPathStripper = function tab_UriPathStripper() {
}
tab.UriPathStripper.getModuleFromPath = function tab_UriPathStripper$getModuleFromPath(path, legalModules) {
    var siteRoot = tsConfig.site_root || '';
    var indexOfSiteStart = path.indexOf(siteRoot, 0);
    var pathWithoutSite;
    if (indexOfSiteStart === -1) {
        pathWithoutSite = path.substr(1);
    }
    else {
        var indexOfSlashFollowingSite = indexOfSiteStart + siteRoot.length;
        pathWithoutSite = path.substr(indexOfSlashFollowingSite + 1);
    }
    var $enum1 = ss.IEnumerator.getEnumerator(legalModules);
    while ($enum1.moveNext()) {
        var uriTypeString = $enum1.current;
        if (pathWithoutSite.startsWith(uriTypeString + '/')) {
            return uriTypeString;
        }
    }
    return '';
}
tab.UriPathStripper.getMeatFromPath = function tab_UriPathStripper$getMeatFromPath(path, legalModules) {
    var moduleString = tab.UriPathStripper.getModuleFromPath(path, legalModules);
    var indexOfModuleStringStart = path.indexOf(moduleString, 0);
    return path.substr(indexOfModuleStringStart + moduleString.length + 1);
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandModel

tab.$create_CommandModel = function tab_CommandModel() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.EventName

tab.EventName = function() { };
tab.EventName.prototype = {
    onTabSelect: 'onTabSelect', 
    onDoLaunchAuthoring: 'onDoLaunchAuthoring', 
    newGuid: 'newGuid', 
    newLayoutId: 'newLayoutId', 
    activeViewChanged: 'activeViewChanged', 
    invalidate: 'invalidate', 
    hoverChanged: 'hoverChanged', 
    modifiedSheetsChanged: 'modifiedSheetsChanged', 
    workbookModifiedChanged: 'workbookModifiedChanged', 
    globalFirstTouch: 'globalFirstTouch', 
    globalPress: 'globalPress', 
    globalPotentialTap: 'globalPotentialTap', 
    globalLastTouch: 'globalLastTouch', 
    globalRightClick: 'globalRightClick', 
    globalDragEnd: 'globalDragEnd', 
    stateChanged: 'stateChanged', 
    layoutUpdated: 'layoutUpdated', 
    refreshLayoutModel: 'refreshLayoutModel', 
    sheetDataChanged: 'sheetDataChanged', 
    refreshSheetInfo: 'refreshSheetInfo', 
    refreshFilterModel: 'refreshFilterModel', 
    viewChanged: 'viewChanged', 
    refreshVisualModel: 'refreshVisualModel', 
    refreshLegacyLegendImages: 'refreshLegacyLegendImages', 
    refreshMenuModel: 'refreshMenuModel', 
    selectionChanged: 'selectionChanged', 
    onBootstrapSuccess: 'onBootstrapSuccess', 
    maxEvent: 'maxEvent', 
    openActionUrl: 'openActionUrl', 
    modifierKeysChanged: 'modifierKeysChanged', 
    fieldSelectionChanged: 'fieldSelectionChanged'
}
tab.EventName.registerEnum('tab.EventName', false);


////////////////////////////////////////////////////////////////////////////////
// tab.PresModelPathItemType

tab.PresModelPathItemType = function() { };
tab.PresModelPathItemType.prototype = {
    simple: 0, 
    array: 1
}
tab.PresModelPathItemType.registerEnum('tab.PresModelPathItemType', false);


////////////////////////////////////////////////////////////////////////////////
// tab.IContinuousRangeModel

tab.IContinuousRangeModel = function() { };
tab.IContinuousRangeModel.prototype = {
    add_sliderFractionUpdated : null,
    remove_sliderFractionUpdated : null,
    getCurrentFraction : null,
    setCurrentFraction : null
}
tab.IContinuousRangeModel.registerInterface('tab.IContinuousRangeModel');


////////////////////////////////////////////////////////////////////////////////
// tab.FieldInstanceType

tab.FieldInstanceType = function() { };
tab.FieldInstanceType.prototype = {
    column: 'column', 
    drillPath: 'drillPath', 
    cubeDimension: 'cubeDimension', 
    group: 'group', 
    cubeHierarchy: 'cubeHierarchy', 
    relationalTable: 'relationalTable', 
    cubeFolder: 'cubeFolder', 
    folder: 'folder', 
    multiple: 'multiple'
}
tab.FieldInstanceType.registerEnum('tab.FieldInstanceType', false);


////////////////////////////////////////////////////////////////////////////////
// tab.Granularity

tab.$create_Granularity = function tab_Granularity() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.UbertipModel

tab.$create_UbertipModel = function tab_UbertipModel() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.IRemoteCommandHandler

tab.IRemoteCommandHandler = function() { };
tab.IRemoteCommandHandler.prototype = {
    add_commmandSucceeded : null,
    remove_commmandSucceeded : null,
    add_commandFailed : null,
    remove_commandFailed : null,
    executeCommand : null
}
tab.IRemoteCommandHandler.registerInterface('tab.IRemoteCommandHandler');


////////////////////////////////////////////////////////////////////////////////
// tab.CommandInterceptorResult

tab.CommandInterceptorResult = function() { };
tab.CommandInterceptorResult.prototype = {
    proceed: 0, 
    stop: 1
}
tab.CommandInterceptorResult.registerEnum('tab.CommandInterceptorResult', false);


////////////////////////////////////////////////////////////////////////////////
// tab.ChangeType

tab.ChangeType = function() { };
tab.ChangeType.prototype = {
    single: 0, 
    range: 1
}
tab.ChangeType.registerEnum('tab.ChangeType', false);


////////////////////////////////////////////////////////////////////////////////
// tab.ActionType

tab.ActionType = function() { };
tab.ActionType.prototype = {
    highlight: 'highlight', 
    filter: 'filter', 
    url: 'url'
}
tab.ActionType.registerEnum('tab.ActionType', false);


////////////////////////////////////////////////////////////////////////////////
// tab.IExportImageHelper

tab.IExportImageHelper = function() { };
tab.IExportImageHelper.prototype = {
    get_sheetScrollPositions : null
}
tab.IExportImageHelper.registerInterface('tab.IExportImageHelper');


////////////////////////////////////////////////////////////////////////////////
// tab.IExportPdfHelper

tab.IExportPdfHelper = function() { };
tab.IExportPdfHelper.prototype = {
    triggerExportPdfUI : null
}
tab.IExportPdfHelper.registerInterface('tab.IExportPdfHelper');


////////////////////////////////////////////////////////////////////////////////
// tab.XhrMultipartData

tab.$create_XhrMultipartData = function tab_XhrMultipartData() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.ApiClientCommands

tab.ApiClientCommands = function tab_ApiClientCommands() {
}
tab.ApiClientCommands.doApiCommand = function tab_ApiClientCommands$doApiCommand(c, onSuccess, onError) {
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'immediately', onSuccess, onError));
}


////////////////////////////////////////////////////////////////////////////////
// tab.ToolbarClientCommands

tab.ToolbarClientCommands = function tab_ToolbarClientCommands() {
}
tab.ToolbarClientCommands.revert = function tab_ToolbarClientCommands$revert() {
    var c = tab.CommandUtils.newSrvCommand('revert-workbook');
    var revertCmd = new tab.ClientCommand('immediately', function(t) {
        var dashModel = tab.ModelUtils.findContentDashboard();
        var dashboardPM = t.makeMutablePresModel(dashModel);
        dashboardPM.modifiedSheets = new Array(0);
    }, c);
    tab.CommandController.SendCommand(revertCmd);
}


////////////////////////////////////////////////////////////////////////////////
// tab.StoryClientCommands

tab.StoryClientCommands = function tab_StoryClientCommands() {
}
tab.StoryClientCommands.get__log = function tab_StoryClientCommands$get__log() {
    return tab.Logger.lazyGetLogger(tab.StoryClientCommands);
}
tab.StoryClientCommands.setActiveStoryPoint = function tab_StoryClientCommands$setActiveStoryPoint(newActiveStoryPointIndex, nav) {
    var deferred = $.Deferred();
    if (!tab.ApplicationModel.get_instance().get_workbook().get_isCurrentSheetStoryboard() || nav.get_currentPointIndex() === newActiveStoryPointIndex) {
        deferred.resolve();
        return deferred.promise();
    }
    var c = new tab.ClientCommand('none', function(t) {
        tab.StoryClientCommands._setActiveStoryPointLocal(newActiveStoryPointIndex, nav, t);
    }, tab.StoryClientCommands._buildActiveStoryPointCommand(nav.get_storyPoints()[newActiveStoryPointIndex].storyPointId), tab.CommandController._deferredSuccessHandler(deferred), tab.CommandController._deferredFailureHandler(deferred));
    tab.CommandController.SendCommand(c);
    return deferred.promise();
}
tab.StoryClientCommands.nextStoryPoint = function tab_StoryClientCommands$nextStoryPoint(nav) {
    var deferred = $.Deferred();
    if (!tab.ApplicationModel.get_instance().get_workbook().get_isCurrentSheetStoryboard()) {
        deferred.reject("The workbook's current sheet is not a story");
        return deferred.promise();
    }
    var c = new tab.ClientCommand('none', function(t) {
        tab.StoryClientCommands._setActiveStoryPointLocal(nav.get_currentPointIndex() + 1, nav, t);
    }, tab.StoryClientCommands._buildNextStoryPointCommand(), tab.CommandController._deferredSuccessHandler(deferred), tab.CommandController._deferredFailureHandler(deferred));
    tab.CommandController.SendCommand(c);
    return deferred.promise();
}
tab.StoryClientCommands.previousStoryPoint = function tab_StoryClientCommands$previousStoryPoint(nav) {
    var deferred = $.Deferred();
    if (ss.isNullOrUndefined(tab.ApplicationModel.get_instance().get_workbook().get_storyboard())) {
        deferred.reject("The workbook's current sheet is not a story");
        return deferred.promise();
    }
    var c = new tab.ClientCommand('none', function(t) {
        tab.StoryClientCommands._setActiveStoryPointLocal(nav.get_currentPointIndex() - 1, nav, t);
    }, tab.StoryClientCommands._buildPreviousStoryPointCommand(), tab.CommandController._deferredSuccessHandler(deferred), tab.CommandController._deferredFailureHandler(deferred));
    tab.CommandController.SendCommand(c);
    return deferred.promise();
}
tab.StoryClientCommands.revertStoryPoint = function tab_StoryClientCommands$revertStoryPoint(sheetPath, storyPointId) {
    var deferred = $.Deferred();
    var c = new tab.ClientCommand('none', function(t) {
        tab.StoryClientCommands._revertStoryPointLocal();
    }, tab.StoryClientCommands._buildRevertStoryPointCommand(sheetPath, storyPointId), tab.CommandController._deferredSuccessHandler(deferred), tab.CommandController._deferredFailureHandler(deferred));
    tab.CommandController.SendCommand(c);
    return deferred.promise();
}
tab.StoryClientCommands._revertStoryPointLocal = function tab_StoryClientCommands$_revertStoryPointLocal() {
    tab.StoryClientCommands._invalidateFlipboard();
}
tab.StoryClientCommands._buildRevertStoryPointCommand = function tab_StoryClientCommands$_buildRevertStoryPointCommand(sheetPath, storyPointId) {
    var c = tab.CommandUtils.newDocCommand('revert-story-point');
    c.commandParams = {};
    tab.CommandUtils.addStoryPointToCommand(c.commandParams, sheetPath);
    c.commandParams['storyPointId'] = storyPointId.toString();
    return c;
}
tab.StoryClientCommands._setActiveStoryPointLocal = function tab_StoryClientCommands$_setActiveStoryPointLocal(newActiveStoryPointIndex, nav, t) {
    if (ss.isValue(nav)) {
        var navPM = t.makeMutablePresModel(nav);
        navPM.currentStorypointIndex = newActiveStoryPointIndex;
        tab.StoryClientCommands._invalidateFlipboard();
    }
}
tab.StoryClientCommands._buildActiveStoryPointCommand = function tab_StoryClientCommands$_buildActiveStoryPointCommand(newActiveStoryPointID) {
    var cmd = tab.StoryClientCommands._createStoryCommand('set-active-story-point');
    cmd.commandParams['storyPointId'] = newActiveStoryPointID.toString();
    cmd.commandParams['shouldAutoCapture'] = 'false';
    cmd.commandParams['shouldAutoRevert'] = 'true';
    return cmd;
}
tab.StoryClientCommands._buildNextStoryPointCommand = function tab_StoryClientCommands$_buildNextStoryPointCommand() {
    var cmd = tab.StoryClientCommands._createStoryCommand('next-story-point');
    cmd.commandParams['shouldAutoCapture'] = 'false';
    cmd.commandParams['shouldAutoRevert'] = 'true';
    return cmd;
}
tab.StoryClientCommands._buildPreviousStoryPointCommand = function tab_StoryClientCommands$_buildPreviousStoryPointCommand() {
    var cmd = tab.StoryClientCommands._createStoryCommand('previous-story-point');
    cmd.commandParams['shouldAutoCapture'] = 'false';
    cmd.commandParams['shouldAutoRevert'] = 'true';
    return cmd;
}
tab.StoryClientCommands._createStoryCommand = function tab_StoryClientCommands$_createStoryCommand(docCommand) {
    var cmd = tab.CommandUtils.newDocCommand(docCommand);
    var flipboard = tab.ApplicationModel.get_instance().get_workbook().get_storyboard().get_flipboard();
    var cmdParams = {};
    cmdParams['storyboard'] = tsConfig.current_sheet_name;
    cmdParams['flipboardZoneId'] = flipboard.get_zoneId();
    cmd.commandParams = cmdParams;
    return cmd;
}
tab.StoryClientCommands._invalidateFlipboard = function tab_StoryClientCommands$_invalidateFlipboard() {
    var flipboard = tab.ApplicationModel.get_instance().get_workbook().get_storyboard().get_flipboard();
    if (ss.isValue(flipboard)) {
        flipboard.invalidated();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.UberTipClientCommands

tab.UberTipClientCommands = function tab_UberTipClientCommands() {
}
tab.UberTipClientCommands.get__commandPermission = function tab_UberTipClientCommands$get__commandPermission() {
    return tab.MiscUtil.lazyInitStaticField(tab.UberTipClientCommands, 'commandPermissions', function() {
        return tab.PermissionManager.buildCommandPermission();
    });
}
tab.UberTipClientCommands.executeUbertipAction = function tab_UberTipClientCommands$executeUbertipAction(action, objectIds, visualModel) {
    var c = new tab._localClientCommand(function(t) {
        tab.ActionUtils.executeAction(action, objectIds, visualModel, t);
    });
    tab.CommandController.SendCommand(c);
}
tab.UberTipClientCommands.executeUbertipCommand = function tab_UberTipClientCommands$executeUbertipCommand(command) {
    switch (command.commandType) {
        case 1:
            tab.SelectionClientCommands.clearAllSelections(tab.ModelUtils.findActiveOrDefaultVisual().get_visualId());
            break;
        case 2:
        case 10:
            var cmd = tab.UberTipClientCommands._convertTupleIdToSelection(command);
            tab.ServerCommands.executeServerCommand(cmd, 'immediately');
            break;
        case 4:
        case 11:
        case 12:
        case 13:
        case 15:
        case 17:
        case 18:
            tab.ServerCommands.executeServerCommand(command.command, 'immediately');
            break;
        case 21:
            tab.ServerCommands.executeServerCommand(command.command, 'immediately', tab.CommandUtils.createCommandRedirectSuccessHandler(null), null);
            break;
        case 6:
        case 9:
        case 7:
        default:
            return;
    }
}
tab.UberTipClientCommands.localAndRemoteUberTipCommand = function tab_UberTipClientCommands$localAndRemoteUberTipCommand(vizRegion, visualId, selRect, tupleId, actionActivationMethod, localInfo, localCallback, remoteCallback, tooltipFailureCallback) {
    var c = tab.UberTipClientCommands._buildLocalAndRemoteUberTipCommand(vizRegion, visualId, selRect, actionActivationMethod, localInfo, localCallback, remoteCallback, tooltipFailureCallback, tupleId);
    tab.CommandController.SendCommand(c);
}
tab.UberTipClientCommands._buildLocalAndRemoteUberTipCommand = function tab_UberTipClientCommands$_buildLocalAndRemoteUberTipCommand(vizRegion, visualId, selRect, actionActivationMethod, localInfo, localCallback, remoteCallback, tooltipFailureCallback, tupleId) {
    var c = new tab._getUberTipClientCommand(function(t) {
        if (!tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            return;
        }
        var ubertipModel = tab.UbertipSerializer.createLocalUberTipModel(tab.ModelUtils.getVisualModelFromVisualId(visualId), localInfo, tsConfig.is_authoring);
        ubertipModel.isUpdate = false;
        if (ss.isValue(ubertipModel)) {
            tab.PermissionManager.filterCommands(ubertipModel.commands, tab.UberTipClientCommands.get__commandPermission());
        }
        localCallback(ubertipModel);
        if (actionActivationMethod === 'on-hover') {
            tab.ActionUtils.executeActions(visualId.worksheet, actionActivationMethod, localInfo.get_interactedTupleIds(), t);
        }
    }, tab.UberTipClientCommands._buildRemoteUbertipCommand(vizRegion, visualId, selRect, tupleId), tab.UberTipClientCommands._buildRemoteCommandSuccessCallback(true, remoteCallback), tooltipFailureCallback);
    return c;
}
tab.UberTipClientCommands.localOnlyUbertipCommand = function tab_UberTipClientCommands$localOnlyUbertipCommand(visualId, localInfo, callback, actionActivationMethod) {
    var c = tab.UberTipClientCommands.buildLocalOnlyUbertipCommand(visualId, localInfo, callback, actionActivationMethod);
    c.set_commandName('render-tooltip-server');
    tab.CommandController.SendCommand(c);
}
tab.UberTipClientCommands.buildLocalOnlyUbertipCommand = function tab_UberTipClientCommands$buildLocalOnlyUbertipCommand(visualId, localInfo, callback, actionActivationMethod) {
    var c = new tab._getUberTipClientCommand(function(t) {
        var ubertipModel = tab.UbertipSerializer.createLocalUberTipModel(tab.ModelUtils.getVisualModelFromVisualId(visualId), localInfo, tsConfig.is_authoring);
        ubertipModel.isUpdate = false;
        if (ss.isValue(ubertipModel)) {
            tab.PermissionManager.filterCommands(ubertipModel.commands, tab.UberTipClientCommands.get__commandPermission());
        }
        callback(ubertipModel);
        if (actionActivationMethod === 'on-hover') {
            tab.ActionUtils.executeActions(visualId.worksheet, actionActivationMethod, localInfo.get_interactedTupleIds(), t);
        }
    }, null, null, null);
    return c;
}
tab.UberTipClientCommands.remoteOnlyUbertipCommand = function tab_UberTipClientCommands$remoteOnlyUbertipCommand(vizRegion, visualId, regionSelRect, callback, tooltipFailureCallback, tupleId) {
    var c = tab.UberTipClientCommands.buildRemoteOnlyUberTipCommand(vizRegion, visualId, regionSelRect, callback, tooltipFailureCallback, tupleId);
    tab.CommandController.SendCommand(c);
}
tab.UberTipClientCommands.buildRemoteOnlyUberTipCommand = function tab_UberTipClientCommands$buildRemoteOnlyUberTipCommand(vizRegion, visualId, regionSelRect, callback, tooltipFailureCallback, tupleId) {
    var c = new tab._getUberTipClientCommand(null, tab.UberTipClientCommands._buildRemoteUbertipCommand(vizRegion, visualId, regionSelRect, tupleId), tab.UberTipClientCommands._buildRemoteCommandSuccessCallback(false, callback), tooltipFailureCallback);
    return c;
}
tab.UberTipClientCommands._buildRemoteUbertipCommand = function tab_UberTipClientCommands$_buildRemoteUbertipCommand(vizRegion, visualId, regionSelRect, tupleId) {
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'render-tooltip-server';
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    if (ss.isValue(tupleId)) {
        cmdParams['tupleIds'] = [ tupleId ];
    }
    var vizRegionRect = {};
    var regionWrapper = tab.VizRegionRectWrapper.create(vizRegionRect);
    regionWrapper.set_r(vizRegion);
    regionWrapper.set_x(Math.round(regionSelRect.x));
    regionWrapper.set_y(Math.round(regionSelRect.y));
    regionWrapper.set_w(Math.round(regionSelRect.w));
    regionWrapper.set_h(Math.round(regionSelRect.h));
    cmdParams['vizRegionRect'] = vizRegionRect;
    cmdParams['allowHoverActions'] = true;
    cmdParams['allowPromptText'] = true;
    cmdParams['allowWork'] = tsConfig.is_mobile;
    cmdParams['useInlineImages'] = true;
    cmd.commandParams = cmdParams;
    return cmd;
}
tab.UberTipClientCommands._buildRemoteCommandSuccessCallback = function tab_UberTipClientCommands$_buildRemoteCommandSuccessCallback(isUpdate, callback) {
    return function(pm) {
        if (!ss.isValue(pm)) {
            return;
        }
        var ubertip = tab.JsonUtil.parseJson(pm.toString());
        var remoteModel = tab.UbertipSerializer.deserializeUbertip(ubertip);
        if (ss.isValue(remoteModel)) {
            remoteModel.isUpdate = isUpdate;
            tab.PermissionManager.filterCommands(remoteModel.commands, tab.UberTipClientCommands.get__commandPermission());
        }
        if (ss.isValue(callback)) {
            callback(remoteModel);
        }
    };
}
tab.UberTipClientCommands._convertTupleIdToSelection = function tab_UberTipClientCommands$_convertTupleIdToSelection(command) {
    var cmd = tab.CommandUtils.duplicateCommand(command.command);
    var cmdParams = cmd.commandParams;
    var tupleId = cmdParams['tupleId'];
    delete cmdParams.tupleId;
    if (!Object.keyExists(cmdParams, 'selectAtPoint') && ss.isValue(tupleId)) {
        var tupleIds = [ parseInt(tupleId) ];
        var pm = {};
        pm.objectIds = tupleIds;
        pm.selectionType = 'tuples';
        cmdParams['selection'] = pm;
    }
    return cmd;
}


////////////////////////////////////////////////////////////////////////////////
// tab._getUberTipClientCommand

tab._getUberTipClientCommand = function tab__getUberTipClientCommand(doLocal, cmd, successCallback, errorCallback) {
    tab._getUberTipClientCommand.initializeBase(this, [ 'none', doLocal, cmd, successCallback, errorCallback ]);
}
tab._getUberTipClientCommand.prototype = {
    
    get_isOneAtATime: function tab__getUberTipClientCommand$get_isOneAtATime() {
        return true;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FilterClientCommands

tab.FilterClientCommands = function tab_FilterClientCommands() {
}
tab.FilterClientCommands.setQuantitativeFilterRange = function tab_FilterClientCommands$setQuantitativeFilterRange(visualId, filterField, filterMin, filterMax, includeMode) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'range-filter';
    cmd.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmd.commandParams, visualId);
    cmd.commandParams['globalFieldName'] = filterField;
    if (ss.isValue(filterMin)) {
        cmd.commandParams['filterRangeMin'] = filterMin.toString();
    }
    if (ss.isValue(filterMax)) {
        cmd.commandParams['filterRangeMax'] = filterMax.toString();
    }
    cmd.commandParams['included'] = includeMode;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.setCategoricalFilterValues = function tab_FilterClientCommands$setCategoricalFilterValues(visualId, filterField, updateType, aliases) {
    if (!ss.isValue(updateType)) {
        updateType = 'filter-replace';
    }
    if (!ss.isValue(aliases)) {
        aliases = new Array(0);
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'categorical-filter';
    cmd.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmd.commandParams, visualId);
    cmd.commandParams['globalFieldName'] = filterField;
    cmd.commandParams['filterValues'] = tab.JsonUtil.toJson(aliases);
    cmd.commandParams['filterUpdateType'] = updateType;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.setCategoricalFilterValuesByIndex = function tab_FilterClientCommands$setCategoricalFilterValuesByIndex(visualId, filterField, updateType, indexes) {
    if (!ss.isValue(updateType)) {
        updateType = 'filter-replace';
    }
    if (!ss.isValue(indexes)) {
        indexes = new Array(0);
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'categorical-filter-by-index';
    cmd.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmd.commandParams, visualId);
    cmd.commandParams['globalFieldName'] = filterField;
    cmd.commandParams['filterIndices'] = tab.JsonUtil.toJson(indexes);
    cmd.commandParams['filterUpdateType'] = updateType;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.modifyCategoricalFilterValues = function tab_FilterClientCommands$modifyCategoricalFilterValues(visualId, filterField, addAliases, removeAliases) {
    if ((!ss.isValue(addAliases) || !addAliases.length) && (!ss.isValue(removeAliases) || !removeAliases.length)) {
        return;
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'categorical-filter';
    cmd.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmd.commandParams, visualId);
    cmd.commandParams['globalFieldName'] = filterField;
    if (ss.isValue(addAliases)) {
        cmd.commandParams['filterAdd'] = tab.JsonUtil.toJson(addAliases);
    }
    if (ss.isValue(removeAliases)) {
        cmd.commandParams['filterRemove'] = tab.JsonUtil.toJson(removeAliases);
    }
    cmd.commandParams['filterUpdateType'] = 'filter-delta';
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.modifyCategoricalFilterValuesByIndex = function tab_FilterClientCommands$modifyCategoricalFilterValuesByIndex(visualId, filterField, addIndexes, removeIndexes) {
    if ((!ss.isValue(addIndexes) || !addIndexes.length) && (!ss.isValue(removeIndexes) || !removeIndexes.length)) {
        return;
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'categorical-filter-by-index';
    cmd.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmd.commandParams, visualId);
    cmd.commandParams['globalFieldName'] = filterField;
    if (ss.isValue(addIndexes)) {
        cmd.commandParams['filterAddIndices'] = tab.JsonUtil.toJson(addIndexes);
    }
    if (ss.isValue(removeIndexes)) {
        cmd.commandParams['filterRemoveIndices'] = tab.JsonUtil.toJson(removeIndexes);
    }
    cmd.commandParams['filterUpdateType'] = 'filter-delta';
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.setCategoricalQuickFilterMode = function tab_FilterClientCommands$setCategoricalQuickFilterMode(visualId, fieldName, mode) {
    var c = {};
    c.commandNamespace = 'tabsrv';
    c.commandName = 'set-quick-filter-mode';
    c.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(c.commandParams, visualId);
    c.commandParams['categoricalMode'] = mode;
    c.commandParams['fn'] = fieldName;
    tab.ServerCommands.executeServerCommand(c, 'immediately');
}
tab.FilterClientCommands.setCategoricalQuickFilterDomain = function tab_FilterClientCommands$setCategoricalQuickFilterDomain(visualId, fieldName, domain) {
    var c = {};
    c.commandNamespace = 'tabsrv';
    c.commandName = 'set-quick-filter-domain';
    c.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(c.commandParams, visualId);
    c.commandParams['filterDomainType'] = domain;
    c.commandParams['fn'] = fieldName;
    tab.ServerCommands.executeServerCommand(c, 'immediately');
}
tab.FilterClientCommands.setPatternFilterState = function tab_FilterClientCommands$setPatternFilterState(visualId, fieldName, pattern) {
    var c = {};
    c.commandNamespace = 'tabdoc';
    c.commandName = 'categorical-quick-filter-pattern';
    c.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(c.commandParams, visualId);
    c.commandParams['patternFilterString'] = pattern;
    c.commandParams['fn'] = fieldName;
    tab.ServerCommands.executeServerCommand(c, 'immediately');
}
tab.FilterClientCommands.addManualFilterItems = function tab_FilterClientCommands$addManualFilterItems(visualId, fieldName, data) {
    var dataCol1 = {};
    var stringCollation = {};
    stringCollation.charsetId = 0;
    stringCollation.name = '';
    dataCol1.dataType = 'cstring';
    dataCol1.stringCollation = stringCollation;
    var tuples = data.tuples;
    var searchStrings = [];
    var $enum1 = ss.IEnumerator.getEnumerator(tuples);
    while ($enum1.moveNext()) {
        var t = $enum1.current;
        searchStrings.add(t.d);
    }
    dataCol1.dataValues = searchStrings;
    var c = {};
    c.commandNamespace = 'tabsrv';
    c.commandName = 'add-manual-items-to-filter';
    c.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(c.commandParams, visualId);
    c.commandParams['dataColumn'] = tab.JsonUtil.toJson(dataCol1);
    c.commandParams['fn'] = fieldName;
    tab.ServerCommands.executeServerCommand(c, 'immediately');
}
tab.FilterClientCommands.levelDrill = function tab_FilterClientCommands$levelDrill(visualId, position, shelfType, isDrillDown) {
    var c = {};
    c.commandNamespace = 'tabdoc';
    c.commandName = 'level-drill';
    c.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(c.commandParams, visualId);
    c.commandParams['drillDown'] = isDrillDown.toString();
    c.commandParams['shelfType'] = shelfType;
    c.commandParams['position'] = position.toString();
    tab.ServerCommands.executeServerCommand(c, 'immediately');
}
tab.FilterClientCommands.updateCategoricalFilter = function tab_FilterClientCommands$updateCategoricalFilter(filterData) {
    if (!tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
        return;
    }
    var isCurrentlyWithinLocalFilterDomain = function() {
        return true;
    };
    var isFilteredOut = function(fieldData, tupleId) {
        var alias = tab.VizDataLookup.lookupAlias(tupleId, fieldData, tab.ApplicationModel.get_instance().get_dataDictionary());
        return !filterData.includesValue(alias);
    };
    tab.FilterClientCommands._updateFilter(filterData.get_filterField(), filterData.get_targetSheets(), isCurrentlyWithinLocalFilterDomain, isFilteredOut, true);
}
tab.FilterClientCommands.updateQuantitativeFilter = function tab_FilterClientCommands$updateQuantitativeFilter(filterData) {
    if (!tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
        return;
    }
    var isCurrentlyWithinLocalFilterDomain = function() {
        var minWithinRange = !ss.isValue(filterData.get_currentMinVal()) || (ss.isValue(filterData.get_previousMinVal()) && tab.FloatUtil.isGreaterThanOrEqual(filterData.get_currentMinVal(), filterData.get_previousMinVal()));
        var maxWithinRange = !ss.isValue(filterData.get_currentMaxVal()) || (ss.isValue(filterData.get_previousMaxVal()) && tab.FloatUtil.isLessThanOrEqual(filterData.get_currentMaxVal(), filterData.get_previousMaxVal()));
        return minWithinRange && maxWithinRange;
    };
    var isFilteredOut = function(fieldData, tupleId) {
        var dataValue = tab.VizDataLookup.lookupRawDataValue(tupleId, fieldData, tab.ApplicationModel.get_instance().get_dataDictionary());
        if (fieldData.get_dataType() === 'date' || fieldData.get_dataType() === 'datetime') {
            var date = tab.DateUtil.parsePresModelDate(dataValue);
            return !filterData.valueInRange(tab.DateUtil.dateTimeAsOleDate(date));
        }
        else {
            return !filterData.valueInRange(parseFloat(dataValue));
        }
    };
    tab.FilterClientCommands._updateFilter(filterData.get_filterField(), filterData.get_targetSheets(), isCurrentlyWithinLocalFilterDomain, isFilteredOut, false);
}
tab.FilterClientCommands.applyFilter = function tab_FilterClientCommands$applyFilter(visModel, filterField, isFilteredOut) {
    var vizData = visModel.get_vizDataModel();
    var fieldData = vizData.getVizDataField(filterField);
    var filteredTuples = [];
    vizData.forEachTupleId(function(tupleId) {
        if (isFilteredOut(fieldData, tupleId)) {
            filteredTuples.add(tupleId);
        }
        return true;
    });
    return filteredTuples;
}
tab.FilterClientCommands.doRelativeDateQuickFilter = function tab_FilterClientCommands$doRelativeDateQuickFilter(visualId, fieldName, periodType, rangeType, range) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'relative-date-filter';
    cmd.commandParams = tab.FilterClientCommands.createDoRelativeDateQuickFilterParams(visualId, fieldName, periodType, rangeType, range);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.doLevelHierarchialFilter = function tab_FilterClientCommands$doLevelHierarchialFilter(visualId, fieldName, addLevels, removeLevels, updateType) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'hierarchical-filter';
    cmd.commandParams = tab.FilterClientCommands._createDoLevelHierarchialFilterParams(visualId, fieldName, addLevels, removeLevels, updateType);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.doMemberHierarchialFilter = function tab_FilterClientCommands$doMemberHierarchialFilter(visualId, fieldName, addMember, removeMember, updateType) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'hierarchical-filter';
    cmd.commandParams = tab.FilterClientCommands._createDoMemberHierarchialFilterParams(visualId, fieldName, addMember, removeMember, updateType);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.doRangeHierarchialFilter = function tab_FilterClientCommands$doRangeHierarchialFilter(visualId, fieldName, rangeAddMembers, rangeRemoveMembers, updateType) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'hierarchical-filter';
    cmd.commandParams = tab.FilterClientCommands._createDoRangeHierarchialFilterParams(visualId, fieldName, rangeAddMembers, rangeRemoveMembers, updateType);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.FilterClientCommands.resetQuantitativeFilter = function tab_FilterClientCommands$resetQuantitativeFilter(filterField, targetSheets) {
    var $enum1 = ss.IEnumerator.getEnumerator(targetSheets);
    while ($enum1.moveNext()) {
        var sheetName = $enum1.current;
        var visModel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheetName);
        if (ss.isNullOrUndefined(visModel)) {
            continue;
        }
        if (tab.FilterClientCommands._canFilterLocally(filterField, sheetName)) {
            var filteredTuples = new Array(0);
            visModel.setFilteredTuples(filterField, filteredTuples);
            visModel.setHiddenTuples(filterField, filteredTuples);
        }
        tab.VizClientCommands.validateVisualModel(visModel);
    }
}
tab.FilterClientCommands.createDoRelativeDateQuickFilterParams = function tab_FilterClientCommands$createDoRelativeDateQuickFilterParams(visualId, fieldName, periodType, rangeType, range, anchorDate, includedValues) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    cmdParams['globalFieldName'] = fieldName;
    cmdParams['datePeriodType'] = periodType;
    cmdParams['dateRangeType'] = rangeType;
    if (rangeType === 'lastn' || rangeType === 'nextn') {
        cmdParams['rangeN'] = range;
    }
    if (ss.isValue(anchorDate)) {
        cmdParams['anchorDate'] = anchorDate;
    }
    if (ss.isValue(includedValues)) {
        cmdParams['included'] = includedValues;
    }
    return cmdParams;
}
tab.FilterClientCommands._createDoLevelHierarchialFilterParams = function tab_FilterClientCommands$_createDoLevelHierarchialFilterParams(visualId, fieldName, addLevels, removeLevels, updateType) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    var filterOptions = {};
    filterOptions['filterLevelAdd'] = addLevels;
    filterOptions['filterLevelRemove'] = removeLevels;
    cmdParams['globalFieldName'] = fieldName;
    cmdParams['filterOptions'] = filterOptions;
    cmdParams['filterUpdateType'] = updateType;
    return cmdParams;
}
tab.FilterClientCommands._createDoMemberHierarchialFilterParams = function tab_FilterClientCommands$_createDoMemberHierarchialFilterParams(visualId, fieldName, addMember, removeMember, updateType) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    var filterOptions = {};
    filterOptions['filterAdd'] = addMember;
    filterOptions['filterRemove'] = removeMember;
    cmdParams['globalFieldName'] = fieldName;
    cmdParams['filterOptions'] = filterOptions;
    cmdParams['filterUpdateType'] = updateType;
    return cmdParams;
}
tab.FilterClientCommands._createDoRangeHierarchialFilterParams = function tab_FilterClientCommands$_createDoRangeHierarchialFilterParams(visualId, fieldName, rangeAddMembers, rangeRemoveMembers, updateType) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    var filterOptions = {};
    filterOptions['filterRangeAdd'] = rangeAddMembers;
    filterOptions['filterRangeRemove'] = rangeRemoveMembers;
    cmdParams['globalFieldName'] = fieldName;
    cmdParams['filterOptions'] = filterOptions;
    cmdParams['filterUpdateType'] = updateType;
    return cmdParams;
}
tab.FilterClientCommands._canFilterLocally = function tab_FilterClientCommands$_canFilterLocally(filterField, sheetName) {
    var visModel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheetName);
    if (ss.isValue(visModel)) {
        return visModel.get_shouldUpdate() && visModel.hasFilterFieldData(filterField);
    }
    return false;
}
tab.FilterClientCommands._updateFilter = function tab_FilterClientCommands$_updateFilter(filterField, targetSheets, isCurrentlyWithinLocalFilterDomain, isFilteredOut, isCategorical) {
    var $enum1 = ss.IEnumerator.getEnumerator(targetSheets);
    while ($enum1.moveNext()) {
        var sheetName = $enum1.current;
        var visModel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheetName);
        if (ss.isNullOrUndefined(visModel)) {
            continue;
        }
        var canFilterLocally = tab.FilterClientCommands._canFilterLocally(filterField, sheetName);
        var c = new tab._localClientCommand(function(t) {
            if (!canFilterLocally || !isCurrentlyWithinLocalFilterDomain()) {
                if (!isCategorical) {
                    tab.ModelUtils.setVisualValidStateOnModel(t, visModel, false);
                }
            }
            else {
                var filteredTuples = new Array(0);
                filteredTuples = tab.FilterClientCommands.applyFilter(visModel, filterField, isFilteredOut);
                visModel.setFilteredTuples(filterField, filteredTuples);
                if (!isCategorical) {
                    visModel.setHiddenTuples(filterField, filteredTuples);
                }
                tab.ModelUtils.setVisualValidStateOnModel(t, visModel, true);
            }
        });
        c.set_commandName((isCategorical) ? 'categorical-filter' : 'range-filter');
        tab.CommandController.SendCommand(c);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SheetClientCommands

tab.SheetClientCommands = function tab_SheetClientCommands() {
}
tab.SheetClientCommands.switchSheets = function tab_SheetClientCommands$switchSheets(msg, isEmbedded) {
    if (ss.isNullOrUndefined(msg.oldSheetName)) {
        msg.oldSheetName = tsConfig.current_sheet_name;
    }
    tab.CommandController.get().get_legacySession().get_waitHandler().showAndLock();
    var c = {};
    c.commandNamespace = 'tabsrv';
    c.commandName = 'ensure-layout-for-sheet';
    c.commandParams = {};
    c.commandParams['targetSheet'] = msg.sheetName;
    c.commandParams['isEmbedded'] = isEmbedded.toString();
    tab.ServerCommands.executeServerCommand(c, 'immediately', msg.successCallback, msg.errorCallback);
}
tab.SheetClientCommands.createSheet = function tab_SheetClientCommands$createSheet(sheetName, insertAtEnd) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'new-worksheet';
    cmd.commandParams = {};
    if (ss.isValue(sheetName)) {
        cmd.commandParams['newSheet'] = sheetName;
    }
    if (insertAtEnd) {
        cmd.commandParams['insertAtEnd'] = insertAtEnd.toString();
    }
    tab.ServerCommands.executeServerCommand(cmd, 'immediately', null, null);
}
tab.SheetClientCommands.deleteSheet = function tab_SheetClientCommands$deleteSheet(sheetName) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'delete-sheet';
    cmd.commandParams = {};
    cmd.commandParams['sheet'] = sheetName;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.SheetClientCommands.renameSheet = function tab_SheetClientCommands$renameSheet(sheetName, newName) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'rename-sheet';
    cmd.commandParams = {};
    cmd.commandParams['sheet'] = sheetName;
    cmd.commandParams['newSheet'] = newName;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately', null, null);
}
tab.SheetClientCommands.duplicateSheet = function tab_SheetClientCommands$duplicateSheet(sheetName) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'duplicate-sheet';
    cmd.commandParams = {};
    cmd.commandParams['sheet'] = sheetName;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately', null, null);
}
tab.SheetClientCommands.clearWorksheet = function tab_SheetClientCommands$clearWorksheet(sheetName) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'clear-sheet';
    cmd.commandParams = {};
    cmd.commandParams['sheet'] = sheetName;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.SheetClientCommands.setPortSize = function tab_SheetClientCommands$setPortSize(portSize, metrics) {
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'set-port-size';
    cmd.commandParams = {};
    cmd.commandParams['sheet'] = tsConfig.current_sheet_name;
    cmd.commandParams['viewportSize'] = tab.JsonUtil.toJson(portSize);
    cmd.commandParams['clientDashboardUiMetricContainer'] = tab.JsonUtil.toJson(metrics);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizClientCommands

tab.VizClientCommands = function tab_VizClientCommands() {
}
tab.VizClientCommands.invalidateVisualModel = function tab_VizClientCommands$invalidateVisualModel(model) {
    tab.VizClientCommands._setVisualModelValidity(model, false);
}
tab.VizClientCommands.validateVisualModel = function tab_VizClientCommands$validateVisualModel(model) {
    tab.VizClientCommands._setVisualModelValidity(model, true);
}
tab.VizClientCommands._setVisualModelValidity = function tab_VizClientCommands$_setVisualModelValidity(model, valid) {
    var c = new tab._localClientCommand(function(t) {
        tab.ModelUtils.setVisualValidStateOnModel(t, model, valid);
    });
    tab.CommandController.SendCommand(c);
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizRegionRectWrapper

tab.VizRegionRectWrapper = function tab_VizRegionRectWrapper(rect) {
    this._vizRegionRect = rect;
}
tab.VizRegionRectWrapper.create = function tab_VizRegionRectWrapper$create(rect) {
    return new tab.VizRegionRectWrapper(rect);
}
tab.VizRegionRectWrapper.prototype = {
    _vizRegionRect: null,
    
    get_r: function tab_VizRegionRectWrapper$get_r() {
        return this._vizRegionRect.r;
    },
    set_r: function tab_VizRegionRectWrapper$set_r(value) {
        this._vizRegionRect.r = value;
        return value;
    },
    
    get_fns: function tab_VizRegionRectWrapper$get_fns() {
        return this._vizRegionRect.fieldVector;
    },
    set_fns: function tab_VizRegionRectWrapper$set_fns(value) {
        this._vizRegionRect.fieldVector = value;
        return value;
    },
    
    get_x: function tab_VizRegionRectWrapper$get_x() {
        return this._vizRegionRect.x;
    },
    set_x: function tab_VizRegionRectWrapper$set_x(value) {
        this._vizRegionRect.x = value;
        return value;
    },
    
    get_y: function tab_VizRegionRectWrapper$get_y() {
        return this._vizRegionRect.y;
    },
    set_y: function tab_VizRegionRectWrapper$set_y(value) {
        this._vizRegionRect.y = value;
        return value;
    },
    
    get_w: function tab_VizRegionRectWrapper$get_w() {
        return this._vizRegionRect.w;
    },
    set_w: function tab_VizRegionRectWrapper$set_w(value) {
        this._vizRegionRect.w = value;
        return value;
    },
    
    get_h: function tab_VizRegionRectWrapper$get_h() {
        return this._vizRegionRect.h;
    },
    set_h: function tab_VizRegionRectWrapper$set_h(value) {
        this._vizRegionRect.h = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._baseSessionCommandHandler

tab._baseSessionCommandHandler = function tab__baseSessionCommandHandler(session) {
    this._session = session;
    this._commandSequenceId = 0;
    this._commandThrottlers = {};
}
tab._baseSessionCommandHandler.prototype = {
    _session: null,
    _commandSequenceId: 0,
    _commandThrottlers: null,
    
    add_commmandSucceeded: function tab__baseSessionCommandHandler$add_commmandSucceeded(value) {
        this.__commmandSucceeded = ss.Delegate.combine(this.__commmandSucceeded, value);
    },
    remove_commmandSucceeded: function tab__baseSessionCommandHandler$remove_commmandSucceeded(value) {
        this.__commmandSucceeded = ss.Delegate.remove(this.__commmandSucceeded, value);
    },
    
    __commmandSucceeded: null,
    
    add_commandFailed: function tab__baseSessionCommandHandler$add_commandFailed(value) {
        this.__commandFailed = ss.Delegate.combine(this.__commandFailed, value);
    },
    remove_commandFailed: function tab__baseSessionCommandHandler$remove_commandFailed(value) {
        this.__commandFailed = ss.Delegate.remove(this.__commandFailed, value);
    },
    
    __commandFailed: null,
    
    executeCommand: function tab__baseSessionCommandHandler$executeCommand(c, success, failure) {
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(this._commandThrottlers));
        while ($enum1.moveNext()) {
            var throttler = $enum1.current;
            if (!this._commandThrottlers[throttler].processCommand(c, success, failure)) {
                return;
            }
        }
        var metricsParams = {};
        metricsParams['cn'] = c.commandName;
        var mc = tabBootstrap.MetricsController.get_instance().createContext('EXEREM', tabBootstrap.MetricsSuites.commands, metricsParams);
        var localCommandSeqID = this._commandSequenceId;
        var internalSuccess = ss.Delegate.create(this, function(o) {
            mc.close();
            if (ss.isValue(this.__commmandSucceeded)) {
                this.__commmandSucceeded(localCommandSeqID, c, o);
            }
            var pm = tab.PresentationModel.fromCommand(o, c);
            success(pm);
        });
        var internalFailure = ss.Delegate.create(this, function(x) {
            mc.close();
            if (ss.isValue(this.__commandFailed)) {
                this.__commandFailed(localCommandSeqID, c, x);
            }
            failure(x);
        });
        tab.Log.get(this).debug('Executing command %o', c);
        this._session.executeServerCommand(c, internalSuccess, internalFailure);
        ++this._commandSequenceId;
    },
    
    installCommandThrottling: function tab__baseSessionCommandHandler$installCommandThrottling(commandNS, commandName, throttleRate, pendingCommandThreshold, pendingCommandDelay) {
        var throttlerKey = commandNS.toString() + '-' + commandName.toString();
        if (Object.keyExists(this._commandThrottlers, throttlerKey)) {
            return false;
        }
        var throttler = new tab._commandThrottler(this, commandNS, commandName, throttleRate, pendingCommandThreshold, pendingCommandDelay);
        throttler.add_commandDropped(ss.Delegate.create(this, this._handleDroppedCommand));
        this._commandThrottlers[throttlerKey] = throttler;
        return true;
    },
    
    _handleDroppedCommand: function tab__baseSessionCommandHandler$_handleDroppedCommand(c, success, failure) {
        if (ss.isValue(this.__commandFailed)) {
            this.__commandFailed(0, c, null);
        }
        failure(null);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ClientCommand

tab.ClientCommand = function tab_ClientCommand(uiBlockType, doLocal, remoteCommand, successCallback, errorCallback) {
    this._uiBlockType = uiBlockType;
    this._sequence = 'remoteFirst';
    this.hasLocalComponent = ss.isValue(doLocal);
    this.hasRemoteComponent = ss.isValue(remoteCommand);
    this.doLocalWork = doLocal;
    this._commandRecords = [];
    if (this.hasRemoteComponent) {
        this._commandRecords.enqueue(new tab.CommandRecord(remoteCommand, successCallback, errorCallback));
        this._commandName = remoteCommand.commandName;
    }
    this.doRemoteWork = ss.Delegate.create(this, this._executeNextRemoteCommand);
}
tab.ClientCommand.prototype = {
    doRemoteWork: null,
    doLocalWork: null,
    _uiBlockType: null,
    _sequence: null,
    _commandRecords: null,
    _commandName: 'Unknown',
    hasLocalComponent: false,
    hasRemoteComponent: false,
    
    get_blockType: function tab_ClientCommand$get_blockType() {
        return this._uiBlockType;
    },
    
    get_isOneAtATime: function tab_ClientCommand$get_isOneAtATime() {
        return false;
    },
    
    get_commandName: function tab_ClientCommand$get_commandName() {
        return this._commandName;
    },
    set_commandName: function tab_ClientCommand$set_commandName(value) {
        this._commandName = value;
        return value;
    },
    
    get_hasLocalComponent: function tab_ClientCommand$get_hasLocalComponent() {
        return this.hasLocalComponent;
    },
    
    get_hasRemoteComponent: function tab_ClientCommand$get_hasRemoteComponent() {
        return this.hasRemoteComponent;
    },
    
    execute: function tab_ClientCommand$execute(t, cc, onComplete) {
        if (this._sequence === 'localFirst') {
            this.executeLocal(t);
            this.executeRemote(cc, onComplete);
        }
        else if (this._sequence === 'remoteFirst') {
            this.executeRemote(cc, onComplete);
            this.executeLocal(t);
        }
        if (!ss.isValue(this.doRemoteWork) && ss.isValue(onComplete)) {
            onComplete(true);
        }
    },
    
    executeLocal: function tab_ClientCommand$executeLocal(t) {
        if (ss.isValue(this.doLocalWork)) {
            var mc = tabBootstrap.MetricsController.get_instance().createContext('EXELOC', tabBootstrap.MetricsSuites.commands, this.buildCommandMetricsParameters());
            this.doLocalWork(t);
            mc.close();
        }
    },
    
    executeRemote: function tab_ClientCommand$executeRemote(cc, onComplete) {
        if (ss.isValue(this.doRemoteWork)) {
            this.doRemoteWork(cc, function(succeeded) {
                if (ss.isValue(onComplete)) {
                    onComplete(succeeded);
                }
            });
        }
    },
    
    buildCommandMetricsParameters: function tab_ClientCommand$buildCommandMetricsParameters() {
        var metricsParams = {};
        metricsParams['cn'] = this.get_commandName();
        return metricsParams;
    },
    
    enqueueCommand: function tab_ClientCommand$enqueueCommand(cmdRec) {
        this._commandRecords.enqueue(cmdRec);
    },
    
    handleRemoteCommandSuccess: function tab_ClientCommand$handleRemoteCommandSuccess(command, pm) {
        if (ss.isValue(command.get_successCallback())) {
            command.get_successCallback()(pm);
        }
    },
    
    handleRemoteCommandFailure: function tab_ClientCommand$handleRemoteCommandFailure(command, o) {
        if (ss.isValue(command.get_errorCallback())) {
            command.get_errorCallback()(o);
        }
    },
    
    _executeNextRemoteCommand: function tab_ClientCommand$_executeNextRemoteCommand(cc, completed) {
        if (!this._commandRecords.length) {
            if (ss.isValue(completed)) {
                completed(true);
            }
            return;
        }
        var cmdRec = this._commandRecords.dequeue();
        var cmd = cmdRec.get_commandToExececute();
        if (ss.isNullOrUndefined(cmd)) {
            if (ss.isValue(completed)) {
                completed(true);
            }
            return;
        }
        cc.executeCommand(cmd, ss.Delegate.create(this, function(pm) {
            try {
                this.handleRemoteCommandSuccess(cmdRec, pm);
            }
            finally {
                this._executeNextRemoteCommand(cc, completed);
            }
        }), ss.Delegate.create(this, function(o) {
            try {
                this.handleRemoteCommandFailure(cmdRec, o);
            }
            finally {
                if (ss.isValue(completed)) {
                    completed(false);
                }
            }
        }));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyClientCommand

tab.LegacyClientCommand = function tab_LegacyClientCommand(doLocal, doRemote, uiBlockType) {
    tab.LegacyClientCommand.initializeBase(this, [ uiBlockType, doLocal, null ]);
    this.doRemoteWork = doRemote;
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandRecord

tab.CommandRecord = function tab_CommandRecord(remoteCommand, successCallback, errorCallback) {
    this._command = remoteCommand;
    this._successCallback = successCallback;
    this._errorCallback = errorCallback;
}
tab.CommandRecord.prototype = {
    _command: null,
    _successCallback: null,
    _errorCallback: null,
    
    get_commandToExececute: function tab_CommandRecord$get_commandToExececute() {
        return this._command;
    },
    
    get_successCallback: function tab_CommandRecord$get_successCallback() {
        return this._successCallback;
    },
    
    get_errorCallback: function tab_CommandRecord$get_errorCallback() {
        return this._errorCallback;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandPermission

tab.CommandPermission = function tab_CommandPermission(availableTypes) {
    this._availableCommands = {};
    var $enum1 = ss.IEnumerator.getEnumerator(availableTypes);
    while ($enum1.moveNext()) {
        var availableType = $enum1.current;
        this._availableCommands[availableType.toString()] = 'granted';
    }
}
tab.CommandPermission.prototype = {
    _availableCommands: null,
    
    test: function tab_CommandPermission$test(command) {
        tab.Param.verifyValue(command, 'command');
        if (ss.isNullOrUndefined(command.commandType)) {
            tab.Log.get(this).debug('Command type not defined for %s. Perhaps we need to add that command type?', command.name);
        }
        return ss.isValue(command.commandType) && Object.keyExists(this._availableCommands, command.commandType.toString()) && this._availableCommands[command.commandType.toString()] === 'granted';
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandSerializer

tab.CommandSerializer = function tab_CommandSerializer() {
}
tab.CommandSerializer.get__log = function tab_CommandSerializer$get__log() {
    return tab.Logger.lazyGetLogger(tab.CommandSerializer);
}
tab.CommandSerializer.buildDocCommandName = function tab_CommandSerializer$buildDocCommandName(command) {
    return tab.CommandSerializer.buildQualifiedCommandName('tabdoc', command);
}
tab.CommandSerializer.buildQualifiedCommandName = function tab_CommandSerializer$buildQualifiedCommandName(commandNamespace, command) {
    return commandNamespace + ':' + command;
}
tab.CommandSerializer.deserialize = function tab_CommandSerializer$deserialize(serializedCommand) {
    var commandRegex = new RegExp('^(\\w+):([\\w-]+)( ((.|\n)*))?$');
    var matches = commandRegex.exec(serializedCommand);
    if (ss.isNullOrUndefined(matches) || !matches.length) {
        tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Unable to parse command: %s'), serializedCommand);
        return null;
    }
    var command = {};
    command.commandNamespace = matches[1];
    command.commandName = matches[2];
    tab.CommandSerializer._deserializeParams(command, matches[4]);
    tab.CommandSerializer.get__log().debug('Deserialized a command: %s:%s params=%o', command.commandNamespace, command.commandName, command.commandParams);
    return command;
}
tab.CommandSerializer.getCommandType = function tab_CommandSerializer$getCommandType(command) {
    if (Object.keyExists(tab.CommandSerializer._typesByName, command.commandName)) {
        return tab.CommandSerializer._typesByName[command.commandName];
    }
    else {
        return null;
    }
}
tab.CommandSerializer._deserializeParams = function tab_CommandSerializer$_deserializeParams(command, paramsString) {
    if (String.isNullOrEmpty(paramsString)) {
        tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Empty paramters'));
        return;
    }
    var sb = new ss.StringBuilder();
    var paramChars = [];
    for (var i = paramsString.length - 1; i >= 0; i--) {
        paramChars.push(paramsString.charAt(i));
    }
    while (paramChars.length > 0) {
        var paramName = tab.CommandSerializer._parseParamName(paramChars, sb);
        if (ss.isNullOrUndefined(paramName)) {
            return;
        }
        var paramValue = tab.CommandSerializer._parseParamValue(paramChars, sb);
        if (ss.isNullOrUndefined(paramValue)) {
            return;
        }
        if (paramValue === '{}') {
            tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Skipping empty parameter value: %s=%s'), paramName, paramValue);
            continue;
        }
        if (ss.isNullOrUndefined(command.commandParams)) {
            command.commandParams = {};
        }
        command.commandParams[paramName.trim()] = paramValue;
    }
}
tab.CommandSerializer._parseParamName = function tab_CommandSerializer$_parseParamName(paramString, sb) {
    sb.clear();
    var nextLetterIsCapital = false;
    while (paramString.length > 0) {
        var value = paramString.pop();
        switch (value) {
            case '=':
                return sb.toString();
            case '-':
                nextLetterIsCapital = true;
                break;
            default:
                if (nextLetterIsCapital) {
                    sb.append(String.fromChar(value, 1).toUpperCase());
                    nextLetterIsCapital = false;
                }
                else {
                    sb.append(value);
                }
                break;
        }
    }
    return null;
}
tab.CommandSerializer._parseParamValue = function tab_CommandSerializer$_parseParamValue(paramString, sb) {
    sb.clear();
    var context = [];
    var valIsString = paramString.length > 1 && paramString.peek() === '"';
    while (paramString.length > 0) {
        var value = paramString.pop();
        var keepValue = true;
        switch (value) {
            case '\\':
                if (valIsString) {
                    if (context.peek() !== '\\') {
                        context.push('\\');
                        keepValue = false;
                    }
                    else {
                        context.pop();
                    }
                }
                break;
            case '"':
                if (context.peek() === '\\') {
                    context.pop();
                }
                else if (context.peek() === '"') {
                    context.pop();
                    if (!context.length) {
                        keepValue = false;
                    }
                }
                else {
                    if (!context.length) {
                        keepValue = false;
                    }
                    context.push('"');
                }
                break;
            case '[':
                if (context.peek() === '"') {
                    tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Ignoring [ inside a string'));
                }
                else {
                    context.push('[');
                }
                break;
            case ']':
                if (context.peek() === '"') {
                    tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Ignoring ] inside a string'));
                }
                else if (context.peek() !== '[') {
                    tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Mismatched ]'));
                }
                else {
                    context.pop();
                }
                break;
            case '{':
                if (context.peek() === '"') {
                    tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Ignoring { inside a string'));
                }
                else {
                    context.push('{');
                }
                break;
            case '}':
                if (context.peek() === '"') {
                    tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Ignoring } inside a string'));
                }
                else if (context.peek() !== '{') {
                    tab.CommandSerializer.get__log().debug(tab.Strings.noLoc('Mismatched }'));
                }
                else {
                    context.pop();
                }
                break;
            default:
                if (context.peek() === '\\') {
                    context.pop();
                }
                break;
        }
        if (keepValue) {
            sb.append(value);
        }
        if (!context.length) {
            return sb.toString();
        }
    }
    return null;
}


////////////////////////////////////////////////////////////////////////////////
// tab.shell

tab.shell = function tab_shell() {
}
tab.shell.run = function tab_shell$run(cmdString) {
    var cmd = tab.CommandSerializer.deserialize(cmdString);
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(cmd, 'immediately'));
}
tab.shell.runJSON = function tab_shell$runJSON(ns, cmdName, parameters) {
    var cmd = {};
    cmd.commandNamespace = ns;
    cmd.commandName = cmdName;
    cmd.commandParams = parameters;
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(cmd, 'immediately'));
}
tab.shell.launch = function tab_shell$launch() {
    var simpleCmd = window.top.prompt('Tableau command console', 'tabdoc:undo');
    tab.shell.run(simpleCmd);
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandsPresModelWrapper

tab.CommandsPresModelWrapper = function tab_CommandsPresModelWrapper(commandsPM) {
    this._model = commandsPM;
}
tab.CommandsPresModelWrapper.create = function tab_CommandsPresModelWrapper$create(pm) {
    if (!ss.isValue(pm)) {
        return null;
    }
    return new tab.CommandsPresModelWrapper(pm);
}
tab.CommandsPresModelWrapper.prototype = {
    _model: null,
    
    get_presModel: function tab_CommandsPresModelWrapper$get_presModel() {
        return this._model;
    },
    
    get_commandItems: function tab_CommandsPresModelWrapper$get_commandItems() {
        return this._model.commandItems;
    },
    set_commandItems: function tab_CommandsPresModelWrapper$set_commandItems(value) {
        this._model.commandItems = value;
        return value;
    },
    
    get_defaultItem: function tab_CommandsPresModelWrapper$get_defaultItem() {
        return this._model.defaultItem;
    },
    set_defaultItem: function tab_CommandsPresModelWrapper$set_defaultItem(value) {
        this._model.defaultItem = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandItemWrapper

tab.CommandItemWrapper = function tab_CommandItemWrapper(itemModel) {
    this._item = itemModel;
}
tab.CommandItemWrapper.create = function tab_CommandItemWrapper$create(item) {
    if (!ss.isValue(item)) {
        return null;
    }
    return new tab.CommandItemWrapper(item);
}
tab.CommandItemWrapper.prototype = {
    _item: null,
    
    get_item: function tab_CommandItemWrapper$get_item() {
        return this._item;
    },
    
    get_name: function tab_CommandItemWrapper$get_name() {
        return this._item.name;
    },
    set_name: function tab_CommandItemWrapper$set_name(value) {
        this._item.name = value;
        return value;
    },
    
    get_description: function tab_CommandItemWrapper$get_description() {
        return this._item.description;
    },
    set_description: function tab_CommandItemWrapper$set_description(value) {
        this._item.description = value;
        return value;
    },
    
    get_commandsType: function tab_CommandItemWrapper$get_commandsType() {
        return this._item.commandsType;
    },
    set_commandsType: function tab_CommandItemWrapper$set_commandsType(value) {
        this._item.commandsType = value;
        return value;
    },
    
    get_enabled: function tab_CommandItemWrapper$get_enabled() {
        return this._item.state;
    },
    set_enabled: function tab_CommandItemWrapper$set_enabled(value) {
        this._item.state = value;
        return value;
    },
    
    get_isChecked: function tab_CommandItemWrapper$get_isChecked() {
        return this._item.isChecked;
    },
    set_isChecked: function tab_CommandItemWrapper$set_isChecked(value) {
        this._item.isChecked = value;
        return value;
    },
    
    get_isDefault: function tab_CommandItemWrapper$get_isDefault() {
        return this._item.isDefault;
    },
    set_isDefault: function tab_CommandItemWrapper$set_isDefault(value) {
        this._item.isDefault = value;
        return value;
    },
    
    get_isRadioOn: function tab_CommandItemWrapper$get_isRadioOn() {
        return this._item.isRadioOn;
    },
    set_isRadioOn: function tab_CommandItemWrapper$set_isRadioOn(value) {
        this._item.isRadioOn = value;
        return value;
    },
    
    get_isVisible: function tab_CommandItemWrapper$get_isVisible() {
        return this._item.isVisible;
    },
    set_isVisible: function tab_CommandItemWrapper$set_isVisible(value) {
        this._item.isVisible = value;
        return value;
    },
    
    get_commands: function tab_CommandItemWrapper$get_commands() {
        return this._item.commands;
    },
    set_commands: function tab_CommandItemWrapper$set_commands(value) {
        this._item.commands = value;
        return value;
    },
    
    get_command: function tab_CommandItemWrapper$get_command() {
        return this._item.command;
    },
    set_command: function tab_CommandItemWrapper$set_command(value) {
        this._item.command = value;
        return value;
    },
    
    get_argumentParams: function tab_CommandItemWrapper$get_argumentParams() {
        return this._item.argumentParams;
    },
    set_argumentParams: function tab_CommandItemWrapper$set_argumentParams(value) {
        this._item.argumentParams = value;
        return value;
    },
    
    get_iconRes: function tab_CommandItemWrapper$get_iconRes() {
        return this._item.iconRes;
    },
    set_iconRes: function tab_CommandItemWrapper$set_iconRes(value) {
        this._item.iconRes = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._commandThrottler

tab._commandThrottler = function tab__commandThrottler(handler, commandNS, command, rate, pendingCommandThreshold, pendingCommandDelay) {
    this._commandHandler = handler;
    this._commandNamespace = commandNS;
    this._commandName = command;
    this._throttleRate = rate;
    this._pendingCommandThreshold = (pendingCommandThreshold || 1);
    this._pendingCommandDelay = (pendingCommandDelay || 35);
}
tab._commandThrottler.prototype = {
    _commandHandler: null,
    _commandNamespace: null,
    _commandName: null,
    _throttleRate: 0,
    _pendingCommandDelay: 0,
    _pendingCommandThreshold: 0,
    _queuedCommand: null,
    _queuedSuccessCallback: null,
    _queuedFailureCallback: null,
    _lastCommandTime: 0,
    _throttleTimer: null,
    _pendingCommandCount: 0,
    _currentlyExecuting: false,
    
    add_commandDropped: function tab__commandThrottler$add_commandDropped(value) {
        this.__commandDropped = ss.Delegate.combine(this.__commandDropped, value);
    },
    remove_commandDropped: function tab__commandThrottler$remove_commandDropped(value) {
        this.__commandDropped = ss.Delegate.remove(this.__commandDropped, value);
    },
    
    __commandDropped: null,
    
    processCommand: function tab__commandThrottler$processCommand(command, success, failure) {
        if (command.commandNamespace !== this._commandNamespace || command.commandName !== this._commandName) {
            return 1;
        }
        if (this._currentlyExecuting) {
            return 1;
        }
        if (ss.isValue(this._queuedCommand) && ss.isValue(this._throttleTimer)) {
            this._notifyDropCommand(this._queuedCommand, this._queuedSuccessCallback, this._queuedFailureCallback);
            this._queuedCommand = command;
            this._queuedSuccessCallback = success;
            this._queuedFailureCallback = failure;
            return 0;
        }
        var now = Math.floor(tabBootstrap.MetricsController.getTiming());
        var timeDelta = now - this._lastCommandTime;
        if (this._throttleRate !== -1 && timeDelta < this._throttleRate) {
            this._queuePendingCommand(command, success, failure, this._throttleRate - timeDelta);
        }
        else if (this._pendingCommandThreshold !== -1 && this._pendingCommandCount >= this._pendingCommandThreshold) {
            this._queuePendingCommand(command, success, failure, this._pendingCommandDelay * this._pendingCommandCount);
        }
        else {
            this._currentlyExecuting = true;
            ++this._pendingCommandCount;
            try {
                this._commandHandler.executeCommand(command, ss.Delegate.create(this, function(pm) {
                    if (this._pendingCommandCount > 0) {
                        --this._pendingCommandCount;
                    }
                    success(pm);
                }), ss.Delegate.create(this, function(e) {
                    if (this._pendingCommandCount > 0) {
                        --this._pendingCommandCount;
                    }
                    failure(e);
                }));
            }
            finally {
                this._currentlyExecuting = false;
                this._lastCommandTime = now;
            }
        }
        return 0;
    },
    
    _executePendingCommand: function tab__commandThrottler$_executePendingCommand() {
        var pendingCommand = this._queuedCommand;
        var pendingSuccess = this._queuedSuccessCallback;
        var pendingFailure = this._queuedFailureCallback;
        this._queuedCommand = null;
        this._queuedSuccessCallback = null;
        this._queuedFailureCallback = null;
        if (!ss.isValue(pendingCommand)) {
            return;
        }
        this._commandHandler.executeCommand(pendingCommand, pendingSuccess, pendingFailure);
    },
    
    _queuePendingCommand: function tab__commandThrottler$_queuePendingCommand(command, success, failure, timeout) {
        ss.Debug.assert(ss.isNull(this._throttleTimer), 'Expected throttle timer to be null');
        ss.Debug.assert(ss.isNull(this._queuedCommand), 'Expected queued command to be null');
        this._queuedCommand = command;
        this._queuedSuccessCallback = success;
        this._queuedFailureCallback = failure;
        this._throttleTimer = window.setTimeout(ss.Delegate.create(this, function() {
            this._throttleTimer = null;
            this._executePendingCommand();
        }), timeout);
    },
    
    _notifyDropCommand: function tab__commandThrottler$_notifyDropCommand(command, successCallback, failureCallback) {
        if (ss.isValue(this.__commandDropped)) {
            this.__commandDropped(command, successCallback, failureCallback);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CompositeClientCommand

tab.CompositeClientCommand = function tab_CompositeClientCommand(uiBlockType, commands) {
    tab.CompositeClientCommand.initializeBase(this, [ uiBlockType, null, null ]);
    this._commandsToRun$1 = [];
    var $enum1 = ss.IEnumerator.getEnumerator(commands);
    while ($enum1.moveNext()) {
        var cmd = $enum1.current;
        if (ss.isValue(cmd)) {
            this._commandsToRun$1.push(cmd);
            this.hasLocalComponent = this.hasLocalComponent || cmd.get_hasLocalComponent();
            this.hasRemoteComponent = this.hasRemoteComponent || cmd.get_hasRemoteComponent();
        }
    }
}
tab.CompositeClientCommand.prototype = {
    _commandsToRun$1: null,
    
    get_commandName: function tab_CompositeClientCommand$get_commandName() {
        return 'Composite';
    },
    
    executeLocal: function tab_CompositeClientCommand$executeLocal(t) {
        var $enum1 = ss.IEnumerator.getEnumerator(this._commandsToRun$1);
        while ($enum1.moveNext()) {
            var command = $enum1.current;
            command.executeLocal(t);
        }
    },
    
    executeRemote: function tab_CompositeClientCommand$executeRemote(cc, onComplete) {
        var cmdIndex = 0;
        this._executeRemoteClientCommandHelper$1(cc, function(succeeded) {
            if (ss.isValue(onComplete)) {
                onComplete(succeeded);
            }
        }, cmdIndex);
    },
    
    _executeRemoteClientCommandHelper$1: function tab_CompositeClientCommand$_executeRemoteClientCommandHelper$1(cc, onComplete, cmdIndex) {
        if (cmdIndex >= this._commandsToRun$1.length) {
            onComplete(true);
            return;
        }
        var command = this._commandsToRun$1[cmdIndex];
        command.executeRemote(cc, ss.Delegate.create(this, function(success) {
            if (!success) {
                onComplete(false);
            }
            else {
                this._executeRemoteClientCommandHelper$1(cc, onComplete, cmdIndex + 1);
            }
        }));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DeferLayoutImpl

tab.DeferLayoutImpl = function tab_DeferLayoutImpl() {
}
tab.DeferLayoutImpl.get_instance = function tab_DeferLayoutImpl$get_instance() {
    if (ss.isNullOrUndefined(tab.DeferLayoutImpl._instance)) {
        tab.DeferLayoutImpl._instance = new tab.DeferLayoutImpl();
    }
    return tab.DeferLayoutImpl._instance;
}
tab.DeferLayoutImpl.prototype = {
    _shouldDeferLayoutUpdates: false,
    _isZoomin: false,
    
    get_isZoomin: function tab_DeferLayoutImpl$get_isZoomin() {
        return this._isZoomin;
    },
    set_isZoomin: function tab_DeferLayoutImpl$set_isZoomin(value) {
        this._isZoomin = value;
        return value;
    },
    
    shouldDeferLayoutUpdates: function tab_DeferLayoutImpl$shouldDeferLayoutUpdates() {
        return this._shouldDeferLayoutUpdates;
    },
    
    setDeferLayoutUpdates: function tab_DeferLayoutImpl$setDeferLayoutUpdates(b) {
        this._shouldDeferLayoutUpdates = b;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.EventMap

tab.EventMap = function tab_EventMap() {
}
tab.EventMap.prototype = {
    
    get__length: function tab_EventMap$get__length() {
        return Object.getKeyCount(tab.EventMap._map);
    },
    get_item: function tab_EventMap$get_item(eventName) {
        return tab.EventMap._map[eventName];
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._localClientCommand

tab._localClientCommand = function tab__localClientCommand(doLocal) {
    tab._localClientCommand.initializeBase(this, [ 'none', doLocal, null ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.PermissionManager

tab.PermissionManager = function tab_PermissionManager() {
}
tab.PermissionManager.buildCommandPermission = function tab_PermissionManager$buildCommandPermission() {
    var types = [];
    if (tsConfig.allow_filter) {
        types.add(11);
        types.add(12);
        types.add(10);
        types.add(2);
        types.add(13);
        types.add(4);
        types.add(6);
    }
    if (tsConfig.allow_select) {
        types.add(1);
        types.add(9);
    }
    if (tsConfig.allow_sheetlink) {
        types.add(8);
    }
    if (tsConfig.allow_view_underlying || tsConfig.allow_summary) {
        types.add(7);
    }
    if (tsConfig.is_authoring) {
        types.add(15);
        types.add(17);
        types.add(18);
        types.add(19);
        types.add(20);
        if (tab.FeatureFlags.isEnabled('ConstantRefLineQuickEditor') && !tsConfig.is_mobile) {
            types.add(21);
        }
    }
    return new tab.CommandPermission(types);
}
tab.PermissionManager.filterCommands = function tab_PermissionManager$filterCommands(commands, permission) {
    for (var i = commands.length - 1; i >= 0; i--) {
        if (!permission.test(commands[i])) {
            tab.Log.get(tab.PermissionManager).debug('Permission denied for %o', commands[i]);
            commands.removeAt(i);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PresentationModel

tab.PresentationModel = function tab_PresentationModel() {
}
tab.PresentationModel.commandResultByName = function tab_PresentationModel$commandResultByName(response, c) {
    ss.Debug.assert(ss.isValue(response.vqlCmdResponse), 'The server response is not a VqlCommandResponseRoot object.');
    var fullName = tab.CommandSerializer.buildQualifiedCommandName(c.commandNamespace, c.commandName);
    var commandResponse = response.vqlCmdResponse;
    var commandResults = commandResponse.cmdResultList;
    var $enum1 = ss.IEnumerator.getEnumerator(commandResults);
    while ($enum1.moveNext()) {
        var result = $enum1.current;
        if (result.commandName === fullName) {
            return result.commandReturn;
        }
    }
    return null;
}
tab.PresentationModel.fromCommand = function tab_PresentationModel$fromCommand(response, c) {
    var root = tab.PresentationModel.commandResultByName(response, c);
    if (ss.isValue(root) && Object.getKeyCount(root) === 1) {
        var $dict1 = root;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            return entry.value;
        }
    }
    else {
        return root;
    }
    return null;
}
tab.PresentationModel.ensurePath = function tab_PresentationModel$ensurePath(sourcePM, destPM, path) {
    var currentDestPM = destPM;
    var currentSourcePM = sourcePM;
    var nextPM;
    var nextSourcePM;
    var pathList = path.get_pathList();
    for (var i = 0, len = pathList.length; i < len; i++) {
        var currentItem = pathList[i];
        var currName = currentItem.name;
        nextPM = currentDestPM[currName];
        nextSourcePM = (ss.isValue(currentSourcePM)) ? currentSourcePM[currName] : null;
        if (!ss.isValue(nextPM)) {
            var last = i === len - 1;
            var newPM = null;
            if (currentItem.type === 1 && ss.isValue(nextSourcePM)) {
                var sourceArray = nextSourcePM;
                var newArray = [];
                for (var index = 0; index < sourceArray.length; index++) {
                    newArray[index] = tab.MiscUtil.cloneObject(sourceArray[index]);
                }
                newPM = newArray;
            }
            else if (!last && ss.isValue(nextSourcePM)) {
                newPM = tab.PresentationModel.cloneObjWithScalarsOnly(nextSourcePM);
            }
            else {
                newPM = {};
            }
            currentDestPM[currName] = newPM;
        }
        currentDestPM = currentDestPM[currName];
        currentSourcePM = nextSourcePM;
    }
    return currentDestPM;
}
tab.PresentationModel.insertAtPath = function tab_PresentationModel$insertAtPath(sourcePM, destPM, path, newPM) {
    tab.PresentationModel.ensurePath(sourcePM, destPM, path);
    tab.PresentationModel._setPath(destPM, path, newPM);
}
tab.PresentationModel.cloneObjWithScalarsOnly = function tab_PresentationModel$cloneObjWithScalarsOnly(sourceObj) {
    if (!_.isObject(sourceObj)) {
        return sourceObj;
    }
    var clone = {};
    var sourcePMDict = sourceObj;
    var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(sourcePMDict));
    while ($enum1.moveNext()) {
        var sourceKey = $enum1.current;
        var elt = sourcePMDict[sourceKey];
        if (!_.isObject(elt)) {
            clone[sourceKey] = elt;
        }
    }
    return clone;
}
tab.PresentationModel._setPath = function tab_PresentationModel$_setPath(pm, path, newPM) {
    if (!path.get_pathList().length) {
        var newPmKeys = newPM;
        var $dict1 = newPmKeys;
        for (var $key2 in $dict1) {
            var p = { key: $key2, value: $dict1[$key2] };
            pm[p.key] = p.value;
        }
    }
    else {
        var i, len;
        var currentPresModel = pm;
        var pathList = path.get_pathList();
        for (i = 0, len = pathList.length; i < len - 1; i++) {
            currentPresModel = currentPresModel[pathList[i].name];
        }
        currentPresModel[pathList[len - 1].name] = newPM;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PresModelPathItem

tab.PresModelPathItem = function tab_PresModelPathItem(name, type) {
    this.name = name;
    if (ss.isValue(type)) {
        this.type = type;
    }
    else {
        this.type = 0;
    }
}
tab.PresModelPathItem.prototype = {
    name: null,
    type: 0
}


////////////////////////////////////////////////////////////////////////////////
// tab.PresModelPath

tab.PresModelPath = function tab_PresModelPath() {
    this._path = [];
}
tab.PresModelPath.prototype = {
    
    get_pathList: function tab_PresModelPath$get_pathList() {
        return this._path;
    },
    
    get_enumerator: function tab_PresModelPath$get_enumerator() {
        return this._path.getEnumerator();
    },
    
    add: function tab_PresModelPath$add(s) {
        this._path.add(s);
    },
    
    reverse: function tab_PresModelPath$reverse() {
        this._path.reverse();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SimpleCommandsPresModelWrapper

tab.SimpleCommandsPresModelWrapper = function tab_SimpleCommandsPresModelWrapper(commandsPM) {
    this._model = commandsPM;
}
tab.SimpleCommandsPresModelWrapper.create = function tab_SimpleCommandsPresModelWrapper$create(pm) {
    if (ss.isNullOrUndefined(pm)) {
        return null;
    }
    return new tab.SimpleCommandsPresModelWrapper(pm);
}
tab.SimpleCommandsPresModelWrapper.prototype = {
    _model: null,
    
    get_simpleCommand: function tab_SimpleCommandsPresModelWrapper$get_simpleCommand() {
        return this._model.simpleCommand;
    },
    set_simpleCommand: function tab_SimpleCommandsPresModelWrapper$set_simpleCommand(value) {
        this._model.simpleCommand = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.UbertipSerializer

tab.UbertipSerializer = function tab_UbertipSerializer() {
}
tab.UbertipSerializer.deserializeUbertip = function tab_UbertipSerializer$deserializeUbertip(ubertip) {
    if (ss.isNullOrUndefined(ubertip)) {
        return null;
    }
    var commandModels = [];
    var subcommandItemWrappers = [];
    var commandsAndSubcommands = [];
    if (ss.isValue(ubertip.commands)) {
        tab.UbertipSerializer._collectCommandsAndSubcommands(ubertip.commands, commandModels, subcommandItemWrappers, commandsAndSubcommands);
    }
    var actionModels = [];
    if (ss.isValue(ubertip.actions)) {
        tab.UbertipSerializer._collectCommands(ubertip.actions, actionModels, 0);
    }
    var model = tab.$create_UbertipModel();
    model.tooltipHtml = tab.UbertipSerializer._nullIfEmpty(ubertip.htmlTooltip);
    model.selectionHtml = tab.UbertipSerializer._nullIfEmpty(ubertip.htmlSelection);
    model.overlayImage = tab.UbertipSerializer._nullIfEmpty(ubertip.overlayImage);
    model.overlayImageKey = tab.UbertipSerializer._nullIfEmpty(ubertip.overlayImageKey);
    model.tupleId = ubertip.tupleId;
    model.imageRegion = ubertip.r;
    if (!!model.tupleId) {
        model.interactedTupleId = model.tupleId;
    }
    model.tupleSelected = (ubertip.tupleSelected || false);
    model.refLineSelected = (ubertip.refLineSelected || false);
    model.trendLineSelected = (ubertip.trendLineSelected || false);
    model.isExplicitlyEmpty = (ubertip.isEmpty || false);
    model.tooltipOffset = tab.PointUtil.fromPresModel(ubertip.tooltipOffset);
    model.commands = commandModels;
    model.subcommands = subcommandItemWrappers;
    model.commandsAndSubcommands = commandsAndSubcommands;
    model.actions = actionModels;
    if (ss.isValue(model.overlayImage) || ss.isValue(model.overlayImageKey)) {
        var overlayCount = ubertip.overlayAnchors.length;
        model.overlayAnchors = new Array(overlayCount);
        for (var ii = 0; ii < overlayCount; ++ii) {
            var pointPM = ubertip.overlayAnchors[ii];
            var point = tab.PointUtil.fromPresModel(pointPM);
            model.overlayAnchors[ii] = tab.$create_PointF(point.x, point.y);
        }
    }
    tab.UbertipSerializer._addImplicitCommands(ubertip, commandModels, commandsAndSubcommands, true);
    if (ss.isValue(model.tooltipHtml) || ss.isValue(model.selectionHtml) || commandModels.length > 0 || actionModels.length > 0) {
        return model;
    }
    return null;
}
tab.UbertipSerializer.createLocalUberTipModel = function tab_UbertipSerializer$createLocalUberTipModel(visualModel, localInfo, isAuthoring) {
    var interactedTupleIds = localInfo.get_interactedTupleIds();
    var affectedTupleIds = localInfo.get_affectedTupleIds();
    var paneDescriptorKey = localInfo.get_paneDescriptorKey();
    var vizDataModel = visualModel.get_vizDataModel();
    if (ss.isNullOrUndefined(vizDataModel)) {
        return null;
    }
    var uberData = vizDataModel.get_ubertipData();
    ss.Debug.assert(paneDescriptorKey != null, 'Should always have pane descriptor key');
    var uberPaneData = tab.UbertipSerializer._getUberTipPaneData(uberData, paneDescriptorKey);
    ss.Debug.assert(uberPaneData != null, 'Should always get an uberPaneData');
    var dataDictionary = tab.ApplicationModel.get_instance().get_dataDictionary();
    var html = null;
    var interactedTupleId;
    var isExplicitlyEmpty = !uberPaneData.htmlTooltip.toString().length;
    if (interactedTupleIds.length === 1) {
        html = tab.UbertipSerializer._processUbertipData(dataDictionary, uberPaneData, vizDataModel, interactedTupleIds);
        interactedTupleId = interactedTupleIds[0];
    }
    else {
        interactedTupleId = 0;
    }
    var selectionHtml = null;
    var multipleTuplesInEffect = false;
    if (affectedTupleIds.length > 1 && uberPaneData.showButtons) {
        multipleTuplesInEffect = true;
        selectionHtml = tab.UbertipSerializer._getSelectionHtml(dataDictionary, vizDataModel, affectedTupleIds, uberPaneData.summaryField);
    }
    var commands = [];
    var tupleIdForCommand = (affectedTupleIds.length > 1) ? 0 : affectedTupleIds[0];
    if (tupleIdForCommand < 0) {
        tupleIdForCommand = 0;
    }
    var placeHolders = [];
    if (uberPaneData.showButtons && vizDataModel.hasDimensionColumnNotMeasureNames()) {
        if (tab.VizDataUtils.hasTupleWithNonTotalValue(vizDataModel, dataDictionary, affectedTupleIds)) {
            tab.UbertipSerializer._collectCommands(uberData.standardCommands, commands, tupleIdForCommand);
        }
        if (multipleTuplesInEffect) {
            tab.UbertipSerializer._collectCommands(uberData.multiselectCommands, commands, tupleIdForCommand);
        }
        commands = commands.filter(function(cm) {
            return cm.commandType !== 10;
        });
        tab.UbertipSerializer._addImplicitCommands(null, commands, null, false);
        if (isAuthoring) {
            var groupCmd = tab.$create_CommandModel();
            groupCmd.commandType = 10;
            groupCmd.imageRes = tab.TabResources.lookupResourceAlias('TQRC_SPLIT');
            groupCmd.name = '';
            if (tsConfig.is_mobile) {
                var mergeStr = tab.Strings.UbertipMergeMobile;
                var splitStr = tab.Strings.UbertipSplitMobile;
                groupCmd.description = (splitStr.length > mergeStr.length) ? splitStr : mergeStr;
            }
            placeHolders.add(groupCmd);
        }
    }
    var actionPMs = tab.ActionUtils.getApplicableActions(visualModel.get_visualId().worksheet, 'explicitly');
    actionPMs = _.filter(actionPMs, function(action) {
        if (action.activation === 'explicitly' && tab.ActionUtils.getActionType(action) !== 'url' && !action.targetWorksheets.length) {
            return false;
        }
        return true;
    });
    if (ss.isValue(html) || ss.isValue(selectionHtml) || commands.length > 0 || actionPMs.length > 0) {
        var model = tab.$create_UbertipModel();
        model.tooltipHtml = html;
        model.selectionHtml = selectionHtml;
        model.tupleId = tupleIdForCommand;
        model.interactedTupleId = interactedTupleId;
        model.isExplicitlyEmpty = isExplicitlyEmpty;
        model.actionPMs = actionPMs;
        model.commands = commands;
        model.placeHolders = placeHolders;
        model.visualId = visualModel.get_visualId();
        return model;
    }
    return null;
}
tab.UbertipSerializer._getUberTipPaneData = function tab_UbertipSerializer$_getUberTipPaneData(ubertip, paneDescrKey) {
    if (ubertip.ubertipPaneDatas.length === 1) {
        return ubertip.ubertipPaneDatas[0];
    }
    var $enum1 = ss.IEnumerator.getEnumerator(ubertip.ubertipPaneDatas);
    while ($enum1.moveNext()) {
        var uberPane = $enum1.current;
        if (ss.isValue(uberPane.paneDescriptor)) {
            if (uberPane.paneDescriptor.paneDescrKey === paneDescrKey) {
                return uberPane;
            }
        }
    }
    return null;
}
tab.UbertipSerializer._processUbertipData = function tab_UbertipSerializer$_processUbertipData(dataDictionary, paneData, vizData, objectIds) {
    return tab.VizDataUtils.constructHtml(dataDictionary, paneData.htmlTooltip, vizData, objectIds);
}
tab.UbertipSerializer._getSelectionHtml = function tab_UbertipSerializer$_getSelectionHtml(dataDictionary, vizData, tupleIds, summary) {
    var summaryFieldCol = vizData.getVizDataField(summary || '');
    if (ss.isValue(summaryFieldCol)) {
        var templateCopy = [];
        $.extend(true, templateCopy, tab.UbertipSerializer._selectionTemplate);
        templateCopy[2] = tupleIds.length.toString();
        templateCopy[4] = tab.Strings.UbertipItemsSelected;
        if (summaryFieldCol.get_aggType() !== 'sum') {
            templateCopy[8] = tab.Strings.SumOf;
        }
        templateCopy[10] = summary;
        templateCopy[14] = '&lt;' + summary + '&gt;';
        var html = templateCopy.join('');
        return tab.VizDataUtils.constructHtml(dataDictionary, html, vizData, tupleIds);
    }
    else {
        tab.UbertipSerializer._selectionTemplateNoSummary[2] = tupleIds.length.toString();
        tab.UbertipSerializer._selectionTemplateNoSummary[4] = tab.Strings.UbertipItemsSelected;
        return tab.UbertipSerializer._selectionTemplateNoSummary.join('');
    }
}
tab.UbertipSerializer._addImplicitCommands = function tab_UbertipSerializer$_addImplicitCommands(ubertip, commandModels, commandsAndSubcommands, remote) {
    if (commandModels.length <= 0) {
        return;
    }
    var addViewData = false;
    if (ss.isValue(ubertip) && ss.isValue(ubertip.r)) {
        switch (ubertip.r) {
            case 'viz':
            case 'xheader':
            case 'yheader':
            case 'bottomaxis':
            case 'leftaxis':
            case 'rightaxis':
            case 'topaxis':
                addViewData = true;
                break;
        }
        addViewData = addViewData && !ubertip.refLineSelected && !ubertip.trendLineSelected && !ubertip.forecastSelected;
    }
    if (!tsConfig.previewMode && (addViewData || !remote)) {
        var viewData = tab.$create_CommandModel();
        viewData.commandType = 7;
        viewData.status = 'enabled';
        viewData.description = tab.Strings.UbertipViewData;
        viewData.command = {};
        viewData.command.commandName = 'viewData';
        viewData.command.commandNamespace = 'tabdoc';
        viewData.command.commandParams = {};
        var $enum1 = ss.IEnumerator.getEnumerator(commandModels);
        while ($enum1.moveNext()) {
            var commandModel = $enum1.current;
            if (ss.isValue(commandModel.command) && ss.isValue(commandModel.command.commandParams) && Object.keyExists(commandModel.command.commandParams, 'selectAtPoint')) {
                viewData.command.commandParams['selectAtPoint'] = commandModel.command.commandParams['selectAtPoint'];
                break;
            }
        }
        tab.UbertipSerializer._addImplicitCommandToCommandsList(viewData, commandModels, commandsAndSubcommands);
    }
    if (tsConfig.is_mobile) {
        var clearSelection = tab.$create_CommandModel();
        clearSelection.commandType = 1;
        clearSelection.name = tab.Strings.UbertipClearSelection;
        clearSelection.status = 'enabled';
        tab.UbertipSerializer._addImplicitCommandToCommandsList(clearSelection, commandModels, commandsAndSubcommands);
    }
}
tab.UbertipSerializer._addImplicitCommandToCommandsList = function tab_UbertipSerializer$_addImplicitCommandToCommandsList(command, commandModels, commandsAndSubcommands) {
    commandModels.add(command);
    if (ss.isValue(commandsAndSubcommands)) {
        commandsAndSubcommands.add(new ss.Tuple(true, commandModels.length - 1));
    }
}
tab.UbertipSerializer._collectCommands = function tab_UbertipSerializer$_collectCommands(commandsObject, commandModels, tupleId) {
    var commandsWrapper = tab.CommandsPresModelWrapper.create(commandsObject);
    if (ss.isNullOrUndefined(commandsWrapper) || ss.isNullOrUndefined(commandsWrapper.get_commandItems())) {
        return;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(commandsWrapper.get_commandItems());
    while ($enum1.moveNext()) {
        var commandItem = $enum1.current;
        var itemWrapper = tab.CommandItemWrapper.create(commandItem);
        var com = tab.$create_CommandModel();
        com.command = tab.CommandSerializer.deserialize(itemWrapper.get_command());
        if (ss.isValue(com.command)) {
            tab.UbertipSerializer.buildCommandModelFromWrapper(com, itemWrapper, tupleId);
            commandModels.add(com);
        }
        if (ss.isValue(itemWrapper.get_commands())) {
            tab.UbertipSerializer._collectCommands(itemWrapper.get_commands(), commandModels, tupleId);
        }
    }
}
tab.UbertipSerializer._collectCommandsAndSubcommands = function tab_UbertipSerializer$_collectCommandsAndSubcommands(commandsObject, commandModels, subcommandItemWrappers, commandsAndSubcommands) {
    var commandsWrapper = tab.CommandsPresModelWrapper.create(commandsObject);
    if (ss.isNullOrUndefined(commandsWrapper) || ss.isNullOrUndefined(commandsWrapper.get_commandItems())) {
        return;
    }
    var commandCounter = 0;
    var subcommandCounter = 0;
    var $enum1 = ss.IEnumerator.getEnumerator(commandsWrapper.get_commandItems());
    while ($enum1.moveNext()) {
        var commandItem = $enum1.current;
        var itemWrapper = tab.CommandItemWrapper.create(commandItem);
        var com = tab.$create_CommandModel();
        com.command = tab.CommandSerializer.deserialize(itemWrapper.get_command());
        if (ss.isValue(com.command)) {
            tab.UbertipSerializer.buildCommandModelFromWrapper(com, itemWrapper, 0);
            commandModels.add(com);
            commandsAndSubcommands.add(new ss.Tuple(true, commandCounter));
            commandCounter++;
        }
        if (ss.isValue(itemWrapper.get_commands())) {
            subcommandItemWrappers.add(itemWrapper);
            commandsAndSubcommands.add(new ss.Tuple(false, subcommandCounter));
            subcommandCounter++;
        }
    }
}
tab.UbertipSerializer.buildCommandModelFromWrapper = function tab_UbertipSerializer$buildCommandModelFromWrapper(com, itemWrapper, tupleId) {
    tab.UbertipSerializer.setCommandType(com);
    com.name = itemWrapper.get_name();
    com.description = itemWrapper.get_description();
    if (!tab.MiscUtil.isNullOrEmpty(itemWrapper.get_iconRes())) {
        com.imageRes = tab.TabResources.lookupFullResourceAlias(itemWrapper.get_iconRes());
    }
    var state = itemWrapper.get_enabled();
    com.status = (ss.isNullOrUndefined(state) || state) ? 'enabled' : 'disabled';
    if (!!tupleId && !ss.isValue(com.command.commandParams['selectAtPoint'])) {
        com.command.commandParams['tupleId'] = tupleId.toString();
    }
}
tab.UbertipSerializer.setCommandType = function tab_UbertipSerializer$setCommandType(model) {
    var type = tab.CommandSerializer.getCommandType(model.command);
    if (ss.isValue(type)) {
        model.commandType = type;
    }
}
tab.UbertipSerializer._nullIfEmpty = function tab_UbertipSerializer$_nullIfEmpty(s) {
    return (String.isNullOrEmpty(s)) ? null : s;
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandRedirectRegistry

tab.CommandRedirectRegistry = function tab_CommandRedirectRegistry() {
}
tab.CommandRedirectRegistry.checkpointRegistry = function tab_CommandRedirectRegistry$checkpointRegistry() {
    var toResore = tab.CommandRedirectRegistry._registry;
    tab.CommandRedirectRegistry._registry = $.extend(false, {}, toResore);
    return function() {
        tab.CommandRedirectRegistry._registry = toResore;
    };
}
tab.CommandRedirectRegistry.registerHandler = function tab_CommandRedirectRegistry$registerHandler(commandRedirectType, handler) {
    tab.Param.verifyValue(commandRedirectType, 'commandRedirectType');
    tab.Param.verifyValue(handler, 'handler');
    if (ss.isNullOrUndefined(tab.CommandRedirectRegistry._registry)) {
        tab.CommandRedirectRegistry._registry = {};
    }
    tab.CommandRedirectRegistry._registry[commandRedirectType] = handler;
}
tab.CommandRedirectRegistry.handleRedirect = function tab_CommandRedirectRegistry$handleRedirect(type, model) {
    if (ss.isNullOrUndefined(tab.CommandRedirectRegistry._registry) || !Object.keyExists(tab.CommandRedirectRegistry._registry, type)) {
        throw new Error('No command redirect registerd for type: ' + type);
    }
    var handler = tab.CommandRedirectRegistry._registry[type];
    return handler(model);
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsPaneModel

tab.AnalyticsPaneModel = function tab_AnalyticsPaneModel(parent) {
    tab.AnalyticsPaneModel.initializeBase(this, [ parent, new tab.PresModelPathItem('analyticsPane') ]);
}
tab.AnalyticsPaneModel.prototype = {
    
    add_newAnalyticsPane: function tab_AnalyticsPaneModel$add_newAnalyticsPane(value) {
        this.__newAnalyticsPane$1 = ss.Delegate.combine(this.__newAnalyticsPane$1, value);
    },
    remove_newAnalyticsPane: function tab_AnalyticsPaneModel$remove_newAnalyticsPane(value) {
        this.__newAnalyticsPane$1 = ss.Delegate.remove(this.__newAnalyticsPane$1, value);
    },
    
    __newAnalyticsPane$1: null,
    
    get_analyticsPresModel: function tab_AnalyticsPaneModel$get_analyticsPresModel() {
        return this.presModel;
    },
    
    update: function tab_AnalyticsPaneModel$update(analyticsPresModel) {
        this.simpleSwapToUpdate(analyticsPresModel, this.__newAnalyticsPane$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationAutoCompleteItemModel

tab.CalculationAutoCompleteItemModel = function tab_CalculationAutoCompleteItemModel(parent, pm) {
    tab.CalculationAutoCompleteItemModel.initializeBase(this, [ parent, new tab.PresModelPathItem('autocompleteItem') ]);
    this.swapPresModel(pm);
}
tab.CalculationAutoCompleteItemModel.prototype = {
    
    get__item$1: function tab_CalculationAutoCompleteItemModel$get__item$1() {
        return this.get_presModel();
    },
    
    get_itemType: function tab_CalculationAutoCompleteItemModel$get_itemType() {
        return (ss.isValue(this.get__item$1().autocompleteType)) ? this.get__item$1().autocompleteType : 'func';
    },
    
    get_name: function tab_CalculationAutoCompleteItemModel$get_name() {
        return this.get__item$1().name;
    },
    
    get_label: function tab_CalculationAutoCompleteItemModel$get_label() {
        return this.get__item$1().label;
    },
    
    get_styledLabel: function tab_CalculationAutoCompleteItemModel$get_styledLabel() {
        return this.get__item$1().styledLabel;
    },
    
    get_datasourceName: function tab_CalculationAutoCompleteItemModel$get_datasourceName() {
        return this.get__item$1().datasource;
    },
    
    get_iconResource: function tab_CalculationAutoCompleteItemModel$get_iconResource() {
        return this.get__item$1().fieldIconRes;
    },
    
    get_tooltip: function tab_CalculationAutoCompleteItemModel$get_tooltip() {
        return this.get__item$1().tooltipText;
    },
    
    get_replaceText: function tab_CalculationAutoCompleteItemModel$get_replaceText() {
        return this.get__item$1().replaceText;
    },
    
    get_caretIndex: function tab_CalculationAutoCompleteItemModel$get_caretIndex() {
        return this.get__item$1().caretIndex;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationAutoCompleteModel

tab.CalculationAutoCompleteModel = function tab_CalculationAutoCompleteModel(pm) {
    this._itemModels$1 = [];
    tab.CalculationAutoCompleteModel.initializeBase(this, [ null, new tab.PresModelPathItem('calculationAutocompleteContextMenu') ]);
    this.swapPresModel(pm);
    var $enum1 = ss.IEnumerator.getEnumerator(pm.autocompleteItemList || new Array(0));
    while ($enum1.moveNext()) {
        var itemPm = $enum1.current;
        this._itemModels$1.add(new tab.CalculationAutoCompleteItemModel(this, itemPm));
    }
}
tab.CalculationAutoCompleteModel.prototype = {
    
    get_functionTooltip: function tab_CalculationAutoCompleteModel$get_functionTooltip() {
        var pm = this.get_presModel();
        return pm.functionHelp;
    },
    
    get_functionHelpPosition: function tab_CalculationAutoCompleteModel$get_functionHelpPosition() {
        var pm = this.get_presModel();
        return pm.functionHelpIndex;
    },
    
    get_calculation: function tab_CalculationAutoCompleteModel$get_calculation() {
        var pm = this.get_presModel();
        return pm.acCalc;
    },
    
    get_startIndex: function tab_CalculationAutoCompleteModel$get_startIndex() {
        var pm = this.get_presModel();
        return pm.startIndex;
    },
    
    get_endIndex: function tab_CalculationAutoCompleteModel$get_endIndex() {
        var pm = this.get_presModel();
        return pm.endIndex;
    },
    
    get_items: function tab_CalculationAutoCompleteModel$get_items() {
        return this._itemModels$1;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationFunctionListModel

tab.CalculationFunctionListModel = function tab_CalculationFunctionListModel(parent) {
    tab.CalculationFunctionListModel.initializeBase(this, [ parent, new tab.PresModelPathItem('expressionFuncPm') ]);
    this.presModel = {};
}
tab.CalculationFunctionListModel.prototype = {
    
    add_functionListUpdated: function tab_CalculationFunctionListModel$add_functionListUpdated(value) {
        this.__functionListUpdated$1 = ss.Delegate.combine(this.__functionListUpdated$1, value);
    },
    remove_functionListUpdated: function tab_CalculationFunctionListModel$remove_functionListUpdated(value) {
        this.__functionListUpdated$1 = ss.Delegate.remove(this.__functionListUpdated$1, value);
    },
    
    __functionListUpdated$1: null,
    
    get__functionsPresModel$1: function tab_CalculationFunctionListModel$get__functionsPresModel$1() {
        return this.presModel;
    },
    
    get_functions: function tab_CalculationFunctionListModel$get_functions() {
        return this.get__functionsPresModel$1().expressionFuncList || [];
    },
    
    update: function tab_CalculationFunctionListModel$update(newFunctionList) {
        this.simpleSwapToUpdate(newFunctionList, this.__functionListUpdated$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationModel

tab.CalculationModel = function tab_CalculationModel(parent, isAdHoc) {
    tab.CalculationModel.initializeBase(this, [ parent, new tab.PresModelPathItem(((isAdHoc) ? 'typeInPill' : 'calculation')) ]);
    this.presModel = {};
    this._isAdhoc$1 = isAdHoc;
}
tab.CalculationModel.prototype = {
    _isAdhoc$1: false,
    
    add_calculationUpdated: function tab_CalculationModel$add_calculationUpdated(value) {
        this.__calculationUpdated$1 = ss.Delegate.combine(this.__calculationUpdated$1, value);
    },
    remove_calculationUpdated: function tab_CalculationModel$remove_calculationUpdated(value) {
        this.__calculationUpdated$1 = ss.Delegate.remove(this.__calculationUpdated$1, value);
    },
    
    __calculationUpdated$1: null,
    
    get_hasCalculation: function tab_CalculationModel$get_hasCalculation() {
        return ss.isValue(this.presModel) && (!tab.MiscUtil.isNullOrEmpty(this.get__calculationPresModel$1().calculationCaption) || !tab.MiscUtil.isNullOrEmpty(this.get__calculationPresModel$1().pendingCalcName) || !tab.MiscUtil.isNullOrEmpty(this.get__calculationPresModel$1().datasource));
    },
    
    get_isNewCalculation: function tab_CalculationModel$get_isNewCalculation() {
        return tab.MiscUtil.isNullOrEmpty(this.get__calculationPresModel$1().fn);
    },
    
    get_isAdhoc: function tab_CalculationModel$get_isAdhoc() {
        return this._isAdhoc$1 && this.get__calculationPresModel$1().isTypeInPill;
    },
    
    get_adHocShelf: function tab_CalculationModel$get_adHocShelf() {
        return (this.get__calculationPresModel$1().shelfType || 'none-shelf');
    },
    
    get_adHocShelfPosition: function tab_CalculationModel$get_adHocShelfPosition() {
        return this.get__calculationPresModel$1().shelfPosIndex;
    },
    
    get_adHocPaneSpecId: function tab_CalculationModel$get_adHocPaneSpecId() {
        return this.get__calculationPresModel$1().paneSpec;
    },
    
    get__calculationPresModel$1: function tab_CalculationModel$get__calculationPresModel$1() {
        return this.presModel;
    },
    
    get_tokens: function tab_CalculationModel$get_tokens() {
        return this.get__calculationPresModel$1().styleTokenList || [];
    },
    
    get_name: function tab_CalculationModel$get_name() {
        return this.get__calculationPresModel$1().pendingCalcName || '';
    },
    
    get_fieldName: function tab_CalculationModel$get_fieldName() {
        return this.get__calculationPresModel$1().fn || '';
    },
    
    get_errors: function tab_CalculationModel$get_errors() {
        return this.get__calculationPresModel$1().errorInfoList || [];
    },
    
    get_errorSummary: function tab_CalculationModel$get_errorSummary() {
        return this.get__calculationPresModel$1().errorString || '';
    },
    
    get_caption: function tab_CalculationModel$get_caption() {
        return this.get__calculationPresModel$1().calculationCaption || '';
    },
    
    get_formula: function tab_CalculationModel$get_formula() {
        return this.get__calculationPresModel$1().calculationFormula || '';
    },
    
    get_dependencies: function tab_CalculationModel$get_dependencies() {
        return this.get__calculationPresModel$1().calculationDependencies || '';
    },
    
    get_dataSourceName: function tab_CalculationModel$get_dataSourceName() {
        return this.get__calculationPresModel$1().datasource || '';
    },
    
    get_dataSourceCaption: function tab_CalculationModel$get_dataSourceCaption() {
        var dataSchema = tab.ApplicationModel.get_instance().get_workbook().get_dataSchema();
        if (ss.isNullOrUndefined(dataSchema)) {
            return null;
        }
        var dataSource = dataSchema.findDataSourceByName(this.get_dataSourceName());
        if (ss.isNullOrUndefined(dataSource)) {
            return null;
        }
        return dataSource.get_caption();
    },
    
    update: function tab_CalculationModel$update(newCalculation) {
        this.simpleSwapToUpdate(newCalculation, this.__calculationUpdated$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalFilterModel

tab.CategoricalFilterModel = function tab_CategoricalFilterModel(parent, presModel) {
    tab.CategoricalFilterModel.initializeBase(this, [ parent, presModel ]);
}
tab.CategoricalFilterModel.prototype = {
    
    get_filterType: function tab_CategoricalFilterModel$get_filterType() {
        return 'Categorical';
    },
    
    get_mode: function tab_CategoricalFilterModel$get_mode() {
        switch (this.get_filterPresModel().mode) {
            case 'checklist':
                return 'check-list';
            case 'radiolist':
                return 'radio-list';
            case 'dropdown':
                return 'dropdown';
            case 'checkdropdown':
                return 'check-dropdown';
            case 'slider':
                return 'slider';
            case 'pattern':
                return 'pattern';
            case 'typeinlist':
                return 'type-in-list';
            default:
                return 'check-list';
        }
    },
    
    get_pattern: function tab_CategoricalFilterModel$get_pattern() {
        return this.get_filterPresModel().pattern;
    },
    
    get_isAllMode: function tab_CategoricalFilterModel$get_isAllMode() {
        return this.get_filterPresModel().all;
    },
    
    get_allItemsAreChecked: function tab_CategoricalFilterModel$get_allItemsAreChecked() {
        return this.get_filterPresModel().allChecked;
    },
    
    get_noItemsAreChecked: function tab_CategoricalFilterModel$get_noItemsAreChecked() {
        return this.get_filterPresModel().allNotChecked;
    },
    
    get_exclude: function tab_CategoricalFilterModel$get_exclude() {
        return this.get_filterPresModel().exclude;
    },
    
    get_isTiled: function tab_CategoricalFilterModel$get_isTiled() {
        return this.get_filterPresModel().isTiled;
    },
    
    get_isSearchable: function tab_CategoricalFilterModel$get_isSearchable() {
        return this.get_filterPresModel().is_searchable;
    },
    
    get_summary: function tab_CategoricalFilterModel$get_summary() {
        return this.get_filterPresModel().summary;
    },
    
    get_underlyingDataSourceIsCube: function tab_CategoricalFilterModel$get_underlyingDataSourceIsCube() {
        return this.get_filterPresModel().catIsHier;
    },
    
    get_condition: function tab_CategoricalFilterModel$get_condition() {
        return this.get_filterPresModel().condition;
    },
    
    get_limit: function tab_CategoricalFilterModel$get_limit() {
        return this.get_filterPresModel().limit;
    },
    
    get_rangeType: function tab_CategoricalFilterModel$get_rangeType() {
        return this.get_filterPresModel().rangeType;
    },
    
    get_catFilterTable: function tab_CategoricalFilterModel$get_catFilterTable() {
        return this.get_filterPresModel().table;
    },
    
    get_domainActualSize: function tab_CategoricalFilterModel$get_domainActualSize() {
        return this.get_catFilterTable().actual_size;
    },
    
    get_tuples: function tab_CategoricalFilterModel$get_tuples() {
        return this.get_catFilterTable().tuples;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataDictionaryModel

tab.DataDictionaryModel = function tab_DataDictionaryModel(parent) {
    tab.DataDictionaryModel.initializeBase(this, [ parent, new tab.PresModelPathItem('dataDictionary') ]);
}
tab.DataDictionaryModel.prototype = {
    
    get_isEmpty: function tab_DataDictionaryModel$get_isEmpty() {
        return tab.MiscUtil.isNullOrEmpty(this.get__dataDictionaryPM$1()) || tab.MiscUtil.isNullOrEmpty(this.get__dataDictionaryPM$1().dataSegments);
    },
    
    get__dataDictionaryPM$1: function tab_DataDictionaryModel$get__dataDictionaryPM$1() {
        return this.get_presModel();
    },
    
    update: function tab_DataDictionaryModel$update(dataPM) {
        if (ss.isValue(this.get__dataDictionaryPM$1()) && ss.isValue(dataPM)) {
            var newDataSegments = dataPM.dataSegments;
            if (ss.isValue(newDataSegments)) {
                var oldDataSegments = this.get__dataDictionaryPM$1().dataSegments;
                if (ss.isValue(oldDataSegments)) {
                    var $dict1 = oldDataSegments;
                    for (var $key2 in $dict1) {
                        var entry = { key: $key2, value: $dict1[$key2] };
                        if (!Object.keyExists(newDataSegments, entry.key)) {
                            newDataSegments[entry.key] = entry.value;
                        }
                    }
                }
                var $dict3 = newDataSegments;
                for (var $key4 in $dict3) {
                    var entry = { key: $key4, value: $dict3[$key4] };
                    if (ss.isNull(entry.value)) {
                        delete newDataSegments[entry.key];
                    }
                }
            }
        }
        this.presModel = dataPM;
    },
    
    getRawValue: function tab_DataDictionaryModel$getRawValue(dt, index) {
        if (ss.isNullOrUndefined(this.get__dataDictionaryPM$1()) || ss.isNullOrUndefined(this.get__dataDictionaryPM$1().dataSegments)) {
            return null;
        }
        var segmentCount = Object.getKeyCount(this.get__dataDictionaryPM$1().dataSegments);
        for (var i = 0; i < segmentCount; i++) {
            var dataSegment = this.get__dataDictionaryPM$1().dataSegments[i.toString()];
            var dataColumn = _.find(dataSegment.dataColumns, function(iterator) {
                return (iterator.dataType === dt);
            });
            if (!ss.isValue(dataColumn)) {
                continue;
            }
            if (index < dataColumn.dataValues.length) {
                return dataColumn.dataValues[index];
            }
            index -= dataColumn.dataValues.length;
        }
        return null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.HierarchicalFilterModel

tab.HierarchicalFilterModel = function tab_HierarchicalFilterModel(parent, presModel) {
    tab.HierarchicalFilterModel.initializeBase(this, [ parent, presModel ]);
}
tab.HierarchicalFilterModel.prototype = {
    
    get_filterType: function tab_HierarchicalFilterModel$get_filterType() {
        return 'Hierarchical';
    },
    
    get_hierarchyTables: function tab_HierarchicalFilterModel$get_hierarchyTables() {
        return this.get_filterPresModel().table;
    },
    
    get_levels: function tab_HierarchicalFilterModel$get_levels() {
        return this.get_filterPresModel().levels;
    },
    
    get_isSearchable: function tab_HierarchicalFilterModel$get_isSearchable() {
        return this.get_filterPresModel().is_searchable;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MapServerModel

tab.MapServerModel = function tab_MapServerModel(parent) {
    tab.MapServerModel.initializeBase(this, [ parent, new tab.PresModelPathItem('map-server') ]);
}
tab.MapServerModel.prototype = {
    
    add_newMapServerInfo: function tab_MapServerModel$add_newMapServerInfo(value) {
        this.__newMapServerInfo$1 = ss.Delegate.combine(this.__newMapServerInfo$1, value);
    },
    remove_newMapServerInfo: function tab_MapServerModel$remove_newMapServerInfo(value) {
        this.__newMapServerInfo$1 = ss.Delegate.remove(this.__newMapServerInfo$1, value);
    },
    
    __newMapServerInfo$1: null,
    
    get_useFastMaps: function tab_MapServerModel$get_useFastMaps() {
        return this.get_hasPresModel() && this.get_mapServerPresModel().clientRequestsMapTiles;
    },
    
    get_hasPresModel: function tab_MapServerModel$get_hasPresModel() {
        return ss.isValue(this.get_presModel());
    },
    
    get_isAttributionVisible: function tab_MapServerModel$get_isAttributionVisible() {
        return this.get_mapServerPresModel().showAttribution;
    },
    
    get_minZoom: function tab_MapServerModel$get_minZoom() {
        return this.get_mapServerPresModel().mapMinZoom;
    },
    
    get_maxZoom: function tab_MapServerModel$get_maxZoom() {
        return this.get_mapServerPresModel().mapMaxZoom;
    },
    
    get_zoom: function tab_MapServerModel$get_zoom() {
        var zoomStretchInLogSpace = Math.log(this.get_mapServerPresModel().mapDisplayScale) / Math.LN2;
        return this.get_mapServerPresModel().mapRequestZoom + zoomStretchInLogSpace;
    },
    
    get_centerLatitude: function tab_MapServerModel$get_centerLatitude() {
        return this.get_mapServerPresModel().mapCenterLatitude;
    },
    
    get_centerLongitude: function tab_MapServerModel$get_centerLongitude() {
        return this.get_mapServerPresModel().mapCenterLongitude;
    },
    
    get_tilePixelSize: function tab_MapServerModel$get_tilePixelSize() {
        return 256;
    },
    
    get_numWorldRepeats: function tab_MapServerModel$get_numWorldRepeats() {
        return this.get_mapServerPresModel().mapWorldRepeats;
    },
    
    get_tileUrl: function tab_MapServerModel$get_tileUrl() {
        var ms = this.get_mapServerPresModel();
        var toRet;
        if (ms.mapTileServer.toString().startsWith('http://') || ms.mapTileServer.toString().startsWith('https://')) {
            toRet = '';
        }
        else {
            var protocol = tab.WindowHelper.getLocation(window.self).protocol;
            toRet = protocol + '//';
        }
        toRet += ms.mapTileServer;
        if (!toRet.endsWith('/') && !ms.mapTileUrl.toString().startsWith('/')) {
            toRet += '/';
        }
        toRet += ms.mapTileUrl;
        toRet = toRet.replaceAll('{K}', ms.mapServerKey);
        toRet = toRet.replaceAll('{L}', ms.mapLayerRequest);
        var useHighDPITiles = tab.FloatUtil.isGreaterThanOrEqual(tab.BrowserSupport.get_devicePixelRatio(), 2);
        toRet = toRet.replaceAll('{D}', (useHighDPITiles) ? '@2x' : '');
        toRet = toRet.replaceAll('{X}', '{x}');
        toRet = toRet.replaceAll('{Y}', '{y}');
        toRet = toRet.replaceAll('{Z}', '{z}');
        toRet = toRet.replaceAll('{P}', '{p}');
        return toRet;
    },
    
    get_hasValidTileLayer: function tab_MapServerModel$get_hasValidTileLayer() {
        return this.get_mapServerPresModel().mapHasValidLayer;
    },
    
    get_attributionUrl: function tab_MapServerModel$get_attributionUrl() {
        return this.get_mapServerPresModel().mapAttributionUrl;
    },
    
    get_attributionText: function tab_MapServerModel$get_attributionText() {
        return this.get_mapServerPresModel().mapAttributionText;
    },
    
    get_attributionTextColor: function tab_MapServerModel$get_attributionTextColor() {
        return this.get_mapServerPresModel().mapAttributionTextColor;
    },
    
    get_attributionTextSize: function tab_MapServerModel$get_attributionTextSize() {
        return this.get_mapServerPresModel().mapAttributionTextSize;
    },
    
    get_attributionBGColor: function tab_MapServerModel$get_attributionBGColor() {
        return this._convertColorOrUseDefault$1(this.get_mapServerPresModel().mapAttributionFill);
    },
    
    get_mapBGFillColor: function tab_MapServerModel$get_mapBGFillColor() {
        return this._convertColorOrUseDefault$1(this.get_mapServerPresModel().mapPaneBackgroundFill);
    },
    
    get_waitTileFillColor: function tab_MapServerModel$get_waitTileFillColor() {
        return this.get_mapServerPresModel().mapWaitTileFill;
    },
    
    get_hasWashout: function tab_MapServerModel$get_hasWashout() {
        return this.get_mapServerPresModel().mapWashout > 0;
    },
    
    get_washoutColor: function tab_MapServerModel$get_washoutColor() {
        var alpha = Math.max(0, Math.min(1, this.get_mapServerPresModel().mapWashout));
        return new tab.ColorModel(255, 255, 255, alpha);
    },
    
    get_intermediateTileLevels: function tab_MapServerModel$get_intermediateTileLevels() {
        return this.get_mapServerPresModel().mapIntermediateLevels;
    },
    
    get_mapServerPresModel: function tab_MapServerModel$get_mapServerPresModel() {
        return this.presModel;
    },
    
    update: function tab_MapServerModel$update(mapServerPresModel) {
        this.simpleSwapToUpdate(mapServerPresModel, this.__newMapServerInfo$1);
    },
    
    _convertColorOrUseDefault$1: function tab_MapServerModel$_convertColorOrUseDefault$1(colorFromPM) {
        return tab.ColorModel.fromColorCode(colorFromPM || 'rgb(255,255,255)').toString();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeFilterModel

tab.QuantitativeFilterModel = function tab_QuantitativeFilterModel(parent, presModel) {
    tab.QuantitativeFilterModel.initializeBase(this, [ parent, presModel ]);
}
tab.QuantitativeFilterModel.prototype = {
    
    get_filterType: function tab_QuantitativeFilterModel$get_filterType() {
        return 'Quantitative';
    },
    
    get_range: function tab_QuantitativeFilterModel$get_range() {
        return this.get_filterPresModel().range;
    },
    
    get_data: function tab_QuantitativeFilterModel$get_data() {
        return this.get_filterPresModel().data;
    },
    
    get_dateFormat: function tab_QuantitativeFilterModel$get_dateFormat() {
        return this.get_filterPresModel().date_format;
    },
    
    get_editingFormat: function tab_QuantitativeFilterModel$get_editingFormat() {
        return this.get_filterPresModel().editing_format;
    },
    
    get_format: function tab_QuantitativeFilterModel$get_format() {
        return this.get_filterPresModel().format;
    },
    
    get_calendarControlStartOfWeek: function tab_QuantitativeFilterModel$get_calendarControlStartOfWeek() {
        return this.get_filterPresModel().first_day_of_week;
    },
    
    get_dataSourceStartOfWeek: function tab_QuantitativeFilterModel$get_dataSourceStartOfWeek() {
        return this.get_filterPresModel().start_of_week;
    },
    
    get_quantitativeFilterTable: function tab_QuantitativeFilterModel$get_quantitativeFilterTable() {
        return this.get_filterPresModel().table;
    },
    
    get_column: function tab_QuantitativeFilterModel$get_column() {
        return this.get_quantitativeFilterTable().column;
    },
    
    get_included: function tab_QuantitativeFilterModel$get_included() {
        return this.get_quantitativeFilterTable().included;
    },
    
    get_min: function tab_QuantitativeFilterModel$get_min() {
        return this.get_quantitativeFilterTable().min;
    },
    
    get_max: function tab_QuantitativeFilterModel$get_max() {
        return this.get_quantitativeFilterTable().max;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RelativeDateFilterModel

tab.RelativeDateFilterModel = function tab_RelativeDateFilterModel(parent, presModel) {
    tab.RelativeDateFilterModel.initializeBase(this, [ parent, presModel ]);
}
tab.RelativeDateFilterModel.prototype = {
    
    get_filterType: function tab_RelativeDateFilterModel$get_filterType() {
        return (this.get_isRelativeDatePick()) ? 'RelativeDatePick' : 'RelativeDate';
    },
    
    get_defaultFormat: function tab_RelativeDateFilterModel$get_defaultFormat() {
        return this.get_filterPresModel().default_format;
    },
    
    get_fiscalYearStart: function tab_RelativeDateFilterModel$get_fiscalYearStart() {
        return this.get_filterPresModel().fy;
    },
    
    get_noTime: function tab_RelativeDateFilterModel$get_noTime() {
        return this.get_filterPresModel().noTime;
    },
    
    get_isRelativeDatePick: function tab_RelativeDateFilterModel$get_isRelativeDatePick() {
        return this.get_filterPresModel().showRelDatePick;
    },
    
    get_text: function tab_RelativeDateFilterModel$get_text() {
        return this.get_filterPresModel().text;
    },
    
    get_relativeDateTable: function tab_RelativeDateFilterModel$get_relativeDateTable() {
        return this.get_filterPresModel().table;
    },
    
    get_periodType: function tab_RelativeDateFilterModel$get_periodType() {
        return this.get_relativeDateTable().periodType;
    },
    
    get_rangeType: function tab_RelativeDateFilterModel$get_rangeType() {
        return this.get_relativeDateTable().rangeType;
    },
    
    get_rangeN: function tab_RelativeDateFilterModel$get_rangeN() {
        return this.get_relativeDateTable().rangeN;
    },
    
    get_anchor: function tab_RelativeDateFilterModel$get_anchor() {
        return this.get_relativeDateTable().anchor;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalLegendModel

tab.CategoricalLegendModel = function tab_CategoricalLegendModel(parent, contentType, legendType) {
    tab.CategoricalLegendModel.initializeBase(this, [ parent, new tab.PresModelPathItem(contentType) ]);
    this._legendType$1 = legendType;
}
tab.CategoricalLegendModel._getPresModelItems$1 = function tab_CategoricalLegendModel$_getPresModelItems$1(type, pm) {
    var items;
    switch (type) {
        case 'color':
        case 'map':
            items = (pm).colorLegendItems;
            break;
        case 'size':
            items = (pm).sizeLegendItems;
            break;
        case 'shape':
            items = (pm).shapeLegendItems;
            break;
        default:
            tab.Logger.lazyGetLogger(tab.CategoricalLegendModel).warn('Unsupported legend type: %o', type);
            return null;
    }
    return items;
}
tab.CategoricalLegendModel.prototype = {
    _legendType$1: null,
    
    add_legendChanged: function tab_CategoricalLegendModel$add_legendChanged(value) {
        this.__legendChanged$1 = ss.Delegate.combine(this.__legendChanged$1, value);
    },
    remove_legendChanged: function tab_CategoricalLegendModel$remove_legendChanged(value) {
        this.__legendChanged$1 = ss.Delegate.remove(this.__legendChanged$1, value);
    },
    
    __legendChanged$1: null,
    
    add_legendNameChanged: function tab_CategoricalLegendModel$add_legendNameChanged(value) {
        this.__legendNameChanged$1 = ss.Delegate.combine(this.__legendNameChanged$1, value);
    },
    remove_legendNameChanged: function tab_CategoricalLegendModel$remove_legendNameChanged(value) {
        this.__legendNameChanged$1 = ss.Delegate.remove(this.__legendNameChanged$1, value);
    },
    
    __legendNameChanged$1: null,
    
    get_worksheetName: function tab_CategoricalLegendModel$get_worksheetName() {
        return this.get__zone$1().get_worksheetName();
    },
    
    get_id: function tab_CategoricalLegendModel$get_id() {
        return this.get_legendNames().join(';') + this._legendType$1;
    },
    
    get_catLegendPresModel: function tab_CategoricalLegendModel$get_catLegendPresModel() {
        return this.presModel;
    },
    
    get_isHighlightEnabled: function tab_CategoricalLegendModel$get_isHighlightEnabled() {
        return (this.get_catLegendPresModel().isHighlightEnabled || false);
    },
    
    get_isHighlightAllowed: function tab_CategoricalLegendModel$get_isHighlightAllowed() {
        return (this.get_catLegendPresModel().isHighlightAllowed || false);
    },
    
    get_isOneWay: function tab_CategoricalLegendModel$get_isOneWay() {
        return (this.get_catLegendPresModel().oneWayBrushing || false);
    },
    
    get_fieldCaptions: function tab_CategoricalLegendModel$get_fieldCaptions() {
        return this.get_catLegendPresModel().fieldCaptions;
    },
    
    get_legendNames: function tab_CategoricalLegendModel$get_legendNames() {
        return this.get_catLegendPresModel().legendNames;
    },
    
    get_legendType: function tab_CategoricalLegendModel$get_legendType() {
        return this._legendType$1;
    },
    
    get_items: function tab_CategoricalLegendModel$get_items() {
        return tab.CategoricalLegendModel._getPresModelItems$1(this.get_legendType(), this.get_catLegendPresModel());
    },
    
    get__zone$1: function tab_CategoricalLegendModel$get__zone$1() {
        var wrapper = Type.safeCast(this.get_parent(), tab.ZoneContentWrapperModel);
        return wrapper.get_zone();
    },
    
    findItemById: function tab_CategoricalLegendModel$findItemById(objectId) {
        return _.find(this.get_items(), function(model) {
            return model.objectId === objectId;
        });
    },
    
    update: function tab_CategoricalLegendModel$update(catLegendPresModel) {
        if (this.isNewPresModelSameAsOld(catLegendPresModel)) {
            return;
        }
        var oldPM = this.get_catLegendPresModel();
        this.swapAndCopyPresModel(catLegendPresModel);
        if (ss.isValue(oldPM) && !_.isEqual(oldPM.legendNames, catLegendPresModel.legendNames)) {
            this.raiseEvent(this.__legendNameChanged$1);
        }
        this.raiseEvent(this.__legendChanged$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorModel

tab.ColorModel = function tab_ColorModel(r, g, b, a) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
}
tab.ColorModel.fromArgbInt = function tab_ColorModel$fromArgbInt(color) {
    var r = (color & 16711680) >>> 16;
    var g = (color & 65280) >>> 8;
    var b = (color & 255);
    var a = (color & 4278190080) >>> 24;
    return new tab.ColorModel(r, g, b, a / 255);
}
tab.ColorModel.fromColorCode = function tab_ColorModel$fromColorCode(colorCode) {
    var cap = function(i) {
        return Math.min(Math.max(i, 0), 255);
    };
    var r;
    var g;
    var b;
    var a = 1;
    var matches = tab.ColorModel._hexFormat.exec(colorCode);
    if (ss.isValue(matches)) {
        r = cap(parseInt(matches[1], 16));
        g = cap(parseInt(matches[2], 16));
        b = cap(parseInt(matches[3], 16));
        return new tab.ColorModel(r, g, b, a);
    }
    matches = tab.ColorModel._rgbFormat.exec(colorCode);
    if (ss.isValue(matches)) {
        r = cap(parseInt(matches[1], 10));
        g = cap(parseInt(matches[2], 10));
        b = cap(parseInt(matches[3], 10));
        return new tab.ColorModel(r, g, b, a);
    }
    matches = tab.ColorModel._rgbaFormat.exec(colorCode);
    if (ss.isValue(matches)) {
        r = cap(parseInt(matches[1], 10));
        g = cap(parseInt(matches[2], 10));
        b = cap(parseInt(matches[3], 10));
        a = parseFloat(matches[4]);
        if (a <= 1) {
            a = a * 255;
        }
        if (a > 255) {
            a = 255;
        }
        if (a < 0) {
            a = 0;
        }
        a = a / 255;
        return new tab.ColorModel(r, g, b, a);
    }
    throw new Error('Unknown color format: ' + colorCode);
}
tab.ColorModel.fromColorModelPlusAlpha = function tab_ColorModel$fromColorModelPlusAlpha(rgb, a) {
    return new tab.ColorModel(rgb.get_r(), rgb.get_g(), rgb.get_b(), a);
}
tab.ColorModel.convertColorForCanvas = function tab_ColorModel$convertColorForCanvas(colorFromBackend) {
    var cm = tab.ColorModel.fromColorCode(colorFromBackend);
    return cm.toString();
}
tab.ColorModel.isDark = function tab_ColorModel$isDark(colorModel, darkThreshold) {
    var alphaBlended = tab.ColorModel.alphaBlend(colorModel, tab.ColorModel._white);
    return Math.max(alphaBlended.get_r(), alphaBlended.get_g(), alphaBlended.get_b()) <= darkThreshold;
}
tab.ColorModel.alphaBlend = function tab_ColorModel$alphaBlend(transparentColor, opaqueColor) {
    ss.Debug.assert(opaqueColor.get_a() >= 1, 'Alpha blending needs an opaque color');
    if (transparentColor.get_a() < 1) {
        var weightOfOpaqueColor = 1 - transparentColor.get_a();
        var red = (opaqueColor.get_r() * weightOfOpaqueColor) + (transparentColor.get_r() * transparentColor.get_a());
        var green = (opaqueColor.get_g() * weightOfOpaqueColor) + (transparentColor.get_g() * transparentColor.get_a());
        var blue = (opaqueColor.get_b() * weightOfOpaqueColor) + (transparentColor.get_b() * transparentColor.get_a());
        return new tab.ColorModel(parseInt(red), parseInt(green), parseInt(blue), 1);
    }
    else {
        return transparentColor;
    }
}
tab.ColorModel.isFullyTransparent = function tab_ColorModel$isFullyTransparent(colorModel) {
    return colorModel.get_a() === 0;
}
tab.ColorModel.alphaComposite = function tab_ColorModel$alphaComposite(src, dst) {
    if (dst.get_a() >= 0.99999) {
        return tab.ColorModel.alphaCompositeSolidDest(src, dst);
    }
    var minusSrcA = 1 - src.get_a();
    var finalAlpha = src.get_a() + (dst.get_a() * minusSrcA);
    return new tab.ColorModel(tab.ColorModel._alphaBlendChannelHelper(src.get_r(), src.get_a(), dst.get_r(), dst.get_a(), finalAlpha), tab.ColorModel._alphaBlendChannelHelper(src.get_g(), src.get_a(), dst.get_g(), dst.get_a(), finalAlpha), tab.ColorModel._alphaBlendChannelHelper(src.get_b(), src.get_a(), dst.get_b(), dst.get_a(), finalAlpha), finalAlpha);
}
tab.ColorModel.alphaCompositeSolidDest = function tab_ColorModel$alphaCompositeSolidDest(src, dst) {
    ss.Debug.assert(dst.get_a() >= 0.99999, 'Assuming a solid destination alpha ' + dst.get_a());
    return new tab.ColorModel(tab.ColorModel._alphaBlendSolidDestChannelHelper(src.get_r(), src.get_a(), dst.get_r()), tab.ColorModel._alphaBlendSolidDestChannelHelper(src.get_g(), src.get_a(), dst.get_g()), tab.ColorModel._alphaBlendSolidDestChannelHelper(src.get_b(), src.get_a(), dst.get_b()), 1);
}
tab.ColorModel._toHex = function tab_ColorModel$_toHex(input, padding) {
    var result = input.toString(16);
    while (result.length < padding) {
        result = '0' + result;
    }
    return result;
}
tab.ColorModel._alphaBlendChannelHelper = function tab_ColorModel$_alphaBlendChannelHelper(srcVal, srcAlpha, dstVal, dstAlpha, finalAlpha) {
    return Math.round((((srcVal * srcAlpha) + ((dstVal * dstAlpha) * (1 - srcAlpha))) / finalAlpha));
}
tab.ColorModel._alphaBlendSolidDestChannelHelper = function tab_ColorModel$_alphaBlendSolidDestChannelHelper(srcVal, srcAlpha, dstVal) {
    return Math.round((srcVal * srcAlpha) + (dstVal * (1 - srcAlpha)));
}
tab.ColorModel._linearizeComponent = function tab_ColorModel$_linearizeComponent(sRGBComponent) {
    if (sRGBComponent <= 0.04045) {
        return sRGBComponent / 12.92;
    }
    else {
        return Math.pow((sRGBComponent + 0.055) / 1.055, 2.4);
    }
}
tab.ColorModel._labTransform = function tab_ColorModel$_labTransform(XYZcomponent) {
    if (XYZcomponent > 0.0088564) {
        return Math.pow(XYZcomponent, 0.3333333);
    }
    else {
        return (7.787037 * XYZcomponent) + 0.137931;
    }
}
tab.ColorModel.prototype = {
    _r: 0,
    _g: 0,
    _b: 0,
    _a: 0,
    
    get_r: function tab_ColorModel$get_r() {
        return this._r;
    },
    
    get_g: function tab_ColorModel$get_g() {
        return this._g;
    },
    
    get_b: function tab_ColorModel$get_b() {
        return this._b;
    },
    
    get_a: function tab_ColorModel$get_a() {
        return this._a;
    },
    
    toString: function tab_ColorModel$toString() {
        return (this._a >= 0.99999) ? this.toRgb() : this.toRgba();
    },
    
    equals: function tab_ColorModel$equals(m) {
        return ss.isValue(m) && this._r === m._r && this._g === m._g && this._b === m._b && this._a === m._a;
    },
    
    luminance: function tab_ColorModel$luminance() {
        var rf = tab.ColorModel._linearizeComponent(this._r / 255);
        var gf = tab.ColorModel._linearizeComponent(this._g / 255);
        var bf = tab.ColorModel._linearizeComponent(this._b / 255);
        var Y = (0.212671 * rf) + (0.71516 * gf) + (0.072169 * bf);
        var L = (116 * tab.ColorModel._labTransform(Y)) - 16;
        return L;
    },
    
    toRgba: function tab_ColorModel$toRgba() {
        return new ss.StringBuilder('rgba(').append(this._r).append(',').append(this._g).append(',').append(this._b).append(',').append(this._a).append(')').toString();
    },
    
    toRgba255: function tab_ColorModel$toRgba255() {
        return new ss.StringBuilder('rgba(').append(this._r).append(',').append(this._g).append(',').append(this._b).append(',').append(this._a * 255).append(')').toString();
    },
    
    toRgb: function tab_ColorModel$toRgb() {
        return new ss.StringBuilder('rgb(').append(this._r).append(',').append(this._g).append(',').append(this._b).append(')').toString();
    },
    
    toArgbHex: function tab_ColorModel$toArgbHex() {
        var alpha255 = this._a * 255;
        return new ss.StringBuilder('#').append(tab.ColorModel._toHex(alpha255, 2)).append(tab.ColorModel._toHex(this._r, 2)).append(tab.ColorModel._toHex(this._g, 2)).append(tab.ColorModel._toHex(this._b, 2)).toString();
    },
    
    toArgbInt: function tab_ColorModel$toArgbInt() {
        var alpha255 = this._a * 255;
        return (alpha255 << 24) + (this._r << 16) + (this._g << 8) + this._b;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuickFilterDisplayModel

tab.QuickFilterDisplayModel = function tab_QuickFilterDisplayModel(parent) {
    tab.QuickFilterDisplayModel.initializeBase(this, [ parent, new tab.PresModelPathItem('quickFilterDisplay') ]);
}
tab.QuickFilterDisplayModel.prototype = {
    _frame$1: null,
    _quickFilterTitleModel$1: null,
    _quickFilterCommandsModel$1: null,
    
    add_quickFilterDisplayUpdated: function tab_QuickFilterDisplayModel$add_quickFilterDisplayUpdated(value) {
        this.__quickFilterDisplayUpdated$1 = ss.Delegate.combine(this.__quickFilterDisplayUpdated$1, value);
    },
    remove_quickFilterDisplayUpdated: function tab_QuickFilterDisplayModel$remove_quickFilterDisplayUpdated(value) {
        this.__quickFilterDisplayUpdated$1 = ss.Delegate.remove(this.__quickFilterDisplayUpdated$1, value);
    },
    
    __quickFilterDisplayUpdated$1: null,
    
    get_quickFilterTitle: function tab_QuickFilterDisplayModel$get_quickFilterTitle() {
        return this.get_quickFilterDisplayPresModel().quickFilterTitle;
    },
    
    get_quickFilterCommands: function tab_QuickFilterDisplayModel$get_quickFilterCommands() {
        return this.get_quickFilterDisplayPresModel().quickFilterCommands;
    },
    
    get_quickFilterModeMatrix: function tab_QuickFilterDisplayModel$get_quickFilterModeMatrix() {
        var newFilter = tab.FeatureParamsLookup.getBool(tab.FeatureParam.newFilter);
        if (ss.isValue(newFilter) && newFilter) {
            return this._buildTempQuickFilterModeMatrix$1();
        }
        else {
            return null;
        }
    },
    
    get_quickFilterDisplayPresModel: function tab_QuickFilterDisplayModel$get_quickFilterDisplayPresModel() {
        return this.presModel;
    },
    
    get_zone: function tab_QuickFilterDisplayModel$get_zone() {
        return this.get_zoneModel().get_presModel();
    },
    
    get_frame: function tab_QuickFilterDisplayModel$get_frame() {
        return this._frame$1;
    },
    
    get_zoneModel: function tab_QuickFilterDisplayModel$get_zoneModel() {
        return (this.get_parent()).get_zone();
    },
    
    update: function tab_QuickFilterDisplayModel$update(newQuickFilterDisplayPresModel, newFrame) {
        var frameUpdated = !_.isEqual(this._frame$1, newFrame);
        this._frame$1 = newFrame;
        if (this.isNewPresModelSameAsOld(newQuickFilterDisplayPresModel)) {
            if (frameUpdated) {
                this.raiseEvent(this.__quickFilterDisplayUpdated$1, newQuickFilterDisplayPresModel);
            }
            return;
        }
        if (ss.isValue(newQuickFilterDisplayPresModel) && ss.isValue(newQuickFilterDisplayPresModel.quickFilterTitle)) {
            this._quickFilterTitleModel$1 = new tab.TextRegionModel(this, 'quickFilterTitle');
        }
        this._quickFilterTitleModel$1.update(newQuickFilterDisplayPresModel.quickFilterTitle);
        if (ss.isValue(newQuickFilterDisplayPresModel) && ss.isValue(newQuickFilterDisplayPresModel.quickFilterCommands)) {
            this._quickFilterCommandsModel$1 = new tab.CommandsModel(this);
        }
        this._quickFilterCommandsModel$1.update(newQuickFilterDisplayPresModel.quickFilterCommands);
        this.simpleSwapToUpdate(newQuickFilterDisplayPresModel, this.__quickFilterDisplayUpdated$1, newQuickFilterDisplayPresModel);
    },
    
    _buildTempQuickFilterModeMatrix$1: function tab_QuickFilterDisplayModel$_buildTempQuickFilterModeMatrix$1() {
        var modes = [];
        var aggTypes = [ 'year', 'qtr', 'month', 'day', 'hour', 'minute', 'second', 'week', 'weekday', 'month-year', 'mdy', 'none', 'trunc-year', 'trunc-qtr', 'trunc-month', 'trunc-week', 'trunc-day', 'trunc-hour', 'trunc-minute', 'trunc-second' ];
        var catModes = [ 'check-list', 'radio-list', 'dropdown', 'slider', 'pattern', 'type-in-list', 'check-dropdown' ];
        var quantModes = [ 'min-max', 'min-only', 'max-only', 'rel-date', 'rel-pick' ];
        var $enum1 = ss.IEnumerator.getEnumerator(aggTypes);
        while ($enum1.moveNext()) {
            var aggType = $enum1.current;
            var $enum2 = ss.IEnumerator.getEnumerator(catModes);
            while ($enum2.moveNext()) {
                var catMode = $enum2.current;
                var mode = {};
                mode.aggregation = aggType;
                mode.categoricalMode = catMode;
                modes.add(mode);
            }
            var $enum3 = ss.IEnumerator.getEnumerator(quantModes);
            while ($enum3.moveNext()) {
                var quantMode = $enum3.current;
                var mode = {};
                mode.aggregation = aggType;
                mode.quantitativeMode = quantMode;
                modes.add(mode);
            }
        }
        return modes;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelvesModel

tab.ShelvesModel = function tab_ShelvesModel(parent) {
    this._shelfModels$1 = [];
    tab.ShelvesModel.initializeBase(this, [ parent, new tab.PresModelPathItem('shelves', 1) ]);
}
tab.ShelvesModel.createShelfModel = function tab_ShelvesModel$createShelfModel(parent, shelf, schema, index) {
    var m = new tab.ShelfModel(new tab.ShelfListArrayModel(parent), index);
    m.update(shelf, schema);
    return m;
}
tab.ShelvesModel.prototype = {
    
    add_newShelves: function tab_ShelvesModel$add_newShelves(value) {
        this.__newShelves$1 = ss.Delegate.combine(this.__newShelves$1, value);
    },
    remove_newShelves: function tab_ShelvesModel$remove_newShelves(value) {
        this.__newShelves$1 = ss.Delegate.remove(this.__newShelves$1, value);
    },
    
    __newShelves$1: null,
    
    get_shelves: function tab_ShelvesModel$get_shelves() {
        return this._shelfModels$1;
    },
    
    findShelf: function tab_ShelvesModel$findShelf(st) {
        return this._findShelfInList$1(this._shelfModels$1, st);
    },
    
    update: function tab_ShelvesModel$update(pm, schema, defaultPaneSpecId) {
        if (this.isNewPresModelSameAsOld(pm)) {
            return;
        }
        this.swapAndCopyPresModel(pm);
        this._buildShelfModels$1(pm, schema, defaultPaneSpecId);
        this.raiseEvent(this.__newShelves$1);
    },
    
    _buildShelfModels$1: function tab_ShelvesModel$_buildShelfModels$1(pm, schema, defaultPaneSpecId) {
        if (ss.isValue(pm)) {
            var shelvesToKill = this._shelfModels$1.clone();
            for (var i = 0; i < pm.shelfList.length; i++) {
                var shelf = pm.shelfList[i];
                if (ss.isNullOrUndefined(shelf.paneSpec) && ss.isValue(defaultPaneSpecId)) {
                    shelf.paneSpec = defaultPaneSpecId;
                }
                var sm = _.find(this._shelfModels$1, function(model) {
                    return model.get_shelfType() === shelf.shelfType && model.get_paneId() === (shelf.paneSpec || 0);
                });
                if (ss.isValue(sm)) {
                    tab.Log.get(this).debug('Updating shelf: type=%s, paneId=%s', shelf.shelfType, shelf.paneSpec);
                    shelvesToKill.remove(sm);
                    sm.update(shelf, schema);
                }
                else {
                    tab.Log.get(this).debug('Creating shelf: type=%s, paneId=%s', shelf.shelfType, shelf.paneSpec);
                    this._shelfModels$1.add(tab.ShelvesModel.createShelfModel(this, shelf, schema, i));
                }
            }
            var $enum1 = ss.IEnumerator.getEnumerator(shelvesToKill);
            while ($enum1.moveNext()) {
                var toKill = $enum1.current;
                tab.Log.get(this).debug('Removing shelf: type=%s, paneId=%s', toKill.get_shelfType(), toKill.get_paneId());
                this._shelfModels$1.remove(toKill);
            }
        }
    },
    
    _findShelfInList$1: function tab_ShelvesModel$_findShelfInList$1(newModels, shelfType) {
        return _.find(newModels, function(model) {
            return model.get_shelfType() === shelfType;
        });
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfListArrayModel

tab.ShelfListArrayModel = function tab_ShelfListArrayModel(parent) {
    tab.ShelfListArrayModel.initializeBase(this, [ parent, new tab.PresModelPathItem('shelfList', 1) ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.StoryPointsModel

tab.StoryPointsModel = function tab_StoryPointsModel(parent) {
    tab.StoryPointsModel.initializeBase(this, [ parent, new tab.PresModelPathItem('storyPoints') ]);
}
tab.StoryPointsModel.prototype = {
    _pointModel$1: null,
    
    get_currentStoryPoint: function tab_StoryPointsModel$get_currentStoryPoint() {
        return this._pointModel$1;
    },
    
    update: function tab_StoryPointsModel$update(storyPoint) {
        if (!ss.isValue(this._pointModel$1)) {
            this._pointModel$1 = new tab.StoryPointModel(this, storyPoint.storyPointId);
        }
        this._pointModel$1.update(storyPoint);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPaletteCollectionModel

tab.ColorPaletteCollectionModel = function tab_ColorPaletteCollectionModel(parent) {
    tab.ColorPaletteCollectionModel.initializeBase(this, [ parent, new tab.PresModelPathItem('colorPalettes') ]);
}
tab.ColorPaletteCollectionModel.prototype = {
    
    get_paletteCollectionPresModel: function tab_ColorPaletteCollectionModel$get_paletteCollectionPresModel() {
        return this.presModel;
    },
    
    get_qColorPaletteGroups: function tab_ColorPaletteCollectionModel$get_qColorPaletteGroups() {
        return this.get_paletteCollectionPresModel().qColorPaletteGroups;
    },
    
    get_qColorPaletteGroupCount: function tab_ColorPaletteCollectionModel$get_qColorPaletteGroupCount() {
        return this.get_paletteCollectionPresModel().qColorPaletteGroups.length;
    },
    
    get_catColorPaletteGroupCount: function tab_ColorPaletteCollectionModel$get_catColorPaletteGroupCount() {
        return this.get_paletteCollectionPresModel().catColorPaletteGroups.length;
    },
    
    get_catColorPaletteGroups: function tab_ColorPaletteCollectionModel$get_catColorPaletteGroups() {
        return this.get_paletteCollectionPresModel().catColorPaletteGroups;
    },
    
    get_colorPalettes: function tab_ColorPaletteCollectionModel$get_colorPalettes() {
        var colorPresModel = this.presModel;
        if (ss.isNullOrUndefined(colorPresModel)) {
            return [];
        }
        return colorPresModel.colorPalettes;
    },
    
    colorPaletteGroup: function tab_ColorPaletteCollectionModel$colorPaletteGroup(groupPresModel) {
        var indices = groupPresModel.palettesIndices;
        return _.map(indices, ss.Delegate.create(this, function(index) {
            return this.get_colorPalettes()[index];
        }));
    },
    
    qColorPaletteGroup: function tab_ColorPaletteCollectionModel$qColorPaletteGroup(groupIndex) {
        return this.colorPaletteGroup(this.get_qColorPaletteGroups()[groupIndex]);
    },
    
    catColorPaletteGroup: function tab_ColorPaletteCollectionModel$catColorPaletteGroup(groupIndex) {
        return this.colorPaletteGroup(this.get_catColorPaletteGroups()[groupIndex]);
    },
    
    update: function tab_ColorPaletteCollectionModel$update(newColorPalettes) {
        this.simpleSwapToUpdate(newColorPalettes, null);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FlipboardModel

tab.FlipboardModel = function tab_FlipboardModel(parent) {
    tab.FlipboardModel.initializeBase(this, [ parent, new tab.PresModelPathItem('flipboard') ]);
    this._storyPointsModel$1 = new tab.StoryPointsModel(this);
}
tab.FlipboardModel.prototype = {
    _storyPointsModel$1: null,
    
    add_invalidateZone: function tab_FlipboardModel$add_invalidateZone(value) {
        this.__invalidateZone$1 = ss.Delegate.combine(this.__invalidateZone$1, value);
    },
    remove_invalidateZone: function tab_FlipboardModel$remove_invalidateZone(value) {
        this.__invalidateZone$1 = ss.Delegate.remove(this.__invalidateZone$1, value);
    },
    
    __invalidateZone$1: null,
    
    get_flipboardPresModel: function tab_FlipboardModel$get_flipboardPresModel() {
        return this.presModel;
    },
    
    get_storyPointModel: function tab_FlipboardModel$get_storyPointModel() {
        return this._storyPointsModel$1.get_currentStoryPoint();
    },
    
    get_dashboardModel: function tab_FlipboardModel$get_dashboardModel() {
        return this.get_storyPointModel().get_dashboardModel();
    },
    
    get_zoneId: function tab_FlipboardModel$get_zoneId() {
        return (this.get_parent()).get_zone().get_zoneId();
    },
    
    get_currentStoryPointId: function tab_FlipboardModel$get_currentStoryPointId() {
        return this.get_flipboardPresModel().activeStoryPointId;
    },
    
    invalidated: function tab_FlipboardModel$invalidated() {
        this.raiseEvent(this.__invalidateZone$1);
    },
    
    update: function tab_FlipboardModel$update(flipboardPresModel) {
        if (ss.isValue(flipboardPresModel.activeStoryPointId)) {
            this._storyPointsModel$1.update(flipboardPresModel.storyPoints[flipboardPresModel.activeStoryPointId.toString()]);
        }
        this.swapPresModel(flipboardPresModel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorLegendModel

tab.QuantitativeColorLegendModel = function tab_QuantitativeColorLegendModel(parent, contentType) {
    tab.QuantitativeColorLegendModel.initializeBase(this, [ parent, new tab.PresModelPathItem(contentType) ]);
}
tab.QuantitativeColorLegendModel.prototype = {
    
    add_legendChanged: function tab_QuantitativeColorLegendModel$add_legendChanged(value) {
        this.__legendChanged$1 = ss.Delegate.combine(this.__legendChanged$1, value);
    },
    remove_legendChanged: function tab_QuantitativeColorLegendModel$remove_legendChanged(value) {
        this.__legendChanged$1 = ss.Delegate.remove(this.__legendChanged$1, value);
    },
    
    __legendChanged$1: null,
    
    get_quantColorLegendPresModel: function tab_QuantitativeColorLegendModel$get_quantColorLegendPresModel() {
        return this.presModel;
    },
    
    get_worksheetName: function tab_QuantitativeColorLegendModel$get_worksheetName() {
        return this.get__zone$1().get_worksheetName();
    },
    
    get__zone$1: function tab_QuantitativeColorLegendModel$get__zone$1() {
        var wrapper = Type.safeCast(this.get_parent(), tab.ZoneContentWrapperModel);
        return wrapper.get_zone();
    },
    
    update: function tab_QuantitativeColorLegendModel$update(quantLegendPresModel) {
        if (this.isNewPresModelSameAsOld(quantLegendPresModel)) {
            return;
        }
        this.swapAndCopyPresModel(quantLegendPresModel);
        this.raiseEvent(this.__legendChanged$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.StoryPointModel

tab.StoryPointModel = function tab_StoryPointModel(parent, storyPointId) {
    tab.StoryPointModel.initializeBase(this, [ parent, new tab.PresModelPathItem(storyPointId.toString(), 0) ]);
    this._dashboardModel$1 = new tab.DashboardModel(this, 'dashboardPresModel');
}
tab.StoryPointModel.prototype = {
    _dashboardModel$1: null,
    
    add_dashboardDisposal: function tab_StoryPointModel$add_dashboardDisposal(value) {
        this.__dashboardDisposal$1 = ss.Delegate.combine(this.__dashboardDisposal$1, value);
    },
    remove_dashboardDisposal: function tab_StoryPointModel$remove_dashboardDisposal(value) {
        this.__dashboardDisposal$1 = ss.Delegate.remove(this.__dashboardDisposal$1, value);
    },
    
    __dashboardDisposal$1: null,
    
    add_newStoryPoint: function tab_StoryPointModel$add_newStoryPoint(value) {
        this.__newStoryPoint$1 = ss.Delegate.combine(this.__newStoryPoint$1, value);
    },
    remove_newStoryPoint: function tab_StoryPointModel$remove_newStoryPoint(value) {
        this.__newStoryPoint$1 = ss.Delegate.remove(this.__newStoryPoint$1, value);
    },
    
    __newStoryPoint$1: null,
    
    get_dashboardModel: function tab_StoryPointModel$get_dashboardModel() {
        return this._dashboardModel$1;
    },
    
    get_isBackingSheetDashboard: function tab_StoryPointModel$get_isBackingSheetDashboard() {
        return this.get__storyPointPresModel$1().isBackingSheetDashboard;
    },
    
    get__storyPointPresModel$1: function tab_StoryPointModel$get__storyPointPresModel$1() {
        return this.presModel;
    },
    
    get_storyPointId: function tab_StoryPointModel$get_storyPointId() {
        return this.get__storyPointPresModel$1().storyPointId;
    },
    
    update: function tab_StoryPointModel$update(storyPointPresModel) {
        if (ss.isValue(this.get__storyPointPresModel$1()) && (this.get_storyPointId() !== storyPointPresModel.storyPointId)) {
            this.set_presModelKey(new tab.PresModelPathItem(storyPointPresModel.storyPointId.toString(), 0));
            if (ss.isValue(this._dashboardModel$1)) {
                this.raiseEvent(this.__dashboardDisposal$1);
                this._dashboardModel$1 = null;
            }
            this._dashboardModel$1 = new tab.DashboardModel(this, 'dashboardPresModel');
            this._updateDashboard$1(storyPointPresModel.dashboardPresModel);
            this.raiseEvent(this.__newStoryPoint$1);
        }
        else {
            this._updateDashboard$1(storyPointPresModel.dashboardPresModel);
        }
        this.swapPresModel(storyPointPresModel);
    },
    
    _updateDashboard$1: function tab_StoryPointModel$_updateDashboard$1(dashboardPresModel) {
        if (ss.isValue(dashboardPresModel)) {
            this.get_dashboardModel().update(dashboardPresModel);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FieldModel

tab.FieldModel = function tab_FieldModel(parent) {
    tab.FieldModel.initializeBase(this, [ parent, new tab.PresModelPathItem('field') ]);
}
tab.FieldModel.prototype = {
    
    get_dataSourceModel: function tab_FieldModel$get_dataSourceModel() {
        return this.get_parent();
    },
    
    get_canHaveChildren: function tab_FieldModel$get_canHaveChildren() {
        return false;
    },
    
    get_isUnsortedContainer: function tab_FieldModel$get_isUnsortedContainer() {
        return false;
    },
    
    get_isSelectable: function tab_FieldModel$get_isSelectable() {
        return !this.get_isUnsortedContainer();
    },
    
    get_isDraggable: function tab_FieldModel$get_isDraggable() {
        return this.get_isSelectable() && !this.get_isHidden() && !this.get_isInvalid();
    },
    
    get_childToSelect: function tab_FieldModel$get_childToSelect() {
        return (this.get_isUnsortedContainer()) ? null : this;
    },
    
    get_isDerived: function tab_FieldModel$get_isDerived() {
        if (this.get_canHaveChildren()) {
            return false;
        }
        return this.get_isGenerated() || this.get_isAutoColumn() || (this.get_isColumn() && this.asColumn().get_isInstance());
    },
    
    get_isMeasureNamesOrValues: function tab_FieldModel$get_isMeasureNamesOrValues() {
        return this.get_localName() === tab.FieldModel.nameOfMeasuresColumn || this.get_localName() === tab.FieldModel.nameOfMeasureValuesColumn;
    },
    
    get_field: function tab_FieldModel$get_field() {
        return this.presModel;
    },
    
    get_fieldIconResource: function tab_FieldModel$get_fieldIconResource() {
        return this.get_dataSourceModel().getFieldIconResource(this.get_field().fieldIconIdx);
    },
    
    get_isInstance: function tab_FieldModel$get_isInstance() {
        return !this.get_isGenerated() && this.get_isDerived();
    },
    
    get_isHidden: function tab_FieldModel$get_isHidden() {
        return this.get_field().isHidden || this.get_isInstance();
    },
    
    get_isInvalid: function tab_FieldModel$get_isInvalid() {
        return this.get_field().isInvalid;
    },
    
    get_isGenerated: function tab_FieldModel$get_isGenerated() {
        return this.get_field().isGenerated;
    },
    
    get_isAutoColumn: function tab_FieldModel$get_isAutoColumn() {
        return this.get_field().isAutoColumn;
    },
    
    get_isAllowedInCalcs: function tab_FieldModel$get_isAllowedInCalcs() {
        return this.get_field().isAllowedInCalcs;
    },
    
    get_isUnnamedCalc: function tab_FieldModel$get_isUnnamedCalc() {
        return this.get_field().isUnnamed || false;
    },
    
    get_globalName: function tab_FieldModel$get_globalName() {
        return this.get_field().fn;
    },
    
    get_localName: function tab_FieldModel$get_localName() {
        return this.get_field().name;
    },
    
    get_description: function tab_FieldModel$get_description() {
        return this.get_field().description;
    },
    
    get_userCaption: function tab_FieldModel$get_userCaption() {
        return this.get_field().userCaption;
    },
    
    get_ordinal: function tab_FieldModel$get_ordinal() {
        return this.get_field().datasourceOrdinal;
    },
    
    get_isColumn: function tab_FieldModel$get_isColumn() {
        return this.get_instanceType() === 'column' || this.get_instanceType() === 'group';
    },
    
    get_isGroup: function tab_FieldModel$get_isGroup() {
        return this.get_instanceType() === 'group';
    },
    
    get_isCubeDimension: function tab_FieldModel$get_isCubeDimension() {
        return this.get_instanceType() === 'cubeDimension';
    },
    
    get_isDrillPath: function tab_FieldModel$get_isDrillPath() {
        return this.get_instanceType() === 'drillPath';
    },
    
    get_isCubeHierarchy: function tab_FieldModel$get_isCubeHierarchy() {
        return this.get_instanceType() === 'cubeHierarchy';
    },
    
    get_isCubeFolder: function tab_FieldModel$get_isCubeFolder() {
        return this.get_instanceType() === 'cubeFolder';
    },
    
    get_isFolder: function tab_FieldModel$get_isFolder() {
        return this.get_instanceType() === 'folder';
    },
    
    get_isRelationalTable: function tab_FieldModel$get_isRelationalTable() {
        return this.get_instanceType() === 'relationalTable';
    },
    
    get_defaultRole: function tab_FieldModel$get_defaultRole() {
        return (this.get_field()).defaultFieldRole;
    },
    
    get_role: function tab_FieldModel$get_role() {
        return (this.get_field()).fieldRole;
    },
    
    get_defaultFieldType: function tab_FieldModel$get_defaultFieldType() {
        return (this.get_isColumn()) ? (this.get_field()).defaultFieldType : 'unknown';
    },
    
    get_fieldType: function tab_FieldModel$get_fieldType() {
        return (this.get_isColumn()) ? (this.get_field()).fieldType : 'unknown';
    },
    
    get_displayName: function tab_FieldModel$get_displayName() {
        return (this.get_isDrillPath()) ? (this.get_localName() || this.get_description()) : (this.get_description() || this.get_localName());
    },
    
    get_tooltip: function tab_FieldModel$get_tooltip() {
        return (this.get_userCaption() || this.get_description() || this.get_displayName());
    },
    
    matchesFolderRole: function tab_FieldModel$matchesFolderRole(section) {
        if (this.get_isFolder()) {
            return this.asFolder().get_folderRole() === section;
        }
        else {
            switch (section) {
                case 'dimensions':
                    return this.get_defaultRole() === 'dimension';
                case 'measure':
                    return this.get_defaultRole() === 'measure';
                case 'groups':
                    return this.get_isGroup();
                case 'parameters':
                    return true;
                default:
                    return false;
            }
        }
    },
    
    asColumn: function tab_FieldModel$asColumn() {
        ss.Debug.assert(this.get_isColumn(), 'Field is not a FieldColumnModel');
        return Type.safeCast(this, tab.FieldColumnModel);
    },
    
    asGroup: function tab_FieldModel$asGroup() {
        ss.Debug.assert(this.get_isGroup(), 'Field is not a GroupModel');
        return Type.safeCast(this, tab.GroupModel);
    },
    
    asDimension: function tab_FieldModel$asDimension() {
        ss.Debug.assert(this.get_isCubeDimension(), 'Field is not a CubeDimensionModel');
        return Type.safeCast(this, tab.CubeDimensionModel);
    },
    
    asHierarchy: function tab_FieldModel$asHierarchy() {
        ss.Debug.assert(this.get_isCubeHierarchy(), 'Field is not a CubeHierarchyModel');
        return Type.safeCast(this, tab.CubeHierarchyModel);
    },
    
    asCubeFolder: function tab_FieldModel$asCubeFolder() {
        ss.Debug.assert(this.get_isCubeFolder(), 'Field is not a CubeFolderModel');
        return Type.safeCast(this, tab.CubeFolderModel);
    },
    
    asFolder: function tab_FieldModel$asFolder() {
        ss.Debug.assert(this.get_isFolder(), 'Field is not a FolderModel');
        return Type.safeCast(this, tab.FolderModel);
    },
    
    asDrillPath: function tab_FieldModel$asDrillPath() {
        ss.Debug.assert(this.get_isDrillPath(), 'Field is not a DrillPathModel');
        return Type.safeCast(this, tab.DrillPathModel);
    },
    
    asRelationalTable: function tab_FieldModel$asRelationalTable() {
        ss.Debug.assert(this.get_isRelationalTable(), 'Field is not a RelationalTableModel');
        return Type.safeCast(this, tab.RelationalTableModel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FieldColumnModel

tab.FieldColumnModel = function tab_FieldColumnModel(parent) {
    tab.FieldColumnModel.initializeBase(this, [ parent ]);
}
tab.FieldColumnModel.prototype = {
    fieldCol: null,
    
    get_instanceType: function tab_FieldColumnModel$get_instanceType() {
        return 'column';
    },
    
    get_dataType: function tab_FieldColumnModel$get_dataType() {
        return this.fieldCol.dataType;
    },
    
    get_defaultRole: function tab_FieldColumnModel$get_defaultRole() {
        return this.fieldCol.defaultFieldRole;
    },
    
    get_role: function tab_FieldColumnModel$get_role() {
        return this.fieldCol.fieldRole;
    },
    
    get_baseColumnName: function tab_FieldColumnModel$get_baseColumnName() {
        return (this.get_isInstance()) ? this.fieldCol.baseColumnName : this.get_globalName();
    },
    
    get_baseColumn: function tab_FieldColumnModel$get_baseColumn() {
        return (this.get_isInstance()) ? (this.get_parent()).findField(this.get_baseColumnName()) : this;
    },
    
    get_isInstance: function tab_FieldColumnModel$get_isInstance() {
        return !ss.isNullOrUndefined(this.fieldCol.isInstance) && this.fieldCol.isInstance;
    },
    
    get_isAllowedInCalcs: function tab_FieldColumnModel$get_isAllowedInCalcs() {
        var col = this.get_baseColumn();
        return (col === this) ? tab.FieldColumnModel.callBaseMethod(this, 'get_isAllowedInCalcs') : col.get_isAllowedInCalcs();
    },
    
    get_aggType: function tab_FieldColumnModel$get_aggType() {
        return this.fieldCol.aggregation;
    },
    
    get_defaultAggType: function tab_FieldColumnModel$get_defaultAggType() {
        return this.fieldCol.defaultAggregation;
    },
    
    get_isCalculated: function tab_FieldColumnModel$get_isCalculated() {
        return this.fieldCol.isCalculated;
    },
    
    update: function tab_FieldColumnModel$update(pm) {
        this.fieldCol = pm;
        this.swapAndCopyPresModel(pm);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.GroupModel

tab.GroupModel = function tab_GroupModel(parent) {
    tab.GroupModel.initializeBase(this, [ parent ]);
}
tab.GroupModel.prototype = {
    
    get_instanceType: function tab_GroupModel$get_instanceType() {
        return 'group';
    },
    
    get_isCombinedField: function tab_GroupModel$get_isCombinedField() {
        return ((this.fieldCol).isCombinedField || false);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DrillPathModel

tab.DrillPathModel = function tab_DrillPathModel(parent) {
    tab.DrillPathModel.initializeBase(this, [ parent ]);
}
tab.DrillPathModel.prototype = {
    _levels$2: null,
    
    get_levels: function tab_DrillPathModel$get_levels() {
        return this._levels$2;
    },
    
    get_childToSelect: function tab_DrillPathModel$get_childToSelect() {
        return this._levels$2[0];
    },
    
    get_instanceType: function tab_DrillPathModel$get_instanceType() {
        return 'drillPath';
    },
    
    get_canHaveChildren: function tab_DrillPathModel$get_canHaveChildren() {
        return true;
    },
    
    update: function tab_DrillPathModel$update(pm, newLevels) {
        this.swapAndCopyPresModel(pm);
        this._levels$2 = newLevels;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CubeHierarchyModel

tab.CubeHierarchyModel = function tab_CubeHierarchyModel(parent) {
    tab.CubeHierarchyModel.initializeBase(this, [ parent ]);
}
tab.CubeHierarchyModel.prototype = {
    _levels$2: null,
    
    get_levels: function tab_CubeHierarchyModel$get_levels() {
        return this._levels$2;
    },
    
    get_childToSelect: function tab_CubeHierarchyModel$get_childToSelect() {
        return this._levels$2[0];
    },
    
    get_instanceType: function tab_CubeHierarchyModel$get_instanceType() {
        return 'cubeHierarchy';
    },
    
    get_canHaveChildren: function tab_CubeHierarchyModel$get_canHaveChildren() {
        return true;
    },
    
    update: function tab_CubeHierarchyModel$update(pm, newLevels) {
        this.swapAndCopyPresModel(pm);
        this._levels$2 = newLevels;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FolderModel

tab.FolderModel = function tab_FolderModel(parent) {
    tab.FolderModel.initializeBase(this, [ parent ]);
}
tab.FolderModel.prototype = {
    _fields$2: null,
    
    get_fields: function tab_FolderModel$get_fields() {
        return this._fields$2;
    },
    
    get_folderRole: function tab_FolderModel$get_folderRole() {
        return (this.presModel).folderRole;
    },
    
    get_instanceType: function tab_FolderModel$get_instanceType() {
        return 'folder';
    },
    
    get_canHaveChildren: function tab_FolderModel$get_canHaveChildren() {
        return true;
    },
    
    get_isUnsortedContainer: function tab_FolderModel$get_isUnsortedContainer() {
        return true;
    },
    
    update: function tab_FolderModel$update(pm, newFields) {
        this.swapAndCopyPresModel(pm);
        this._fields$2 = newFields;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CubeFolderModel

tab.CubeFolderModel = function tab_CubeFolderModel(parent) {
    tab.CubeFolderModel.initializeBase(this, [ parent ]);
}
tab.CubeFolderModel.prototype = {
    _hierarchies$2: null,
    _columns$2: null,
    
    get_hierarchies: function tab_CubeFolderModel$get_hierarchies() {
        return this._hierarchies$2;
    },
    
    get_childToSelect: function tab_CubeFolderModel$get_childToSelect() {
        return this._hierarchies$2[0];
    },
    
    get_columns: function tab_CubeFolderModel$get_columns() {
        return this._columns$2;
    },
    
    get_instanceType: function tab_CubeFolderModel$get_instanceType() {
        return 'cubeFolder';
    },
    
    get_canHaveChildren: function tab_CubeFolderModel$get_canHaveChildren() {
        return true;
    },
    
    get_isUnsortedContainer: function tab_CubeFolderModel$get_isUnsortedContainer() {
        return true;
    },
    
    update: function tab_CubeFolderModel$update(pm, newHierarchies, newColumns) {
        this.swapAndCopyPresModel(pm);
        this._hierarchies$2 = newHierarchies;
        this._columns$2 = newColumns;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CubeDimensionModel

tab.CubeDimensionModel = function tab_CubeDimensionModel(parent) {
    tab.CubeDimensionModel.initializeBase(this, [ parent ]);
}
tab.CubeDimensionModel.prototype = {
    _hierarchies$2: null,
    _folders$2: null,
    _attributes$2: null,
    
    get_hierarchies: function tab_CubeDimensionModel$get_hierarchies() {
        return this._hierarchies$2;
    },
    
    get_childToSelect: function tab_CubeDimensionModel$get_childToSelect() {
        var defaultHierarchyName = (this.presModel).defaultHierarchyName;
        if (!String.isNullOrEmpty(defaultHierarchyName)) {
            var $enum1 = ss.IEnumerator.getEnumerator(this._hierarchies$2);
            while ($enum1.moveNext()) {
                var h = $enum1.current;
                if (h.get_localName() === defaultHierarchyName) {
                    return h.get_levels()[0];
                }
            }
        }
        var hierarchyModels = [];
        var $enum2 = ss.IEnumerator.getEnumerator(this._hierarchies$2);
        while ($enum2.moveNext()) {
            var h = $enum2.current;
            hierarchyModels.add(h);
        }
        var $enum3 = ss.IEnumerator.getEnumerator(this._folders$2);
        while ($enum3.moveNext()) {
            var f = $enum3.current;
            var $enum4 = ss.IEnumerator.getEnumerator(f.get_hierarchies());
            while ($enum4.moveNext()) {
                var h = $enum4.current;
                hierarchyModels.add(h);
            }
        }
        hierarchyModels.sort(function(a, b) {
            if (a.get_levels().length > 1 && b.get_levels().length <= 1) {
                return -1;
            }
            else if (a.get_levels().length <= 1 && b.get_levels().length > 1) {
                return 1;
            }
            else {
                return 0;
            }
        });
        return (hierarchyModels.length > 0) ? hierarchyModels[0].get_levels()[0] : null;
    },
    
    get_folders: function tab_CubeDimensionModel$get_folders() {
        return this._folders$2;
    },
    
    get_attributes: function tab_CubeDimensionModel$get_attributes() {
        return this._attributes$2;
    },
    
    get_instanceType: function tab_CubeDimensionModel$get_instanceType() {
        return 'cubeDimension';
    },
    
    get_canHaveChildren: function tab_CubeDimensionModel$get_canHaveChildren() {
        return true;
    },
    
    update: function tab_CubeDimensionModel$update(pm, newHierarchies, newFolders, newAttributes) {
        this.swapAndCopyPresModel(pm);
        this._hierarchies$2 = newHierarchies;
        this._folders$2 = newFolders;
        this._attributes$2 = newAttributes;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RelationalTableModel

tab.RelationalTableModel = function tab_RelationalTableModel(parent) {
    tab.RelationalTableModel.initializeBase(this, [ parent ]);
}
tab.RelationalTableModel.prototype = {
    _columns$2: null,
    
    get_columns: function tab_RelationalTableModel$get_columns() {
        return this._columns$2;
    },
    
    get_instanceType: function tab_RelationalTableModel$get_instanceType() {
        return 'relationalTable';
    },
    
    get_canHaveChildren: function tab_RelationalTableModel$get_canHaveChildren() {
        return true;
    },
    
    get_isUnsortedContainer: function tab_RelationalTableModel$get_isUnsortedContainer() {
        return true;
    },
    
    update: function tab_RelationalTableModel$update(pm, newColumns) {
        this.swapAndCopyPresModel(pm);
        this._columns$2 = newColumns;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MultipleFieldsModel

tab.MultipleFieldsModel = function tab_MultipleFieldsModel() {
    tab.MultipleFieldsModel.initializeBase(this, [ null ]);
    var f = {};
    f.fn = '';
    this.swapAndCopyPresModel(f);
}
tab.MultipleFieldsModel.prototype = {
    
    get_instanceType: function tab_MultipleFieldsModel$get_instanceType() {
        return 'multiple';
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FlipboardNavigatorModel

tab.FlipboardNavigatorModel = function tab_FlipboardNavigatorModel(parent) {
    tab.FlipboardNavigatorModel.initializeBase(this, [ parent, new tab.PresModelPathItem('flipboardNav') ]);
}
tab.FlipboardNavigatorModel.prototype = {
    
    add_newFlipboardNav: function tab_FlipboardNavigatorModel$add_newFlipboardNav(value) {
        this.__newFlipboardNav$1 = ss.Delegate.combine(this.__newFlipboardNav$1, value);
    },
    remove_newFlipboardNav: function tab_FlipboardNavigatorModel$remove_newFlipboardNav(value) {
        this.__newFlipboardNav$1 = ss.Delegate.remove(this.__newFlipboardNav$1, value);
    },
    
    __newFlipboardNav$1: null,
    
    get_flipboardNavPresModel: function tab_FlipboardNavigatorModel$get_flipboardNavPresModel() {
        return this.presModel;
    },
    
    get_currentPointIndex: function tab_FlipboardNavigatorModel$get_currentPointIndex() {
        return this.get_flipboardNavPresModel().currentStorypointIndex;
    },
    
    get_storyPoints: function tab_FlipboardNavigatorModel$get_storyPoints() {
        return this.get_flipboardNavPresModel().storypointNavItems;
    },
    
    get_zone: function tab_FlipboardNavigatorModel$get_zone() {
        return (this.get_parent()).get_zone();
    },
    
    update: function tab_FlipboardNavigatorModel$update(flipboardNavPresModel) {
        this.simpleSwapToUpdate(flipboardNavPresModel, this.__newFlipboardNav$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ImageZoneModel

tab.ImageZoneModel = function tab_ImageZoneModel(parent) {
    tab.ImageZoneModel.initializeBase(this, [ parent, new tab.PresModelPathItem('imagezone') ]);
    this._zoneModel$1 = parent.get_zone();
}
tab.ImageZoneModel.prototype = {
    _zoneModel$1: null,
    
    add_newImageZone: function tab_ImageZoneModel$add_newImageZone(value) {
        this.__newImageZone$1 = ss.Delegate.combine(this.__newImageZone$1, value);
    },
    remove_newImageZone: function tab_ImageZoneModel$remove_newImageZone(value) {
        this.__newImageZone$1 = ss.Delegate.remove(this.__newImageZone$1, value);
    },
    
    __newImageZone$1: null,
    
    get_zone: function tab_ImageZoneModel$get_zone() {
        return this._zoneModel$1.get_presModel();
    },
    
    update: function tab_ImageZoneModel$update(imageZonePresModel) {
        this.simpleSwapToUpdate(imageZonePresModel, this.__newImageZone$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ToolbarModel

tab.ToolbarModel = function tab_ToolbarModel(parent) {
    tab.ToolbarModel.initializeBase(this, [ parent, new tab.PresModelPathItem('toolbarPresModel') ]);
}
tab.ToolbarModel.prototype = {
    
    add_newToolbar: function tab_ToolbarModel$add_newToolbar(value) {
        this.__newToolbar$1 = ss.Delegate.combine(this.__newToolbar$1, value);
    },
    remove_newToolbar: function tab_ToolbarModel$remove_newToolbar(value) {
        this.__newToolbar$1 = ss.Delegate.remove(this.__newToolbar$1, value);
    },
    
    __newToolbar$1: null,
    
    get_toolbarPresModel: function tab_ToolbarModel$get_toolbarPresModel() {
        return this.presModel;
    },
    
    get_vizCommandItems: function tab_ToolbarModel$get_vizCommandItems() {
        var commands = null;
        if (ss.isValue(this.get_toolbarPresModel())) {
            var commandsWrapper = tab.CommandsPresModelWrapper.create(this.get_toolbarPresModel().vizCommands);
            commands = commandsWrapper.get_commandItems();
        }
        return commands;
    },
    
    get_nonVizCommandItems: function tab_ToolbarModel$get_nonVizCommandItems() {
        var commands = null;
        if (ss.isValue(this.get_toolbarPresModel())) {
            var commandsWrapper = tab.CommandsPresModelWrapper.create(this.get_toolbarPresModel().nonVizCommands);
            commands = commandsWrapper.get_commandItems();
        }
        return commands;
    },
    
    get_downloadableItems: function tab_ToolbarModel$get_downloadableItems() {
        return this.get_toolbarPresModel().legacyMenus;
    },
    
    update: function tab_ToolbarModel$update(toolbarPresModel) {
        if (ss.isValue(toolbarPresModel)) {
            this.simpleSwapToUpdate(toolbarPresModel, this.__newToolbar$1);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.WebZoneModel

tab.WebZoneModel = function tab_WebZoneModel(parent) {
    tab.WebZoneModel.initializeBase(this, [ parent, new tab.PresModelPathItem('webzone') ]);
    this._zoneModel$1 = parent.get_zone();
}
tab.WebZoneModel.prototype = {
    _zoneModel$1: null,
    
    add_newWebZone: function tab_WebZoneModel$add_newWebZone(value) {
        this.__newWebZone$1 = ss.Delegate.combine(this.__newWebZone$1, value);
    },
    remove_newWebZone: function tab_WebZoneModel$remove_newWebZone(value) {
        this.__newWebZone$1 = ss.Delegate.remove(this.__newWebZone$1, value);
    },
    
    __newWebZone$1: null,
    
    get_zone: function tab_WebZoneModel$get_zone() {
        return this._zoneModel$1.get_presModel();
    },
    
    update: function tab_WebZoneModel$update(webZonePresModel) {
        this.simpleSwapToUpdate(webZonePresModel, this.__newWebZone$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyLegendModel

tab.LegacyLegendModel = function tab_LegacyLegendModel(parent) {
    tab.LegacyLegendModel.initializeBase(this, [ parent, new tab.PresModelPathItem('serverRenderedLegend') ]);
}
tab.LegacyLegendModel.prototype = {
    
    add_newLegacyLegend: function tab_LegacyLegendModel$add_newLegacyLegend(value) {
        this.__newLegacyLegend$1 = ss.Delegate.combine(this.__newLegacyLegend$1, value);
    },
    remove_newLegacyLegend: function tab_LegacyLegendModel$remove_newLegacyLegend(value) {
        this.__newLegacyLegend$1 = ss.Delegate.remove(this.__newLegacyLegend$1, value);
    },
    
    __newLegacyLegend$1: null,
    
    update: function tab_LegacyLegendModel$update(newPresModel) {
        this.simpleSwapToUpdate(newPresModel, this.__newLegacyLegend$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CustomizedView

tab.CustomizedView = function tab_CustomizedView() {
}
tab.CustomizedView.prototype = {
    id: null,
    name: null,
    urlId: null,
    startViewId: null,
    isPublic: false,
    owner: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParameterCtrlModel

tab.ParameterCtrlModel = function tab_ParameterCtrlModel(parent) {
    tab.ParameterCtrlModel.initializeBase(this, [ parent, new tab.PresModelPathItem('parameterCtrl') ]);
}
tab.ParameterCtrlModel.prototype = {
    _frame$1: null,
    
    add_newParameterCtrl: function tab_ParameterCtrlModel$add_newParameterCtrl(value) {
        this.__newParameterCtrl$1 = ss.Delegate.combine(this.__newParameterCtrl$1, value);
    },
    remove_newParameterCtrl: function tab_ParameterCtrlModel$remove_newParameterCtrl(value) {
        this.__newParameterCtrl$1 = ss.Delegate.remove(this.__newParameterCtrl$1, value);
    },
    
    __newParameterCtrl$1: null,
    
    get_title: function tab_ParameterCtrlModel$get_title() {
        return tableau.format.stripFormattedText((this.get_parameterCtrlPresModel().legacyPresModel).title);
    },
    
    get_parameterCtrlPresModel: function tab_ParameterCtrlModel$get_parameterCtrlPresModel() {
        return this.presModel;
    },
    
    get_parameterCtrlJsonPresModel: function tab_ParameterCtrlModel$get_parameterCtrlJsonPresModel() {
        return this.get_parameterCtrlPresModel().legacyPresModel;
    },
    
    get_zone: function tab_ParameterCtrlModel$get_zone() {
        return this.get_zoneModel().get_presModel();
    },
    
    get_frame: function tab_ParameterCtrlModel$get_frame() {
        return this._frame$1;
    },
    
    get_zoneModel: function tab_ParameterCtrlModel$get_zoneModel() {
        return (this.get_parent()).get_zone();
    },
    
    update: function tab_ParameterCtrlModel$update(newPresModel, newFrame) {
        this._frame$1 = newFrame;
        this.simpleSwapToUpdate(newPresModel, this.__newParameterCtrl$1, newPresModel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PageModel

tab.PageModel = function tab_PageModel(parent) {
    tab.PageModel.initializeBase(this, [ parent, new tab.PresModelPathItem('page') ]);
    this._zoneModel$1 = parent.get_zone();
}
tab.PageModel.prototype = {
    _zoneModel$1: null,
    _frame$1: null,
    
    add_newPage: function tab_PageModel$add_newPage(value) {
        this.__newPage$1 = ss.Delegate.combine(this.__newPage$1, value);
    },
    remove_newPage: function tab_PageModel$remove_newPage(value) {
        this.__newPage$1 = ss.Delegate.remove(this.__newPage$1, value);
    },
    
    __newPage$1: null,
    
    get_title: function tab_PageModel$get_title() {
        return tableau.format.stripFormattedText(this.get_pagePresModel().title);
    },
    
    get_pagePresModel: function tab_PageModel$get_pagePresModel() {
        return this.presModel;
    },
    
    get_zone: function tab_PageModel$get_zone() {
        return this._zoneModel$1.get_presModel();
    },
    
    get_frame: function tab_PageModel$get_frame() {
        return this._frame$1;
    },
    
    get_zoneModel: function tab_PageModel$get_zoneModel() {
        return this._zoneModel$1;
    },
    
    update: function tab_PageModel$update(pagePresModel, newFrame) {
        this._frame$1 = newFrame;
        this.simpleSwapToUpdate(pagePresModel, this.__newPage$1, pagePresModel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ViewGeometryModel

tab.ViewGeometryModel = function tab_ViewGeometryModel(parent) {
    tab.ViewGeometryModel.initializeBase(this, [ parent, new tab.PresModelPathItem('geometry') ]);
}
tab.ViewGeometryModel.prototype = {
    
    add_newViewGeometry: function tab_ViewGeometryModel$add_newViewGeometry(value) {
        this.__newViewGeometry$1 = ss.Delegate.combine(this.__newViewGeometry$1, value);
    },
    remove_newViewGeometry: function tab_ViewGeometryModel$remove_newViewGeometry(value) {
        this.__newViewGeometry$1 = ss.Delegate.remove(this.__newViewGeometry$1, value);
    },
    
    __newViewGeometry$1: null,
    
    update: function tab_ViewGeometryModel$update(newPresModel) {
        if (!this.isNewPresModelSameAsOld(newPresModel)) {
            this.presModel = newPresModel;
            this.raiseEvent(this.__newViewGeometry$1);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FilterModel

tab.FilterModel = function tab_FilterModel(parent, presModel) {
    tab.FilterModel.initializeBase(this, [ parent, new tab.PresModelPathItem('filter[' + presModel.name.join('_') + ']') ]);
    this.presModel = presModel;
}
tab.FilterModel._isNonMidnightTimestampValue$1 = function tab_FilterModel$_isNonMidnightTimestampValue$1(val) {
    return ss.isValue(val) && tableau.format.isDateTimeWithNonMidnightTime(val);
}
tab.FilterModel.isQuantitativeTimestampFilter = function tab_FilterModel$isQuantitativeTimestampFilter(filterState, min, max) {
    var ret = tab.FilterModel._isNonMidnightTimestampValue$1(min) || tab.FilterModel._isNonMidnightTimestampValue$1(max);
    if (!ret && ss.isValue(filterState)) {
        if (ss.isValue(filterState.data)) {
            ret = ret || tab.FilterModel._isNonMidnightTimestampValue$1(filterState.data.min) || tab.FilterModel._isNonMidnightTimestampValue$1(filterState.data.max);
        }
        if (!ret && ss.isValue(filterState.range)) {
            ret = ret || tab.FilterModel._isNonMidnightTimestampValue$1(filterState.range.min) || tab.FilterModel._isNonMidnightTimestampValue$1(filterState.range.max);
        }
    }
    return ret;
}
tab.FilterModel._isDateOrTimestamp$1 = function tab_FilterModel$_isDateOrTimestamp$1(val) {
    return (val.t === tableau.types.DataType.DT_TIMESTAMP || val.t === tableau.types.DataType.DT_DATE);
}
tab.FilterModel.isQuantitativeDateFilter = function tab_FilterModel$isQuantitativeDateFilter(filterState, min, max) {
    if (ss.isValue(min)) {
        return tab.FilterModel._isDateOrTimestamp$1(min);
    }
    else if (ss.isValue(max)) {
        return tab.FilterModel._isDateOrTimestamp$1(max);
    }
    else if (ss.isValue(filterState)) {
        if (ss.isValue(filterState.data)) {
            if (ss.isValue(filterState.data.min)) {
                return tab.FilterModel._isDateOrTimestamp$1(filterState.data.min);
            }
            else if (ss.isValue(filterState.data.max)) {
                return tab.FilterModel._isDateOrTimestamp$1(filterState.data.max);
            }
        }
        if (ss.isValue(filterState.range)) {
            if (ss.isValue(filterState.range.min)) {
                return tab.FilterModel._isDateOrTimestamp$1(filterState.range.min);
            }
            else if (ss.isValue(filterState.range.max)) {
                return tab.FilterModel._isDateOrTimestamp$1(filterState.range.max);
            }
        }
    }
    return false;
}
tab.FilterModel.isNormalValue = function tab_FilterModel$isNormalValue(f) {
    return ss.isValue(f) && (ss.isNullOrUndefined(f.s) || f.s === tableau.types.DataSpecial.DS_NORMAL) && ss.isValue(f.v);
}
tab.FilterModel.timestampsWithSameDateOrNull = function tab_FilterModel$timestampsWithSameDateOrNull(values) {
    var baseDate = null;
    var $enum1 = ss.IEnumerator.getEnumerator(values);
    while ($enum1.moveNext()) {
        var value = $enum1.current;
        if (ss.isNullOrUndefined(value) || value.s === tableau.types.DataSpecial.DS_NULL || (ss.isNullOrUndefined(value.v) && value.t === tableau.types.DataType.DT_TIMESTAMP)) {
            continue;
        }
        if (!tab.FilterModel.isNormalValue(value) || value.t !== tableau.types.DataType.DT_TIMESTAMP) {
            return false;
        }
        var valueDatePart = (value.v >= 0) ? Math.floor(value.v) : Math.ceil(value.v);
        if (ss.isValue(baseDate) && valueDatePart !== baseDate) {
            return false;
        }
        baseDate = valueDatePart;
    }
    return ss.isValue(baseDate);
}
tab.FilterModel.prototype = {
    
    add_filterUpdated: function tab_FilterModel$add_filterUpdated(value) {
        this.__filterUpdated$1 = ss.Delegate.combine(this.__filterUpdated$1, value);
    },
    remove_filterUpdated: function tab_FilterModel$remove_filterUpdated(value) {
        this.__filterUpdated$1 = ss.Delegate.remove(this.__filterUpdated$1, value);
    },
    
    __filterUpdated$1: null,
    
    get_filterPresModel: function tab_FilterModel$get_filterPresModel() {
        return this.get_presModel();
    },
    
    get_filterType: function tab_FilterModel$get_filterType() {
        switch (this.get_filterPresModel().type) {
            case 'Q':
                return 'Quantitative';
            case 'H':
                return 'Hierarchical';
            case 'C':
                return 'Categorical';
            case 'RD':
                if (this.get_filterPresModel().showRelDatePick) {
                    return 'RelativeDatePick';
                }
                else {
                    return 'RelativeDate';
                }
            default:
                return 'FilterDefault';
        }
    },
    
    get_caption: function tab_FilterModel$get_caption() {
        return this.get_filterPresModel().caption;
    },
    
    get_fieldCaption: function tab_FilterModel$get_fieldCaption() {
        return this.get_filterPresModel().fieldCaption;
    },
    
    get_fieldName: function tab_FilterModel$get_fieldName() {
        return this.get_filterPresModel().fieldName;
    },
    
    get_datasourceName: function tab_FilterModel$get_datasourceName() {
        return this.get_filterPresModel().fieldDatasource;
    },
    
    get_domains: function tab_FilterModel$get_domains() {
        return this.get_filterPresModel().domains;
    },
    
    get_name: function tab_FilterModel$get_name() {
        return this.get_filterPresModel().name;
    },
    
    get_role: function tab_FilterModel$get_role() {
        return this.get_filterPresModel().role;
    },
    
    get_targetSheets: function tab_FilterModel$get_targetSheets() {
        return this.get_filterPresModel().targetSheets;
    },
    
    get_globalFieldName: function tab_FilterModel$get_globalFieldName() {
        var pm = this.get_presModel();
        var name = new String();
        name = '[';
        for (var ii = 0; ii < pm.name.length; ++ii) {
            if (name.endsWith(']')) {
                name += '.';
                name += '[';
            }
            name += pm.name[ii];
            name += ']';
        }
        return name;
    },
    
    update: function tab_FilterModel$update(newFilterPresModel) {
        if (!this.isNewPresModelSameAsOld(newFilterPresModel)) {
            this.presModel = newFilterPresModel;
            this.raiseEvent(this.__filterUpdated$1);
        }
        else if (ss.isValue(newFilterPresModel) && (newFilterPresModel).isTiled) {
            this.raiseEvent(this.__filterUpdated$1);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SceneModel

tab.SceneModel = function tab_SceneModel(parent) {
    this._visualListModels$1 = {};
    this._drawFirstParts$1 = [];
    this._drawLastParts$1 = [];
    tab.SceneModel.initializeBase(this, [ parent, new tab.PresModelPathItem('scene') ]);
    this._refLineVisualLists$1 = [];
    this._trendLineVisualLists$1 = [];
}
tab.SceneModel._getBackgroundColor$1 = function tab_SceneModel$_getBackgroundColor$1(vizRegionModels, scenePresModel) {
    if (Object.keyExists(vizRegionModels, 'background')) {
        var drawItems = vizRegionModels['background'].get_visualListPresModel().drawItems;
        var $enum1 = ss.IEnumerator.getEnumerator(drawItems);
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            if (item.type === 'draw-solid-brush') {
                var drawSolidBrush = item;
                return tab.ColorModel.fromColorCode(drawSolidBrush.color);
            }
        }
    }
    return (ss.isValue(scenePresModel.bgColor)) ? tab.ColorModel.fromColorCode(scenePresModel.bgColor) : tab.SceneModel._defaultBackgroundFillColor$1;
}
tab.SceneModel.prototype = {
    _refLineVisualLists$1: null,
    _trendLineVisualLists$1: null,
    _backgroundColor$1: null,
    
    add_newSceneModel: function tab_SceneModel$add_newSceneModel(value) {
        this.__newSceneModel$1 = ss.Delegate.combine(this.__newSceneModel$1, value);
    },
    remove_newSceneModel: function tab_SceneModel$remove_newSceneModel(value) {
        this.__newSceneModel$1 = ss.Delegate.remove(this.__newSceneModel$1, value);
    },
    
    __newSceneModel$1: null,
    
    get_scenePresModel: function tab_SceneModel$get_scenePresModel() {
        return this.presModel;
    },
    
    get_visualListModels: function tab_SceneModel$get_visualListModels() {
        return this._visualListModels$1;
    },
    
    get_refLineVisualLists: function tab_SceneModel$get_refLineVisualLists() {
        return this._refLineVisualLists$1;
    },
    
    get_trendLineVisualLists: function tab_SceneModel$get_trendLineVisualLists() {
        return this._trendLineVisualLists$1;
    },
    
    get_drawFirstParts: function tab_SceneModel$get_drawFirstParts() {
        return this._drawFirstParts$1;
    },
    
    get_drawLastParts: function tab_SceneModel$get_drawLastParts() {
        return this._drawLastParts$1;
    },
    
    get_backgroundColor: function tab_SceneModel$get_backgroundColor() {
        return this._backgroundColor$1;
    },
    
    get_paneDescriptorCount: function tab_SceneModel$get_paneDescriptorCount() {
        return Object.getKeyCount(this.get_scenePresModel().pdMarksMap);
    },
    
    update: function tab_SceneModel$update(scenePresModel) {
        if (this.isNewPresModelSameAsOld(scenePresModel)) {
            return;
        }
        this._killInvalidVisualParts$1(scenePresModel);
        if (ss.isValue(scenePresModel.drawFirst)) {
            this._drawFirstParts$1.clear();
            var $enum1 = ss.IEnumerator.getEnumerator(scenePresModel.drawFirst);
            while ($enum1.moveNext()) {
                var vlistPM = $enum1.current;
                var part = vlistPM.visualPart;
                if (!Object.keyExists(this._visualListModels$1, part)) {
                    this._visualListModels$1[part] = new tab.VisualListModel(this);
                }
                if (this._drawFirstParts$1.contains(part)) {
                    continue;
                }
                this._drawFirstParts$1.add(part);
                this._visualListModels$1[part].update(vlistPM);
            }
        }
        if (ss.isValue(scenePresModel.drawLast)) {
            this._drawLastParts$1.clear();
            var $enum2 = ss.IEnumerator.getEnumerator(scenePresModel.drawLast);
            while ($enum2.moveNext()) {
                var vlistPM = $enum2.current;
                var part = vlistPM.visualPart;
                if (!Object.keyExists(this._visualListModels$1, part)) {
                    this._visualListModels$1[part] = new tab.VisualListModel(this);
                }
                this._drawLastParts$1.add(part);
                this._visualListModels$1[part].update(vlistPM);
            }
        }
        this.swapAndCopyPresModel(scenePresModel);
        this._backgroundColor$1 = tab.SceneModel._getBackgroundColor$1(this._visualListModels$1, scenePresModel);
        this._cacheNewRefAndTrendLines$1();
        this.raiseEvent(this.__newSceneModel$1);
    },
    
    _cacheNewRefAndTrendLines$1: function tab_SceneModel$_cacheNewRefAndTrendLines$1() {
        this._refLineVisualLists$1.clear();
        this._trendLineVisualLists$1.clear();
        if (ss.isValue(this.get_scenePresModel().panes)) {
            var $enum1 = ss.IEnumerator.getEnumerator(this.get_scenePresModel().panes);
            while ($enum1.moveNext()) {
                var ppm = $enum1.current;
                if (ss.isValue(ppm.drawPane)) {
                    var $enum2 = ss.IEnumerator.getEnumerator(ppm.drawPane);
                    while ($enum2.moveNext()) {
                        var vlpm = $enum2.current;
                        if (ss.isValue(vlpm)) {
                            if (vlpm.visualPart === 'ref-lines') {
                                this._refLineVisualLists$1.add(vlpm);
                            }
                            else if (vlpm.visualPart === 'trend-lines') {
                                this._trendLineVisualLists$1.add(vlpm);
                            }
                        }
                    }
                }
            }
        }
    },
    
    _killInvalidVisualParts$1: function tab_SceneModel$_killInvalidVisualParts$1(newScenePresModel) {
        var $dict1 = this.get_visualListModels();
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            var currentPart = pair.key;
            var visualPartExist = _.find(newScenePresModel.drawFirst, function(vlpm) {
                return currentPart === vlpm.visualPart;
            });
            if (ss.isNullOrUndefined(visualPartExist)) {
                visualPartExist = _.find(newScenePresModel.drawLast, function(vlpm) {
                    return currentPart === vlpm.visualPart;
                });
            }
            if (ss.isNullOrUndefined(visualPartExist)) {
                delete this.get_visualListModels()[currentPart];
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ProjectModel

tab.ProjectModel = function tab_ProjectModel() {
}
tab.ProjectModel.prototype = {
    _name: null,
    _id: null,
    
    get_name: function tab_ProjectModel$get_name() {
        return this._name;
    },
    set_name: function tab_ProjectModel$set_name(value) {
        this._name = value;
        return value;
    },
    
    get_id: function tab_ProjectModel$get_id() {
        return this._id;
    },
    set_id: function tab_ProjectModel$set_id(value) {
        this._id = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.Schedule

tab.Schedule = function tab_Schedule() {
}
tab.Schedule.prototype = {
    _name: null,
    _id: null,
    _action: 0,
    
    get_name: function tab_Schedule$get_name() {
        return this._name;
    },
    set_name: function tab_Schedule$set_name(value) {
        this._name = value;
        return value;
    },
    
    get_id: function tab_Schedule$get_id() {
        return this._id;
    },
    set_id: function tab_Schedule$set_id(value) {
        this._id = value;
        return value;
    },
    
    get_action: function tab_Schedule$get_action() {
        return this._action;
    },
    set_action: function tab_Schedule$set_action(value) {
        this._action = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SelectionsModel

tab.SelectionsModel = function tab_SelectionsModel(parent, pathName) {
    this._selectionModels$1 = [];
    tab.SelectionsModel.initializeBase(this, [ parent, new tab.PresModelPathItem(pathName, 1) ]);
    this._addSelectionModel$1('tuples');
    this._addSelectionModel$1('nodes');
    this._addSelectionModel$1('trend-lines');
    this._addSelectionModel$1('ref-lines');
}
tab.SelectionsModel._createEmptySelectionPm = function tab_SelectionsModel$_createEmptySelectionPm(type) {
    var pm = {};
    pm.selectionType = type;
    switch (type) {
        case 'ref-lines':
        case 'trend-lines':
        case 'annotations':
        case 'tuples':
            pm.objectIds = new Array(0);
            break;
        case 'legend-items':
            pm.legendSelectionInfo = {};
            pm.objectIds = new Array(0);
            break;
        case 'nodes':
            pm.selectedNodes = new Array(0);
            break;
        default:
            ss.Debug.fail('Unknown selection type: ' + type);
            break;
    }
    return pm;
}
tab.SelectionsModel._updatePresModel$1 = function tab_SelectionsModel$_updatePresModel$1(newPresModel, resultingSelections) {
    var newType = newPresModel.selectionType;
    for (var ii = 0; ii < resultingSelections.length; ++ii) {
        var current = resultingSelections[ii];
        if (current.selectionType === newType) {
            if (newType === 'legend-items' && !_.isEqual(newPresModel.legendSelectionInfo, current.legendSelectionInfo)) {
                continue;
            }
            resultingSelections[ii] = newPresModel;
            return;
        }
    }
    resultingSelections.add(newPresModel);
}
tab.SelectionsModel._computeTupleArrayDifference$1 = function tab_SelectionsModel$_computeTupleArrayDifference$1(arr1, arr2) {
    var set1 = {};
    var $enum1 = ss.IEnumerator.getEnumerator(arr1);
    while ($enum1.moveNext()) {
        var tuple = $enum1.current;
        set1[tuple.toString()] = tuple;
    }
    var set2 = {};
    var $enum2 = ss.IEnumerator.getEnumerator(arr2);
    while ($enum2.moveNext()) {
        var tuple = $enum2.current;
        set2[tuple.toString()] = tuple;
    }
    return tab.SelectionsModel.computeTupleDictionaryDifference(set1, set2);
}
tab.SelectionsModel.computeTupleDictionaryDifference = function tab_SelectionsModel$computeTupleDictionaryDifference(set1, set2) {
    var localSet1 = $.extend(true, {}, set1);
    var localSet2 = $.extend(true, {}, set2);
    var diffTuples = [];
    var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(localSet1));
    while ($enum1.moveNext()) {
        var key = $enum1.current;
        if (!Object.keyExists(localSet2, key)) {
            diffTuples.add(localSet1[key]);
        }
        else {
            delete localSet2[key];
        }
    }
    var $enum2 = ss.IEnumerator.getEnumerator(Object.keys(localSet2));
    while ($enum2.moveNext()) {
        var key = $enum2.current;
        diffTuples.add(localSet2[key]);
    }
    return diffTuples;
}
tab.SelectionsModel.prototype = {
    isOnlyQuantitativeNodeSelected: false,
    
    add_newSelections: function tab_SelectionsModel$add_newSelections(value) {
        this.__newSelections$1 = ss.Delegate.combine(this.__newSelections$1, value);
    },
    remove_newSelections: function tab_SelectionsModel$remove_newSelections(value) {
        this.__newSelections$1 = ss.Delegate.remove(this.__newSelections$1, value);
    },
    
    __newSelections$1: null,
    
    get_selectionModels: function tab_SelectionsModel$get_selectionModels() {
        return this._selectionModels$1;
    },
    
    get_isEmpty: function tab_SelectionsModel$get_isEmpty() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._selectionModels$1);
        while ($enum1.moveNext()) {
            var selectionModel = $enum1.current;
            if (!selectionModel.get_isEmpty()) {
                return false;
            }
        }
        return true;
    },
    
    get_hasPaneTableObjectSelection: function tab_SelectionsModel$get_hasPaneTableObjectSelection() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._selectionModels$1);
        while ($enum1.moveNext()) {
            var selectionModel = $enum1.current;
            if (!selectionModel.get_isEmpty() && selectionModel.get_selectionType() !== 'legend-items' && selectionModel.get_selectionType() !== 'nodes') {
                return true;
            }
        }
        return false;
    },
    
    get_tupleSelection: function tab_SelectionsModel$get_tupleSelection() {
        return this._getSelection$1('tuples');
    },
    
    get_nodeSelection: function tab_SelectionsModel$get_nodeSelection() {
        return this._getSelection$1('nodes');
    },
    
    get_refLineSelection: function tab_SelectionsModel$get_refLineSelection() {
        return this._getSelection$1('ref-lines');
    },
    
    get_trendLineSelection: function tab_SelectionsModel$get_trendLineSelection() {
        return this._getSelection$1('trend-lines');
    },
    
    get_allLegendSelections: function tab_SelectionsModel$get_allLegendSelections() {
        return _.filter(this._selectionModels$1, function(model) {
            return model.get_selectionType() === 'legend-items';
        });
    },
    
    getLegendSelection: function tab_SelectionsModel$getLegendSelection(key, legendColumns) {
        var found = _.find(this._selectionModels$1, function(model) {
            return model.get_selectionType() === 'legend-items' && ss.isValue(model.get_selectionPresModel()) && model.get_selectionPresModel().legendSelectionInfo.legendType === key && _.isEqual(model.get_selectionPresModel().legendSelectionInfo.legendColumns, legendColumns);
        });
        if (ss.isNullOrUndefined(found)) {
            tab.Log.get(this).debug('Adding a new legend selection: %s', key);
            found = this._addSelectionModel$1('legend-items');
            found.get_selectionPresModel().legendSelectionInfo.legendType = key;
            found.get_selectionPresModel().legendSelectionInfo.legendColumns = legendColumns;
        }
        return found;
    },
    
    update: function tab_SelectionsModel$update(presModels) {
        var compactPresModels = _.compact(presModels);
        var resultingSelections = [];
        resultingSelections.addRange(compactPresModels);
        var localUpdateHack = false;
        var updated = [];
        var $enum1 = ss.IEnumerator.getEnumerator(compactPresModels);
        while ($enum1.moveNext()) {
            var selectionPresModel = $enum1.current;
            var model;
            if (selectionPresModel.selectionType === 'legend-items') {
                if (ss.isNullOrUndefined(selectionPresModel.legendSelectionInfo)) {
                    localUpdateHack = true;
                    continue;
                }
                model = this.getLegendSelection(selectionPresModel.legendSelectionInfo.legendType, selectionPresModel.legendSelectionInfo.legendColumns);
            }
            else {
                model = this._getSelection$1(selectionPresModel.selectionType);
            }
            if (ss.isNullOrUndefined(model)) {
                model = new tab.SelectionModel(this, this._selectionModels$1.length);
                this._selectionModels$1.add(model);
            }
            model.update(selectionPresModel);
            updated.add(model.get_hashKey());
            tab.SelectionsModel._updatePresModel$1(selectionPresModel, resultingSelections);
        }
        if (localUpdateHack) {
            var $enum2 = ss.IEnumerator.getEnumerator(this._selectionModels$1);
            while ($enum2.moveNext()) {
                var selectionModel = $enum2.current;
                tab.SelectionsModel._updatePresModel$1(selectionModel.get_selectionPresModel(), resultingSelections);
            }
        }
        else {
            var $enum3 = ss.IEnumerator.getEnumerator(this._selectionModels$1);
            while ($enum3.moveNext()) {
                var selectionModel = $enum3.current;
                if (updated.contains(selectionModel.get_hashKey())) {
                    continue;
                }
                var pm = tab.SelectionsModel._createEmptySelectionPm(selectionModel.get_selectionType());
                if (pm.selectionType === 'legend-items') {
                    pm.legendSelectionInfo = selectionModel.get_selectionPresModel().legendSelectionInfo;
                }
                selectionModel.update(pm);
                tab.SelectionsModel._updatePresModel$1(pm, resultingSelections);
            }
        }
        ss.Debug.assert(resultingSelections.length >= presModels.length, 'the pres model array we create should never be shorter than the pres model array passed in');
        for (var ii = 0; ii < resultingSelections.length; ++ii) {
            presModels[ii] = resultingSelections[ii];
        }
        var selPresModel = {};
        selPresModel.selections = presModels;
        if (this.isNewPresModelSameAsOld(selPresModel)) {
            return;
        }
        this.swapAndCopyPresModel(selPresModel);
        this.raiseEvent(this.__newSelections$1);
    },
    
    _getSelection$1: function tab_SelectionsModel$_getSelection$1(type) {
        return _.find(this._selectionModels$1, function(model) {
            return model.get_selectionType() === type;
        });
    },
    
    _addSelectionModel$1: function tab_SelectionsModel$_addSelectionModel$1(type) {
        tab.Log.get(this).debug('Creating a new selection model: %s', type);
        var model = new tab.SelectionModel(this, this._selectionModels$1.length);
        this._selectionModels$1.add(model);
        var pm = tab.SelectionsModel._createEmptySelectionPm(type);
        model.update(pm);
        return model;
    },
    
    createSelectionsToken: function tab_SelectionsModel$createSelectionsToken() {
        return this.get_presModel();
    },
    
    computeSelectionsDiff: function tab_SelectionsModel$computeSelectionsDiff(selectionsToken, impliedSelectionToken, currentImpliedSelectionModel) {
        if (ss.isNullOrUndefined(selectionsToken)) {
            return new ss.Tuple(true, new Array(0));
        }
        var toRet = new ss.Tuple(false, new Array(0));
        var $enum1 = ss.IEnumerator.getEnumerator((selectionsToken).selections);
        while ($enum1.moveNext()) {
            var oldSelectionPresModel = $enum1.current;
            switch (oldSelectionPresModel.selectionType) {
                case 'ref-lines':
                case 'trend-lines':
                    var oldIds = (oldSelectionPresModel.objectIds || new Array(0));
                    var delta = tab.SelectionsModel._computeTupleArrayDifference$1(oldIds, this._getSelection$1(oldSelectionPresModel.selectionType).get_ids());
                    if (delta.length > 0) {
                        return new ss.Tuple(true, new Array(0));
                    }
                    break;
                case 'tuples':
                    var oldSelTuples = oldSelectionPresModel.objectIds;
                    var newSelTuples = this.get_tupleSelection().get_ids();
                    var oldImpliedTuples = (ss.isValue(impliedSelectionToken)) ? (impliedSelectionToken).objectIds : new Array(0);
                    var newImpliedTuples = (ss.isValue(currentImpliedSelectionModel)) ? currentImpliedSelectionModel.get_ids() : new Array(0);
                    var invalAll = (!!(oldSelTuples.length + oldImpliedTuples.length)) !== (!!(newSelTuples.length + newImpliedTuples.length));
                    if (invalAll) {
                        return new ss.Tuple(true, new Array(0));
                    }
                    var selDelta = tab.SelectionsModel._computeTupleArrayDifference$1(oldSelTuples, newSelTuples);
                    var impliedDelta = tab.SelectionsModel._computeTupleArrayDifference$1(oldImpliedTuples, newImpliedTuples);
                    var combindDelta = [];
                    combindDelta.addRange(selDelta);
                    combindDelta.addRange(impliedDelta);
                    toRet.second = combindDelta;
                    break;
                default:
                    break;
            }
        }
        return toRet;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SelectionsPresModel

tab.SelectionsPresModel = function tab_SelectionsPresModel() {
}
tab.SelectionsPresModel.prototype = {
    selections: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.User

tab.User = function tab_User() {
}
tab.User.prototype = {
    id: 0,
    friendlyName: null,
    username: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.SortIndicatorsModel

tab.SortIndicatorsModel = function tab_SortIndicatorsModel(parent) {
    tab.SortIndicatorsModel.initializeBase(this, [ parent, new tab.PresModelPathItem('sortIndicators') ]);
}
tab.SortIndicatorsModel.prototype = {
    
    add_newSortIndicators: function tab_SortIndicatorsModel$add_newSortIndicators(value) {
        this.__newSortIndicators$1 = ss.Delegate.combine(this.__newSortIndicators$1, value);
    },
    remove_newSortIndicators: function tab_SortIndicatorsModel$remove_newSortIndicators(value) {
        this.__newSortIndicators$1 = ss.Delegate.remove(this.__newSortIndicators$1, value);
    },
    
    __newSortIndicators$1: null,
    
    get_sortIndicatorsPresModel: function tab_SortIndicatorsModel$get_sortIndicatorsPresModel() {
        return this.get_presModel();
    },
    
    update: function tab_SortIndicatorsModel$update(sortIndicatorsPresModel) {
        this.simpleSwapToUpdate(sortIndicatorsPresModel, this.__newSortIndicators$1, sortIndicatorsPresModel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VisualListModel

tab.VisualListModel = function tab_VisualListModel(parent) {
    tab.VisualListModel.initializeBase(this, [ parent, new tab.PresModelPathItem('visuallist') ]);
}
tab.VisualListModel.prototype = {
    _drawGroups$1: null,
    
    add_newVisualList: function tab_VisualListModel$add_newVisualList(value) {
        this.__newVisualList$1 = ss.Delegate.combine(this.__newVisualList$1, value);
    },
    remove_newVisualList: function tab_VisualListModel$remove_newVisualList(value) {
        this.__newVisualList$1 = ss.Delegate.remove(this.__newVisualList$1, value);
    },
    
    __newVisualList$1: null,
    
    get_visualListPresModel: function tab_VisualListModel$get_visualListPresModel() {
        return this.presModel;
    },
    
    get_groupItemNodes: function tab_VisualListModel$get_groupItemNodes() {
        if (ss.isNullOrUndefined(this._drawGroups$1)) {
            this._drawGroups$1 = [];
            var $enum1 = ss.IEnumerator.getEnumerator(this.get_visualListPresModel().drawItems);
            while ($enum1.moveNext()) {
                var drawItem = $enum1.current;
                if (drawItem.type === 'draw-group') {
                    this._drawGroups$1.add(drawItem);
                }
            }
        }
        return this._drawGroups$1;
    },
    
    update: function tab_VisualListModel$update(visualListPresModel) {
        if (this.isNewPresModelSameAsOld(visualListPresModel)) {
            return;
        }
        this._drawGroups$1 = null;
        this.swapAndCopyPresModel(visualListPresModel);
        this.raiseEvent(this.__newVisualList$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizDataModel

tab.VizDataModel = function tab_VizDataModel(parent) {
    tab.VizDataModel.initializeBase(this, [ parent, new tab.PresModelPathItem('vizData') ]);
    this._columns$1 = [];
}
tab.VizDataModel.get__log$1 = function tab_VizDataModel$get__log$1() {
    return tab.Logger.lazyGetLogger(tab.VizDataModel);
}
tab.VizDataModel.prototype = {
    _columns$1: null,
    _tupleIdColumn$1: null,
    
    add_newVizData: function tab_VizDataModel$add_newVizData(value) {
        this.__newVizData$1 = ss.Delegate.combine(this.__newVizData$1, value);
    },
    remove_newVizData: function tab_VizDataModel$remove_newVizData(value) {
        this.__newVizData$1 = ss.Delegate.remove(this.__newVizData$1, value);
    },
    
    __newVizData$1: null,
    
    get_hasTupleIdColumn: function tab_VizDataModel$get_hasTupleIdColumn() {
        return ss.isValue(this._tupleIdColumn$1);
    },
    
    get_columnCount: function tab_VizDataModel$get_columnCount() {
        return this._columns$1.length;
    },
    
    get_highlightCaptions: function tab_VizDataModel$get_highlightCaptions() {
        return this.get__vizDataPresModel$1().highlightCaptions;
    },
    
    get_filterFields: function tab_VizDataModel$get_filterFields() {
        return this.get__vizDataPresModel$1().filterFields;
    },
    
    get_fieldCaptions: function tab_VizDataModel$get_fieldCaptions() {
        var names = [];
        var $enum1 = ss.IEnumerator.getEnumerator(this._columns$1);
        while ($enum1.moveNext()) {
            var column = $enum1.current;
            names.add(column.get_fieldCaption());
        }
        return names;
    },
    
    get_ubertipData: function tab_VizDataModel$get_ubertipData() {
        return this.get__vizDataPresModel$1().ubertipData;
    },
    
    get__vizDataPresModel$1: function tab_VizDataModel$get__vizDataPresModel$1() {
        return this.presModel;
    },
    
    get__paneColumnsDataPresModel$1: function tab_VizDataModel$get__paneColumnsDataPresModel$1() {
        return this.get__vizDataPresModel$1().paneColumnsData;
    },
    
    get__paneColumnsPresModel$1: function tab_VizDataModel$get__paneColumnsPresModel$1() {
        return this.get__paneColumnsDataPresModel$1().paneColumnsList;
    },
    
    getVizDataField: function tab_VizDataModel$getVizDataField(captionOrFieldName) {
        var vizDataField = _.find(this._columns$1, function(iterator) {
            return iterator.isKnownAs(captionOrFieldName);
        });
        return vizDataField;
    },
    
    getVizDataFieldByIndex: function tab_VizDataModel$getVizDataFieldByIndex(index) {
        var columnsPresModel = this.get__paneColumnsDataPresModel$1().vizDataColumns;
        var ret = null;
        if (index >= 0 && index < columnsPresModel.length) {
            var fn = columnsPresModel[index].fn;
            ret = this.getVizDataField(fn);
        }
        return ret;
    },
    
    getColumnIndex: function tab_VizDataModel$getColumnIndex(captionOrFieldName) {
        var columns = this.get__paneColumnsDataPresModel$1().vizDataColumns;
        for (var index = 0; index < columns.length; ++index) {
            if (tab.VizDataUtils.isNameOfColumn(columns[index], captionOrFieldName)) {
                return index;
            }
        }
        return -1;
    },
    
    hasDimensionColumnNotMeasureNames: function tab_VizDataModel$hasDimensionColumnNotMeasureNames() {
        var target = _.find(this.get__paneColumnsDataPresModel$1().vizDataColumns, function(column) {
            return (column.localBaseColumnName !== '[:Measure Names]') && (column.fieldRole === 'dimension');
        });
        return ss.isValue(target);
    },
    
    isHeaderFullyNotQuantitative: function tab_VizDataModel$isHeaderFullyNotQuantitative(columnIndexes) {
        if (ss.isNullOrUndefined(columnIndexes) || !columnIndexes.length) {
            return false;
        }
        var $enum1 = ss.IEnumerator.getEnumerator(columnIndexes);
        while ($enum1.moveNext()) {
            var colIndex = $enum1.current;
            if (this.getVizDataFieldByIndex(colIndex).get_isQuantitative()) {
                return false;
            }
        }
        return true;
    },
    
    hasTupleId: function tab_VizDataModel$hasTupleId(tupleId) {
        var hasTupleId = false;
        if (this.get_hasTupleIdColumn()) {
            this.forEachVizDataField(function(dataField, index) {
                if (dataField.isTupleIdValid(tupleId)) {
                    hasTupleId = true;
                    return false;
                }
                return true;
            });
        }
        return hasTupleId;
    },
    
    forEachTupleId: function tab_VizDataModel$forEachTupleId(tupleIdFunction) {
        for (var ii = 0; ii < this.get__paneColumnsPresModel$1().length; ++ii) {
            var tupleIdColumnWithinPane = this.get__paneColumnsPresModel$1()[ii].vizPaneColumns[0];
            var $enum1 = ss.IEnumerator.getEnumerator(tupleIdColumnWithinPane.tupleIds);
            while ($enum1.moveNext()) {
                var tupleId = $enum1.current;
                var breakNow = !tupleIdFunction(tupleId);
                if (breakNow) {
                    break;
                }
            }
        }
    },
    
    forEachVizDataField: function tab_VizDataModel$forEachVizDataField(vizDataFieldFunction) {
        var columnsPresModel = this.get__paneColumnsDataPresModel$1().vizDataColumns;
        for (var ii = 0; ii < columnsPresModel.length; ++ii) {
            var fn = columnsPresModel[ii].fn;
            if (fn === '[system:visual].[tuple_id]') {
                continue;
            }
            var column = this.getVizDataField(fn);
            var breakNow = !vizDataFieldFunction(column, ii);
            if (breakNow) {
                break;
            }
        }
    },
    
    update: function tab_VizDataModel$update(vizDataPresModel) {
        var presModelChanged = this.simpleSwapToUpdate(vizDataPresModel, this.__newVizData$1);
        if (presModelChanged && ss.isValue(this.get__paneColumnsDataPresModel$1())) {
            this._tupleIdColumn$1 = _.find(this.get__paneColumnsDataPresModel$1().vizDataColumns, function(column) {
                return (column.fn === '[system:visual].[tuple_id]');
            });
            this._columns$1.clear();
            var $enum1 = ss.IEnumerator.getEnumerator(this.get__paneColumnsDataPresModel$1().vizDataColumns);
            while ($enum1.moveNext()) {
                var column = $enum1.current;
                if (column.fn === '[system:visual].[tuple_id]') {
                    continue;
                }
                var vizDataField = new tab.VizDataField(column, this.get__paneColumnsDataPresModel$1().paneColumnsList);
                this._columns$1.add(vizDataField);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ZoneModel

tab.ZoneModel = function tab_ZoneModel(parent, dashboard, zoneId) {
    tab.ZoneModel.initializeBase(this, [ parent, new tab.PresModelPathItem(zoneId.toString(), 0) ]);
    this._dashboardModel$1 = dashboard;
}
tab.ZoneModel.typeOfContent = function tab_ZoneModel$typeOfContent(zonePresModel) {
    var content = zonePresModel.presModelHolder;
    if (ss.isValue(content) && Object.getKeyCount(content) === 1) {
        return Object.keys(content)[0];
    }
    switch (zonePresModel.zoneType) {
        case 'filter':
        case 'layout-basic':
        case 'layout-flow':
        case 'layout-free-form':
        case 'empty':
            return '';
    }
    tab.Logger.lazyGetLogger(tab.ZoneModel).warn('PresModelHolder has %s children. There should only be one: %o', Object.getKeyCount(content), zonePresModel);
    return '';
}
tab.ZoneModel.getContent = function tab_ZoneModel$getContent(zonePresModel, contentType) {
    if (!(contentType in zonePresModel.presModelHolder)) {
        tab.Logger.lazyGetLogger(tab.ZoneModel).warn('Content type %s not found in zonePresModel: %o', contentType, zonePresModel);
        return null;
    }
    return zonePresModel.presModelHolder[contentType];
}
tab.ZoneModel._getLegendTypeFromZoneType$1 = function tab_ZoneModel$_getLegendTypeFromZoneType$1(zt) {
    switch (zt) {
        case 'color':
            return 'color';
        case 'shape':
            return 'shape';
        case 'size':
            return 'size';
        case 'map':
            return 'map';
    }
    tab.Logger.getLogger(tab.ZoneModel).warn('Unsupported legend type: %s', zt);
    return 'color';
}
tab.ZoneModel.prototype = {
    _dashboardModel$1: null,
    _zoneContentModel$1: null,
    _contentWrapperModel$1: null,
    
    add_newZoneContent: function tab_ZoneModel$add_newZoneContent(value) {
        this.__newZoneContent$1 = ss.Delegate.combine(this.__newZoneContent$1, value);
    },
    remove_newZoneContent: function tab_ZoneModel$remove_newZoneContent(value) {
        this.__newZoneContent$1 = ss.Delegate.remove(this.__newZoneContent$1, value);
    },
    
    __newZoneContent$1: null,
    
    add_updateZoneContent: function tab_ZoneModel$add_updateZoneContent(value) {
        this.__updateZoneContent$1 = ss.Delegate.combine(this.__updateZoneContent$1, value);
    },
    remove_updateZoneContent: function tab_ZoneModel$remove_updateZoneContent(value) {
        this.__updateZoneContent$1 = ss.Delegate.remove(this.__updateZoneContent$1, value);
    },
    
    __updateZoneContent$1: null,
    
    add_removeZoneContent: function tab_ZoneModel$add_removeZoneContent(value) {
        this.__removeZoneContent$1 = ss.Delegate.combine(this.__removeZoneContent$1, value);
    },
    remove_removeZoneContent: function tab_ZoneModel$remove_removeZoneContent(value) {
        this.__removeZoneContent$1 = ss.Delegate.remove(this.__removeZoneContent$1, value);
    },
    
    __removeZoneContent$1: null,
    
    add_updateZone: function tab_ZoneModel$add_updateZone(value) {
        this.__updateZone$1 = ss.Delegate.combine(this.__updateZone$1, value);
    },
    remove_updateZone: function tab_ZoneModel$remove_updateZone(value) {
        this.__updateZone$1 = ss.Delegate.remove(this.__updateZone$1, value);
    },
    
    __updateZone$1: null,
    
    add_resizeZone: function tab_ZoneModel$add_resizeZone(value) {
        this.__resizeZone$1 = ss.Delegate.combine(this.__resizeZone$1, value);
    },
    remove_resizeZone: function tab_ZoneModel$remove_resizeZone(value) {
        this.__resizeZone$1 = ss.Delegate.remove(this.__resizeZone$1, value);
    },
    
    __resizeZone$1: null,
    
    get_model: function tab_ZoneModel$get_model() {
        return this._zoneContentModel$1;
    },
    
    get_dashboardModel: function tab_ZoneModel$get_dashboardModel() {
        return this._dashboardModel$1;
    },
    
    get_visualModel: function tab_ZoneModel$get_visualModel() {
        if (this.get_zoneType() === 'viz') {
            return this._zoneContentModel$1;
        }
        return null;
    },
    
    get_zoneType: function tab_ZoneModel$get_zoneType() {
        return this._getZoneType$1(this.get_zonePresModel());
    },
    
    get_height: function tab_ZoneModel$get_height() {
        return this.get_zonePresModel().h;
    },
    
    get_width: function tab_ZoneModel$get_width() {
        return this.get_zonePresModel().w;
    },
    
    get_x: function tab_ZoneModel$get_x() {
        return this.get_zonePresModel().x;
    },
    
    get_y: function tab_ZoneModel$get_y() {
        return this.get_zonePresModel().y;
    },
    
    get_zoneContentRect: function tab_ZoneModel$get_zoneContentRect() {
        return tab.$create_RectXY(this.get_x(), this.get_y(), this.get_width(), this.get_height());
    },
    
    get_zoneId: function tab_ZoneModel$get_zoneId() {
        return this.get_zonePresModel().zoneId;
    },
    
    get_worksheetName: function tab_ZoneModel$get_worksheetName() {
        return this.get_zonePresModel().worksheet;
    },
    
    get_contentType: function tab_ZoneModel$get_contentType() {
        return tab.ZoneModel.typeOfContent(this.get_zonePresModel());
    },
    
    get_zonePresModel: function tab_ZoneModel$get_zonePresModel() {
        return this.presModel;
    },
    
    get_backgroundColor: function tab_ZoneModel$get_backgroundColor() {
        if (ss.isValue(this.get_zonePresModel().bgColor)) {
            return tab.ColorModel.convertColorForCanvas(this.get_zonePresModel().bgColor);
        }
        return null;
    },
    
    get_relativeZoneZIndex: function tab_ZoneModel$get_relativeZoneZIndex() {
        return this.get_zonePresModel().zoneZOrder + 1;
    },
    
    get_associatedSheet: function tab_ZoneModel$get_associatedSheet() {
        return this.get_zonePresModel().sheet;
    },
    
    get_isDependentOnViz: function tab_ZoneModel$get_isDependentOnViz() {
        switch (this.get_zoneType()) {
            case 'viz':
            case 'color':
            case 'shape':
            case 'size':
            case 'map':
                return true;
        }
        return false;
    },
    
    get_hasBorder: function tab_ZoneModel$get_hasBorder() {
        return tab.ModelUtils.hasBorder(this.get_zonePresModel().styledBox);
    },
    
    raiseRemoveZoneContent: function tab_ZoneModel$raiseRemoveZoneContent() {
        this.raiseEvent(this.__removeZoneContent$1);
    },
    
    update: function tab_ZoneModel$update(zonePresModel) {
        if (ss.isValue(zonePresModel)) {
            zonePresModel.sheet = (zonePresModel.sheet || '');
            zonePresModel.titleWidth = (zonePresModel.titleWidth || 0);
            zonePresModel.titleHeight = (zonePresModel.titleHeight || 0);
            if (!this._isNewZoneSizeSameAsOld$1(zonePresModel)) {
                this.raiseEvent(this.__resizeZone$1);
            }
            if (ss.isValue(zonePresModel.presModelHolder)) {
                if (!ss.isValue(this._contentWrapperModel$1)) {
                    this._contentWrapperModel$1 = new tab.ZoneContentWrapperModel(this);
                }
                var contentType = tab.ZoneModel.typeOfContent(zonePresModel);
                if (ss.isValue(this.presModel) && this.get_contentType() !== contentType) {
                    this._zoneContentModel$1 = null;
                }
                var shouldFireUpdateZoneContent = true;
                if (contentType === tab.ZoneModel._visualField$1) {
                    var visual = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._visualField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.VisualModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var visualModel = this._zoneContentModel$1;
                    visualModel.update(visual);
                }
                else if (contentType === tab.ZoneModel._titleField$1) {
                    var title = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._titleField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.TextRegionModel(this._contentWrapperModel$1, tab.ZoneModel._titleField$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var textRegionModel = this._zoneContentModel$1;
                    textRegionModel.update(title);
                }
                else if (contentType === tab.ZoneModel._textField$1) {
                    var text = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._textField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.TextRegionModel(this._contentWrapperModel$1, tab.ZoneModel._textField$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var textRegionModel = this._zoneContentModel$1;
                    textRegionModel.update(text);
                }
                else if (contentType === tab.ZoneModel._quickFilterField$1) {
                    var quickFilterDisplay = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._quickFilterField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.QuickFilterDisplayModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var frame = tab.JsonUtil.parseJson(zonePresModel.frameJson);
                    var quickFilterDisplayModel = this._zoneContentModel$1;
                    quickFilterDisplayModel.update(quickFilterDisplay, frame);
                }
                else if (contentType === tab.ZoneModel._qColorLegendField$1) {
                    if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
                        var quantColorLegendPM = tab.ZoneModel.getContent(zonePresModel, contentType);
                        if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                            this._zoneContentModel$1 = new tab.QuantitativeColorLegendModel(this._contentWrapperModel$1, contentType);
                            this._raiseNewZoneContent$1(this._zoneContentModel$1);
                        }
                        var quantLegendModel = this._zoneContentModel$1;
                        quantLegendModel.update(quantColorLegendPM);
                    }
                }
                else if (contentType === tab.ZoneModel._colorLegendField$1 || contentType === tab.ZoneModel._sizeLegendField$1 || contentType === tab.ZoneModel._shapeLegendField$1 || contentType === tab.ZoneModel._mapLegendField$1) {
                    if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
                        var catLegendPM = tab.ZoneModel.getContent(zonePresModel, contentType);
                        if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                            var zt = this._getZoneType$1(zonePresModel);
                            this._zoneContentModel$1 = new tab.CategoricalLegendModel(this._contentWrapperModel$1, contentType, tab.ZoneModel._getLegendTypeFromZoneType$1(zt));
                            this._raiseNewZoneContent$1(this._zoneContentModel$1);
                        }
                        var catLegendModel = this._zoneContentModel$1;
                        catLegendModel.update(catLegendPM);
                    }
                }
                else if (contentType === tab.ZoneModel._paramCtrlField$1) {
                    var paramCtrl = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._paramCtrlField$1);
                    var paramCtrlJson = tab.JsonUtil.parseJson(paramCtrl.parameterCtrlJson);
                    paramCtrl.legacyPresModel = paramCtrlJson;
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.ParameterCtrlModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var frame = tab.JsonUtil.parseJson(zonePresModel.frameJson);
                    var paramCtrlModel = this._zoneContentModel$1;
                    paramCtrlModel.update(paramCtrl, frame);
                }
                else if (contentType === tab.ZoneModel._pageField$1) {
                    var page = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._pageField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.PageModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var frame = tab.JsonUtil.parseJson(zonePresModel.frameJson);
                    var pageModel = this._zoneContentModel$1;
                    pageModel.update(page, frame);
                }
                else if (contentType === tab.ZoneModel._flipboardNavField$1) {
                    var nav = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._flipboardNavField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.FlipboardNavigatorModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var navModel = this._zoneContentModel$1;
                    navModel.update(nav);
                }
                else if (contentType === tab.ZoneModel._flipboardField$1) {
                    var flip = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._flipboardField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.FlipboardModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var navModel = this._zoneContentModel$1;
                    navModel.update(flip);
                }
                else if (contentType === tab.ZoneModel._serverRenderedLegendField$1) {
                    var legacyLegendPM = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._serverRenderedLegendField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.LegacyLegendModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var legacyLegendModel = this._zoneContentModel$1;
                    legacyLegendModel.update(legacyLegendPM);
                }
                else if (contentType === tab.ZoneModel._webZoneField$1) {
                    var webZone = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._webZoneField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.WebZoneModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var webZoneModel = this._zoneContentModel$1;
                    webZoneModel.update(webZone);
                }
                else if (contentType === tab.ZoneModel._imageZoneField$1) {
                    var imageZone = tab.ZoneModel.getContent(zonePresModel, tab.ZoneModel._imageZoneField$1);
                    if (ss.isNullOrUndefined(this._zoneContentModel$1)) {
                        this._zoneContentModel$1 = new tab.ImageZoneModel(this._contentWrapperModel$1);
                        this._raiseNewZoneContent$1(this._zoneContentModel$1);
                    }
                    var imageZoneModel = this._zoneContentModel$1;
                    imageZoneModel.update(imageZone);
                }
                else {
                    shouldFireUpdateZoneContent = false;
                }
                if (shouldFireUpdateZoneContent) {
                    this._raiseUpdateZoneContent$1();
                }
            }
            else {
                if (zonePresModel.zoneType === 'filter') {
                    if (zonePresModel.frameJson !== this.get_zonePresModel().frameJson) {
                        if (ss.isValue(this._zoneContentModel$1)) {
                            var frame = tab.JsonUtil.parseJson(zonePresModel.frameJson);
                            var quickfilterDisplayModel = this._zoneContentModel$1;
                            quickfilterDisplayModel.update(quickfilterDisplayModel.get_quickFilterDisplayPresModel(), frame);
                        }
                    }
                }
            }
        }
        this.swapAndCopyPresModel(zonePresModel);
        this.raiseEvent(this.__updateZone$1);
    },
    
    _getZoneType$1: function tab_ZoneModel$_getZoneType$1(zpm) {
        if (ss.isValue(zpm)) {
            return zpm.zoneType;
        }
        return 'invalid';
    },
    
    _isNewZoneSizeSameAsOld$1: function tab_ZoneModel$_isNewZoneSizeSameAsOld$1(newPM) {
        if (ss.isValue(this.get_presModel())) {
            return newPM.h === this.get_height() && newPM.w === this.get_width() && newPM.x === this.get_x() && newPM.y === this.get_y();
        }
        return false;
    },
    
    borderWidth: function tab_ZoneModel$borderWidth() {
        var borderWidth = 0;
        if (this.get_hasBorder()) {
            borderWidth = this.get_zonePresModel().styledBox.uw;
        }
        return borderWidth;
    },
    
    _raiseNewZoneContent$1: function tab_ZoneModel$_raiseNewZoneContent$1(newZoneModel) {
        this.raiseEvent(this.__newZoneContent$1, newZoneModel);
    },
    
    _raiseUpdateZoneContent$1: function tab_ZoneModel$_raiseUpdateZoneContent$1() {
        this.raiseEvent(this.__updateZoneContent$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ZoneContentWrapperModel

tab.ZoneContentWrapperModel = function tab_ZoneContentWrapperModel(parent) {
    tab.ZoneContentWrapperModel.initializeBase(this, [ parent, new tab.PresModelPathItem('presModelHolder') ]);
}
tab.ZoneContentWrapperModel.prototype = {
    
    get_zone: function tab_ZoneContentWrapperModel$get_zone() {
        return Type.safeCast(this.get_parent(), tab.ZoneModel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShapeModel

tab.ShapeModel = function tab_ShapeModel(shapePalette, shapeType) {
    this._shapePalette = shapePalette;
    this._shapeType = shapeType;
}
tab.ShapeModel.fromString = function tab_ShapeModel$fromString(shapeName) {
    var r = new RegExp('^(:([^\\/]+)\\/)?([^\\/]+)$');
    var matches = r.exec(shapeName);
    if (ss.isNullOrUndefined(matches)) {
        return null;
    }
    var paletteName = matches[2];
    var typeName = matches[3];
    if (ss.isNullOrUndefined(typeName)) {
        return null;
    }
    var palette = null;
    if (ss.isValue(paletteName)) {
        if (paletteName === 'filled') {
            palette = 'filled';
        }
        else {
            return null;
        }
    }
    var type = typeName;
    return new tab.ShapeModel(palette, type);
}
tab.ShapeModel.prototype = {
    _shapePalette: null,
    _shapeType: null,
    
    get_palette: function tab_ShapeModel$get_palette() {
        return this._shapePalette;
    },
    
    get_shapeType: function tab_ShapeModel$get_shapeType() {
        return this._shapeType;
    },
    
    equals: function tab_ShapeModel$equals(selectedShape) {
        return ss.isValue(selectedShape) && this._shapePalette === selectedShape._shapePalette && this._shapeType === selectedShape._shapeType;
    },
    
    toString: function tab_ShapeModel$toString() {
        if (ss.isNullOrUndefined(this._shapePalette)) {
            return this.get_shapeType();
        }
        return ':' + this.get_palette() + '/' + this.get_shapeType();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TextRegionModel

tab.TextRegionModel = function tab_TextRegionModel(parent, presModelKey) {
    tab.TextRegionModel.initializeBase(this, [ parent, new tab.PresModelPathItem(presModelKey) ]);
}
tab.TextRegionModel.prototype = {
    
    add_newText: function tab_TextRegionModel$add_newText(value) {
        this.__newText$1 = ss.Delegate.combine(this.__newText$1, value);
    },
    remove_newText: function tab_TextRegionModel$remove_newText(value) {
        this.__newText$1 = ss.Delegate.remove(this.__newText$1, value);
    },
    
    __newText$1: null,
    
    get_hAlign: function tab_TextRegionModel$get_hAlign() {
        return this.get__textRegionPresModel$1().halign;
    },
    
    get_html: function tab_TextRegionModel$get_html() {
        return this.get__textRegionPresModel$1().html;
    },
    
    get_orientation: function tab_TextRegionModel$get_orientation() {
        return this.get__textRegionPresModel$1().orientation;
    },
    
    get_styledBox: function tab_TextRegionModel$get_styledBox() {
        return this.get__textRegionPresModel$1().styledBox;
    },
    
    get_vAlign: function tab_TextRegionModel$get_vAlign() {
        return this.get__textRegionPresModel$1().valign;
    },
    
    get__textRegionPresModel$1: function tab_TextRegionModel$get__textRegionPresModel$1() {
        return this.presModel;
    },
    
    update: function tab_TextRegionModel$update(textRegionPresModel) {
        this.simpleSwapToUpdate(textRegionPresModel, this.__newText$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ZonesModel

tab.ZonesModel = function tab_ZonesModel(parent) {
    tab.ZonesModel.initializeBase(this, [ parent, new tab.PresModelPathItem('zones') ]);
    this.set_zonePresModels({});
    this._zoneModels$1 = {};
}
tab.ZonesModel._zoneKey$1 = function tab_ZonesModel$_zoneKey$1(zoneId) {
    return 'z_' + zoneId;
}
tab.ZonesModel.prototype = {
    _zoneModels$1: null,
    
    add_newZone: function tab_ZonesModel$add_newZone(value) {
        this.__newZone$1 = ss.Delegate.combine(this.__newZone$1, value);
    },
    remove_newZone: function tab_ZonesModel$remove_newZone(value) {
        this.__newZone$1 = ss.Delegate.remove(this.__newZone$1, value);
    },
    
    __newZone$1: null,
    
    get_zoneModels: function tab_ZonesModel$get_zoneModels() {
        var models = [];
        var $dict1 = this._zoneModels$1;
        for (var $key2 in $dict1) {
            var zoneModel = { key: $key2, value: $dict1[$key2] };
            models.add(zoneModel.value);
        }
        return models;
    },
    
    get_zonePresModels: function tab_ZonesModel$get_zonePresModels() {
        return this.presModel;
    },
    set_zonePresModels: function tab_ZonesModel$set_zonePresModels(value) {
        this.presModel = value;
        return value;
    },
    
    getZone: function tab_ZonesModel$getZone(zoneId) {
        return this._zoneModels$1[tab.ZonesModel._zoneKey$1(zoneId)];
    },
    
    hasZone: function tab_ZonesModel$hasZone(zoneId) {
        return Object.keyExists(this._zoneModels$1, tab.ZonesModel._zoneKey$1(zoneId));
    },
    
    update: function tab_ZonesModel$update(presModels) {
        this._logZones$1('Zones before update: ');
        this._removeInvalidZones$1(presModels);
        var $dict1 = presModels;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            var zoneUpdate = entry.value;
            if (ss.isValue(zoneUpdate)) {
                var zoneId = zoneUpdate.zoneId;
                try {
                    var zoneKey = tab.ZonesModel._zoneKey$1(zoneId);
                    if (!ss.isValue(this._zoneModels$1[zoneKey])) {
                        tab.Log.get(this).debug('Creating zone: %s, %o', zoneId, zoneUpdate);
                        var newZoneModel = new tab.ZoneModel(this, this.get_parent(), zoneId);
                        this._zoneModels$1[zoneKey] = newZoneModel;
                        this.raiseEvent(this.__newZone$1, this._zoneModels$1[zoneKey]);
                    }
                    else if (ss.isValue(zoneUpdate) && ss.isValue(zoneUpdate.presModelHolder) && this._zoneModels$1[zoneKey].get_contentType() !== tab.ZoneModel.typeOfContent(zoneUpdate)) {
                        this._zoneModels$1[zoneKey].raiseRemoveZoneContent();
                        this.raiseEvent(this.__newZone$1, this._zoneModels$1[zoneKey]);
                    }
                    tab.Log.get(this).debug('Update zone: %s', zoneId);
                    this._zoneModels$1[zoneKey].update(zoneUpdate);
                }
                catch (e) {
                    tab.ErrorTrace.report(e, false);
                    tab.Log.get(this).error('Error creating zone: %s, %o, %s', zoneId, zoneUpdate, e.toString());
                }
            }
        }
        this.swapAndCopyPresModel(presModels);
        this._logZones$1('Zones after update: ');
    },
    
    _removeInvalidZones$1: function tab_ZonesModel$_removeInvalidZones$1(newZones) {
        var $dict1 = this._zoneModels$1;
        for (var $key2 in $dict1) {
            var zoneEntry = { key: $key2, value: $dict1[$key2] };
            var oldModel = zoneEntry.value;
            var newZonePresModel = newZones[oldModel.get_zoneId().toString()];
            if (ss.isNull(newZonePresModel)) {
                var key = oldModel.get_zoneId().toString();
                delete newZones[key];
                delete this.get_zonePresModels()[key];
                this.removeZone(oldModel);
                continue;
            }
            if (ss.isValue(newZonePresModel) && oldModel.get_zoneType() !== newZonePresModel.zoneType) {
                this.removeZone(oldModel);
                continue;
            }
        }
    },
    
    removeZone: function tab_ZonesModel$removeZone(zoneToBeRemoved) {
        tab.Log.get(this).debug('Removing zone: %o', zoneToBeRemoved);
        zoneToBeRemoved.raiseRemoveZoneContent();
        delete this._zoneModels$1[tab.ZonesModel._zoneKey$1(zoneToBeRemoved.get_zoneId())];
    },
    
    _logZones$1: function tab_ZonesModel$_logZones$1(frontLabel) {
        var zoneListBuilder = new ss.StringBuilder();
        zoneListBuilder.appendLine(frontLabel);
        var $dict1 = this.get_zonePresModels();
        for (var $key2 in $dict1) {
            var zoneEntry = { key: $key2, value: $dict1[$key2] };
            if (ss.isValue(zoneEntry.value)) {
                zoneListBuilder.append('[ ');
                zoneListBuilder.append(zoneEntry.value.zoneId);
                zoneListBuilder.append(' ');
                zoneListBuilder.append(zoneEntry.value.zoneType);
                zoneListBuilder.append(' ] ');
                zoneListBuilder.appendLine();
            }
        }
        tab.Log.get(this).debug(zoneListBuilder.toString());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ExportServerCommands

tab.ExportServerCommands = function tab_ExportServerCommands() {
}
tab.ExportServerCommands.exportImage = function tab_ExportServerCommands$exportImage(sheetName, dialogData, sheetNames, scrollOffsets) {
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'png-export-server';
    cmd.commandParams = {};
    if (ss.isValue(sheetName)) {
        cmd.commandParams['sheet'] = sheetName;
    }
    cmd.commandParams['scrollOffsetSheets'] = tab.JsonUtil.toJson(sheetNames);
    var numPoints = scrollOffsets.length;
    var pointsPresModel = new Array(numPoints);
    for (var i = 0; i < numPoints; i++) {
        var pointPresModel = {};
        pointPresModel.x = Math.round(scrollOffsets[i].x);
        pointPresModel.y = Math.round(scrollOffsets[i].y);
        pointsPresModel[i] = pointPresModel;
    }
    cmd.commandParams['scrollOffsetPoints'] = tab.JsonUtil.toJson(pointsPresModel);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately', function(result) {
        var exportPM = result;
        var session = tab.CommandController.get().get_legacySession();
        session.openDownload(session.formatSessionTempfileReference(exportPM.tempfileKey, true, true), dialogData);
    }, null);
}


////////////////////////////////////////////////////////////////////////////////
// tab.SessionServerCommands

tab.SessionServerCommands = function tab_SessionServerCommands() {
}
tab.SessionServerCommands.destroySessionAndForward = function tab_SessionServerCommands$destroySessionAndForward(window, forwardUrl) {
    var session = tab.CommandController.get().get_legacySession();
    var handler = session._createHandler(function() {
        if (tab.WindowHelper.getLocation(window).href === forwardUrl) {
            tab.WindowHelper.reload(window, true);
        }
        else {
            tab.WindowHelper.setLocationHref(window, forwardUrl);
        }
    }, function() {
    }, function() {
    }, 'immediately');
    var args = {};
    args.type = 'DELETE';
    args.url = session._formatSessionMethod('destroy');
    args.headers = { Accept: 'text/javascript' };
    args.dataType = 'json';
    session._request(args, handler);
}


////////////////////////////////////////////////////////////////////////////////
// tab.ToolbarServerCommands

tab.ToolbarServerCommands = function tab_ToolbarServerCommands() {
}
tab.ToolbarServerCommands.setAutoUpdate = function tab_ToolbarServerCommands$setAutoUpdate(state) {
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'set-auto-update-server';
    var cmdParams = {};
    cmdParams['state'] = state;
    cmd.commandParams = cmdParams;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.ToolbarServerCommands.refreshData = function tab_ToolbarServerCommands$refreshData() {
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'refresh-data-server';
    var cmdParams = {};
    cmdParams['deltaTime'] = 0;
    cmdParams['shouldRefreshDs'] = true;
    cmd.commandParams = cmdParams;
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.ToolbarServerCommands.toggleMarks = function tab_ToolbarServerCommands$toggleMarks() {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'toggle-mark-labels';
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.ToolbarServerCommands.downloadWorkbook = function tab_ToolbarServerCommands$downloadWorkbook(givenUrl) {
    var url;
    if (ss.isValue(givenUrl)) {
        url = givenUrl;
    }
    else {
        url = tsConfig.downloadURI;
    }
    var downloadUrl;
    if (tsConfig.is_metrics_view) {
        downloadUrl = tab.CommandController.get().get_legacySession().metricsViewDownloadUrl();
    }
    else {
        downloadUrl = tab.ToolbarServerCommands._rewriteDownloadUri(url);
    }
    window.open(downloadUrl);
}
tab.ToolbarServerCommands.exportData = function tab_ToolbarServerCommands$exportData(sheetName) {
    if (ss.isNullOrUndefined(sheetName) && ss.isValue(tab.ModelUtils.findActiveOrDefaultVisual())) {
        sheetName = tab.ModelUtils.findActiveOrDefaultVisual().get_worksheetName();
    }
    var session = tab.ModelUtils.findContentDashboard().getViewSession(sheetName);
    if (ss.isValue(session)) {
        window.open(session.formatUnderlyingDataURL(null), session.getWindow('vud'), 'scrollbars,resizable');
    }
}
tab.ToolbarServerCommands.exportImage = function tab_ToolbarServerCommands$exportImage(exportImageHelper) {
    var dialogData = tableau.types.ExportDialogType['ExportImage'];
    var sheetNameList = [];
    var scrollPoints = [];
    if (tab.ModelUtils.findContentDashboard().get_isDashboard()) {
        var sheetScrollPositions = exportImageHelper.get_sheetScrollPositions();
        if (ss.isValue(sheetScrollPositions)) {
            var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(sheetScrollPositions));
            while ($enum1.moveNext()) {
                var sheetName = $enum1.current;
                var scrollPos = sheetScrollPositions[sheetName];
                var x = scrollPos.x;
                var y = scrollPos.y;
                if (!!x || !!y) {
                    scrollPoints.add(tab.$create_Point(x, y));
                    sheetNameList.add(sheetName);
                }
            }
        }
    }
    tab.ExportServerCommands.exportImage(tsConfig.current_sheet_name, dialogData, sheetNameList, scrollPoints);
}
tab.ToolbarServerCommands.exportCrosstab = function tab_ToolbarServerCommands$exportCrosstab(sheetName) {
    if (ss.isNullOrUndefined(sheetName) && ss.isValue(tab.ModelUtils.findActiveOrDefaultVisual())) {
        sheetName = tab.ModelUtils.findActiveOrDefaultVisual().get_worksheetName();
    }
    var session = tab.ModelUtils.findContentDashboard().getViewSession(sheetName);
    if (ss.isValue(session)) {
        var dialogData = tableau.types.ExportDialogType['ExportCrosstab'];
        session.openDownload(session.formatExportCrossTabURL('utf16'), dialogData);
    }
}
tab.ToolbarServerCommands.exportPdf = function tab_ToolbarServerCommands$exportPdf(exportPdfHelper) {
    exportPdfHelper.triggerExportPdfUI();
}
tab.ToolbarServerCommands._rewriteDownloadUri = function tab_ToolbarServerCommands$_rewriteDownloadUri(uri) {
    if (ss.isValue(uri)) {
        var matches = uri.match(tab.ToolbarServerCommands._uriPattern);
        if (ss.isValue(matches) && matches.length >= 2) {
            return tabBootstrap.ViewerBootstrap.get_instance().location.protocol + '//' + tabBootstrap.ViewerBootstrap.get_instance().location.host + matches[1];
        }
    }
    return uri;
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParameterServerCommands

tab.ParameterServerCommands = function tab_ParameterServerCommands() {
}
tab.ParameterServerCommands.setParameterValue = function tab_ParameterServerCommands$setParameterValue(fieldName, value, forceUseUSLocale, successCallback, errorCallback) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'set-parameter-value';
    forceUseUSLocale = (forceUseUSLocale || false);
    cmd.commandParams = tab.ParameterServerCommands._createSetParameterValueParams(fieldName, value, forceUseUSLocale);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately', successCallback, errorCallback);
}
tab.ParameterServerCommands._createSetParameterValueParams = function tab_ParameterServerCommands$_createSetParameterValueParams(fieldName, value, forceUseUSLocale) {
    var cmdParams = {};
    cmdParams['globalFieldName'] = fieldName;
    cmdParams['valueString'] = value;
    cmdParams['useUsLocale'] = forceUseUSLocale;
    return cmdParams;
}


////////////////////////////////////////////////////////////////////////////////
// tab.PageServerCommands

tab.PageServerCommands = function tab_PageServerCommands() {
}
tab.PageServerCommands.changePage = function tab_PageServerCommands$changePage(pageNumber, visualId) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'change-page';
    cmd.commandParams = tab.PageServerCommands._createChangePageParams(pageNumber, visualId);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.PageServerCommands.syncedChangePage = function tab_PageServerCommands$syncedChangePage(visualId, zoneId, pageNumber) {
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'synced-change-page-server';
    cmd.commandParams = tab.PageServerCommands._createSyncedChangePageParams(visualId, zoneId, pageNumber);
    tab.ServerCommands.executeServerCommand(cmd, 'immediately');
}
tab.PageServerCommands.toggleTrails = function tab_PageServerCommands$toggleTrails(visualId) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'page-toggle-trails';
    cmd.commandParams = tab.PageServerCommands._createToggleTrailsParams(visualId);
    tab.ServerCommands.executeServerCommand(cmd, 'afterDelay');
}
tab.PageServerCommands._createChangePageParams = function tab_PageServerCommands$_createChangePageParams(pageNumber, visualId) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    cmdParams['pageNumber'] = pageNumber;
    return cmdParams;
}
tab.PageServerCommands._createSyncedChangePageParams = function tab_PageServerCommands$_createSyncedChangePageParams(visualId, zoneId, pageNumber) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    cmdParams['zoneId'] = zoneId;
    cmdParams['pageNumber'] = pageNumber;
    return cmdParams;
}
tab.PageServerCommands._createToggleTrailsParams = function tab_PageServerCommands$_createToggleTrailsParams(visualId) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    return cmdParams;
}


////////////////////////////////////////////////////////////////////////////////
// tab.SaveServerCommands

tab.SaveServerCommands = function tab_SaveServerCommands() {
}
tab.SaveServerCommands.saveWorkbook = function tab_SaveServerCommands$saveWorkbook(successCallback) {
    var internalSuccess = function(o) {
        tab.WorldUpdateServerCommands.getWorldUpdate(function() {
            if (ss.isValue(successCallback)) {
                successCallback(o);
            }
        });
    };
    tab.CommandController.get().SaveWorkbook(tsConfig.current_workbook_name, tsConfig.current_project_id, tsConfig.showTabsWorkbook, internalSuccess);
}
tab.SaveServerCommands.saveWorkbookAs = function tab_SaveServerCommands$saveWorkbookAs(name, project, showTabs, embedCredentials, noOverwrite, successCallback, errorCallback) {
    tab.CommandController.get().SaveWorkbookAs(name, project.get_id(), showTabs, embedCredentials, noOverwrite, successCallback, errorCallback);
}
tab.SaveServerCommands.transitionSessionAfterLogon = function tab_SaveServerCommands$transitionSessionAfterLogon(successCallback) {
    tab.CommandController.get()._transitionGuestSession(successCallback);
}


////////////////////////////////////////////////////////////////////////////////
// tab.SortServerCommands

tab.SortServerCommands = function tab_SortServerCommands() {
}
tab.SortServerCommands.sortFromIndicator = function tab_SortServerCommands$sortFromIndicator(mouse, scrollAmount, visualId) {
    var cmdArray = [];
    var zoneId = tab.ModelUtils.getZoneIdForSheetName(visualId.worksheet);
    if (tsConfig.allow_select && zoneId !== -1 && !tab.ModelUtils.isActiveZone(zoneId)) {
        var zoneCmd = tab.SelectionClientCommands.buildActiveZoneClientCommand(zoneId);
        cmdArray.push(zoneCmd);
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'sort-from-indicator';
    cmd.commandParams = tab.SortServerCommands._createSortFromIndicatorParams(mouse, scrollAmount, visualId);
    var sortCommand = new tab.ClientCommand('afterDelay', null, cmd);
    cmdArray.push(sortCommand);
    var c = new tab.CompositeClientCommand('afterDelay', cmdArray);
    tab.CommandController.SendCommand(c);
}
tab.SortServerCommands._createSortFromIndicatorParams = function tab_SortServerCommands$_createSortFromIndicatorParams(mouse, scrollAmount, visualId) {
    var cmdParams = {};
    var mouseToInt = tab.$create_Point(Math.floor(mouse.x), Math.floor(mouse.y));
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    cmdParams['vizLocation'] = tab.JsonUtil.toJson(tab.PointUtil.toPresModel(mouseToInt));
    cmdParams['scrollOffset'] = tab.JsonUtil.toJson(tab.PointUtil.toPresModel(scrollAmount));
    return cmdParams;
}


////////////////////////////////////////////////////////////////////////////////
// tab.WorkgroupServerCommands

tab.WorkgroupServerCommands = function tab_WorkgroupServerCommands() {
}
tab.WorkgroupServerCommands.getWritableProjects = function tab_WorkgroupServerCommands$getWritableProjects(callback) {
    var projects = [];
    tab.WorkgroupServerCommands._fetchItems('getProjects', function(pageResult) {
        var pageProjects = tab.WorkgroupServerCommands._parseProjects(pageResult);
        projects.addRange(pageProjects);
        return pageProjects.length;
    }, function() {
        callback(projects);
    }, 0);
}
tab.WorkgroupServerCommands.extendWorkgroupSession = function tab_WorkgroupServerCommands$extendWorkgroupSession() {
    if (!tsConfig.is_guest) {
        tab.XhrUtil.helper(tab.WorkgroupServerCommands._createRequest('getSessionInfo', null, function() {
        }, function() {
        }));
    }
}
tab.WorkgroupServerCommands.getSchedules = function tab_WorkgroupServerCommands$getSchedules(callback) {
    var schedules = [];
    tab.WorkgroupServerCommands._fetchItems('getSchedules', function(pageResult) {
        var pageSchedules = tab.WorkgroupServerCommands._parseSchedules(pageResult);
        schedules.addRange(pageSchedules);
        return pageSchedules.length;
    }, function() {
        callback(schedules);
    }, 0);
}
tab.WorkgroupServerCommands._fetchItems = function tab_WorkgroupServerCommands$_fetchItems(methodName, parsePageResult, onComplete, startIndex) {
    var order = [ { field: 'name', ascending: true } ];
    var methodParams = { page: { startIndex: startIndex }, order: order };
    var options = tab.WorkgroupServerCommands._createRequest(methodName, methodParams, function() {
    }, function() {
    });
    options.success = function(data, status, request) {
        var result = tab.WorkgroupServerCommands._getResult(data);
        if (tab.WorkgroupServerCommands._hasErrors(result)) {
            tab.Logger.getLogger(tab.WorkgroupServerCommands).warn('Fetch failed: %s', result);
            onComplete();
        }
        else {
            var numberOfItemsParsed = parsePageResult(result);
            var moreItems = Boolean.parse(result['moreItems'].toString());
            if (moreItems) {
                tab.WorkgroupServerCommands._fetchItems(methodName, parsePageResult, onComplete, startIndex + numberOfItemsParsed);
            }
            else {
                onComplete();
            }
        }
    };
    tab.XhrUtil.helper(options);
}
tab.WorkgroupServerCommands.setUserEmail = function tab_WorkgroupServerCommands$setUserEmail(email, success, failure) {
    tab.WorkgroupServerCommands._getSystemUserId(function(systemUserId) {
        var methodParams = { userId: systemUserId, email: email };
        tab.XhrUtil.helper(tab.WorkgroupServerCommands._createRequest('updateUserEmail', methodParams, success, failure));
    }, failure);
}
tab.WorkgroupServerCommands._getSystemUserId = function tab_WorkgroupServerCommands$_getSystemUserId(success, failure) {
    var username = tsConfig.current_user_name;
    var domainName = tsConfig.current_user_domain_name;
    var filterClauses = [ { field: 'username', operator: 'eq', value: username }, { field: 'domainName', operator: 'eq', value: domainName } ];
    var getServerUsersParams = { filter: { clauses: filterClauses } };
    tab.XhrUtil.helper(tab.WorkgroupServerCommands._createRequest('getServerUsers', getServerUsersParams, function(result) {
        var users = result['users'];
        if (users != null && users.length > 0 && Object.keyExists(users[0], 'id')) {
            var systemUserId = users[0]['id'];
            success(systemUserId);
        }
        else {
            failure();
        }
    }, failure));
}
tab.WorkgroupServerCommands.createSubscription = function tab_WorkgroupServerCommands$createSubscription(subject, workbook, schedule, success, failure) {
    var methodParams = { scheduleId: schedule.get_id(), subject: $.trim(subject), targetType: (workbook) ? 'Workbook' : 'View', targetId: (workbook) ? tsConfig.current_workbook_id : tsConfig.current_view_id, customizedViewId: tsConfig.current_custom_view_id };
    tab.XhrUtil.helper(tab.WorkgroupServerCommands._createRequest('createSubscription', methodParams, success, failure));
}
tab.WorkgroupServerCommands.logOff = function tab_WorkgroupServerCommands$logOff(failure) {
    var success = function(result) {
        var redirectUrl = result['redirectUrl'];
        tab.WindowHelper.setLocationHref(window.self, (ss.isValue(redirectUrl)) ? redirectUrl : '/');
    };
    tab.XhrUtil.helper(tab.WorkgroupServerCommands._createRequest('logout', {}, success, failure));
}
tab.WorkgroupServerCommands._createRequest = function tab_WorkgroupServerCommands$_createRequest(methodName, methodParams, success, failure) {
    var options = {};
    options.type = 'POST';
    options.contentType = 'application/json;charset=UTF-8';
    options.dataType = 'json';
    options.url = '/vizportal/api/web/v1/' + methodName;
    var xsrfToken = tab.WorkgroupServerCommands._getXsrfToken();
    if (ss.isValue(xsrfToken)) {
        options.headers = { 'X-XSRF-TOKEN': xsrfToken };
    }
    options.data = JSON.stringify({ method: methodName, params: methodParams });
    options.success = function(data, status, request) {
        var result = tab.WorkgroupServerCommands._getResult(data);
        if (tab.WorkgroupServerCommands._hasErrors(result)) {
            failure();
        }
        else {
            success(result);
        }
    };
    options.error = function() {
        failure();
    };
    return options;
}
tab.WorkgroupServerCommands._getXsrfToken = function tab_WorkgroupServerCommands$_getXsrfToken() {
    var keyValue = document.cookie.match(new RegExp('(^|;) ?XSRF-TOKEN=([^;]*)(;|$)'));
    return (keyValue != null) ? keyValue[2] : null;
}
tab.WorkgroupServerCommands._hasErrors = function tab_WorkgroupServerCommands$_hasErrors(result) {
    if (Object.keyExists(result, 'errors')) {
        var errors = result['errors'];
        return errors.length > 0;
    }
    else {
        return false;
    }
}
tab.WorkgroupServerCommands._parseProjects = function tab_WorkgroupServerCommands$_parseProjects(result) {
    var projectsJson = result['projects'];
    var projects = [];
    var $enum1 = ss.IEnumerator.getEnumerator(projectsJson);
    while ($enum1.moveNext()) {
        var projectJson = $enum1.current;
        var p = new tab.ProjectModel();
        p.set_name(projectJson['name'].toString());
        p.set_id(projectJson['id'].toString());
        projects.add(p);
    }
    return projects;
}
tab.WorkgroupServerCommands._parseSchedules = function tab_WorkgroupServerCommands$_parseSchedules(result) {
    var schedulesJson = result['schedules'];
    var schedules = [];
    var $enum1 = ss.IEnumerator.getEnumerator(schedulesJson);
    while ($enum1.moveNext()) {
        var scheduleJson = $enum1.current;
        var s = new tab.Schedule();
        s.set_name(scheduleJson['name'].toString());
        s.set_id(scheduleJson['id'].toString());
        s.set_action((scheduleJson['scheduledAction'].toString().toLowerCase() === 'extract') ? tab.Schedule.extract : tab.Schedule.subscription);
        schedules.add(s);
    }
    return schedules;
}
tab.WorkgroupServerCommands._getResult = function tab_WorkgroupServerCommands$_getResult(data) {
    var response = data;
    return response['result'];
}


////////////////////////////////////////////////////////////////////////////////
// tab.WorksheetServerCommands

tab.WorksheetServerCommands = function tab_WorksheetServerCommands() {
}
tab.WorksheetServerCommands.revert = function tab_WorksheetServerCommands$revert() {
    var c = tab.CommandUtils.newSrvCommand('revert-workbook');
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'immediately'));
}
tab.WorksheetServerCommands.undoToPosition = function tab_WorksheetServerCommands$undoToPosition(historyPosition) {
    var c = tab.CommandUtils.newDocCommand('undo');
    c.commandParams = tab.WorksheetServerCommands._createHistoryParam(historyPosition);
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'immediately'));
}
tab.WorksheetServerCommands.undo = function tab_WorksheetServerCommands$undo() {
    var c = tab.CommandUtils.newDocCommand('undo');
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'immediately'));
}
tab.WorksheetServerCommands.redoToPosition = function tab_WorksheetServerCommands$redoToPosition(historyPosition) {
    var c = tab.CommandUtils.newDocCommand('redo');
    c.commandParams = tab.WorksheetServerCommands._createHistoryParam(historyPosition);
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'immediately'));
}
tab.WorksheetServerCommands.redo = function tab_WorksheetServerCommands$redo() {
    var c = tab.CommandUtils.newDocCommand('redo');
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'immediately'));
}
tab.WorksheetServerCommands._createHistoryParam = function tab_WorksheetServerCommands$_createHistoryParam(historyPosition) {
    var cmdParams = {};
    cmdParams['undoPosition'] = historyPosition;
    return cmdParams;
}


////////////////////////////////////////////////////////////////////////////////
// tab.WorldUpdateServerCommands

tab.WorldUpdateServerCommands = function tab_WorldUpdateServerCommands() {
}
tab.WorldUpdateServerCommands.getWorldUpdate = function tab_WorldUpdateServerCommands$getWorldUpdate(onFinish) {
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'get-world-update';
    cmd.commandParams = tab.WorldUpdateServerCommands._createGetWorldUpdateParams();
    tab.ServerCommands.executeServerCommand(cmd, 'immediately', onFinish, onFinish);
}
tab.WorldUpdateServerCommands._createGetWorldUpdateParams = function tab_WorldUpdateServerCommands$_createGetWorldUpdateParams() {
    var cmdParams = {};
    cmdParams['sheet'] = tsConfig.current_sheet_name;
    return cmdParams;
}


////////////////////////////////////////////////////////////////////////////////
// tab.PaneClientCommands

tab.PaneClientCommands = function tab_PaneClientCommands() {
}
tab.PaneClientCommands.setPanePrimitive = function tab_PaneClientCommands$setPanePrimitive(model, type) {
    var c = tab.CommandUtils.newDocCommand('set-primitive');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(model);
    c.commandParams['primitiveType'] = type;
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.getDefaultShapeType = function tab_PaneClientCommands$getDefaultShapeType(layer, callback) {
    var c = tab.CommandUtils.newDocCommand('get-default-shape');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'none', function(pm) {
        callback((_.isString(pm)) ? tab.ShapeModel.fromString(pm.toString()) : null);
    }, function() {
        callback(null);
    }));
}
tab.PaneClientCommands.setDefaultShapeType = function tab_PaneClientCommands$setDefaultShapeType(layer, shape) {
    var c = tab.CommandUtils.newDocCommand('set-default-shape');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['shapeName'] = tab.PaneClientCommands._shapeModelToString(shape);
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.toggleMarkLabels = function tab_PaneClientCommands$toggleMarkLabels(layer) {
    var c = tab.CommandUtils.newDocCommand('toggle-mark-labels');
    c.commandParams = {};
    c.commandParams['worksheet'] = tsConfig.current_sheet_name;
    if (ss.isValue(layer) && layer.get_id() > 0) {
        c.commandParams['paneSpec'] = layer.get_id().toString();
    }
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.setMarkSize = function tab_PaneClientCommands$setMarkSize(layer, newSize) {
    var c = tab.CommandUtils.newDocCommand('set-mark-size');
    c.commandParams = {};
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['markScale'] = newSize.toString();
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.resetTooltip = function tab_PaneClientCommands$resetTooltip(layer) {
    var c = tab.CommandUtils.newDocCommand('reset-tooltip');
    c.commandParams = {};
    c.commandParams['worksheet'] = tsConfig.current_sheet_name;
    if (ss.isValue(layer) && layer.get_id() > 0) {
        c.commandParams['paneSpec'] = layer.get_id().toString();
    }
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.getDefaultColor = function tab_PaneClientCommands$getDefaultColor(layer, callback) {
    var c = tab.CommandUtils.newDocCommand('get-default-color');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'none', function(pm) {
        callback((_.isString(pm)) ? tab.ColorModel.fromColorCode(pm.toString()) : null);
    }, function() {
        callback(null);
    }));
}
tab.PaneClientCommands.setDefaultColor = function tab_PaneClientCommands$setDefaultColor(layer, color) {
    var c = tab.CommandUtils.newDocCommand('set-default-color');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['defaultColor'] = color.toRgba255();
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.setSteppedColor = function tab_PaneClientCommands$setSteppedColor(layer, stepCount) {
    var c = tab.CommandUtils.newDocCommand('set-quantitative-color');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['steps'] = stepCount.toString();
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.reverseColor = function tab_PaneClientCommands$reverseColor(layer, newValue) {
    var c = tab.CommandUtils.newDocCommand('set-quantitative-color');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['isReversed'] = newValue.toString();
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.setQuantColorPalette = function tab_PaneClientCommands$setQuantColorPalette(layer, newPaletteName) {
    var c = tab.CommandUtils.newDocCommand('set-quantitative-color');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['paletteName'] = newPaletteName;
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.setCatColorPalette = function tab_PaneClientCommands$setCatColorPalette(layer, newPaletteName) {
    var c = tab.CommandUtils.newDocCommand('set-categorical-color');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['paletteName'] = newPaletteName;
    var isInstance = true;
    c.commandParams['isInstance'] = isInstance.toString();
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.setColorAlphaLevel = function tab_PaneClientCommands$setColorAlphaLevel(layer, newAlphaLevel) {
    if (isNaN(newAlphaLevel)) {
        return;
    }
    var c = tab.CommandUtils.newDocCommand('change-alpha-level');
    c.commandParams = tab.PaneClientCommands._createCommonPaneClientCommandParams(layer);
    c.commandParams['alphaLevel'] = newAlphaLevel.toString();
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands.boundingBoxPan = function tab_PaneClientCommands$boundingBoxPan(visualIdPresModel, mapRect) {
    var c = tab.CommandUtils.newDocCommand('bounding-box-pan');
    var commandParams = {};
    commandParams['mapLatLongRect'] = mapRect;
    c.commandParams = commandParams;
    if (ss.isValue(visualIdPresModel)) {
        tab.CommandUtils.addVisualIdToCommand(c.commandParams, visualIdPresModel);
    }
    tab.ServerCommands.executeServerCommand(c, 'afterDelay', null, null);
}
tab.PaneClientCommands.geographicSearchQuery = function tab_PaneClientCommands$geographicSearchQuery(visualIdPresModel, query, locale, maxResults, callback) {
    var c = tab.CommandUtils.newDocCommand('geographic-search-query');
    var commandParams = {};
    c.commandParams = commandParams;
    c.commandParams['geographicSearchSearchString'] = query;
    c.commandParams['geographicSearchLocale'] = locale;
    c.commandParams['geogreaphicSearchMaxResults'] = maxResults.toString();
    if (ss.isValue(visualIdPresModel)) {
        tab.CommandUtils.addVisualIdToCommand(c.commandParams, visualIdPresModel);
    }
    tab.ServerCommands.executeServerCommand(c, 'none', function(pm) {
        callback(pm);
    }, null);
}
tab.PaneClientCommands.setReferenceLineConstantValue = function tab_PaneClientCommands$setReferenceLineConstantValue(constantValue, refLineId) {
    var c = tab.CommandUtils.newDocCommand('set-reference-line-constant-value');
    c.commandParams = {};
    c.commandParams['constantValue'] = constantValue;
    c.commandParams['referenceLineId'] = refLineId;
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.PaneClientCommands._createCommonPaneClientCommandParams = function tab_PaneClientCommands$_createCommonPaneClientCommandParams(layer) {
    var commandParams = {};
    commandParams['worksheet'] = tsConfig.current_sheet_name;
    commandParams['paneSpec'] = layer.get_id().toString();
    return commandParams;
}
tab.PaneClientCommands._shapeModelToString = function tab_PaneClientCommands$_shapeModelToString(shape) {
    if (ss.isNullOrUndefined(shape)) {
        return null;
    }
    return shape.toString();
}


////////////////////////////////////////////////////////////////////////////////
// tab.SchemaClientCommands

tab.SchemaClientCommands = function tab_SchemaClientCommands() {
}
tab.SchemaClientCommands.addFieldToSheet = function tab_SchemaClientCommands$addFieldToSheet(fieldName, callback) {
    var c = {};
    c.commandNamespace = 'tabdoc';
    c.commandName = 'add-to-sheet';
    c.commandParams = {};
    c.commandParams['fn'] = fieldName;
    c.commandParams['worksheet'] = tsConfig.current_sheet_name;
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'immediately', function(pm) {
        callback();
    }, function(x) {
        callback();
    }));
}
tab.SchemaClientCommands._issueConversionCommand = function tab_SchemaClientCommands$_issueConversionCommand(commandName, fieldNames) {
    var c = tab.CommandUtils.newDocCommand(commandName);
    var cmdParams = {};
    c.commandParams = {};
    cmdParams['fieldVector'] = fieldNames;
    c.commandParams = cmdParams;
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', null, null));
}
tab.SchemaClientCommands.convertToMeasure = function tab_SchemaClientCommands$convertToMeasure(fieldNames) {
    tab.SchemaClientCommands._issueConversionCommand('convert-to-measure', fieldNames);
}
tab.SchemaClientCommands.convertToDimension = function tab_SchemaClientCommands$convertToDimension(fieldNames) {
    tab.SchemaClientCommands._issueConversionCommand('convert-to-dimension', fieldNames);
}
tab.SchemaClientCommands.requestSchemaContextMenu = function tab_SchemaClientCommands$requestSchemaContextMenu(dataSource, callback) {
    var c = tab.CommandUtils.newDocCommand('build-data-schema-context-menu');
    var cmdParams = {};
    cmdParams['datasource'] = dataSource.get_name();
    c.commandParams = cmdParams;
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'none', function(pm) {
        callback(pm);
    }, null));
}
tab.SchemaClientCommands.requestSchemaFieldContextMenu = function tab_SchemaClientCommands$requestSchemaFieldContextMenu(dataSource, field, callback) {
    var c = tab.CommandUtils.newDocCommand('build-data-schema-field-context-menu');
    var cmdParams = {};
    cmdParams['datasource'] = dataSource.get_name();
    cmdParams['fn'] = field;
    c.commandParams = cmdParams;
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'none', function(pm) {
        callback(pm);
    }, null));
}
tab.SchemaClientCommands.convertUnnamedFields = function tab_SchemaClientCommands$convertUnnamedFields(fieldNames) {
    var deferred = $.DeferredData();
    var cmdParams = {};
    cmdParams['fieldVector'] = fieldNames;
    var cmd = new tab._remoteClientCommand(tab.CommandUtils.newDocCommand('convert-unnamed-fields', cmdParams), 'immediately', tab.CommandController._deferredSuccessHandler(deferred), function() {
        deferred.reject();
    });
    tab.CommandController.SendCommand(cmd);
    return deferred.promise();
}


////////////////////////////////////////////////////////////////////////////////
// tab.SelectionClientCommands

tab.SelectionClientCommands = function tab_SelectionClientCommands() {
}
tab.SelectionClientCommands.get__log = function tab_SelectionClientCommands$get__log() {
    return tab.Logger.lazyGetLogger(tab.SelectionClientCommands);
}
tab.SelectionClientCommands.setActiveZone = function tab_SelectionClientCommands$setActiveZone(newActiveZoneID) {
    if (!tsConfig.allow_select) {
        return;
    }
    if (tab.ModelUtils.isActiveZone(newActiveZoneID)) {
        return;
    }
    tab.CommandController.SendCommand(tab.SelectionClientCommands.buildActiveZoneClientCommand(newActiveZoneID));
}
tab.SelectionClientCommands.buildActiveZoneClientCommand = function tab_SelectionClientCommands$buildActiveZoneClientCommand(newActiveZoneID) {
    var c = new tab.ClientCommand('none', function(t) {
        tab.SelectionClientCommands._setActiveZoneLocal(newActiveZoneID, t);
    }, tab.SelectionClientCommands._buildActiveZoneRemoteCommand(newActiveZoneID));
    return c;
}
tab.SelectionClientCommands.selectFields = function tab_SelectionClientCommands$selectFields(fieldNames, dataSourceName, callback) {
    var c = {};
    c.commandNamespace = 'tabdoc';
    c.commandName = 'get-show-me';
    var cmdParams = {};
    cmdParams['fieldVector'] = fieldNames;
    cmdParams['worksheet'] = tsConfig.current_sheet_name;
    cmdParams['datasource'] = dataSourceName;
    c.commandParams = cmdParams;
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, 'none', function(pm) {
        callback(pm);
    }, function(x) {
        callback(null);
    }));
}
tab.SelectionClientCommands.toggleLegendHighlight = function tab_SelectionClientCommands$toggleLegendHighlight(zoneId, visualId, regionPart, fieldNames, successCallback) {
    if (!tsConfig.allow_highlight) {
        return;
    }
    var cmdArray = [];
    if (!tab.ModelUtils.isActiveZone(zoneId)) {
        var zoneCmd = tab.SelectionClientCommands.buildActiveZoneClientCommand(zoneId);
        cmdArray.push(zoneCmd);
    }
    var cmdParams = {};
    cmdParams['r'] = regionPart;
    cmdParams['legendNames'] = fieldNames;
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'toggle-legend-server';
    cmd.commandParams = cmdParams;
    var successWrapper = function(model) {
        if (ss.isValue(successCallback)) {
            successCallback(model);
        }
    };
    var hilightCmd = new tab.ClientCommand('immediately', null, cmd, successWrapper, null);
    cmdArray.push(hilightCmd);
    var compositeCommand = new tab.CompositeClientCommand('immediately', cmdArray);
    tab.CommandController.SendCommand(compositeCommand);
}
tab.SelectionClientCommands.selectRegion = function tab_SelectionClientCommands$selectRegion(region, selRect, action, visualId, fieldNames) {
    if (!tsConfig.allow_select) {
        return;
    }
    var cmd = {};
    cmd.commandNamespace = 'tabsrv';
    cmd.commandName = 'select-region-no-return-server';
    cmd.commandParams = tab.SelectionClientCommands._createSelectRegionParams(selRect, region, action, visualId, fieldNames);
    tab.ServerCommands.executeServerCommand(cmd, 'afterDelay');
}
tab.SelectionClientCommands.selectRectRegionAndDoUbertip = function tab_SelectionClientCommands$selectRectRegionAndDoUbertip(region, selRect, action, visualId, tooltipCallback) {
    if (!tsConfig.allow_select) {
        return;
    }
    var cmd = {};
    cmd.commandName = 'select-region-no-return-server';
    cmd.commandParams = tab.SelectionClientCommands._createSelectRegionParams(selRect, region, action, visualId);
    tab.SelectionClientCommands._selectRegionAndDoUbertip(tooltipCallback, cmd);
}
tab.SelectionClientCommands.selectCircleRegionAndDoUbertip = function tab_SelectionClientCommands$selectCircleRegionAndDoUbertip(region, selRect, selCircle, action, visualId, tooltipCallback) {
    if (!tsConfig.allow_select) {
        return;
    }
    var cmd = {};
    cmd.commandName = 'select-radial-region-no-return-server';
    var cmdParams = tab.SelectionClientCommands._createSelectRegionParams(selRect, region, action, visualId);
    var circlePresModel = {};
    circlePresModel.center = {};
    circlePresModel.center.x = Math.round(selCircle.center.x);
    circlePresModel.center.y = Math.round(selCircle.center.y);
    circlePresModel.radius = Math.round(selCircle.radius);
    cmdParams['radialSelection'] = circlePresModel;
    cmd.commandParams = cmdParams;
    tab.SelectionClientCommands._selectRegionAndDoUbertip(tooltipCallback, cmd);
}
tab.SelectionClientCommands.selectPolyRegionAndDoUbertip = function tab_SelectionClientCommands$selectPolyRegionAndDoUbertip(region, selRect, selPoints, action, visualId, tooltipCallback) {
    if (!tsConfig.allow_select) {
        return;
    }
    var cmd = {};
    cmd.commandName = 'select-lasso-region-no-return-server';
    var cmdParams = tab.SelectionClientCommands._createSelectRegionParams(selRect, region, action, visualId);
    var numPoints = selPoints.length;
    var pointsPresModel = new Array(numPoints);
    for (var i = 0; i < numPoints; i++) {
        var pointPresModel = {};
        pointPresModel.x = Math.round(selPoints[i].x);
        pointPresModel.y = Math.round(selPoints[i].y);
        pointsPresModel[i] = pointPresModel;
    }
    cmdParams['lassoSelection'] = pointsPresModel;
    cmd.commandParams = cmdParams;
    tab.SelectionClientCommands._selectRegionAndDoUbertip(tooltipCallback, cmd);
}
tab.SelectionClientCommands._selectRegionAndDoUbertip = function tab_SelectionClientCommands$_selectRegionAndDoUbertip(tooltipCallback, cmd) {
    cmd.commandNamespace = 'tabsrv';
    var selectCmd = new tab.ClientCommand('afterDelay', null, cmd, function(pm) {
        tooltipCallback();
    }, null);
    var cmdArray = [];
    cmdArray.push(selectCmd);
    var compositeCommand = new tab.CompositeClientCommand('afterDelay', cmdArray);
    tab.CommandController.SendCommand(compositeCommand);
}
tab.SelectionClientCommands.clearAllSelections = function tab_SelectionClientCommands$clearAllSelections(visualId) {
    if (!tsConfig.allow_select) {
        return;
    }
    var zoneId = tab.ModelUtils.getZoneIdForSheetName(visualId.worksheet);
    if (zoneId !== -1 && !tab.ModelUtils.isActiveZone(zoneId)) {
        tab.SelectionClientCommands.setActiveZone(zoneId);
        return;
    }
    var cmd = tab.CommandUtils.newSrvCommand('select-none');
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    cmd.commandParams = cmdParams;
    var c = new tab.ClientCommand(((tab.ApplicationModel.get_instance().get_isLocalRenderMode()) ? 'none' : 'afterDelay'), function(t) {
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            tab.SelectionClientCommands._clearAllButMasterSelection(t, null);
            tab.ActionUtils.executeActions(visualId.worksheet, 'on-select', new Array(0), t, true);
        }
    }, cmd);
    tab.CommandController.SendCommand(c);
}
tab.SelectionClientCommands.clearAllSelectionsIncludingMaster = function tab_SelectionClientCommands$clearAllSelectionsIncludingMaster() {
    if (!tsConfig.allow_select) {
        return;
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'select-none-including-master';
    cmd.commandParams = {};
    cmd.commandParams['sheet'] = tsConfig.current_sheet_name;
    var c = new tab.ClientCommand(((tab.ApplicationModel.get_instance().get_isLocalRenderMode()) ? 'none' : 'afterDelay'), function(t) {
        tab.SelectionClientCommands._clearAllIncludingMasterSelection(t);
        tab.SelectionClientCommands._clearAllBrushing(t);
        var vms = tab.ModelUtils.getVisualModelsFromDashboard(tab.ModelUtils.findContentDashboard());
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(vms));
        while ($enum1.moveNext()) {
            var sheet = $enum1.current;
            var vm = vms[sheet];
            tab.ActionUtils.executeActions(vm.get_visualId().worksheet, 'on-select', new Array(0), t, true);
        }
    }, cmd);
    tab.CommandController.SendCommand(c);
}
tab.SelectionClientCommands.selectLegendItemsLocal = function tab_SelectionClientCommands$selectLegendItemsLocal(zoneId, action, selectedItems, visualId, model, type) {
    if (!tsConfig.allow_select) {
        return;
    }
    var vm = tab.ModelUtils.getVisualModelFromVisualId(visualId);
    var selectionsModel = vm.get_selectionsModel();
    var legendSelection = selectionsModel.getLegendSelection(type, model.get_legendNames());
    var selectedObjectIds = tab.SelectionUtils.resolveLegendSelection(action, selectedItems, model, legendSelection);
    var cmdArray = [];
    if (!legendSelection.isAnyLegendItemSelected() && !selectedObjectIds.length && !tab.ModelUtils.isActiveZone(zoneId)) {
        cmdArray.push(tab.SelectionClientCommands.buildActiveZoneClientCommand(zoneId));
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'select-legend-items';
    cmd.commandParams = tab.SelectionClientCommands._createLegendSelectionParams(selectedObjectIds, visualId, model, type, zoneId);
    var selectCmd = new tab.ClientCommand('none', function(t) {
        tab.SelectionClientCommands._setActiveZoneLocal(zoneId, t);
        if (!legendSelection.isAnyLegendItemSelected() && !selectedObjectIds.length) {
            return;
        }
        var selection = t.makeMutablePresModel(legendSelection);
        selection.objectIds = selectedObjectIds;
        selection.legendSelectionInfo = {};
        selection.legendSelectionInfo.legendType = model.get_legendType();
        selection.legendSelectionInfo.legendColumns = model.get_legendNames();
        tab.SelectionClientCommands._clearSelection(t, selectionsModel.get_tupleSelection(), vm);
        tab.SelectionClientCommands._clearSelection(t, selectionsModel.get_nodeSelection(), vm);
        var $enum1 = ss.IEnumerator.getEnumerator(selectionsModel.get_allLegendSelections());
        while ($enum1.moveNext()) {
            var legendSelectionModel = $enum1.current;
            if (legendSelectionModel !== legendSelection) {
                tab.SelectionClientCommands._clearSelection(t, legendSelectionModel, vm);
            }
        }
        tab.SelectionClientCommands._clearAllButMasterSelection(t, visualId);
        tab.SelectionClientCommands._updateBrushingForLegendSelection(selectedObjectIds, model, vm, t);
    }, cmd);
    cmdArray.push(selectCmd);
    var compositeCmd = new tab.CompositeClientCommand('none', cmdArray);
    tab.CommandController.SendCommand(compositeCmd);
}
tab.SelectionClientCommands._buildSelectNodeCommand = function tab_SelectionClientCommands$_buildSelectNodeCommand(region, coords, action, visualListModel, selectedNode, visualId, tooltipCallback) {
    var zoneId = tab.ModelUtils.getZoneIdForSheetName(visualId.worksheet);
    var vm = tab.ModelUtils.getVisualModelFromVisualId(visualId);
    var selectionsModel = vm.get_selectionsModel();
    var nodeSelection = selectionsModel.get_nodeSelection();
    var commandBlockingOption = (tab.ActionUtils.willActionCauseTabChange(visualId.worksheet, 'on-select')) ? 'afterDelay' : 'none';
    var cmdArray = [];
    if (zoneId !== -1 && !tab.ModelUtils.isActiveZone(zoneId)) {
        var zoneCmd = tab.SelectionClientCommands.buildActiveZoneClientCommand(zoneId);
        cmdArray.push(zoneCmd);
    }
    var cmd = tab.CommandUtils.newSrvCommand('select-region-no-return-server');
    var NodeMarginSize = 2;
    var extents = null;
    if (ss.isValue(selectedNode.extentsWidth) && ss.isValue(selectedNode.extentsHeight)) {
        var x = (selectedNode.extentsX || 0);
        var y = (selectedNode.extentsY || 0);
        extents = tab.$create_RectXY(x, y, selectedNode.extentsWidth, selectedNode.extentsHeight);
    }
    var shiftedCoords = tab.RectXYUtil.shiftCoordsTowardsCenter(coords, extents, NodeMarginSize);
    var selRect = tab.$create_RectXY(shiftedCoords.x, shiftedCoords.y, 0, 0);
    cmd.commandParams = tab.SelectionClientCommands._createSelectRegionParams(selRect, region, action, visualId);
    var selectCommand = new tab.ClientCommand(commandBlockingOption, function(t) {
        var newSelection = t.makeMutablePresModel(nodeSelection);
        tab.SelectionUtils.resolveNodeSelection(action, visualListModel.get_groupItemNodes(), selectedNode, nodeSelection, newSelection);
        var discardTupleSelections = action !== 'toggle' && action !== 'range';
        var selectedTuples = selectionsModel.get_tupleSelection().get_ids();
        if (discardTupleSelections) {
            tab.SelectionClientCommands._clearSelection(t, selectionsModel.get_tupleSelection(), vm);
            selectedTuples = new Array(0);
        }
        var $enum1 = ss.IEnumerator.getEnumerator(selectionsModel.get_allLegendSelections());
        while ($enum1.moveNext()) {
            var legendSelection = $enum1.current;
            tab.SelectionClientCommands._clearSelection(t, legendSelection, vm);
        }
        tab.SelectionClientCommands._clearAllButMasterSelection(t, visualId);
        vm._handleImpliedSelection(newSelection.selectedNodes);
        tab.ActionUtils.executeActions(visualId.worksheet, 'on-select', vm.getEffectiveSelectedTuples(selectedTuples), t, true);
    }, cmd, function(pm) {
        if (ss.isValue(tooltipCallback)) {
            tooltipCallback();
        }
    }, null);
    cmdArray.push(selectCommand);
    var compositeCmd = new tab.CompositeClientCommand(commandBlockingOption, cmdArray);
    return compositeCmd;
}
tab.SelectionClientCommands.selectNode = function tab_SelectionClientCommands$selectNode(region, coords, action, visualListModel, selectedNode, visualId, tooltipCallback) {
    if (!tsConfig.allow_select) {
        return;
    }
    tab.SelectionClientCommands.get__log().debug('SelectNode: %o. %s', selectedNode, visualId.worksheet);
    var cmd = tab.SelectionClientCommands._buildSelectNodeCommand(region, coords, action, visualListModel, selectedNode, visualId, tooltipCallback);
    tab.CommandController.SendCommand(cmd);
}
tab.SelectionClientCommands.selectMarksLocal = function tab_SelectionClientCommands$selectMarksLocal(selectedMarkIDs, visualId, action, isAreaSelection, tooltipCallback) {
    if (!tsConfig.allow_select) {
        return;
    }
    if (tab.MiscUtil.isNullOrEmpty(selectedMarkIDs)) {
        tab.SelectionClientCommands.clearAllSelections(visualId);
        return;
    }
    tab.SelectionClientCommands.get__log().debug('SelectMarksLocal: %o. %s', selectedMarkIDs, visualId.worksheet);
    var zoneId = tab.ModelUtils.getZoneIdForSheetName(visualId.worksheet);
    var vm = tab.ModelUtils.getVisualModelFromVisualId(visualId);
    var selectionsModel = vm.get_selectionsModel();
    var tupleSelection = selectionsModel.get_tupleSelection();
    var commandBlockingOption = (tab.ActionUtils.willActionCauseTabChange(visualId.worksheet, 'on-select')) ? 'afterDelay' : 'none';
    var cmdArray = [];
    if (zoneId !== -1 && !tab.ModelUtils.isActiveZone(zoneId)) {
        var zoneCmd = tab.SelectionClientCommands.buildActiveZoneClientCommand(zoneId);
        cmdArray.push(zoneCmd);
    }
    var cmd = {};
    cmd.commandNamespace = 'tabdoc';
    cmd.commandName = 'select';
    cmd.commandParams = tab.SelectionClientCommands._createSelectionParams(selectedMarkIDs, 'tuples', action, visualId);
    var selectCommand = new tab.ClientCommand(commandBlockingOption, function(t) {
        var selectedObjectIds = tab.SelectionUtils.resolveMarkSelection(action, selectedMarkIDs, tupleSelection, isAreaSelection);
        var newSelection = t.makeMutablePresModel(tupleSelection);
        newSelection.objectIds = selectedObjectIds;
        if (action !== 'toggle' && action !== 'range') {
            tab.SelectionClientCommands._clearSelection(t, selectionsModel.get_nodeSelection(), vm);
        }
        var $enum1 = ss.IEnumerator.getEnumerator(selectionsModel.get_allLegendSelections());
        while ($enum1.moveNext()) {
            var legendSelection = $enum1.current;
            tab.SelectionClientCommands._clearSelection(t, legendSelection, vm);
        }
        tab.SelectionClientCommands._clearAllButMasterSelection(t, visualId);
        tab.ActionUtils.executeActions(visualId.worksheet, 'on-select', vm.getEffectiveSelectedTuples(selectedObjectIds), t, true);
    }, cmd, function(pm) {
        if (ss.isValue(tooltipCallback)) {
            tooltipCallback();
        }
    }, null);
    cmdArray.push(selectCommand);
    var compositeCommand = new tab.CompositeClientCommand(commandBlockingOption, cmdArray);
    tab.CommandController.SendCommand(compositeCommand);
}
tab.SelectionClientCommands._updateBrushingFromComputedResults = function tab_SelectionClientCommands$_updateBrushingFromComputedResults(brushingComputer, t) {
    if (!brushingComputer.get_isBrushingComputed()) {
        return;
    }
    var $dict1 = tab.ModelUtils.getVisualModels(tab.ApplicationModel.get_instance());
    for (var $key2 in $dict1) {
        var vizPair = { key: $key2, value: $dict1[$key2] };
        var targetVm = vizPair.value;
        var worksheet = vizPair.key;
        if (brushingComputer.hasBrushingForSheet(worksheet)) {
            var tuplePm = t.makeMutablePresModel(targetVm.get_brushingsModel().get_tupleSelection());
            tuplePm.objectIds = brushingComputer.getTupleBrushing(worksheet);
            var nodePm = t.makeMutablePresModel(targetVm.get_brushingsModel().get_nodeSelection());
            nodePm.selectedNodes = brushingComputer.getNodeBrushing(worksheet);
            var worksheetLegendBrushing = brushingComputer.getLegendBrushing(worksheet);
            var $enum3 = ss.IEnumerator.getEnumerator(targetVm.get_brushingsModel().get_allLegendSelections());
            while ($enum3.moveNext()) {
                var origLegendBrushingModel = $enum3.current;
                var legendPM = t.makeMutablePresModel(origLegendBrushingModel);
                var objectIds = new Array(0);
                var legendKey = tab.BrushingComputer._calculateLegendKey(legendPM.legendSelectionInfo.legendType, legendPM.legendSelectionInfo.legendColumns);
                if (ss.isValue(worksheetLegendBrushing[legendKey])) {
                    objectIds = worksheetLegendBrushing[legendKey];
                }
                legendPM.objectIds = objectIds;
            }
        }
    }
}
tab.SelectionClientCommands._clearAllBrushing = function tab_SelectionClientCommands$_clearAllBrushing(t) {
    var $dict1 = tab.ModelUtils.getVisualModels(tab.ApplicationModel.get_instance());
    for (var $key2 in $dict1) {
        var vizPair = { key: $key2, value: $dict1[$key2] };
        var targetVm = vizPair.value;
        var tuplePm = t.makeMutablePresModel(targetVm.get_brushingsModel().get_tupleSelection());
        tuplePm.objectIds = new Array(0);
        var nodePm = t.makeMutablePresModel(targetVm.get_brushingsModel().get_nodeSelection());
        nodePm.selectedNodes = new Array(0);
        var $enum3 = ss.IEnumerator.getEnumerator(targetVm.get_brushingsModel().get_allLegendSelections());
        while ($enum3.moveNext()) {
            var origLegendBrushingModel = $enum3.current;
            var legendPM = t.makeMutablePresModel(origLegendBrushingModel);
            var objectIds = new Array(0);
            legendPM.objectIds = objectIds;
        }
    }
}
tab.SelectionClientCommands._buildActiveZoneRemoteCommand = function tab_SelectionClientCommands$_buildActiveZoneRemoteCommand(newActiveZoneID) {
    var cmd = tab.CommandUtils.newDocCommand('set-active-zone');
    var cmdParams = {};
    cmdParams['dashboard'] = tsConfig.current_sheet_name;
    cmdParams['zoneId'] = newActiveZoneID;
    cmd.commandParams = cmdParams;
    return cmd;
}
tab.SelectionClientCommands._updateBrushingForLegendSelection = function tab_SelectionClientCommands$_updateBrushingForLegendSelection(selectedItemsIds, model, legendViz, t) {
    var brushingComputer = tab.BrushingComputer.computeFromLegend(legendViz, selectedItemsIds, model);
    tab.SelectionClientCommands._updateBrushingFromComputedResults(brushingComputer, t);
}
tab.SelectionClientCommands._clearAllButMasterSelection = function tab_SelectionClientCommands$_clearAllButMasterSelection(t, visualIdWhereSelectionHappened) {
    var visualModels = tab.ModelUtils.getVisualModels(tab.ApplicationModel.get_instance());
    var $dict1 = visualModels;
    for (var $key2 in $dict1) {
        var vm = { key: $key2, value: $dict1[$key2] };
        var visualModel = vm.value;
        var worksheetName = vm.key;
        if (ss.isNullOrUndefined(visualIdWhereSelectionHappened) || worksheetName !== visualIdWhereSelectionHappened.worksheet) {
            var dashboardModel = tab.ModelUtils.findContentDashboard();
            var clearAllSelections = !tab.ActionUtils.isFilterSource(dashboardModel, worksheetName);
            var $enum3 = ss.IEnumerator.getEnumerator(visualModel.get_selectionsModel().get_selectionModels());
            while ($enum3.moveNext()) {
                var selectionModel = $enum3.current;
                if (clearAllSelections || (selectionModel.get_selectionType() !== 'tuples' && selectionModel.get_selectionType() !== 'nodes')) {
                    var selection = t.makeMutablePresModel(selectionModel);
                    selection.objectIds = new Array(0);
                    selection.selectedNodes = new Array(0);
                    selectionModel.setOverriddenTupleIds(new Array(0));
                }
            }
        }
    }
}
tab.SelectionClientCommands._clearAllIncludingMasterSelection = function tab_SelectionClientCommands$_clearAllIncludingMasterSelection(t) {
    var visualModels = tab.ModelUtils.getVisualModels(tab.ApplicationModel.get_instance());
    var $dict1 = visualModels;
    for (var $key2 in $dict1) {
        var vm = { key: $key2, value: $dict1[$key2] };
        var visualModel = vm.value;
        var $enum3 = ss.IEnumerator.getEnumerator(visualModel.get_selectionsModel().get_selectionModels());
        while ($enum3.moveNext()) {
            var selectionModel = $enum3.current;
            var selection = t.makeMutablePresModel(selectionModel);
            selection.objectIds = new Array(0);
            selection.selectedNodes = new Array(0);
            selectionModel.setOverriddenTupleIds(new Array(0));
        }
    }
}
tab.SelectionClientCommands._createSelectRegionParams = function tab_SelectionClientCommands$_createSelectRegionParams(selRect, region, action, visualId, fieldNames) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    var vizRegionRect = {};
    var regionWrapper = tab.VizRegionRectWrapper.create(vizRegionRect);
    regionWrapper.set_x(Math.round(selRect.x));
    regionWrapper.set_y(Math.round(selRect.y));
    regionWrapper.set_w(Math.round((selRect.w || 0)));
    regionWrapper.set_h(Math.round((selRect.h || 0)));
    regionWrapper.set_r(region);
    if (ss.isValue(fieldNames)) {
        regionWrapper.set_fns(fieldNames);
    }
    cmdParams['vizRegionRect'] = vizRegionRect;
    cmdParams['mouseAction'] = action;
    return cmdParams;
}
tab.SelectionClientCommands._createLegendSelectionParams = function tab_SelectionClientCommands$_createLegendSelectionParams(markIDs, visualId, legend, legendType, zoneId) {
    var cmdParams = {};
    tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    cmdParams['legendNames'] = legend.get_legendNames();
    cmdParams['legendType'] = legendType;
    cmdParams['objectIds'] = markIDs;
    cmdParams['zoneId'] = zoneId;
    return cmdParams;
}
tab.SelectionClientCommands._clearSelection = function tab_SelectionClientCommands$_clearSelection(t, sel, vm) {
    if (ss.isValue(sel)) {
        var marksSelection = t.makeMutablePresModel(sel);
        marksSelection.objectIds = new Array(0);
        marksSelection.selectedNodes = new Array(0);
        if (sel.get_selectionType() === 'nodes') {
            vm._clearImpliedSelection();
        }
    }
}
tab.SelectionClientCommands._createSelectionParams = function tab_SelectionClientCommands$_createSelectionParams(markIDs, type, action, visualId) {
    var cmdParams = {};
    if (ss.isValue(visualId)) {
        tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
    }
    var pm = {};
    pm.objectIds = markIDs;
    pm.selectionType = type;
    cmdParams['selection'] = pm;
    cmdParams['selectOptions'] = tab.SelectionClientCommands._selectActionToOptionsMapping[action];
    return cmdParams;
}
tab.SelectionClientCommands._setActiveZoneLocal = function tab_SelectionClientCommands$_setActiveZoneLocal(newActiveZoneID, t) {
    var dashModel = tab.ModelUtils.findContentDashboard();
    var dashboardPM = t.makeMutablePresModel(dashModel);
    dashboardPM.activeZoneId = newActiveZoneID;
}
tab.SelectionClientCommands.buildActiveZoneCommand = function tab_SelectionClientCommands$buildActiveZoneCommand(newActiveZoneID) {
    var cmd = tab.CommandUtils.newDocCommand('set-active-zone');
    var cmdParams = {};
    cmdParams['dashboardPm'] = tab.ModelUtils.findContentDashboard().get_sheetPath();
    cmdParams['zoneId'] = newActiveZoneID;
    cmd.commandParams = cmdParams;
    return cmd;
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfClientCommands

tab.ShelfClientCommands = function tab_ShelfClientCommands() {
}
tab.ShelfClientCommands.setItemEncodingType = function tab_ShelfClientCommands$setItemEncodingType(sm, pm, et) {
    var c = {};
    c.commandNamespace = 'tabdoc';
    c.commandName = 'set-item-encoding-type';
    c.commandParams = {};
    tab.CommandUtils.addVisualIdToCommand(c.commandParams, tab.ShelfClientCommands._getVisualIdForCurrentContext());
    c.commandParams['paneSpec'] = sm.get_paneId().toString();
    c.commandParams['position'] = sm.get_pills().indexOf(pm).toString();
    c.commandParams['encodingType'] = et;
    c.commandParams['shelfType'] = sm.get_shelfType();
    tab.ServerCommands.executeServerCommand(c, 'immediately');
}
tab.ShelfClientCommands.startDrag = function tab_ShelfClientCommands$startDrag(f, t, activePaneSpecId) {
    var deferred = $.DeferredData();
    var c = {};
    c.commandNamespace = 'tabdoc';
    c.commandName = 'get-drag-pres-model';
    c.commandParams = {};
    c.commandParams['worksheet'] = tsConfig.current_sheet_name;
    c.commandParams['isRightDrag'] = tab.JsonUtil.toJson(false);
    if (ss.isValue(activePaneSpecId)) {
        c.commandParams['paneSpec'] = tab.JsonUtil.toJson(activePaneSpecId);
    }
    tab.ShelfClientCommands._createFieldEncodingPM(c.commandParams, f, t);
    tab.ServerCommands.executeServerCommand(c, 'none', tab.CommandController._deferredSuccessHandler(deferred), function() {
        deferred.reject();
    });
    return deferred;
}
tab.ShelfClientCommands.drillOnPill = function tab_ShelfClientCommands$drillOnPill(shelf, p, index) {
    var c = {};
    c.commandName = 'level-drill';
    c.commandNamespace = 'tabdoc';
    c.commandParams = {};
    c.commandParams['worksheet'] = tsConfig.current_sheet_name;
    c.commandParams['shelfType'] = shelf.get_shelfType();
    c.commandParams['position'] = index.toString();
    c.commandParams['drillDown'] = tab.JsonUtil.toJson(p.get_shouldDrill());
    if (shelf.get_shelfType() === 'encoding-shelf') {
        c.commandParams['paneSpec'] = shelf.get_paneId().toString();
    }
    var cc = new tab.ClientCommand('immediately', function(t) {
        var shelfPm = t.makeMutablePresModel(shelf);
        var itemPm = t.makeMutablePresModel(p);
        itemPm.shouldDrill = !p.get_shouldDrill();
        if (p.get_shouldDrill()) {
            var ds = tab.ApplicationModel.get_instance().get_workbook().get_dataSchema();
            var source = ds.dataSourceForField(p.get_column());
            var dropPos = {};
            dropPos.shelfType = 'encoding-shelf';
            dropPos.shelfDropAction = 'insert';
            dropPos.encodingType = p.get_encodingType();
            dropPos.isOverride = true;
            if (ss.isValue(source)) {
                var nextLevels = source.findColumnDrillChain(p.get_column());
                if (ss.isValue(nextLevels) && nextLevels.length > 0) {
                    var nextLevel = nextLevels[0];
                    var newShelfItem = {};
                    newShelfItem.fn = nextLevel.get_globalName();
                    newShelfItem.displayText = nextLevel.get_description();
                    newShelfItem.hasDrill = false;
                    dropPos.shelfPosIndex = index + 1;
                    tab.ShelfClientCommands._addShelfItem(shelfPm, newShelfItem, dropPos, 0);
                }
            }
        }
        else {
            for (var i = shelf.get_pills().indexOf(p) + 1; i < shelf.get_pills().length; i++) {
                var currPill = shelf.get_pills()[i];
                tab.ShelfClientCommands._removeShelfItem(shelfPm, currPill.get_item());
                if (!currPill.get_hasDrill()) {
                    break;
                }
            }
        }
    }, c);
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.removeShelfPill = function tab_ShelfClientCommands$removeShelfPill(shelf, p) {
    var command = tab.ShelfClientCommands._createDropOnShelfCommand();
    command.commandName = 'drop-nowhere';
    var cmdParams = command.commandParams;
    cmdParams['paneSpec'] = shelf.get_paneId();
    cmdParams['dragDescription'] = shelf.get_shelfType();
    tab.ShelfClientCommands._setFieldEncoding(cmdParams, p.get_column(), p.get_encodingType());
    cmdParams['shelfSelection'] = [ p.get_item().shelfItemId ];
    cmdParams['dragSource'] = 'drag-drop-viz';
    var dragPos = cmdParams['shelfDragSourcePosition'];
    dragPos.shelfType = shelf.get_shelfType();
    dragPos.shelfPosIndex = shelf.get_pills().indexOf(p);
    dragPos.shelfDropAction = 'replace';
    var cc = new tab.ClientCommand('immediately', function(t) {
        tab.ShelfClientCommands._removeShelfItem(t.makeMutablePresModel(shelf), p.get_item());
    }, command);
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.replaceShelfPill = function tab_ShelfClientCommands$replaceShelfPill(srcShelf, src, targetShelf, target, dropPos, isRightDrop) {
    var srcIndex = srcShelf.get_pills().indexOf(src);
    var targetIndex = dropPos.shelfPosIndex;
    var command = tab.ShelfClientCommands._createDropOnShelfCommand();
    var cmdParams = command.commandParams;
    tab.ShelfClientCommands._setFieldEncoding(cmdParams, src.get_column(), src.get_encodingType());
    cmdParams['shelfSelection'] = [ src.get_item().shelfItemId ];
    cmdParams['dragSource'] = 'drag-drop-viz';
    var dragPos = cmdParams['shelfDragSourcePosition'];
    dragPos.shelfType = srcShelf.get_shelfType();
    dragPos.shelfPosIndex = srcIndex;
    dragPos.shelfDropAction = 'replace';
    cmdParams['paneSpec'] = targetShelf.get_paneId();
    cmdParams['dropTarget'] = 'drag-drop-viz';
    if (ss.isNullOrUndefined(dropPos)) {
        dropPos = cmdParams['shelfDropTargetPosition'];
        dropPos.shelfType = targetShelf.get_shelfType();
        dropPos.shelfPosIndex = targetIndex;
        dropPos.encodingType = target.get_encodingType();
        dropPos.shelfDropAction = 'replace';
    }
    else {
        cmdParams['shelfDropTargetPosition'] = dropPos;
    }
    if (isRightDrop) {
        cmdParams['isCopy'] = tab.JsonUtil.toJson(true);
    }
    var cc = new tab._shelfDropClientCommand(function(t) {
        if (!isRightDrop) {
            var shelfPm = t.makeMutablePresModel(srcShelf);
            tab.ShelfClientCommands._removeShelfItem(shelfPm, src.get_item());
        }
        var targetShelfPm = t.makeMutablePresModel(targetShelf);
        tab.ShelfClientCommands._removeShelfItem(targetShelfPm, target.get_item());
        var newItem = {};
        newItem.displayText = src.get_item().displayText;
        newItem.fn = src.get_item().fn;
        newItem.encodingType = target.get_encodingType();
        newItem.encodingUiItems = target.get_item().encodingUiItems;
        tab.ShelfClientCommands._addShelfItem(targetShelfPm, newItem, dropPos, 0);
    }, command, targetShelf.get_shelfType());
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.moveShelfPill = function tab_ShelfClientCommands$moveShelfPill(srcShelf, targetShelf, p, dropPos, isRightDrop) {
    var command = tab.ShelfClientCommands._createDropOnShelfCommand();
    var cmdParams = command.commandParams;
    cmdParams['shelfSelection'] = [ p.get_item().shelfItemId ];
    tab.ShelfClientCommands._setFieldEncoding(cmdParams, p.get_column(), p.get_encodingType());
    if (isRightDrop) {
        cmdParams['isCopy'] = tab.JsonUtil.toJson(true);
    }
    cmdParams['dragSource'] = 'drag-drop-viz';
    var dragPos = cmdParams['shelfDragSourcePosition'];
    dragPos.shelfType = srcShelf.get_shelfType();
    dragPos.shelfPosIndex = srcShelf.get_pills().indexOf(p);
    dragPos.shelfDropAction = 'replace';
    if (ss.isNullOrUndefined(dropPos)) {
        dropPos = cmdParams['shelfDropTargetPosition'];
        dropPos.shelfType = targetShelf.get_shelfType();
        dropPos.shelfPosIndex = 0;
        dropPos.shelfDropAction = (srcShelf === targetShelf) ? 'swap' : 'insert';
    }
    cmdParams['dropTarget'] = 'drag-drop-viz';
    cmdParams['paneSpec'] = targetShelf.get_paneId();
    cmdParams['shelfDropTargetPosition'] = dropPos;
    var cc = new tab._shelfDropClientCommand(function(t) {
        var newItem = {};
        newItem.displayText = p.get_item().displayText;
        newItem.fn = p.get_item().fn;
        newItem.encodingType = dropPos.encodingType;
        var targetPm = t.makeMutablePresModel(targetShelf);
        tab.ShelfClientCommands._addShelfItem(targetPm, newItem, dropPos, 0);
        if (!isRightDrop) {
            var srcPm = t.makeMutablePresModel(srcShelf);
            tab.ShelfClientCommands._removeShelfItem(srcPm, p.get_item());
        }
    }, command, targetShelf.get_shelfType());
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.movePillToEncoding = function tab_ShelfClientCommands$movePillToEncoding(srcShelf, encodingShelf, type, p, isRightDrop, dropPos) {
    var command = tab.ShelfClientCommands._createDropOnShelfCommand();
    var cmdParams = command.commandParams;
    cmdParams['shelfSelection'] = [ p.get_item().shelfItemId ];
    cmdParams['dragSource'] = 'drag-drop-viz';
    var dragPos = cmdParams['shelfDragSourcePosition'];
    dragPos.shelfType = srcShelf.get_shelfType();
    dragPos.shelfPosIndex = srcShelf.get_pills().indexOf(p);
    dragPos.encodingType = p.get_encodingType();
    dragPos.shelfDropAction = 'replace';
    dragPos.isOverride = false;
    tab.ShelfClientCommands._setFieldEncoding(cmdParams, p.get_column(), p.get_encodingType());
    if (isRightDrop) {
        cmdParams['isCopy'] = tab.JsonUtil.toJson(true);
    }
    if (ss.isNullOrUndefined(dropPos)) {
        dropPos = cmdParams['shelfDropTargetPosition'];
        dropPos.shelfType = 'encoding-shelf';
        dropPos.shelfPosIndex = 0;
        dropPos.shelfDropAction = 'insert';
        dropPos.encodingType = type;
        dropPos.isOverride = true;
    }
    cmdParams['dropTarget'] = 'drag-drop-viz';
    cmdParams['paneSpec'] = encodingShelf.get_paneId();
    cmdParams['shelfDropTargetPosition'] = tab.JsonUtil.toJson(dropPos);
    var cc = new tab._shelfDropClientCommand(function(t) {
        var shelfPm = t.makeMutablePresModel(srcShelf);
        if (!isRightDrop) {
            tab.ShelfClientCommands._removeShelfItem(shelfPm, p.get_item());
        }
        var newItem = {};
        newItem.displayText = p.get_column().get_description();
        newItem.fn = p.get_column().get_globalName();
        newItem.encodingType = type;
        newItem.encodingUiItems = p.get_item().encodingUiItems;
        tab.ShelfClientCommands._addShelfItem(shelfPm, newItem, dropPos, 0);
    }, command, encodingShelf.get_shelfType());
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.addEncodingFields = function tab_ShelfClientCommands$addEncodingFields(encodingShelf, type, fieldColumns, dropPos, isShiftDrop) {
    var command = tab.ShelfClientCommands._createDropOnShelfCommand();
    var cmdParams = command.commandParams;
    if (ss.isNullOrUndefined(dropPos)) {
        dropPos = cmdParams['shelfDropTargetPosition'];
        dropPos.shelfType = 'encoding-shelf';
        dropPos.shelfPosIndex = 0;
        dropPos.shelfDropAction = 'insert';
        dropPos.encodingType = type;
    }
    if (isShiftDrop) {
        cmdParams['isShiftDrag'] = tab.JsonUtil.toJson(true);
    }
    tab.ShelfClientCommands._createFieldEncodingPM(cmdParams, fieldColumns, 'invalid-encoding');
    cmdParams['paneSpec'] = encodingShelf.get_paneId();
    cmdParams['dragSource'] = 'drag-drop-schema';
    cmdParams['dropTarget'] = 'drag-drop-viz';
    cmdParams['shelfDropTargetPosition'] = tab.JsonUtil.toJson(dropPos);
    var cc = new tab._shelfDropClientCommand(function(t) {
        var shelfPm = t.makeMutablePresModel(encodingShelf);
        var $enum1 = ss.IEnumerator.getEnumerator(fieldColumns);
        while ($enum1.moveNext()) {
            var fieldColumn = $enum1.current;
            var newItem = {};
            newItem.displayText = fieldColumn.get_description();
            newItem.fn = fieldColumn.get_globalName();
            newItem.encodingType = type;
            newItem.encodingUiItems = [ {} ];
            newItem.encodingUiItems[0].isVisible = true;
            newItem.encodingUiItems[0].isEnabled = true;
            newItem.encodingUiItems[0].encodingType = newItem.encodingType;
            tab.ShelfClientCommands._addShelfItem(shelfPm, newItem, dropPos, 0);
        }
    }, command, encodingShelf.get_shelfType());
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.addShelfField = function tab_ShelfClientCommands$addShelfField(svm, fieldColumns, encoding, dropPos) {
    var command = tab.ShelfClientCommands._createDropOnShelfCommand();
    var cmdParams = command.commandParams;
    if (ss.isNullOrUndefined(dropPos)) {
        dropPos = cmdParams['shelfDropTargetPosition'];
        dropPos.shelfType = svm.get_shelfType();
        dropPos.shelfPosIndex = 0;
        dropPos.shelfDropAction = 'insert';
        dropPos.encodingType = encoding;
    }
    tab.ShelfClientCommands._createFieldEncodingPM(cmdParams, fieldColumns, 'invalid-encoding');
    cmdParams['paneSpec'] = svm.get_paneId();
    cmdParams['dragSource'] = 'drag-drop-schema';
    cmdParams['dropTarget'] = 'drag-drop-viz';
    cmdParams['shelfDropTargetPosition'] = dropPos;
    if (encoding !== 'invalid-encoding') {
        cmdParams['encodingType'] = encoding;
    }
    var cc = new tab._shelfDropClientCommand(function(t) {
        var offset = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(fieldColumns);
        while ($enum1.moveNext()) {
            var fieldColumn = $enum1.current;
            var newItem = {};
            newItem.displayText = fieldColumn.get_description();
            newItem.fn = fieldColumn.get_globalName();
            newItem.encodingType = (svm.get_shelfType() === 'encoding-shelf' && encoding === 'invalid-encoding') ? 'level-of-detail-encoding' : encoding;
            var shelfPm = t.makeMutablePresModel(svm);
            tab.ShelfClientCommands._addShelfItem(shelfPm, newItem, dropPos, offset);
            offset++;
        }
    }, command, svm.get_shelfType());
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.replaceShelfPillWithField = function tab_ShelfClientCommands$replaceShelfPillWithField(targetShelf, target, src, dropPos) {
    var command = tab.ShelfClientCommands._createDropOnShelfCommand();
    var cmdParams = command.commandParams;
    if (ss.isNullOrUndefined(dropPos)) {
        dropPos = cmdParams['shelfDropTargetPosition'];
        dropPos.shelfType = targetShelf.get_shelfType();
        dropPos.shelfPosIndex = targetShelf.get_pills().indexOf(target);
        dropPos.shelfDropAction = 'replace';
        dropPos.encodingType = target.get_encodingType();
    }
    tab.ShelfClientCommands._createFieldEncodingPM(cmdParams, src, 'invalid-encoding');
    cmdParams['paneSpec'] = targetShelf.get_paneId();
    cmdParams['shelfSelection'] = new Array(0);
    cmdParams['dragSource'] = 'drag-drop-schema';
    cmdParams['dropTarget'] = 'drag-drop-viz';
    cmdParams['shelfDropTargetPosition'] = dropPos;
    var cc = new tab._shelfDropClientCommand(function(t) {
        var targetShelfPm = t.makeMutablePresModel(targetShelf);
        var offset = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(src);
        while ($enum1.moveNext()) {
            var fieldModel = $enum1.current;
            var newItem = {};
            newItem.displayText = fieldModel.get_description();
            newItem.fn = fieldModel.get_globalName();
            newItem.encodingType = target.get_encodingType();
            newItem.encodingUiItems = target.get_item().encodingUiItems;
            tab.ShelfClientCommands._addShelfItem(targetShelfPm, newItem, dropPos, offset);
            offset++;
        }
    }, command, targetShelf.get_shelfType());
    tab.CommandController.SendCommand(cc);
}
tab.ShelfClientCommands.setCommandParams = function tab_ShelfClientCommands$setCommandParams(c, cmdParams) {
    tab.CommandUtils.addVisualIdToCommand(cmdParams, tab.ShelfClientCommands._getVisualIdForCurrentContext());
    var $dict1 = cmdParams;
    for (var $key2 in $dict1) {
        var pair = { key: $key2, value: $dict1[$key2] };
        var value = pair.value;
        if (ss.isNullOrUndefined(value) || Type.canCast(value, String) || Type.canCast(value, Boolean) || Type.canCast(value, Number)) {
        }
        else if (Type.canCast(value, Object) || Type.canCast(value, Array)) {
            cmdParams[pair.key] = tab.JsonUtil.toJson(value);
        }
    }
    c.commandParams = cmdParams;
}
tab.ShelfClientCommands._createDropOnShelfCommand = function tab_ShelfClientCommands$_createDropOnShelfCommand() {
    var result = {};
    result.commandNamespace = 'tabdoc';
    result.commandName = 'drop-on-shelf';
    var cmdParams = {};
    cmdParams['dragSource'] = 'drag-drop-none';
    cmdParams['dropTarget'] = 'drag-drop-none';
    cmdParams['dragDescription'] = '';
    cmdParams['isCopy'] = false;
    cmdParams['isDeadDrop'] = false;
    cmdParams['isRightDrag'] = false;
    cmdParams['shelfDropContext'] = 'none';
    cmdParams['shelfDragSourcePosition'] = {};
    cmdParams['shelfDropTargetPosition'] = {};
    result.commandParams = cmdParams;
    return result;
}
tab.ShelfClientCommands._getFieldEncodingPresModel = function tab_ShelfClientCommands$_getFieldEncodingPresModel(f, type) {
    var fe = {};
    fe.fn = f.get_globalName();
    if (ss.isValue(type) && type !== 'invalid-encoding') {
        fe.encodingType = type;
    }
    return fe;
}
tab.ShelfClientCommands._setFieldEncoding = function tab_ShelfClientCommands$_setFieldEncoding(cmdParams, f, type) {
    cmdParams['fieldEncodings'] = tab.JsonUtil.toJson([ tab.ShelfClientCommands._getFieldEncodingPresModel(f, type) ]);
}
tab.ShelfClientCommands._createFieldEncodingPM = function tab_ShelfClientCommands$_createFieldEncodingPM(cmdParams, f, type) {
    var fieldEncodingPresModels = _.map(f, function(fieldModel) {
        return tab.ShelfClientCommands._getFieldEncodingPresModel(fieldModel, type);
    });
    cmdParams['fieldEncodings'] = tab.JsonUtil.toJson(fieldEncodingPresModels);
}
tab.ShelfClientCommands._addShelfItem = function tab_ShelfClientCommands$_addShelfItem(shelfPm, newItem, dropPos, offset) {
    var action = (offset > 0) ? 'insert' : (dropPos.shelfDropAction || 'insert');
    switch (action) {
        case 'insert':
            tab.ShelfClientCommands._shelfItemsAsList(shelfPm.shelfItems).insert(dropPos.shelfPosIndex + offset, newItem);
            break;
        case 'replace':
            shelfPm.shelfItems[dropPos.shelfPosIndex] = newItem;
            break;
        case 'replace-all':
            shelfPm.shelfItems[dropPos.shelfPosIndex] = newItem;
            shelfPm.shelfItems = _.filter(shelfPm.shelfItems, function(pm) {
                return pm.encodingType !== dropPos.encodingType || pm === newItem;
            });
            break;
    }
}
tab.ShelfClientCommands._removeShelfItem = function tab_ShelfClientCommands$_removeShelfItem(shelfPm, item) {
    shelfPm.shelfItems = _.filter(shelfPm.shelfItems, function(model) {
        return !_.isEqual(model, item);
    });
}
tab.ShelfClientCommands._shelfItemsAsList = function tab_ShelfClientCommands$_shelfItemsAsList(items) {
    return (items);
}
tab.ShelfClientCommands._getVisualIdForCurrentContext = function tab_ShelfClientCommands$_getVisualIdForCurrentContext() {
    return tab.ModelUtils.getVisualId(tsConfig.current_sheet_name);
}


////////////////////////////////////////////////////////////////////////////////
// tab._shelfDropClientCommand

tab._shelfDropClientCommand = function tab__shelfDropClientCommand(doLocal, remoteDropCommand, shelfType) {
    tab._shelfDropClientCommand.initializeBase(this, [ 'immediately', doLocal, null ]);
    this._origDropCommand$1 = remoteDropCommand;
    this._dropShelfType$1 = shelfType;
    var prepareDropCmd = {};
    prepareDropCmd.commandNamespace = 'tabdoc';
    prepareDropCmd.commandName = 'drop-prepare';
    tab.ShelfClientCommands.setCommandParams(prepareDropCmd, remoteDropCommand.commandParams);
    this.enqueueCommand(new tab.CommandRecord(prepareDropCmd));
}
tab._shelfDropClientCommand.prototype = {
    _origDropCommand$1: null,
    _dropShelfType$1: null,
    _prepared$1: false,
    
    handleRemoteCommandSuccess: function tab__shelfDropClientCommand$handleRemoteCommandSuccess(cmdRec, pm) {
        tab._shelfDropClientCommand.callBaseMethod(this, 'handleRemoteCommandSuccess', [ cmdRec, pm ]);
        if (this._prepared$1) {
            return;
        }
        this._prepared$1 = true;
        var result = pm;
        if (ss.isNullOrUndefined(result)) {
            return;
        }
        var command = this._origDropCommand$1;
        var cmdParams = this._origDropCommand$1.commandParams;
        if (Object.keyExists(result, 'dropCommandModel')) {
            var commands = result['dropCommandModel'];
            var dropCommand = tab.CommandSerializer.deserialize(tab.SimpleCommandsPresModelWrapper.create(commands).get_simpleCommand());
            if (ss.isValue(dropCommand)) {
                command = dropCommand;
                cmdParams = dropCommand.commandParams;
            }
        }
        if (Object.keyExists(result, 'fieldEncodings')) {
            cmdParams['fieldEncodings'] = result['fieldEncodings'];
        }
        else if (Object.keyExists(result, 'fn')) {
            var fe = {};
            fe.fn = result['fn'];
            cmdParams['fieldEncodings'] = tab.JsonUtil.toJson([ fe ]);
        }
        if (Object.keyExists(result, 'doDropUiAction') && result['doDropUiAction'] && this._dropShelfType$1 === 'filter-shelf') {
            var encoding = result['fieldEncoding'];
            var addQuickFilterCmd = tab.CommandUtils.newSrvCommand('create-default-quick-filter');
            var addQuickFilterParams = {};
            addQuickFilterParams['fn'] = encoding.fn;
            tab.ShelfClientCommands.setCommandParams(addQuickFilterCmd, addQuickFilterParams);
            this.enqueueCommand(new tab.CommandRecord(addQuickFilterCmd));
        }
        tab.ShelfClientCommands.setCommandParams(command, cmdParams);
        this.enqueueCommand(new tab.CommandRecord(command));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandController

tab.CommandController = function tab_CommandController(session) {
    this._executingCommands = [];
    this._waitingCommands = new tab._clientCommandQueue();
    this._transactor = new tab.Transactor();
    this._deferredServerResponseQueue = {};
    var baseSessionCommandHandler = new tab._baseSessionCommandHandler(session);
    baseSessionCommandHandler.installCommandThrottling('tabsrv', 'render-tooltip-server', 135);
    this._commandHandler = baseSessionCommandHandler;
    this._commandHandler.add_commmandSucceeded(ss.Delegate.create(this, this._handleRemoteCommandResponse));
    this._session = session;
}
tab.CommandController.get_fireDeferredUrlActions = function tab_CommandController$get_fireDeferredUrlActions() {
    return tab.CommandController._deferredUrlActions;
}
tab.CommandController.set_fireDeferredUrlActions = function tab_CommandController$set_fireDeferredUrlActions(value) {
    tab.CommandController._deferredUrlActions = value;
    return value;
}
tab.CommandController.get__log = function tab_CommandController$get__log() {
    return tab.Logger.lazyGetLogger(tab.CommandController);
}
tab.CommandController.create = function tab_CommandController$create(session) {
    if (ss.isNullOrUndefined(tab.CommandController._instance)) {
        tab.CommandController._instance = new tab.CommandController(session);
    }
    return tab.CommandController._instance;
}
tab.CommandController.get = function tab_CommandController$get() {
    if (!ss.isValue(tab.CommandController._instance)) {
        throw new Error('Attempted to use CommandController before creating it.');
    }
    return tab.CommandController._instance;
}
tab.CommandController.handleBootstrapException = function tab_CommandController$handleBootstrapException(e) {
    tab.CommandController.get__log().error('Bootstrap error: %s', e.toString());
    if (tab.CommandController._handledBootstrapException) {
        return;
    }
    var sb = new ss.StringBuilder();
    if (ss.isValue(e['name'])) {
        sb.append(e['name']).append(': ');
    }
    sb.append(e.message);
    if (('stack' in e)) {
        sb.appendLine().append(e.stack);
    }
    tab.BaseSession.showAlertDialog(tab.Strings.UnhandledExceptionMessage(sb.toString()), tab.Strings.UnhandledExceptionTitle, true);
    tab.CommandController.sendParentCompletedMessage();
    tab.CommandController._handledBootstrapException = true;
}
tab.CommandController.sendParentCompletedMessage = function tab_CommandController$sendParentCompletedMessage() {
    if (tab.CommandController._parentCompletedSent) {
        return;
    }
    tab.CommandController._parentCompletedSent = true;
    var parameters = {};
    parameters['t'] = tabBootstrap.MetricsController.getTiming();
    parameters['d'] = 'CLNTLD';
    var evt = new tabBootstrap.MetricsEvent('gen', tabBootstrap.MetricsSuites.bootstrap, parameters);
    tabBootstrap.MetricsController.get_instance().logEvent(evt);
    tab.BrowserSupport.doPostMessageWithContext('tableau.completed');
    tab.CommandController.get__log().debug('PostMessage ' + 'tableau.completed' + ' fired');
}
tab.CommandController._isCommandBlocking = function tab_CommandController$_isCommandBlocking(command) {
    return command.get_blockType() === 'immediately';
}
tab.CommandController.SendCommand = function tab_CommandController$SendCommand(newlyMadeClientCommand) {
    var singleton = tab.CommandController.get();
    singleton._waitingCommands.enqueue(newlyMadeClientCommand);
    singleton._kickTheQueue();
}
tab.CommandController._deferredSuccessHandler = function tab_CommandController$_deferredSuccessHandler(deferred) {
    return function(pm) {
        var controller = tab.CommandController.get();
        var handleStateUpdated = null;
        handleStateUpdated = function() {
            controller.remove_postRemoteCommand(handleStateUpdated);
            deferred.resolve(pm);
        };
        controller.add_postRemoteCommand(handleStateUpdated);
    };
}
tab.CommandController._deferredFailureHandler = function tab_CommandController$_deferredFailureHandler(deferred) {
    return function(e) {
        var controller = tab.CommandController.get();
        var handleStateUpdated = null;
        handleStateUpdated = function() {
            controller.remove_postRemoteCommand(handleStateUpdated);
            deferred.reject(e);
        };
        controller.add_postRemoteCommand(handleStateUpdated);
    };
}
tab.CommandController.prototype = {
    _commandHandler: null,
    _deferredLayoutInfo: null,
    _deferredWaitHandlerDecrements: 0,
    _worldCheckpoint: null,
    _currentWorldDiffersFromCheckpoint: false,
    _session: null,
    _processingRenderModeChange: false,
    _processingStoryPointChange: false,
    
    add_onUrlActionsResponse: function tab_CommandController$add_onUrlActionsResponse(value) {
        this.__onUrlActionsResponse = ss.Delegate.combine(this.__onUrlActionsResponse, value);
    },
    remove_onUrlActionsResponse: function tab_CommandController$remove_onUrlActionsResponse(value) {
        this.__onUrlActionsResponse = ss.Delegate.remove(this.__onUrlActionsResponse, value);
    },
    
    __onUrlActionsResponse: null,
    
    add_onInvalidation: function tab_CommandController$add_onInvalidation(value) {
        this.__onInvalidation = ss.Delegate.combine(this.__onInvalidation, value);
    },
    remove_onInvalidation: function tab_CommandController$remove_onInvalidation(value) {
        this.__onInvalidation = ss.Delegate.remove(this.__onInvalidation, value);
    },
    
    __onInvalidation: null,
    
    add_onBootstrapSuccess: function tab_CommandController$add_onBootstrapSuccess(value) {
        this.__onBootstrapSuccess = ss.Delegate.combine(this.__onBootstrapSuccess, value);
    },
    remove_onBootstrapSuccess: function tab_CommandController$remove_onBootstrapSuccess(value) {
        this.__onBootstrapSuccess = ss.Delegate.remove(this.__onBootstrapSuccess, value);
    },
    
    __onBootstrapSuccess: null,
    
    add_destroyView: function tab_CommandController$add_destroyView(value) {
        this.__destroyView = ss.Delegate.combine(this.__destroyView, value);
    },
    remove_destroyView: function tab_CommandController$remove_destroyView(value) {
        this.__destroyView = ss.Delegate.remove(this.__destroyView, value);
    },
    
    __destroyView: null,
    
    add_postLocalCommand: function tab_CommandController$add_postLocalCommand(value) {
        this.__postLocalCommand = ss.Delegate.combine(this.__postLocalCommand, value);
    },
    remove_postLocalCommand: function tab_CommandController$remove_postLocalCommand(value) {
        this.__postLocalCommand = ss.Delegate.remove(this.__postLocalCommand, value);
    },
    
    __postLocalCommand: null,
    
    add_postRemoteCommand: function tab_CommandController$add_postRemoteCommand(value) {
        this.__postRemoteCommand = ss.Delegate.combine(this.__postRemoteCommand, value);
    },
    remove_postRemoteCommand: function tab_CommandController$remove_postRemoteCommand(value) {
        this.__postRemoteCommand = ss.Delegate.remove(this.__postRemoteCommand, value);
    },
    
    __postRemoteCommand: null,
    
    add_postBootstrap: function tab_CommandController$add_postBootstrap(value) {
        this.__postBootstrap = ss.Delegate.combine(this.__postBootstrap, value);
    },
    remove_postBootstrap: function tab_CommandController$remove_postBootstrap(value) {
        this.__postBootstrap = ss.Delegate.remove(this.__postBootstrap, value);
    },
    
    __postBootstrap: null,
    
    get_waitingOnCommands: function tab_CommandController$get_waitingOnCommands() {
        return Object.getKeyCount(this._deferredServerResponseQueue) > 0 || this._executingCommands.length > 0 || this._waitingCommands.get_count() > 0;
    },
    
    get_deferredServerResponseQueueSize: function tab_CommandController$get_deferredServerResponseQueueSize() {
        return Object.getKeyCount(this._deferredServerResponseQueue);
    },
    
    get_currentWorldDiffersFromCheckpoint: function tab_CommandController$get_currentWorldDiffersFromCheckpoint() {
        return this._currentWorldDiffersFromCheckpoint;
    },
    
    get_legacySession: function tab_CommandController$get_legacySession() {
        return this._session;
    },
    
    get_processingRenderModeChange: function tab_CommandController$get_processingRenderModeChange() {
        return this._processingRenderModeChange;
    },
    
    get_processingStoryPointChange: function tab_CommandController$get_processingStoryPointChange() {
        return this._processingStoryPointChange;
    },
    
    updateLayoutSession: function tab_CommandController$updateLayoutSession(layoutSession) {
        this._session = layoutSession;
    },
    
    resetInvalidationHandlers: function tab_CommandController$resetInvalidationHandlers() {
        this.__onUrlActionsResponse = null;
        this.__onInvalidation = null;
        this.__onBootstrapSuccess = null;
    },
    
    refreshLayout: function tab_CommandController$refreshLayout() {
        tab.CommandController.get__log().debug('RefreshLayout');
        dojo.publish('close-menus');
        if (tabBootstrap.ViewerBootstrap.get_instance().get_hasBootstrapCompleted()) {
            return;
        }
        var onBootstrapSuccess = ss.Delegate.create(this, function(arg) {
            tab.WorkgroupServerCommands.extendWorkgroupSession();
            var primaryContext = tabBootstrap.MetricsController.get_instance().createContext('PROPRI', tabBootstrap.MetricsSuites.bootstrap);
            var decodeContext = tabBootstrap.MetricsController.get_instance().createContext('RLE Decode Primary', tabBootstrap.MetricsSuites.debug);
            arg = tab.RleDecoder.decode(arg);
            decodeContext.close();
            var bootstrapResponse = arg;
            if (ss.isValue(this.__onBootstrapSuccess)) {
                try {
                    this.__onBootstrapSuccess(bootstrapResponse, this);
                }
                catch (e) {
                    tab.CommandController.handleBootstrapException(e);
                }
                this.get_legacySession().nudgeWait();
                _.defer(function() {
                    tab.MiscUtil.postHookMessage('primary-bootstrap-complete');
                });
            }
            primaryContext.close();
            this._raisePostBootstrap();
        });
        var onBootStrapSecondaryResponse = ss.Delegate.create(this, function(arg) {
            var secondaryUpdate = arg;
            if (ss.isValue(secondaryUpdate)) {
                tab.CommandController.get__log().debug('Deferring secondary payload processing');
                _.defer(ss.Delegate.create(this, function() {
                    var secondaryContext = tabBootstrap.MetricsController.get_instance().createContext('PROSEC', tabBootstrap.MetricsSuites.bootstrap);
                    var decodeContext = tabBootstrap.MetricsController.get_instance().createContext('RLE Decode Secondary', tabBootstrap.MetricsSuites.debug);
                    secondaryUpdate = tab.RleDecoder.decode(secondaryUpdate);
                    decodeContext.close();
                    try {
                        this._handleSecondaryUpdate(secondaryUpdate);
                    }
                    catch (e) {
                        tab.CommandController.handleBootstrapException(e);
                    }
                    tab.MiscUtil.postHookMessage('secondary-bootstrap-complete');
                    secondaryContext.close();
                    tab.CommandController.sendParentCompletedMessage();
                }));
            }
        });
        var onBootstrapFailure = ss.Delegate.create(this, function(err) {
            tab.WorkgroupServerCommands.extendWorkgroupSession();
            var status = err.status;
            if (status === 200) {
                var message = err.message;
                if (message.substr(0, 12) === 'Invalid JSON') {
                    tab.CommandController.sendParentCompletedMessage();
                    var errorMessage = tab.Strings.ServerErrorInvalidJSON + '<br>';
                    tab.BaseSession.showAlertDialog(errorMessage, tab.Strings.SessionUnknownErrorTitle, true);
                    throw new Error('Invalid JSON');
                }
            }
            else if (status === 403) {
                var code = 0;
                var message = '';
                try {
                    var exception = JSON.parse(err.responseText);
                    if (ss.isValue(exception)) {
                        code = exception.code;
                        message = exception.message;
                    }
                }
                catch ($e1) {
                }
                tab.CommandController.sendParentCompletedMessage();
                this._session.handleSessionForbiddenAction(code, message);
            }
            else if (status === 401) {
                var response = err.responseText;
                tab.WindowHelper.locationReplace(window.self, response);
            }
            else if (status === 410) {
                this._session.handleSessionExpiration(true);
            }
            else if (status === 413) {
                tab.CommandController.sendParentCompletedMessage();
                this._session.handleSessionLimitExceeded();
            }
            else if (!!status) {
                tab.CommandController.sendParentCompletedMessage();
                var errorDetails = err.responseText;
                if (status === 502 || status === 503) {
                    this._session.handleSessionKilled(errorDetails);
                }
                else {
                    this._session.handleUnknownErrorStatus(errorDetails);
                }
                this._session.nudgeWait();
            }
        });
        tabBootstrap.ViewerBootstrap.get_instance().waitOnInitialLayoutModel(onBootstrapSuccess, onBootstrapFailure, onBootStrapSecondaryResponse);
    },
    
    executeUrlActions: function tab_CommandController$executeUrlActions(urlActions) {
        var actions = Array.toArray(urlActions);
        this.__onUrlActionsResponse(actions);
    },
    
    checkpointAppPresModel: function tab_CommandController$checkpointAppPresModel() {
        this._worldCheckpoint = tab.ApplicationModel.get_instance().get_presModel();
        Object.clearKeys(this._deferredServerResponseQueue);
        this._currentWorldDiffersFromCheckpoint = false;
    },
    
    worldCheckpoint: function tab_CommandController$worldCheckpoint() {
        var clone = tab.MiscUtil.cloneObject(this._worldCheckpoint);
        return clone;
    },
    
    SaveWorkbook: function tab_CommandController$SaveWorkbook(name, projectId, showTabs, successCallback) {
        this._executePublish('publish', name, projectId, showTabs, null, null, successCallback, null);
    },
    
    SaveWorkbookAs: function tab_CommandController$SaveWorkbookAs(name, projectId, showTabs, embedCredentials, noOverwrite, successCallback, errorCallback) {
        this._executePublish('publish_as', name, projectId, showTabs, embedCredentials, noOverwrite, successCallback, errorCallback);
    },
    
    _transitionGuestSession: function tab_CommandController$_transitionGuestSession(successCallback) {
        var onSuccess = function() {
            successCallback();
        };
        var args = {};
        args.type = 'POST';
        args.dataType = 'json';
        args.url = this._formatSessionMethod('transitionGuest');
        var pathnameParts = tab.MiscUtil.get_urlPathnameParts();
        var sheetId = (Object.keyExists(pathnameParts, 3)) ? pathnameParts[3] : '';
        var authoringSheetname = tsConfig.current_sheet_name;
        var xhrData = { ':authSheet': authoringSheetname, sheet_id: sheetId };
        args.data = xhrData;
        var handler = new tab.SessionAjaxCallManager(this._session, null, onSuccess, null, true, true);
        tab.XhrUtil.helper(args, handler);
    },
    
    _formatSessionMethod: function tab_CommandController$_formatSessionMethod(method) {
        return tabBootstrap.BaseUrlFormatter.formatSessionMethod(method, this._session.get_id(), this._session.get_urlRoot());
    },
    
    _handleSecondaryUpdate: function tab_CommandController$_handleSecondaryUpdate(secondaryUpdate) {
        var secondaryInfo = secondaryUpdate.secondaryInfo;
        if (!ss.isValue(secondaryInfo) || !ss.isValue(secondaryInfo.presModelMap) || !Object.getKeyCount(secondaryInfo.presModelMap)) {
            return;
        }
        var appClone = tab.ApplicationModel.get_instance().get_appPresModel();
        if (Object.keyExists(secondaryInfo.presModelMap, 'dataDictionary')) {
            var presModelHolder = secondaryInfo.presModelMap['dataDictionary'].presModelHolder;
            var dataDictionary = presModelHolder.genDataDictionaryPresModel;
            if (ss.isValue(dataDictionary)) {
                appClone.dataDictionary = dataDictionary;
            }
        }
        if (Object.keyExists(secondaryInfo.presModelMap, 'vizData')) {
            var dashboard = appClone.workbookPresModel.dashboardPresModel;
            var presModelHolder = secondaryInfo.presModelMap['vizData'].presModelHolder;
            var vizDatas = presModelHolder.genPresModelMapPresModel;
            var keys = Object.keys(vizDatas.presModelMap);
            var $enum1 = ss.IEnumerator.getEnumerator(keys);
            while ($enum1.moveNext()) {
                var sheetName = $enum1.current;
                var $dict2 = dashboard.zones;
                for (var $key3 in $dict2) {
                    var entry = { key: $key3, value: $dict2[$key3] };
                    var zone = entry.value;
                    if (zone.zoneType === 'viz' && zone.sheet === sheetName) {
                        var visual = zone.presModelHolder.visual;
                        if (ss.isValue(visual)) {
                            presModelHolder = vizDatas.presModelMap[sheetName].presModelHolder;
                            visual.vizData = presModelHolder.genVizDataPresModel;
                        }
                        break;
                    }
                }
            }
        }
        tab.ApplicationModel.get_instance().update(appClone);
        this.checkpointAppPresModel();
        if (tab.ModelUtils.hasAnyImpliedSelection()) {
            tab.Model.fireDeferredEvents(tab.CommandController.handleBootstrapException);
        }
        else {
            tab.Model._clearDeferredEvents();
        }
        tab.CommandController.get__log().debug('Secondary bootstrap complete');
    },
    
    _executePublish: function tab_CommandController$_executePublish(publishMethod, name, projectId, showTabs, embedCredentials, noOverwrite, successCallback, errorCallback) {
        var onSuccess = function(responseObject, status, req) {
            var responseDict = responseObject;
            if (Object.keyExists(responseDict, 'workbook')) {
                var wb = responseDict['workbook'];
                successCallback(wb);
            }
            else {
                tab.CommandController.get__log().warn('Save did not return a workbook: %s', responseObject);
                successCallback(null);
            }
        };
        var onError = ss.Delegate.create(this, function(request, status, error) {
            tab.CommandController.get__log().debug('Error on publish: %s', request.responseText);
            var json;
            try {
                json = tab.JsonUtil.parseJson(request.responseText);
            }
            catch ($e1) {
                json = null;
            }
            if (ss.isValue(errorCallback) && ss.isValue(json)) {
                var publishError = json;
                errorCallback(publishError);
            }
            else {
                this._session._handleError(error, request);
            }
        });
        var args = {};
        args.type = 'POST';
        args.dataType = 'json';
        args.url = this._formatSessionMethod(publishMethod);
        var data = { project: projectId, name: name, display_tabs: showTabs };
        if (ss.isValue(embedCredentials)) {
            data['save_db_passwords'] = embedCredentials;
        }
        if (ss.isValue(noOverwrite)) {
            data['no_overwrite'] = noOverwrite;
        }
        var payload = tab.XhrUtil.getMultipartData(null, data);
        args.contentType = 'multipart/form-data; boundary=' + payload.header;
        args.data = payload.body;
        var handler = new tab.SessionAjaxCallManager(this._session, null, onSuccess, onError, true, true);
        tab.XhrUtil.helper(args, handler);
    },
    
    _kickTheQueue: function tab_CommandController$_kickTheQueue() {
        while (!!this._waitingCommands.get_count() && !_.any(this._executingCommands, tab.CommandController._isCommandBlocking)) {
            tab.CommandController.get__log().debug('ClientCommandQueue processing next ClientCommand.');
            this._executeClientCommand(this._waitingCommands.dequeue());
        }
        if (!this._waitingCommands.get_count()) {
            tab.CommandController.get__log().debug('ClientCommandQueue is empty - nothing to do.');
        }
        else if (_.any(this._executingCommands, tab.CommandController._isCommandBlocking)) {
            tab.CommandController.get__log().debug('ClientCommandQueue is executing a blocking command - waiting.');
        }
    },
    
    _executeClientCommand: function tab_CommandController$_executeClientCommand(c) {
        tab.CommandController.get__log().debug('Executing client command, %o', c);
        this._executingCommands.add(c);
        if (c.get_blockType() !== 'none') {
            this.get_legacySession().incrementWait(c.get_blockType() === 'immediately');
        }
        var t = this._transactor.beginTransaction();
        var localChange;
        try {
            c.execute(t, this._commandHandler, ss.Delegate.create(this, function(succeeded) {
                this._commandCompleted(c, succeeded);
            }));
            localChange = this._transactor.endTransaction();
        }
        catch (e) {
            tab.CommandController.get__log().error('Error while executing a command: %s', e.message);
            this._transactor.rollbackTransaction();
            tab.Model._clearDeferredEvents();
            this._removeExecutingCommand(c);
            return;
        }
        var mc = null;
        if (c.get_hasLocalComponent()) {
            mc = tabBootstrap.MetricsController.get_instance().createContext('PROLOC', tabBootstrap.MetricsSuites.commands, c.buildCommandMetricsParameters());
        }
        if (ss.isValue(localChange)) {
            tab.ApplicationModel.get_instance().update(localChange);
            this._dirtyAppPM();
        }
        tab.Model.fireDeferredEvents(null);
        this._raisePostLocalCommand();
        if (mc != null) {
            mc.close();
        }
    },
    
    _commandCompleted: function tab_CommandController$_commandCompleted(c, succeeded) {
        tab.CommandController.get__log().debug('Client command completed, success=%s, %o', succeeded, c);
        var mc = null;
        if (c.get_hasRemoteComponent()) {
            mc = tabBootstrap.MetricsController.get_instance().createContext('PROREM', tabBootstrap.MetricsSuites.commands, c.buildCommandMetricsParameters());
        }
        this._removeExecutingCommand(c);
        if (mc != null) {
            mc.close();
        }
        _.defer(ss.Delegate.create(this, function() {
            if (this._waitingCommands.get_count() > 0) {
                this._kickTheQueue();
            }
        }));
    },
    
    _handleRemoteCommandResponse: function tab_CommandController$_handleRemoteCommandResponse(sequenceID, c, o) {
        if (!ss.isValue(c) || !ss.isValue(o)) {
            return;
        }
        var response = o.vqlCmdResponse;
        if (!ss.isValue(response)) {
            return;
        }
        if (ss.isValue(response.layoutStatus)) {
            var layoutStatus = response.layoutStatus;
            if ((ss.isValue(layoutStatus.urlActionList) && !tab.ApplicationModel.get_instance().get_isLocalRenderMode() && ss.isValue(this.__onUrlActionsResponse)) || tab.CommandController.get_fireDeferredUrlActions()) {
                if (layoutStatus.urlActionList.length > 0) {
                    tab.CommandController.set_fireDeferredUrlActions(false);
                    this.__onUrlActionsResponse(layoutStatus.urlActionList);
                }
            }
            if (ss.isValue(layoutStatus.applicationPresModel) && ss.isValue(layoutStatus.applicationPresModel.workbookPresModel) && ss.isValue(layoutStatus.applicationPresModel.workbookPresModel.dashboardPresModel) && ss.isValue(layoutStatus.applicationPresModel.workbookPresModel.dashboardPresModel.sheetLayoutInfo)) {
                this._deferredLayoutInfo = layoutStatus.applicationPresModel.workbookPresModel.dashboardPresModel.sheetLayoutInfo;
            }
            var tuple = new ss.Tuple();
            var primarySheet = null;
            if (ss.isValue(c.commandParams) && Object.keyExists(c.commandParams, 'worksheet') && !(c.commandName === 'render-tooltip-server')) {
                primarySheet = c.commandParams['worksheet'];
            }
            var info = new tab.InvalidationInfo();
            info.primarySheet = primarySheet;
            info.layoutStatus = response.layoutStatus;
            info.cmdResult = response.cmdResultList[0];
            tuple.second = info;
            if (ss.isValue(response.layoutStatus.applicationPresModel)) {
                tuple.first = response.layoutStatus.applicationPresModel;
            }
            this._enqueueServerResponse(sequenceID, tuple);
        }
    },
    
    _handleInvalidation: function tab_CommandController$_handleInvalidation(invalidationInfo) {
        tab.CommandController.get__log().debug('OnInvalidation');
        if (ss.isNullOrUndefined(this.__onInvalidation)) {
            return;
        }
        this.__onInvalidation(invalidationInfo);
    },
    
    _removeExecutingCommand: function tab_CommandController$_removeExecutingCommand(c) {
        try {
            this._executingCommands.remove(c);
            if (c.get_blockType() !== 'none') {
                this._deferredWaitHandlerDecrements += 1;
            }
            if (!this._executingCommands.length && !this._waitingCommands.get_count()) {
                var layoutIdChanged = false;
                var sheetChanged = false;
                if (ss.isValue(this._deferredLayoutInfo)) {
                    layoutIdChanged = this.get_legacySession().get_layoutId() !== this._deferredLayoutInfo.layoutId.toString();
                    sheetChanged = tsConfig.current_sheet_name !== this._deferredLayoutInfo.sheetName;
                    this.get_legacySession().set_layoutId(this._deferredLayoutInfo.layoutId.toString());
                    if (sheetChanged || layoutIdChanged) {
                        this.__destroyView();
                    }
                }
                tab.CommandController.get__log().debug('Flushing the queue of %d pending server responses, layoutIdChanged=%s, sheetChanged=%s, layoutId=%s', Object.getKeyCount(this._deferredServerResponseQueue), layoutIdChanged, sheetChanged, this.get_legacySession().get_layoutId());
                var oldRenderMode = this._getRenderMode();
                var wasStory = tab.ApplicationModel.get_instance().get_workbook().get_isCurrentSheetStoryboard();
                var sheetName = (wasStory) ? tab.ApplicationModel.get_instance().get_workbook().get_storyboard().get_sheetName() : null;
                var storyPointID = (wasStory) ? tab.ApplicationModel.get_instance().get_workbook().get_storyboard().get_flipboard().get_currentStoryPointId() : 0;
                var am = tab.ApplicationModel.get_instance();
                if (this._currentWorldDiffersFromCheckpoint) {
                    am.update(this._worldCheckpoint);
                }
                var commandSequenceIDs = Object.keys(this._deferredServerResponseQueue);
                commandSequenceIDs = commandSequenceIDs.sort(function(id1, id2) {
                    return (id1 > id2) ? 1 : -1;
                });
                var invalidations = [];
                var $enum1 = ss.IEnumerator.getEnumerator(commandSequenceIDs);
                while ($enum1.moveNext()) {
                    var sequenceID = $enum1.current;
                    var tuple = this._deferredServerResponseQueue[sequenceID];
                    am.update(tuple.first);
                    invalidations.add(tuple.second);
                    if (ss.isValue(tuple.second) && ss.isValue(tuple.second.layoutStatus) && ss.isValue(tuple.second.layoutStatus.undoPosition)) {
                        if (tuple.second.layoutStatus.undoPosition > this.get_legacySession().get__historyPosition()) {
                            this._session._pushServerUndo('');
                        }
                        this.get_legacySession().set__historyPosition(tuple.second.layoutStatus.undoPosition);
                    }
                }
                this.checkpointAppPresModel();
                var renderModeChanged = (tab.ApplicationModel.get_instance().get_renderMode() !== oldRenderMode);
                this._processingRenderModeChange = renderModeChanged;
                if (renderModeChanged) {
                    this._deferredWaitHandlerDecrements += 1;
                    this.get_legacySession().get_waitHandler().addrefAndTurnOnImmediately();
                }
                if (wasStory && tab.ApplicationModel.get_instance().get_workbook().get_isCurrentSheetStoryboard()) {
                    if ((ss.isValue(sheetName) && sheetName === tab.ApplicationModel.get_instance().get_workbook().get_storyboard().get_sheetName()) && (storyPointID !== tab.ApplicationModel.get_instance().get_workbook().get_storyboard().get_flipboard().get_currentStoryPointId())) {
                        this._processingStoryPointChange = true;
                    }
                }
                if (ss.isValue(this._deferredLayoutInfo)) {
                    if (sheetChanged || layoutIdChanged) {
                        if (sheetChanged) {
                            try {
                                if (ss.isValue(window.parent) && (typeof(window.parent.handleSheetChanged) === 'function')) {
                                    window.parent.handleSheetChanged(this._deferredLayoutInfo.sheetName, this._deferredLayoutInfo.repositoryUrl);
                                }
                            }
                            catch ($e2) {
                            }
                        }
                        this._deferredLayoutInfo.oldSheetName = tsConfig.current_sheet_name;
                        dojo.publish('newLayoutId', [ this._deferredLayoutInfo ]);
                        this._deferredLayoutInfo = null;
                    }
                }
                var portSize = tab.LayoutSession._getDashboardSize(am.get_presModel());
                if (ss.isValue(portSize)) {
                    dojo.publish('refreshLayoutModel', [ portSize ]);
                }
                tab.Model.fireDeferredEvents(null);
                this._handleInvalidations(invalidations);
                this._raisePostRemoteCommand();
                while (this._deferredWaitHandlerDecrements > 0) {
                    tab.Logger.getLogger(tab.WaitHandler).debug('Deferred decrement of WaitHandler');
                    this.get_legacySession().decrementWait();
                    this._deferredWaitHandlerDecrements -= 1;
                }
            }
        }
        finally {
            this._processingRenderModeChange = false;
            this._processingStoryPointChange = false;
        }
    },
    
    _handleInvalidations: function tab_CommandController$_handleInvalidations(invalidations) {
        var $enum1 = ss.IEnumerator.getEnumerator(invalidations);
        while ($enum1.moveNext()) {
            var i = $enum1.current;
            this._handleInvalidation(i);
        }
    },
    
    _enqueueServerResponse: function tab_CommandController$_enqueueServerResponse(sequenceID, tuple) {
        if (ss.isValue(tuple)) {
            tab.CommandController.get__log().debug('Adding a server response to the queue');
            this._deferredServerResponseQueue[sequenceID] = tuple;
        }
    },
    
    _getRenderMode: function tab_CommandController$_getRenderMode() {
        return tab.ApplicationModel.get_instance().get_renderMode();
    },
    
    _dirtyAppPM: function tab_CommandController$_dirtyAppPM() {
        this._currentWorldDiffersFromCheckpoint = true;
    },
    
    _raisePostLocalCommand: function tab_CommandController$_raisePostLocalCommand() {
        if (ss.isValue(this.__postLocalCommand)) {
            this.__postLocalCommand();
        }
    },
    
    _raisePostRemoteCommand: function tab_CommandController$_raisePostRemoteCommand() {
        if (ss.isValue(this.__postRemoteCommand)) {
            this.__postRemoteCommand();
        }
    },
    
    _raisePostBootstrap: function tab_CommandController$_raisePostBootstrap() {
        if (ss.isValue(this.__postBootstrap)) {
            this.__postBootstrap();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._clientCommandQueue

tab._clientCommandQueue = function tab__clientCommandQueue() {
    this._commands = [];
}
tab._clientCommandQueue.prototype = {
    _commands: null,
    
    get_count: function tab__clientCommandQueue$get_count() {
        return this._commands.length;
    },
    
    enqueue: function tab__clientCommandQueue$enqueue(command) {
        if (command.get_isOneAtATime()) {
            this._removeCommands(Type.getInstanceType(command));
        }
        this._commands.add(command);
        tab.Log.get(this).debug('Enqueue new command (%s). There are %i commands queued up now.', Type.getInstanceType(command).get_name(), this.get_count());
    },
    
    dequeue: function tab__clientCommandQueue$dequeue() {
        if (this._commands.length <= 0) {
            return null;
        }
        var toReturn = this._commands[0];
        this._commands.removeAt(0);
        tab.Log.get(this).debug('Dequeue command. There are %i commands queued up now.', this.get_count());
        return toReturn;
    },
    
    hasBlockingCommands: function tab__clientCommandQueue$hasBlockingCommands() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._commands);
        while ($enum1.moveNext()) {
            var c = $enum1.current;
            if (tab.CommandController._isCommandBlocking(c)) {
                return true;
            }
        }
        return false;
    },
    
    _removeCommands: function tab__clientCommandQueue$_removeCommands(commandType) {
        var removed = 0;
        for (var ii = this._commands.length - 1; ii >= 0; --ii) {
            if (Type.getInstanceType(this._commands[ii]) === commandType) {
                ++removed;
                this._commands.removeAt(ii);
            }
        }
        if (removed > 0) {
            tab.Log.get(this).debug('# of %s commands removed: %i. There are %i commands queued up now.', commandType.get_fullName(), removed, this._commands.length);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._remoteClientCommand

tab._remoteClientCommand = function tab__remoteClientCommand(command, uiBlockType, successCallback, errorCallback) {
    tab._remoteClientCommand.initializeBase(this, [ uiBlockType, null, command, successCallback, errorCallback ]);
}
tab._remoteClientCommand.create = function tab__remoteClientCommand$create(command, uiBlockType, successCallback, errorCallback) {
    return new tab._remoteClientCommand(command, uiBlockType, successCallback, errorCallback);
}


////////////////////////////////////////////////////////////////////////////////
// tab.Transactor

tab.Transactor = function tab_Transactor() {
}
tab.Transactor.prototype = {
    _transaction: null,
    
    beginTransaction: function tab_Transactor$beginTransaction() {
        if (ss.isValue(this._transaction)) {
            throw new Error('Internal error: nested transaction');
        }
        this._transaction = new tab.Transaction();
        return this._transaction;
    },
    
    rollbackTransaction: function tab_Transactor$rollbackTransaction() {
        this._transaction = null;
    },
    
    endTransaction: function tab_Transactor$endTransaction() {
        var change = this._transaction.get_transactedChange();
        this._transaction = null;
        return change;
    },
    
    doTransaction: function tab_Transactor$doTransaction(a) {
        this.beginTransaction();
        a(this._transaction);
        return this.endTransaction();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.Transaction

tab.Transaction = function tab_Transaction() {
    this._transactedItems = [];
}
tab.Transaction.prototype = {
    _transactedItems: null,
    
    get_transactedChange: function tab_Transaction$get_transactedChange() {
        return this._buildTransactedChange();
    },
    
    makeMutablePresModel: function tab_Transaction$makeMutablePresModel(model) {
        var modelPath = model.getPresModelPath();
        var $enum1 = ss.IEnumerator.getEnumerator(this._transactedItems);
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            if (_.isEqual(item.get_path(), modelPath)) {
                return item.get_model();
            }
        }
        var newPM = model.getMutableCopyOfPresModel();
        this._transactedItems.add(new tab._transactionItem(modelPath, newPM));
        return newPM;
    },
    
    _buildTransactedChange: function tab_Transaction$_buildTransactedChange() {
        if (!this._transactedItems.length) {
            return null;
        }
        this._transactedItems = _.sortBy(this._transactedItems, function(item) {
            return item.get_path().get_pathList().length;
        });
        var currentWorld = tab.ApplicationModel.get_instance().get_presModel();
        var change = tab.PresentationModel.cloneObjWithScalarsOnly(currentWorld);
        if (!ss.isValue(change)) {
            change = {};
        }
        for (var i = 0, count = this._transactedItems.length; i < count; i++) {
            var item = this._transactedItems[i];
            tab.PresentationModel.insertAtPath(currentWorld, change, item.get_path(), item.get_model());
        }
        return change;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._transactionItem

tab._transactionItem = function tab__transactionItem(path, presModel) {
    this._itemPath = path;
    this._itemModel = presModel;
}
tab._transactionItem.prototype = {
    _itemPath: null,
    _itemModel: null,
    
    get_model: function tab__transactionItem$get_model() {
        return this._itemModel;
    },
    
    get_path: function tab__transactionItem$get_path() {
        return this._itemPath;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ApplicationModel

tab.ApplicationModel = function tab_ApplicationModel() {
    tab.ApplicationModel.initializeBase(this, [ null, null ]);
    this.set_presModelKey(new tab.PresModelPathItem('applicationPresModel'));
    this._toolbarModel$1 = new tab.ToolbarModel(this);
    this._workbookModel$1 = new tab.WorkbookModel(this);
    this._colorPalettesModel$1 = new tab.ColorPaletteCollectionModel(this);
    this._dataDictionaryModel$1 = new tab.DataDictionaryModel(this);
    this._calculationModel$1 = new tab.CalculationModel(this, false);
    this._typeInPillCalculationModel$1 = new tab.CalculationModel(this, true);
    this._calculationFunctionListModel$1 = new tab.CalculationFunctionListModel(this);
    this._shapeManager$1 = new tab.ShapeManager();
}
tab.ApplicationModel.get_instance = function tab_ApplicationModel$get_instance() {
    if (ss.isNullOrUndefined(tab.ApplicationModel._instance$1)) {
        tab.ApplicationModel._instance$1 = new tab.ApplicationModel();
    }
    return tab.ApplicationModel._instance$1;
}
tab.ApplicationModel.prototype = {
    _shapeManager$1: null,
    _toolbarModel$1: null,
    _workbookModel$1: null,
    _colorPalettesModel$1: null,
    _dataDictionaryModel$1: null,
    _calculationModel$1: null,
    _typeInPillCalculationModel$1: null,
    _calculationFunctionListModel$1: null,
    
    add_newWorkbook: function tab_ApplicationModel$add_newWorkbook(value) {
        this.__newWorkbook$1 = ss.Delegate.combine(this.__newWorkbook$1, value);
    },
    remove_newWorkbook: function tab_ApplicationModel$remove_newWorkbook(value) {
        this.__newWorkbook$1 = ss.Delegate.remove(this.__newWorkbook$1, value);
    },
    
    __newWorkbook$1: null,
    
    add_applicationUpdate: function tab_ApplicationModel$add_applicationUpdate(value) {
        this.__applicationUpdate$1 = ss.Delegate.combine(this.__applicationUpdate$1, value);
    },
    remove_applicationUpdate: function tab_ApplicationModel$remove_applicationUpdate(value) {
        this.__applicationUpdate$1 = ss.Delegate.remove(this.__applicationUpdate$1, value);
    },
    
    __applicationUpdate$1: null,
    
    get_toolbar: function tab_ApplicationModel$get_toolbar() {
        return this._toolbarModel$1;
    },
    
    get_workbook: function tab_ApplicationModel$get_workbook() {
        return this._workbookModel$1;
    },
    
    get_colorPalettes: function tab_ApplicationModel$get_colorPalettes() {
        return this._colorPalettesModel$1;
    },
    
    get_calculationModel: function tab_ApplicationModel$get_calculationModel() {
        return this._calculationModel$1;
    },
    
    get_typeInPillCalculationModel: function tab_ApplicationModel$get_typeInPillCalculationModel() {
        return this._typeInPillCalculationModel$1;
    },
    
    get_calculationFunctionListModel: function tab_ApplicationModel$get_calculationFunctionListModel() {
        return this._calculationFunctionListModel$1;
    },
    
    get_shapeManager: function tab_ApplicationModel$get_shapeManager() {
        return this._shapeManager$1;
    },
    
    get_dataDictionary: function tab_ApplicationModel$get_dataDictionary() {
        return this._dataDictionaryModel$1;
    },
    
    get_renderMode: function tab_ApplicationModel$get_renderMode() {
        return (ss.isValue(this.get_appPresModel())) ? this.get_appPresModel().renderMode : 'render-mode-server';
    },
    
    get_isLocalRenderMode: function tab_ApplicationModel$get_isLocalRenderMode() {
        return this.get_renderMode() === 'render-mode-client';
    },
    
    get_appPresModel: function tab_ApplicationModel$get_appPresModel() {
        ss.Debug.assert(ss.isValue(this.presModel), 'ApplicationPresModel property read before first call to Update()');
        return this.presModel;
    },
    
    get_autoUpdate: function tab_ApplicationModel$get_autoUpdate() {
        return tab.ModelUtils.findContentDashboard().get_autoUpdate();
    },
    set_autoUpdate: function tab_ApplicationModel$set_autoUpdate(value) {
        tab.ModelUtils.findContentDashboard().set_autoUpdate(value);
        return value;
    },
    
    get_invalid: function tab_ApplicationModel$get_invalid() {
        return tab.ModelUtils.findContentDashboard().get_invalid();
    },
    set_invalid: function tab_ApplicationModel$set_invalid(value) {
        tab.ModelUtils.findContentDashboard().set_invalid(value);
        return value;
    },
    
    update: function tab_ApplicationModel$update(applicationPresModel) {
        if (ss.isNullOrUndefined(this.presModel)) {
            this.presModel = {};
        }
        if (ss.isValue(applicationPresModel.renderMode)) {
            this.get_appPresModel().renderMode = applicationPresModel.renderMode;
        }
        if (ss.isValue(applicationPresModel.dataDictionary)) {
            this._dataDictionaryModel$1.update(applicationPresModel.dataDictionary);
        }
        if (ss.isValue(applicationPresModel.workbookPresModel)) {
            if (!ss.isValue(this._workbookModel$1)) {
                this._workbookModel$1 = new tab.WorkbookModel(this);
                this.raiseEvent(this.__newWorkbook$1, this._workbookModel$1);
            }
            this._workbookModel$1.update(applicationPresModel.workbookPresModel);
        }
        if (ss.isValue(applicationPresModel.colorPaletteCollection)) {
            this._colorPalettesModel$1.update(applicationPresModel.colorPaletteCollection);
        }
        if (ss.isValue(applicationPresModel.calculation)) {
            this._calculationModel$1.update(applicationPresModel.calculation);
        }
        if (ss.isValue(applicationPresModel.typeInPill)) {
            this._typeInPillCalculationModel$1.update(applicationPresModel.typeInPill);
        }
        if (ss.isValue(applicationPresModel.calculation) && ss.isValue(applicationPresModel.calculation.expressionFuncPm)) {
            this._calculationFunctionListModel$1.update(applicationPresModel.calculation.expressionFuncPm);
        }
        if (ss.isValue(applicationPresModel.toolbarPresModel)) {
            this._toolbarModel$1.update(applicationPresModel.toolbarPresModel);
        }
        this.swapAndCopyPresModel(applicationPresModel);
        this.raiseEvent(this.__applicationUpdate$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SelectionModel

tab.SelectionModel = function tab_SelectionModel(parent, index) {
    tab.SelectionModel.initializeBase(this, [ parent, new tab.PresModelPathItem(index.toString()) ]);
}
tab.SelectionModel._makeSelectionPair$1 = function tab_SelectionModel$_makeSelectionPair$1(colIndices, valueIndices) {
    var builder = new ss.StringBuilder();
    if (ss.isValue(colIndices)) {
        builder.append(colIndices.join(';'));
    }
    builder.append('=');
    if (ss.isValue(valueIndices)) {
        builder.append(valueIndices.join(';'));
    }
    return builder.toString();
}
tab.SelectionModel.prototype = {
    _overriddenTupleIds$1: null,
    _selectedNodesLookup$1: null,
    _selectedLegendItemsLookup$1: null,
    
    add_newSelection: function tab_SelectionModel$add_newSelection(value) {
        this.__newSelection$1 = ss.Delegate.combine(this.__newSelection$1, value);
    },
    remove_newSelection: function tab_SelectionModel$remove_newSelection(value) {
        this.__newSelection$1 = ss.Delegate.remove(this.__newSelection$1, value);
    },
    
    __newSelection$1: null,
    
    get_selectionPresModel: function tab_SelectionModel$get_selectionPresModel() {
        if (ss.isValue(this._overriddenTupleIds$1)) {
            var temp = {};
            temp.selectionType = 'tuples';
            temp.objectIds = this._overriddenTupleIds$1;
            return temp;
        }
        return this.get__origSelectionPresModel$1();
    },
    
    get_selectionType: function tab_SelectionModel$get_selectionType() {
        return this.get__origSelectionPresModel$1().selectionType;
    },
    
    get_isEmpty: function tab_SelectionModel$get_isEmpty() {
        return (tab.MiscUtil.isNullOrEmpty(this.get_ids()) && tab.MiscUtil.isNullOrEmpty(this.get__origSelectionPresModel$1().selectedNodes));
    },
    
    get_nodes: function tab_SelectionModel$get_nodes() {
        return this.get__origSelectionPresModel$1().selectedNodes;
    },
    
    get_ids: function tab_SelectionModel$get_ids() {
        if (ss.isValue(this._overriddenTupleIds$1)) {
            return this._overriddenTupleIds$1;
        }
        return this.get__origSelectionPresModel$1().objectIds;
    },
    
    get_hashKey: function tab_SelectionModel$get_hashKey() {
        var toRet = this.get_selectionType();
        if (this.get_selectionType() === 'legend-items') {
            toRet += '-' + this.get_selectionPresModel().legendSelectionInfo.legendType + ':' + this.get_selectionPresModel().legendSelectionInfo.legendColumns.join(';');
        }
        return toRet;
    },
    
    get__origSelectionPresModel$1: function tab_SelectionModel$get__origSelectionPresModel$1() {
        return this.presModel;
    },
    
    isMarkSelected: function tab_SelectionModel$isMarkSelected(markId) {
        if (ss.isNullOrUndefined(this.get__origSelectionPresModel$1())) {
            tab.Log.get(this).warn("SelectionPresModel doesn't exist.");
            return false;
        }
        return (this.get_ids() || new Array(0)).contains(markId);
    },
    
    isLegendItemSelected: function tab_SelectionModel$isLegendItemSelected(item) {
        if (this.get_selectionType() !== 'legend-items') {
            return false;
        }
        if (ss.isNullOrUndefined(this._selectedLegendItemsLookup$1)) {
            this._selectedLegendItemsLookup$1 = {};
            if (ss.isValue(this.get_ids())) {
                var $enum1 = ss.IEnumerator.getEnumerator(this.get_ids());
                while ($enum1.moveNext()) {
                    var objectId = $enum1.current;
                    this._selectedLegendItemsLookup$1[objectId] = true;
                }
            }
        }
        return Object.keyExists(this._selectedLegendItemsLookup$1, item.objectId);
    },
    
    isAnyLegendItemSelected: function tab_SelectionModel$isAnyLegendItemSelected() {
        if (this.get_selectionType() !== 'legend-items') {
            return false;
        }
        if (ss.isValue(this.get_ids())) {
            return this.get_ids().length > 0;
        }
        return false;
    },
    
    isNodeSelected: function tab_SelectionModel$isNodeSelected(nodeGroup) {
        return ss.isValue(this._getNodeSelectionByPath$1(nodeGroup.columnIndices, nodeGroup.aliasIndices));
    },
    
    findNodeSelection: function tab_SelectionModel$findNodeSelection(nodeGroup) {
        return this._getNodeSelectionByPath$1(nodeGroup.columnIndices, nodeGroup.aliasIndices);
    },
    
    isNodeAncestorSelected: function tab_SelectionModel$isNodeAncestorSelected(nodeGroup) {
        if (ss.isNullOrUndefined(nodeGroup.columnIndices) || ss.isNullOrUndefined(nodeGroup.aliasIndices)) {
            return false;
        }
        for (var i = 1; i < nodeGroup.columnIndices.length; i++) {
            var ancestorCols = nodeGroup.columnIndices.extract(i);
            var ancestorVals = nodeGroup.aliasIndices.extract(i);
            if (ss.isValue(this._getNodeSelectionByPath$1(ancestorCols, ancestorVals))) {
                return true;
            }
        }
        return false;
    },
    
    setOverriddenTupleIds: function tab_SelectionModel$setOverriddenTupleIds(tupleIds) {
        if (this.get__origSelectionPresModel$1().selectionType !== 'tuples') {
            return;
        }
        if (_.isEqual(this._overriddenTupleIds$1, tupleIds) || (tab.MiscUtil.isNullOrEmpty(this._overriddenTupleIds$1) && tab.MiscUtil.isNullOrEmpty(tupleIds))) {
            return;
        }
        this._overriddenTupleIds$1 = tupleIds;
        this.raiseEvent(this.__newSelection$1);
    },
    
    update: function tab_SelectionModel$update(selectionPresModel) {
        if (this.isNewPresModelSameAsOld(selectionPresModel) && ss.isNullOrUndefined(this._overriddenTupleIds$1)) {
            return;
        }
        this._selectedNodesLookup$1 = null;
        this._selectedLegendItemsLookup$1 = null;
        this._overriddenTupleIds$1 = null;
        this.swapAndCopyPresModel(selectionPresModel);
        this.raiseEvent(this.__newSelection$1);
    },
    
    isNewPresModelSameAsOld: function tab_SelectionModel$isNewPresModelSameAsOld(newPM) {
        if (ss.isNullOrUndefined(this.presModel) !== ss.isNullOrUndefined(newPM)) {
            return false;
        }
        var newSelPM = newPM;
        if (newSelPM.selectionType !== this.get_selectionPresModel().selectionType) {
            return false;
        }
        if (ss.isValue(newSelPM.objectIds) && !_.isEqual(newSelPM.objectIds, this.get_selectionPresModel().objectIds)) {
            return false;
        }
        if (ss.isValue(newSelPM.selectedNodes) && !_.isEqual(newSelPM.selectedNodes, this.get_selectionPresModel().selectedNodes)) {
            return false;
        }
        if (ss.isValue(newSelPM.legendSelectionInfo) && !_.isEqual(newSelPM.legendSelectionInfo, this.get_selectionPresModel().legendSelectionInfo)) {
            return false;
        }
        return true;
    },
    
    _getNodeSelectionByPath$1: function tab_SelectionModel$_getNodeSelectionByPath$1(colIndices, valueIndices) {
        if (ss.isNullOrUndefined(colIndices) && ss.isNullOrUndefined(valueIndices)) {
            return null;
        }
        if (ss.isNullOrUndefined(this._selectedNodesLookup$1)) {
            this._selectedNodesLookup$1 = {};
            var pm = this.get__origSelectionPresModel$1();
            if (ss.isValue(pm.selectedNodes)) {
                var $enum1 = ss.IEnumerator.getEnumerator(pm.selectedNodes);
                while ($enum1.moveNext()) {
                    var nodePm = $enum1.current;
                    this._selectedNodesLookup$1[tab.SelectionModel._makeSelectionPair$1(nodePm.columnIndices, nodePm.aliasIndices)] = nodePm;
                }
            }
        }
        if (!Object.getKeyCount(this._selectedNodesLookup$1)) {
            return null;
        }
        return this._selectedNodesLookup$1[tab.SelectionModel._makeSelectionPair$1(colIndices, valueIndices)];
    },
    
    createSelectionToken: function tab_SelectionModel$createSelectionToken() {
        return this.get_selectionPresModel();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataSourceModel

tab.DataSourceModel = function tab_DataSourceModel(parent) {
    tab.DataSourceModel.initializeBase(this, [ parent, new tab.PresModelPathItem('dataSource') ]);
    this._fieldLookup$1 = {};
    this._fieldLookupGarbage$1 = {};
    this._drillPathLookup$1 = {};
    this._drillPathLookupGarbage$1 = {};
    this._folderLookup$1 = {};
    this._folderLookupGarbage$1 = {};
    this._tableLookup$1 = {};
    this._tableLookupGarbage$1 = {};
    this._rootFields$1 = [];
}
tab.DataSourceModel.splitGlobalFieldName = function tab_DataSourceModel$splitGlobalFieldName(fn) {
    return (tab.DataSourceModel._stripBrackets$1(fn)).split('].[');
}
tab.DataSourceModel._findColumnsAfter$1 = function tab_DataSourceModel$_findColumnsAfter$1(candidates, localName) {
    for (var i = 0; i < candidates.length; i++) {
        var each = candidates[i];
        if (each.get_localName() === localName && i < candidates.length - 1) {
            return _.last(candidates, candidates.length - i - 1);
        }
    }
    return null;
}
tab.DataSourceModel._stripBrackets$1 = function tab_DataSourceModel$_stripBrackets$1(name) {
    if ((name).length >= 2 && (name).charAt(0) === '[' && (name).charAt((name).length - 1) === ']') {
        return (name).substr(1, (name).length - 2);
    }
    return name;
}
tab.DataSourceModel.prototype = {
    _fieldLookup$1: null,
    _drillPathLookup$1: null,
    _folderLookup$1: null,
    _tableLookup$1: null,
    _rootFields$1: null,
    _fieldLookupGarbage$1: null,
    _folderLookupGarbage$1: null,
    _drillPathLookupGarbage$1: null,
    _tableLookupGarbage$1: null,
    _specifiedWidth$1: 0,
    
    get_name: function tab_DataSourceModel$get_name() {
        return this.get__dataSourcePresModel$1().datasource;
    },
    
    get_caption: function tab_DataSourceModel$get_caption() {
        return this.get__dataSourcePresModel$1().datasourceCaption;
    },
    
    get_fields: function tab_DataSourceModel$get_fields() {
        return this._rootFields$1;
    },
    
    get_dataSourceLayoutPresModel: function tab_DataSourceModel$get_dataSourceLayoutPresModel() {
        return this.get__dataSourcePresModel$1().dataSourceLayout;
    },
    
    get__dataSourcePresModel$1: function tab_DataSourceModel$get__dataSourcePresModel$1() {
        return this.presModel;
    },
    
    get_specifiedWidth: function tab_DataSourceModel$get_specifiedWidth() {
        return this._specifiedWidth$1;
    },
    set_specifiedWidth: function tab_DataSourceModel$set_specifiedWidth(value) {
        this._specifiedWidth$1 = value;
        return value;
    },
    
    getFieldIconResource: function tab_DataSourceModel$getFieldIconResource(index) {
        var iconDict = this.get__dataSourcePresModel$1().iconResDictionary;
        if (ss.isNullOrUndefined(iconDict)) {
            return '';
        }
        if (index < 0 || index >= iconDict.imageResources.length) {
            return 'invalid';
        }
        return iconDict.imageResources[index];
    },
    
    findField: function tab_DataSourceModel$findField(fn) {
        if (ss.isValue(this._fieldLookup$1) && Object.keyExists(this._fieldLookup$1, fn)) {
            return this._fieldLookup$1[fn];
        }
        return null;
    },
    
    findColumnDrillChain: function tab_DataSourceModel$findColumnDrillChain(column) {
        var result = null;
        var localName = column.get_localName();
        if (column.get_isColumn() && column.asColumn().get_isInstance()) {
            localName = tab.DataSourceModel._stripBrackets$1(column.asColumn().get_baseColumnName());
        }
        var $enum1 = ss.IEnumerator.getEnumerator(this.get_fields());
        while ($enum1.moveNext()) {
            var eachField = $enum1.current;
            switch (eachField.get_instanceType()) {
                case 'drillPath':
                    result = tab.DataSourceModel._findColumnsAfter$1(eachField.asDrillPath().get_levels(), localName);
                    if (ss.isValue(result)) {
                        return result;
                    }
                    break;
                case 'cubeDimension':
                    var $enum2 = ss.IEnumerator.getEnumerator(eachField.asDimension().get_hierarchies());
                    while ($enum2.moveNext()) {
                        var hier = $enum2.current;
                        result = tab.DataSourceModel._findColumnsAfter$1(hier.get_levels(), localName);
                        if (ss.isValue(result)) {
                            return result;
                        }
                    }
                    break;
            }
        }
        return result;
    },
    
    update: function tab_DataSourceModel$update(datasourcePresModel) {
        if (this.isNewPresModelSameAsOld(datasourcePresModel)) {
            return;
        }
        if (ss.isValue(datasourcePresModel.fieldList)) {
            this._rootFields$1.clear();
            this._fieldLookupGarbage$1 = $.extend({}, this._fieldLookup$1);
            this._folderLookupGarbage$1 = $.extend({}, this._folderLookup$1);
            this._drillPathLookupGarbage$1 = $.extend({}, this._drillPathLookup$1);
            this._tableLookupGarbage$1 = $.extend({}, this._tableLookup$1);
            var $enum1 = ss.IEnumerator.getEnumerator(datasourcePresModel.fieldList);
            while ($enum1.moveNext()) {
                var f = $enum1.current;
                switch (f.type) {
                    case 'field-folder':
                        this._remember$1(this._ensureFolder$1(f), true);
                        break;
                    case 'drill-path':
                        var levels = [];
                        var $enum2 = ss.IEnumerator.getEnumerator((f).columnList);
                        while ($enum2.moveNext()) {
                            var child = $enum2.current;
                            levels.add(this._ensureColumn$1(child));
                            this._remember$1(levels[levels.length - 1], false);
                        }
                        this._remember$1(this._ensureDrillPath$1(f, levels), true);
                        break;
                    case 'relational-table':
                        var cols = [];
                        var $enum3 = ss.IEnumerator.getEnumerator((f).columnList);
                        while ($enum3.moveNext()) {
                            var child = $enum3.current;
                            cols.add(this._ensureColumn$1(child));
                            this._remember$1(cols[cols.length - 1], false);
                        }
                        this._remember$1(this._ensureRelationalTable$1(f, cols), true);
                        break;
                    case 'dimension':
                        this._remember$1(this._ensureCubeDimensionRecursively$1(f), true);
                        break;
                    case 'display-folder':
                        var folder = f;
                        var folderHierarchies = [];
                        var folderColumns = [];
                        var $enum4 = ss.IEnumerator.getEnumerator(folder.hierarchyList);
                        while ($enum4.moveNext()) {
                            var child = $enum4.current;
                            var hierLevels = [];
                            var $enum5 = ss.IEnumerator.getEnumerator(child.columnList);
                            while ($enum5.moveNext()) {
                                var level = $enum5.current;
                                hierLevels.add(this._ensureColumn$1(level));
                                this._remember$1(hierLevels[hierLevels.length - 1], false);
                            }
                            folderHierarchies.add(this._ensureCubeHierarchy$1(child, hierLevels));
                            this._remember$1(folderHierarchies[folderHierarchies.length - 1], false);
                        }
                        var $enum6 = ss.IEnumerator.getEnumerator(folder.columnList);
                        while ($enum6.moveNext()) {
                            var child = $enum6.current;
                            var column = this._ensureColumn$1(child);
                            folderColumns.add(column);
                            this._remember$1(column, false);
                        }
                        this._remember$1(this._ensureCubeFolder$1(folder, folderHierarchies, folderColumns), true);
                        break;
                    case 'group':
                        this._remember$1(this._ensureGroup$1(f), true);
                        break;
                    case 'column':
                        this._remember$1(this._ensureColumn$1(f), true);
                        break;
                }
            }
            var $dict7 = this._folderLookup$1;
            for (var $key8 in $dict7) {
                var pair = { key: $key8, value: $dict7[$key8] };
                var folder = pair.value;
                var pm = folder.get_presModel();
                var fields = [];
                var $enum9 = ss.IEnumerator.getEnumerator(pm.namesOfFields);
                while ($enum9.moveNext()) {
                    var fn = $enum9.current;
                    var matchingField = (Object.keyExists(this._fieldLookup$1, fn)) ? this._fieldLookup$1[fn] : null;
                    if (ss.isValue(matchingField)) {
                        fields.add(matchingField);
                        this._rootFields$1.remove(matchingField);
                    }
                }
                var $enum10 = ss.IEnumerator.getEnumerator(pm.drillpathVector);
                while ($enum10.moveNext()) {
                    var pathName = $enum10.current;
                    var matchingPath = (Object.keyExists(this._drillPathLookup$1, pathName)) ? this._drillPathLookup$1[pathName] : null;
                    if (ss.isValue(matchingPath)) {
                        fields.add(matchingPath);
                        this._rootFields$1.remove(matchingPath);
                    }
                }
                folder.update(pm, fields);
            }
            if (ss.isValue(datasourcePresModel.columnList)) {
                var $enum11 = ss.IEnumerator.getEnumerator(datasourcePresModel.columnList);
                while ($enum11.moveNext()) {
                    var instance = $enum11.current;
                    this._remember$1(this._ensureColumn$1(instance), false);
                }
            }
            this._collectGarbage$1();
        }
        else {
            this._rootFields$1.clear();
            Object.clearKeys(this._fieldLookup$1);
            Object.clearKeys(this._drillPathLookup$1);
            Object.clearKeys(this._folderLookup$1);
            Object.clearKeys(this._tableLookup$1);
        }
        this.swapAndCopyPresModel(datasourcePresModel);
    },
    
    _rememberRoot$1: function tab_DataSourceModel$_rememberRoot$1(model) {
        this._rootFields$1.add(model);
    },
    
    _remember$1: function tab_DataSourceModel$_remember$1(model, isTopLevel) {
        if (model.get_isColumn() && !model.asColumn().get_isInstance()) {
            delete this._fieldLookupGarbage$1[model.get_localName()];
            this._fieldLookup$1[model.get_localName()] = model;
        }
        var key = model.get_globalName() || model.get_localName();
        switch (model.get_instanceType()) {
            case 'drillPath':
                this._drillPathLookup$1[key] = model;
                delete this._drillPathLookupGarbage$1[key];
                break;
            case 'folder':
                key = key + (model).get_folderRole();
                this._folderLookup$1[key] = model;
                delete this._folderLookupGarbage$1[key];
                break;
            case 'relationalTable':
                this._tableLookup$1[key] = model;
                delete this._tableLookupGarbage$1[key];
                break;
            default:
                this._fieldLookup$1[key] = model;
                delete this._fieldLookupGarbage$1[key];
                break;
        }
        if (isTopLevel) {
            this._rememberRoot$1(model);
        }
    },
    
    _collectGarbage$1: function tab_DataSourceModel$_collectGarbage$1() {
        var $dict1 = this._fieldLookupGarbage$1;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            tab.Log.get(this).debug('Removing field: %s, %o', pair.key, pair.value);
            delete this._fieldLookup$1[pair.key];
        }
        Object.clearKeys(this._fieldLookupGarbage$1);
        var $dict3 = this._drillPathLookupGarbage$1;
        for (var $key4 in $dict3) {
            var pair = { key: $key4, value: $dict3[$key4] };
            delete this._drillPathLookup$1[pair.key];
        }
        Object.clearKeys(this._drillPathLookupGarbage$1);
        var $dict5 = this._folderLookupGarbage$1;
        for (var $key6 in $dict5) {
            var pair = { key: $key6, value: $dict5[$key6] };
            delete this._folderLookup$1[pair.key];
        }
        Object.clearKeys(this._folderLookupGarbage$1);
        var $dict7 = this._tableLookupGarbage$1;
        for (var $key8 in $dict7) {
            var pair = { key: $key8, value: $dict7[$key8] };
            delete this._tableLookup$1[pair.key];
        }
        Object.clearKeys(this._tableLookupGarbage$1);
    },
    
    _ensureDrillPath$1: function tab_DataSourceModel$_ensureDrillPath$1(pm, levels) {
        var drillPath = null;
        if (Object.keyExists(this._drillPathLookup$1, pm.name)) {
            var model = this._drillPathLookup$1[pm.name];
            if (model.get_isDrillPath()) {
                drillPath = model;
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(drillPath)) {
            drillPath = new tab.DrillPathModel(this);
        }
        drillPath.update(pm, levels);
        return drillPath;
    },
    
    _ensureFolder$1: function tab_DataSourceModel$_ensureFolder$1(pm) {
        var folder = null;
        var key = pm.name + pm.folderRole;
        if (Object.keyExists(this._folderLookup$1, key)) {
            var model = this._folderLookup$1[key];
            if (model.get_isFolder()) {
                folder = model;
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(folder)) {
            folder = new tab.FolderModel(this);
        }
        folder.update(pm, []);
        return folder;
    },
    
    _ensureColumn$1: function tab_DataSourceModel$_ensureColumn$1(pm) {
        var col = null;
        if (Object.keyExists(this._fieldLookup$1, pm.fn)) {
            var model = this._fieldLookup$1[pm.fn];
            if (model.get_isColumn()) {
                col = model.asColumn();
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(col)) {
            col = new tab.FieldColumnModel(this);
        }
        col.update(pm);
        return col;
    },
    
    _ensureGroup$1: function tab_DataSourceModel$_ensureGroup$1(pm) {
        var group = null;
        if (Object.keyExists(this._fieldLookup$1, pm.fn)) {
            var model = this._fieldLookup$1[pm.fn];
            if (model.get_isGroup()) {
                group = model.asGroup();
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(group)) {
            group = new tab.GroupModel(this);
        }
        group.update(pm);
        return group;
    },
    
    _ensureRelationalTable$1: function tab_DataSourceModel$_ensureRelationalTable$1(pm, cols) {
        var table = null;
        if (Object.keyExists(this._tableLookup$1, pm.name)) {
            var model = this._tableLookup$1[pm.name];
            if (model.get_isRelationalTable()) {
                table = model.asRelationalTable();
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(table)) {
            table = new tab.RelationalTableModel(this);
        }
        table.update(pm, cols);
        return table;
    },
    
    _ensureCubeDimensionRecursively$1: function tab_DataSourceModel$_ensureCubeDimensionRecursively$1(pm) {
        var hierarchies = [];
        var $enum1 = ss.IEnumerator.getEnumerator(pm.hierarchyList);
        while ($enum1.moveNext()) {
            var h = $enum1.current;
            var hierLevels = [];
            var $enum2 = ss.IEnumerator.getEnumerator(h.columnList);
            while ($enum2.moveNext()) {
                var child = $enum2.current;
                hierLevels.add(this._ensureColumn$1(child));
                this._remember$1(hierLevels[hierLevels.length - 1], false);
            }
            hierarchies.add(this._ensureCubeHierarchy$1(h, hierLevels));
            this._remember$1(hierarchies[hierarchies.length - 1], false);
        }
        var folders = [];
        var $enum3 = ss.IEnumerator.getEnumerator(pm.displayFolderList);
        while ($enum3.moveNext()) {
            var folder = $enum3.current;
            var folderHierarchies = [];
            var folderColumns = [];
            var $enum4 = ss.IEnumerator.getEnumerator(folder.hierarchyList);
            while ($enum4.moveNext()) {
                var child = $enum4.current;
                var hierLevels = [];
                var $enum5 = ss.IEnumerator.getEnumerator(child.columnList);
                while ($enum5.moveNext()) {
                    var level = $enum5.current;
                    hierLevels.add(this._ensureColumn$1(level));
                    this._remember$1(hierLevels[hierLevels.length - 1], false);
                }
                folderHierarchies.add(this._ensureCubeHierarchy$1(child, hierLevels));
                this._remember$1(folderHierarchies[folderHierarchies.length - 1], false);
            }
            var $enum6 = ss.IEnumerator.getEnumerator(folder.columnList);
            while ($enum6.moveNext()) {
                var child = $enum6.current;
                folderColumns.add(this._ensureColumn$1(child));
            }
            folders.add(this._ensureCubeFolder$1(folder, folderHierarchies, folderColumns));
        }
        var attributes = [];
        var $enum7 = ss.IEnumerator.getEnumerator(pm.attributeDimensionList);
        while ($enum7.moveNext()) {
            var attribute = $enum7.current;
            attributes.add(this._ensureCubeDimensionRecursively$1(attribute));
        }
        return this._ensureCubeDimension$1(pm, hierarchies, folders, attributes);
    },
    
    _ensureCubeDimension$1: function tab_DataSourceModel$_ensureCubeDimension$1(pm, hierarchies, folders, attributes) {
        var dimModel = null;
        if (Object.keyExists(this._fieldLookup$1, pm.fn)) {
            var model = this._fieldLookup$1[pm.fn];
            if (model.get_isCubeDimension()) {
                dimModel = model.asDimension();
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(dimModel)) {
            dimModel = new tab.CubeDimensionModel(this);
        }
        dimModel.update(pm, hierarchies, folders, attributes);
        return dimModel;
    },
    
    _ensureCubeHierarchy$1: function tab_DataSourceModel$_ensureCubeHierarchy$1(pm, levels) {
        var cubeHierarchy = null;
        if (Object.keyExists(this._fieldLookup$1, pm.fn)) {
            var model = this._fieldLookup$1[pm.fn];
            if (model.get_isCubeHierarchy()) {
                cubeHierarchy = model.asHierarchy();
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(cubeHierarchy)) {
            cubeHierarchy = new tab.CubeHierarchyModel(this);
        }
        cubeHierarchy.update(pm, levels);
        return cubeHierarchy;
    },
    
    _ensureCubeFolder$1: function tab_DataSourceModel$_ensureCubeFolder$1(pm, hiers, columns) {
        var cubeFolder = null;
        if (Object.keyExists(this._fieldLookup$1, pm.name)) {
            var model = this._fieldLookup$1[pm.name];
            if (model.get_isCubeFolder()) {
                cubeFolder = model.asCubeFolder();
            }
            else {
                tab.Log.get(this).warn('Field type changed: oldModel=%o, newPm=%o', model, pm);
            }
        }
        if (ss.isNullOrUndefined(cubeFolder)) {
            cubeFolder = new tab.CubeFolderModel(this);
        }
        cubeFolder.update(pm, hiers, columns);
        return cubeFolder;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LayerEncodingModel

tab.LayerEncodingModel = function tab_LayerEncodingModel(parent, paneSpecId) {
    tab.LayerEncodingModel.initializeBase(this, [ parent, new tab.PresModelPathItem('layer-encoding[' + paneSpecId + ']') ]);
    this._markSizeModel$1 = new tab.MarkSizeModel(this);
}
tab.LayerEncodingModel.prototype = {
    _markSizeModel$1: null,
    
    add_newLayerEncoding: function tab_LayerEncodingModel$add_newLayerEncoding(value) {
        this.__newLayerEncoding$1 = ss.Delegate.combine(this.__newLayerEncoding$1, value);
    },
    remove_newLayerEncoding: function tab_LayerEncodingModel$remove_newLayerEncoding(value) {
        this.__newLayerEncoding$1 = ss.Delegate.remove(this.__newLayerEncoding$1, value);
    },
    
    __newLayerEncoding$1: null,
    
    get_id: function tab_LayerEncodingModel$get_id() {
        return this.get_layerPresModel().paneSpec;
    },
    
    get_name: function tab_LayerEncodingModel$get_name() {
        return this.get_layerPresModel().name;
    },
    
    get_isTableCalc: function tab_LayerEncodingModel$get_isTableCalc() {
        return this.get_layerPresModel().isTableCalc;
    },
    
    get_encodings: function tab_LayerEncodingModel$get_encodings() {
        return _.filter(this.get_layerPresModel().encodingUiItems, function(pm) {
            return pm.isVisible && pm.isEnabled;
        });
    },
    
    get_textEncodingDropdown: function tab_LayerEncodingModel$get_textEncodingDropdown() {
        return this.getDropdownPresModel('text-encoding');
    },
    
    get_colorEncodingDropdown: function tab_LayerEncodingModel$get_colorEncodingDropdown() {
        return this.getDropdownPresModel('color-encoding');
    },
    
    get_currentPrimitiveType: function tab_LayerEncodingModel$get_currentPrimitiveType() {
        var selected = _.find(this.get_primitiveTypes(), function(pt) {
            return pt.isSelected;
        });
        return selected;
    },
    
    get_primitiveTypes: function tab_LayerEncodingModel$get_primitiveTypes() {
        return _.filter(this.get_layerPresModel().primitiveTypeUiItems, function(pm) {
            return pm.isVisible && pm.isEnabled;
        });
    },
    
    get_markSizeModel: function tab_LayerEncodingModel$get_markSizeModel() {
        return this._markSizeModel$1;
    },
    
    get_layerPresModel: function tab_LayerEncodingModel$get_layerPresModel() {
        return this.presModel;
    },
    
    update: function tab_LayerEncodingModel$update(newPresModel) {
        this.simpleSwapToUpdate(newPresModel, this.__newLayerEncoding$1);
        if (ss.isNullOrUndefined(this._markSizeModel$1)) {
            this._markSizeModel$1 = new tab.MarkSizeModel(this);
        }
        this._markSizeModel$1.update(this.getDropdownPresModel('size-encoding'));
    },
    
    equals: function tab_LayerEncodingModel$equals(pm) {
        return this.get_id() === pm.paneSpec;
    },
    
    getDropdownPresModel: function tab_LayerEncodingModel$getDropdownPresModel(encoding) {
        var encodings = _.filter(this.get_layerPresModel().encodingUiItems, function(pm) {
            return pm.isVisible && pm.isEnabled && pm.encodingType === encoding;
        });
        if (ss.isNullOrUndefined(encodings) || encodings.length !== 1) {
            return null;
        }
        return encodings[0].marksCardDropdownItem;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarksCardModel

tab.MarksCardModel = function tab_MarksCardModel(parent) {
    this._layers$1 = [];
    tab.MarksCardModel.initializeBase(this, [ parent, new tab.PresModelPathItem('marks-card') ]);
}
tab.MarksCardModel.prototype = {
    _activePaneSpecId$1: null,
    
    add_newMarksCard: function tab_MarksCardModel$add_newMarksCard(value) {
        this.__newMarksCard$1 = ss.Delegate.combine(this.__newMarksCard$1, value);
    },
    remove_newMarksCard: function tab_MarksCardModel$remove_newMarksCard(value) {
        this.__newMarksCard$1 = ss.Delegate.remove(this.__newMarksCard$1, value);
    },
    
    __newMarksCard$1: null,
    
    get_layers: function tab_MarksCardModel$get_layers() {
        return this._layers$1;
    },
    
    get_activePaneSpecId: function tab_MarksCardModel$get_activePaneSpecId() {
        return this._activePaneSpecId$1;
    },
    set_activePaneSpecId: function tab_MarksCardModel$set_activePaneSpecId(value) {
        this._activePaneSpecId$1 = value;
        return value;
    },
    
    update: function tab_MarksCardModel$update(newPresModel) {
        if (this.isNewPresModelSameAsOld(newPresModel)) {
            return;
        }
        var newLayers = [];
        if (ss.isValue(newPresModel) && ss.isValue(newPresModel.layer)) {
            this._updateHelper$1(newPresModel.layer, newLayers);
        }
        if (ss.isValue(newPresModel) && ss.isValue(newPresModel.layers)) {
            var $enum1 = ss.IEnumerator.getEnumerator(newPresModel.layers);
            while ($enum1.moveNext()) {
                var layerPM = $enum1.current;
                this._updateHelper$1(layerPM, newLayers);
            }
        }
        this._layers$1 = newLayers;
        this.swapAndCopyPresModel(newPresModel);
        this.raiseEvent(this.__newMarksCard$1);
    },
    
    _updateHelper$1: function tab_MarksCardModel$_updateHelper$1(layer, newLayers) {
        var m = _.find(this._layers$1, function(model) {
            return model.equals(layer);
        });
        if (ss.isNullOrUndefined(m)) {
            m = new tab.LayerEncodingModel(this, layer.paneSpec);
        }
        m.update(layer);
        newLayers.add(m);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarkSizeModel

tab.MarkSizeModel = function tab_MarkSizeModel(parent) {
    tab.MarkSizeModel.initializeBase(this, [ parent, new tab.PresModelPathItem('mark-size') ]);
    this._parentModel$1 = parent;
}
tab.MarkSizeModel.prototype = {
    _parentModel$1: null,
    _transform$1: null,
    
    add_sliderFractionUpdated: function tab_MarkSizeModel$add_sliderFractionUpdated(value) {
        this.__sliderFractionUpdated$1 = ss.Delegate.combine(this.__sliderFractionUpdated$1, value);
    },
    remove_sliderFractionUpdated: function tab_MarkSizeModel$remove_sliderFractionUpdated(value) {
        this.__sliderFractionUpdated$1 = ss.Delegate.remove(this.__sliderFractionUpdated$1, value);
    },
    
    __sliderFractionUpdated$1: null,
    
    get_markSizePresModel: function tab_MarkSizeModel$get_markSizePresModel() {
        return this.presModel;
    },
    
    get_explanation: function tab_MarkSizeModel$get_explanation() {
        return this.get_markSizePresModel().explanation;
    },
    
    get_minMarkSize: function tab_MarkSizeModel$get_minMarkSize() {
        return this.get_markSizePresModel().minMarkSize;
    },
    
    get_maxMarkSize: function tab_MarkSizeModel$get_maxMarkSize() {
        return this.get_markSizePresModel().maxMarkSize;
    },
    
    get_currentMarkSize: function tab_MarkSizeModel$get_currentMarkSize() {
        return this.get_markSizePresModel().markSize;
    },
    
    get_currentSliderFraction: function tab_MarkSizeModel$get_currentSliderFraction() {
        return this._transform$1.valueToFraction(this.get_currentMarkSize());
    },
    
    get_transform: function tab_MarkSizeModel$get_transform() {
        return this._transform$1;
    },
    
    get_parentModel: function tab_MarkSizeModel$get_parentModel() {
        return this._parentModel$1;
    },
    
    getCurrentFraction: function tab_MarkSizeModel$getCurrentFraction() {
        return this.get_currentSliderFraction();
    },
    
    setCurrentFraction: function tab_MarkSizeModel$setCurrentFraction(newValue) {
    },
    
    markSizeUpdated: function tab_MarkSizeModel$markSizeUpdated() {
        if (ss.isValue(this.__sliderFractionUpdated$1)) {
            this.__sliderFractionUpdated$1(this.get_currentSliderFraction());
        }
    },
    
    update: function tab_MarkSizeModel$update(pmodel) {
        if (ss.isValue(pmodel)) {
            this._updateTransformFor$1(pmodel);
        }
        this.simpleSwapToUpdate(pmodel, ss.Delegate.create(this, this.markSizeUpdated));
    },
    
    _updateTransformFor$1: function tab_MarkSizeModel$_updateTransformFor$1(presModel) {
        switch (presModel.inflectionPoints.length) {
            case 0:
                this._transform$1 = new tab.LinearRangeTransform(presModel.minMarkSize, presModel.maxMarkSize);
                break;
            case 1:
                var point = presModel.inflectionPoints[0];
                this._transform$1 = new tab.AcceleratingRangeTransform(presModel.minMarkSize, presModel.maxMarkSize, point.inflectionFraction, point.inflectionValue, point.inflectionFraction, point.inflectionValue);
                break;
            case 2:
            default:
                var point1 = presModel.inflectionPoints[0];
                var point2 = presModel.inflectionPoints[1];
                this._transform$1 = new tab.AcceleratingRangeTransform(presModel.minMarkSize, presModel.maxMarkSize, point1.inflectionFraction, point1.inflectionValue, point2.inflectionFraction, point2.inflectionValue);
                break;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataSchemaModel

tab.DataSchemaModel = function tab_DataSchemaModel(parent) {
    tab.DataSchemaModel.initializeBase(this, [ parent, new tab.PresModelPathItem('dataSchema') ]);
    this._dataSourceModels$1 = [];
}
tab.DataSchemaModel.prototype = {
    _dataSourceModels$1: null,
    
    add_newDataSchema: function tab_DataSchemaModel$add_newDataSchema(value) {
        this.__newDataSchema$1 = ss.Delegate.combine(this.__newDataSchema$1, value);
    },
    remove_newDataSchema: function tab_DataSchemaModel$remove_newDataSchema(value) {
        this.__newDataSchema$1 = ss.Delegate.remove(this.__newDataSchema$1, value);
    },
    
    __newDataSchema$1: null,
    
    get_parametersDataSource: function tab_DataSchemaModel$get_parametersDataSource() {
        if (ss.isNullOrUndefined(this.get_dataSchemaPresModel())) {
            return null;
        }
        var $enum1 = ss.IEnumerator.getEnumerator(this._dataSourceModels$1);
        while ($enum1.moveNext()) {
            var dataSourceModel = $enum1.current;
            if (dataSourceModel.get_name() === this.get_dataSchemaPresModel().parametersDatasource) {
                return dataSourceModel;
            }
        }
        return null;
    },
    
    get_dataSchemaPresModel: function tab_DataSchemaModel$get_dataSchemaPresModel() {
        return this.presModel;
    },
    
    get_dataSources: function tab_DataSchemaModel$get_dataSources() {
        return this._dataSourceModels$1;
    },
    
    getDefaultDataSourceForSheet: function tab_DataSchemaModel$getDefaultDataSourceForSheet(sheetName) {
        if (ss.isNullOrUndefined(this.get_dataSchemaPresModel())) {
            return null;
        }
        var primaryDatasourceName = null;
        if (Object.keyExists(this.get_dataSchemaPresModel().worksheetDataSchemaMap, sheetName)) {
            primaryDatasourceName = this.get_dataSchemaPresModel().worksheetDataSchemaMap[sheetName].primaryDatasource;
        }
        if (String.isNullOrEmpty(primaryDatasourceName)) {
            return _.chain(this._dataSourceModels$1).filter(ss.Delegate.create(this, function(model) {
                return model.get_name() !== this.get_dataSchemaPresModel().parametersDatasource;
            })).last().value();
        }
        return _.find(this._dataSourceModels$1, function(model) {
            return model.get_name() === primaryDatasourceName;
        });
    },
    
    getDataSourceCount: function tab_DataSchemaModel$getDataSourceCount(includeParameters) {
        if (includeParameters || ss.isNullOrUndefined(this.get_parametersDataSource())) {
            return this.get_dataSources().length;
        }
        else {
            return this.get_dataSources().length - 1;
        }
    },
    
    findField: function tab_DataSchemaModel$findField(globalFieldName) {
        var model = this.findDataSourceFromGlobalFieldName(globalFieldName);
        if (ss.isNullOrUndefined(model)) {
            return null;
        }
        return model.findField(globalFieldName);
    },
    
    findDataSourceByName: function tab_DataSchemaModel$findDataSourceByName(datasourceName) {
        return _.find(this.get_dataSources(), function(model) {
            return model.get_name().toString() === datasourceName;
        });
    },
    
    findDataSourceFromGlobalFieldName: function tab_DataSchemaModel$findDataSourceFromGlobalFieldName(fn) {
        var fieldNameParts = tab.DataSourceModel.splitGlobalFieldName(fn);
        if (fieldNameParts.length <= 1) {
            return null;
        }
        var sourceName = fieldNameParts[0].replace(new RegExp('\\]\\]'), ']');
        return this.findDataSourceByName(sourceName);
    },
    
    dataSourceForField: function tab_DataSchemaModel$dataSourceForField(field) {
        return this.findDataSourceFromGlobalFieldName(field.get_globalName());
    },
    
    update: function tab_DataSchemaModel$update(newPresModel) {
        if (this.isNewPresModelSameAsOld(newPresModel)) {
            return;
        }
        tab.Log.get(this).debug('Updating DataSchemaModel');
        var dataSourcePresModels = (ss.isValue(newPresModel) && ss.isValue(newPresModel.dataSources)) ? newPresModel.dataSources.dataSourceList : new Array(0);
        var toRemove = this._dataSourceModels$1.clone();
        var $enum1 = ss.IEnumerator.getEnumerator(dataSourcePresModels);
        while ($enum1.moveNext()) {
            var dataSourcePresModel = $enum1.current;
            var dataSourceModel = _.find(this._dataSourceModels$1, function(m) {
                return m.get_name() === dataSourcePresModel.datasource;
            });
            if (ss.isNullOrUndefined(dataSourceModel)) {
                dataSourceModel = new tab.DataSourceModel(this);
                this._dataSourceModels$1.add(dataSourceModel);
            }
            else {
                toRemove.remove(dataSourceModel);
            }
            dataSourceModel.update(dataSourcePresModel);
        }
        var $enum2 = ss.IEnumerator.getEnumerator(toRemove);
        while ($enum2.moveNext()) {
            var model = $enum2.current;
            tab.Log.get(this).debug('Removing data source: %o', model);
            this._dataSourceModels$1.remove(model);
        }
        this.swapAndCopyPresModel(newPresModel);
        this.raiseEvent(this.__newDataSchema$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillModel

tab.PillModel = function tab_PillModel(parent, index) {
    tab.PillModel.initializeBase(this, [ parent, new tab.PresModelPathItem(index.toString()) ]);
}
tab.PillModel.prototype = {
    _column$1: null,
    
    get_encodingType: function tab_PillModel$get_encodingType() {
        if (ss.isNullOrUndefined(this.get_item()) || ss.isNullOrUndefined(this.get_item().encodingType)) {
            return 'invalid-encoding';
        }
        return this.get_item().encodingType;
    },
    
    get_alternateEncodings: function tab_PillModel$get_alternateEncodings() {
        if (ss.isNullOrUndefined(this.get_item()) || ss.isNullOrUndefined(this.get_item().encodingUiItems)) {
            return [];
        }
        return _.filter(this.get_item().encodingUiItems, function(pm) {
            return pm.isVisible && pm.isEnabled;
        });
    },
    
    get_filterType: function tab_PillModel$get_filterType() {
        if (ss.isNullOrUndefined(this.get_item()) || ss.isNullOrUndefined(this.get_item().filterIconType)) {
            return 'no-filter';
        }
        return this.get_item().filterIconType;
    },
    
    get_hasDrill: function tab_PillModel$get_hasDrill() {
        return (this.get_item().hasDrill || false);
    },
    
    get_shouldDrill: function tab_PillModel$get_shouldDrill() {
        return this.get_hasDrill() && (this.get_item().shouldDrill || false);
    },
    
    get_item: function tab_PillModel$get_item() {
        return this.presModel;
    },
    
    get_column: function tab_PillModel$get_column() {
        return this._column$1;
    },
    
    get_tooltip: function tab_PillModel$get_tooltip() {
        return tableau.format.stripFormattedText(this.get_item().tooltip);
    },
    
    get_sideIconToolip: function tab_PillModel$get_sideIconToolip() {
        return tableau.format.stripFormattedText(this.get_item().iconTooltip);
    },
    
    get_displayName: function tab_PillModel$get_displayName() {
        return this.get_item().displayText;
    },
    
    get_contextMenuCommands: function tab_PillModel$get_contextMenuCommands() {
        return this.get_item().commands;
    },
    
    get_isMultipleFields: function tab_PillModel$get_isMultipleFields() {
        return this.get_item().encodingType !== 'invalid-encoding' && Type.canCast(this._column$1, tab.MultipleFieldsModel);
    },
    
    update: function tab_PillModel$update(item, newColumn) {
        if (this.isNewPresModelSameAsOld(item)) {
            return;
        }
        this._column$1 = newColumn;
        this.swapAndCopyPresModel(item);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfModel

tab.ShelfModel = function tab_ShelfModel(parent, index) {
    tab.ShelfModel.initializeBase(this, [ parent, new tab.PresModelPathItem(index.toString()) ]);
}
tab.ShelfModel.prototype = {
    _pills$1: null,
    
    add_shelfChanged: function tab_ShelfModel$add_shelfChanged(value) {
        this.__shelfChanged$1 = ss.Delegate.combine(this.__shelfChanged$1, value);
    },
    remove_shelfChanged: function tab_ShelfModel$remove_shelfChanged(value) {
        this.__shelfChanged$1 = ss.Delegate.remove(this.__shelfChanged$1, value);
    },
    
    __shelfChanged$1: null,
    
    get_paneId: function tab_ShelfModel$get_paneId() {
        return (ss.isValue(this.get__shelf$1().paneSpec)) ? this.get__shelf$1().paneSpec : 0;
    },
    
    get_shelfType: function tab_ShelfModel$get_shelfType() {
        return this.get__shelf$1().shelfType;
    },
    
    get_pills: function tab_ShelfModel$get_pills() {
        return this._pills$1;
    },
    
    get_tooltip: function tab_ShelfModel$get_tooltip() {
        return tableau.format.stripFormattedText(this.get__shelf$1().tooltip);
    },
    
    get__shelf$1: function tab_ShelfModel$get__shelf$1() {
        return this.get_presModel();
    },
    
    update: function tab_ShelfModel$update(shelf, schema) {
        if (this.isNewPresModelSameAsOld(shelf)) {
            return;
        }
        if (ss.isNull(shelf.shelfItems)) {
            this._pills$1 = [];
        }
        else if (ss.isValue(shelf.shelfItems)) {
            var newPills = [];
            var arrayModel = new tab.ShelfItemsArrayModel(this);
            for (var i = 0; i < shelf.shelfItems.length; i++) {
                var shelfItem = shelf.shelfItems[i];
                var fieldName = shelfItem.fn;
                var col;
                if (String.isNullOrEmpty(fieldName) && shelf.shelfType === 'encoding-shelf') {
                    col = new tab.MultipleFieldsModel();
                }
                else {
                    col = schema.findField(fieldName);
                }
                if (ss.isNullOrUndefined(col)) {
                    tab.Logger.getLogger(tab.ShelvesModel).warn('Unable to locate field, invalidating pill: %s', fieldName);
                    shelfItem.isInvalid = true;
                }
                if (shelfItem.isInvalid) {
                    var fakeColumn = new tab.FieldColumnModel(schema.findDataSourceFromGlobalFieldName(fieldName));
                    var fakePresModel = {};
                    fakePresModel.type = 'column';
                    fakePresModel.fn = fieldName;
                    fakePresModel.description = fieldName;
                    fakePresModel.fieldIconIdx = 0;
                    fakeColumn.update(fakePresModel);
                    col = fakeColumn;
                }
                var p = new tab.PillModel(arrayModel, i);
                p.update(shelfItem, col);
                newPills.add(p);
            }
            this._pills$1 = newPills;
        }
        this.swapAndCopyPresModel(shelf);
        this.raiseEvent(this.__shelfChanged$1, this);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfItemsArrayModel

tab.ShelfItemsArrayModel = function tab_ShelfItemsArrayModel(parent) {
    tab.ShelfItemsArrayModel.initializeBase(this, [ parent, new tab.PresModelPathItem('shelfItems', 1) ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.VisualModel

tab.VisualModel = function tab_VisualModel(parent) {
    this._filterModels$1 = {};
    tab.VisualModel.initializeBase(this, [ parent, new tab.PresModelPathItem('visual') ]);
    this._hiddenTuples$1 = {};
    this._allHiddenTuples$1 = {};
    this._filteredTuples$1 = {};
    this._allFilteredTuples$1 = {};
    this._selectionsModel$1 = new tab.SelectionsModel(this, 'selectionList');
    this._impliedSelectionModel$1 = new tab.SelectionModel(null, -1);
    this._brushingsModel$1 = new tab.SelectionsModel(this, 'brushingSelectionList');
    this._visualIsValid$1 = true;
    this._brushedFromAction$1 = false;
    this._impliedSelectionModel$1.update(tab.SelectionsModel._createEmptySelectionPm('tuples'));
}
tab.VisualModel.get__log$1 = function tab_VisualModel$get__log$1() {
    return tab.Logger.lazyGetLogger(tab.VisualModel);
}
tab.VisualModel.prototype = {
    _selectionsModel$1: null,
    _impliedSelectionModel$1: null,
    _brushingsModel$1: null,
    _filtersJSON$1: null,
    _analyticsModel$1: null,
    _shelvesModel$1: null,
    _sceneModel$1: null,
    _labelsModel$1: null,
    _marksCardModel$1: null,
    _mapServerModel$1: null,
    _showMeModel$1: null,
    _vizDataModel$1: null,
    _captionModel$1: null,
    _titleModel$1: null,
    _sortIndicatorsModel$1: null,
    _geometryModel$1: null,
    _hiddenTuples$1: null,
    _allHiddenTuples$1: null,
    _filteredTuples$1: null,
    _allFilteredTuples$1: null,
    _cacheUrlInfo$1: null,
    _visualIsValid$1: false,
    _brushedFromAction$1: false,
    
    add_newVisual: function tab_VisualModel$add_newVisual(value) {
        this.__newVisual$1 = ss.Delegate.combine(this.__newVisual$1, value);
    },
    remove_newVisual: function tab_VisualModel$remove_newVisual(value) {
        this.__newVisual$1 = ss.Delegate.remove(this.__newVisual$1, value);
    },
    
    __newVisual$1: null,
    
    add_newHiddenTuples: function tab_VisualModel$add_newHiddenTuples(value) {
        this.__newHiddenTuples$1 = ss.Delegate.combine(this.__newHiddenTuples$1, value);
    },
    remove_newHiddenTuples: function tab_VisualModel$remove_newHiddenTuples(value) {
        this.__newHiddenTuples$1 = ss.Delegate.remove(this.__newHiddenTuples$1, value);
    },
    
    __newHiddenTuples$1: null,
    
    add_newFilteredTuples: function tab_VisualModel$add_newFilteredTuples(value) {
        this.__newFilteredTuples$1 = ss.Delegate.combine(this.__newFilteredTuples$1, value);
    },
    remove_newFilteredTuples: function tab_VisualModel$remove_newFilteredTuples(value) {
        this.__newFilteredTuples$1 = ss.Delegate.remove(this.__newFilteredTuples$1, value);
    },
    
    __newFilteredTuples$1: null,
    
    add_urlInfoCacheChange: function tab_VisualModel$add_urlInfoCacheChange(value) {
        this.__urlInfoCacheChange$1 = ss.Delegate.combine(this.__urlInfoCacheChange$1, value);
    },
    remove_urlInfoCacheChange: function tab_VisualModel$remove_urlInfoCacheChange(value) {
        this.__urlInfoCacheChange$1 = ss.Delegate.remove(this.__urlInfoCacheChange$1, value);
    },
    
    __urlInfoCacheChange$1: null,
    
    add_visualValidStateChanged: function tab_VisualModel$add_visualValidStateChanged(value) {
        this.__visualValidStateChanged$1 = ss.Delegate.combine(this.__visualValidStateChanged$1, value);
    },
    remove_visualValidStateChanged: function tab_VisualModel$remove_visualValidStateChanged(value) {
        this.__visualValidStateChanged$1 = ss.Delegate.remove(this.__visualValidStateChanged$1, value);
    },
    
    __visualValidStateChanged$1: null,
    
    add_brushingFromActionChanged: function tab_VisualModel$add_brushingFromActionChanged(value) {
        this.__brushingFromActionChanged$1 = ss.Delegate.combine(this.__brushingFromActionChanged$1, value);
    },
    remove_brushingFromActionChanged: function tab_VisualModel$remove_brushingFromActionChanged(value) {
        this.__brushingFromActionChanged$1 = ss.Delegate.remove(this.__brushingFromActionChanged$1, value);
    },
    
    __brushingFromActionChanged$1: null,
    
    add_colorDictionaryChanged: function tab_VisualModel$add_colorDictionaryChanged(value) {
        this.__colorDictionaryChanged$1 = ss.Delegate.combine(this.__colorDictionaryChanged$1, value);
    },
    remove_colorDictionaryChanged: function tab_VisualModel$remove_colorDictionaryChanged(value) {
        this.__colorDictionaryChanged$1 = ss.Delegate.remove(this.__colorDictionaryChanged$1, value);
    },
    
    __colorDictionaryChanged$1: null,
    
    add_customShapesLoaded: function tab_VisualModel$add_customShapesLoaded(value) {
        this.__customShapesLoaded$1 = ss.Delegate.combine(this.__customShapesLoaded$1, value);
    },
    remove_customShapesLoaded: function tab_VisualModel$remove_customShapesLoaded(value) {
        this.__customShapesLoaded$1 = ss.Delegate.remove(this.__customShapesLoaded$1, value);
    },
    
    __customShapesLoaded$1: null,
    
    get_worksheetName: function tab_VisualModel$get_worksheetName() {
        return this.get_visualId().worksheet;
    },
    
    get_visualId: function tab_VisualModel$get_visualId() {
        return this.get_visualPresModel().visualIdPresModel;
    },
    
    get_containerGeometry: function tab_VisualModel$get_containerGeometry() {
        return this.get_zone().get_zoneContentRect();
    },
    
    get_visualPresModel: function tab_VisualModel$get_visualPresModel() {
        return this.presModel;
    },
    
    get_tooltipMode: function tab_VisualModel$get_tooltipMode() {
        return this.get_visualPresModel().tooltipMode;
    },
    
    get_scenePresModel: function tab_VisualModel$get_scenePresModel() {
        return this.get_visualPresModel().scene;
    },
    
    get_shelves: function tab_VisualModel$get_shelves() {
        return this._shelvesModel$1;
    },
    
    get_analyticsModel: function tab_VisualModel$get_analyticsModel() {
        return this._analyticsModel$1;
    },
    
    get_marksCardModel: function tab_VisualModel$get_marksCardModel() {
        return this._marksCardModel$1;
    },
    
    get_selectionsModel: function tab_VisualModel$get_selectionsModel() {
        return this._selectionsModel$1;
    },
    
    get_impliedSelectionModel: function tab_VisualModel$get_impliedSelectionModel() {
        return this._impliedSelectionModel$1;
    },
    
    get_brushingsModel: function tab_VisualModel$get_brushingsModel() {
        return this._brushingsModel$1;
    },
    
    get_showMeModel: function tab_VisualModel$get_showMeModel() {
        return this._showMeModel$1;
    },
    
    get_sceneModel: function tab_VisualModel$get_sceneModel() {
        return this._sceneModel$1;
    },
    
    get_labelsModel: function tab_VisualModel$get_labelsModel() {
        return this._labelsModel$1;
    },
    
    get_mapServerModel: function tab_VisualModel$get_mapServerModel() {
        return this._mapServerModel$1;
    },
    
    get_filters: function tab_VisualModel$get_filters() {
        return _.values(this._filterModels$1);
    },
    
    get_filterModels: function tab_VisualModel$get_filterModels() {
        return this._filterModels$1;
    },
    
    get_geometryModel: function tab_VisualModel$get_geometryModel() {
        return this._geometryModel$1;
    },
    
    get_sortIndicatorsModel: function tab_VisualModel$get_sortIndicatorsModel() {
        return this._sortIndicatorsModel$1;
    },
    
    get_vizDataModel: function tab_VisualModel$get_vizDataModel() {
        return this._vizDataModel$1;
    },
    
    get_titleModel: function tab_VisualModel$get_titleModel() {
        return this._titleModel$1;
    },
    
    get_captionModel: function tab_VisualModel$get_captionModel() {
        return this._captionModel$1;
    },
    
    get_hiddenTuples: function tab_VisualModel$get_hiddenTuples() {
        return this._allHiddenTuples$1;
    },
    
    get_filteredTuples: function tab_VisualModel$get_filteredTuples() {
        return this._allFilteredTuples$1;
    },
    
    get_isMap: function tab_VisualModel$get_isMap() {
        return this.get_visualPresModel().isMap;
    },
    
    get_hasBackgroundImage: function tab_VisualModel$get_hasBackgroundImage() {
        return this.get_visualPresModel().hasBackgroundImage;
    },
    
    get_floatingToolbarVisibility: function tab_VisualModel$get_floatingToolbarVisibility() {
        return this.get_visualPresModel().floatingToolbarVisibility;
    },
    
    get_geoSearchVisibility: function tab_VisualModel$get_geoSearchVisibility() {
        return this.get_visualPresModel().geographicSearchVisibility;
    },
    
    get_cacheUrlInfo: function tab_VisualModel$get_cacheUrlInfo() {
        return this._cacheUrlInfo$1;
    },
    
    get_hasModifiedAxes: function tab_VisualModel$get_hasModifiedAxes() {
        return this.get_visualPresModel().hasModifiedAxes;
    },
    
    get_backgroundColor: function tab_VisualModel$get_backgroundColor() {
        return this.get_visualPresModel().bgColor;
    },
    
    get_paneBGColor: function tab_VisualModel$get_paneBGColor() {
        return this.get_visualPresModel().paneColor;
    },
    
    get_headerBGColor: function tab_VisualModel$get_headerBGColor() {
        return this.get_visualPresModel().headerColor;
    },
    
    get_shouldUpdate: function tab_VisualModel$get_shouldUpdate() {
        return tab.ApplicationModel.get_instance().get_autoUpdate();
    },
    
    get_invalidSheets: function tab_VisualModel$get_invalidSheets() {
        var dashboardModel = tab.ApplicationModel.get_instance().get_workbook().findContentDashboard();
        return dashboardModel.get_invalidSheets();
    },
    
    get_isVisualValid: function tab_VisualModel$get_isVisualValid() {
        return this._visualIsValid$1;
    },
    set_isVisualValid: function tab_VisualModel$set_isVisualValid(value) {
        if (this.get_visualPresModel().valid && value !== this._visualIsValid$1) {
            tab.VisualModel.get__log$1().debug('Visual model VisualIsValid set to %o', value);
            this._visualIsValid$1 = value;
            this.raiseEvent(this.__visualValidStateChanged$1);
        }
        return value;
    },
    
    get_isBrushedFromAction: function tab_VisualModel$get_isBrushedFromAction() {
        return this._brushedFromAction$1;
    },
    set_isBrushedFromAction: function tab_VisualModel$set_isBrushedFromAction(value) {
        if (this._brushedFromAction$1 !== value) {
            this._brushedFromAction$1 = value;
            this.raiseEvent(this.__brushingFromActionChanged$1);
        }
        return value;
    },
    
    get_zone: function tab_VisualModel$get_zone() {
        var wrapper = Type.safeCast(this.get_parent(), tab.ZoneContentWrapperModel);
        return wrapper.get_zone();
    },
    
    vizDataContainsDuplicateCaption: function tab_VisualModel$vizDataContainsDuplicateCaption(caption) {
        if (ss.isNullOrUndefined(this.get_vizDataModel())) {
            return false;
        }
        return _.filter(this.get_vizDataModel().get_fieldCaptions(), function(s) {
            return s === caption;
        }).length > 1;
    },
    
    setFilteredTuples: function tab_VisualModel$setFilteredTuples(fieldName, tuplesToFilter) {
        this._filteredTuples$1[fieldName] = tuplesToFilter;
        var newFilteredTuples = {};
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(this._filteredTuples$1));
        while ($enum1.moveNext()) {
            var key = $enum1.current;
            var tuples = this._filteredTuples$1[key];
            var $enum2 = ss.IEnumerator.getEnumerator(tuples);
            while ($enum2.moveNext()) {
                var tupleID = $enum2.current;
                newFilteredTuples[tupleID.toString()] = tupleID;
            }
        }
        var change = Object.getKeyCount(this._allFilteredTuples$1) !== Object.getKeyCount(newFilteredTuples);
        if (!change) {
            var $enum3 = ss.IEnumerator.getEnumerator(Object.keys(this._allFilteredTuples$1));
            while ($enum3.moveNext()) {
                var key = $enum3.current;
                if (!Object.keyExists(newFilteredTuples, key)) {
                    change = true;
                    break;
                }
            }
        }
        if (change) {
            this._allFilteredTuples$1 = newFilteredTuples;
            if (ss.isValue(this.__newFilteredTuples$1)) {
                this.__newFilteredTuples$1();
            }
        }
    },
    
    setHiddenTuples: function tab_VisualModel$setHiddenTuples(fieldName, tuplesToHide) {
        this._hiddenTuples$1[fieldName] = tuplesToHide;
        var newHiddenTuples = {};
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(this._hiddenTuples$1));
        while ($enum1.moveNext()) {
            var key = $enum1.current;
            var tuples = this._hiddenTuples$1[key];
            var $enum2 = ss.IEnumerator.getEnumerator(tuples);
            while ($enum2.moveNext()) {
                var tupleID = $enum2.current;
                newHiddenTuples[tupleID.toString()] = tupleID;
            }
        }
        var change = Object.getKeyCount(this._allHiddenTuples$1) !== Object.getKeyCount(newHiddenTuples);
        if (!change) {
            var $enum3 = ss.IEnumerator.getEnumerator(Object.keys(this._allHiddenTuples$1));
            while ($enum3.moveNext()) {
                var key = $enum3.current;
                if (!Object.keyExists(newHiddenTuples, key)) {
                    change = true;
                    break;
                }
            }
        }
        if (change) {
            this._allHiddenTuples$1 = newHiddenTuples;
            if (ss.isValue(this.__newHiddenTuples$1)) {
                this.__newHiddenTuples$1();
            }
        }
    },
    
    getMutableCopyOfPresModel: function tab_VisualModel$getMutableCopyOfPresModel() {
        var scene = this.get_visualPresModel().scene;
        var labels = this.get_visualPresModel().markLabels;
        var vizData = this.get_visualPresModel().vizData;
        delete this.get_visualPresModel().scene;
        delete this.get_visualPresModel().vizData;
        delete this.get_visualPresModel().markLabels;
        var copy = tab.VisualModel.callBaseMethod(this, 'getMutableCopyOfPresModel');
        this.get_visualPresModel().scene = scene;
        this.get_visualPresModel().vizData = vizData;
        this.get_visualPresModel().markLabels = labels;
        return copy;
    },
    
    update: function tab_VisualModel$update(visualPresModel) {
        if (ss.isNullOrUndefined(this._shelvesModel$1)) {
            this._shelvesModel$1 = new tab.ShelvesModel(this);
        }
        if (ss.isValue(visualPresModel.shelves)) {
            var paneSpecId = this._findShelfPaneSpecId(visualPresModel);
            this._shelvesModel$1.update(visualPresModel.shelves, tab.ApplicationModel.get_instance().get_workbook().get_dataSchema(), paneSpecId);
        }
        if (ss.isValue(visualPresModel.analyticsPane)) {
            if (ss.isNullOrUndefined(this._analyticsModel$1)) {
                this._analyticsModel$1 = new tab.AnalyticsPaneModel(this);
            }
            this._analyticsModel$1.update(visualPresModel.analyticsPane);
        }
        if (ss.isValue(visualPresModel.vizData)) {
            if (ss.isNullOrUndefined(this._vizDataModel$1)) {
                this._vizDataModel$1 = new tab.VizDataModel(this);
            }
            this._vizDataModel$1.update(visualPresModel.vizData);
        }
        if (ss.isNullOrUndefined(this._sceneModel$1)) {
            this._sceneModel$1 = new tab.SceneModel(this);
        }
        if (ss.isValue(visualPresModel.scene)) {
            if (ss.isValue(this._hiddenTuples$1)) {
                var hadTuples = Object.getKeyCount(this._allHiddenTuples$1) > 0;
                this._hiddenTuples$1 = {};
                this._allHiddenTuples$1 = {};
                if (hadTuples) {
                    this.raiseEvent(this.__newHiddenTuples$1);
                }
            }
            if (ss.isValue(this._filteredTuples$1)) {
                var hadTuples = Object.getKeyCount(this._allFilteredTuples$1) > 0;
                this._filteredTuples$1 = {};
                this._allFilteredTuples$1 = {};
                if (hadTuples) {
                    this.raiseEvent(this.__newFilteredTuples$1);
                }
            }
            if (ss.isValue(visualPresModel.scene.markShapeList) && ss.isValue(visualPresModel.scene.markShapeList.length > 0)) {
                tab.ApplicationModel.get_instance().get_shapeManager().updateCustomImageMap(visualPresModel.scene.markShapeList, ss.Delegate.create(this, function() {
                    this.__customShapesLoaded$1();
                }));
            }
            this._sceneModel$1.update(visualPresModel.scene);
        }
        if (ss.isValue(visualPresModel.colorDictionary) && ss.isValue(this.get_visualPresModel())) {
            if (!_.isEqual(this.get_visualPresModel().colorDictionary, visualPresModel.colorDictionary)) {
                this.raiseEvent(this.__colorDictionaryChanged$1);
            }
        }
        if (ss.isNullOrUndefined(this._labelsModel$1)) {
            this._labelsModel$1 = new tab.SceneModel(this);
        }
        if (ss.isValue(visualPresModel.markLabels)) {
            this._labelsModel$1.update(visualPresModel.markLabels);
        }
        if (ss.isNullOrUndefined(this._marksCardModel$1)) {
            this._marksCardModel$1 = new tab.MarksCardModel(this);
        }
        if (ss.isValue(visualPresModel.marksCardPresModel)) {
            this._marksCardModel$1.update(visualPresModel.marksCardPresModel);
        }
        if (ss.isValue(visualPresModel.selectionList) && visualPresModel.selectionList.length > 0) {
            this._selectionsModel$1.update(visualPresModel.selectionList);
        }
        if (ss.isValue(visualPresModel.brushingSelectionList)) {
            this._brushingsModel$1.update(visualPresModel.brushingSelectionList);
        }
        this._handleImpliedSelection(this._selectionsModel$1.get_nodeSelection().get_nodes());
        if (!ss.isValue(this._showMeModel$1)) {
            this._showMeModel$1 = new tab.CommandsModel(this);
        }
        if (ss.isValue(visualPresModel.showMeCommands)) {
            this._showMeModel$1.update(visualPresModel.showMeCommands);
        }
        if (ss.isNullOrUndefined(this._mapServerModel$1)) {
            this._mapServerModel$1 = new tab.MapServerModel(this);
        }
        if (ss.isValue(visualPresModel.mapServer) || !visualPresModel.isMap) {
            var mapPM = (visualPresModel.isMap) ? visualPresModel.mapServer : null;
            this._mapServerModel$1.update(mapPM);
        }
        var newFilterJson = visualPresModel.filtersJson || '';
        var filterPresModels = tab.JsonUtil.parseJson(newFilterJson);
        if (this._needToUpdateFilters$1(filterPresModels, newFilterJson)) {
            this._filtersJSON$1 = newFilterJson;
            if (ss.isValue(filterPresModels)) {
                var updatedFilterModels = {};
                var $enum1 = ss.IEnumerator.getEnumerator(filterPresModels);
                while ($enum1.moveNext()) {
                    var filterPresModel = $enum1.current;
                    var formattedName = tableau.format.formatQualifiedName(filterPresModel.name);
                    var curFilterModel = this._filterModels$1[formattedName];
                    if (ss.isNullOrUndefined(curFilterModel)) {
                        curFilterModel = tab.ModelUtils.createFilterModel(this, filterPresModel);
                    }
                    curFilterModel.update(filterPresModel);
                    updatedFilterModels[formattedName] = curFilterModel;
                }
                this._filterModels$1 = updatedFilterModels;
            }
        }
        var newCacheUrlInfo = visualPresModel.cacheUrlInfoJson || '';
        var newCacheInfo = tab.JsonUtil.parseJson(newCacheUrlInfo);
        if (!_.isEqual(newCacheInfo, this.get_cacheUrlInfo())) {
            this._cacheUrlInfo$1 = newCacheInfo;
            this._fireCacheUrlInfoChanged$1();
        }
        var newGeometry = visualPresModel.geometryJson || '';
        if (!ss.isValue(this._geometryModel$1)) {
            this._geometryModel$1 = new tab.ViewGeometryModel(this);
        }
        var geometryPresModel = tab.JsonUtil.parseJson(newGeometry);
        this._geometryModel$1.update(geometryPresModel);
        if (ss.isNullOrUndefined(this._titleModel$1)) {
            this._titleModel$1 = new tab.TextRegionModel(this, 'visualTitle');
        }
        if (ss.isValue(visualPresModel.visualTitle)) {
            this._titleModel$1.update(visualPresModel.visualTitle);
        }
        if (!ss.isValue(this._captionModel$1)) {
            this._captionModel$1 = new tab.TextRegionModel(this, 'visualCaption');
        }
        if (ss.isValue(visualPresModel.visualCaption)) {
            this._captionModel$1.update(visualPresModel.visualCaption);
        }
        if (!ss.isValue(this._sortIndicatorsModel$1)) {
            this._sortIndicatorsModel$1 = new tab.SortIndicatorsModel(this);
        }
        if (ss.isValue(visualPresModel.sortIndicators)) {
            this._sortIndicatorsModel$1.update(visualPresModel.sortIndicators);
        }
        this.swapAndCopyPresModel(visualPresModel);
        if (this.get_isVisualValid() !== this.get_visualPresModel().valid) {
            this._visualIsValid$1 = this.get_visualPresModel().valid;
            this.raiseEvent(this.__visualValidStateChanged$1);
        }
        tab.VisualModel.get__log$1().debug('Visual model has been updated for %o', this);
        this._raiseNewVisual$1();
    },
    
    _raiseNewVisual$1: function tab_VisualModel$_raiseNewVisual$1() {
        this.raiseEvent(this.__newVisual$1);
    },
    
    _fireCacheUrlInfoChanged$1: function tab_VisualModel$_fireCacheUrlInfoChanged$1() {
        if (ss.isValue(this.get_cacheUrlInfo())) {
            this.raiseEvent(this.__urlInfoCacheChange$1);
        }
    },
    
    _needToUpdateFilters$1: function tab_VisualModel$_needToUpdateFilters$1(filterPresModels, newFilterJson) {
        if (ss.isNullOrUndefined(this._filtersJSON$1)) {
            return true;
        }
        if (ss.isValue(filterPresModels)) {
            var tiledFilter = _.find(filterPresModels, function(filter) {
                return filter.isTiled;
            });
            if (ss.isValue(tiledFilter)) {
                return true;
            }
        }
        return (this._filtersJSON$1 !== newFilterJson);
    },
    
    hasFilterFieldData: function tab_VisualModel$hasFilterFieldData(fieldName) {
        return (ss.isValue(this.get_vizDataModel()) && this.get_vizDataModel().get_filterFields().indexOf(fieldName) !== -1);
    },
    
    getEffectiveSelectedTuples: function tab_VisualModel$getEffectiveSelectedTuples(directTupleSelection) {
        var toRet;
        var tupleFromNodeSelection = this._impliedSelectionModel$1.get_ids();
        if (tab.MiscUtil.isNullOrEmpty(tupleFromNodeSelection)) {
            toRet = directTupleSelection;
        }
        else if (tab.MiscUtil.isNullOrEmpty(directTupleSelection)) {
            toRet = tupleFromNodeSelection;
        }
        else {
            var combinedTuples = [];
            combinedTuples.addRange(directTupleSelection);
            combinedTuples.addRange(tupleFromNodeSelection);
            toRet = combinedTuples;
        }
        return toRet;
    },
    
    _handleImpliedSelection: function tab_VisualModel$_handleImpliedSelection(selectedNodes) {
        var tupleIds = tab.BrushingComputer.getTuplesAssociatedWithSelectedNodes(this, selectedNodes);
        this._impliedSelectionModel$1.setOverriddenTupleIds(tupleIds);
    },
    
    _clearImpliedSelection: function tab_VisualModel$_clearImpliedSelection() {
        this._impliedSelectionModel$1.setOverriddenTupleIds(new Array(0));
    },
    
    _findShelfPaneSpecId: function tab_VisualModel$_findShelfPaneSpecId(visualPresModel) {
        if (ss.isValue(visualPresModel) && ss.isValue(visualPresModel.marksCardPresModel) && ss.isValue(visualPresModel.marksCardPresModel.paneSpec)) {
            return visualPresModel.marksCardPresModel.paneSpec;
        }
        return tab.ModelUtils.findActivePaneSpecId();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DashboardModel

tab.DashboardModel = function tab_DashboardModel(parent, dashboardID) {
    this._viewSessions$1 = {};
    tab.DashboardModel.initializeBase(this, [ parent, new tab.PresModelPathItem('dashboardPresModel') ]);
    this._invalid$1 = false;
    this._zonesModel$1 = new tab.ZonesModel(this);
}
tab.DashboardModel.prototype = {
    _zonesModel$1: null,
    _invalid$1: false,
    _autoUpdate$1: false,
    _oldRenderMode$1: null,
    
    add_newDashboard: function tab_DashboardModel$add_newDashboard(value) {
        this.__newDashboard$1 = ss.Delegate.combine(this.__newDashboard$1, value);
    },
    remove_newDashboard: function tab_DashboardModel$remove_newDashboard(value) {
        this.__newDashboard$1 = ss.Delegate.remove(this.__newDashboard$1, value);
    },
    
    __newDashboard$1: null,
    
    add_activeZoneChanged: function tab_DashboardModel$add_activeZoneChanged(value) {
        this.__activeZoneChanged$1 = ss.Delegate.combine(this.__activeZoneChanged$1, value);
    },
    remove_activeZoneChanged: function tab_DashboardModel$remove_activeZoneChanged(value) {
        this.__activeZoneChanged$1 = ss.Delegate.remove(this.__activeZoneChanged$1, value);
    },
    
    __activeZoneChanged$1: null,
    
    add_renderModeChanged: function tab_DashboardModel$add_renderModeChanged(value) {
        this.__renderModeChanged$1 = ss.Delegate.combine(this.__renderModeChanged$1, value);
    },
    remove_renderModeChanged: function tab_DashboardModel$remove_renderModeChanged(value) {
        this.__renderModeChanged$1 = ss.Delegate.remove(this.__renderModeChanged$1, value);
    },
    
    __renderModeChanged$1: null,
    
    get_zonesModel: function tab_DashboardModel$get_zonesModel() {
        return this._zonesModel$1;
    },
    
    get_zoneModels: function tab_DashboardModel$get_zoneModels() {
        return this._zonesModel$1.get_zoneModels();
    },
    
    get_actionPresModels: function tab_DashboardModel$get_actionPresModels() {
        if (ss.isValue(this.presModel)) {
            return this.get_dashboardPresModel().userActions;
        }
        return null;
    },
    
    get_dashboardPresModel: function tab_DashboardModel$get_dashboardPresModel() {
        return this.presModel;
    },
    
    get_backgroundColor: function tab_DashboardModel$get_backgroundColor() {
        if (ss.isValue(this.presModel) && ss.isValue(this.get_dashboardPresModel().cssAttrs)) {
            return this.get_dashboardPresModel().cssAttrs['backgroundColor'];
        }
        return null;
    },
    
    get_sheetName: function tab_DashboardModel$get_sheetName() {
        if (ss.isValue(this.presModel) && ss.isValue(this.get_dashboardPresModel().sheetLayoutInfo)) {
            return this.get_dashboardPresModel().sheetLayoutInfo.sheetName;
        }
        return null;
    },
    
    get_sheetPath: function tab_DashboardModel$get_sheetPath() {
        if (ss.isValue(this.presModel)) {
            return this.get_dashboardPresModel().sheetPath;
        }
        return null;
    },
    
    get_invalidSheets: function tab_DashboardModel$get_invalidSheets() {
        if (ss.isValue(this.presModel)) {
            return [this.get_dashboardPresModel().invalidSheets];
        }
        return [];
    },
    
    get_autoUpdate: function tab_DashboardModel$get_autoUpdate() {
        return this._autoUpdate$1;
    },
    set_autoUpdate: function tab_DashboardModel$set_autoUpdate(value) {
        this._autoUpdate$1 = value;
        return value;
    },
    
    get_hasSelection: function tab_DashboardModel$get_hasSelection() {
        if (ss.isValue(this.presModel)) {
            return this.get_dashboardPresModel().hasSelection;
        }
        return false;
    },
    
    get_invalid: function tab_DashboardModel$get_invalid() {
        return this._invalid$1;
    },
    set_invalid: function tab_DashboardModel$set_invalid(value) {
        if (value === this._invalid$1) {
            return;
        }
        this._invalid$1 = value;
        return value;
    },
    
    get_activeZoneID: function tab_DashboardModel$get_activeZoneID() {
        if (ss.isValue(this.presModel)) {
            return this.get_dashboardPresModel().activeZoneId;
        }
        return 0;
    },
    
    get_activeVisual: function tab_DashboardModel$get_activeVisual() {
        if (ss.isNullOrUndefined(this.get_dashboardPresModel())) {
            return null;
        }
        if (this.get_activeZoneID() > 0) {
            var $enum1 = ss.IEnumerator.getEnumerator(this.get_zoneModels());
            while ($enum1.moveNext()) {
                var zone = $enum1.current;
                if (zone.get_zoneId() === this.get_activeZoneID()) {
                    return zone.get_visualModel();
                }
            }
        }
        return null;
    },
    
    get_renderMode: function tab_DashboardModel$get_renderMode() {
        return tab.ApplicationModel.get_instance().get_renderMode();
    },
    
    get_formats: function tab_DashboardModel$get_formats() {
        if (ss.isValue(this.presModel)) {
            return this.get_dashboardPresModel().cssAttrs;
        }
        return null;
    },
    
    get_portSize: function tab_DashboardModel$get_portSize() {
        if (ss.isValue(this.presModel)) {
            return this.get_dashboardPresModel().viewportSize;
        }
        return null;
    },
    
    get_isDashboard: function tab_DashboardModel$get_isDashboard() {
        if (ss.isValue(this.presModel) && ss.isValue(this.get_dashboardPresModel().sheetPath)) {
            return this.get_dashboardPresModel().sheetPath.isDashboard;
        }
        return false;
    },
    
    get_flipboard: function tab_DashboardModel$get_flipboard() {
        var model = _.find(this.get_zoneModels(), function(z) {
            return z.get_zoneType() === 'flipboard';
        });
        return model.get_model();
    },
    
    get_legacyMenus: function tab_DashboardModel$get_legacyMenus() {
        if (ss.isValue(this.presModel)) {
            return this.get_dashboardPresModel().legacyMenus;
        }
        return null;
    },
    
    getViewId: function tab_DashboardModel$getViewId(sheetName) {
        if (!Object.keyExists(this.get_dashboardPresModel().viewIds, sheetName)) {
            tab.Log.get(this).warn('Specified sheet does not exist. Returning null.');
            return null;
        }
        return this.get_dashboardPresModel().viewIds[sheetName];
    },
    
    getViewSession: function tab_DashboardModel$getViewSession(sheetName) {
        ss.Debug.assert(Object.keyExists(this._viewSessions$1, sheetName), 'ViewSession not found');
        return this._viewSessions$1[sheetName];
    },
    
    getZone: function tab_DashboardModel$getZone(zoneId) {
        return this._zonesModel$1.getZone(zoneId);
    },
    
    hasZone: function tab_DashboardModel$hasZone(zoneId) {
        return this._zonesModel$1.hasZone(zoneId);
    },
    
    isValidSheet: function tab_DashboardModel$isValidSheet(zone) {
        return ss.isValue(this.get_dashboardPresModel().invalidSheets) && (zone.get_zoneType() !== 'viz' || this.get_dashboardPresModel().invalidSheets.indexOf(zone.get_worksheetName()) === -1);
    },
    
    getMutableCopyOfPresModel: function tab_DashboardModel$getMutableCopyOfPresModel() {
        var zones = this.get_dashboardPresModel().zones;
        delete this.get_dashboardPresModel().zones;
        var copy = tab.DashboardModel.callBaseMethod(this, 'getMutableCopyOfPresModel');
        this.get_dashboardPresModel().zones = zones;
        return copy;
    },
    
    update: function tab_DashboardModel$update(dashboardPresModel) {
        if (ss.isValue(this._oldRenderMode$1) && this._oldRenderMode$1 !== this.get_renderMode()) {
            tab.Log.get(this).debug('Render mode changed to: %s', this.get_renderMode());
            this.raiseEvent(this.__renderModeChanged$1);
        }
        this._oldRenderMode$1 = this.get_renderMode();
        if (ss.isValue(dashboardPresModel.zones)) {
            this._zonesModel$1.update(dashboardPresModel.zones);
        }
        if (ss.isValue(dashboardPresModel.hasSelection)) {
            tab.Log.get(this).debug('HasSelection: ' + dashboardPresModel.hasSelection);
        }
        if (ss.isValue(dashboardPresModel.autoUpdate)) {
            this._autoUpdate$1 = dashboardPresModel.autoUpdate;
        }
        if (ss.isValue(dashboardPresModel.viewIds)) {
            var $dict1 = dashboardPresModel.viewIds;
            for (var $key2 in $dict1) {
                var idPair = { key: $key2, value: $dict1[$key2] };
                var sheetName = idPair.key;
                var viewId = idPair.value;
                var vs = this._viewSessions$1[sheetName];
                if (ss.isNullOrUndefined(vs)) {
                    vs = new tab.ViewSession(tab.CommandController.get().get_legacySession().get_urlRoot(), sheetName, viewId);
                    this._viewSessions$1[sheetName] = vs;
                }
                vs.set_viewId(viewId);
            }
            var viewsToDelete = _.difference(_.keys(this._viewSessions$1), _.keys(dashboardPresModel.viewIds));
            var $enum3 = ss.IEnumerator.getEnumerator(viewsToDelete);
            while ($enum3.moveNext()) {
                var viewId = $enum3.current;
                delete this._viewSessions$1[viewId];
            }
        }
        if (ss.isValue(dashboardPresModel.activeZoneId)) {
            if ((ss.isNullOrUndefined(this.get_dashboardPresModel()) || this.get_dashboardPresModel().activeZoneId !== dashboardPresModel.activeZoneId)) {
                this.raiseEvent(this.__activeZoneChanged$1);
            }
        }
        if (!ss.isUndefined(dashboardPresModel.modifiedSheets)) {
            this.raiseEvent(function() {
                tab.CommandController.get().get_legacySession().fireEvent('modifiedSheetsChanged', dashboardPresModel.modifiedSheets);
            });
        }
        this.swapAndCopyPresModel(dashboardPresModel);
        this.raiseEvent(this.__newDashboard$1);
        this._updateBrushingFromActions$1();
    },
    
    _updateBrushingFromActions$1: function tab_DashboardModel$_updateBrushingFromActions$1() {
        if (!tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            return;
        }
        var vizModels = tab.ModelUtils.getVisualModelsFromDashboard(this);
        var brushedSheets = {};
        var selectSourceSheet = null;
        var $dict1 = vizModels;
        for (var $key2 in $dict1) {
            var vizPair = { key: $key2, value: $dict1[$key2] };
            if (!vizPair.value.get_selectionsModel().get_tupleSelection().get_isEmpty() || (!vizPair.value.get_selectionsModel().get_nodeSelection().get_isEmpty() && !vizPair.value.get_selectionsModel().isOnlyQuantitativeNodeSelected)) {
                var actionsForSourceScheet = tab.ActionUtils.getApplicableActions(vizPair.key, 'on-select', 'highlight');
                if (!tab.MiscUtil.isNullOrEmpty(actionsForSourceScheet)) {
                    selectSourceSheet = vizPair.key;
                    var vizData = vizPair.value.get_vizDataModel();
                    var $enum3 = ss.IEnumerator.getEnumerator(actionsForSourceScheet);
                    while ($enum3.moveNext()) {
                        var action = $enum3.current;
                        if (action.sourceWorksheets.contains(selectSourceSheet)) {
                            var highlightCmd = tab.CommandSerializer.deserialize(tab.SimpleCommandsPresModelWrapper.create(action.simpleCommandModel).get_simpleCommand());
                            var brushAllTargetWorksheetsInAction = ss.isNullOrUndefined(vizData) || tab.BrushingComputer.isSpecialDateTimeHighlighting(highlightCmd);
                            if (!brushAllTargetWorksheetsInAction) {
                                var commandFieldCaptions = tab.BrushingComputer.getHighlightFieldCaptions(highlightCmd, vizData.get_highlightCaptions(), vizData.get_fieldCaptions());
                                brushAllTargetWorksheetsInAction = !tab.MiscUtil.isNullOrEmpty(commandFieldCaptions);
                            }
                            if (brushAllTargetWorksheetsInAction) {
                                var $enum4 = ss.IEnumerator.getEnumerator(action.targetWorksheets);
                                while ($enum4.moveNext()) {
                                    var targetSheet = $enum4.current;
                                    brushedSheets[targetSheet] = true;
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
        if (ss.isNullOrUndefined(selectSourceSheet)) {
            var $dict5 = vizModels;
            for (var $key6 in $dict5) {
                var vizPair = { key: $key6, value: $dict5[$key6] };
                if (this._vizHasLegendSelectionAndBrushing$1(vizPair.value)) {
                    var $enum7 = ss.IEnumerator.getEnumerator(Object.keys(vizModels));
                    while ($enum7.moveNext()) {
                        var targetSheet = $enum7.current;
                        brushedSheets[targetSheet] = true;
                    }
                    break;
                }
            }
        }
        var $dict8 = vizModels;
        for (var $key9 in $dict8) {
            var vizPair = { key: $key9, value: $dict8[$key9] };
            var isBrushed = Object.keyExists(brushedSheets, vizPair.key);
            vizPair.value.set_isBrushedFromAction(isBrushed);
        }
    },
    
    _vizHasLegendSelectionAndBrushing$1: function tab_DashboardModel$_vizHasLegendSelectionAndBrushing$1(vm) {
        var $enum1 = ss.IEnumerator.getEnumerator(tab.ModelUtils.getVizCategoricalLegends(vm));
        while ($enum1.moveNext()) {
            var catLegendModel = $enum1.current;
            if (catLegendModel.get_isHighlightEnabled() && !vm.get_selectionsModel().getLegendSelection(catLegendModel.get_legendType(), catLegendModel.get_legendNames()).get_isEmpty()) {
                return true;
            }
        }
        return false;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.WorkbookModel

tab.WorkbookModel = function tab_WorkbookModel(parent) {
    tab.WorkbookModel.initializeBase(this, [ parent, new tab.PresModelPathItem('workbookPresModel') ]);
    this._commands$1 = new tab.CommandsModel(this);
    this._dataSchemaModel$1 = new tab.DataSchemaModel(this);
}
tab.WorkbookModel.prototype = {
    _commands$1: null,
    _dashboardModel$1: null,
    _dataSchemaModel$1: null,
    _sheetsInfo$1: null,
    
    add_newDashboard: function tab_WorkbookModel$add_newDashboard(value) {
        this.__newDashboard$1 = ss.Delegate.combine(this.__newDashboard$1, value);
    },
    remove_newDashboard: function tab_WorkbookModel$remove_newDashboard(value) {
        this.__newDashboard$1 = ss.Delegate.remove(this.__newDashboard$1, value);
    },
    
    __newDashboard$1: null,
    
    add_dashboardDeleted: function tab_WorkbookModel$add_dashboardDeleted(value) {
        this.__dashboardDeleted$1 = ss.Delegate.combine(this.__dashboardDeleted$1, value);
    },
    remove_dashboardDeleted: function tab_WorkbookModel$remove_dashboardDeleted(value) {
        this.__dashboardDeleted$1 = ss.Delegate.remove(this.__dashboardDeleted$1, value);
    },
    
    __dashboardDeleted$1: null,
    
    add_sheetsChanged: function tab_WorkbookModel$add_sheetsChanged(value) {
        this.__sheetsChanged$1 = ss.Delegate.combine(this.__sheetsChanged$1, value);
    },
    remove_sheetsChanged: function tab_WorkbookModel$remove_sheetsChanged(value) {
        this.__sheetsChanged$1 = ss.Delegate.remove(this.__sheetsChanged$1, value);
    },
    
    __sheetsChanged$1: null,
    
    add_newWorkbook: function tab_WorkbookModel$add_newWorkbook(value) {
        this.__newWorkbook$1 = ss.Delegate.combine(this.__newWorkbook$1, value);
    },
    remove_newWorkbook: function tab_WorkbookModel$remove_newWorkbook(value) {
        this.__newWorkbook$1 = ss.Delegate.remove(this.__newWorkbook$1, value);
    },
    
    __newWorkbook$1: null,
    
    get_dataSchema: function tab_WorkbookModel$get_dataSchema() {
        return this._dataSchemaModel$1;
    },
    
    get_commands: function tab_WorkbookModel$get_commands() {
        return this._commands$1;
    },
    
    get__dashboard$1: function tab_WorkbookModel$get__dashboard$1() {
        return this._dashboardModel$1;
    },
    
    get_isCurrentSheetStoryboard: function tab_WorkbookModel$get_isCurrentSheetStoryboard() {
        return ss.isValue(this.get_storyboard());
    },
    
    get_storyboard: function tab_WorkbookModel$get_storyboard() {
        var contentDashboard = tab.ModelUtils.findContentDashboard();
        if (ss.isValue(contentDashboard) && contentDashboard.get_sheetName() === this._dashboardModel$1.get_sheetName()) {
            return null;
        }
        return this._dashboardModel$1;
    },
    
    get_sheetsInfo: function tab_WorkbookModel$get_sheetsInfo() {
        return this._sheetsInfo$1;
    },
    
    get_isWorkbookIncomplete: function tab_WorkbookModel$get_isWorkbookIncomplete() {
        return this.get_removedDataSourceCount() > 0 || this.get_removedSheetCount() > 0;
    },
    
    get_isWorkbookModifiedAuthoring: function tab_WorkbookModel$get_isWorkbookModifiedAuthoring() {
        return ss.isValue(this.get_workbookPresModel()) && this.get_workbookPresModel().workbookModified;
    },
    
    get_isCurrentDashboardModified: function tab_WorkbookModel$get_isCurrentDashboardModified() {
        return (ss.isValue(this.get__dashboard$1()) && ss.isValue(this.get__dashboard$1().get_dashboardPresModel()) && ss.isValue(this.get__dashboard$1().get_dashboardPresModel().modifiedSheets) && this.get__dashboard$1().get_dashboardPresModel().modifiedSheets.length > 0);
    },
    
    get_removedDataSourceCount: function tab_WorkbookModel$get_removedDataSourceCount() {
        return (this.get_workbookPresModel().removedDatasourceCount || 0);
    },
    
    get_removedSheetCount: function tab_WorkbookModel$get_removedSheetCount() {
        return (this.get_workbookPresModel().removedSheetCount || 0);
    },
    
    get_workbookPresModel: function tab_WorkbookModel$get_workbookPresModel() {
        return this.presModel;
    },
    set_workbookPresModel: function tab_WorkbookModel$set_workbookPresModel(value) {
        this.presModel = value;
        return value;
    },
    
    get_outerDashboardRepositoryUrl: function tab_WorkbookModel$get_outerDashboardRepositoryUrl() {
        return (ss.isValue(this._dashboardModel$1) && ss.isValue(this._dashboardModel$1.get_dashboardPresModel()) && ss.isValue(this._dashboardModel$1.get_dashboardPresModel().sheetLayoutInfo)) ? this._dashboardModel$1.get_dashboardPresModel().sheetLayoutInfo.repositoryUrl : null;
    },
    
    get_outerDashboardPortSize: function tab_WorkbookModel$get_outerDashboardPortSize() {
        var portSize = this._dashboardModel$1.get_portSize();
        return tab.$create_Size(portSize.w, portSize.h);
    },
    
    withDashboard: function tab_WorkbookModel$withDashboard(callback) {
        var dash = this.findContentDashboard();
        if (ss.isValue(dash)) {
            callback(dash);
            return;
        }
        var handleNewDashboard = null;
        handleNewDashboard = ss.Delegate.create(this, function(model) {
            callback(model);
            this.remove_newDashboard(handleNewDashboard);
        });
        this.add_newDashboard(handleNewDashboard);
    },
    
    _isSheetNameChanged$1: function tab_WorkbookModel$_isSheetNameChanged$1(workbookPresModel) {
        return (ss.isValue(workbookPresModel.dashboardPresModel.sheetLayoutInfo) && workbookPresModel.dashboardPresModel.sheetLayoutInfo.sheetName !== tsConfig.current_sheet_name);
    },
    
    _isLayoutIdChanged$1: function tab_WorkbookModel$_isLayoutIdChanged$1(workbookPresModel) {
        return (ss.isValue(workbookPresModel.dashboardPresModel.sheetLayoutInfo) && ss.isValue(this.get_workbookPresModel()) && ss.isValue(this.get_workbookPresModel().dashboardPresModel) && ss.isValue(this.get_workbookPresModel().dashboardPresModel.sheetLayoutInfo) && workbookPresModel.dashboardPresModel.sheetLayoutInfo.layoutId !== this.get_workbookPresModel().dashboardPresModel.sheetLayoutInfo.layoutId);
    },
    
    addNewDashboardHandler: function tab_WorkbookModel$addNewDashboardHandler(handler) {
        this.add_newDashboard(handler);
        if (ss.isValue(this._dashboardModel$1)) {
            handler(this._dashboardModel$1);
        }
    },
    
    removeDashboardHandler: function tab_WorkbookModel$removeDashboardHandler(handler) {
        this.remove_newDashboard(handler);
    },
    
    findContentDashboard: function tab_WorkbookModel$findContentDashboard() {
        if (ss.isNullOrUndefined(this._dashboardModel$1)) {
            return null;
        }
        var dashboard = this._dashboardModel$1;
        var $enum1 = ss.IEnumerator.getEnumerator(dashboard.get_zoneModels());
        while ($enum1.moveNext()) {
            var zone = $enum1.current;
            if (Type.canCast(zone.get_model(), tab.FlipboardModel)) {
                dashboard = (zone.get_model()).get_dashboardModel();
                break;
            }
        }
        return dashboard;
    },
    
    update: function tab_WorkbookModel$update(workbookPresModel) {
        tab.Log.get(this).debug('Update: modified=%s', workbookPresModel.workbookModified);
        if (ss.isValue(workbookPresModel.workbookModified) && (ss.isNullOrUndefined(this.presModel) || this.get_isWorkbookModifiedAuthoring() !== workbookPresModel.workbookModified)) {
            this.raiseEvent(function() {
                tab.CommandController.get().get_legacySession().fireEvent('workbookModifiedChanged', workbookPresModel.workbookModified);
            });
        }
        if (!ss.isValue(this._dataSchemaModel$1)) {
            this._dataSchemaModel$1 = new tab.DataSchemaModel(this);
        }
        if (ss.isValue(workbookPresModel.dataSchema)) {
            this._dataSchemaModel$1.update(workbookPresModel.dataSchema);
        }
        if (ss.isUndefined(workbookPresModel.dashboardPresModel)) {
            tab.Log.get(this).debug('Dashboard unchanged');
        }
        else if (ss.isNull(workbookPresModel.dashboardPresModel)) {
            tab.Log.get(this).debug('Dashboard deleted');
            var m = this._dashboardModel$1;
            this._dashboardModel$1 = null;
            this.raiseEvent(this.__dashboardDeleted$1, m);
        }
        else {
            if (this._isSheetNameChanged$1(workbookPresModel) || this._isLayoutIdChanged$1(workbookPresModel)) {
                tab.Log.get(this).debug('Dashboard (tab) changed or reverted');
                this._dashboardModel$1 = null;
            }
            if (!ss.isValue(this._dashboardModel$1)) {
                tab.Log.get(this).debug('New dashboard');
                this._dashboardModel$1 = new tab.DashboardModel(this, 'dashboardPresModel');
                this.raiseEvent(this.__newDashboard$1, this._dashboardModel$1);
            }
            this._dashboardModel$1.update(workbookPresModel.dashboardPresModel);
        }
        if (ss.isValue(workbookPresModel.commands)) {
            this._commands$1.update(workbookPresModel.commands);
        }
        if (ss.isValue(workbookPresModel.sheetsInfo)) {
            this._sheetsInfo$1 = workbookPresModel.sheetsInfo;
            this.raiseEvent(this.__sheetsChanged$1, this);
        }
        this.simpleSwapToUpdate(workbookPresModel, this.__newWorkbook$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ServerCommands

tab.ServerCommands = function tab_ServerCommands() {
}
tab.ServerCommands._createInterceptorLookup = function tab_ServerCommands$_createInterceptorLookup(cmdNamespace, cmdName) {
    return cmdNamespace + ':' + cmdName;
}
tab.ServerCommands.executeServerCommand = function tab_ServerCommands$executeServerCommand(c, uiBlockState, successCallback, errorCallback) {
    var interceptors = tab.ServerCommands._commandInterceptors[tab.ServerCommands._createInterceptorLookup(c.commandNamespace, c.commandName)];
    if (ss.isValue(interceptors)) {
        var $enum1 = ss.IEnumerator.getEnumerator(interceptors);
        while ($enum1.moveNext()) {
            var func = $enum1.current;
            if (func(c) === 1) {
                return;
            }
        }
    }
    tab.CommandController.SendCommand(tab._remoteClientCommand.create(c, uiBlockState, successCallback, errorCallback));
}
tab.ServerCommands.addCommandInterceptor = function tab_ServerCommands$addCommandInterceptor(c, commandNamespace, commandName) {
    var key = tab.ServerCommands._createInterceptorLookup(commandNamespace, commandName);
    var interceptors = tab.ServerCommands._commandInterceptors[key];
    if (ss.isNullOrUndefined(interceptors)) {
        interceptors = [];
        tab.ServerCommands._commandInterceptors[key] = interceptors;
    }
    interceptors.add(c);
}
tab.ServerCommands.clearAllCommandInterceptors = function tab_ServerCommands$clearAllCommandInterceptors() {
    Object.clearKeys(tab.ServerCommands._commandInterceptors);
}


////////////////////////////////////////////////////////////////////////////////
// tab.BaseSession

tab.BaseSession = function tab_BaseSession(urlRoot) {
    var baseUrl = tabBootstrap.BaseUrlFormatter.formatBaseUrl();
    if (ss.isValue(urlRoot)) {
        this.urlRoot = urlRoot;
    }
    else {
        this.urlRoot = tabBootstrap.BaseUrlFormatter.formatUrlRoot(baseUrl);
    }
    if (ss.isValue(tsConfig.site_root)) {
        this.siteRoot = tsConfig.site_root;
    }
    else {
        this.siteRoot = baseUrl;
    }
}
tab.BaseSession.showAlertDialog = function tab_BaseSession$showAlertDialog(content, title, isContentSelectable) {
    try {
        tableau.util.showAlertDialog(content, title, isContentSelectable);
    }
    catch (e) {
        tab.Logger.lazyGetLogger(tab.BaseSession).debug('Error showing dialog: message=%s, exception=%o', e.message, e);
    }
}
tab.BaseSession.prototype = {
    urlRoot: null,
    siteRoot: null,
    
    add_stateChanged: function tab_BaseSession$add_stateChanged(value) {
        this.__stateChanged = ss.Delegate.combine(this.__stateChanged, value);
    },
    remove_stateChanged: function tab_BaseSession$remove_stateChanged(value) {
        this.__stateChanged = ss.Delegate.remove(this.__stateChanged, value);
    },
    
    __stateChanged: null,
    
    get_urlRoot: function tab_BaseSession$get_urlRoot() {
        return this.urlRoot;
    },
    
    get_id: function tab_BaseSession$get_id() {
        return tsConfig.sessionid;
    },
    
    get__historyPosition: function tab_BaseSession$get__historyPosition() {
        return tab.BaseSession._historyPosition;
    },
    set__historyPosition: function tab_BaseSession$set__historyPosition(value) {
        tab.BaseSession._historyPosition = value;
        return value;
    },
    
    get_waitHandler: function tab_BaseSession$get_waitHandler() {
        if (ss.isNullOrUndefined(tab.BaseSession._waitHandler)) {
            tab.BaseSession._waitHandler = new tab.WaitHandler();
        }
        return tab.BaseSession._waitHandler;
    },
    
    get__sessionRoot: function tab_BaseSession$get__sessionRoot() {
        return this.urlRoot + '/sessions/' + tsConfig.sessionid;
    },
    
    formatThumbnailReference: function tab_BaseSession$formatThumbnailReference(worksheetPath) {
        return this.siteRoot + '/thumb/views/' + worksheetPath;
    },
    
    formatSessionTempfileReference: function tab_BaseSession$formatSessionTempfileReference(tempfileid, keepfile, attachment) {
        return this.urlRoot + '/tempfile/sessions/' + tsConfig.sessionid + '/?key=' + tempfileid + ((keepfile) ? '&keepfile=yes' : '') + ((attachment) ? '&attachment=yes' : '');
    },
    
    railsEncode: function tab_BaseSession$railsEncode(s) {
        var $dict1 = tab.BaseSession._railsSpecialChars;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            s = s.replace(pair.value, pair.key);
        }
        return s;
    },
    
    nudgeWait: function tab_BaseSession$nudgeWait() {
        if (ss.isNullOrUndefined(tab.BaseSession._waitHandler)) {
            return false;
        }
        tab.BaseSession._waitHandler.nudge();
        return true;
    },
    
    incrementWait: function tab_BaseSession$incrementWait(immediateWait) {
        if (ss.isNullOrUndefined(tab.BaseSession._waitHandler)) {
            return false;
        }
        tab.BaseSession._waitHandler.addref(immediateWait);
        return true;
    },
    
    decrementWait: function tab_BaseSession$decrementWait() {
        if (ss.isNullOrUndefined(tab.BaseSession._waitHandler)) {
            return false;
        }
        tab.BaseSession._waitHandler.release();
        return true;
    },
    
    handleSessionExpiration: function tab_BaseSession$handleSessionExpiration(limitAttempts) {
        var uriModel = tab.VizUriModel.createForCurrentWindowLocation();
        if (limitAttempts && uriModel.get_retry()) {
            throw new Error('Failed to re-initialize session');
        }
        this._reloadPage(limitAttempts);
    },
    
    handleAuthenticationFailure: function tab_BaseSession$handleAuthenticationFailure() {
        this._reloadPage(false);
    },
    
    handleSessionForbiddenAction: function tab_BaseSession$handleSessionForbiddenAction(code, message) {
        var title = tab.Strings.SessionForbiddenActionTitle;
        var msg = tab.Strings.SessionForbiddenActionMsg;
        switch (code) {
            case 16:
            case 19:
            case 21:
                msg = message;
                break;
        }
        tab.BaseSession.showAlertDialog(msg, title, true);
    },
    
    handleSessionLimitExceeded: function tab_BaseSession$handleSessionLimitExceeded() {
        if (tab.BaseSession._limitExceeded) {
            return;
        }
        var msg = tab.Strings.TimeLimitExceededWarning;
        msg += '\n';
        msg += tab.Strings.PressBackButtonMessage;
        var title = tab.Strings.TimeLimitExceededTitle;
        tab.BaseSession._limitExceeded = true;
        tab.BaseSession.showAlertDialog(msg, title, true);
    },
    
    handleSessionKilled: function tab_BaseSession$handleSessionKilled(info) {
        this._displayConnectionErrorMessage(info, tab.Strings.SessionEndedAlertTitle, tab.Strings.SessionEndedAlertMessage);
    },
    
    handleUnknownErrorStatus: function tab_BaseSession$handleUnknownErrorStatus(info) {
        this._displayConnectionErrorMessage(info, tab.Strings.SessionUnknownErrorTitle, tab.Strings.SessionEndedAlertMessage);
    },
    
    getWindow: function tab_BaseSession$getWindow(rootName) {
        return rootName + tsConfig.sessionid.replace(new RegExp('[^A-Za-z0-9_]', 'g'), '_');
    },
    
    registerEventListener: function tab_BaseSession$registerEventListener(evt, callback) {
        return dojo.subscribe(this.getTopic(evt), callback);
    },
    
    fireEvent: function tab_BaseSession$fireEvent(evt, data) {
        tab.Log.get(this).debug('FireEvent: event=%s, data=%o', evt, data);
        dojo.publish(this.getTopic(evt), [ data ]);
    },
    
    fireStateChanged: function tab_BaseSession$fireStateChanged(data) {
        if (ss.isValue(this.__stateChanged)) {
            this.__stateChanged(data);
        }
    },
    
    _reloadPage: function tab_BaseSession$_reloadPage(addRetryInfo) {
        document.body.style.cursor = 'wait';
        var repositoryUrl = tsConfig.repositoryUrl || tsConfig.origin_repository_url;
        var uriModel = tab.VizUriModel.createForCurrentWindowLocationAndVizState(repositoryUrl, tsConfig.current_sheet_name);
        uriModel.set_retry(addRetryInfo);
        uriModel.explicitNotGuest = tsConfig.is_authoring && !tsConfig.is_guest;
        uriModel.fullPageLoad();
    },
    
    openDownload: function tab_BaseSession$openDownload(url, dialogData) {
        if (ss.isValue(dialogData.popup)) {
            var popupName = dialogData.popup;
            var downloadPopup = window.open('about:blank', popupName);
            window.setTimeout(ss.Delegate.create(this, function() {
                var h = new tab.WindowHelper(downloadPopup);
                if (ss.isValue(downloadPopup) && !downloadPopup.closed && !!h.get_innerWidth() && !!h.get_innerHeight()) {
                    downloadPopup.location.href = url;
                }
                else {
                    if (ss.isValue(downloadPopup)) {
                        downloadPopup.close();
                    }
                    dialogData.popup = null;
                    this.openDownload(url, dialogData);
                }
            }), 500);
        }
        else {
            var DialogTemplate = "\n<div style='text-align:center'>{0}</div><br/>\n  <div class='tab-dialog-actions'>\n    <a name='ok' class='tab-styledButton left' target='{1}' href='{2}' onclick='dijit.getEnclosingWidget(this).hide();'>\n        <span class='tab-styledButtonLeft'></span>\n        <span class='tab-styledButtonMiddle'>{3}</span>\n        <span class='tab-styledButtonRight'></span>\n    </a><button name='cancel' class='tab-styledButton' onclick='dijit.getEnclosingWidget(this).hide();'>\n        <span class='tab-styledButtonLeft'></span>\n        <span class='tab-styledButtonMiddle'>{4}</span>\n        <span class='tab-styledButtonRight'></span>\n    </button>\n  </div>";
            var ch1 = (url.indexOf('?') === -1) ? '?' : '&';
            url += ch1 + 'download=true';
            var urlTarget = '_blank';
            var dialogText = String.format(DialogTemplate, dialogData.message, urlTarget, url, tab.Strings.DialogButtonDownload, tab.Strings.DialogButtonCancel);
            var onSuccess = function() {
                tab.BaseSession.showAlertDialog(dialogText, dialogData.title, false);
            };
            if (ss.isNullOrUndefined(dialogData.noping)) {
                var ch = (url.indexOf('?') === -1) ? '?' : '&';
                url += ch + 'nodata=true';
                var handler = this._createHandler(null, onSuccess, null, 'none');
                var args = {};
                args.headers = { Accept: 'text/plain' };
                args.dataType = 'text';
                args.type = 'GET';
                args.url = url;
                this._request(args, handler);
            }
            else {
                tab.BaseSession.showAlertDialog(dialogText, dialogData.title, false);
            }
        }
    },
    
    showDownloads: function tab_BaseSession$showDownloads(urlsByName, dialogData) {
        var dialogHeaderText = "\n<div style='text-align:center'>{0}</div><br />\n<div class='dlgDownloads' style='text-align:center'>";
        var downloadItemText = "<a href='{1}' target='_blank'>{0}</a><br />";
        var dialogFooterText = "</div>\n  <div class='tab-dialog-footer'>\n    <div class='tab-dialog-actions'>\n      <input onclick='dijit.getEnclosingWidget(this).hide(); return false;' type='button' value='{0}' name='cancel' />\n    </div>\n  </div>\n</div>";
        var sb = new ss.StringBuilder(String.format(dialogHeaderText, dialogData['message']));
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(urlsByName));
        while ($enum1.moveNext()) {
            var name = $enum1.current;
            sb.append(String.format(downloadItemText, name, urlsByName[name]));
        }
        sb.append(String.format(dialogFooterText, tab.Strings.DialogButtonCancel));
        var text = sb.toString();
        tab.BaseSession.showAlertDialog(text, dialogData['title'], false);
    },
    
    _informServer: function tab_BaseSession$_informServer(url, userAgent, entries) {
        var args = {};
        args.type = 'POST';
        args.url = this._formatSessionMethod('inform');
        args.headers = { Accept: 'text/plain' };
        args.contentType = 'text/plain';
        var requestCharCountLimit = tsConfig.clientErrorReportingMaxRequestSizeBytes;
        var sb = new ss.StringBuilder();
        sb.appendLine('url: ' + url);
        sb.appendLine('user-agent: ' + userAgent);
        var perErrorCharCountLimit = (requestCharCountLimit - sb.toString().length) / Object.getKeyCount(entries);
        var $dict1 = entries;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            sb.appendLine(entry.key);
            sb.appendLine(entry.value.substr(0, perErrorCharCountLimit - entry.key.length - 2));
        }
        args.data = sb.toString();
        this._request(args);
    },
    
    sendSessionCommand: function tab_BaseSession$sendSessionCommand(ns, command, inputModel, onSuccess, onError) {
        var args = {};
        args.type = 'POST';
        args.url = this._formatSessionCommand(ns, command);
        args.headers = { Accept: 'application/json, text/javascript' };
        args.dataType = 'json';
        args.success = onSuccess;
        args.error = onError;
        var payload = tab.XhrUtil.getMultipartData(null, inputModel);
        args.contentType = 'multipart/form-data; boundary=' + payload.header;
        args.data = payload.body;
        var handler = this._createHandlerCC(null, onSuccess, null);
        this._request(args, handler);
    },
    
    _requestUndoRedo: function tab_BaseSession$_requestUndoRedo(historyPosition, redo) {
        tab.Log.get(this).debug('Requesting redo/undo: redo=%s', redo);
        if (redo) {
            tab.WorksheetServerCommands.redoToPosition(historyPosition);
        }
        else {
            tab.WorksheetServerCommands.undoToPosition(historyPosition);
        }
    },
    
    _requestSetIgnore: function tab_BaseSession$_requestSetIgnore() {
        var args = {};
        args.error = null;
        args.success = null;
        args.type = 'POST';
        args.url = this.urlRoot + '/setignore/sessions';
        var data = { _method: 'PUT', target: tsConfig.sessionid };
        args.data = data;
        args.async = false;
        this._request(args);
    },
    
    requestRestoreFixedAxes: function tab_BaseSession$requestRestoreFixedAxes(visualId) {
        if (!tsConfig.allow_filter) {
            return;
        }
        var c = {};
        c.commandNamespace = 'tabsrv';
        c.commandName = 'restore-fixed-axes';
        var cmdParams = {};
        tab.CommandUtils.addVisualIdToCommand(cmdParams, visualId);
        c.commandParams = cmdParams;
        var successCallback = ss.Delegate.create(this, function(presModel) {
            this.fireStateChanged(presModel);
        });
        tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'immediately', successCallback, function() {
        }));
    },
    
    executeServerCommand: function tab_BaseSession$executeServerCommand(c, successCallback, errorCallback) {
        var args = {};
        this._prepareCommandRequst(args, c);
        args.headers = { Accept: 'text/javascript' };
        var onSuccess = function(data, textStatus, xhr) {
            if (ss.isValue(successCallback)) {
                data = tab.RleDecoder.decode(data);
                successCallback(data);
            }
        };
        var onError = ss.Delegate.create(this, function(request, textStatus, error) {
            this._handleError(error, request, c.noExceptionDialog);
            if (ss.isValue(errorCallback)) {
                var dict = { message: request.responseText, status: request.status };
                errorCallback(Error.createError(error.toString(), dict));
            }
        });
        var handler = this._createHandlerCC(null, onSuccess, (ss.isValue(errorCallback)) ? onError : null);
        this._request(args, handler);
    },
    
    basicPostOpts: function tab_BaseSession$basicPostOpts(url, dat) {
        var args = {};
        args.type = 'POST';
        args.url = url;
        args.headers = { Accept: 'text/javascript' };
        args.dataType = 'json';
        args.data = dat;
        return args;
    },
    
    basicGetOpts: function tab_BaseSession$basicGetOpts(url) {
        var args = {};
        args.type = 'GET';
        args.url = url;
        args.headers = { Accept: 'text/javascript' };
        args.dataType = 'json';
        return args;
    },
    
    _prepareCommandRequst: function tab_BaseSession$_prepareCommandRequst(args, command) {
        var payload = tab.XhrUtil.getMultipartData(null, command.commandParams);
        args.type = 'POST';
        args.dataType = 'json';
        args.contentType = 'multipart/form-data; boundary=' + payload.header;
        args.data = payload.body;
        args.url = this._formatSessionCommand(command.commandNamespace, command.commandName);
    },
    
    _pushServerUndo: function tab_BaseSession$_pushServerUndo(description) {
        var currentHistoryPosition = this.get__historyPosition();
        tab.Log.get(this).debug('Push server undo: %s', description);
        var undo = ss.Delegate.create(this, function() {
            this._requestUndoRedo(currentHistoryPosition, false);
        });
        var redo = ss.Delegate.create(this, function() {
            this._requestUndoRedo(currentHistoryPosition + 1, true);
        });
        this._pushUndo(undo, redo);
        ++tab.BaseSession._historyPosition;
    },
    
    getTopic: function tab_BaseSession$getTopic(topicId) {
        return this.getTopicCore(topicId, null);
    },
    
    _formatMethod: function tab_BaseSession$_formatMethod(method) {
        return this.urlRoot + '/' + method;
    },
    
    _formatSessionMethod: function tab_BaseSession$_formatSessionMethod(method) {
        return tabBootstrap.BaseUrlFormatter.formatSessionMethod(method, tsConfig.sessionid, this.urlRoot);
    },
    
    _formatSessionCommand: function tab_BaseSession$_formatSessionCommand(ns, command) {
        return this.get__sessionRoot() + '/commands/' + ns + '/' + command;
    },
    
    _pushUndo: function tab_BaseSession$_pushUndo(undo, redo) {
        if (!tsConfig.embedded || tsConfig.browserBackButtonUndo) {
            if (ss.isValue(tab.BaseSession._currentState)) {
                tab.BaseSession._currentState.back = undo;
            }
            else {
                tab.DojoCurrentState.setInitialState(undo);
            }
            tab.BaseSession._currentState = new tab.DojoCurrentState();
            tab.BaseSession._currentState.back = null;
            tab.BaseSession._currentState.forward = redo;
            tab.DojoCurrentState.addToHistory(tab.BaseSession._currentState);
        }
    },
    
    _handleError: function tab_BaseSession$_handleError(error, xhr, noExceptionDialog) {
        if (tabBootstrap.ViewerBootstrap.get_instance().get_sessionBeingCleared()) {
            return;
        }
        var match = xhr.responseText.match(new RegExp('Fatal exception in vizql engine'));
        if (xhr.status === 410 || xhr.status === 404 || xhr.status === 403) {
            this.handleSessionExpiration(false);
        }
        else if (xhr.status === 401) {
            this.handleAuthenticationFailure();
        }
        else if (xhr.status === 502 || xhr.status === 503) {
            this.handleSessionKilled(null);
        }
        else if (xhr.status === 500 && match != null && match.length > 0) {
            this.handleUnknownErrorStatus(xhr.responseText);
        }
        else if (xhr.status === 413) {
            this.handleSessionLimitExceeded();
        }
        else if (!xhr.status) {
            var status0Handler;
            if (!!xhr.responseText.length) {
                var sb = new ss.StringBuilder();
                sb.append('XHR Response Status: 0\nReadyState:');
                sb.append(xhr.readyState);
                sb.append('\nHeaders:\n');
                sb.append(xhr.getAllResponseHeaders());
                sb.append('\nResponse:\n');
                sb.append(xhr.responseText);
                status0Handler = function() {
                    tab.BaseSession.showAlertDialog(sb.toString(), tab.Strings.RequestAbortedByBrowser, true);
                };
            }
            else {
                status0Handler = ss.Delegate.create(this, function() {
                    this._displayErrorInDialog(error, xhr);
                });
            }
            window.setTimeout(status0Handler, 5000);
        }
        else if (ss.isNullOrUndefined(noExceptionDialog) || !noExceptionDialog) {
            this._displayErrorInDialog(error, xhr);
        }
    },
    
    _request: function tab_BaseSession$_request(args, handler) {
        return tab.XhrUtil.helper(args, handler);
    },
    
    _createHandlerCC: function tab_BaseSession$_createHandlerCC(onComplete, onSuccess, onError) {
        return new tab.SessionAjaxCallManager(this, onComplete, onSuccess, onError, false, false);
    },
    
    _createHandler: function tab_BaseSession$_createHandler(onComplete, onSuccess, onError, uiBlockType) {
        var usesWaitHandler = (uiBlockType !== 'none');
        var immediateWait = (uiBlockType === 'immediately');
        return new tab.SessionAjaxCallManager(this, onComplete, onSuccess, onError, usesWaitHandler, immediateWait);
    },
    
    formatLayoutMethod: function tab_BaseSession$formatLayoutMethod(layoutid, method) {
        var url = (ss.isValue(method)) ? this._formatSessionMethod(method) : this.get__sessionRoot();
        url += '/layouts/' + layoutid;
        return url;
    },
    
    formatViewMethod: function tab_BaseSession$formatViewMethod(viewid, method) {
        var url = (ss.isValue(method)) ? this._formatSessionMethod(method) : this.get__sessionRoot();
        url += '/views/' + viewid;
        return url;
    },
    
    formatSaveSharedViewMethod: function tab_BaseSession$formatSaveSharedViewMethod() {
        return this._formatSessionMethod('save_shared_view');
    },
    
    formatFilterReference: function tab_BaseSession$formatFilterReference(sheetid, field, method) {
        return this._formatSubSheetReference(sheetid, field, method, 'filters');
    },
    
    _formatSubSheetReference: function tab_BaseSession$_formatSubSheetReference(sheetid, field, method, reftype) {
        sheetid = encodeURIComponent(this.railsEncode(sheetid));
        var url;
        if (ss.isValue(method)) {
            url = this._formatSessionMethod(method);
        }
        else {
            url = this.get__sessionRoot();
        }
        url += '/sheets/' + sheetid + '/' + reftype;
        if (ss.isValue(field)) {
            url += '/' + encodeURIComponent(this.railsEncode(field));
        }
        return url;
    },
    
    getTopicCore: function tab_BaseSession$getTopicCore(evt, subid) {
        var topic = evt;
        var m = new tab.EventMap();
        var idx = m.get_item(evt);
        if (idx < 0 || idx >= m.get__length()) {
            throw Error.createError('Illegal event id ' + topic, null);
        }
        if (idx <= m.get_item('stateChanged')) {
            subid = null;
        }
        return (ss.isNullOrUndefined(subid)) ? topic : topic + subid;
    },
    
    _displayConnectionErrorMessage: function tab_BaseSession$_displayConnectionErrorMessage(info, dialogTitle, primaryMessage) {
        var loc = null;
        try {
            loc = window.parent.location;
        }
        catch ($e1) {
        }
        info = (info || '').trim();
        var msg = tab.Strings.UnhandledExceptionMessage(info);
        if (!String.isNullOrEmpty(info)) {
            msg += '<br/><br/>';
        }
        var action = ss.Delegate.create(this, function() {
            msg += primaryMessage;
            var a = ss.Delegate.create(this, function() {
                this._requestSetIgnore();
                document.body.style.cursor = 'wait';
                this._reloadPage(false);
            });
            tableau.util.showConfirmationDialog(msg, dialogTitle, true, a);
        });
        if (tsConfig.single_frame) {
            action();
        }
        else if (ss.isNullOrUndefined(loc)) {
            tab.BaseSession.showAlertDialog(msg, dialogTitle, true);
        }
        else {
            action();
        }
    },
    
    _displayErrorInDialog: function tab_BaseSession$_displayErrorInDialog(error, xhr) {
        var errorString = Type.safeCast(error, String);
        var errorException = Type.safeCast(error, Error);
        var msg = '';
        if (ss.isValue(errorString)) {
            msg = errorString.replaceAll('XMLHttpTransport.watchInFlight Error: ', '');
        }
        else if (ss.isValue(errorException)) {
            msg = errorException.message.replaceAll('XMLHttpTransport.watchInFlight Error: ', '');
        }
        msg = msg.replaceAll('XMLHttpTransport Error: ', '');
        var title = tab.Strings.ServerErrorUnexpected;
        if (xhr.status < 400) {
            title = tab.Strings.BrowserErrorProcessing;
            msg = tab.Strings.BrowserErrorProcessingMessage + '<br>' + msg;
        }
        else if (xhr.status === 400) {
            title = tab.Strings.ServerErrorRejected;
            msg = tab.Strings.ServerErrorRejectedMessage + '<br>';
        }
        else {
            var show_to_user;
            try {
                show_to_user = eval('(' + xhr.responseText + ')');
                show_to_user = show_to_user.replace(new RegExp('\n(?=s*[A-Z])', 'g'), '<li>').replace(new RegExp('\n', 'g'), '<br>');
                show_to_user = '<ul><li>' + show_to_user + '</ul>';
            }
            catch ($e1) {
                show_to_user = xhr.responseText;
            }
            if (String.isNullOrEmpty(show_to_user)) {
                msg = tab.Strings.ServerErrorGeneral(xhr.status) + '<br>';
            }
            else {
                msg = show_to_user;
            }
        }
        tab.BaseSession.showAlertDialog(msg, title, true);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CustomizedViewSession

tab.CustomizedViewSession = function tab_CustomizedViewSession(baseSession) {
    this._baseSession = baseSession;
}
tab.CustomizedViewSession.buildUrl = function tab_CustomizedViewSession$buildUrl(cv, removeQueryParams) {
    var vizUriModel = tab.VizUriModel.createForViewingSheet(tsConfig.repositoryUrl);
    if (ss.isValue(cv)) {
        vizUriModel.updateForCustomizedView(cv);
    }
    else {
        vizUriModel.set_originalView(true);
    }
    vizUriModel.removeHash();
    if (removeQueryParams) {
        vizUriModel.removeAllQueryParams();
    }
    return vizUriModel.get_absoluteUri();
}
tab.CustomizedViewSession._genericErrorCallback = function tab_CustomizedViewSession$_genericErrorCallback(handler) {
    var onError = function(xhr, status, e) {
        tab.CustomizedViewSession._log.debug('Error in request: %o', e);
        if (!ss.isValue(handler)) {
            return;
        }
        var msg = tab.CustomizedViewSession._getMessageFromResponse(xhr);
        handler((ss.isValue(msg)) ? msg : (e.message || ''));
    };
    return onError;
}
tab.CustomizedViewSession._getMessageFromResponse = function tab_CustomizedViewSession$_getMessageFromResponse(xhr) {
    if (ss.isValue(xhr.responseText)) {
        try {
            var o = tab.JsonUtil.parseJson(xhr.responseText);
            if (('msg' in o)) {
                return o.msg;
            }
        }
        catch (e) {
            tab.CustomizedViewSession._log.debug('Error parsing response as JSON: %o', e);
        }
    }
    return null;
}
tab.CustomizedViewSession.prototype = {
    _baseSession: null,
    
    navigateToCustomizedView: function tab_CustomizedViewSession$navigateToCustomizedView(cv) {
        var window = tabBootstrap.Utility.get_locationWindow();
        tab.SessionServerCommands.destroySessionAndForward(window, tab.CustomizedViewSession.buildUrl(cv));
    },
    
    navigateToOriginalView: function tab_CustomizedViewSession$navigateToOriginalView() {
        var window = tabBootstrap.Utility.get_locationWindow();
        tab.SessionServerCommands.destroySessionAndForward(window, tab.CustomizedViewSession.buildUrl(null));
    },
    
    getCustomizedViews: function tab_CustomizedViewSession$getCustomizedViews(success, failure) {
        var onSuccess = function(data, textStatus, xhr) {
            tab.CustomizedViewSession._log.debug('Got customized views: %o', data);
            if (!ss.isValue(success)) {
                return;
            }
            var cvs;
            var defCvId = null;
            if (('customizedViews' in data)) {
                cvs = data.customizedViews;
            }
            else {
                cvs = new Array(0);
            }
            if (('defaultCustomizedViewId' in data)) {
                defCvId = data.defaultCustomizedViewId;
            }
            success(cvs, defCvId);
        };
        this._sendSessionCvRequest(onSuccess, tab.CustomizedViewSession._genericErrorCallback(failure), 'get_customized_views', { sheet_id: tsConfig.current_sheet_name }, 'GET', 'none');
    },
    
    setDefaultCustomizedView: function tab_CustomizedViewSession$setDefaultCustomizedView(cv, success, failure) {
        var onSuccess = function(data, textStatus, xhr) {
            tab.CustomizedViewSession._log.debug('Set default customized view: %o', data);
            if (!ss.isValue(success)) {
                return;
            }
            var newDefault = null;
            if (('defaultCv' in data)) {
                newDefault = data.defaultCv;
            }
            success(newDefault);
        };
        var args = { sheet_id: tsConfig.current_sheet_name };
        if (ss.isValue(cv)) {
            args['cvId'] = cv.id;
        }
        this._sendSessionCvRequest(onSuccess, tab.CustomizedViewSession._genericErrorCallback(failure), 'set_default_customized_view', args);
    },
    
    destroyCustomizedView: function tab_CustomizedViewSession$destroyCustomizedView(cv, success, failure) {
        tab.Param.verifyValue(cv, 'cv');
        var onSuccess = function(data, textStatus, xhr) {
            tab.CustomizedViewSession._log.debug('Delete customized view: %o', data);
            if (!ss.isValue(success)) {
                return;
            }
            success();
        };
        this._sendCvRequest(onSuccess, tab.CustomizedViewSession._genericErrorCallback(failure), 'destroy_customized_view', { cvId: cv.id });
    },
    
    saveCustomizedView: function tab_CustomizedViewSession$saveCustomizedView(cv, success, failure) {
        tab.Param.verifyValue(cv, 'cv');
        var onSuccess = ss.Delegate.create(this, function(data, textStatus, xhr) {
            tab.CustomizedViewSession._log.debug('Save customized view: %o', data);
            if (!ss.isValue(success)) {
                return;
            }
            var savedCv = null;
            if (('cv' in data)) {
                savedCv = data.cv;
                this._updateTsConfig(savedCv);
            }
            success(savedCv);
        });
        var args = { sheet_id: tsConfig.current_sheet_name, name: cv.name, shared: cv.isPublic };
        if (ss.isValue(cv.id)) {
            args['cvId'] = cv.id;
        }
        this._sendSessionCvRequest(onSuccess, tab.CustomizedViewSession._genericErrorCallback(failure), 'save_customized_view', args);
    },
    
    _updateTsConfig: function tab_CustomizedViewSession$_updateTsConfig(customizedView) {
        var repoPathObject = new tab.RepoPathObject(tsConfig.repositoryUrl);
        tsConfig.repositoryUrl = String.format('{0}/{1}/{2}/{3}', repoPathObject.get_workbookId(), repoPathObject.get_sheetId(), tab.VizUriModel.encodeUserName(customizedView.owner.username), customizedView.urlId);
        tsConfig.current_custom_view_id = customizedView.id;
    },
    
    updateCustomizedView: function tab_CustomizedViewSession$updateCustomizedView(cv, success, failure) {
        tab.Param.verifyValue(cv, 'cv');
        var onSuccess = ss.Delegate.create(this, function(data, textStatus, xhr) {
            tab.CustomizedViewSession._log.debug('Update customized view: %o', data);
            if (!ss.isValue(success)) {
                return;
            }
            var updatedCv = null;
            if (('cv' in data)) {
                updatedCv = data.cv;
                this._updateTsConfig(updatedCv);
            }
            success(updatedCv);
        });
        var args = { sheet_id: tsConfig.current_sheet_name, name: cv.name, shared: cv.isPublic, cvId: cv.id };
        this._sendSessionCvRequest(onSuccess, tab.CustomizedViewSession._genericErrorCallback(failure), 'update_customized_view', args);
    },
    
    _sendCvRequest: function tab_CustomizedViewSession$_sendCvRequest(success, error, method, data) {
        var handler = this._baseSession._createHandler(null, success, error, 'immediately');
        var args = {};
        args.type = 'POST';
        args.url = this._baseSession._formatMethod(method);
        args.headers = { Accept: 'text/javascript' };
        args.dataType = 'json';
        if (ss.isValue(data)) {
            args.data = data;
        }
        this._baseSession._request(args, handler);
    },
    
    _sendSessionCvRequest: function tab_CustomizedViewSession$_sendSessionCvRequest(success, error, method, data, httpMethod, uiBlockType) {
        var args = {};
        args.type = (httpMethod || 'POST');
        args.url = this._baseSession._formatSessionMethod(method);
        args.headers = { Accept: 'text/javascript' };
        args.dataType = 'json';
        if (ss.isValue(data)) {
            args.data = data;
        }
        var realuiBlockType = (uiBlockType || 'immediately');
        var handler = this._baseSession._createHandler(null, success, error, realuiBlockType);
        this._baseSession._request(args, handler);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DojoCurrentState

tab.DojoCurrentState = function tab_DojoCurrentState() {
}
tab.DojoCurrentState.setInitialState = function tab_DojoCurrentState$setInitialState(undo) {
    var a = function() {
    };
    var obj = { back: undo, forward: a };
    dojo.back.setInitialState(obj);
}
tab.DojoCurrentState.addToHistory = function tab_DojoCurrentState$addToHistory(state) {
    dojo.back.addToHistory(state);
}
tab.DojoCurrentState.prototype = {
    back: null,
    forward: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.FailureHandler

tab.FailureHandler = function tab_FailureHandler() {
}
tab.FailureHandler.reportFailures = function tab_FailureHandler$reportFailures() {
    if (tab.ErrorTrace.hasTraces()) {
        var outgoing = tab.ErrorTrace.dequeueTraces();
        var entries = {};
        var url = outgoing[0].url;
        var userAgent = outgoing[0].userAgent;
        var errorNo = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(outgoing);
        while ($enum1.moveNext()) {
            var failure = $enum1.current;
            entries['Error #' + errorNo.toString()] = tab.FailureHandler.postContentForStackTrace(failure);
            errorNo++;
        }
        tab.CommandController.get().get_legacySession()._informServer(url, userAgent, entries);
    }
}
tab.FailureHandler.postContentForStackTrace = function tab_FailureHandler$postContentForStackTrace(stack) {
    var sb = new ss.StringBuilder();
    sb.appendLine('name: ' + stack.name);
    sb.appendLine('message: ' + stack.message);
    sb.appendLine('error-mode: ' + stack.traceMode);
    if (ss.isValue(stack.locations)) {
        sb.appendLine('stack:');
        var $enum1 = ss.IEnumerator.getEnumerator(stack.locations);
        while ($enum1.moveNext()) {
            var loc = $enum1.current;
            if (ss.isNullOrUndefined(loc.url) && ss.isNullOrUndefined(loc.lineNo) && ss.isNullOrUndefined(loc.functionName)) {
                continue;
            }
            sb.appendLine(loc.url + ':' + loc.lineNo + ' ' + loc.functionName);
            if (ss.isValue(loc.context) && loc.context.length > 0) {
                var $enum2 = ss.IEnumerator.getEnumerator(loc.context);
                while ($enum2.moveNext()) {
                    var contextItem = $enum2.current;
                    var truncatedContext = contextItem;
                    if (contextItem.length > 120) {
                        if (ss.isValue(loc.functionName) && contextItem.indexOf(loc.functionName) > 0) {
                            var index = contextItem.indexOf(loc.functionName);
                            var start = Math.max(0, index - (120 / 2));
                            var end = Math.min(start + 120, contextItem.length - 1);
                            truncatedContext = contextItem.substring(start, end);
                        }
                        else {
                            truncatedContext = contextItem.substr(0, 120);
                        }
                    }
                    sb.append('    ' + truncatedContext);
                }
            }
        }
    }
    return sb.toString();
}
tab.FailureHandler.dispose = function tab_FailureHandler$dispose() {
    tab.FailureHandler.reportFailures();
    window.clearInterval(tab.FailureHandler._intervalID);
    tab.FailureHandler._intervalID = -1;
}


////////////////////////////////////////////////////////////////////////////////
// tab.LayoutSession

tab.LayoutSession = function tab_LayoutSession(urlRoot, layoutid) {
    tab.LayoutSession.initializeBase(this, [ urlRoot ]);
    this.layoutid = layoutid;
}
tab.LayoutSession._getDashboardSize = function tab_LayoutSession$_getDashboardSize(appPresModel) {
    var portSize = null;
    if (ss.isValue(appPresModel) && ss.isValue(appPresModel.workbookPresModel) && ss.isValue(appPresModel.workbookPresModel.dashboardPresModel)) {
        var dashboardPresModel = appPresModel.workbookPresModel.dashboardPresModel;
        portSize = tab.$create_Size(dashboardPresModel.viewportSize.w, dashboardPresModel.viewportSize.h);
    }
    return portSize;
}
tab.LayoutSession.getViewingUriFromWorkbook = function tab_LayoutSession$getViewingUriFromWorkbook(w) {
    var v = _.find(w.views, function(o) {
        return o.name === tsConfig.current_sheet_name;
    }) || _.first(w.views);
    if (v == null) {
        tab.Logger.lazyGetLogger(tab.LayoutSession).warn('Workbook contains no views: %o', w);
        return tab.WindowHelper.getLocation(window.self).pathname;
    }
    return tab.LayoutSession.getViewingUri(w.repositoryUrl, v.sheetId);
}
tab.LayoutSession.getViewingUri = function tab_LayoutSession$getViewingUri(workbookId, viewId) {
    var url = new ss.StringBuilder();
    if (!String.isNullOrEmpty(tsConfig.site_root)) {
        url.append(tsConfig.site_root);
    }
    url.append('/views');
    url.append('/').append(workbookId).append('/').append(viewId);
    return url.toString();
}
tab.LayoutSession.prototype = {
    layoutid: null,
    
    get_layoutId: function tab_LayoutSession$get_layoutId() {
        return this.layoutid;
    },
    set_layoutId: function tab_LayoutSession$set_layoutId(value) {
        this.layoutid = value;
        return value;
    },
    
    formatDashboardTempfileReference: function tab_LayoutSession$formatDashboardTempfileReference(tempfileid, keepfile, attachment) {
        return this.formatLayoutMethod(this.layoutid, 'tempfile') + '/?key=' + tempfileid + ((keepfile) ? '&keepfile=yes' : '') + ((attachment) ? '&attachment=yes' : '');
    },
    
    saveSharedView: function tab_LayoutSession$saveSharedView(button, primaryContentUrl, doShareAction) {
        var onSuccess = function(data, textStatus, xhr) {
            data.button = button;
            if (ss.isValue(data.guid)) {
                tab.XhrUtil.guid = data.guid;
            }
            dojo.publish('newGuid', [ data ]);
        };
        var onError = ss.Delegate.create(this, function(xhr, textStatus, error) {
            tab.XhrUtil.guid = null;
            if (xhr.status === 410 || xhr.status === 403) {
                this.handleSessionExpiration(false);
            }
            else if (xhr.status === 401) {
                this.handleAuthenticationFailure();
            }
            else {
                var data = {};
                data.button = button;
                doShareAction(data);
            }
        });
        var handler = this._createHandler(null, onSuccess, onError, 'none');
        var dat = {};
        dat['sheet_id'] = tab.XhrUtil.get_currentTabName();
        dat['parent_id'] = tab.XhrUtil.parentID;
        dat['primary_content_url'] = primaryContentUrl;
        dat['share_button'] = button;
        var args = this.basicPostOpts(this._formatSessionMethod('save_shared_view'), dat);
        args.async = false;
        args.timeout = 2000;
        this._request(args, handler);
    },
    
    getBootstrapRequestLayoutModelSuccessFunction: function tab_LayoutSession$getBootstrapRequestLayoutModelSuccessFunction(sheetName) {
        var action = function(appPresModel) {
            var portSize = tab.LayoutSession._getDashboardSize(appPresModel);
            dojo.publish('refreshLayoutModel', [ portSize ]);
            if (!ss.isNullOrUndefined(sheetName)) {
                dojo.publish('onBootstrapSuccess', [ sheetName ]);
            }
        };
        return action;
    },
    
    formatExportURL: function tab_LayoutSession$formatExportURL(mimetype, options, scrollData) {
        var ret = this.formatLayoutMethod(this.layoutid, 'export') + '?format=' + mimetype;
        if (ss.isValue(options)) {
            ret += '&' + $.param(options);
        }
        if (ss.isValue(scrollData)) {
            ret += '&' + $.param(scrollData);
        }
        return ret;
    },
    
    saveAndOpenMetricsView: function tab_LayoutSession$saveAndOpenMetricsView() {
        window.open(this._formatSessionMethod('save_metrics_view'), 'metrics', 'scrollbars,resizable');
    },
    
    metricsViewDownloadUrl: function tab_LayoutSession$metricsViewDownloadUrl() {
        return this._formatSessionMethod('download_metrics_view');
    },
    
    getAutocompleteInfo: function tab_LayoutSession$getAutocompleteInfo(currentStr, updateFunc, field) {
        var onSuccess = function(resp, textStatus, xhr) {
            updateFunc(resp.new_value);
        };
        var args = this.basicGetOpts(this.formatLayoutMethod(this.layoutid, 'getautocomplete'));
        var param = { fieldname: field, input_string: currentStr };
        args.data = param;
        args.success = onSuccess;
        this._request(args);
    },
    
    performPostLoadOperations: function tab_LayoutSession$performPostLoadOperations(sheetId, responseCallback) {
        var onSuccess = function(resp, textStatus, xhr) {
            if (ss.isValue(responseCallback)) {
                responseCallback(resp);
            }
        };
        var onError = ss.Delegate.create(this, function(request, textStatus, error) {
            if (request.status === 410 || request.status === 404 || request.status === 403) {
                throw new Error(request.status + ' response on postLoadOperations');
            }
            else {
                this._handleError(error, request, true);
            }
        });
        var handler = this._createHandler(null, onSuccess, onError, 'none');
        var param = { sheet_id: sheetId };
        var args = {};
        args.data = param;
        args.async = true;
        args.type = 'GET';
        args.headers = { Accept: 'text/javascript' };
        args.dataType = 'json';
        args.url = this.formatLayoutMethod(this.layoutid, 'performPostLoadOperations');
        this._request(args, handler);
    },
    
    launchEditing: function tab_LayoutSession$launchEditing(authoringSheetName) {
        var authoringVizUriModel;
        if (tab.MiscUtil.isNullOrEmpty(authoringSheetName)) {
            authoringVizUriModel = tab.VizUriModel.createForAuthoringPublishedSheet(tsConfig.repositoryUrl);
        }
        else {
            authoringVizUriModel = tab.VizUriModel.createForAuthoringUnpublishedSheet(tsConfig.repositoryUrl, authoringSheetName);
        }
        authoringVizUriModel.removeAllQueryParams();
        authoringVizUriModel.removeHash();
        if (!tsConfig.openAuthoringInTopWindow && (tabBootstrap.Utility.get_embedMode() === 'embeddedNotInWg' || tsConfig.is_mobile_app)) {
            tab.WindowHelper.open(authoringVizUriModel.get_uri(), 'tableauAuthoring');
        }
        else {
            authoringVizUriModel.setTopWindowLocation();
        }
    },
    
    getTopic: function tab_LayoutSession$getTopic(topicId) {
        return this.getTopicCore(topicId, 'Layout_' + tsConfig.sheetId);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SessionAjaxCallManager

tab.SessionAjaxCallManager = function tab_SessionAjaxCallManager(session, onComplete, onSuccess, onError, usesWaitHandler, immediateWait) {
    this._session = session;
    this._onComplete = onComplete;
    this._onSuccess = onSuccess;
    this._onError = onError;
    if (ss.isNullOrUndefined(usesWaitHandler) || usesWaitHandler) {
        this._didWait = this._session.incrementWait(immediateWait);
    }
}
tab.SessionAjaxCallManager.prototype = {
    _session: null,
    _onComplete: null,
    _onSuccess: null,
    _onError: null,
    _didWait: false,
    
    get_completedDelegate: function tab_SessionAjaxCallManager$get_completedDelegate() {
        return ss.Delegate.create(this, this.onComplete);
    },
    
    get_successDelegate: function tab_SessionAjaxCallManager$get_successDelegate() {
        return ss.Delegate.create(this, this.onSuccess);
    },
    
    get_errorDelegate: function tab_SessionAjaxCallManager$get_errorDelegate() {
        return ss.Delegate.create(this, this.onError);
    },
    
    onComplete: function tab_SessionAjaxCallManager$onComplete(xhr, textStatus) {
        try {
            if (ss.isValue(this._onComplete)) {
                this._onComplete(xhr, textStatus);
            }
        }
        finally {
            this._postProcess();
        }
    },
    
    onSuccess: function tab_SessionAjaxCallManager$onSuccess(data, textStatus, xhr) {
        try {
            var detectedError = false;
            detectedError = data instanceof Error;
            if (detectedError) {
                this._session._handleError(data, xhr);
            }
            else if (xhr.status === 202) {
                var args = xhr.args;
                var handler = new tab.SessionAjaxHandler(this._session, args);
                handler.requestStatus();
                detectedError = true;
            }
            if (!detectedError) {
                if (ss.isValue(this._onSuccess)) {
                    this._onSuccess(data, textStatus, xhr);
                }
            }
        }
        finally {
            this._postProcess();
        }
    },
    
    onError: function tab_SessionAjaxCallManager$onError(xhr, textStatus, errorThrown) {
        try {
            if (ss.isValue(this._onError)) {
                this._onError(xhr, textStatus, errorThrown);
            }
            else {
                this._session._handleError(errorThrown, xhr);
            }
        }
        finally {
            this._postProcess();
        }
    },
    
    _postProcess: function tab_SessionAjaxCallManager$_postProcess() {
        if (this._didWait) {
            this._didWait = false;
            this._session.decrementWait();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SessionAjaxHandler

tab.SessionAjaxHandler = function tab_SessionAjaxHandler(session, args) {
    this._url = '';
    this._session = session;
    this._originalArgs = args;
    this._url = session._formatSessionMethod('status');
}
tab.SessionAjaxHandler.prototype = {
    _ready: false,
    _originalArgs: null,
    _requests: 0,
    _interval: 1000,
    _session: null,
    
    requestStatus: function tab_SessionAjaxHandler$requestStatus() {
        var onSuccess = ss.Delegate.create(this, function(data, textStatus, xhr) {
            this._onSuccess(textStatus, xhr);
        });
        var onError = ss.Delegate.create(this, function(xhr, textStatus, errorThrown) {
            this._onError(xhr, textStatus);
        });
        var handler = new tab.SessionAjaxCallManager(this._session, null, onSuccess, onError, false, false);
        var args = {};
        args.type = 'GET';
        args.url = this._url;
        args.cache = false;
        tab.XhrUtil.helper(args, handler);
    },
    
    _onSuccess: function tab_SessionAjaxHandler$_onSuccess(textStatus, xhr) {
        if (xhr.status === 204) {
            this._ready = true;
        }
        this._queueNextRequest(textStatus, xhr);
    },
    
    _onError: function tab_SessionAjaxHandler$_onError(xhr, textStatus) {
        if (ss.isNullOrUndefined(this._originalArgs.complete)) {
            this._originalArgs.complete(xhr, textStatus);
        }
    },
    
    _queueNextRequest: function tab_SessionAjaxHandler$_queueNextRequest(textStatus, xhr) {
        ++this._requests;
        if (!(this._requests % 10) && this._interval < 4000) {
            this._interval *= 2;
        }
        if (!this._ready) {
            window.setTimeout(ss.Delegate.create(this, function() {
                this.requestStatus();
            }), this._interval);
        }
        else {
            var skipResendOriginal = this._originalArgs.skipResendOriginal;
            if (ss.isValue(skipResendOriginal) && skipResendOriginal) {
                if (ss.isValue(this._originalArgs.complete)) {
                    this._originalArgs.complete(xhr, textStatus);
                }
            }
            else {
                window.setTimeout(ss.Delegate.create(this, function() {
                    this._resendOriginal();
                }), 0);
            }
        }
    },
    
    _resendOriginal: function tab_SessionAjaxHandler$_resendOriginal() {
        if (!this._originalArgs.async) {
            delete this._originalArgs.async;
        }
        tab.XhrUtil.helper(this._originalArgs);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SheetSession

tab.SheetSession = function tab_SheetSession(urlRoot, sheetid) {
    tab.SheetSession.initializeBase(this, [ urlRoot ]);
    this.sheetid = sheetid;
}
tab.SheetSession.prototype = {
    sheetid: null,
    
    add_sheetDataChanged: function tab_SheetSession$add_sheetDataChanged(value) {
        this.__sheetDataChanged$1 = ss.Delegate.combine(this.__sheetDataChanged$1, value);
    },
    remove_sheetDataChanged: function tab_SheetSession$remove_sheetDataChanged(value) {
        this.__sheetDataChanged$1 = ss.Delegate.remove(this.__sheetDataChanged$1, value);
    },
    
    __sheetDataChanged$1: null,
    
    get_visualId: function tab_SheetSession$get_visualId() {
        return tab.ModelUtils.getVisualId(this.sheetid);
    },
    
    requestHSMChildren: function tab_SheetSession$requestHSMChildren(field, member, onComplete, onError) {
        if (!tsConfig.allow_filter) {
            return;
        }
        var onSuccess = function(resp, textStatus, xhr) {
            onComplete(resp);
        };
        var handler = this._createHandler(null, onSuccess, null, 'none');
        var file = {};
        file.name = 'file';
        file.filename = 'file';
        file.contentType = 'text/javascript';
        file.content = tab.JsonUtil.toJson(member, true, '');
        var dict = { _method: 'PUT' };
        var payload = tab.XhrUtil.getMultipartData(file, dict);
        var args = {};
        args.type = 'POST';
        args.url = this.formatFilterReference(this.sheetid, field, 'show_children');
        args.dataType = 'json';
        args.contentType = 'multipart/form-data; boundary=' + payload.header;
        args.data = payload.body;
        this._request(args, handler);
    },
    
    getFilterItems: function tab_SheetSession$getFilterItems(field, domain, itemRange, onComplete, onError) {
        if (!tsConfig.allow_filter) {
            return;
        }
        var onSuccess = function(resp, textStatus, xhr) {
            onComplete(resp);
        };
        var handler = this._createHandler(null, onSuccess, null, 'none');
        var dat = {};
        dat['fromIndex'] = itemRange.get_from();
        dat['toIndex'] = itemRange.get_to();
        dat['domain'] = domain;
        var args = this.basicGetOpts(this.formatFilterReference(this.sheetid, field, 'getfilteritems'));
        args.data = dat;
        this._request(args, handler);
    },
    
    setPatternFilterState: function tab_SheetSession$setPatternFilterState(pattern, filterDef) {
        var fieldName = filterDef.field;
        tab.FilterClientCommands.setPatternFilterState(this.get_visualId(), fieldName, pattern.toString());
    },
    
    addManualFilterItems: function tab_SheetSession$addManualFilterItems(data, filterDef) {
        var fieldName = filterDef.field;
        tab.FilterClientCommands.addManualFilterItems(this.get_visualId(), fieldName, data);
    },
    
    searchFilter: function tab_SheetSession$searchFilter(field, query, maxRows, shouldGetIndex, domain, successHandler, errorHandler) {
        if (!tsConfig.allow_filter) {
            return null;
        }
        var onSuccess = function(resp, textStatus, xhr) {
            var data = resp;
            successHandler(data);
        };
        var onError = function(xhr, textStatus, errorThrown) {
            errorHandler(errorThrown);
        };
        var handler = this._createHandler(null, onSuccess, onError, 'none');
        var urlSlug = (shouldGetIndex) ? 'searchwithindex' : 'search';
        var args = this.basicGetOpts(this.formatFilterReference(this.sheetid, field, urlSlug));
        var param = { query: query, maxRows: maxRows, domain: domain };
        args.data = param;
        return this._request(args, handler);
    },
    
    restoreSheetAxes: function tab_SheetSession$restoreSheetAxes() {
        this.requestRestoreFixedAxes(this.get_visualId());
    },
    
    getTopic: function tab_SheetSession$getTopic(topicId) {
        return this.getTopicCore(topicId, 'Sheet_' + this.sheetid);
    },
    
    fireSheetDataChanged: function tab_SheetSession$fireSheetDataChanged() {
        if (ss.isValue(this.__sheetDataChanged$1)) {
            this.__sheetDataChanged$1();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ViewSession

tab.ViewSession = function tab_ViewSession(urlRoot, sheetId, viewid) {
    tab.ViewSession.initializeBase(this, [ urlRoot, sheetId ]);
    tab.Log.get(this).debug('New id=%s, sheet=%s, view=%s', tsConfig.sessionid, sheetId, viewid);
    this.viewid = viewid;
    this._commandPermission$2 = tab.PermissionManager.buildCommandPermission();
}
tab.ViewSession._roundPoint$2 = function tab_ViewSession$_roundPoint$2(p) {
    var toRet = p;
    if (ss.isValue(p)) {
        toRet = tab.$create_Point(Math.round(p.x), Math.round(p.y));
    }
    return toRet;
}
tab.ViewSession.prototype = {
    _commandPermission$2: null,
    viewid: null,
    
    get_viewId: function tab_ViewSession$get_viewId() {
        return this.viewid;
    },
    set_viewId: function tab_ViewSession$set_viewId(value) {
        if (this.viewid === value) {
            return;
        }
        this.viewid = value;
        tab.Log.get(this).debug('Update viewId=%s', this.viewid);
        return value;
    },
    
    fireSelectionChanged: function tab_ViewSession$fireSelectionChanged(data) {
        tab.Log.get(this).debug('Firing SelectionChanged');
        this.fireEvent('selectionChanged', data);
    },
    
    _formatRegionImageURL$2: function tab_ViewSession$_formatRegionImageURL$2(sregion) {
        return this.formatViewMethod(this.viewid, 'region') + '?r=' + sregion;
    },
    
    formatRegionTileURL: function tab_ViewSession$formatRegionTileURL(cacheInfo, r, requestId) {
        if (cacheInfo.useUrl) {
            return this.formatTileURL(cacheInfo, r, 0, 0, '', requestId);
        }
        return this._formatRegionImageURL$2(r) + '&' + requestId;
    },
    
    _formatLegendRegionImageURL$2: function tab_ViewSession$_formatLegendRegionImageURL$2(sregion, fn) {
        var queryStr = '';
        if (!tab.MiscUtil.isNullOrEmpty(fn)) {
            queryStr = '&fn=' + encodeURIComponent(fn);
        }
        return this.formatViewMethod(this.viewid, 'region') + '?r=' + sregion + queryStr;
    },
    
    formatLegendRegionTileURL: function tab_ViewSession$formatLegendRegionTileURL(cacheInfo, r, fn, fnid, requestId) {
        fnid = (ss.isNullOrUndefined(fnid)) ? '' : fnid;
        if (cacheInfo.useUrl) {
            return this.formatTileURL(cacheInfo, r + fnid, 0, 0, fn, requestId);
        }
        return this._formatLegendRegionImageURL$2(r, fn) + '&' + requestId;
    },
    
    formatTileURL: function tab_ViewSession$formatTileURL(cacheInfo, r, tileX, tileY, fn, requestId) {
        if (cacheInfo.useUrl) {
            var url = cacheInfo.url;
            var queryStr = '';
            if (!tab.MiscUtil.isNullOrEmpty(fn)) {
                queryStr = '?fn=' + encodeURIComponent(fn) + '&' + requestId;
            }
            else {
                queryStr = '?=' + requestId;
            }
            return url.replaceAll('%SESSIONID%', tsConfig.sessionid).replaceAll('[r]', r).replaceAll('[x]', tileX.toString()).replaceAll('[y]', tileY.toString()) + queryStr;
        }
        var viewMethod = this.formatViewMethod(this.viewid, 'tile');
        return viewMethod + '?r=' + r + '&x=' + tileX + '&y=' + tileY + '&' + requestId;
    },
    
    formatUnderlyingDataURL: function tab_ViewSession$formatUnderlyingDataURL(selectAtPoint) {
        var sb = new ss.StringBuilder(this.formatViewMethod(this.viewid, 'viewData'));
        sb.append('?maxrows=200');
        if (ss.isValue(selectAtPoint)) {
            sb.append('&select_x=').append(selectAtPoint.x);
            sb.append('&select_y=').append(selectAtPoint.y);
        }
        return sb.toString();
    },
    
    formatExportCrossTabURL: function tab_ViewSession$formatExportCrossTabURL(charset) {
        if (ss.isNullOrUndefined(charset)) {
            charset = 'utf8';
        }
        return this.formatViewMethod(this.viewid, 'exportcrosstab') + '?charset=' + charset;
    },
    
    fireRefreshLegacyLegendImages: function tab_ViewSession$fireRefreshLegacyLegendImages(data) {
        tab.Log.get(this).debug('Firing RefreshLegacyLegendImages');
        this.fireEvent('refreshLegacyLegendImages', data);
    },
    
    zoomDoubleClick: function tab_ViewSession$zoomDoubleClick(regionPart, rect, paneResolverPoint, isZoomin, deferAPI) {
        deferAPI.isZoomin = isZoomin;
        this.zoom(regionPart, rect, paneResolverPoint, isZoomin, deferAPI);
    },
    
    zoomIn: function tab_ViewSession$zoomIn(regionPart, rect, paneResolverPoint) {
        this.zoom(regionPart, rect, paneResolverPoint, true, null);
    },
    
    zoomOut: function tab_ViewSession$zoomOut(regionPart, point, paneResolverPoint) {
        this.zoom(regionPart, point, paneResolverPoint, false, null);
    },
    
    zoom: function tab_ViewSession$zoom(regionPart, rect, paneResolverPoint, isZoomin, deferAPI) {
        if (!tsConfig.allow_filter) {
            return;
        }
        var cmdParams = {};
        var regionRect = {};
        var regionWrapper = tab.VizRegionRectWrapper.create(regionRect);
        regionWrapper.set_r(regionPart);
        regionWrapper.set_x(rect.x);
        regionWrapper.set_y(rect.y);
        if (ss.isValue(regionWrapper.get_x())) {
            regionWrapper.set_x(Math.round(regionWrapper.get_x()));
        }
        if (ss.isValue(regionWrapper.get_y())) {
            regionWrapper.set_y(Math.round(regionWrapper.get_y()));
        }
        if (ss.isValue(rect.w) && ss.isValue(rect.h)) {
            regionWrapper.set_w(rect.w);
            regionWrapper.set_h(rect.h);
        }
        cmdParams['vizRegionRect'] = regionRect;
        cmdParams['zoomIn'] = isZoomin;
        cmdParams['focus'] = false;
        if (ss.isValue(paneResolverPoint)) {
            paneResolverPoint = tab.ViewSession._roundPoint$2(paneResolverPoint);
            var pointParam = tab.PointUtil.toPresModel(paneResolverPoint);
            cmdParams['paneResolverLocation'] = pointParam;
        }
        var c = {};
        c.commandNamespace = 'tabsrv';
        c.commandName = 'pane-zoom-server';
        c.commandParams = cmdParams;
        tab.CommandUtils.addVisualIdToCommand(c.commandParams, this.get_visualId());
        var successCallback = ss.Delegate.create(this, function(presModel) {
            if (ss.isValue(deferAPI)) {
                deferAPI.setDeferLayoutUpdates(false);
            }
            tab.Log.get(this).debug('Got zoom-' + ((isZoomin) ? 'in' : 'out') + ' response; firing SheetDataChanged');
            this.fireSheetDataChanged();
        });
        tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'afterDelay', successCallback, function() {
        }));
    },
    
    pan: function tab_ViewSession$pan(regionPart, point, delta, onError) {
        if (!tsConfig.allow_filter) {
            return;
        }
        var cmdParams = {};
        cmdParams['r'] = regionPart;
        cmdParams['panLocation'] = tab.PointUtil.toPresModel(tab.ViewSession._roundPoint$2(point));
        cmdParams['panAmount'] = tab.PointUtil.toPresModel(tab.ViewSession._roundPoint$2(delta));
        var c = {};
        c.commandNamespace = 'tabsrv';
        c.commandName = 'pane-pan-server';
        c.commandParams = cmdParams;
        tab.CommandUtils.addVisualIdToCommand(c.commandParams, this.get_visualId());
        var successCallback = ss.Delegate.create(this, function(presModel) {
            tab.Log.get(this).debug('Got pan response; firing SheetDataChanged');
            this.fireSheetDataChanged();
        });
        var errorCallback = function(o) {
            onError();
        };
        tab.ServerCommands.executeServerCommand(c, 'afterDelay', successCallback, errorCallback);
    },
    
    toggleHighlight: function tab_ViewSession$toggleHighlight(regionPart, encodedFieldName) {
        var successCallback = ss.Delegate.create(this, function(isEnabled) {
            tab.Log.get(this).debug('Got togglehighlight response');
            this._onSelectionResponse$2(null, isEnabled);
        });
        var fieldNames = encodedFieldName.split('\n');
        var zoneId = tab.ModelUtils.getZoneIdForSheetName(this.sheetid);
        if (zoneId !== -1) {
            tab.SelectionClientCommands.toggleLegendHighlight(zoneId, this.get_visualId(), regionPart, fieldNames, successCallback);
        }
    },
    
    executeAction: function tab_ViewSession$executeAction(action, successCallback, onFailure) {
        if (action.commandType === 9) {
            this.executeCommand(action);
        }
        else {
            var c = {};
            c.commandNamespace = 'tabdoc';
            c.commandName = 'run-action';
            c.commandParams = action.command.commandParams;
            tab.ServerCommands.executeServerCommand(c, 'immediately', successCallback, onFailure);
        }
    },
    
    executeCommand: function tab_ViewSession$executeCommand(command) {
        tab.Log.get(this).debug('Execute command: %o', command);
        if (command == null) {
            return;
        }
        switch (command.commandType) {
            case 9:
                var urlAction = {};
                urlAction.url = (command.command.commandParams).url;
                urlAction.target = (command.command.commandParams).target;
                tab.ActionUtils.launchActionUrls([ urlAction ]);
                break;
            case 7:
                var p = null;
                if (ss.isValue(command.command) && ss.isValue(command.command.commandParams) && Object.keyExists(command.command.commandParams, 'selectAtPoint')) {
                    p = tab.JsonUtil.parseJson(command.command.commandParams['selectAtPoint']);
                }
                window.open(this.formatUnderlyingDataURL(p), this.getWindow('vud'), 'scrollbars,resizable');
                break;
            case 1:
            case 2:
            case 4:
            case 6:
            case 11:
            case 12:
            case 10:
            case 13:
                tab.Log.get(this).debug('Command should probably be called directly or handled by UberTipClientCommands.ExecuteUbertipCommand : %o', command);
                break;
            default:
                tab.Log.get(this).debug('Unknown command type: %o', command);
                break;
        }
    },
    
    levelDrill: function tab_ViewSession$levelDrill(position, direction, axis) {
        if (!tsConfig.allow_filter) {
            return;
        }
        var shelfType = (axis.toString() === 'yheader') ? 'rows-shelf' : 'columns-shelf';
        var isDrillDown = (direction === 'down');
        tab.FilterClientCommands.levelDrill(this.get_visualId(), position, shelfType, isDrillDown);
    },
    
    createUbertipModel: function tab_ViewSession$createUbertipModel(ubertip) {
        var model = tab.UbertipSerializer.deserializeUbertip(ubertip);
        if (ss.isValue(model)) {
            tab.PermissionManager.filterCommands(model.commands, this._commandPermission$2);
        }
        return model;
    },
    
    getTopic: function tab_ViewSession$getTopic(topicId) {
        var m = new tab.EventMap();
        var eventID = m.get_item(topicId);
        var viewChangedID = m.get_item('viewChanged');
        if (eventID >= viewChangedID) {
            return this.getTopicCore(topicId, 'View_' + this.sheetid);
        }
        return tab.ViewSession.callBaseMethod(this, 'getTopic', [ topicId ]);
    },
    
    _onSelectionResponse$2: function tab_ViewSession$_onSelectionResponse$2(tooltipCallback, data) {
        var tabChanged = false;
        var handle = dojo.subscribe(this.getTopic('onTabSelect'), function(o) {
            tabChanged = true;
        });
        data.primarySheet = this.sheetid;
        if (ss.isValue(data) && ss.isValue(tooltipCallback)) {
            var ubertipModel;
            if (!tabChanged && (ss.isNullOrUndefined(tsConfig.allow_tooltip) || tsConfig.allow_tooltip)) {
                var ubertip = data.ubertip;
                ubertipModel = this.createUbertipModel(ubertip);
            }
            else {
                ubertipModel = null;
            }
            tooltipCallback(ubertipModel);
        }
        dojo.unsubscribe(handle);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.WaitHandler

tab.WaitHandler = function tab_WaitHandler() {
    this._glassPaneNode = $('#loadingGlassPane');
    this._glassPaneNode.bind('mousedown', false);
    this._spinnerNode = $('#loadingSpinner');
    this._refcnt = 0;
    this._valid = true;
    this._animate = dojo.animateProperty;
    this._easing = dojo.fx.easing;
    this._fadeOut = dojo.fadeOut;
    this._glassAnimation = null;
    this._spinnerAnimation = null;
    this._isVisible = true;
    this._isLocked = false;
}
tab.WaitHandler.prototype = {
    _glassPaneNode: null,
    _spinnerNode: null,
    _animate: null,
    _easing: null,
    _fadeOut: null,
    _refcnt: 0,
    _valid: false,
    _glassShowTimer: null,
    _spinnerShowTimer: null,
    _glassAnimation: null,
    _spinnerAnimation: null,
    _fadeOutAnimation: null,
    _specialHideFunc: null,
    _isVisible: false,
    _isLocked: false,
    
    isBusy: function tab_WaitHandler$isBusy() {
        return this._refcnt > 0;
    },
    
    addref: function tab_WaitHandler$addref(immediateWait) {
        if (!this._valid) {
            return;
        }
        this._refcnt += 1;
        tab.Log.get(this).debug('Increment WaitHandler refcnt to ' + this._refcnt.toString());
        if (this._refcnt === 1 && !this._isVisible && !this._isLocked) {
            this._show(immediateWait);
        }
    },
    
    addrefAndTurnOnImmediately: function tab_WaitHandler$addrefAndTurnOnImmediately() {
        if (!this._valid) {
            return;
        }
        this._refcnt += 1;
        tab.Log.get(this).debug('(SlamOn) Increment WaitHandler refcnt to ' + this._refcnt.toString());
        this._show(true, true);
    },
    
    showAndLock: function tab_WaitHandler$showAndLock() {
        this._show(true, true);
        this.lock();
    },
    
    lock: function tab_WaitHandler$lock() {
        this._isLocked = true;
    },
    
    unlock: function tab_WaitHandler$unlock() {
        this._isLocked = false;
    },
    
    release: function tab_WaitHandler$release() {
        if (!this._valid) {
            return;
        }
        this._refcnt -= 1;
        tab.Log.get(this).debug('Decrement WaitHandler refcnt to ' + this._refcnt.toString());
        if (this._refcnt < 0) {
            this._refcnt = 0;
            tab.Log.get(this).debug('  => refcnt set to 0');
        }
        this.nudge();
    },
    
    nudge: function tab_WaitHandler$nudge() {
        if (this._refcnt > 0 || this._isLocked) {
            tab.Log.get(this).debug('Nudge - no change as > 0');
            return;
        }
        tab.Log.get(this).debug('Hiding WaitHandler via Nudge');
        this._hide();
    },
    
    invalidate: function tab_WaitHandler$invalidate() {
        this._valid = false;
        this._show();
    },
    
    reset: function tab_WaitHandler$reset() {
        this._clearTimersAndAnimations();
        var FadeOutDuration = 300;
        var GlassEaseOut = 'linear';
        this._spinnerNode.hide().css('opacity', '0');
        if (!this._glassPaneNode.length) {
            return;
        }
        var onEnd = ss.Delegate.create(this, function() {
            this._glassPaneNode.css('cursor', 'default').hide();
            tab.Log.get(this).debug(Date.get_now().getTime().toString() + ' - Fade out finished');
            this._fadeOutAnimation = null;
            var fake = $('.facadedom');
            if (fake.length > 0) {
                tab.Logger.getLoggerWithName('facadedom').debug(Date.get_now().getTime().toString() + ' Destroying facade');
                fake.remove();
                tab.Logger.getLoggerWithName('facadedom').debug(Date.get_now().getTime().toString() + ' Facade destroyed');
            }
        });
        var glassFadeParams = { node: this._glassPaneNode[0], duration: FadeOutDuration, easing: this._easing[GlassEaseOut], onEnd: onEnd };
        this._fadeOutAnimation = this._fadeOut(glassFadeParams);
        tab.Log.get(this).debug(Date.get_now().getTime().toString() + ' - Reset WaitHandler');
        this._fadeOutAnimation.play();
    },
    
    onNextHide: function tab_WaitHandler$onNextHide(f) {
        this._specialHideFunc = f;
    },
    
    _clearTimersAndAnimations: function tab_WaitHandler$_clearTimersAndAnimations() {
        tab.Log.get(this).debug('Clear Timers and Animations');
        if (ss.isValue(this._glassShowTimer)) {
            window.clearTimeout(this._glassShowTimer);
        }
        delete this.glassShowTimer;
        if (ss.isValue(this._spinnerShowTimer)) {
            window.clearTimeout(this._spinnerShowTimer);
        }
        delete this.spinnerShowTimer;
        if (ss.isValue(this._fadeOutAnimation)) {
            this._fadeOutAnimation.stop();
            this._fadeOutAnimation = null;
        }
        if (ss.isValue(this._glassAnimation)) {
            this._glassAnimation.stop();
            this._glassAnimation = null;
        }
        if (ss.isValue(this._spinnerAnimation)) {
            this._spinnerAnimation.stop();
            this._spinnerAnimation = null;
        }
    },
    
    _hide: function tab_WaitHandler$_hide() {
        if (ss.isValue(this._specialHideFunc)) {
            this._specialHideFunc();
            this._specialHideFunc = null;
            tab.Log.get(this).debug('Calling special WaitHandler hide function');
        }
        else {
            this.reset();
        }
        this._isVisible = false;
    },
    
    _show: function tab_WaitHandler$_show(immediate, everythingAtOnce) {
        var glassShowDelay = 400;
        var GlassShowDuration = 500;
        var spinnerShowDelay = 1900;
        var SpinnerShowDuration = 100;
        var GlassEaseIn = 'quadOut';
        var SpinnerEaseIn = 'linear';
        var GlassOpacity = 0.24;
        tab.Log.get(this).debug(Date.get_now().getTime().toString() + ' - Show WaitHandler');
        if (immediate) {
            glassShowDelay = 0;
            spinnerShowDelay -= 400;
        }
        this._clearTimersAndAnimations();
        if (everythingAtOnce) {
            this._playGlassShowAnimation(GlassShowDuration, GlassEaseIn, GlassOpacity);
            this._playSpinnerShowAnimation(SpinnerShowDuration, SpinnerEaseIn);
        }
        else {
            this._glassShowTimer = window.setTimeout(ss.Delegate.create(this, function() {
                this._playGlassShowAnimation(GlassShowDuration, GlassEaseIn, GlassOpacity);
            }), glassShowDelay);
            this._spinnerShowTimer = window.setTimeout(ss.Delegate.create(this, function() {
                this._playSpinnerShowAnimation(SpinnerShowDuration, SpinnerEaseIn);
            }), spinnerShowDelay);
        }
        this._isVisible = true;
    },
    
    _playGlassShowAnimation: function tab_WaitHandler$_playGlassShowAnimation(duration, easeIn, opacity) {
        if (ss.isValue(this._fadeOutAnimation)) {
            tab.Log.get(this).debug(Date.get_now().getTime().toString() + ' - Kill executing fade out');
            this._fadeOutAnimation.stop();
            this._fadeOutAnimation = null;
        }
        var onBegin = ss.Delegate.create(this, function() {
            this._glassPaneNode.show().css('cursor', 'wait');
        });
        var onEnd = ss.Delegate.create(this, function() {
            this._glassShowTimer = null;
            this._glassAnimation = null;
        });
        var glassPaneParams = { node: this._glassPaneNode[0], onBegin: onBegin, onEnd: onEnd, onStop: onEnd, properties: { opacity: { start: 0, end: opacity } }, duration: duration, easing: this._easing[easeIn] };
        this._glassAnimation = this._animate(glassPaneParams);
        tab.Log.get(this).debug(Date.get_now().getTime().toString() + ' - Start glass');
        this._glassAnimation.play();
    },
    
    _playSpinnerShowAnimation: function tab_WaitHandler$_playSpinnerShowAnimation(duration, easeIn) {
        var onBegin = ss.Delegate.create(this, function() {
            this._spinnerNode.show();
        });
        var onEnd = ss.Delegate.create(this, function() {
            this._spinnerShowTimer = null;
            this._spinnerAnimation = null;
        });
        var spinnerParams = { node: this._spinnerNode[0], onBegin: onBegin, onEnd: onEnd, onStop: onEnd, properties: { opacity: { start: 0, end: 1 } }, duration: duration, easing: this._easing[easeIn] };
        this._spinnerAnimation = this._animate(spinnerParams);
        tab.Log.get(this).debug(Date.get_now().getTime().toString() + ' - Start spinner');
        this._spinnerAnimation.play();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.BrushingComputer

tab.BrushingComputer = function tab_BrushingComputer() {
    this._tupleBrushing = {};
    this._legendBrushing = {};
    this._nodeBrushing = {};
}
tab.BrushingComputer.get__log = function tab_BrushingComputer$get__log() {
    return tab.Logger.lazyGetLogger(tab.BrushingComputer);
}
tab.BrushingComputer.computeFromLegend = function tab_BrushingComputer$computeFromLegend(legendVisualModel, selectedItemsIds, legendModel) {
    var toRet = new tab.BrushingComputer();
    if (!legendModel.get_isHighlightEnabled()) {
        return toRet;
    }
    var vizData = legendVisualModel.get_vizDataModel();
    var legendValues = tab._brushingDataUtils._buildLegendSelectionDataValues(legendModel, selectedItemsIds, vizData, legendModel.get_fieldCaptions());
    var $enum1 = ss.IEnumerator.getEnumerator(legendModel.get_fieldCaptions());
    while ($enum1.moveNext()) {
        var caption = $enum1.current;
        if (legendVisualModel.vizDataContainsDuplicateCaption(caption)) {
            tab.BrushingComputer.get__log().debug('Duplicate caption, not going to calculate brushing: %s', caption);
            toRet._isBrushingComputed = false;
            return toRet;
        }
    }
    var modelsToProcess;
    if (legendModel.get_isOneWay()) {
        modelsToProcess = tab.ModelUtils.getVisualModels(tab.ApplicationModel.get_instance());
    }
    else {
        modelsToProcess = {};
        var relevantActions = tab.ActionUtils.getApplicableActions(legendVisualModel.get_worksheetName(), 'on-select', 'highlight');
        var $enum2 = ss.IEnumerator.getEnumerator(relevantActions);
        while ($enum2.moveNext()) {
            var actionPresModel = $enum2.current;
            if (ss.isNullOrUndefined(actionPresModel.targetWorksheets)) {
                continue;
            }
            var $enum3 = ss.IEnumerator.getEnumerator(actionPresModel.targetWorksheets);
            while ($enum3.moveNext()) {
                var targetWorksheet = $enum3.current;
                var targetVisualModel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), targetWorksheet);
                modelsToProcess[targetWorksheet] = targetVisualModel;
            }
        }
    }
    var $dict4 = modelsToProcess;
    for (var $key5 in $dict4) {
        var targetWorksheet = { key: $key5, value: $dict4[$key5] };
        var targetVisualModel = targetWorksheet.value;
        var targetVizData = targetVisualModel.get_vizDataModel();
        toRet._tupleBrushing[targetWorksheet.key] = tab._brushingDataUtils._findMatchingTuples(legendValues, targetVizData);
        var brushedNodes = [];
        var $dict6 = tab.BrushingComputer._getNodeGroups(targetVisualModel);
        for (var $key7 in $dict6) {
            var partDrawGroups = { key: $key7, value: $dict6[$key7] };
            var nodes = partDrawGroups.value;
            var nodeFields = tab._brushingDataUtils._getFieldsForNodes(targetVisualModel, nodes);
            var commonFieldsForNodes = _.intersection(nodeFields, legendModel.get_fieldCaptions());
            if (commonFieldsForNodes.length > 0) {
                var nodeDvs = tab._brushingDataUtils._buildLegendSelectionDataValues(legendModel, selectedItemsIds, vizData, commonFieldsForNodes);
                brushedNodes.addRange(tab._brushingDataUtils._findMatchingNodes(nodeDvs, targetVisualModel, nodes));
            }
        }
        toRet._nodeBrushing[targetWorksheet.key] = brushedNodes;
        var $enum8 = ss.IEnumerator.getEnumerator(tab.ModelUtils.getVizCategoricalLegends(targetVisualModel));
        while ($enum8.moveNext()) {
            var legend = $enum8.current;
            if (legend.get_isOneWay() || !legend.get_isHighlightEnabled()) {
                continue;
            }
            var legendsToBrush = tab._brushingDataUtils._findMatchingLegendItems(legendValues, targetVizData, legend);
            tab.BrushingComputer.get__log().debug('Brushing legend items: %s, %o', legend.get_id(), legendsToBrush);
            if (!Object.keyExists(toRet._legendBrushing, targetVisualModel.get_worksheetName())) {
                toRet._legendBrushing[targetVisualModel.get_worksheetName()] = {};
            }
            toRet._legendBrushing[targetVisualModel.get_worksheetName()][tab.BrushingComputer._calculateLegendKey(legend.get_legendType(), legend.get_legendNames())] = legendsToBrush;
        }
    }
    return toRet;
}
tab.BrushingComputer.getTuplesAssociatedWithSelectedNodes = function tab_BrushingComputer$getTuplesAssociatedWithSelectedNodes(visualModel, selectedNodes) {
    if (ss.isNullOrUndefined(visualModel.get_vizDataModel()) || ss.isNullOrUndefined(tab.ApplicationModel.get_instance().get_dataDictionary())) {
        return new Array(0);
    }
    var nonQuantitativeNodes = [];
    var $enum1 = ss.IEnumerator.getEnumerator(selectedNodes);
    while ($enum1.moveNext()) {
        var node = $enum1.current;
        if (visualModel.get_vizDataModel().isHeaderFullyNotQuantitative(node.columnIndices)) {
            nonQuantitativeNodes.push(node);
        }
    }
    visualModel.get_selectionsModel().isOnlyQuantitativeNodeSelected = !nonQuantitativeNodes.length && !!selectedNodes.length;
    if (!nonQuantitativeNodes.length) {
        return new Array(0);
    }
    var results = tab._brushingDataUtils._buildNodeSelectionDataValues(visualModel.get_vizDataModel(), nonQuantitativeNodes);
    var tupleIds = tab.BrushingComputer._findTuplesWithValues(results, visualModel);
    return tupleIds;
}
tab.BrushingComputer.computeFromTuples = function tab_BrushingComputer$computeFromTuples(visualModel, tupleIDs, relatedActions) {
    var toRet = new tab.BrushingComputer();
    var $enum1 = ss.IEnumerator.getEnumerator(relatedActions);
    while ($enum1.moveNext()) {
        var actionPresModel = $enum1.current;
        if (ss.isNullOrUndefined(actionPresModel.targetWorksheets)) {
            continue;
        }
        var highlightCmd = tab.CommandSerializer.deserialize(actionPresModel.simpleCommandModel.simpleCommand);
        var $enum2 = ss.IEnumerator.getEnumerator(actionPresModel.targetWorksheets);
        while ($enum2.moveNext()) {
            var targetWorksheet = $enum2.current;
            var targetVisualModel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), targetWorksheet);
            if (ss.isNullOrUndefined(targetVisualModel)) {
                tab.BrushingComputer.get__log().debug('Target worksheet not present: %s', targetWorksheet);
                continue;
            }
            var targetVizData = targetVisualModel.get_vizDataModel();
            if (ss.isNullOrUndefined(targetVizData)) {
                tab.BrushingComputer.get__log().error('Target viz data not found: %s.', targetWorksheet);
                continue;
            }
            if (tab.BrushingComputer.isSpecialDateTimeHighlighting(highlightCmd)) {
                var dataDict = tab.ApplicationModel.get_instance().get_dataDictionary();
                var dvsOverlapIndicesPair = tab._brushingDataUtils._buildDateTimeTupleDataValues(visualModel.get_vizDataModel(), targetVizData, dataDict, tupleIDs);
                var dvs = dvsOverlapIndicesPair.first;
                var overlapIndexes = dvsOverlapIndicesPair.second;
                toRet._tupleBrushing[targetWorksheet] = tab._brushingDataUtils._findMatchingTuplesDateTimeHighlighting(dvs, overlapIndexes, targetVizData, dataDict);
                toRet._nodeBrushing[targetWorksheet] = tab._brushingDataUtils._findMatchingNodesDateTimeHighlighting(dvs, overlapIndexes, targetVisualModel, dataDict);
                toRet._calculateLegendsForViz(targetVisualModel, visualModel, tupleIDs, highlightCmd);
            }
            else {
                var commonFields = tab.BrushingComputer.getHighlightFieldCaptions(highlightCmd, visualModel.get_vizDataModel().get_highlightCaptions(), visualModel.get_vizDataModel().get_fieldCaptions());
                if (visualModel !== targetVisualModel) {
                    commonFields = _.intersection(commonFields, targetVizData.get_fieldCaptions());
                }
                if (tab.MiscUtil.isNullOrEmpty(commonFields)) {
                    tab.BrushingComputer.get__log().debug('Ignoring a highlight action on a field that is not in play.');
                    continue;
                }
                var $enum3 = ss.IEnumerator.getEnumerator(commonFields);
                while ($enum3.moveNext()) {
                    var caption = $enum3.current;
                    if (visualModel.vizDataContainsDuplicateCaption(caption)) {
                        tab.BrushingComputer.get__log().debug('Duplicate caption, not going to calculate brushing: %s', caption);
                        toRet._isBrushingComputed = false;
                        return toRet;
                    }
                }
                var tupleDvs = tab._brushingDataUtils._buildTupleSelectionDataValues(visualModel.get_vizDataModel(), tupleIDs, commonFields);
                toRet._tupleBrushing[targetWorksheet] = tab._brushingDataUtils._findMatchingTuples(tupleDvs, targetVizData);
                var brushedNodes = [];
                var $dict4 = tab.BrushingComputer._getNodeGroups(targetVisualModel);
                for (var $key5 in $dict4) {
                    var partDrawGroups = { key: $key5, value: $dict4[$key5] };
                    var nodes = partDrawGroups.value;
                    var nodeFields = tab._brushingDataUtils._getFieldsForNodes(targetVisualModel, nodes);
                    var commonFieldsForNodes = _.intersection(nodeFields, commonFields);
                    if (commonFieldsForNodes.length > 0) {
                        var nodeDvs = tab._brushingDataUtils._buildTupleSelectionDataValues(visualModel.get_vizDataModel(), tupleIDs, commonFieldsForNodes);
                        brushedNodes.addRange(tab._brushingDataUtils._findMatchingNodes(nodeDvs, targetVisualModel, nodes));
                    }
                }
                toRet._nodeBrushing[targetWorksheet] = brushedNodes;
                toRet._calculateLegendsForViz(targetVisualModel, visualModel, tupleIDs, highlightCmd);
            }
        }
    }
    return toRet;
}
tab.BrushingComputer._getNodeGroups = function tab_BrushingComputer$_getNodeGroups(targetVisualModel) {
    var toRet = {};
    var visualListModels = targetVisualModel.get_sceneModel().get_visualListModels();
    var $dict1 = visualListModels;
    for (var $key2 in $dict1) {
        var pair = { key: $key2, value: $dict1[$key2] };
        toRet[pair.key] = pair.value.get_groupItemNodes();
    }
    var xlabels = (toRet['x-labels'] || []);
    xlabels.addRange((toRet['bottom-axis'] || new Array(0)));
    toRet['x-labels'] = xlabels;
    delete toRet['bottom-axis'];
    return toRet;
}
tab.BrushingComputer.isSpecialDateTimeHighlighting = function tab_BrushingComputer$isSpecialDateTimeHighlighting(highlightCmd) {
    var commandSpecialFieldsValue = highlightCmd.commandParams['specialFields'];
    return ss.isValue(commandSpecialFieldsValue) && commandSpecialFieldsValue === 'date-time';
}
tab.BrushingComputer.getHighlightFieldCaptions = function tab_BrushingComputer$getHighlightFieldCaptions(highlightCmd, vizHighlightCaptions, commonFieldCaptions) {
    var commandFields;
    var commandFieldCaptions = highlightCmd.commandParams['fieldCaptions'];
    if (!ss.isNullOrUndefined(commandFieldCaptions)) {
        commandFields = tab.JsonUtil.parseJson(commandFieldCaptions);
    }
    else {
        var commandSpecialFieldsValue = highlightCmd.commandParams['specialFields'];
        if (ss.isNullOrUndefined(commandSpecialFieldsValue) || commandSpecialFieldsValue !== 'all') {
            tab.BrushingComputer.get__log().debug('Warning: Processing a highlight action with no information on what field it is highlighting on. Taking the highlight captions of the source sheet as default.');
        }
        commandFields = vizHighlightCaptions;
    }
    if (ss.isValue(commonFieldCaptions)) {
        commandFields = _.intersection(commonFieldCaptions, commandFields);
    }
    return commandFields;
}
tab.BrushingComputer._calculateLegendKey = function tab_BrushingComputer$_calculateLegendKey(legendType, legendNames) {
    return ('LegendType:' + legendType + ' LegendNames:' + legendNames.join(';'));
}
tab.BrushingComputer._findTuplesWithValues = function tab_BrushingComputer$_findTuplesWithValues(values, visualModel) {
    var tuples = [];
    if (ss.isNullOrUndefined(visualModel.get_vizDataModel())) {
        return tuples;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(values);
    while ($enum1.moveNext()) {
        var result = $enum1.current;
        tuples = _.union(tuples, tab._brushingDataUtils._findMatchingTuples(result, visualModel.get_vizDataModel()));
    }
    return tuples;
}
tab.BrushingComputer.prototype = {
    _isBrushingComputed: true,
    
    get_isBrushingComputed: function tab_BrushingComputer$get_isBrushingComputed() {
        return this._isBrushingComputed;
    },
    
    hasBrushingForSheet: function tab_BrushingComputer$hasBrushingForSheet(worksheet) {
        return ss.isValue(this._tupleBrushing[worksheet]) || ss.isValue(this._nodeBrushing[worksheet]) || ss.isValue(this._legendBrushing[worksheet]);
    },
    
    getTupleBrushing: function tab_BrushingComputer$getTupleBrushing(worksheet) {
        return (this._tupleBrushing[worksheet] || []);
    },
    
    getNodeBrushing: function tab_BrushingComputer$getNodeBrushing(worksheet) {
        return (this._nodeBrushing[worksheet] || []);
    },
    
    getLegendBrushing: function tab_BrushingComputer$getLegendBrushing(worksheet) {
        return this._legendBrushing[worksheet] || {};
    },
    
    _calculateLegendsForViz: function tab_BrushingComputer$_calculateLegendsForViz(legendViz, tupleViz, tupleIds, highlightCmd) {
        var targetVizData = legendViz.get_vizDataModel();
        var $enum1 = ss.IEnumerator.getEnumerator(tab.ModelUtils.getVizCategoricalLegends(legendViz));
        while ($enum1.moveNext()) {
            var legend = $enum1.current;
            if (ss.isNullOrUndefined(targetVizData)) {
                tab.BrushingComputer.get__log().error('Target viz data not found: %s.', legend.get_worksheetName());
                continue;
            }
            if (legend.get_isOneWay() || !legend.get_isHighlightEnabled()) {
                continue;
            }
            var commonFields = _.intersection(tupleViz.get_vizDataModel().get_fieldCaptions(), legend.get_fieldCaptions());
            commonFields = tab.BrushingComputer.getHighlightFieldCaptions(highlightCmd, tupleViz.get_vizDataModel().get_highlightCaptions(), commonFields);
            var dvs = tab._brushingDataUtils._buildTupleSelectionDataValues(tupleViz.get_vizDataModel(), tupleIds, commonFields);
            var legendsToBrush = tab._brushingDataUtils._findMatchingLegendItems(dvs, targetVizData, legend);
            tab.BrushingComputer.get__log().debug('Brushing legend items: %s, %o', legend.get_id(), legendsToBrush);
            if (!Object.keyExists(this._legendBrushing, legendViz.get_worksheetName())) {
                this._legendBrushing[legendViz.get_worksheetName()] = {};
            }
            this._legendBrushing[legendViz.get_worksheetName()][tab.BrushingComputer._calculateLegendKey(legend.get_legendType(), legend.get_legendNames())] = legendsToBrush;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalFilterData

tab.CategoricalFilterData = function tab_CategoricalFilterData(sheets, filterField, exclude, filterValues) {
    this._targetSheets = sheets;
    this._fieldName = filterField;
    this._isExclude = exclude;
    if (ss.isValue(filterValues)) {
        this._values = filterValues;
    }
    else {
        this._values = [];
    }
}
tab.CategoricalFilterData.prototype = {
    _targetSheets: null,
    _fieldName: null,
    _values: null,
    _includeAll: false,
    _isExclude: false,
    
    get_filterField: function tab_CategoricalFilterData$get_filterField() {
        return this._fieldName;
    },
    
    get_targetSheets: function tab_CategoricalFilterData$get_targetSheets() {
        return this._targetSheets;
    },
    set_targetSheets: function tab_CategoricalFilterData$set_targetSheets(value) {
        this._targetSheets = value;
        return value;
    },
    
    get_includeAll: function tab_CategoricalFilterData$get_includeAll() {
        return this._includeAll;
    },
    set_includeAll: function tab_CategoricalFilterData$set_includeAll(value) {
        this._includeAll = value;
        this.clearValues();
        return value;
    },
    
    get_isExclude: function tab_CategoricalFilterData$get_isExclude() {
        return this._isExclude;
    },
    
    addValue: function tab_CategoricalFilterData$addValue(value) {
        if (this._values.contains(value)) {
            return false;
        }
        this._values.add(value);
        return true;
    },
    
    clearValues: function tab_CategoricalFilterData$clearValues() {
        this._values.clear();
    },
    
    getFilterValues: function tab_CategoricalFilterData$getFilterValues() {
        return this._values;
    },
    
    includesValue: function tab_CategoricalFilterData$includesValue(value) {
        if (this.get_includeAll()) {
            return true;
        }
        return (this._isExclude !== this._values.contains(value));
    },
    
    removeValue: function tab_CategoricalFilterData$removeValue(value) {
        if (this._values.contains(value)) {
            return false;
        }
        this._values.remove(value);
        return true;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.Changelist

tab.Changelist = function tab_Changelist() {
    this._changes = [];
}
tab.Changelist.prototype = {
    _changes: null,
    
    addChange: function tab_Changelist$addChange(change) {
        this._changes.add(change);
    },
    
    compileForChecklist: function tab_Changelist$compileForChecklist(domain) {
        var nonDuplicates = {};
        for (var i = 0; i < this._changes.length; ++i) {
            var rc = this._changes[i];
            switch (rc.type) {
                case 0:
                    nonDuplicates[rc.index] = rc.checkState;
                    break;
                case 1:
                    var range = rc.range;
                    var newCheckState = rc.checkState;
                    var from = Math.min(range.get_from(), range.get_to());
                    var to = Math.max(range.get_from(), range.get_to());
                    for (var j = from; j <= to; ++j) {
                        nonDuplicates[j] = newCheckState;
                    }
                    break;
            }
        }
        var selectList = [];
        var deselectList = [];
        var $dict1 = nonDuplicates;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            var index = parseInt(pair.key, 10);
            var state = pair.value;
            if (state) {
                selectList.add(index);
            }
            else {
                deselectList.add(index);
            }
        }
        var output = new tab.CompiledChecklistChangelist();
        output.select = selectList;
        output.deselect = deselectList;
        output.domain = domain;
        return output;
    },
    
    compileForRadiolist: function tab_Changelist$compileForRadiolist(domain) {
        var lastChangeIndex = this._changes.length - 1;
        var lastChange = this._changes[lastChangeIndex];
        var output = new tab.CompiledRadiolistChangelist();
        output.index = lastChange.index;
        output.domain = domain;
        return output;
    },
    
    reset: function tab_Changelist$reset() {
        this._changes.clear();
    },
    
    appendChangelist: function tab_Changelist$appendChangelist(other) {
        for (var i = 0; i < other._changes.length; i++) {
            this._changes.add(other._changes[i]);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RawChange

tab.RawChange = function tab_RawChange() {
}
tab.RawChange.prototype = {
    range: null,
    index: 0,
    type: 0,
    checkState: false,
    
    setRange: function tab_RawChange$setRange(range, checkState) {
        this.type = 1;
        this.range = range;
        this.checkState = checkState;
    },
    
    setSingle: function tab_RawChange$setSingle(index, checkState) {
        this.type = 0;
        this.index = index;
        this.checkState = checkState;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CompiledChecklistChangelist

tab.CompiledChecklistChangelist = function tab_CompiledChecklistChangelist() {
    this.select = new Array(0);
    this.deselect = new Array(0);
}
tab.CompiledChecklistChangelist.prototype = {
    select: null,
    deselect: null,
    domain: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.CompiledRadiolistChangelist

tab.CompiledRadiolistChangelist = function tab_CompiledRadiolistChangelist() {
}
tab.CompiledRadiolistChangelist.prototype = {
    index: 0,
    domain: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandUtils

tab.CommandUtils = function tab_CommandUtils() {
}
tab.CommandUtils.newDocCommand = function tab_CommandUtils$newDocCommand(commandName, cmdParams) {
    var c = {};
    c.commandName = commandName;
    c.commandNamespace = 'tabdoc';
    if (ss.isValue(cmdParams)) {
        c.commandParams = cmdParams;
    }
    return c;
}
tab.CommandUtils.newSrvCommand = function tab_CommandUtils$newSrvCommand(commandName) {
    var c = {};
    c.commandName = commandName;
    c.commandNamespace = 'tabsrv';
    return c;
}
tab.CommandUtils.addVisualIdToCommand = function tab_CommandUtils$addVisualIdToCommand(cmdParams, visualId) {
    if (tab.MiscUtil.isNullOrEmpty(visualId.storyboard)) {
        cmdParams['worksheet'] = visualId.worksheet;
        if (ss.isValue(visualId.dashboard) && visualId.dashboard.toString().length > 0) {
            cmdParams['dashboard'] = visualId.dashboard;
        }
    }
    else {
        cmdParams['visualIdPresModel'] = tab.JsonUtil.toJson(visualId);
    }
}
tab.CommandUtils.addStoryPointToCommand = function tab_CommandUtils$addStoryPointToCommand(cmdParams, sheetPath) {
    if (ss.isValue(sheetPath.storyboard)) {
        cmdParams['storyboard'] = sheetPath.storyboard;
        cmdParams['flipboardZoneId'] = sheetPath.flipboardZoneId.toString();
        cmdParams['storyPointId'] = sheetPath.storyPointId.toString();
    }
}
tab.CommandUtils.duplicateCommand = function tab_CommandUtils$duplicateCommand(command) {
    var copy = {};
    $.extend(true, copy, command);
    return copy;
}
tab.CommandUtils.createCommandRedirectSuccessHandler = function tab_CommandUtils$createCommandRedirectSuccessHandler(deferred) {
    deferred = deferred || $.Deferred();
    var commandDeferred = $.DeferredData();
    commandDeferred.promise().pipe(function(pm) {
        if (_.isObject(pm) && ('commandRedirectType' in pm)) {
            var action = pm.commandRedirectType;
            var redirectDeferred = tab.CommandRedirectRegistry.handleRedirect(action, pm);
            redirectDeferred.pipe(function() {
                deferred.resolve(pm);
                return pm;
            }, function() {
                deferred.reject();
                return pm;
            });
        }
        else {
            deferred.resolve(pm);
        }
        return pm;
    }, function() {
        deferred.reject();
        return null;
    });
    return tab.CommandController._deferredSuccessHandler(commandDeferred);
}


////////////////////////////////////////////////////////////////////////////////
// tab.ActionUtils

tab.ActionUtils = function tab_ActionUtils() {
}
tab.ActionUtils.get__log = function tab_ActionUtils$get__log() {
    return tab.Logger.lazyGetLogger(tab.ActionUtils);
}
tab.ActionUtils.isVizSourceOfAction = function tab_ActionUtils$isVizSourceOfAction(action, sheet) {
    return _.any(action.sourceWorksheets, function(worksheet) {
        return worksheet === sheet;
    });
}
tab.ActionUtils.isTargetOfActionLocal = function tab_ActionUtils$isTargetOfActionLocal(action) {
    var vizPair = tab.ModelUtils.getVisualModels(tab.ApplicationModel.get_instance());
    var $enum1 = ss.IEnumerator.getEnumerator(action.targetWorksheets);
    while ($enum1.moveNext()) {
        var targetName = $enum1.current;
        if (Object.keyExists(vizPair, targetName)) {
            return true;
        }
    }
    return false;
}
tab.ActionUtils.isFilterAction = function tab_ActionUtils$isFilterAction(action) {
    return (ss.isValue(action.simpleCommandModel) && (action.simpleCommandModel.simpleCommand).startsWith('tabdoc:filter-targets'));
}
tab.ActionUtils.isHighlightAction = function tab_ActionUtils$isHighlightAction(action) {
    return (ss.isValue(action.simpleCommandModel) && (action.simpleCommandModel.simpleCommand).startsWith('tabdoc:highlight'));
}
tab.ActionUtils.isFilterSource = function tab_ActionUtils$isFilterSource(dashboardModel, sheet) {
    var dashboardPM = dashboardModel.get_dashboardPresModel();
    var actions = dashboardPM.userActions;
    var $enum1 = ss.IEnumerator.getEnumerator(actions);
    while ($enum1.moveNext()) {
        var action = $enum1.current;
        if (!tab.ActionUtils.isVizSourceOfAction(action, sheet)) {
            continue;
        }
        if (action.activation !== 'on-select') {
            continue;
        }
        if (ss.isNullOrUndefined(action.simpleCommandModel)) {
            continue;
        }
        var serializedCommand = (action.simpleCommandModel.simpleCommand).replaceAll('simpleCommand=', '');
        var cmd = tab.CommandSerializer.deserialize(serializedCommand);
        if (cmd.commandName !== 'filter-targets') {
            continue;
        }
        var targets = action.targetWorksheets;
        if (!targets.length) {
            continue;
        }
        return true;
    }
    return false;
}
tab.ActionUtils.getApplicableActions = function tab_ActionUtils$getApplicableActions(sourceWorksheet, activationMethod, type, vizRegion) {
    var actions = tab.ApplicationModel.get_instance().get_workbook().findContentDashboard().get_actionPresModels();
    var relatedActions = tab.ActionUtils._getRelatedActions(actions, sourceWorksheet, activationMethod);
    if (ss.isValue(type)) {
        var isLegendRegion = tab.ActionUtils._isVizRegionALegend(vizRegion);
        relatedActions = _.filter(relatedActions, function(model) {
            return tab.ActionUtils.getActionType(model) === type && !isLegendRegion;
        });
    }
    relatedActions = _.filter(relatedActions, function(model) {
        return tab.ActionUtils.getActionType(model) === 'url' || ss.isValue(model.targetUrl) || model.targetWorksheets.length > 0;
    });
    return relatedActions;
}
tab.ActionUtils.executeActions = function tab_ActionUtils$executeActions(sheetID, activationMethod, tupleIds, t, forceHighlight, vizRegion) {
    var filterActions = tab.ActionUtils.getApplicableActions(sheetID, activationMethod, 'filter', vizRegion);
    var highlightActions = tab.ActionUtils.getApplicableActions(sheetID, activationMethod, 'highlight', vizRegion);
    var urlActions = tab.ActionUtils.getApplicableActions(sheetID, activationMethod, 'url', vizRegion);
    var visualModel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheetID);
    if (ss.isValue(tupleIds)) {
        if (urlActions.length > 0 && tupleIds.length > 0) {
            tab.ActionUtils._executeUrlActions(urlActions, tupleIds, visualModel);
        }
        if (highlightActions.length > 0) {
            if (tupleIds.length > 0) {
                tab.ActionUtils._executeHighlightActions(highlightActions, tupleIds, visualModel, t);
            }
            else {
                tab.ActionUtils._resetAllHighlightingActions(t);
            }
        }
        else if (ss.isValue(forceHighlight) && forceHighlight) {
            tab.ActionUtils._executeHighlightActions(highlightActions, tupleIds, visualModel, t);
        }
    }
    if (filterActions.length > 0) {
        tab.ActionUtils._executeFilterActions(sheetID, filterActions, tupleIds, t, visualModel);
    }
}
tab.ActionUtils.executeAction = function tab_ActionUtils$executeAction(actionPresModel, tupleIds, visualModel, t) {
    if (!ss.isValue(actionPresModel)) {
        return;
    }
    var relevantActions = [actionPresModel];
    if (!ss.isNullOrUndefined(actionPresModel.linkSpec)) {
        tab.ActionUtils._executeUrlActions(relevantActions, tupleIds, visualModel);
    }
    else if (true) {
        tab.ActionUtils._executeHighlightActions(relevantActions, tupleIds, visualModel, t);
    }
    else {
    }
}
tab.ActionUtils.getActionType = function tab_ActionUtils$getActionType(model) {
    if (ss.isValue(model.simpleCommandModel)) {
        var c = tab.CommandSerializer.deserialize(model.simpleCommandModel.simpleCommand);
        if (c.commandName === 'highlight') {
            return 'highlight';
        }
        if (c.commandName === 'filter-targets') {
            return 'filter';
        }
        return null;
    }
    if (ss.isValue(model.linkSpec)) {
        return 'url';
    }
    return null;
}
tab.ActionUtils.willActionCauseTabChange = function tab_ActionUtils$willActionCauseTabChange(sheetID, activationMethod) {
    var filterActions = tab.ActionUtils.getApplicableActions(sheetID, activationMethod, 'filter');
    var $enum1 = ss.IEnumerator.getEnumerator(filterActions);
    while ($enum1.moveNext()) {
        var apm = $enum1.current;
        if (ss.isValue(apm.simpleCommandModel)) {
            var cmd = tab.CommandSerializer.deserialize(apm.simpleCommandModel.simpleCommand);
            var targetSheetName = cmd.commandParams['targetSheet'];
            if (ss.isValue(targetSheetName) && !_.isEqual(targetSheetName, tsConfig.current_sheet_name)) {
                return true;
            }
        }
    }
    return false;
}
tab.ActionUtils.getUrlActionPm = function tab_ActionUtils$getUrlActionPm(actionPresModel, vizModel, tupleIds) {
    if (ss.isValue(tupleIds)) {
        if (!ss.isNullOrUndefined(actionPresModel.linkSpec)) {
            var vizData = vizModel.get_vizDataModel();
            var dataDictionary = tab.ApplicationModel.get_instance().get_dataDictionary();
            var url = tab.VizDataUtils.constructUrl(dataDictionary, actionPresModel.linkSpec, vizData, tupleIds, vizModel.get_worksheetName());
            if (ss.isNullOrUndefined(url)) {
                return null;
            }
            var urlActionPm = {};
            urlActionPm.url = url;
            var target = tab.ModelUtils.getFirstAvailableWebZoneName(tab.ApplicationModel.get_instance());
            if (target != null) {
                urlActionPm.target = target;
            }
            return urlActionPm;
        }
    }
    return null;
}
tab.ActionUtils._isVizRegionALegend = function tab_ActionUtils$_isVizRegionALegend(vizRegion) {
    return ss.isValue(vizRegion) && (vizRegion === 'color' || vizRegion === 'size' || vizRegion === 'shape');
}
tab.ActionUtils._executeHighlightActions = function tab_ActionUtils$_executeHighlightActions(relevantActions, tupleIds, visualModel, t) {
    var brushingComputer = tab.BrushingComputer.computeFromTuples(visualModel, tupleIds, relevantActions);
    tab.SelectionClientCommands._updateBrushingFromComputedResults(brushingComputer, t);
}
tab.ActionUtils._resetAllHighlightingActions = function tab_ActionUtils$_resetAllHighlightingActions(t) {
    tab.SelectionClientCommands._clearAllBrushing(t);
}
tab.ActionUtils._executeUrlActions = function tab_ActionUtils$_executeUrlActions(relevantActions, tupleIds, visualModel) {
    if ((ss.isValue(tupleIds) && tupleIds.length > 0)) {
        var urlActions = [];
        var $enum1 = ss.IEnumerator.getEnumerator(relevantActions);
        while ($enum1.moveNext()) {
            var actionPresModel = $enum1.current;
            var urlActionPm = tab.ActionUtils.getUrlActionPm(actionPresModel, visualModel, tupleIds);
            if (ss.isValue(urlActionPm)) {
                urlActions.add(urlActionPm);
            }
            else {
                tab.CommandController.set_fireDeferredUrlActions(true);
                return;
            }
        }
        if (urlActions.length > 0) {
            tab.CommandController.get().executeUrlActions(urlActions);
        }
    }
}
tab.ActionUtils._executeFilterActions = function tab_ActionUtils$_executeFilterActions(sourceSheetId, relevantActions, tupleIds, transaction, visualModel) {
    tab.ActionUtils.get__log().debug('Processing %s filter actions %o', relevantActions.length, relevantActions);
    if (ss.isValue(relevantActions)) {
        var relevantVisualModels = tab.ActionUtils._getRelevantVisualModels(relevantActions);
        if (relevantVisualModels.length > 0) {
            var sourceSheetInfo = tab.ModelUtils.getSheetInfoPresModel(tab.ApplicationModel.get_instance(), tsConfig.current_sheet_name);
            if (ss.isValue(sourceSheetInfo) && !(sourceSheetInfo.isDashboard && ss.isNullOrUndefined(sourceSheetInfo.namesOfSubsheets))) {
                var includeSourceSheet = !sourceSheetInfo.isDashboard || sourceSheetInfo.namesOfSubsheets.length === 1;
                var $enum1 = ss.IEnumerator.getEnumerator(relevantVisualModels);
                while ($enum1.moveNext()) {
                    var relevantVisualModel = $enum1.current;
                    if (includeSourceSheet || relevantVisualModel.get_worksheetName() !== sourceSheetId) {
                        tab.ModelUtils.setVisualValidStateOnPresModel(transaction, relevantVisualModel);
                    }
                }
            }
        }
        if (tupleIds.length > 0) {
            var urlActions = [];
            var $enum2 = ss.IEnumerator.getEnumerator(relevantActions);
            while ($enum2.moveNext()) {
                var action = $enum2.current;
                if ((tupleIds.length === 1 || !action.singleSelectOnly) && ss.isValue(action.targetUrl)) {
                    var urlAction = {};
                    var targetURL = action.targetUrl + '&:exclude=' + tab.CommandController.get().get_legacySession().railsEncode(sourceSheetId);
                    var vizData = visualModel.get_vizDataModel();
                    var dataDictionary = tab.ApplicationModel.get_instance().get_dataDictionary();
                    urlAction.url = tab.VizDataUtils.constructUrlForFilterActionFromTargetURL(dataDictionary, targetURL, vizData, tupleIds);
                    urlActions.add(urlAction);
                }
            }
            if (urlActions.length > 0) {
                tab.CommandController.get().executeUrlActions(urlActions);
            }
        }
    }
}
tab.ActionUtils._getRelevantVisualModels = function tab_ActionUtils$_getRelevantVisualModels(actionPresModels) {
    var relevantVisualModels = {};
    if (ss.isValue(actionPresModels)) {
        var $enum1 = ss.IEnumerator.getEnumerator(actionPresModels);
        while ($enum1.moveNext()) {
            var actionPresModel = $enum1.current;
            var $enum2 = ss.IEnumerator.getEnumerator(actionPresModel.targetWorksheets);
            while ($enum2.moveNext()) {
                var worksheet = $enum2.current;
                var vm = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), worksheet);
                if (ss.isValue(vm)) {
                    relevantVisualModels[worksheet] = vm;
                }
            }
        }
    }
    var visualModelList = [];
    var $dict3 = relevantVisualModels;
    for (var $key4 in $dict3) {
        var relevantVisualModel = { key: $key4, value: $dict3[$key4] };
        visualModelList.add(relevantVisualModel.value);
    }
    return visualModelList;
}
tab.ActionUtils._isAcceptableScheme = function tab_ActionUtils$_isAcceptableScheme(urlToValidate) {
    if (!tab.ActionUtils._isCustomWhitelistParsed) {
        tab.ActionUtils._isCustomWhitelistParsed = true;
        var schemes = tsConfig.schemeWhitelist.split(',');
        var $enum1 = ss.IEnumerator.getEnumerator(schemes);
        while ($enum1.moveNext()) {
            var s = $enum1.current;
            var sc = s.toLowerCase().trim();
            if (!sc.endsWith(':')) {
                sc += ':';
            }
            if (sc.length > 1) {
                tab.ActionUtils._schemeWhitelist.add(sc);
            }
        }
    }
    var schemeExtract = new RegExp('(^[A-Za-z][A-Za-z0-9+\\-.]*:)');
    var results = schemeExtract.exec(urlToValidate);
    if (!ss.isValue(results)) {
        return true;
    }
    var scheme = results[0].toLowerCase();
    return tab.ActionUtils._schemeWhitelist.contains(scheme);
}
tab.ActionUtils._getRelatedActions = function tab_ActionUtils$_getRelatedActions(actions, sourceWorksheet, activationMethod) {
    var relatedActions = _.filter(actions, function(action) {
        var sourceWorksheetMatch = action.sourceWorksheets.contains(sourceWorksheet);
        var activationMethodMatch = (activationMethod === action.activation);
        return (sourceWorksheetMatch && activationMethodMatch);
    });
    return relatedActions;
}
tab.ActionUtils.launchActionUrls = function tab_ActionUtils$launchActionUrls(launch) {
    var targetList = [];
    var targetUrls = {};
    if (ss.isNullOrUndefined(launch) || !launch.length) {
        return;
    }
    if (ss.isValue(tab.BaseSession.linkTarget) && tab.BaseSession.linkTarget.length > 0) {
        var target = tab.BaseSession.linkTarget;
        targetList.add(new ss.Tuple(target, false));
        targetUrls[target] = launch[launch.length - 1].url;
    }
    else {
        var i = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(launch);
        while ($enum1.moveNext()) {
            var url = $enum1.current;
            if (!tab.ActionUtils._isAcceptableScheme(url.url)) {
                if (!tab.ActionUtils._hasShownBlockedAction) {
                    tab.ActionUtils._hasShownBlockedAction = true;
                    tab.BaseSession.showAlertDialog(tab.Strings.SecurityBlockedURLActionMessage, tab.Strings.SecurityBlockedURLActionHeader, true);
                }
                continue;
            }
            if (ss.isNullOrUndefined(url.target) || ('t' in url)) {
                url.target = url.t;
            }
            var targetFrame;
            if (ss.isValue(url.target)) {
                targetFrame = new ss.Tuple(url.target, true);
            }
            else {
                var target = '_' + tsConfig.layoutid.toString().replace(new RegExp('[^\\w]', 'g'), '');
                if (i > 0) {
                    target += '_' + i.toString();
                }
                targetFrame = new ss.Tuple(target, false);
            }
            if (!Object.keyExists(targetUrls, targetFrame.first)) {
                targetList.add(targetFrame);
            }
            targetUrls[targetFrame.first] = url.url;
            i++;
        }
    }
    var $enum2 = ss.IEnumerator.getEnumerator(targetList);
    while ($enum2.moveNext()) {
        var tuple = $enum2.current;
        var target = tuple.first;
        if (tuple.second) {
            $('[name=' + target + ']').prop('src', targetUrls[target]);
        }
        else {
            window.open(targetUrls[target], target);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.InvalidationInfo

tab.InvalidationInfo = function tab_InvalidationInfo() {
}
tab.InvalidationInfo.prototype = {
    primarySheet: null,
    suppressActivation: null,
    layoutStatus: null,
    cmdResult: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.LocalUbertipInfo

tab.LocalUbertipInfo = function tab_LocalUbertipInfo(interactedTupleIds, affectedTupleIds, paneDescriptorKey, needRemoteUbertip) {
    this._interactedTupleIds = interactedTupleIds;
    this._affectedTupleIds = affectedTupleIds;
    this._paneDescriptorKey = paneDescriptorKey;
    this._needRemoteUbertip = needRemoteUbertip;
}
tab.LocalUbertipInfo.prototype = {
    _interactedTupleIds: null,
    _affectedTupleIds: null,
    _paneDescriptorKey: null,
    _needRemoteUbertip: false,
    
    get_interactedTupleIds: function tab_LocalUbertipInfo$get_interactedTupleIds() {
        return this._interactedTupleIds;
    },
    
    get_affectedTupleIds: function tab_LocalUbertipInfo$get_affectedTupleIds() {
        return this._affectedTupleIds;
    },
    
    get_paneDescriptorKey: function tab_LocalUbertipInfo$get_paneDescriptorKey() {
        return this._paneDescriptorKey;
    },
    
    get_needRemoteUbertip: function tab_LocalUbertipInfo$get_needRemoteUbertip() {
        return this._needRemoteUbertip;
    },
    
    shouldDoLocalUbertip: function tab_LocalUbertipInfo$shouldDoLocalUbertip() {
        return ss.isValue(this._interactedTupleIds) && ss.isValue(this._paneDescriptorKey) && this._interactedTupleIds.length > 0;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ModelUtils

tab.ModelUtils = function tab_ModelUtils() {
}
tab.ModelUtils.getViewSession = function tab_ModelUtils$getViewSession(sheetName) {
    return tab.ModelUtils.findContentDashboard().getViewSession(sheetName);
}
tab.ModelUtils.getVizCategoricalLegends = function tab_ModelUtils$getVizCategoricalLegends(viz) {
    var models = [];
    var dashboardModel = tab.ModelUtils.findContentDashboard();
    if (ss.isValue(dashboardModel)) {
        var $enum1 = ss.IEnumerator.getEnumerator(dashboardModel.get_zoneModels());
        while ($enum1.moveNext()) {
            var zone = $enum1.current;
            if (Type.canCast(zone.get_model(), tab.CategoricalLegendModel) && zone.get_worksheetName() === viz.get_worksheetName()) {
                models.add(zone.get_model());
            }
        }
    }
    return models;
}
tab.ModelUtils.withVisualModel = function tab_ModelUtils$withVisualModel(sheetName, callback) {
    var vm = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheetName);
    if (ss.isValue(vm)) {
        callback(vm);
        return;
    }
    if (ss.isNullOrUndefined(tab.ModelUtils._vizLoadedCallbacks)) {
        tab.ModelUtils._vizLoadedCallbacks = {};
        tab.ModelUtils.findContentDashboard().get_zonesModel().add_newZone(tab.ModelUtils._handleZoneCreatedVizCallbacks);
    }
    var callbacks = tab.ModelUtils._vizLoadedCallbacks[sheetName] || [];
    callbacks.add(callback);
    tab.ModelUtils._vizLoadedCallbacks[sheetName] = callbacks;
}
tab.ModelUtils.getVisualModels = function tab_ModelUtils$getVisualModels(appModel) {
    var dashboardModel = tab.ModelUtils.findContentDashboard(appModel);
    return tab.ModelUtils.getVisualModelsFromDashboard(dashboardModel);
}
tab.ModelUtils.getVisualModelsFromDashboard = function tab_ModelUtils$getVisualModelsFromDashboard(dashboardModel) {
    var result = {};
    var $enum1 = ss.IEnumerator.getEnumerator(dashboardModel.get_zoneModels());
    while ($enum1.moveNext()) {
        var zone = $enum1.current;
        var visualModel = zone.get_visualModel();
        if (ss.isValue(visualModel)) {
            result[zone.get_worksheetName()] = visualModel;
        }
    }
    return result;
}
tab.ModelUtils.getSheetInfoPresModel = function tab_ModelUtils$getSheetInfoPresModel(appModel, sheetName) {
    var workbookModel = appModel.get_workbook();
    if (ss.isNullOrUndefined(workbookModel) || ss.isNullOrUndefined(workbookModel.get_sheetsInfo())) {
        return null;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(workbookModel.get_sheetsInfo());
    while ($enum1.moveNext()) {
        var sheetInfo = $enum1.current;
        if (sheetInfo.sheet === sheetName) {
            return sheetInfo;
        }
    }
    return null;
}
tab.ModelUtils.getVisualModel = function tab_ModelUtils$getVisualModel(appModel, sheetName) {
    var result = null;
    var dashboardModel = tab.ModelUtils.findContentDashboard(appModel);
    if (ss.isNullOrUndefined(dashboardModel)) {
        return result;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(dashboardModel.get_zoneModels());
    while ($enum1.moveNext()) {
        var zone = $enum1.current;
        var visualModel = zone.get_visualModel();
        if (ss.isValue(visualModel)) {
            var worksheetName = zone.get_worksheetName();
            if (worksheetName === sheetName) {
                result = visualModel;
                break;
            }
        }
    }
    return result;
}
tab.ModelUtils.getVisualModelFromVisualId = function tab_ModelUtils$getVisualModelFromVisualId(visualId, appModel) {
    if (ss.isNullOrUndefined(appModel)) {
        appModel = tab.ApplicationModel.get_instance();
    }
    var result = null;
    var dashboardModel = tab.ModelUtils.findContentDashboard(appModel);
    if (ss.isNullOrUndefined(dashboardModel)) {
        return result;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(dashboardModel.get_zoneModels());
    while ($enum1.moveNext()) {
        var zone = $enum1.current;
        var visualModel = zone.get_visualModel();
        if (ss.isValue(visualModel)) {
            if (_.isEqual(visualModel.get_visualId(), visualId)) {
                result = visualModel;
                break;
            }
        }
    }
    return result;
}
tab.ModelUtils.getVisualId = function tab_ModelUtils$getVisualId(sheetName) {
    return tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheetName).get_visualId();
}
tab.ModelUtils.getFirstAvailableWebZoneName = function tab_ModelUtils$getFirstAvailableWebZoneName(appModel) {
    var result = null;
    var dashboardModel = tab.ModelUtils.findContentDashboard(appModel);
    if (ss.isNullOrUndefined(dashboardModel)) {
        return result;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(dashboardModel.get_zoneModels());
    while ($enum1.moveNext()) {
        var zone = $enum1.current;
        if (zone.get_zoneType() === 'web') {
            var id = zone.get_zoneId();
            result = 'frame_' + id.toString();
            break;
        }
    }
    return result;
}
tab.ModelUtils.isActiveZone = function tab_ModelUtils$isActiveZone(zoneId) {
    return zoneId === tab.ModelUtils.findContentDashboard().get_activeZoneID();
}
tab.ModelUtils.getZoneIdForSheetName = function tab_ModelUtils$getZoneIdForSheetName(worksheetName) {
    var dm = tab.ModelUtils.findContentDashboard();
    var $enum1 = ss.IEnumerator.getEnumerator(dm.get_zoneModels());
    while ($enum1.moveNext()) {
        var zone = $enum1.current;
        if (zone.get_zoneType() === 'viz' && zone.get_worksheetName() === worksheetName) {
            return zone.get_zoneId();
        }
    }
    return -1;
}
tab.ModelUtils.hasBorder = function tab_ModelUtils$hasBorder(styledBox) {
    return ss.isValue(styledBox) && styledBox.borderStyle !== 'bs-none' && !!styledBox.uw;
}
tab.ModelUtils.hasUberTipData = function tab_ModelUtils$hasUberTipData(visualId) {
    var vmodel = tab.ModelUtils.getVisualModelFromVisualId(visualId);
    return ss.isValue(vmodel.get_visualPresModel().vizData) && ss.isValue(vmodel.get_visualPresModel().vizData.ubertipData);
}
tab.ModelUtils.visualHasFilterField = function tab_ModelUtils$visualHasFilterField(sheetName, fieldName) {
    var vmodel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheetName);
    return (ss.isValue(vmodel.get_vizDataModel()) && vmodel.get_vizDataModel().get_filterFields().indexOf(fieldName) !== -1);
}
tab.ModelUtils.createFilterModel = function tab_ModelUtils$createFilterModel(parent, presModel) {
    switch (presModel.type) {
        case 'Q':
            return new tab.QuantitativeFilterModel(parent, presModel);
        case 'H':
            return new tab.HierarchicalFilterModel(parent, presModel);
        case 'C':
            return new tab.CategoricalFilterModel(parent, presModel);
        case 'RD':
            return new tab.RelativeDateFilterModel(parent, presModel);
        default:
            return new tab.FilterModel(parent, presModel);
    }
}
tab.ModelUtils.findMatchingFilterModel = function tab_ModelUtils$findMatchingFilterModel(visualModel, quickFilterModel) {
    var field = quickFilterModel.get_frame().param;
    return visualModel.get_filterModels()[field];
}
tab.ModelUtils.setVisualValidStateOnModel = function tab_ModelUtils$setVisualValidStateOnModel(t, model, valid) {
    if (ss.isNullOrUndefined(model)) {
        return;
    }
    model.set_isVisualValid(valid);
}
tab.ModelUtils.invalidateVisuals = function tab_ModelUtils$invalidateVisuals(sheetNames) {
    if (ss.isNullOrUndefined(sheetNames)) {
        return;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(sheetNames);
    while ($enum1.moveNext()) {
        var sheet = $enum1.current;
        var visualModel = tab.ModelUtils.getVisualModel(tab.ApplicationModel.get_instance(), sheet);
        if (ss.isValue(visualModel)) {
            tab.VizClientCommands.invalidateVisualModel(visualModel);
        }
    }
}
tab.ModelUtils.setVisualValidStateOnPresModel = function tab_ModelUtils$setVisualValidStateOnPresModel(t, model) {
    if (ss.isNullOrUndefined(model)) {
        return;
    }
    (t.makeMutablePresModel(model)).valid = false;
}
tab.ModelUtils._handleZoneCreatedVizCallbacks = function tab_ModelUtils$_handleZoneCreatedVizCallbacks(zone) {
    if (zone.get_zoneType() !== 'viz') {
        return;
    }
    var callbacks = tab.ModelUtils._vizLoadedCallbacks[zone.get_worksheetName()] || [];
    delete tab.ModelUtils._vizLoadedCallbacks[zone.get_worksheetName()];
    if (!Object.getKeyCount(tab.ModelUtils._vizLoadedCallbacks)) {
        tab.ModelUtils._vizLoadedCallbacks = null;
        tab.ModelUtils.findContentDashboard().get_zonesModel().remove_newZone(tab.ModelUtils._handleZoneCreatedVizCallbacks);
    }
    var viz = zone.get_visualModel();
    var $enum1 = ss.IEnumerator.getEnumerator(callbacks);
    while ($enum1.moveNext()) {
        var callback = $enum1.current;
        callback(viz);
    }
}
tab.ModelUtils.findContentDashboard = function tab_ModelUtils$findContentDashboard(appModel) {
    if (ss.isNullOrUndefined(appModel)) {
        appModel = tab.ApplicationModel.get_instance();
    }
    return appModel.get_workbook().findContentDashboard();
}
tab.ModelUtils.findActiveOrDefaultVisual = function tab_ModelUtils$findActiveOrDefaultVisual() {
    var dashboard = tab.ModelUtils.findContentDashboard();
    if (ss.isNullOrUndefined(dashboard) || ss.isNullOrUndefined(dashboard.get_zoneModels())) {
        return null;
    }
    var toRet = dashboard.get_activeVisual();
    if (ss.isValue(toRet)) {
        return toRet;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(dashboard.get_zoneModels());
    while ($enum1.moveNext()) {
        var zone = $enum1.current;
        if (ss.isValue(zone.get_visualModel())) {
            return zone.get_visualModel();
        }
    }
    return null;
}
tab.ModelUtils.findActivePaneSpecId = function tab_ModelUtils$findActivePaneSpecId() {
    var activeVisual = tab.ModelUtils.findActiveOrDefaultVisual();
    if (ss.isValue(activeVisual) && ss.isValue(activeVisual.get_marksCardModel())) {
        return activeVisual.get_marksCardModel().get_activePaneSpecId();
    }
    return null;
}
tab.ModelUtils.findShelf = function tab_ModelUtils$findShelf(st) {
    var viz = tab.ModelUtils.findActiveOrDefaultVisual();
    return viz.get_shelves().findShelf(st);
}
tab.ModelUtils.hasAnyImpliedSelection = function tab_ModelUtils$hasAnyImpliedSelection() {
    var visualModels = tab.ModelUtils.getVisualModels(tab.ApplicationModel.get_instance());
    var $dict1 = visualModels;
    for (var $key2 in $dict1) {
        var modelPair = { key: $key2, value: $dict1[$key2] };
        var model = modelPair.value;
        if (!model.get_impliedSelectionModel().get_isEmpty()) {
            return true;
        }
    }
    return false;
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeFilterData

tab.QuantitativeFilterData = function tab_QuantitativeFilterData(sheets, filterField, currentMinVal, currentMaxVal, previousMinVal, previousMaxVal) {
    this._targetSheets = sheets;
    this._fieldName = filterField;
    this._currentMinVal = currentMinVal;
    this._currentMaxVal = currentMaxVal;
    this._previousMinVal = previousMinVal;
    this._previousMaxVal = previousMaxVal;
}
tab.QuantitativeFilterData.prototype = {
    _targetSheets: null,
    _fieldName: null,
    _currentMinVal: null,
    _currentMaxVal: null,
    _previousMinVal: null,
    _previousMaxVal: null,
    
    get_filterField: function tab_QuantitativeFilterData$get_filterField() {
        return this._fieldName;
    },
    
    get_currentMaxVal: function tab_QuantitativeFilterData$get_currentMaxVal() {
        return this._currentMaxVal;
    },
    
    get_currentMinVal: function tab_QuantitativeFilterData$get_currentMinVal() {
        return this._currentMinVal;
    },
    
    get_targetSheets: function tab_QuantitativeFilterData$get_targetSheets() {
        return this._targetSheets;
    },
    set_targetSheets: function tab_QuantitativeFilterData$set_targetSheets(value) {
        this._targetSheets = value;
        return value;
    },
    
    get_previousMaxVal: function tab_QuantitativeFilterData$get_previousMaxVal() {
        return this._previousMaxVal;
    },
    
    get_previousMinVal: function tab_QuantitativeFilterData$get_previousMinVal() {
        return this._previousMinVal;
    },
    
    valueInRange: function tab_QuantitativeFilterData$valueInRange(val) {
        var valInRange = true;
        if (ss.isValue(this._currentMinVal)) {
            valInRange = valInRange && tab.FloatUtil.isGreaterThanOrEqual(val, this._currentMinVal);
        }
        if (ss.isValue(this._currentMaxVal)) {
            valInRange = valInRange && tab.FloatUtil.isLessThanOrEqual(val, this._currentMaxVal);
        }
        return valInRange;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShapeManager

tab.ShapeManager = function tab_ShapeManager() {
    this._idToImageMap = {};
    this._idToCanvasCache = {};
}
tab.ShapeManager._getCacheKey = function tab_ShapeManager$_getCacheKey(shapeId, layer, colorOverrideMode, color, width, height) {
    return shapeId + ';' + layer + ';' + colorOverrideMode + ';' + color + ';' + width + ';' + height;
}
tab.ShapeManager.prototype = {
    
    get_imageKeys: function tab_ShapeManager$get_imageKeys() {
        return Object.keys(this._idToImageMap);
    },
    
    get_allowHighQualityImageScaling: function tab_ShapeManager$get_allowHighQualityImageScaling() {
        return Object.getKeyCount(this._idToImageMap) < 50;
    },
    
    getImageElement: function tab_ShapeManager$getImageElement(shapeId) {
        return this._idToImageMap[shapeId];
    },
    
    getCachedCanvas: function tab_ShapeManager$getCachedCanvas(shapeId, layer, colorOverrideMode, color, width, height, cacheableCanvasGenerator) {
        var canvas = null;
        var key = tab.ShapeManager._getCacheKey(shapeId, layer, colorOverrideMode, color, width, height);
        if (!Object.keyExists(this._idToCanvasCache, key)) {
            if (ss.isValue(cacheableCanvasGenerator)) {
                canvas = cacheableCanvasGenerator();
                if (ss.isValue(canvas)) {
                    this._idToCanvasCache[key] = canvas;
                }
            }
        }
        else {
            canvas = this._idToCanvasCache[key];
        }
        return canvas;
    },
    
    updateCustomImageMap: function tab_ShapeManager$updateCustomImageMap(customShapes, imageLoadedCallback) {
        var $enum1 = ss.IEnumerator.getEnumerator(customShapes);
        while ($enum1.moveNext()) {
            var mark = $enum1.current;
            if (ss.isValue(mark)) {
                var imageKey = mark.shapeId.toString();
                var imagesToLoadCount = 0;
                if (!Object.keyExists(this._idToImageMap, imageKey)) {
                    ++imagesToLoadCount;
                    var imageData = mark.image;
                    var imgElt = document.createElement('img');
                    imgElt.src = 'data:image/png;base64,' + imageData;
                    this._idToImageMap[imageKey] = imgElt;
                    var imageFinishedLoad = null;
                    imageFinishedLoad = function() {
                        --imagesToLoadCount;
                        if (!imagesToLoadCount && ss.isValue(imageLoadedCallback)) {
                            imageLoadedCallback();
                        }
                        imgElt.removeEventListener('load', imageFinishedLoad, false);
                    };
                    imgElt.addEventListener('load', imageFinishedLoad, false);
                }
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.WorkbookViewObjectUtils

tab.WorkbookViewObjectUtils = function tab_WorkbookViewObjectUtils() {
}
tab.WorkbookViewObjectUtils.createVizUriModelForAuthoringSheetInWorkbook = function tab_WorkbookViewObjectUtils$createVizUriModelForAuthoringSheetInWorkbook(sheetName, workbook) {
    var newVizUriModel;
    var sheetId = tab.WorkbookViewObjectUtils.findSheetIdBySheetNameInWorkbook(sheetName, workbook);
    if (sheetId.length > 0) {
        newVizUriModel = tab.VizUriModel.createForAuthoringPublishedSheet(workbook.repositoryUrl + '/' + sheetId);
    }
    else {
        var firstSheetId = tab.WorkbookViewObjectUtils.findFirstSheetInWorkbook(workbook);
        newVizUriModel = tab.VizUriModel.createForAuthoringUnpublishedSheet(workbook.repositoryUrl + '/' + firstSheetId, sheetName);
    }
    if (tab.MiscUtil.isNullOrEmpty(newVizUriModel)) {
        newVizUriModel = tab.VizUriModel.createInvalid();
    }
    return newVizUriModel;
}
tab.WorkbookViewObjectUtils.createVizUriModelForViewingSheetInWorkbook = function tab_WorkbookViewObjectUtils$createVizUriModelForViewingSheetInWorkbook(sheetName, workbook) {
    var newVizUriModel;
    var sheetId = tab.WorkbookViewObjectUtils.findSheetIdBySheetNameInWorkbook(sheetName, workbook);
    if (sheetId.length > 0) {
        newVizUriModel = tab.VizUriModel.createForViewingSheet(workbook.repositoryUrl + '/' + sheetId);
    }
    else {
        newVizUriModel = tab.VizUriModel.createInvalid();
    }
    return newVizUriModel;
}
tab.WorkbookViewObjectUtils.findSheetIdBySheetNameInWorkbook = function tab_WorkbookViewObjectUtils$findSheetIdBySheetNameInWorkbook(sheetName, workbook) {
    var v = _.find(workbook.views, function(o) {
        return o.name === sheetName;
    });
    if (v == null) {
        return '';
    }
    return v.sheetId;
}
tab.WorkbookViewObjectUtils.findFirstSheetInWorkbook = function tab_WorkbookViewObjectUtils$findFirstSheetInWorkbook(workbook) {
    var v = _.first(workbook.views);
    if (v == null) {
        return '';
    }
    return v.sheetId;
}


////////////////////////////////////////////////////////////////////////////////
// tab.XhrUtil

tab.XhrUtil = function tab_XhrUtil() {
}
tab.XhrUtil.get_currentTabName = function tab_XhrUtil$get_currentTabName() {
    return tab.XhrUtil._currentTabName;
}
tab.XhrUtil.set_currentTabName = function tab_XhrUtil$set_currentTabName(value) {
    tab.XhrUtil._currentTabName = value;
    return value;
}
tab.XhrUtil.helper = function tab_XhrUtil$helper(args, handler) {
    var xhr = new tab.XhrUtil();
    if (!ss.isValue(args.success) && ss.isValue(handler)) {
        args.success = handler.get_successDelegate();
    }
    if (!ss.isValue(args.complete) && ss.isValue(handler)) {
        args.complete = handler.get_completedDelegate();
    }
    if (!ss.isValue(args.error) && ss.isValue(handler)) {
        args.error = handler.get_errorDelegate();
    }
    return xhr.request(args);
}
tab.XhrUtil.getMultipartData = function tab_XhrUtil$getMultipartData(file, nameValues) {
    var initBoundary = tab.XhrUtil.randomString();
    var strBoundary = '--' + initBoundary;
    var CRLF = '\r\n';
    var sb = new ss.StringBuilder();
    if (ss.isValue(file)) {
        sb.append(strBoundary);
        sb.append(CRLF);
        sb.append('Content-Disposition: form-data; name="');
        sb.append(file.name);
        sb.append('"');
        if (('filename' in file)) {
            sb.append('; filename="');
            sb.append(file.filename);
            sb.append('"');
        }
        sb.append(CRLF);
        sb.append('Content-Type: ');
        sb.append(file.contentType);
        sb.append(CRLF);
        sb.append(CRLF);
        sb.append(file.content);
        sb.append(CRLF);
    }
    var $dict1 = nameValues;
    for (var $key2 in $dict1) {
        var e = { key: $key2, value: $dict1[$key2] };
        sb.append(strBoundary);
        sb.append(CRLF);
        sb.append('Content-Disposition: form-data; name="');
        sb.append(e.key);
        sb.append('"');
        sb.append(CRLF);
        sb.append(CRLF);
        if (Type.canCast(e.value, String)) {
            sb.append(e.value);
        }
        else {
            sb.append(tab.JsonUtil.toJson(e.value));
        }
        sb.append(CRLF);
    }
    sb.append(strBoundary);
    sb.append('--');
    sb.append(CRLF);
    var result = tab.$create_XhrMultipartData();
    result.header = initBoundary;
    result.body = sb.toString();
    return result;
}
tab.XhrUtil.randomString = function tab_XhrUtil$randomString() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var stringLength = 8;
    var randomString = '';
    for (var i = 0; i < stringLength; i++) {
        var ran = Math.random() * chars.length;
        var rnum = parseInt(ran);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}
tab.XhrUtil.prototype = {
    
    request: function tab_XhrUtil$request(args) {
        args.headers = (args.headers || {});
        if (!args.headers['X-Tsi-Supports-Accepted']) {
            delete args.headers['X-Tsi-Supports-Accepted'];
        }
        else {
            args.headers['X-Tsi-Supports-Accepted'] = true;
        }
        if (ss.isValue(tab.XhrUtil._currentTabName) && tab.XhrUtil._currentTabName.length > 0) {
            args.headers['X-Tsi-Active-Tab'] = encodeURIComponent(tab.XhrUtil._currentTabName);
        }
        if (ss.isValue(args.complete)) {
            var oldCompleted = args.complete;
            args.complete = function(xhr, textStatus) {
                xhr.args = args;
                oldCompleted(xhr, textStatus);
            };
        }
        if (ss.isValue(args.success)) {
            var oldSuccess = args.success;
            args.success = function(data, textStatus, xhr) {
                xhr.args = args;
                oldSuccess(data, textStatus, xhr);
            };
        }
        if (ss.isValue(args.error)) {
            var oldError = args.error;
            args.error = function(xhr, textStatus, error) {
                xhr.args = args;
                oldError(xhr, textStatus, error);
            };
        }
        if (ss.isValue(args.beforeSend)) {
            var oldBeforeSend = args.beforeSend;
            args.beforeSend = function(xhr) {
                xhr.args = args;
                oldBeforeSend(xhr);
            };
        }
        var opt = null;
        opt = args;
        return $.ajax(opt);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.Model

tab.Model = function tab_Model(parent, presModelKey) {
    this._parent = parent;
    this._presModelKey = presModelKey;
}
tab.Model.fireDeferredEvents = function tab_Model$fireDeferredEvents(exceptionHandler) {
    tab.Logger.getLogger(tab.ApplicationModel).debug('FireDeferredEvents');
    var events = tab.Model._deferredEvents;
    tab.Model._deferredEvents = null;
    if (ss.isValue(events)) {
        var $enum1 = ss.IEnumerator.getEnumerator(events);
        while ($enum1.moveNext()) {
            var deferredEvent = $enum1.current;
            try {
                deferredEvent();
            }
            catch (e) {
                tab.Logger.getLogger(tab.ApplicationModel).warn('Error when processing deferred event', e);
                if (ss.isValue(exceptionHandler)) {
                    exceptionHandler(e);
                }
            }
        }
    }
    if (ss.isValue(tab.Model._failsafeFireEventsHandle)) {
        window.clearTimeout(tab.Model._failsafeFireEventsHandle);
        tab.Model._failsafeFireEventsHandle = null;
    }
}
tab.Model._clearDeferredEvents = function tab_Model$_clearDeferredEvents() {
    tab.Model._deferredEvents = null;
}
tab.Model.prototype = {
    presModel: null,
    _parent: null,
    _presModelKey: null,
    
    get_presModel: function tab_Model$get_presModel() {
        return this.presModel;
    },
    
    get_presModelKey: function tab_Model$get_presModelKey() {
        return this._presModelKey;
    },
    set_presModelKey: function tab_Model$set_presModelKey(value) {
        this._presModelKey = value;
        return value;
    },
    
    get_parent: function tab_Model$get_parent() {
        return this._parent;
    },
    
    getMutableCopyOfPresModel: function tab_Model$getMutableCopyOfPresModel() {
        var clone = tab.MiscUtil.cloneObject(this.presModel);
        if (!ss.isValue(clone)) {
            clone = {};
        }
        return clone;
    },
    
    getPresModelPath: function tab_Model$getPresModelPath() {
        return this._getPresModelPathRecursive(new tab.PresModelPath());
    },
    
    swapAndCopyPresModel: function tab_Model$swapAndCopyPresModel(newPM) {
        var oldPM = this.presModel;
        if (ss.isValue(oldPM) && ss.isValue(newPM)) {
            var newPMDict = newPM;
            var oldPMDict = oldPM;
            var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(oldPMDict));
            while ($enum1.moveNext()) {
                var oldKey = $enum1.current;
                if ((!Object.keyExists(newPMDict, oldKey) || ss.isUndefined(newPMDict[oldKey])) && !$.isFunction(oldPMDict[oldKey]) && !_.isBoolean(oldPMDict[oldKey])) {
                    newPMDict[oldKey] = oldPMDict[oldKey];
                }
            }
        }
        this.presModel = newPM;
    },
    
    swapPresModel: function tab_Model$swapPresModel(newPM) {
        this.presModel = newPM;
    },
    
    simpleSwapToUpdate: function tab_Model$simpleSwapToUpdate(newPresModel, eventToFire) {
        if (this.isNewPresModelSameAsOld(newPresModel)) {
            return false;
        }
        this.swapAndCopyPresModel(newPresModel);
        var args = Array.toArray(arguments).extract(1);
        Function.prototype.apply.call(ss.Delegate.create(this, this.raiseEvent), this, args);
        return true;
    },
    
    isNewPresModelSameAsOld: function tab_Model$isNewPresModelSameAsOld(newPM) {
        return _.isEqual(this.presModel, newPM);
    },
    
    isNewPresModelSameAsOldArray: function tab_Model$isNewPresModelSameAsOldArray(oldPM, newPM) {
        return _.isEqual(oldPM, newPM);
    },
    
    raiseEvent: function tab_Model$raiseEvent(a) {
        if (ss.isValue(a)) {
            if (ss.isValue(this.presModel)) {
                tab.Log.get(this).debug('calling event on model %s', this.get_presModelKey().name);
            }
            var args = Array.toArray(arguments).extract(1);
            var that = this;
            var toCall = function() {
                Function.prototype.apply.call(a, that, args);
            };
            if (ss.isNullOrUndefined(tab.Model._deferredEvents)) {
                tab.Model._deferredEvents = [];
            }
            tab.Model._deferredEvents.add(toCall);
            if (ss.isNullOrUndefined(tab.Model._failsafeFireEventsHandle)) {
                tab.Model._failsafeFireEventsHandle = window.setTimeout(function() {
                    tab.Logger.getLogger(tab.Model).debug('Failsafe FireDeferredEvents.');
                    tab.Model.fireDeferredEvents(null);
                }, 0);
            }
        }
    },
    
    _getPresModelPathRecursive: function tab_Model$_getPresModelPathRecursive(path) {
        if (!ss.isValue(this._parent)) {
            path.reverse();
            return path;
        }
        if (ss.isValue(this._presModelKey)) {
            path.add(this._presModelKey);
        }
        var compilerWorkaround = this._parent;
        return compilerWorkaround._getPresModelPathRecursive(path);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.UndoList

tab.UndoList = function tab_UndoList() {
    this._undoFuncs = [];
}
tab.UndoList.prototype = {
    
    add: function tab_UndoList$add(nextUndo) {
        this._undoFuncs.add(nextUndo);
    },
    
    makeUndoFunc: function tab_UndoList$makeUndoFunc() {
        var undo = ss.Delegate.create(this, function() {
            var $enum1 = ss.IEnumerator.getEnumerator(this._undoFuncs);
            while ($enum1.moveNext()) {
                var a = $enum1.current;
                a();
            }
        });
        return undo;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationCommands

tab.CalculationCommands = function tab_CalculationCommands() {
}
tab.CalculationCommands.registerCommandInterceptors = function tab_CalculationCommands$registerCommandInterceptors() {
    tab.ServerCommands.addCommandInterceptor(tab.CalculationCommands._handleEditPillCommand, 'tabdoc', 'edit-pill');
    tab.ServerCommands.addCommandInterceptor(tab.CalculationCommands._interceptCreateCalc, 'tabdoc', 'initiate-create-calc');
    tab.ServerCommands.addCommandInterceptor(tab.CalculationCommands._interceptEditCalc, 'tabdoc', 'initiate-edit-calc');
}
tab.CalculationCommands._interceptCreateCalc = function tab_CalculationCommands$_interceptCreateCalc(c) {
    if (Object.keyExists(c.commandParams, 'fn')) {
        tab.CalculationCommands.createCalculation(c.commandParams['datasource'], c.commandParams['fn']);
    }
    else {
        tab.CalculationCommands.createCalculation(c.commandParams['datasource']);
    }
    return 1;
}
tab.CalculationCommands._interceptEditCalc = function tab_CalculationCommands$_interceptEditCalc(c) {
    tab.CalculationCommands.editCalculation(c.commandParams['fn']);
    return 1;
}
tab.CalculationCommands._handleEditPillCommand = function tab_CalculationCommands$_handleEditPillCommand(c) {
    var cmdParams = c.commandParams;
    tab.CalculationCommands.editPill(cmdParams['fn'], cmdParams['shelfType'], parseInt(cmdParams['shelfPosIndex']), parseInt(cmdParams['paneSpec']));
    return 1;
}
tab.CalculationCommands.createCalculation = function tab_CalculationCommands$createCalculation(datasource, fn) {
    var cmdParams = {};
    cmdParams['datasource'] = datasource;
    if (ss.isValue(fn)) {
        cmdParams['fn'] = fn;
    }
    var cmd = tab.CommandUtils.newDocCommand('initiate-create-calc', cmdParams);
    tab.CommandController.SendCommand(new tab.ClientCommand('immediately', function(t) {
        var pm = t.makeMutablePresModel(tab.ApplicationModel.get_instance().get_calculationModel());
        pm.datasource = datasource;
        pm.pendingCalcName = '__temporary calc name__';
    }, cmd));
}
tab.CalculationCommands.editCalculation = function tab_CalculationCommands$editCalculation(fn) {
    var cmdParams = {};
    cmdParams['fn'] = fn;
    var cmd = tab.CommandUtils.newDocCommand('initiate-edit-calc', cmdParams);
    var caption = '';
    var dataSourceName = '';
    var ds = tab.ApplicationModel.get_instance().get_workbook().get_dataSchema().findDataSourceFromGlobalFieldName(fn);
    ss.Debug.assert(ss.isValue(ds), 'DataSource should always be found');
    if (ss.isValue(ds)) {
        dataSourceName = ds.get_name();
        var f = ds.findField(fn);
        ss.Debug.assert(ss.isValue(f), 'Field should always be found');
        if (ss.isValue(f)) {
            caption = f.get_displayName();
        }
    }
    tab.CommandController.SendCommand(new tab.ClientCommand('immediately', function(t) {
        var pm = t.makeMutablePresModel(tab.ApplicationModel.get_instance().get_calculationModel());
        pm.fn = fn;
        pm.calculationCaption = caption;
        pm.datasource = dataSourceName;
        pm.pendingCalcName = '__temporary calc name__';
    }, cmd));
}
tab.CalculationCommands.editPill = function tab_CalculationCommands$editPill(fieldName, shelfType, shelfPosition, paneSpec) {
    var cmdParams = {};
    cmdParams['fn'] = fieldName;
    cmdParams['paneSpec'] = paneSpec;
    cmdParams['shelfType'] = shelfType;
    cmdParams['shelfPosIndex'] = shelfPosition;
    var cmd = tab.CommandUtils.newDocCommand('edit-pill', cmdParams);
    return tab.CalculationCommands._sendWorldUpdateDeferredShelfCalcCommand(shelfType, cmd, tab.CalculationCommands._createTypeInPillLocalCommand(shelfType, shelfPosition, paneSpec));
}
tab.CalculationCommands.createAdHocCalculation = function tab_CalculationCommands$createAdHocCalculation(shelfType, shelfPosition, paneSpec) {
    var cmdParams = {};
    cmdParams['paneSpec'] = paneSpec;
    cmdParams['shelfType'] = shelfType;
    cmdParams['shelfPosIndex'] = shelfPosition;
    var cmd = tab.CommandUtils.newDocCommand('create-type-in-pill', cmdParams);
    return tab.CalculationCommands._sendWorldUpdateDeferredShelfCalcCommand(shelfType, cmd, tab.CalculationCommands._createTypeInPillLocalCommand(shelfType, shelfPosition, paneSpec));
}
tab.CalculationCommands._createTypeInPillLocalCommand = function tab_CalculationCommands$_createTypeInPillLocalCommand(shelfType, shelfPosition, paneSpec) {
    return function(t) {
        var pm = t.makeMutablePresModel(tab.ApplicationModel.get_instance().get_typeInPillCalculationModel());
        pm.datasource = '__fake ds name__';
        pm.pendingCalcName = '__temporary calc name__';
        pm.shelfType = shelfType;
        pm.shelfPosIndex = shelfPosition;
        pm.paneSpec = paneSpec;
    };
}
tab.CalculationCommands._sendWorldUpdateDeferredShelfCalcCommand = function tab_CalculationCommands$_sendWorldUpdateDeferredShelfCalcCommand(shelfType, cmd, localCommand) {
    if (!tab.CalculationCommands.isValidShelfForCalcs(shelfType)) {
        return $.DeferredData().reject();
    }
    var waitForWorldUpdate = $.DeferredData();
    var deferred = waitForWorldUpdate.promise().pipe(function(result) {
        var cmdPM = result;
        return ss.isValue(cmdPM) && (ss.isNullOrUndefined(cmdPM.valid) || cmdPM.valid);
    });
    tab.CommandController.SendCommand(new tab.ClientCommand('immediately', localCommand, cmd, tab.CommandController._deferredSuccessHandler(waitForWorldUpdate), function() {
        deferred.reject();
    }));
    return deferred;
}
tab.CalculationCommands.requestAutoCompleteInfoWithContext = function tab_CalculationCommands$requestAutoCompleteInfoWithContext(context, position, isTypeInPill) {
    var cmdParams = {};
    cmdParams['acSubstring'] = context;
    cmdParams['position'] = position;
    cmdParams['isTypeInPill'] = isTypeInPill;
    var deferred = $.DeferredData();
    var c = tab.CommandUtils.newDocCommand('calculation-auto-complete-with-context', cmdParams);
    c.noExceptionDialog = true;
    tab.CommandController.SendCommand(new tab._remoteClientCommand(c, 'none', function(pm) {
        var model = new tab.CalculationAutoCompleteModel(pm);
        deferred.resolve(model);
    }, function() {
        deferred.reject();
    }));
    return deferred.promise();
}
tab.CalculationCommands.applyCalculation = function tab_CalculationCommands$applyCalculation(model, fieldCaption, calcText, skipValidation, isFinished) {
    var waitForWorldUpdate = $.DeferredData();
    var deferred = waitForWorldUpdate.promise().pipe(function(value) {
        return tab.CalcApplyResponse.fromApplyCalculationResult(value, model);
    });
    var cmdParams = {};
    var docCmd;
    if (model.get_isAdhoc()) {
        docCmd = 'apply-type-in-pill';
        cmdParams['updatedCalculationFormula'] = calcText;
        cmdParams['isFullStyling'] = true;
        cmdParams['isTypeinFinished'] = isFinished;
    }
    else {
        docCmd = 'apply-calculation';
        cmdParams['updatedCalculationCaption'] = fieldCaption;
        cmdParams['updatedCalculationFormula'] = calcText;
        cmdParams['isFullStyling'] = true;
    }
    var localTransaction = function(t) {
        if (model.get_isAdhoc() && isFinished) {
            var calcModel = t.makeMutablePresModel(model);
            calcModel.calculationCaption = null;
            calcModel.pendingCalcName = null;
            calcModel.datasource = null;
        }
    };
    tab.CommandController.SendCommand(new tab.ClientCommand('immediately', localTransaction, tab.CommandUtils.newDocCommand(docCmd, cmdParams), tab.CommandController._deferredSuccessHandler(waitForWorldUpdate), function() {
        waitForWorldUpdate.reject();
    }));
    return deferred;
}
tab.CalculationCommands.cancelCalculation = function tab_CalculationCommands$cancelCalculation(model) {
    var cmdParams = null;
    if (model.get_isAdhoc()) {
        cmdParams = {};
        cmdParams['isTypeInPill'] = true;
    }
    var c = tab.CommandUtils.newDocCommand('clear-calculation-model', cmdParams);
    tab.CommandController.SendCommand(new tab.ClientCommand('none', function(t) {
        var pm = t.makeMutablePresModel(model);
        pm.calculationCaption = null;
        pm.pendingCalcName = null;
        pm.datasource = null;
    }, c));
}
tab.CalculationCommands.validateCalculation = function tab_CalculationCommands$validateCalculation(model, fieldCaption, calcText) {
    var deferred = $.Deferred();
    var docCmd;
    var cmdParams = {};
    cmdParams['updatedCalculationFormula'] = calcText;
    cmdParams['isFullStyling'] = true;
    if (model.get_isAdhoc()) {
        docCmd = 'validate-type-in-pill';
    }
    else {
        docCmd = 'validate-formula';
        cmdParams['updatedCalculationCaption'] = fieldCaption;
    }
    tab.CommandController.SendCommand(new tab._remoteClientCommand(tab.CommandUtils.newDocCommand(docCmd, cmdParams), 'none', function() {
        deferred.resolve();
    }, function() {
        deferred.reject();
    }));
    return deferred.promise();
}
tab.CalculationCommands.startDraggingText = function tab_CalculationCommands$startDraggingText(text) {
    var deferred = $.DeferredData();
    var cmdParams = {};
    cmdParams['sheet'] = tsConfig.current_sheet_name;
    cmdParams['isRightDrag'] = false;
    cmdParams['text'] = text;
    tab.CommandController.SendCommand(new tab._remoteClientCommand(tab.CommandUtils.newDocCommand('get-drag-pres-model-and-fieldname-for-text', cmdParams), 'none', tab.CommandController._deferredSuccessHandler(deferred), function() {
        deferred.reject();
    }));
    return deferred;
}
tab.CalculationCommands.dropOnCalcEditor = function tab_CalculationCommands$dropOnCalcEditor(fieldNames, dropPosition, dragSource, textSelection, isTypeInPill, draggedText) {
    var deferred = $.DeferredData();
    var cmdParams = {};
    cmdParams['fieldVector'] = fieldNames;
    cmdParams['calcEditorDropPos'] = dropPosition;
    cmdParams['dragSource'] = dragSource;
    if (ss.isValue(textSelection)) {
        cmdParams['calcEditorTextSelection'] = textSelection;
    }
    cmdParams['isRightDrag'] = false;
    cmdParams['isFullStyling'] = true;
    cmdParams['isTypeInPill'] = isTypeInPill;
    if (ss.isValue(draggedText)) {
        cmdParams['text'] = draggedText;
    }
    var cmd = new tab._remoteClientCommand(tab.CommandUtils.newDocCommand('drop-on-calc-editor', cmdParams), 'immediately', tab.CommandController._deferredSuccessHandler(deferred), function() {
        deferred.reject();
    });
    tab.CommandController.SendCommand(cmd);
    return deferred.promise();
}
tab.CalculationCommands.insertFunctionInFormula = function tab_CalculationCommands$insertFunctionInFormula(funcModel, formula, selection) {
    var deferred = $.DeferredData();
    if (ss.isNullOrUndefined(selection) || ss.isNullOrUndefined(funcModel)) {
        return deferred.reject();
    }
    var cmdParams = {};
    cmdParams['expressionFunc'] = funcModel;
    cmdParams['calculationFormula'] = formula;
    cmdParams['selectionStart'] = selection.calcEditorTextSelectionStartPos;
    cmdParams['selectionEnd'] = selection.calcEditorTextSelectionEndPos;
    var cmd = new tab._remoteClientCommand(tab.CommandUtils.newDocCommand('insert-function-in-formula', cmdParams), 'immediately', tab.CommandController._deferredSuccessHandler(deferred), function() {
        deferred.reject();
    });
    tab.CommandController.SendCommand(cmd);
    return deferred.promise();
}
tab.CalculationCommands.isValidShelfForCalcs = function tab_CalculationCommands$isValidShelfForCalcs(type) {
    return tab.FeatureFlags.isEnabled('TypeInPills') && (type === 'columns-shelf' || type === 'rows-shelf' || type === 'encoding-shelf' || type === 'measures-shelf' || ((type === 'filter-shelf' || type === 'pages-shelf') && tab.FeatureFlags.isEnabled('TypeInPillsExtraShelves')));
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalcApplyResponse

tab.CalcApplyResponse = function tab_CalcApplyResponse(resultType) {
    this._resultType = resultType;
}
tab.CalcApplyResponse.fromApplyCalculationResult = function tab_CalcApplyResponse$fromApplyCalculationResult(result, model) {
    var resultType = (_.isString(result)) ? result : result.calculationApplyResult;
    var response = new tab.CalcApplyResponse(resultType);
    switch (response.get_resultType()) {
        case 'invalid-formula':
            response.set_errorMessage(model.get_errorSummary());
            break;
        case 'invalid-caption-for-new-calc':
            response.set_errorMessage(result.errorString);
            break;
    }
    return response;
}
tab.CalcApplyResponse.prototype = {
    _resultType: null,
    _errorMessage: null,
    
    get_resultType: function tab_CalcApplyResponse$get_resultType() {
        return this._resultType;
    },
    
    get_errorMessage: function tab_CalcApplyResponse$get_errorMessage() {
        return this._errorMessage;
    },
    set_errorMessage: function tab_CalcApplyResponse$set_errorMessage(value) {
        this._errorMessage = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CommandsModel

tab.CommandsModel = function tab_CommandsModel(parent) {
    tab.CommandsModel.initializeBase(this, [ parent, new tab.PresModelPathItem('commands') ]);
}
tab.CommandsModel.prototype = {
    _shouldUpdate$1: true,
    
    add_commandsChanged: function tab_CommandsModel$add_commandsChanged(value) {
        this.__commandsChanged$1 = ss.Delegate.combine(this.__commandsChanged$1, value);
    },
    remove_commandsChanged: function tab_CommandsModel$remove_commandsChanged(value) {
        this.__commandsChanged$1 = ss.Delegate.remove(this.__commandsChanged$1, value);
    },
    
    __commandsChanged$1: null,
    
    get_shouldUpdate: function tab_CommandsModel$get_shouldUpdate() {
        return this._shouldUpdate$1;
    },
    set_shouldUpdate: function tab_CommandsModel$set_shouldUpdate(value) {
        this._shouldUpdate$1 = value;
        return value;
    },
    
    get_commands: function tab_CommandsModel$get_commands() {
        return this.presModel;
    },
    
    update: function tab_CommandsModel$update(newCommands) {
        if (this.get_shouldUpdate()) {
            this.forceUpdate(newCommands);
        }
    },
    
    forceUpdate: function tab_CommandsModel$forceUpdate(newCommands) {
        this.simpleSwapToUpdate(newCommands, this.__commandsChanged$1, this);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.HTMLEscape

tab.HTMLEscape = function() { };
tab.HTMLEscape.prototype = {
    escape: 0, 
    noEscape: 1
}
tab.HTMLEscape.registerEnum('tab.HTMLEscape', false);


////////////////////////////////////////////////////////////////////////////////
// tab._brushingDataValues

tab._brushingDataValues = function tab__brushingDataValues(fieldCaptions) {
    this._values = {};
    this._colValTupleSets = [];
    this._fieldCaptions = fieldCaptions;
}
tab._brushingDataValues._createSortedColValPairs = function tab__brushingDataValues$_createSortedColValPairs(colIndexes, valueIndexes) {
    var colValTuples = new Array(colIndexes.length);
    for (var ii = 0; ii < colIndexes.length; ++ii) {
        colValTuples[ii] = new ss.Tuple(colIndexes[ii], valueIndexes[ii]);
    }
    return _.sortBy(colValTuples, function(tuple) {
        return tuple.first;
    });
}
tab._brushingDataValues._sortValsByColumnIndexes = function tab__brushingDataValues$_sortValsByColumnIndexes(colIndexes, valIndexes) {
    var toRet;
    if (valIndexes.length === 1 || ss.isNullOrUndefined(colIndexes)) {
        toRet = valIndexes;
    }
    else {
        ss.Debug.assert(valIndexes.length === colIndexes.length, 'there must be the same number of columns and values');
        toRet = _.sortBy(valIndexes, function(val, index) {
            return colIndexes[index];
        });
    }
    return toRet;
}
tab._brushingDataValues.prototype = {
    _fieldCaptions: null,
    _areValuesMissing: false,
    
    get__fieldCaptions: function tab__brushingDataValues$get__fieldCaptions() {
        return this._fieldCaptions;
    },
    
    get__isEmpty: function tab__brushingDataValues$get__isEmpty() {
        return !Object.getKeyCount(this._values);
    },
    
    get__values: function tab__brushingDataValues$get__values() {
        return _.map(this._values, function(ints, s) {
            return ints;
        });
    },
    
    _addValues: function tab__brushingDataValues$_addValues(valueIndexes, colIndexes) {
        if (ss.isNullOrUndefined(valueIndexes) || !valueIndexes.length) {
            return;
        }
        this._colValTupleSets.add(tab._brushingDataValues._createSortedColValPairs(colIndexes, valueIndexes));
        this._areValuesMissing = this._areValuesMissing || this._isValueMissing(valueIndexes);
        valueIndexes = tab._brushingDataValues._sortValsByColumnIndexes(colIndexes, valueIndexes);
        this._values[valueIndexes.join(',')] = valueIndexes;
    },
    
    _findMatch: function tab__brushingDataValues$_findMatch(colIndexes, valueIndexes) {
        if (ss.isNullOrUndefined(valueIndexes) || !valueIndexes.length) {
            return false;
        }
        var toRet;
        if (this._areValuesMissing || this._isValueMissing(valueIndexes)) {
            toRet = this._mergeCompare(colIndexes, valueIndexes);
        }
        else {
            var sortedVals = tab._brushingDataValues._sortValsByColumnIndexes(colIndexes, valueIndexes);
            toRet = Object.keyExists(this._values, sortedVals.join(','));
        }
        return toRet;
    },
    
    _isValueMissing: function tab__brushingDataValues$_isValueMissing(valueIndexes) {
        var $enum1 = ss.IEnumerator.getEnumerator(valueIndexes);
        while ($enum1.moveNext()) {
            var val = $enum1.current;
            if (!ss.isValue(val)) {
                return true;
            }
        }
        return false;
    },
    
    _mergeCompare: function tab__brushingDataValues$_mergeCompare(colIndexes, valueIndexes) {
        var testVals = tab._brushingDataValues._createSortedColValPairs(colIndexes, valueIndexes);
        var $enum1 = ss.IEnumerator.getEnumerator(this._colValTupleSets);
        while ($enum1.moveNext()) {
            var colVals = $enum1.current;
            var matchedAll = true;
            var nonNullMatchExists = false;
            var testIdx = 0;
            var localIdx = 0;
            while (matchedAll && localIdx < colVals.length && testIdx < testVals.length) {
                var localPair = colVals[localIdx];
                var testPair = testVals[testIdx];
                if (localPair.first < testPair.first) {
                    ++localIdx;
                }
                else if (localPair.first > testPair.first) {
                    ++testIdx;
                }
                else {
                    matchedAll = !ss.isValue(localPair.second) || !ss.isValue(testPair.second) || localPair.second === testPair.second;
                    nonNullMatchExists = nonNullMatchExists || (localPair.second === testPair.second);
                    ++localIdx;
                    ++testIdx;
                }
            }
            if (matchedAll && nonNullMatchExists) {
                return true;
            }
        }
        return false;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SceneUtils

tab.SceneUtils = function tab_SceneUtils() {
}
tab.SceneUtils.get__log = function tab_SceneUtils$get__log() {
    return tab.Logger.lazyGetLogger(tab.SceneUtils);
}
tab.SceneUtils.getPaneDescriptorKeyFromTupleId = function tab_SceneUtils$getPaneDescriptorKeyFromTupleId(tupleId, scene) {
    var $enum1 = ss.IEnumerator.getEnumerator(scene.panes);
    while ($enum1.moveNext()) {
        var pane = $enum1.current;
        var $enum2 = ss.IEnumerator.getEnumerator(pane.drawPane);
        while ($enum2.moveNext()) {
            var vlpm = $enum2.current;
            if (ss.isValue(vlpm.paneMarks)) {
                var pdMarks = scene.pdMarksMap;
                var $dict3 = pdMarks;
                for (var $key4 in $dict3) {
                    var pair = { key: $key4, value: $dict3[$key4] };
                    var dataCol = pair.value.encodingColumns['tuple_id'];
                    var match = _.find(dataCol.dataValues, function(data) {
                        return data === tupleId;
                    });
                    if (ss.isValue(match)) {
                        return pair.key;
                    }
                }
            }
        }
    }
    tab.Logger.lazyGetLogger(tab.SceneUtils).warn('Failed getting pane descriptor key for tuple id: %i', tupleId);
    return '';
}


////////////////////////////////////////////////////////////////////////////////
// tab._brushingDataUtils

tab._brushingDataUtils = function tab__brushingDataUtils() {
}
tab._brushingDataUtils.get__log = function tab__brushingDataUtils$get__log() {
    return tab.Logger.lazyGetLogger(tab.SelectionClientCommands);
}
tab._brushingDataUtils._buildLegendSelectionDataValues = function tab__brushingDataUtils$_buildLegendSelectionDataValues(model, objectIds, vizData, fieldCaptions) {
    var vizDataFieldMap = tab._brushingDataUtils._buildVizDataFieldMap(vizData, fieldCaptions);
    var values = new tab._brushingDataValues(fieldCaptions);
    var colIndices = new Array(fieldCaptions.length);
    for (var ii = 0; ii < colIndices.length; ++ii) {
        var colIdx = vizData.getColumnIndex(fieldCaptions[ii]);
        colIndices[ii] = colIdx;
    }
    var $enum1 = ss.IEnumerator.getEnumerator(objectIds);
    while ($enum1.moveNext()) {
        var objId = $enum1.current;
        var itemPm = model.findItemById(objId);
        if (!ss.isValue(itemPm)) {
            continue;
        }
        var indices = [];
        if (tab._brushingDataUtils._findLegendDataIndices(model, itemPm, vizData, vizDataFieldMap, indices)) {
            values._addValues(indices, colIndices);
        }
    }
    return values;
}
tab._brushingDataUtils._buildNodeSelectionDataValues = function tab__brushingDataUtils$_buildNodeSelectionDataValues(source, selectedNodes) {
    var results = {};
    var $enum1 = ss.IEnumerator.getEnumerator(selectedNodes);
    while ($enum1.moveNext()) {
        var node = $enum1.current;
        var fieldNames = new Array(node.columnIndices.length);
        for (var i = 0; i < fieldNames.length; i++) {
            var col = source.getVizDataFieldByIndex(node.columnIndices[i]);
            fieldNames[i] = col.get_fieldName();
        }
        var combinedName = fieldNames.join(';');
        var values;
        if (Object.keyExists(results, combinedName)) {
            values = results[combinedName];
        }
        else {
            values = new tab._brushingDataValues(fieldNames);
            results[combinedName] = values;
        }
        values._addValues(node.aliasIndices, node.columnIndices);
    }
    return _.map(results, function(o, s) {
        return o;
    });
}
tab._brushingDataUtils._getFieldsForNodes = function tab__brushingDataUtils$_getFieldsForNodes(viz, nodes) {
    var fields = [];
    var $enum1 = ss.IEnumerator.getEnumerator(nodes);
    while ($enum1.moveNext()) {
        var node = $enum1.current;
        if (ss.isNullOrUndefined(node.columnIndices)) {
            continue;
        }
        var $enum2 = ss.IEnumerator.getEnumerator(node.columnIndices);
        while ($enum2.moveNext()) {
            var colIndex = $enum2.current;
            var nodeCol = viz.get_vizDataModel().getVizDataFieldByIndex(colIndex);
            var colFieldName = nodeCol.get_fieldCaption();
            if (!fields.contains(colFieldName)) {
                fields.add(colFieldName);
            }
        }
    }
    return fields;
}
tab._brushingDataUtils._buildTupleSelectionDataValues = function tab__brushingDataUtils$_buildTupleSelectionDataValues(source, tupleIds, fields) {
    var values = new tab._brushingDataValues(fields);
    var vizDataFieldMap = tab._brushingDataUtils._buildVizDataFieldMap(source, fields);
    var $enum1 = ss.IEnumerator.getEnumerator(tupleIds);
    while ($enum1.moveNext()) {
        var tupleId = $enum1.current;
        var aliasRow = [];
        var columnRow = [];
        var $enum2 = ss.IEnumerator.getEnumerator(fields);
        while ($enum2.moveNext()) {
            var field = $enum2.current;
            var vizDataField = vizDataFieldMap[field];
            var aliasIndex = vizDataField.getAliasIndex(tupleId);
            aliasRow.add(aliasIndex);
            columnRow.add(source.getColumnIndex(field));
        }
        if (aliasRow.length !== fields.length) {
            tab._brushingDataUtils.get__log().error('Alias row created has different number of elements from the specified fields.');
        }
        values._addValues(aliasRow, columnRow);
    }
    return values;
}
tab._brushingDataUtils._buildDateTimeTupleDataValues = function tab__brushingDataUtils$_buildDateTimeTupleDataValues(srcVizData, targetVizData, dataDict, tupleIds) {
    var overlapIndexes = [];
    var brushAggTypes = {};
    var sourceHasAggNone = false;
    srcVizData.forEachVizDataField(function(srcCol, srcColIdx) {
        if (tab._brushingDataUtils._isDateTimeColumn(srcCol)) {
            var colAggType = (srcCol.get_aggType() || 'none');
            brushAggTypes[colAggType] = srcColIdx;
            if (colAggType === 'none') {
                sourceHasAggNone = true;
            }
        }
        return true;
    });
    var onlyOneBaseCol = true;
    var baseCol = null;
    targetVizData.forEachVizDataField(function(targetCol, targetColIdx) {
        if (tab._brushingDataUtils._isDateTimeColumn(targetCol)) {
            if (baseCol == null) {
                baseCol = targetCol.get_baseColumnName();
            }
            else if (baseCol !== targetCol.get_baseColumnName()) {
                onlyOneBaseCol = false;
            }
        }
        return true;
    });
    var overlapColumns = [];
    if (onlyOneBaseCol) {
        var aggTypes = [];
        targetVizData.forEachVizDataField(function(targetCol, targetColIdx) {
            if (tab._brushingDataUtils._isDateTimeColumn(targetCol)) {
                var aggType = (targetCol.get_aggType() || 'none');
                if (!sourceHasAggNone && aggType === 'none') {
                    var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(brushAggTypes));
                    while ($enum1.moveNext()) {
                        var srcAggType = $enum1.current;
                        if (!aggTypes.contains(srcAggType)) {
                            aggTypes.add(srcAggType);
                            var srcColIdx = brushAggTypes[srcAggType];
                            overlapIndexes.add(new tab._dateTimePartIndexes(srcColIdx, targetColIdx, srcAggType, 'none'));
                            var srcCol = srcVizData.getVizDataFieldByIndex(srcColIdx);
                            overlapColumns.add(srcCol);
                        }
                    }
                }
                else if (Object.keyExists(brushAggTypes, aggType)) {
                    if (!aggTypes.contains(aggType)) {
                        aggTypes.add(aggType);
                        var srcColIdx = brushAggTypes[aggType];
                        overlapIndexes.add(new tab._dateTimePartIndexes(srcColIdx, targetColIdx, 'none', 'none'));
                        overlapColumns.add(targetCol);
                    }
                }
                else if (sourceHasAggNone) {
                    var srcColIdx = brushAggTypes['none'];
                    overlapIndexes.add(new tab._dateTimePartIndexes(srcColIdx, targetColIdx, 'none', aggType));
                    overlapColumns.add(targetCol);
                }
            }
            return true;
        });
    }
    var targetFieldCaptions = new Array(overlapColumns.length);
    var $enum1 = ss.IEnumerator.getEnumerator(overlapColumns);
    while ($enum1.moveNext()) {
        var col = $enum1.current;
        targetFieldCaptions.add(col.get_fieldCaption());
    }
    var values = new tab._brushingDataValues(targetFieldCaptions);
    var $enum2 = ss.IEnumerator.getEnumerator(tupleIds);
    while ($enum2.moveNext()) {
        var tupleId = $enum2.current;
        var valueRow = [];
        var colRow = [];
        var $enum3 = ss.IEnumerator.getEnumerator(overlapIndexes);
        while ($enum3.moveNext()) {
            var indices = $enum3.current;
            var srcColumn = srcVizData.getVizDataFieldByIndex(indices._srcColumnIndex);
            var valIdx = srcColumn.getDataValueIndex(tupleId);
            var srcRawVal = dataDict.getRawValue(srcColumn.get_dataType(), valIdx);
            var srcBrushVal = tab._brushingDataUtils._convertToBrushValue(srcRawVal, indices._srcAgg, indices._destAgg, valIdx);
            valueRow.add(srcBrushVal);
            colRow.add(indices._srcColumnIndex);
        }
        values._addValues(valueRow, colRow);
    }
    return new ss.Tuple(values, overlapIndexes);
}
tab._brushingDataUtils._findMatchingTuplesDateTimeHighlighting = function tab__brushingDataUtils$_findMatchingTuplesDateTimeHighlighting(values, overlapIndexes, targetVizData, dataDict) {
    var tupleIds = [];
    if (ss.isNullOrUndefined(targetVizData) || values.get__isEmpty()) {
        return tupleIds;
    }
    targetVizData.forEachTupleId(function(tupleId) {
        var valueRow = [];
        var colRow = [];
        var $enum1 = ss.IEnumerator.getEnumerator(overlapIndexes);
        while ($enum1.moveNext()) {
            var indices = $enum1.current;
            var targetColumn = targetVizData.getVizDataFieldByIndex(indices._destColumnIndex);
            var valIdx = targetColumn.getDataValueIndex(tupleId);
            var targetRawVal = dataDict.getRawValue(targetColumn.get_dataType(), valIdx);
            var targetBrushVal = tab._brushingDataUtils._convertToBrushValue(targetRawVal, indices._destAgg, indices._srcAgg, valIdx);
            valueRow.add(targetBrushVal);
            colRow.add(indices._destColumnIndex);
        }
        if (values._findMatch(colRow, valueRow)) {
            tupleIds.add(tupleId);
        }
        return true;
    });
    return tupleIds;
}
tab._brushingDataUtils._findMatchingTuples = function tab__brushingDataUtils$_findMatchingTuples(dvs, vizData) {
    var tupleIds = [];
    if (ss.isNullOrUndefined(vizData) || dvs.get__isEmpty()) {
        return tupleIds;
    }
    var fieldCaptions = dvs.get__fieldCaptions();
    var vizDataFieldMap = tab._brushingDataUtils._buildVizDataFieldMap(vizData, fieldCaptions);
    if (ss.isNullOrUndefined(vizDataFieldMap)) {
        return tupleIds;
    }
    if (!vizData.get_hasTupleIdColumn()) {
        return tupleIds;
    }
    var columnIndices = new Array(fieldCaptions.length);
    for (var jj = 0; jj < fieldCaptions.length; jj++) {
        columnIndices[jj] = vizData.getColumnIndex(fieldCaptions[jj]);
    }
    vizData.forEachTupleId(function(tupleId) {
        var tupleAliasIndices = new Array(fieldCaptions.length);
        for (var ii = 0; ii < fieldCaptions.length; ii++) {
            var field = fieldCaptions[ii];
            var vizDataField = vizDataFieldMap[field];
            var aliasIndex = vizDataField.getAliasIndex(tupleId);
            tupleAliasIndices[ii] = aliasIndex;
        }
        if (dvs._findMatch(columnIndices, tupleAliasIndices)) {
            tupleIds.add(tupleId);
        }
        return true;
    });
    return tupleIds;
}
tab._brushingDataUtils._buildVizDataFieldMap = function tab__brushingDataUtils$_buildVizDataFieldMap(vizDataModel, fields) {
    var map = {};
    var $enum1 = ss.IEnumerator.getEnumerator(fields);
    while ($enum1.moveNext()) {
        var field = $enum1.current;
        var vizDataField = vizDataModel.getVizDataField(field);
        if (ss.isNullOrUndefined(vizDataField)) {
            return null;
        }
        map[field] = vizDataField;
    }
    return map;
}
tab._brushingDataUtils._findMatchingLegendItems = function tab__brushingDataUtils$_findMatchingLegendItems(dvs, vizData, legend) {
    var results = [];
    if (ss.isNullOrUndefined(vizData) || legend.get_fieldCaptions().length !== dvs.get__fieldCaptions().length) {
        return results;
    }
    var legendFieldCaptions = legend.get_fieldCaptions();
    var $enum1 = ss.IEnumerator.getEnumerator(dvs.get__values());
    while ($enum1.moveNext()) {
        var dataIndices = $enum1.current;
        var dataValues = new Array(dataIndices.length);
        for (var i = 0; i < dataValues.length; i++) {
            var fieldCaption = legendFieldCaptions[i];
            var dvsFieldIdx = dvs.get__fieldCaptions().indexOf(fieldCaption);
            var aliasIndex = dataIndices[dvsFieldIdx];
            var col = vizData.getVizDataField(fieldCaption);
            dataValues[i] = tab.VizDataLookup.lookupAliasFromIndex(aliasIndex, col, tab.ApplicationModel.get_instance().get_dataDictionary());
        }
        var $enum2 = ss.IEnumerator.getEnumerator(legend.get_items());
        while ($enum2.moveNext()) {
            var legendItem = $enum2.current;
            if (_.isEqual(dataValues, legendItem.itemValues)) {
                results.add(legendItem.objectId);
            }
        }
    }
    return results;
}
tab._brushingDataUtils._findMatchingNodes = function tab__brushingDataUtils$_findMatchingNodes(dvs, viz, nodes) {
    var matchingNodes = [];
    if (ss.isNullOrUndefined(viz.get_vizDataModel())) {
        return matchingNodes;
    }
    var fieldCaptions = dvs.get__fieldCaptions();
    var $enum1 = ss.IEnumerator.getEnumerator(nodes);
    while ($enum1.moveNext()) {
        var node = $enum1.current;
        if (ss.isNullOrUndefined(node.columnIndices) || ss.isNullOrUndefined(node.aliasIndices) || node.aliasIndices.length < fieldCaptions.length) {
            continue;
        }
        var colIdxs = [];
        var aliasIdxs = [];
        var hasLeftmostField = false;
        for (var ii = 0; ii < node.columnIndices.length; ++ii) {
            var colIdx = node.columnIndices[ii];
            var fieldCaption = viz.get_vizDataModel().getVizDataFieldByIndex(colIdx).get_fieldCaption();
            if (ss.isValue(fieldCaption) && fieldCaptions.contains(fieldCaption)) {
                colIdxs.add(colIdx);
                aliasIdxs.add(node.aliasIndices[ii]);
                if (!ii) {
                    hasLeftmostField = true;
                }
            }
        }
        if (hasLeftmostField && dvs._findMatch(colIdxs, aliasIdxs)) {
            var sel = {};
            sel.columnIndices = node.columnIndices;
            sel.aliasIndices = node.aliasIndices;
            matchingNodes.add(sel);
        }
    }
    return matchingNodes;
}
tab._brushingDataUtils._findMatchingNodesDateTimeHighlighting = function tab__brushingDataUtils$_findMatchingNodesDateTimeHighlighting(dvs, overlapIndexes, viz, dataDict) {
    var matchingNodes = [];
    if (ss.isNullOrUndefined(viz.get_vizDataModel())) {
        return matchingNodes;
    }
    var $dict1 = viz.get_sceneModel().get_visualListModels();
    for (var $key2 in $dict1) {
        var listModel = { key: $key2, value: $dict1[$key2] };
        var $enum3 = ss.IEnumerator.getEnumerator(listModel.value.get_groupItemNodes());
        while ($enum3.moveNext()) {
            var node = $enum3.current;
            if (ss.isNullOrUndefined(node.columnIndices) || ss.isNullOrUndefined(node.aliasIndices) || node.columnIndices.length !== node.aliasIndices.length) {
                continue;
            }
            var valueRow = [];
            for (var ii = 0; ii < node.columnIndices.length; ++ii) {
                var nodeColIndex = node.columnIndices[ii];
                var partIndices = _.find(overlapIndexes, function(indices) {
                    return indices._destColumnIndex === nodeColIndex;
                });
                if (ss.isValue(partIndices)) {
                    var aliasIdx = node.aliasIndices[ii];
                    var targetColumn = viz.get_vizDataModel().getVizDataFieldByIndex(partIndices._destColumnIndex);
                    var targetRawVal = dataDict.getRawValue(targetColumn.get_dataType(), aliasIdx);
                    var targetBrushVal = tab._brushingDataUtils._convertToBrushValue(targetRawVal, partIndices._destAgg, partIndices._srcAgg, aliasIdx);
                    valueRow.add(targetBrushVal);
                }
            }
            if (valueRow.length === node.aliasIndices.length) {
                if (dvs._findMatch(node.columnIndices, valueRow)) {
                    var sel = {};
                    sel.columnIndices = node.columnIndices;
                    sel.aliasIndices = node.aliasIndices;
                    matchingNodes.add(sel);
                }
            }
        }
    }
    return matchingNodes;
}
tab._brushingDataUtils._findLegendDataIndices = function tab__brushingDataUtils$_findLegendDataIndices(legend, itemPm, vizData, vizDataFieldMap, matchedIndices) {
    matchedIndices.clear();
    for (var i = 0; i < itemPm.itemValues.length; i++) {
        var fieldCaption = legend.get_fieldCaptions()[i];
        var aliasValue = itemPm.itemValues[i];
        var vizDataField = vizDataFieldMap[fieldCaption];
        if (ss.isNullOrUndefined(vizDataField)) {
            continue;
        }
        var aliasIndex = tab.VizDataLookup.reverseLookupAlias(aliasValue, vizData, vizDataField, tab.ApplicationModel.get_instance().get_dataDictionary());
        if (!ss.isValue(aliasIndex)) {
            return false;
        }
        matchedIndices.add(aliasIndex);
    }
    return true;
}
tab._brushingDataUtils._isDateTimeColumn = function tab__brushingDataUtils$_isDateTimeColumn(column) {
    if (ss.isNullOrUndefined(column)) {
        return false;
    }
    var type = column.get_dataType();
    if (type === 'datetime' || type === 'date') {
        return true;
    }
    var dateTimeAggTypes = [ 'day', 'hour', 'mdy', 'minute', 'month', 'month-year', 'qtr', 'trunc-day', 'trunc-hour', 'trunc-minute', 'trunc-month', 'trunc-qtr', 'trunc-second', 'trunc-week', 'trunc-year', 'week', 'weekday', 'year' ];
    return dateTimeAggTypes.contains(column.get_aggType());
}
tab._brushingDataUtils._convertToBrushValue = function tab__brushingDataUtils$_convertToBrushValue(value, aggThis, aggOther, valIdx) {
    if (_.isNumber(value)) {
        return value;
    }
    var dv = (_.isDate(value)) ? value : tab.DateUtil.parsePresModelDate(value);
    var toRet = valIdx;
    if (aggThis === 'none' && aggOther !== 'none') {
        switch (aggOther) {
            case 'year':
                toRet = tab.DateUtil.dateAsYear(dv);
                break;
            case 'qtr':
                toRet = tab.DateUtil.dateAsQuarter(dv);
                break;
            case 'month':
                toRet = tab.DateUtil.dateAsMonth(dv);
                break;
            case 'day':
                toRet = tab.DateUtil.dateAsDay(dv);
                break;
            case 'hour':
                toRet = tab.DateUtil.dateTimeAsHour(dv);
                break;
            case 'minute':
                toRet = tab.DateUtil.dateTimeAsMinute(dv);
                break;
            case 'second':
                toRet = tab.DateUtil.dateTimeAsSecond(dv);
                break;
            case 'week':
                toRet = tab.DateUtil.dateAsWeek(dv);
                break;
            case 'weekday':
                toRet = tab.DateUtil.dateAsDayOfWeek(dv);
                break;
            case 'month-year':
                toRet = tab.DateUtil.dateAsMonthYear(dv);
                break;
            case 'mdy':
                toRet = tab.DateUtil.dateAsMonthDayYear(dv);
                break;
        }
        if (ss.isNullOrUndefined(toRet)) {
        }
    }
    return toRet;
}
tab._brushingDataUtils._getColumnAggType = function tab__brushingDataUtils$_getColumnAggType(targetCol) {
    return (targetCol.aggregation || 'none');
}


////////////////////////////////////////////////////////////////////////////////
// tab._dateTimePartIndexes

tab._dateTimePartIndexes = function tab__dateTimePartIndexes(srcIdx, destIdx, srcA, destA) {
    this._srcColumnIndex = srcIdx;
    this._destColumnIndex = destIdx;
    this._srcAgg = (srcA || 'none');
    this._destAgg = (destA || 'none');
}
tab._dateTimePartIndexes.prototype = {
    _srcColumnIndex: 0,
    _destColumnIndex: 0,
    _srcAgg: null,
    _destAgg: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.SelectionUtils

tab.SelectionUtils = function tab_SelectionUtils() {
}
tab.SelectionUtils.get__log = function tab_SelectionUtils$get__log() {
    return tab.Logger.lazyGetLogger(tab.SelectionUtils);
}
tab.SelectionUtils.resolveLegendSelection = function tab_SelectionUtils$resolveLegendSelection(action, selectedItems, legend, currentSelection) {
    var finalObjectIds = [];
    if (ss.isValue(selectedItems)) {
        var currSelPreModel = currentSelection.get_selectionPresModel() || {};
        switch (action) {
            case 'toggle':
                if (ss.isValue(currSelPreModel.objectIds)) {
                    finalObjectIds.addRange(currSelPreModel.objectIds);
                }
                var $enum1 = ss.IEnumerator.getEnumerator(selectedItems);
                while ($enum1.moveNext()) {
                    var item = $enum1.current;
                    var indexOfitem = finalObjectIds.indexOf(item.objectId);
                    if (indexOfitem >= 0) {
                        finalObjectIds.removeAt(indexOfitem);
                    }
                    else {
                        finalObjectIds.add(item.objectId);
                    }
                }
                break;
            case 'range':
                finalObjectIds = tab.SelectionUtils._handleLegendRangeSelection(selectedItems, legend, currSelPreModel);
                break;
            case 'simple':
                var currSelIds = (ss.isValue(currSelPreModel.objectIds)) ? currSelPreModel.objectIds : new Array(0);
                if (currSelIds.length <= 1) {
                    var $enum2 = ss.IEnumerator.getEnumerator(selectedItems);
                    while ($enum2.moveNext()) {
                        var item = $enum2.current;
                        var indexOfitem = currSelIds.indexOf(item.objectId);
                        if (indexOfitem >= 0) {
                            finalObjectIds.removeAt(indexOfitem);
                        }
                        else {
                            finalObjectIds.add(item.objectId);
                        }
                    }
                }
                else {
                    finalObjectIds.addRange(_.pluck(selectedItems, 'objectId'));
                }
                break;
        }
    }
    return finalObjectIds;
}
tab.SelectionUtils.resolveMarkSelection = function tab_SelectionUtils$resolveMarkSelection(action, selectedMarkIDs, currentSelection, isAreaSelection) {
    var resultingMarkIDs = [];
    switch (action) {
        case 'simple':
            if (!isAreaSelection && selectedMarkIDs.length === 1 && currentSelection.get_ids().length === 1 && selectedMarkIDs[0] === currentSelection.get_ids()[0]) {
                resultingMarkIDs.clear();
            }
            else {
                resultingMarkIDs.addRange(selectedMarkIDs);
            }
            break;
        case 'range':
        case 'toggle':
            resultingMarkIDs.addRange(currentSelection.get_ids());
            var $enum1 = ss.IEnumerator.getEnumerator(selectedMarkIDs);
            while ($enum1.moveNext()) {
                var markID = $enum1.current;
                if (!currentSelection.isMarkSelected(markID)) {
                    resultingMarkIDs.add(markID);
                }
                else if (!isAreaSelection) {
                    resultingMarkIDs.remove(markID);
                }
            }
            break;
    }
    return resultingMarkIDs;
}
tab.SelectionUtils.resolveNodeSelection = function tab_SelectionUtils$resolveNodeSelection(action, allNodes, selectedNode, currentSelection, selectionToUpdate) {
    var updatedSelection = [];
    if (ss.isValue(selectedNode)) {
        switch (action) {
            case 'simple':
                tab.SelectionUtils._handleNodeSimpleSelection(selectedNode, currentSelection, updatedSelection);
                break;
            case 'toggle':
                tab.SelectionUtils._handleNodeToggleSelection(selectedNode, currentSelection, updatedSelection);
                break;
            case 'range':
                tab.SelectionUtils._handleNodeRangeSelection(allNodes, selectedNode, currentSelection, updatedSelection);
                break;
        }
    }
    selectionToUpdate.selectedNodes = updatedSelection;
}
tab.SelectionUtils._handleLegendRangeSelection = function tab_SelectionUtils$_handleLegendRangeSelection(selectedItems, legend, currSelPreModel) {
    var finalObjectIds = [];
    if (!ss.isValue(currSelPreModel.objectIds)) {
        return finalObjectIds;
    }
    finalObjectIds.addRange(currSelPreModel.objectIds);
    finalObjectIds.addRange(_.pluck(selectedItems, 'objectId'));
    var lastId = _.last(currSelPreModel.objectIds);
    var lastIdx = -1;
    for (var i = 0; i < legend.get_items().length; i++) {
        if (legend.get_items()[i].objectId === lastId) {
            lastIdx = i;
        }
    }
    var selIdx = legend.get_items().indexOf(_.first(selectedItems));
    if (lastIdx < 0 || selIdx < 0) {
        return _.uniq(finalObjectIds);
    }
    tab.SelectionUtils.get__log().debug('Adding legend range: %s->%s', lastIdx, selIdx);
    var startIdx = Math.min(lastIdx, selIdx);
    var stopIdx = startIdx + Math.abs(lastIdx - selIdx) + 1;
    for (var i = startIdx; i < stopIdx; i++) {
        finalObjectIds.add(legend.get_items()[i].objectId);
    }
    return _.uniq(finalObjectIds);
}
tab.SelectionUtils._handleNodeRangeSelection = function tab_SelectionUtils$_handleNodeRangeSelection(allNodes, selectedNode, currentSelectionModel, updatedSelection) {
    var prevSelection = _.last(currentSelectionModel.get_nodes());
    if (ss.isNullOrUndefined(prevSelection)) {
        tab.SelectionUtils.get__log().debug('Node range selection: no existing column selection');
        updatedSelection.addRange(currentSelectionModel.get_nodes());
        var newSel = {};
        newSel.columnIndices = (selectedNode.columnIndices || new Array(0));
        newSel.aliasIndices = (selectedNode.aliasIndices || new Array(0));
        updatedSelection.add(newSel);
    }
    else {
        updatedSelection.addRange(currentSelectionModel.get_nodes());
        var nodeIndexOfPrevSelection = -1;
        for (var i = 0; i < allNodes.length; i++) {
            var node = allNodes[i];
            if (_.isEqual(node.columnIndices, prevSelection.columnIndices) && _.isEqual(node.aliasIndices, prevSelection.aliasIndices)) {
                nodeIndexOfPrevSelection = i;
                break;
            }
        }
        var nodeIndexOfSelection = allNodes.indexOf(selectedNode);
        tab.SelectionUtils.get__log().debug('Node range selection: adding to existing, prevSelIndex=%s, newSelIndex', nodeIndexOfPrevSelection, nodeIndexOfSelection);
        if (selectedNode.columnIndices[0] !== allNodes[nodeIndexOfPrevSelection].columnIndices[0]) {
            if (!currentSelectionModel.isNodeAncestorSelected(selectedNode)) {
                var newSel = {};
                newSel.columnIndices = (selectedNode.columnIndices || new Array(0));
                newSel.aliasIndices = (selectedNode.aliasIndices || new Array(0));
                updatedSelection.add(newSel);
            }
        }
        else {
            var range = allNodes.extract(Math.min(nodeIndexOfPrevSelection, nodeIndexOfSelection), Math.abs(nodeIndexOfPrevSelection - nodeIndexOfSelection) + 1);
            var $enum1 = ss.IEnumerator.getEnumerator(range);
            while ($enum1.moveNext()) {
                var toSelect = $enum1.current;
                if (toSelect.columnIndices[0] !== selectedNode.columnIndices[0]) {
                    continue;
                }
                if (currentSelectionModel.isNodeSelected(toSelect)) {
                    continue;
                }
                if (currentSelectionModel.isNodeAncestorSelected(toSelect)) {
                    continue;
                }
                var newSel = {};
                newSel.columnIndices = (toSelect.columnIndices || new Array(0));
                newSel.aliasIndices = (toSelect.aliasIndices || new Array(0));
                updatedSelection.add(newSel);
            }
        }
    }
}
tab.SelectionUtils._handleNodeSimpleSelection = function tab_SelectionUtils$_handleNodeSimpleSelection(selectedNode, currentSelection, updatedSelection) {
    if (!currentSelection.isNodeSelected(selectedNode) || currentSelection.get_nodes().length > 1) {
        var newSel = {};
        newSel.columnIndices = (selectedNode.columnIndices || new Array(0));
        newSel.aliasIndices = (selectedNode.aliasIndices || new Array(0));
        updatedSelection.add(newSel);
    }
}
tab.SelectionUtils._handleNodeToggleSelection = function tab_SelectionUtils$_handleNodeToggleSelection(selectedNode, currentSelection, updatedSelection) {
    updatedSelection.addRange(currentSelection.get_nodes());
    var existingSelection = currentSelection.findNodeSelection(selectedNode);
    if (ss.isValue(existingSelection)) {
        updatedSelection.remove(existingSelection);
    }
    else if (!currentSelection.isNodeAncestorSelected(selectedNode)) {
        var newSel = {};
        newSel.columnIndices = (selectedNode.columnIndices || new Array(0));
        newSel.aliasIndices = (selectedNode.aliasIndices || new Array(0));
        updatedSelection.add(newSel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.StartupUtils

tab.StartupUtils = function tab_StartupUtils() {
}
tab.StartupUtils.callAfterBootstrap = function tab_StartupUtils$callAfterBootstrap(action) {
    if (tabBootstrap.ViewerBootstrap.get_instance().get_hasBootstrapCompleted()) {
        action();
    }
    else {
        var subscriptionHandle = null;
        var onBootstrap = function() {
            action();
            dojo.unsubscribe(subscriptionHandle);
        };
        subscriptionHandle = dojo.subscribe('onBootstrapSuccess', onBootstrap);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SubscriptionDisposable

tab.SubscriptionDisposable = function tab_SubscriptionDisposable(subscription) {
    this._subscription = subscription;
}
tab.SubscriptionDisposable.prototype = {
    _subscription: null,
    
    dispose: function tab_SubscriptionDisposable$dispose() {
        dojo.unsubscribe(this._subscription);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizDataField

tab.VizDataField = function tab_VizDataField(columnPresModel, paneColumnsPresModel) {
    this._columnPresModel = columnPresModel;
    this._paneColumnsPresModel = paneColumnsPresModel;
    this._tupleIdLookupForPane = {};
    this._validatePresModels();
    this._hasDataValues = this._computeHasDataValues();
    this._hasAliases = this._computeHasAliases();
}
tab.VizDataField.prototype = {
    _columnPresModel: null,
    _paneColumnsPresModel: null,
    _hasDataValues: false,
    _hasAliases: false,
    _tupleIdLookupForPane: null,
    
    get_hasDataValues: function tab_VizDataField$get_hasDataValues() {
        return this._hasDataValues;
    },
    
    get_hasAliases: function tab_VizDataField$get_hasAliases() {
        return this._hasAliases;
    },
    
    get_dataType: function tab_VizDataField$get_dataType() {
        return this._columnPresModel.dataType;
    },
    
    get_fieldName: function tab_VizDataField$get_fieldName() {
        return this._columnPresModel.fn;
    },
    
    get_fieldCaption: function tab_VizDataField$get_fieldCaption() {
        return this._columnPresModel.fieldCaption;
    },
    
    get_baseColumnName: function tab_VizDataField$get_baseColumnName() {
        return this._columnPresModel.baseColumnName;
    },
    
    get_role: function tab_VizDataField$get_role() {
        return this._columnPresModel.fieldRole;
    },
    
    get_aggType: function tab_VizDataField$get_aggType() {
        return this._columnPresModel.aggregation;
    },
    
    get_specialValuesOverride: function tab_VizDataField$get_specialValuesOverride() {
        return this._columnPresModel.specialValueText;
    },
    
    get_isQuantitative: function tab_VizDataField$get_isQuantitative() {
        return !this._columnPresModel.isAutoSelect;
    },
    
    get_formatStrings: function tab_VizDataField$get_formatStrings() {
        return this._columnPresModel.formatStrings;
    },
    
    get_filterContext: function tab_VizDataField$get_filterContext() {
        return this._columnPresModel.filterContext;
    },
    
    get_vizColumnDoNotUse: function tab_VizDataField$get_vizColumnDoNotUse() {
        return this._columnPresModel;
    },
    
    get__paneIndices: function tab_VizDataField$get__paneIndices() {
        return this._columnPresModel.paneIndices;
    },
    
    get__perPaneColumnIndices: function tab_VizDataField$get__perPaneColumnIndices() {
        return this._columnPresModel.columnIndices;
    },
    
    get__log: function tab_VizDataField$get__log() {
        return tab.Logger.lazyGetLogger(tab.VizDataField);
    },
    
    isKnownAs: function tab_VizDataField$isKnownAs(captionOrFieldName) {
        return tab.VizDataUtils.isNameOfColumn(this._columnPresModel, captionOrFieldName);
    },
    
    isTupleIdValid: function tab_VizDataField$isTupleIdValid(tupleId) {
        for (var ii = 0; ii < this._columnPresModel.paneIndices.length; ++ii) {
            var paneIndex = this._columnPresModel.paneIndices[ii];
            var tupleIndex = this._getTupleIndexForPane(tupleId, paneIndex);
            if (ss.isValue(tupleIndex)) {
                return true;
            }
        }
        return false;
    },
    
    _computeTupleIdDictionaryForPane: function tab_VizDataField$_computeTupleIdDictionaryForPane(paneIndex) {
        var tupleIdColumnWithinPane = this._getColumnWithinPane(paneIndex, 0);
        var tupleIdDictionary = {};
        var index = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(tupleIdColumnWithinPane.tupleIds);
        while ($enum1.moveNext()) {
            var tid = $enum1.current;
            tupleIdDictionary[tid] = index++;
        }
        this._tupleIdLookupForPane[paneIndex] = tupleIdDictionary;
    },
    
    _getTupleIndexForPane: function tab_VizDataField$_getTupleIndexForPane(tupleId, paneIndex) {
        if (!Object.keyExists(this._tupleIdLookupForPane, paneIndex)) {
            this._computeTupleIdDictionaryForPane(paneIndex);
        }
        return this._tupleIdLookupForPane[paneIndex][tupleId];
    },
    
    getAliasIndex: function tab_VizDataField$getAliasIndex(tupleId) {
        var aliasIndex = null;
        if (!this.get_hasAliases()) {
            return aliasIndex;
        }
        for (var ii = 0; ii < this._columnPresModel.paneIndices.length; ++ii) {
            var paneIndex = this._columnPresModel.paneIndices[ii];
            var tupleIndex = this._getTupleIndexForPane(tupleId, paneIndex);
            if (ss.isValue(tupleIndex)) {
                var columnWithinPaneIndex = this._columnPresModel.columnIndices[ii];
                var columnWithinPane = this._getColumnWithinPane(paneIndex, columnWithinPaneIndex);
                aliasIndex = columnWithinPane.aliasIndices[tupleIndex];
                break;
            }
        }
        return aliasIndex;
    },
    
    getDataValueIndex: function tab_VizDataField$getDataValueIndex(tupleId) {
        var dataValueIndex = null;
        if (this.get_hasDataValues()) {
            for (var ii = 0; ii < this._columnPresModel.paneIndices.length; ++ii) {
                var paneIndex = this._columnPresModel.paneIndices[ii];
                var tupleIndex = this._getTupleIndexForPane(tupleId, paneIndex);
                if (ss.isValue(tupleIndex)) {
                    var columnWithinPaneIndex = this._columnPresModel.columnIndices[ii];
                    var columnWithinPane = this._getColumnWithinPane(paneIndex, columnWithinPaneIndex);
                    dataValueIndex = columnWithinPane.valueIndices[tupleIndex];
                    break;
                }
            }
        }
        return dataValueIndex;
    },
    
    getPaneDescriptorKey: function tab_VizDataField$getPaneDescriptorKey(tupleId) {
        var key = null;
        for (var ii = 0; ii < this._columnPresModel.paneIndices.length; ++ii) {
            var paneIndex = this.get__paneIndices()[ii];
            var tupleIndex = this._getTupleIndexForPane(tupleId, paneIndex);
            if (ss.isValue(tupleIndex)) {
                var paneColumn = this._getPaneColumn(paneIndex);
                key = paneColumn.paneDescriptor.paneDescrKey;
                break;
            }
        }
        return key;
    },
    
    _getPaneColumn: function tab_VizDataField$_getPaneColumn(paneColIndex) {
        var result = null;
        if (this._paneColumnsPresModel.length > paneColIndex) {
            result = this._paneColumnsPresModel[paneColIndex];
        }
        else {
            this.get__log().warn('GetPaneColumn: paneIndex is out of bound.');
        }
        return result;
    },
    
    _getColumnWithinPane: function tab_VizDataField$_getColumnWithinPane(paneColIndex, columnWithinPaneIndex) {
        var result = null;
        var paneColumn = this._getPaneColumn(paneColIndex);
        if (ss.isValue(paneColumn)) {
            if (paneColumn.vizPaneColumns.length > columnWithinPaneIndex) {
                result = paneColumn.vizPaneColumns[columnWithinPaneIndex];
            }
            else {
                this.get__log().warn('GetColumnWithinPane: columnWithinPaneIndex is out of bound.');
            }
        }
        return result;
    },
    
    _computeHasDataValues: function tab_VizDataField$_computeHasDataValues() {
        var hasDataValues = false;
        if (this.get__paneIndices().length > 0) {
            var paneIndex = this.get__paneIndices()[0];
            var columnWithinPaneIndex = this.get__perPaneColumnIndices()[0];
            var columnWithinPane = this._getColumnWithinPane(paneIndex, columnWithinPaneIndex);
            if (ss.isValue(columnWithinPane)) {
                hasDataValues = ss.isValue(columnWithinPane.valueIndices) && columnWithinPane.valueIndices.length > 0;
            }
        }
        return hasDataValues;
    },
    
    _computeHasAliases: function tab_VizDataField$_computeHasAliases() {
        var hasAliases = false;
        if (this.get__paneIndices().length > 0) {
            var paneIndex = this.get__paneIndices()[0];
            var columnWithinPaneIndex = this.get__perPaneColumnIndices()[0];
            var columnWithinPane = this._getColumnWithinPane(paneIndex, columnWithinPaneIndex);
            if (ss.isValue(columnWithinPane)) {
                hasAliases = ss.isValue(columnWithinPane.aliasIndices) && columnWithinPane.aliasIndices.length > 0;
            }
        }
        return hasAliases;
    },
    
    _validatePresModels: function tab_VizDataField$_validatePresModels() {
        ss.Debug.assert(this.get__paneIndices().length === this.get__perPaneColumnIndices().length, '[VizDataField Validation Error] Different number of pane indices and column (within pane) indices.');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizDataLookup

tab.VizDataLookup = function tab_VizDataLookup() {
}
tab.VizDataLookup.lookupDisplayValue = function tab_VizDataLookup$lookupDisplayValue(tupleId, dataField, dataDictionary) {
    if (!dataField.isTupleIdValid(tupleId)) {
        var logMsg = String.format('Failed trying to look up the display value for tuple id "{0}" because it is invalid for field "{1}"', tupleId, dataField.get_fieldCaption());
        tab.Log.get(tab.VizDataUtils).debug(logMsg);
        return null;
    }
    var displayValue = null;
    if (dataField.get_hasAliases()) {
        displayValue = tab.VizDataLookup.lookupAlias(tupleId, dataField, dataDictionary);
    }
    if (ss.isNull(displayValue) && dataField.get_hasDataValues()) {
        displayValue = tab.VizDataLookup._lookupFormattedDataValue(tupleId, dataField, dataDictionary);
    }
    if (ss.isNull(displayValue)) {
        var logMsg = String.format('Failed trying to look up the display value for tuple id "{0}" and field "{1}"', tupleId, dataField.get_fieldCaption());
        tab.Log.get(tab.VizDataUtils).debug(logMsg);
        return null;
    }
    return displayValue;
}
tab.VizDataLookup.lookupAlias = function tab_VizDataLookup$lookupAlias(tupleId, dataField, dataDictionary) {
    if (!dataField.isTupleIdValid(tupleId)) {
        var logMsg = String.format('Failed trying to look up the alias for tuple id "{0}" because it is invalid for field "{1}"', tupleId, dataField.get_fieldCaption());
        tab.Log.get(tab.VizDataUtils).debug(logMsg);
        return null;
    }
    var aliasIndex = dataField.getAliasIndex(tupleId);
    return tab.VizDataLookup.lookupAliasFromIndex(aliasIndex, dataField, dataDictionary);
}
tab.VizDataLookup.lookupAliasFromIndex = function tab_VizDataLookup$lookupAliasFromIndex(aliasIndex, dataField, dataDictionary) {
    var alias = null;
    if (ss.isValue(aliasIndex)) {
        if (aliasIndex >= 0) {
            var dataValueIndex = aliasIndex;
            alias = tab.VizDataLookup._lookupFormattedDataValueFromIndex(dataValueIndex, dataField, dataDictionary);
        }
        else {
            aliasIndex = -aliasIndex - 1;
            alias = dataDictionary.getRawValue('cstring', aliasIndex);
            if (tableau.format.isSpecialValue(alias)) {
                alias = tableau.format.formatSpecial(alias, dataField.get_specialValuesOverride());
            }
        }
    }
    return alias;
}
tab.VizDataLookup.lookupRawDataValue = function tab_VizDataLookup$lookupRawDataValue(tupleId, dataField, dataDictionary) {
    var dataValueIndex = dataField.getDataValueIndex(tupleId);
    return tab.VizDataLookup.lookupRawDataValueFromIndex(dataValueIndex, dataField, dataDictionary);
}
tab.VizDataLookup.lookupRawDataValueFromIndex = function tab_VizDataLookup$lookupRawDataValueFromIndex(dataValueIndex, dataField, dataDictionary) {
    var dataValue = null;
    if (ss.isValue(dataValueIndex)) {
        var dt;
        var index;
        if (dataValueIndex >= 0) {
            dt = dataField.get_dataType();
            index = dataValueIndex;
        }
        else {
            index = -dataValueIndex - 1;
            dt = 'cstring';
        }
        var rawValue = dataDictionary.getRawValue(dt, index);
        if (ss.isValue(rawValue)) {
            dataValue = dataDictionary.getRawValue(dt, index).toString();
        }
    }
    return dataValue;
}
tab.VizDataLookup._lookupFormattedDataValue = function tab_VizDataLookup$_lookupFormattedDataValue(tupleId, dataField, dataDictionary) {
    var dataValueIndex = dataField.getDataValueIndex(tupleId);
    return tab.VizDataLookup._lookupFormattedDataValueFromIndex(dataValueIndex, dataField, dataDictionary);
}
tab.VizDataLookup._lookupFormattedDataValueFromIndex = function tab_VizDataLookup$_lookupFormattedDataValueFromIndex(dataValueIndex, dataField, dataDictionary) {
    var dataValue = null;
    var rawDataValue = tab.VizDataLookup.lookupRawDataValueFromIndex(dataValueIndex, dataField, dataDictionary);
    if (ss.isValue(rawDataValue)) {
        if (tableau.format.isSpecialValue(rawDataValue)) {
            dataValue = tableau.format.formatSpecial(rawDataValue, dataField.get_specialValuesOverride());
        }
        else {
            dataValue = tableau.format.formatString(rawDataValue, dataField.get_vizColumnDoNotUse());
        }
    }
    return dataValue;
}
tab.VizDataLookup.reverseLookupAlias = function tab_VizDataLookup$reverseLookupAlias(targetAlias, vizData, column, dataDictionary) {
    var targetAliasIndex = null;
    if (column.get_hasAliases()) {
        vizData.forEachTupleId(function(tupleId) {
            var alias = tab.VizDataLookup.lookupAlias(tupleId, column, dataDictionary);
            if (String.equals(alias, targetAlias, false)) {
                targetAliasIndex = column.getAliasIndex(tupleId);
                return false;
            }
            return true;
        });
    }
    return targetAliasIndex;
}
tab.VizDataLookup.isSpecial = function tab_VizDataLookup$isSpecial(tupleId, dataField, dataDictionary, specialType) {
    var rawDataValue = tab.VizDataLookup.lookupRawDataValue(tupleId, dataField, dataDictionary);
    if (ss.isValue(rawDataValue)) {
        return (ss.isValue(specialType)) ? (rawDataValue === specialType) : tableau.format.isSpecialValue(rawDataValue);
    }
    var aliasIndex = dataField.getAliasIndex(tupleId);
    if (ss.isValue(aliasIndex) && aliasIndex >= 0) {
        var dataValueIndex = aliasIndex;
        var rawDataValue = tab.VizDataLookup.lookupRawDataValueFromIndex(dataValueIndex, dataField, dataDictionary);
        if (ss.isValue(rawDataValue)) {
            return (ss.isValue(specialType)) ? (rawDataValue === specialType) : tableau.format.isSpecialValue(rawDataValue);
        }
    }
    return false;
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizDataUtils

tab.VizDataUtils = function tab_VizDataUtils() {
}
tab.VizDataUtils.constructUrl = function tab_VizDataUtils$constructUrl(dataDictionary, linkInfo, source, tupleIds, sheetId) {
    var getStringForColumn = function(vizDataField, filterType, matchAliases) {
        if (String.isNullOrEmpty(filterType)) {
            if (ss.isValue(tupleIds)) {
                return tab.VizDataUtils._getUrlStringForColumn(dataDictionary, vizDataField, tupleIds, 1, linkInfo);
            }
            tab.Logger.lazyGetLogger(tab.VizDataUtils).warn('No tuples are specified for ConstructUrl!');
            return null;
        }
        var filterValues = tab.VizDataUtils._getFilterValues(dataDictionary, vizDataField, filterType);
        if (linkInfo.shouldUrlEscape) {
            filterValues = encodeURIComponent(filterValues);
        }
        return filterValues;
    };
    var result = tab.VizDataUtils.decodeAndReplaceData(linkInfo.url, '<', '>', source, getStringForColumn);
    if (!result.second) {
        return null;
    }
    return result.first;
}
tab.VizDataUtils.constructUrlForFilterActionFromTargetURL = function tab_VizDataUtils$constructUrlForFilterActionFromTargetURL(dataDictionary, targetURL, source, tupleIds) {
    var getStringForColumn = function(vizDataField, filterType, matchAliases) {
        return tab.VizDataUtils._getTargetUrlStringForColumn(dataDictionary, vizDataField, tupleIds, matchAliases, ',');
    };
    var result = tab.VizDataUtils.decodeAndReplaceData(targetURL, '<', '>', source, getStringForColumn);
    return result.first;
}
tab.VizDataUtils.constructUrlFromString = function tab_VizDataUtils$constructUrlFromString(dataDictionary, linkDisplayStr, source, tupleIds, sheetId) {
    var getStringForColumn = function(vizDataField, filterType, matchAliases) {
        if (String.isNullOrEmpty(filterType)) {
            return tab.VizDataUtils._getHtmlStringForColumn(dataDictionary, vizDataField, tupleIds, 1);
        }
        else {
            return tab.VizDataUtils._getFilterValues(dataDictionary, vizDataField, filterType);
        }
    };
    var result = tab.VizDataUtils.decodeAndReplaceData(linkDisplayStr, '<', '>', source, getStringForColumn);
    return result.first;
}
tab.VizDataUtils.constructHtml = function tab_VizDataUtils$constructHtml(dataDictionary, html, source, tupleIds) {
    var getStringForColumn = function(vizDataField, filterType, matchAliases) {
        return tab.VizDataUtils._getHtmlStringForColumn(dataDictionary, vizDataField, tupleIds, 0);
    };
    var result = tab.VizDataUtils.decodeAndReplaceData(html, '&lt;', '&gt;', source, getStringForColumn);
    var ubertipHtmlObj = $(result.first);
    var invalidNodes = [];
    tab.VizDataUtils._getNodesOfInvalidFields(ubertipHtmlObj, invalidNodes);
    tab.VizDataUtils._deleteLines(ubertipHtmlObj, invalidNodes);
    if (tab.MiscUtil.isNullOrEmpty(ubertipHtmlObj.text())) {
        return '';
    }
    return ubertipHtmlObj.wrap('<div>').parent().html();
}
tab.VizDataUtils.decodeAndReplaceData = function tab_VizDataUtils$decodeAndReplaceData(original, open, close, vizDataModel, getStringForColumn) {
    var replaceSuccess = true;
    var doubleOpenEscaped = tab.VizDataUtils._getRandomNotIn(original, 'escaped_open_tag');
    var doubleCloseEscaped = tab.VizDataUtils._getRandomNotIn(original, 'escaped_close_tag');
    var escapedOpenAndCloseReplaced = (original).replaceAll(open + open, doubleOpenEscaped).replaceAll(close + close, doubleCloseEscaped);
    var urlParts = escapedOpenAndCloseReplaced.split(open);
    var filterType = null;
    var sb = new ss.StringBuilder(urlParts[0]);
    for (var ii = 1; ii < urlParts.length; ++ii) {
        var urlPart = urlParts[ii];
        ss.Debug.assert(!String.isNullOrEmpty(urlPart), 'There is an open tag without a matching close tag.');
        var urlClosingParts = urlPart.split(close);
        ss.Debug.assert(urlClosingParts.length === 2, "There must be exactly 1 closing '>' to match the open '<'");
        var fieldCaption = urlClosingParts[0].replaceAll(doubleOpenEscaped, open).replaceAll(doubleCloseEscaped, close).htmlDecode();
        var urlClosingPart = urlClosingParts[1];
        var modifierOp;
        var useAlias = true;
        var lastTilde = fieldCaption.lastIndexOf('~');
        var lastBrace = fieldCaption.lastIndexOf(']');
        if (lastTilde >= 0 && (lastBrace === -1 || lastBrace < lastTilde)) {
            modifierOp = fieldCaption.substr(lastTilde);
            fieldCaption = fieldCaption.substr(0, lastTilde);
            if (modifierOp === '~na') {
                useAlias = false;
            }
        }
        if (tab.VizDataUtils._useFilterValues(fieldCaption)) {
            var index = fieldCaption.indexOf('(');
            filterType = fieldCaption.substring(0, index);
            fieldCaption = fieldCaption.substring(index + 1, fieldCaption.length - 1);
        }
        var bracketStart = fieldCaption.indexOf('[');
        var bracketEnd = fieldCaption.lastIndexOf(']');
        if (bracketStart >= 0 && bracketStart < bracketEnd) {
            fieldCaption = fieldCaption.substring(bracketStart + 1, bracketEnd);
        }
        if (fieldCaption.startsWith('Parameters.')) {
            return new ss.Tuple('', false);
        }
        var vizDataField = vizDataModel.getVizDataField(fieldCaption);
        if (ss.isNullOrUndefined(vizDataField)) {
            return new ss.Tuple('', false);
        }
        var replacedDataString = getStringForColumn(vizDataField, filterType, useAlias);
        if (ss.isNullOrUndefined(replacedDataString)) {
            replaceSuccess = false;
        }
        else {
            sb.append(replacedDataString);
        }
        sb.append(urlClosingPart);
    }
    var resultString = sb.toString().replaceAll(doubleOpenEscaped, open).replaceAll(doubleCloseEscaped, close);
    return new ss.Tuple(resultString, replaceSuccess);
}
tab.VizDataUtils.hasTupleWithNonTotalValue = function tab_VizDataUtils$hasTupleWithNonTotalValue(vizData, dataDictionary, effectiveTupleIds) {
    var $enum1 = ss.IEnumerator.getEnumerator(effectiveTupleIds);
    while ($enum1.moveNext()) {
        var tupleId = $enum1.current;
        var tupleHasTotal = false;
        vizData.forEachVizDataField(function(vizColumn, colIndex) {
            if (vizColumn.get_role() === 'dimension') {
                if (tab.VizDataLookup.isSpecial(tupleId, vizColumn, dataDictionary, tableau.format.specialAll)) {
                    tupleHasTotal = true;
                    return false;
                }
            }
            return true;
        });
        if (!tupleHasTotal) {
            return true;
        }
    }
    return false;
}
tab.VizDataUtils.isNameOfColumn = function tab_VizDataUtils$isNameOfColumn(column, captionOrFieldName) {
    var escapedCaptionOrFieldName = tab.VizDataUtils._stripNewlines(captionOrFieldName);
    var escapedFieldCaption = tab.VizDataUtils._stripNewlines(column.fieldCaption);
    var escapedFieldName = tab.VizDataUtils._stripNewlines(column.fn);
    var escapedDisAggFieldName = tab.VizDataUtils._stripNewlines(column.fnDisagg);
    var escapedLocalBaseColumnName = tab.VizDataUtils._stripNewlines(column.localBaseColumnName);
    return escapedFieldCaption === escapedCaptionOrFieldName || escapedFieldName === escapedCaptionOrFieldName || escapedDisAggFieldName === escapedCaptionOrFieldName || escapedLocalBaseColumnName === '[' + escapedCaptionOrFieldName + ']' || escapedFieldName === '[' + escapedCaptionOrFieldName + ']';
}
tab.VizDataUtils._getRandomNotIn = function tab_VizDataUtils$_getRandomNotIn(input, prefix) {
    var result = prefix;
    while (input.indexOf(result) > -1) {
        result += parseInt((Math.random() * 10000));
    }
    return result;
}
tab.VizDataUtils._getNodesOfInvalidFields = function tab_VizDataUtils$_getNodesOfInvalidFields(root, invalidNodes) {
    var textOfThisNodeOnly = root.clone().children().remove().end().text();
    if (textOfThisNodeOnly.indexOf('~~~???~~~') !== -1) {
        invalidNodes.add(root);
    }
    var $enum1 = ss.IEnumerator.getEnumerator(root.children().get());
    while ($enum1.moveNext()) {
        var e = $enum1.current;
        tab.VizDataUtils._getNodesOfInvalidFields($(e), invalidNodes);
    }
}
tab.VizDataUtils._deleteLines = function tab_VizDataUtils$_deleteLines(ubertip, invalidNodes) {
    var $enum1 = ss.IEnumerator.getEnumerator(invalidNodes);
    while ($enum1.moveNext()) {
        var invalid = $enum1.current;
        var tableRow = tab.VizDataUtils._getParentWithTag(ubertip, invalid, 'tr');
        if (ss.isValue(tableRow)) {
            tableRow.remove();
        }
        else {
            var div = tab.VizDataUtils._getParentWithTag(ubertip, invalid, 'div');
            if (ss.isValue(div)) {
                div.remove();
            }
            else {
                invalid.remove();
            }
        }
    }
}
tab.VizDataUtils._getParentWithTag = function tab_VizDataUtils$_getParentWithTag(root, someChild, tag) {
    var iterator = someChild;
    if (ss.isValue(root) && ss.isValue(someChild) && root.find(someChild).length === 1) {
        while (iterator[0] !== root[0]) {
            if (iterator[0].tagName.toLowerCase() === tag) {
                return iterator;
            }
            iterator = iterator.parent();
        }
    }
    return null;
}
tab.VizDataUtils._getUrlStringForColumn = function tab_VizDataUtils$_getUrlStringForColumn(dataDictionary, vizDataField, tupleIds, escapeFlag, linkInfo) {
    var dataValues = [];
    for (var ii = 0; ii < tupleIds.length; ++ii) {
        var newDataValue = tab.VizDataLookup.lookupAlias(tupleIds[ii], vizDataField, dataDictionary);
        if (linkInfo.shouldUrlEscape) {
            newDataValue = encodeURIComponent(newDataValue);
        }
        if (tupleIds.length > 1 && newDataValue.indexOf(linkInfo.delimiter) >= 0) {
            newDataValue = newDataValue.replaceAll(linkInfo.delimiter, linkInfo.escapeString + linkInfo.delimiter);
        }
        dataValues.add(newDataValue);
    }
    if (dataValues.length > 1 && ss.isNullOrUndefined(linkInfo.delimiter)) {
        return null;
    }
    var toRet = dataValues.join(linkInfo.delimiter);
    if (!escapeFlag) {
        toRet = tableau.format.escapeHTML(toRet);
    }
    return toRet;
}
tab.VizDataUtils._getTargetUrlStringForColumn = function tab_VizDataUtils$_getTargetUrlStringForColumn(dataDictionary, vizDataField, tupleIds, useAlias, delimiter) {
    var values = [];
    var $enum1 = ss.IEnumerator.getEnumerator(tupleIds);
    while ($enum1.moveNext()) {
        var tupleId = $enum1.current;
        var newDataValue = '';
        if (useAlias) {
            newDataValue = tab.VizDataLookup.lookupAlias(tupleId, vizDataField, dataDictionary);
        }
        else {
            newDataValue = tab.VizDataLookup.lookupRawDataValue(tupleId, vizDataField, dataDictionary);
        }
        values.add(newDataValue);
    }
    return encodeURIComponent(values.join(delimiter));
}
tab.VizDataUtils._getHtmlStringForColumn = function tab_VizDataUtils$_getHtmlStringForColumn(dataDictionary, vizDataField, tupleIds, escapeFlag) {
    var replacedDataString;
    if (tupleIds.length > 1) {
        if (!vizDataField.get_hasDataValues()) {
            return '...';
        }
        var dataValues = new Array(tupleIds.length);
        for (var ii = 0; ii < tupleIds.length; ++ii) {
            var dataValue = tab.VizDataLookup.lookupRawDataValue(tupleIds[ii], vizDataField, dataDictionary);
            if (ss.isNull(dataValue) || tableau.format.isSpecialValue(dataValue)) {
                dataValue = '0';
            }
            else if (ss.isUndefined(dataValue) || !dataValue.length) {
                return '...';
            }
            dataValues[ii] = dataValue;
        }
        var sum = 0;
        for (var ii = 0; ii < dataValues.length; ++ii) {
            sum += parseFloat(dataValues[ii]);
        }
        replacedDataString = tableau.format.formatString(sum.toString(), vizDataField.get_vizColumnDoNotUse());
    }
    else if (tupleIds.length === 1) {
        var alias = tab.VizDataLookup.lookupDisplayValue(tupleIds[0], vizDataField, dataDictionary);
        if (ss.isNullOrUndefined(alias)) {
            return '~~~???~~~';
        }
        replacedDataString = alias;
    }
    else {
        tab.Logger.lazyGetLogger(tab.VizDataUtils).warn('No tuples specified. GetHtmlStringForColumn expects one or more tuples.');
        return '';
    }
    if (!escapeFlag) {
        return tableau.format.escapeHTML(replacedDataString);
    }
    else {
        return replacedDataString;
    }
}
tab.VizDataUtils._useFilterValues = function tab_VizDataUtils$_useFilterValues(fieldCaption) {
    if (fieldCaption.startsWith('FILTERMAX(')) {
        return true;
    }
    else if (fieldCaption.startsWith('FILTERMIN(')) {
        return true;
    }
    else if (fieldCaption.startsWith('FILTERVALUES(')) {
        return true;
    }
    return false;
}
tab.VizDataUtils._getFilterValues = function tab_VizDataUtils$_getFilterValues(dataDictionary, vizDataField, filterType) {
    var toRet = new String();
    if (ss.isValue(vizDataField) && ss.isValue(vizDataField.get_filterContext())) {
        var filterContext = vizDataField.get_filterContext();
        var filterValIndexes = null;
        if (filterType === 'FILTERMAX') {
            filterValIndexes = filterContext.filterMaxIndices;
        }
        else if (filterType === 'FILTERMIN') {
            filterValIndexes = filterContext.filterMinIndices;
        }
        else if (filterType === 'FILTERVALUES') {
            filterValIndexes = filterContext.filterValueIndices;
        }
        if (!tab.MiscUtil.isNullOrEmpty(filterValIndexes)) {
            var filterTexts = [];
            var $enum1 = ss.IEnumerator.getEnumerator(filterValIndexes);
            while ($enum1.moveNext()) {
                var valIndex = $enum1.current;
                var dataValue = tab.VizDataLookup.lookupRawDataValueFromIndex(valIndex, vizDataField, dataDictionary);
                filterTexts.push(dataValue);
            }
            toRet = filterTexts.join(',');
        }
    }
    return toRet;
}
tab.VizDataUtils._stripNewlines = function tab_VizDataUtils$_stripNewlines(str) {
    return (ss.isValue(str)) ? str.replaceAll('\n', '').replaceAll('\r', '') : null;
}


////////////////////////////////////////////////////////////////////////////////
// tab.RangeTransform

tab.RangeTransform = function tab_RangeTransform() {
}


////////////////////////////////////////////////////////////////////////////////
// tab.LinearRangeTransform

tab.LinearRangeTransform = function tab_LinearRangeTransform(min, max) {
    tab.LinearRangeTransform.initializeBase(this);
    if (min <= max) {
        this._min$1 = min;
        this._max$1 = max;
    }
    else {
        this._min$1 = max;
        this._max$1 = min;
    }
}
tab.LinearRangeTransform.prototype = {
    _min$1: 0,
    _max$1: 0,
    
    fractionToValue: function tab_LinearRangeTransform$fractionToValue(fract) {
        return this._min$1 + (fract * (this._max$1 - this._min$1));
    },
    
    valueToFraction: function tab_LinearRangeTransform$valueToFraction(value) {
        return (this._min$1 === this._max$1) ? 0 : (value - this._min$1) / (this._max$1 - this._min$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AcceleratingRangeTransform

tab.AcceleratingRangeTransform = function tab_AcceleratingRangeTransform(min, max, inflectionFrac1, inflectionVal1, inflectionFrac2, inflectionVal2) {
    tab.AcceleratingRangeTransform.initializeBase(this);
    if (ss.isNullOrUndefined(inflectionFrac2) && ss.isValue(inflectionVal2)) {
        inflectionFrac2 = inflectionFrac1;
        inflectionVal2 = inflectionVal1;
    }
    ss.Debug.assert(0 < inflectionFrac1 && inflectionFrac1 <= inflectionFrac2 && inflectionFrac1 < 1, 'Inflections must be provided in order');
    ss.Debug.assert(min < inflectionVal1 && inflectionVal1 <= inflectionVal2 && inflectionVal1 < max, 'Inflections must be provided in order');
    this._min$1 = min;
    this._inflectionFrac1$1 = inflectionFrac1;
    this._inflectionVal1$1 = inflectionVal1;
    this._inflectionFrac2$1 = inflectionFrac2;
    this._inflectionVal2$1 = inflectionVal2;
    var m = max;
    var p = inflectionFrac2;
    var t = inflectionVal2;
    var s = inflectionVal2 / inflectionFrac2;
    this._a$1 = (t - (s * p) - m + s) / (-(p * p) + (2 * p) - 1);
    this._b$1 = s - (2 * this._a$1 * p);
    this._c$1 = m - s + (this._a$1 * ((2 * p) - 1));
    ss.Debug.assert(!!this._a$1, 'The resulting equation is not quadratic');
}
tab.AcceleratingRangeTransform.prototype = {
    _min$1: 0,
    _inflectionFrac1$1: 0,
    _inflectionVal1$1: 0,
    _inflectionFrac2$1: 0,
    _inflectionVal2$1: 0,
    _a$1: 0,
    _b$1: 0,
    _c$1: 0,
    
    fractionToValue: function tab_AcceleratingRangeTransform$fractionToValue(fract) {
        if (fract <= this._inflectionFrac1$1) {
            return this._min$1 + (fract * (this._inflectionVal1$1 - this._min$1) / this._inflectionFrac1$1);
        }
        if (fract <= this._inflectionFrac2$1) {
            var m = (this._inflectionVal2$1 - this._inflectionVal1$1) / (this._inflectionFrac2$1 - this._inflectionFrac1$1);
            var b = this._inflectionVal1$1 - (m * this._inflectionFrac1$1);
            return (fract * m) + b;
        }
        return (this._a$1 * fract * fract) + (this._b$1 * fract) + this._c$1;
    },
    
    valueToFraction: function tab_AcceleratingRangeTransform$valueToFraction(value) {
        if (value <= this._inflectionVal1$1) {
            return this._inflectionFrac1$1 * (value - this._min$1) / (this._inflectionVal1$1 - this._min$1);
        }
        if (value <= this._inflectionVal2$1) {
            var m = (this._inflectionVal2$1 - this._inflectionVal1$1) / (this._inflectionFrac2$1 - this._inflectionFrac1$1);
            var b = this._inflectionVal1$1 - (m * this._inflectionFrac1$1);
            return (value - b) / m;
        }
        var root = Math.sqrt((this._b$1 * this._b$1) - (4 * this._a$1 * (this._c$1 - value)));
        return (-this._b$1 + root) / (2 * this._a$1);
    }
}


tab.TabResources.registerClass('tab.TabResources');
tab.VizUriModel.registerClass('tab.VizUriModel');
tab.RepoPathObject.registerClass('tab.RepoPathObject');
tab.UriPathStripper.registerClass('tab.UriPathStripper');
tab.ApiClientCommands.registerClass('tab.ApiClientCommands');
tab.ToolbarClientCommands.registerClass('tab.ToolbarClientCommands');
tab.StoryClientCommands.registerClass('tab.StoryClientCommands');
tab.UberTipClientCommands.registerClass('tab.UberTipClientCommands');
tab.ClientCommand.registerClass('tab.ClientCommand');
tab._getUberTipClientCommand.registerClass('tab._getUberTipClientCommand', tab.ClientCommand);
tab.FilterClientCommands.registerClass('tab.FilterClientCommands');
tab.SheetClientCommands.registerClass('tab.SheetClientCommands');
tab.VizClientCommands.registerClass('tab.VizClientCommands');
tab.VizRegionRectWrapper.registerClass('tab.VizRegionRectWrapper');
tab._baseSessionCommandHandler.registerClass('tab._baseSessionCommandHandler', null, tab.IRemoteCommandHandler);
tab.LegacyClientCommand.registerClass('tab.LegacyClientCommand', tab.ClientCommand);
tab.CommandRecord.registerClass('tab.CommandRecord');
tab.CommandPermission.registerClass('tab.CommandPermission');
tab.CommandSerializer.registerClass('tab.CommandSerializer');
tab.shell.registerClass('tab.shell');
tab.CommandsPresModelWrapper.registerClass('tab.CommandsPresModelWrapper');
tab.CommandItemWrapper.registerClass('tab.CommandItemWrapper');
tab._commandThrottler.registerClass('tab._commandThrottler');
tab.CompositeClientCommand.registerClass('tab.CompositeClientCommand', tab.ClientCommand);
tab.DeferLayoutImpl.registerClass('tab.DeferLayoutImpl', null, tab.IDeferLayout);
tab.EventMap.registerClass('tab.EventMap');
tab._localClientCommand.registerClass('tab._localClientCommand', tab.ClientCommand);
tab.PermissionManager.registerClass('tab.PermissionManager');
tab.PresentationModel.registerClass('tab.PresentationModel');
tab.PresModelPathItem.registerClass('tab.PresModelPathItem');
tab.PresModelPath.registerClass('tab.PresModelPath');
tab.SimpleCommandsPresModelWrapper.registerClass('tab.SimpleCommandsPresModelWrapper');
tab.UbertipSerializer.registerClass('tab.UbertipSerializer');
tab.CommandRedirectRegistry.registerClass('tab.CommandRedirectRegistry');
tab.Model.registerClass('tab.Model');
tab.AnalyticsPaneModel.registerClass('tab.AnalyticsPaneModel', tab.Model);
tab.CalculationAutoCompleteItemModel.registerClass('tab.CalculationAutoCompleteItemModel', tab.Model);
tab.CalculationAutoCompleteModel.registerClass('tab.CalculationAutoCompleteModel', tab.Model);
tab.CalculationFunctionListModel.registerClass('tab.CalculationFunctionListModel', tab.Model);
tab.CalculationModel.registerClass('tab.CalculationModel', tab.Model);
tab.FilterModel.registerClass('tab.FilterModel', tab.Model);
tab.CategoricalFilterModel.registerClass('tab.CategoricalFilterModel', tab.FilterModel);
tab.DataDictionaryModel.registerClass('tab.DataDictionaryModel', tab.Model);
tab.HierarchicalFilterModel.registerClass('tab.HierarchicalFilterModel', tab.FilterModel);
tab.MapServerModel.registerClass('tab.MapServerModel', tab.Model);
tab.QuantitativeFilterModel.registerClass('tab.QuantitativeFilterModel', tab.FilterModel);
tab.RelativeDateFilterModel.registerClass('tab.RelativeDateFilterModel', tab.FilterModel);
tab.CategoricalLegendModel.registerClass('tab.CategoricalLegendModel', tab.Model);
tab.ColorModel.registerClass('tab.ColorModel');
tab.QuickFilterDisplayModel.registerClass('tab.QuickFilterDisplayModel', tab.Model);
tab.ShelvesModel.registerClass('tab.ShelvesModel', tab.Model);
tab.ShelfListArrayModel.registerClass('tab.ShelfListArrayModel', tab.Model);
tab.StoryPointsModel.registerClass('tab.StoryPointsModel', tab.Model);
tab.ColorPaletteCollectionModel.registerClass('tab.ColorPaletteCollectionModel', tab.Model);
tab.FlipboardModel.registerClass('tab.FlipboardModel', tab.Model);
tab.QuantitativeColorLegendModel.registerClass('tab.QuantitativeColorLegendModel', tab.Model);
tab.StoryPointModel.registerClass('tab.StoryPointModel', tab.Model);
tab.FieldModel.registerClass('tab.FieldModel', tab.Model);
tab.FieldColumnModel.registerClass('tab.FieldColumnModel', tab.FieldModel);
tab.GroupModel.registerClass('tab.GroupModel', tab.FieldColumnModel);
tab.DrillPathModel.registerClass('tab.DrillPathModel', tab.FieldModel);
tab.CubeHierarchyModel.registerClass('tab.CubeHierarchyModel', tab.FieldModel);
tab.FolderModel.registerClass('tab.FolderModel', tab.FieldModel);
tab.CubeFolderModel.registerClass('tab.CubeFolderModel', tab.FieldModel);
tab.CubeDimensionModel.registerClass('tab.CubeDimensionModel', tab.FieldModel);
tab.RelationalTableModel.registerClass('tab.RelationalTableModel', tab.FieldModel);
tab.MultipleFieldsModel.registerClass('tab.MultipleFieldsModel', tab.FieldModel);
tab.FlipboardNavigatorModel.registerClass('tab.FlipboardNavigatorModel', tab.Model);
tab.ImageZoneModel.registerClass('tab.ImageZoneModel', tab.Model);
tab.ToolbarModel.registerClass('tab.ToolbarModel', tab.Model);
tab.WebZoneModel.registerClass('tab.WebZoneModel', tab.Model);
tab.LegacyLegendModel.registerClass('tab.LegacyLegendModel', tab.Model);
tab.CustomizedView.registerClass('tab.CustomizedView');
tab.ParameterCtrlModel.registerClass('tab.ParameterCtrlModel', tab.Model);
tab.PageModel.registerClass('tab.PageModel', tab.Model);
tab.ViewGeometryModel.registerClass('tab.ViewGeometryModel', tab.Model);
tab.SceneModel.registerClass('tab.SceneModel', tab.Model);
tab.ProjectModel.registerClass('tab.ProjectModel');
tab.Schedule.registerClass('tab.Schedule');
tab.SelectionsModel.registerClass('tab.SelectionsModel', tab.Model);
tab.SelectionsPresModel.registerClass('tab.SelectionsPresModel', null, tab.IPresentationModel);
tab.User.registerClass('tab.User');
tab.SortIndicatorsModel.registerClass('tab.SortIndicatorsModel', tab.Model);
tab.VisualListModel.registerClass('tab.VisualListModel', tab.Model);
tab.VizDataModel.registerClass('tab.VizDataModel', tab.Model);
tab.ZoneModel.registerClass('tab.ZoneModel', tab.Model);
tab.ZoneContentWrapperModel.registerClass('tab.ZoneContentWrapperModel', tab.Model);
tab.ShapeModel.registerClass('tab.ShapeModel');
tab.TextRegionModel.registerClass('tab.TextRegionModel', tab.Model);
tab.ZonesModel.registerClass('tab.ZonesModel', tab.Model);
tab.ExportServerCommands.registerClass('tab.ExportServerCommands');
tab.SessionServerCommands.registerClass('tab.SessionServerCommands');
tab.ToolbarServerCommands.registerClass('tab.ToolbarServerCommands');
tab.ParameterServerCommands.registerClass('tab.ParameterServerCommands');
tab.PageServerCommands.registerClass('tab.PageServerCommands');
tab.SaveServerCommands.registerClass('tab.SaveServerCommands');
tab.SortServerCommands.registerClass('tab.SortServerCommands');
tab.WorkgroupServerCommands.registerClass('tab.WorkgroupServerCommands');
tab.WorksheetServerCommands.registerClass('tab.WorksheetServerCommands');
tab.WorldUpdateServerCommands.registerClass('tab.WorldUpdateServerCommands');
tab.PaneClientCommands.registerClass('tab.PaneClientCommands');
tab.SchemaClientCommands.registerClass('tab.SchemaClientCommands');
tab.SelectionClientCommands.registerClass('tab.SelectionClientCommands');
tab.ShelfClientCommands.registerClass('tab.ShelfClientCommands');
tab._shelfDropClientCommand.registerClass('tab._shelfDropClientCommand', tab.ClientCommand);
tab.CommandController.registerClass('tab.CommandController');
tab._clientCommandQueue.registerClass('tab._clientCommandQueue');
tab._remoteClientCommand.registerClass('tab._remoteClientCommand', tab.ClientCommand);
tab.Transactor.registerClass('tab.Transactor');
tab.Transaction.registerClass('tab.Transaction');
tab._transactionItem.registerClass('tab._transactionItem');
tab.ApplicationModel.registerClass('tab.ApplicationModel', tab.Model);
tab.SelectionModel.registerClass('tab.SelectionModel', tab.Model);
tab.DataSourceModel.registerClass('tab.DataSourceModel', tab.Model);
tab.LayerEncodingModel.registerClass('tab.LayerEncodingModel', tab.Model);
tab.MarksCardModel.registerClass('tab.MarksCardModel', tab.Model);
tab.MarkSizeModel.registerClass('tab.MarkSizeModel', tab.Model, tab.IContinuousRangeModel);
tab.DataSchemaModel.registerClass('tab.DataSchemaModel', tab.Model);
tab.PillModel.registerClass('tab.PillModel', tab.Model);
tab.ShelfModel.registerClass('tab.ShelfModel', tab.Model);
tab.ShelfItemsArrayModel.registerClass('tab.ShelfItemsArrayModel', tab.Model);
tab.VisualModel.registerClass('tab.VisualModel', tab.Model);
tab.DashboardModel.registerClass('tab.DashboardModel', tab.Model);
tab.WorkbookModel.registerClass('tab.WorkbookModel', tab.Model);
tab.ServerCommands.registerClass('tab.ServerCommands');
tab.BaseSession.registerClass('tab.BaseSession');
tab.CustomizedViewSession.registerClass('tab.CustomizedViewSession');
tab.DojoCurrentState.registerClass('tab.DojoCurrentState');
tab.FailureHandler.registerClass('tab.FailureHandler');
tab.LayoutSession.registerClass('tab.LayoutSession', tab.BaseSession);
tab.SessionAjaxCallManager.registerClass('tab.SessionAjaxCallManager');
tab.SessionAjaxHandler.registerClass('tab.SessionAjaxHandler');
tab.SheetSession.registerClass('tab.SheetSession', tab.BaseSession);
tab.ViewSession.registerClass('tab.ViewSession', tab.SheetSession);
tab.WaitHandler.registerClass('tab.WaitHandler');
tab.BrushingComputer.registerClass('tab.BrushingComputer');
tab.CategoricalFilterData.registerClass('tab.CategoricalFilterData');
tab.Changelist.registerClass('tab.Changelist');
tab.RawChange.registerClass('tab.RawChange');
tab.CompiledChecklistChangelist.registerClass('tab.CompiledChecklistChangelist');
tab.CompiledRadiolistChangelist.registerClass('tab.CompiledRadiolistChangelist');
tab.CommandUtils.registerClass('tab.CommandUtils');
tab.ActionUtils.registerClass('tab.ActionUtils');
tab.InvalidationInfo.registerClass('tab.InvalidationInfo');
tab.LocalUbertipInfo.registerClass('tab.LocalUbertipInfo');
tab.ModelUtils.registerClass('tab.ModelUtils');
tab.QuantitativeFilterData.registerClass('tab.QuantitativeFilterData');
tab.ShapeManager.registerClass('tab.ShapeManager');
tab.WorkbookViewObjectUtils.registerClass('tab.WorkbookViewObjectUtils');
tab.XhrUtil.registerClass('tab.XhrUtil');
tab.UndoList.registerClass('tab.UndoList');
tab.CalculationCommands.registerClass('tab.CalculationCommands');
tab.CalcApplyResponse.registerClass('tab.CalcApplyResponse');
tab.CommandsModel.registerClass('tab.CommandsModel', tab.Model);
tab._brushingDataValues.registerClass('tab._brushingDataValues');
tab.SceneUtils.registerClass('tab.SceneUtils');
tab._brushingDataUtils.registerClass('tab._brushingDataUtils');
tab._dateTimePartIndexes.registerClass('tab._dateTimePartIndexes');
tab.SelectionUtils.registerClass('tab.SelectionUtils');
tab.StartupUtils.registerClass('tab.StartupUtils');
tab.SubscriptionDisposable.registerClass('tab.SubscriptionDisposable', null, ss.IDisposable);
tab.VizDataField.registerClass('tab.VizDataField');
tab.VizDataLookup.registerClass('tab.VizDataLookup');
tab.VizDataUtils.registerClass('tab.VizDataUtils');
tab.RangeTransform.registerClass('tab.RangeTransform');
tab.LinearRangeTransform.registerClass('tab.LinearRangeTransform', tab.RangeTransform);
tab.AcceleratingRangeTransform.registerClass('tab.AcceleratingRangeTransform', tab.RangeTransform);
tab.TabResources._resourceMap = {};
(function () {
    tab.TabResources._resourceMap['TQRC_DRILL_DOWN'] = 'others/DrillDown.png';
    tab.TabResources._resourceMap['TQRC_DRILL_UP'] = 'others/DrillUp.png';
    tab.TabResources._resourceMap['TQRC_EXCLUDE'] = 'others/Exclude.png';
    tab.TabResources._resourceMap['TQRC_EXCLUDE_2X'] = 'others/Exclude@2x.png';
    tab.TabResources._resourceMap['TQRC_KEEP_ONLY'] = 'others/KeepOnly.png';
    tab.TabResources._resourceMap['TQRC_KEEP_ONLY_2X'] = 'others/KeepOnly@2x.png';
    tab.TabResources._resourceMap['TQRC_MERGE'] = 'others/Merge.png';
    tab.TabResources._resourceMap['TQRC_MERGE_2X'] = 'others/Merge@2x.png';
    tab.TabResources._resourceMap['TQRC_VIEWDATA'] = 'others/ViewData.png';
    tab.TabResources._resourceMap['TQRC_SORT_ASCENDING'] = 'others/SortAscending.png';
    tab.TabResources._resourceMap['TQRC_SORT_ASCENDING_2X'] = 'others/SortAscending@2x.png';
    tab.TabResources._resourceMap['TQRC_SORT_DESCENDING'] = 'others/SortDescending.png';
    tab.TabResources._resourceMap['TQRC_SORT_DESCENDING_2X'] = 'others/SortDescending@2x.png';
    tab.TabResources._resourceMap['TQRC_SPLIT'] = 'others/Split.png';
    tab.TabResources._resourceMap['TQRC_SPLIT_2X'] = 'others/Split@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_BIN'] = 'showme/bin.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_BIN_2X'] = 'showme/bin@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_CLOSE'] = 'showme/close.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_CLOSE_2X'] = 'showme/close@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_DATE'] = 'showme/date.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_DATE_2X'] = 'showme/date@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_GEO'] = 'showme/geo.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_GEO_2X'] = 'showme/geo@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_GLOW'] = 'showme/glow.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_GLOW_2X'] = 'showme/glow@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_GRIPPER'] = 'showme/gripper.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_GRIPPER_2X'] = 'showme/gripper@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_SHOWME'] = 'showme/showme.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_SHOWME_2X'] = 'showme/showme@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_TITLE_BACKGROUND_HOVER'] = 'showme/title-background-hover.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_TITLE_BACKGROUND_HOVER_2X'] = 'showme/Title-background-hover@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_TITLE_BACKGROUND_REST'] = 'showme/title-background-rest.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_TITLE_BACKGROUND_REST_2X'] = 'showme/Title-background-rest@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARSTACKED'] = 'showme/enabled/BarStacked.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARSIDEBY'] = 'showme/enabled/BarSideBySide.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARHORIZONTAL'] = 'showme/enabled/BarHorizontal.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARLINE'] = 'showme/enabled/BarLine.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_CIRCLE'] = 'showme/enabled/Circle.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_CIRCLESIDEBYSIDE'] = 'showme/enabled/CircleSideBySide.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_GANTT'] = 'showme/enabled/Gantt.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_HEATMAP'] = 'showme/enabled/HeatMap.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_HISTOGRAM'] = 'showme/enabled/Histogram.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_LINEDIM'] = 'showme/enabled/LineDimension.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_LINEMEAS'] = 'showme/enabled/LineMeasure.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_AREAMEAS'] = 'showme/enabled/FilledLineContinuous.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_AREADIM'] = 'showme/enabled/FilledLineDiscrete.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_SCATSING'] = 'showme/enabled/ScatterSingle.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_TEXTTABLE'] = 'showme/enabled/TextTable.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_SPOTTABLE'] = 'showme/enabled/SpotTable.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_MAPS'] = 'showme/enabled/Maps.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_FILLEDMAPS'] = 'showme/enabled/FilledMaps.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_PIES'] = 'showme/enabled/Pies.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_DUALLINE'] = 'showme/enabled/DualAxis.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BULLET'] = 'showme/enabled/Bullet.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_TREEMAP'] = 'showme/enabled/Treemap.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BUBBLE'] = 'showme/enabled/Bubble.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BOXPLOT'] = 'showme/enabled/Boxplot.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARSTACKED_2X'] = 'showme/enabled/BarStacked@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARSIDEBY_2X'] = 'showme/enabled/BarSideBySide@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARHORIZONTAL_2X'] = 'showme/enabled/BarHorizontal@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BARLINE_2X'] = 'showme/enabled/BarLine@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_CIRCLE_2X'] = 'showme/enabled/Circle@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_CIRCLESIDEBYSIDE_2X'] = 'showme/enabled/CircleSideBySide@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_GANTT_2X'] = 'showme/enabled/Gantt@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_HEATMAP_2X'] = 'showme/enabled/HeatMap@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_HISTOGRAM_2X'] = 'showme/enabled/Histogram@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_LINEDIM_2X'] = 'showme/enabled/LineDimension@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_LINEMEAS_2X'] = 'showme/enabled/LineMeasure@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_AREAMEAS_2X'] = 'showme/enabled/FilledLineContinuous@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_AREADIM_2X'] = 'showme/enabled/FilledLineDiscrete@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_SCATSING_2X'] = 'showme/enabled/ScatterSingle@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_TEXTTABLE_2X'] = 'showme/enabled/TextTable@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_SPOTTABLE_2X'] = 'showme/enabled/SpotTable@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_MAPS_2X'] = 'showme/enabled/Maps@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_FILLEDMAPS_2X'] = 'showme/enabled/FilledMaps@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_PIES_2X'] = 'showme/enabled/Pies@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_DUALLINE_2X'] = 'showme/enabled/DualAxis@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BULLET_2X'] = 'showme/enabled/Bullet@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_TREEMAP_2X'] = 'showme/enabled/Treemap@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BUBBLE_2X'] = 'showme/enabled/Bubble@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_1_BOXPLOT_2X'] = 'showme/enabled/Boxplot@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARSTACKED'] = 'showme/disabled/BarStacked.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARSIDEBY'] = 'showme/disabled/BarSideBySide.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARHORIZONTAL'] = 'showme/disabled/BarHorizontal.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARLINE'] = 'showme/disabled/BarLine.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_CIRCLE'] = 'showme/disabled/Circle.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_CIRCLESIDEBYSIDE'] = 'showme/disabled/CircleSideBySide.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_GANTT'] = 'showme/disabled/Gantt.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_HEATMAP'] = 'showme/disabled/HeatMap.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_HISTOGRAM'] = 'showme/disabled/Histogram.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_LINEDIM'] = 'showme/disabled/LineDimension.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_LINEMEAS'] = 'showme/disabled/LineMeasure.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_AREAMEAS'] = 'showme/disabled/FilledLineContinuous.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_AREADIM'] = 'showme/disabled/FilledLineDiscrete.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_SCATSING'] = 'showme/disabled/ScatterSingle.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_TEXTTABLE'] = 'showme/disabled/TextTable.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_SPOTTABLE'] = 'showme/disabled/SpotTable.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_MAPS'] = 'showme/disabled/Maps.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_FILLEDMAPS'] = 'showme/disabled/FilledMaps.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_PIES'] = 'showme/disabled/Pies.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_DUALLINE'] = 'showme/disabled/DualAxis.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BULLET'] = 'showme/disabled/Bullet.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_TREEMAP'] = 'showme/disabled/Treemap.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BUBBLE'] = 'showme/disabled/Bubble.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BOXPLOT'] = 'showme/disabled/Boxplot.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARSTACKED_2X'] = 'showme/disabled/BarStacked@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARSIDEBY_2X'] = 'showme/disabled/BarSideBySide@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARHORIZONTAL_2X'] = 'showme/disabled/BarHorizontal@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BARLINE_2X'] = 'showme/disabled/BarLine@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_CIRCLE_2X'] = 'showme/disabled/Circle@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_CIRCLESIDEBYSIDE_2X'] = 'showme/disabled/CircleSideBySide@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_GANTT_2X'] = 'showme/disabled/Gantt@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_HEATMAP_2X'] = 'showme/disabled/HeatMap@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_HISTOGRAM_2X'] = 'showme/disabled/Histogram@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_LINEDIM_2X'] = 'showme/disabled/LineDimension@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_LINEMEAS_2X'] = 'showme/disabled/LineMeasure@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_AREAMEAS_2X'] = 'showme/disabled/FilledLineContinuous@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_AREADIM_2X'] = 'showme/disabled/FilledLineDiscrete@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_SCATSING_2X'] = 'showme/disabled/ScatterSingle@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_TEXTTABLE_2X'] = 'showme/disabled/TextTable@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_SPOTTABLE_2X'] = 'showme/disabled/SpotTable@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_MAPS_2X'] = 'showme/disabled/Maps@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_FILLEDMAPS_2X'] = 'showme/disabled/FilledMaps@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_PIES_2X'] = 'showme/disabled/Pies@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_DUALLINE_2X'] = 'showme/disabled/DualAxis@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BULLET_2X'] = 'showme/disabled/Bullet@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_TREEMAP_2X'] = 'showme/disabled/Treemap@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BUBBLE_2X'] = 'showme/disabled/Bubble@2x.png';
    tab.TabResources._resourceMap['TQRC_SHOWME_0_BOXPLOT_2X'] = 'showme/disabled/Boxplot@2x.png';
    tab.TabResources._resourceMap['TQRC_TREE_MINUS'] = 'others/TreeMinus.png';
    tab.TabResources._resourceMap['TQRC_TREE_MINUS_2X'] = 'others/TreeMinus@2x.png';
    tab.TabResources._resourceMap['TQRC_TREE_PLUS'] = 'others/TreePlus.png';
    tab.TabResources._resourceMap['TQRC_TREE_PLUS_2X'] = 'others/TreePlus@2x.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_TABLE'] = 'analyticspane/drop/table.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_PANE'] = 'analyticspane/drop/pane.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_CELL'] = 'analyticspane/drop/cell.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_LINEAR'] = 'analyticspane/drop/trend-linear.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_POLY'] = 'analyticspane/drop/trend-polynomial.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_LOG'] = 'analyticspane/drop/trend-logarithmic.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_EXP'] = 'analyticspane/drop/trend-exponential.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_SUBTOTAL'] = 'analyticspane/drop/sub-total.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_COLUMN'] = 'analyticspane/drop/column-total.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_ROW'] = 'analyticspane/drop/row-total.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DROP_FORECAST'] = 'analyticspane/drop/forecast.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_REFLINE'] = 'analyticspane/refline.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_REFBAND'] = 'analyticspane/refband.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_DISTBAND'] = 'analyticspane/distband.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_BOXPLOT'] = 'analyticspane/boxplot.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_TOTAL'] = 'analyticspane/total.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_TRENDLINE'] = 'analyticspane/trendline.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_95ANDMEDIAN'] = 'analyticspane/95andmedian.png';
    tab.TabResources._resourceMap['TQRC_ANALYTICSPANE_FORECAST'] = 'analyticspane/forecast.png';
})();
tab.VizUriModel._uriTypeStringToUriType = { authoring: 2, authoringNewWorkbook: 3, views: 1, 'vizql/showadminview': 4, shared: 5 };
tab.VizUriModel._ignoredParams = [ ':bootstrapWhenNotified' ];
tab.VizUriModel._uriTypeToUriTypeString = {};
tab.VizUriModel._usernameValidChars = {};
(function () {
    var addCodes = function(from, to) {
        for (var i = from; i <= to; i++) {
            var s = String.fromCharCode(i);
            tab.VizUriModel._usernameValidChars[s] = s;
        }
    };
    addCodes(97, 122);
    addCodes(64, 90);
    addCodes(48, 57);
    addCodes(95, 95);
    addCodes(45, 46);
})();
tab.CommandSerializer._typesByName = {};
(function () {
    tab.CommandSerializer._typesByName['keep-only-or-exclude'] = 2;
    tab.CommandSerializer._typesByName['quick-sort'] = 4;
    tab.CommandSerializer._typesByName['clear-sorts'] = 6;
    tab.CommandSerializer._typesByName['run-action'] = 8;
    tab.CommandSerializer._typesByName['load-url'] = 9;
    tab.CommandSerializer._typesByName['merge-or-split'] = 10;
    tab.CommandSerializer._typesByName['legend-group-or-ungroup'] = 13;
    tab.CommandSerializer._typesByName['label-drill'] = 11;
    tab.CommandSerializer._typesByName['level-drill'] = 12;
    tab.CommandSerializer._typesByName['remove-reference-line'] = 15;
    tab.CommandSerializer._typesByName['show-reference-line-constant-value-editor'] = 21;
    tab.CommandSerializer._typesByName['trend-lines'] = 17;
    tab.CommandSerializer._typesByName['show-col-totals'] = 18;
    tab.CommandSerializer._typesByName['show-row-totals'] = 18;
    tab.CommandSerializer._typesByName['remove-subtotals'] = 18;
    tab.CommandSerializer._typesByName['set-totals-type'] = 19;
    tab.CommandSerializer._typesByName['set-reference-line-formula'] = 20;
})();
tab.DeferLayoutImpl._instance = null;
tab.EventMap.onTabSelect = 'onTabSelect';
tab.EventMap.onDoLaunchAuthoring = 'onDoLaunchAuthoring';
tab.EventMap.newGuid = 'newGuid';
tab.EventMap.newLayoutId = 'newLayoutId';
tab.EventMap.activeViewChanged = 'activeViewChanged';
tab.EventMap.invalidate = 'invalidate';
tab.EventMap.hoverChanged = 'hoverChanged';
tab.EventMap.stateChanged = 'stateChanged';
tab.EventMap.layoutUpdated = 'layoutUpdated';
tab.EventMap.refreshLayoutModel = 'refreshLayoutModel';
tab.EventMap.sheetDataChanged = 'sheetDataChanged';
tab.EventMap.refreshSheetInfo = 'refreshSheetInfo';
tab.EventMap.refreshFilterModel = 'refreshFilterModel';
tab.EventMap.viewChanged = 'viewChanged';
tab.EventMap.refreshVisualModel = 'refreshVisualModel';
tab.EventMap.refreshLegacyLegendImages = 'refreshLegacyLegendImages';
tab.EventMap.refreshMenuModel = 'refreshMenuModel';
tab.EventMap.selectionChanged = 'selectionChanged';
tab.EventMap.fieldSelectionChanged = 'fieldSelectionChanged';
tab.EventMap.onBootstrapSuccess = 'onBootstrapSuccess';
tab.EventMap.openActionUrl = 'openActionUrl';
tab.EventMap.modifierKeysChanged = 'modifierKeysChanged';
tab.EventMap.closeMenus = 'close-menus';
tab.EventMap._map = {};
(function () {
    var i = 0;
    var $enum1 = ss.IEnumerator.getEnumerator(Object.keys((tab.EventName).prototype));
    while ($enum1.moveNext()) {
        var name = $enum1.current;
        tab.EventMap._map[name] = i++;
    }
})();
tab.UbertipSerializer._selectionTemplate = [ '<span style="white-space:pre"><div class="uberSelection"style="text-align:center;"><span>&nbsp;&nbsp;</span>', '<span style="font-weight:bold;">', '', '</span><span> ', '', '  </span><span>', '\u00b7', '  </span><span>', '', ' </span><span>', '', '</span><span>', ': ', '</span><span style="font-weight:bold;">', '', '</span><span>&nbsp;&nbsp;', '</span></div></span>' ];
tab.UbertipSerializer._selectionTemplateNoSummary = [ '<div class="uberSelection"style="text-align:center;"><span></span>', '<span style="font-weight:bold;"> ', '', ' </span><span>', '', '</span><div> ' ];
tab.CommandRedirectRegistry._registry = null;
tab.ColorModel._white = new tab.ColorModel(255, 255, 255, 1);
tab.ColorModel._hexFormat = new RegExp('#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})', 'i');
tab.ColorModel._rgbFormat = new RegExp('rgb\\((\\d+),(\\d+),(\\d+)\\)', 'i');
tab.ColorModel._rgbaFormat = new RegExp('rgba\\((\\d+), ?(\\d+), ?(\\d+), ?(\\d+|0\\.\\d+|1\\.0)\\)', 'i');
tab.FieldModel.nameOfMeasuresColumn = ':Measure Names';
tab.FieldModel.nameOfMeasureValuesColumn = 'Multiple Values';
tab.SceneModel._defaultBackgroundFillColor$1 = new tab.ColorModel(0, 0, 0, 1);
tab.Schedule.extract = 0;
tab.Schedule.subscription = 1;
tab.VizDataModel.tupleIdColumnName = '[system:visual].[tuple_id]';
tab.VizDataModel.measureNamesColumnName = '[:Measure Names]';
tab.ZoneModel._visualField$1 = 'visual';
tab.ZoneModel._titleField$1 = 'dashboardTitle';
tab.ZoneModel._textField$1 = 'dashboardText';
tab.ZoneModel._qColorLegendField$1 = 'quantitativeColorLegend';
tab.ZoneModel._colorLegendField$1 = 'colorLegend';
tab.ZoneModel._sizeLegendField$1 = 'categoricalSizeLegend';
tab.ZoneModel._shapeLegendField$1 = 'categoricalShapeLegend';
tab.ZoneModel._mapLegendField$1 = 'categoricalMapLegend';
tab.ZoneModel._paramCtrlField$1 = 'parameterControl';
tab.ZoneModel._pageField$1 = 'pageModel';
tab.ZoneModel._serverRenderedLegendField$1 = 'serverRenderedLegend';
tab.ZoneModel._imageZoneField$1 = 'imageZone';
tab.ZoneModel._webZoneField$1 = 'webZone';
tab.ZoneModel._quickFilterField$1 = 'quickFilterDisplay';
tab.ZoneModel._flipboardNavField$1 = 'flipboardNav';
tab.ZoneModel._flipboardField$1 = 'flipboard';
tab.ToolbarServerCommands._uriPattern = new RegExp('^https?://[^/]+(.*)$');
tab.SelectionClientCommands._selectActionToOptionsMapping = null;
(function () {
    tab.SelectionClientCommands._selectActionToOptionsMapping = {};
    tab.SelectionClientCommands._selectActionToOptionsMapping['simple'] = 'select-options-simple';
    tab.SelectionClientCommands._selectActionToOptionsMapping['toggle'] = 'select-options-toggle';
    tab.SelectionClientCommands._selectActionToOptionsMapping['range'] = 'select-options-range';
    tab.SelectionClientCommands._selectActionToOptionsMapping['menu'] = 'select-options-menu';
})();
tab.CommandController._handledBootstrapException = false;
tab.CommandController._parentCompletedSent = false;
tab.CommandController._deferredUrlActions = false;
tab.CommandController._instance = null;
tab.ApplicationModel._instance$1 = null;
tab.ServerCommands._commandInterceptors = {};
tab.BaseSession.linkTarget = null;
tab.BaseSession.autoUpdate = true;
tab.BaseSession._limitExceeded = false;
tab.BaseSession._currentState = null;
tab.BaseSession._railsSpecialChars = null;
tab.BaseSession._historyPosition = 0;
tab.BaseSession._waitHandler = null;
(function () {
    tab.BaseSession._railsSpecialChars = { '%25': new RegExp('%', 'g'), '%3B': new RegExp(';', 'g'), '%2C': new RegExp(',', 'g'), '%2E': new RegExp('\\.', 'g'), '%2F': new RegExp('\\/', 'g'), '%3F': new RegExp('\\?', 'g'), '%2B': new RegExp('\\+', 'g'), '%20': new RegExp(' ', 'g'), '%5C': new RegExp('\\\\', 'g') };
})();
tab.CustomizedViewSession._log = tab.Logger.getLogger(tab.CustomizedViewSession);
tab.FailureHandler._intervalID = 0;
(function () {
    if ((typeof tsConfig === 'undefined')) {
        return;
    }
    var enabled = tsConfig.clientErrorReportingLevel;
    if (!String.isNullOrEmpty(enabled)) {
        tab.ErrorTrace.install();
        tab.FailureHandler._intervalID = window.setInterval(tab.FailureHandler.reportFailures, 5000);
    }
})();
tab.ActionUtils._schemeWhitelist = ['http:', 'https:', 'mailto:', 'news:', 'gopher:', 'tsc:', 'tsl:'];
tab.ActionUtils._isCustomWhitelistParsed = false;
tab.ActionUtils._hasShownBlockedAction = false;
tab.ModelUtils.visualPartToRegionMap = null;
tab.ModelUtils.regionToVisualPartMap = null;
tab.ModelUtils._vizLoadedCallbacks = null;
(function () {
    tab.ModelUtils.visualPartToRegionMap = {};
    tab.ModelUtils.visualPartToRegionMap['left-axis'] = 'leftaxis';
    tab.ModelUtils.visualPartToRegionMap['right-axis'] = 'rightaxis';
    tab.ModelUtils.visualPartToRegionMap['top-axis'] = 'topaxis';
    tab.ModelUtils.visualPartToRegionMap['bottom-axis'] = 'bottomaxis';
    tab.ModelUtils.visualPartToRegionMap['y-labels'] = 'yheader';
    tab.ModelUtils.visualPartToRegionMap['x-labels'] = 'xheader';
    tab.ModelUtils.regionToVisualPartMap = {};
    tab.ModelUtils.regionToVisualPartMap['leftaxis'] = 'left-axis';
    tab.ModelUtils.regionToVisualPartMap['rightaxis'] = 'right-axis';
    tab.ModelUtils.regionToVisualPartMap['topaxis'] = 'top-axis';
    tab.ModelUtils.regionToVisualPartMap['bottomaxis'] = 'bottom-axis';
    tab.ModelUtils.regionToVisualPartMap['yheader'] = 'y-labels';
    tab.ModelUtils.regionToVisualPartMap['xheader'] = 'x-labels';
})();
tab.ShapeManager.selectionBorderSize = 1;
tab.XhrUtil.guid = '';
tab.XhrUtil.parentID = '';
tab.XhrUtil._currentTabName = '';
tab.Model._deferredEvents = null;
tab.Model._failsafeFireEventsHandle = null;
(function () {
    tab.CalculationCommands.registerCommandInterceptors();
})();
tab.SceneUtils.blackColor = null;
(function () {
    var blackColorStr = new tab.ColorModel(0, 0, 0, 1).toRgba();
    tab.SceneUtils.blackColor = {};
    tab.SceneUtils.blackColor['colorOverrideNone'] = blackColorStr;
    tab.SceneUtils.blackColor['colorOverrideFog'] = blackColorStr;
    tab.SceneUtils.blackColor['colorOverrideOpaque'] = blackColorStr;
})();
tab.VizDataUtils.unknownFieldMarker = '~~~???~~~';
tab.VizDataUtils.noLocalSummary = '...';
tab.VizDataUtils.invalidTupleId = 0;

}());

//! This script was generated using Script# v0.7.4.0
