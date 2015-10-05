//! vqlauthoring.debug.js
//

dojo.addOnLoad(function() {

Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tab.SaveController

tab.SaveController = function tab_SaveController() {
}
tab.SaveController.get_instance = function tab_SaveController$get_instance() {
    if (ss.isNullOrUndefined(tab.SaveController._instance)) {
        tab.SaveController._instance = new tab.SaveController();
    }
    return tab.SaveController._instance;
}
tab.SaveController.prototype = {
    
    get_isSaveEnabled: function tab_SaveController$get_isSaveEnabled() {
        return tsConfig.allow_save && !tab.ApplicationModel.get_instance().get_workbook().get_isWorkbookIncomplete();
    },
    
    get_isSaveAsEnabled: function tab_SaveController$get_isSaveAsEnabled() {
        return tsConfig.allow_save_as;
    },
    
    saveWorkbook: function tab_SaveController$saveWorkbook(onSuccess, onCancel) {
        if (tsConfig.is_guest) {
            this._doLogin();
        }
        else {
            if (this.get_isSaveEnabled()) {
                this._doSave(onSuccess);
            }
            else if (this.get_isSaveAsEnabled()) {
                this._doSaveAs('save', onSuccess, onCancel);
            }
        }
    },
    
    saveWorkbookAs: function tab_SaveController$saveWorkbookAs(onSuccess, onCancel) {
        if (tsConfig.is_guest) {
            this._doLogin();
        }
        else if (this.get_isSaveAsEnabled()) {
            this._doSaveAs('saveAs', onSuccess, onCancel);
        }
    },
    
    _doSave: function tab_SaveController$_doSave(onSuccess) {
        tab.SaveServerCommands.saveWorkbook(ss.Delegate.create(this, function(vo) {
            tab.Log.get(this).debug('Workbook saved: %o', vo);
            if (ss.isValue(onSuccess)) {
                onSuccess(vo);
            }
            else {
                tab.NotificationViewModel.showNotification(tab.Strings.AuthSaveWorkbookSavedMessage);
            }
        }));
    },
    
    _doSaveAs: function tab_SaveController$_doSaveAs(saveType, onSuccess, onCancel) {
        var vm = new tab.SaveViewModel();
        if (saveType !== 'save') {
            vm.set_workbookName('');
        }
        spiff.ObjectRegistry.newView(tab.SaveView, vm);
        vm.showSave();
        if (ss.isValue(onCancel)) {
            vm.add_saveCancelled(onCancel);
        }
        if (ss.isValue(onSuccess)) {
            vm.add_saveSucceeded(onSuccess);
        }
        else {
            vm.add_saveSucceeded(ss.Delegate.create(this, function(newWb) {
                var newVizUriModel = tab.WorkbookViewObjectUtils.createVizUriModelForAuthoringSheetInWorkbook(tsConfig.current_sheet_name, newWb);
                newVizUriModel.removeQueryParam(':showSave').removeQueryParam(':showSaveAs');
                tab.Log.get(this).debug('Save complete: %s', newVizUriModel.get_path());
                var window = tabBootstrap.Utility.get_locationWindow();
                if (newVizUriModel.matchesCurrentWindowLocationUri()) {
                    tab.WindowHelper.reload(window, true);
                }
                else {
                    tab.SessionServerCommands.destroySessionAndForward(window, newVizUriModel.get_uri());
                }
            }));
        }
    },
    
    _doLogin: function tab_SaveController$_doLogin() {
        var vizUriModel = tab.VizUriModel.createForCurrentWindowLocationAndVizState(tsConfig.repositoryUrl, tsConfig.current_sheet_name);
        vizUriModel.set_showSaveAs(true);
        tab.LogOnViewModel.logOnAndTransitionSession(vizUriModel);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CardOrientation

tab.CardOrientation = function() { };
tab.CardOrientation.prototype = {
    vertical: 0, 
    horizontal: 1
}
tab.CardOrientation.registerEnum('tab.CardOrientation', false);


////////////////////////////////////////////////////////////////////////////////
// tab.DropIndicationState

tab.DropIndicationState = function() { };
tab.DropIndicationState.prototype = {
    rest: 0, 
    dropInvited: 1, 
    dropNotValid: 2
}
tab.DropIndicationState.registerEnum('tab.DropIndicationState', false);


////////////////////////////////////////////////////////////////////////////////
// tab.ICardContent

tab.ICardContent = function() { };
tab.ICardContent.prototype = {
    add_dropStateChanged : null,
    remove_dropStateChanged : null,
    add_visibleChanged : null,
    remove_visibleChanged : null,
    get_isVisible : null,
    get_dropTarget : null,
    get_title : null,
    get_name : null,
    get_collapsedTitleDetail : null,
    get_viewType : null,
    get_viewModel : null,
    get_dropState : null
}
tab.ICardContent.registerInterface('tab.ICardContent');


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsDropTargetViewModel

tab.AnalyticsDropTargetViewModel = function tab_AnalyticsDropTargetViewModel(dropMeasures, dropPM, executeDefaultAddCommand) {
    tab.AnalyticsDropTargetViewModel.initializeBase(this);
    this._dropMeasures$1 = dropMeasures;
    this._dropTargetPM$1 = dropPM;
    this._executeDefaultAddCommand$1 = executeDefaultAddCommand;
}
tab.AnalyticsDropTargetViewModel.prototype = {
    _dropTargetPM$1: null,
    _dropMeasures$1: null,
    _executeDefaultAddCommand$1: null,
    _hoveredTarget$1: null,
    
    get_dropLabel: function tab_AnalyticsDropTargetViewModel$get_dropLabel() {
        return this._dropTargetPM$1.label;
    },
    
    get_showDropMeasures: function tab_AnalyticsDropTargetViewModel$get_showDropMeasures() {
        return this._dropTargetPM$1.showDropMeasures;
    },
    
    get_dropZoneItems: function tab_AnalyticsDropTargetViewModel$get_dropZoneItems() {
        return this._dropTargetPM$1.dropZoneItems;
    },
    
    get_dropMeasureNamePairs: function tab_AnalyticsDropTargetViewModel$get_dropMeasureNamePairs() {
        return this._dropMeasures$1;
    },
    
    get_hoverTarget: function tab_AnalyticsDropTargetViewModel$get_hoverTarget() {
        return this._hoveredTarget$1;
    },
    set_hoverTarget: function tab_AnalyticsDropTargetViewModel$set_hoverTarget(value) {
        this._hoveredTarget$1 = value;
        this.notifyPropertyChanged('HoverTarget');
        return value;
    },
    
    executeDefaultAddCommand: function tab_AnalyticsDropTargetViewModel$executeDefaultAddCommand() {
        if (ss.isValue(this._executeDefaultAddCommand$1)) {
            this._executeDefaultAddCommand$1();
        }
    },
    
    executeDropCommand: function tab_AnalyticsDropTargetViewModel$executeDropCommand(dropData) {
        var dropCommand = tab.CommandSerializer.deserialize(tab.SimpleCommandsPresModelWrapper.create(dropData.get_command()).get_simpleCommand());
        if (dropData.get_commandUsesFields()) {
            var axisFieldNames = [];
            if (ss.isValue(dropData.get_axis())) {
                axisFieldNames.push(dropData.get_axis().fn);
            }
            else {
                var $enum1 = ss.IEnumerator.getEnumerator(this._dropMeasures$1);
                while ($enum1.moveNext()) {
                    var axisNamePair = $enum1.current;
                    if (tab.MiscUtil.isNullOrEmpty(dropData.get_excludedFields()) || !dropData.get_excludedFields().contains(axisNamePair.fn)) {
                        axisFieldNames.push(axisNamePair.fn);
                    }
                }
            }
            dropCommand.commandParams['fieldVector'] = axisFieldNames;
        }
        tab.ServerCommands.executeServerCommand(dropCommand, 'immediately', tab.CommandUtils.createCommandRedirectSuccessHandler(null), null);
    },
    
    setHoveredTarget: function tab_AnalyticsDropTargetViewModel$setHoveredTarget(target) {
        if (ss.isNullOrUndefined(target.get_command())) {
            target = null;
        }
        this.set_hoverTarget(target);
    },
    
    removeHoveredTarget: function tab_AnalyticsDropTargetViewModel$removeHoveredTarget(target) {
        if (this._hoveredTarget$1 === target) {
            this.set_hoverTarget(null);
        }
    },
    
    getAxisDisplayName: function tab_AnalyticsDropTargetViewModel$getAxisDisplayName(axis) {
        return tab.ApplicationModel.get_instance().get_workbook().findContentDashboard().get_activeVisual().get_vizDataModel().getVizDataField(axis).get_fieldCaption();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsPaneViewModel

tab.AnalyticsPaneViewModel = function tab_AnalyticsPaneViewModel() {
    tab.AnalyticsPaneViewModel.initializeBase(this);
}
tab.AnalyticsPaneViewModel.prototype = {
    _analyticsModel$1: null,
    
    get_analyticsItemViewModelLists: function tab_AnalyticsPaneViewModel$get_analyticsItemViewModelLists() {
        var toRet = [];
        if (ss.isValue(this._analyticsModel$1)) {
            var $enum1 = ss.IEnumerator.getEnumerator(this._analyticsModel$1.get_analyticsPresModel().analyticsObjectGroups);
            while ($enum1.moveNext()) {
                var analyticsItemGroup = $enum1.current;
                var subItems = [];
                if (ss.isValue(analyticsItemGroup.analyticsObjectItems)) {
                    var $enum2 = ss.IEnumerator.getEnumerator(analyticsItemGroup.analyticsObjectItems);
                    while ($enum2.moveNext()) {
                        var analyticsItem = $enum2.current;
                        var fieldCaptionPairs = (tab.MiscUtil.isNullOrEmpty(analyticsItem.fieldCaptionPairs)) ? this.get_analyticsPaneModel().get_analyticsPresModel().fieldCaptionPairs : analyticsItem.fieldCaptionPairs;
                        subItems.add(new tab.AnalyticsListItemViewModel(analyticsItem, fieldCaptionPairs));
                    }
                }
                toRet.add(new ss.Tuple(analyticsItemGroup.name, subItems));
            }
        }
        return toRet;
    },
    
    get_analyticsPaneModel: function tab_AnalyticsPaneViewModel$get_analyticsPaneModel() {
        return this._analyticsModel$1;
    },
    set_analyticsPaneModel: function tab_AnalyticsPaneViewModel$set_analyticsPaneModel(value) {
        this._unregisterNewApListener$1();
        this._analyticsModel$1 = value;
        this._handlePaneUpdate$1();
        this._analyticsModel$1.add_newAnalyticsPane(ss.Delegate.create(this, this._handlePaneUpdate$1));
        return value;
    },
    
    dispose: function tab_AnalyticsPaneViewModel$dispose() {
        this._unregisterNewApListener$1();
        tab.AnalyticsPaneViewModel.callBaseMethod(this, 'dispose');
    },
    
    _unregisterNewApListener$1: function tab_AnalyticsPaneViewModel$_unregisterNewApListener$1() {
        if (ss.isValue(this._analyticsModel$1)) {
            this._analyticsModel$1.remove_newAnalyticsPane(ss.Delegate.create(this, this._handlePaneUpdate$1));
        }
    },
    
    _handlePaneUpdate$1: function tab_AnalyticsPaneViewModel$_handlePaneUpdate$1() {
        this.notifyPropertyChanged('AnalyticsPane');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsListItemViewModel

tab.AnalyticsListItemViewModel = function tab_AnalyticsListItemViewModel(analyticsItem, dropAxes) {
    tab.AnalyticsListItemViewModel.initializeBase(this);
    this._analyticsItemPM$1 = analyticsItem;
    this._dropAxes$1 = dropAxes;
}
tab.AnalyticsListItemViewModel.prototype = {
    _analyticsItemPM$1: null,
    _dropAxes$1: null,
    
    get_analyticsItem: function tab_AnalyticsListItemViewModel$get_analyticsItem() {
        return this._analyticsItemPM$1;
    },
    
    startDrag: function tab_AnalyticsListItemViewModel$startDrag(e) {
        if (this.get_analyticsItem().isEnabled) {
            var dropVM = new tab.AnalyticsDropTargetViewModel(this._dropAxes$1, this._analyticsItemPM$1.dropTargetInfo, ss.Delegate.create(this, this.executeDefaultAddCommand));
            return new spiff.DragInstance(dropVM, new tab.AnalyticsDragAvatar(this));
        }
        return null;
    },
    
    executeDefaultAddCommand: function tab_AnalyticsListItemViewModel$executeDefaultAddCommand() {
        if (!tab.FeatureFlags.isEnabled('AnalyticsObjectsDefaultDrop') || !this.get_analyticsItem().isEnabled) {
            return;
        }
        if (ss.isValue(this._analyticsItemPM$1.simpleCommandModel)) {
            var dropCommand = tab.CommandSerializer.deserialize(tab.SimpleCommandsPresModelWrapper.create(this._analyticsItemPM$1.simpleCommandModel).get_simpleCommand());
            tab.ServerCommands.executeServerCommand(dropCommand, 'immediately', tab.CommandUtils.createCommandRedirectSuccessHandler(null), null);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabViewModel

tab.AuthoringTabViewModel = function tab_AuthoringTabViewModel(name, isWorksheet, isCurrent, navvm) {
    tab.AuthoringTabViewModel.initializeBase(this);
    this._name$1 = name;
    this.isWorksheet = isWorksheet;
    this._isCurrent$1 = isCurrent;
    this._parent$1 = navvm;
}
tab.AuthoringTabViewModel.prototype = {
    isWorksheet: true,
    _name$1: null,
    _isCurrent$1: false,
    _parent$1: null,
    
    add_onTabChanged: function tab_AuthoringTabViewModel$add_onTabChanged(value) {
        this.__onTabChanged$1 = ss.Delegate.combine(this.__onTabChanged$1, value);
    },
    remove_onTabChanged: function tab_AuthoringTabViewModel$remove_onTabChanged(value) {
        this.__onTabChanged$1 = ss.Delegate.remove(this.__onTabChanged$1, value);
    },
    
    __onTabChanged$1: null,
    
    get_parent: function tab_AuthoringTabViewModel$get_parent() {
        return this._parent$1;
    },
    
    get_name: function tab_AuthoringTabViewModel$get_name() {
        return this._name$1;
    },
    set_name: function tab_AuthoringTabViewModel$set_name(value) {
        this._name$1 = value;
        this._changed$1();
        return value;
    },
    
    get_isCurrent: function tab_AuthoringTabViewModel$get_isCurrent() {
        return this._isCurrent$1;
    },
    set_isCurrent: function tab_AuthoringTabViewModel$set_isCurrent(value) {
        this._isCurrent$1 = value;
        this._changed$1();
        return value;
    },
    
    renameWithPrompt: function tab_AuthoringTabViewModel$renameWithPrompt() {
        var existingSheetNames = this._parent$1.get_workbookTabs().map(function(value) {
            return value._name$1;
        });
        var dlg = new tab.RenameSheetDialog(this.get_name(), existingSheetNames, ss.Delegate.create(this, function(newSheetName) {
            tab.SheetClientCommands.renameSheet(this.get_name(), newSheetName);
        }));
        dlg.show();
    },
    
    buildMenu: function tab_AuthoringTabViewModel$buildMenu() {
        return spiff.MenuViewModel.createForMenu(this._parent$1.buildWorksheetMenu(this), tab.AuthoringCommandsViewModel.commandMenuItemClicked);
    },
    
    _changed$1: function tab_AuthoringTabViewModel$_changed$1() {
        if (ss.isValue(this.__onTabChanged$1)) {
            this.__onTabChanged$1();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarDropdownButtonViewModel

tab.AuthoringToolbarDropdownButtonViewModel = function tab_AuthoringToolbarDropdownButtonViewModel(text, iconClass, menuBuilder) {
    tab.AuthoringToolbarDropdownButtonViewModel.initializeBase(this, [ text, iconClass, null ]);
    tab.Param.verifyValue(menuBuilder, 'menuBuilder');
    this._menuBuilder$2 = menuBuilder;
    this.set_enabled(this.createMenu().get_menuItems().length > 0);
}
tab.AuthoringToolbarDropdownButtonViewModel.prototype = {
    _menuBuilder$2: null,
    
    createMenu: function tab_AuthoringToolbarDropdownButtonViewModel$createMenu() {
        return this._menuBuilder$2(null);
    },
    
    execute: function tab_AuthoringToolbarDropdownButtonViewModel$execute() {
    },
    
    dropdownClicked: function tab_AuthoringToolbarDropdownButtonViewModel$dropdownClicked(relativeTo) {
        var dropdownMenu = this.createMenu();
        if (!dropdownMenu.get_menuItems().length) {
            return;
        }
        var menuViewModel = spiff.MenuViewModel.createForMenu(dropdownMenu, tab.AuthoringCommandsViewModel.commandMenuItemClicked);
        menuViewModel.add_hidden(ss.Delegate.create(this, function() {
            this.set_isActive(false);
        }));
        var options = spiff.ShowMenuOptions.create(relativeTo, false, relativeTo.outerWidth(false));
        options.additionalMenuClass = 'tabAuthToolbarDropdownMenu';
        menuViewModel.show(options);
        this.set_isActive(true);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarToggleButtonViewModel

tab.AuthoringToolbarToggleButtonViewModel = function tab_AuthoringToolbarToggleButtonViewModel(text, iconClass, command, toggleToText) {
    tab.AuthoringToolbarToggleButtonViewModel.initializeBase(this, [ text, iconClass, command ]);
    this._toggleToText$2 = toggleToText;
}
tab.AuthoringToolbarToggleButtonViewModel.createFromCommandItems = function tab_AuthoringToolbarToggleButtonViewModel$createFromCommandItems(commandItemOne, commandItemTwo, iconClassPrefix) {
    var activeCommandItem;
    var inactiveCommandItem;
    var itemOneWrapper = tab.CommandItemWrapper.create(commandItemOne);
    var itemTwoWrapper = tab.CommandItemWrapper.create(commandItemTwo);
    if (!ss.isValue(itemOneWrapper.get_enabled()) || itemOneWrapper.get_enabled()) {
        activeCommandItem = itemOneWrapper;
        inactiveCommandItem = itemTwoWrapper;
    }
    else if (!ss.isValue(itemTwoWrapper.get_enabled()) || itemTwoWrapper.get_enabled()) {
        activeCommandItem = itemTwoWrapper;
        inactiveCommandItem = itemOneWrapper;
    }
    else {
        return null;
    }
    var button = tab.ToolbarButtonViewModel.createFromCommandItem(activeCommandItem.get_item(), iconClassPrefix);
    var toggleButton = new tab.AuthoringToolbarToggleButtonViewModel(button.get_text(), button.get_iconClass(), button.get_buttonCommand(), inactiveCommandItem.get_name());
    toggleButton.disposables.add(button);
    toggleButton.set_enabled(ss.isValue(inactiveCommandItem) && !inactiveCommandItem.get_enabled());
    if (toggleButton.get_enabled()) {
        return toggleButton;
    }
    return null;
}
tab.AuthoringToolbarToggleButtonViewModel.prototype = {
    _toggleToText$2: null,
    
    get_toggleToText: function tab_AuthoringToolbarToggleButtonViewModel$get_toggleToText() {
        return this._toggleToText$2;
    },
    set_toggleToText: function tab_AuthoringToolbarToggleButtonViewModel$set_toggleToText(value) {
        this._toggleToText$2 = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarUberPopupButtonViewModel

tab.AuthoringToolbarUberPopupButtonViewModel = function tab_AuthoringToolbarUberPopupButtonViewModel(text, iconClass, uberPopupContent) {
    tab.AuthoringToolbarUberPopupButtonViewModel.initializeBase(this, [ text, iconClass, null ]);
    this._uberPopupContent$2 = uberPopupContent;
    this.set_enabled(true);
    this._onHide$2 = ss.Delegate.create(this, function() {
        this.set_isActive(false);
    });
}
tab.AuthoringToolbarUberPopupButtonViewModel.prototype = {
    _onHide$2: null,
    _uberPopupContent$2: null,
    _vm$2: null,
    
    get_uberPopupContent: function tab_AuthoringToolbarUberPopupButtonViewModel$get_uberPopupContent() {
        return this._uberPopupContent$2;
    },
    set_uberPopupContent: function tab_AuthoringToolbarUberPopupButtonViewModel$set_uberPopupContent(value) {
        this._uberPopupContent$2 = value;
        return value;
    },
    
    buttonClicked: function tab_AuthoringToolbarUberPopupButtonViewModel$buttonClicked(e) {
        if (ss.isValue(this._vm$2)) {
            this.dismissPopup();
        }
        else {
            this._vm$2 = spiff.UberPopupViewModel.createForContent(this._uberPopupContent$2);
            this._vm$2.add_hidden(this._onHide$2);
            var options = new spiff.UberPopupShowOptions(e);
            options.additionalClass = tab.PaneTableView.suppressVizTooltipsAndOverlays;
            this._vm$2.show(options);
            this.set_isActive(true);
        }
    },
    
    dismissPopup: function tab_AuthoringToolbarUberPopupButtonViewModel$dismissPopup() {
        if (ss.isValue(this._vm$2)) {
            this._vm$2.hide();
            this._vm$2.remove_hidden(this._onHide$2);
            this._vm$2 = null;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarViewModel

tab.AuthoringToolbarViewModel = function tab_AuthoringToolbarViewModel(worksheetMenuBuilder) {
    this._items$1 = [];
    tab.AuthoringToolbarViewModel.initializeBase(this);
    if (ss.isNullOrUndefined(worksheetMenuBuilder)) {
        this._worksheetMenuBuilder$1 = function(vm) {
            return new spiff.Menu([]);
        };
    }
    else {
        this._worksheetMenuBuilder$1 = worksheetMenuBuilder;
    }
}
tab.AuthoringToolbarViewModel.prototype = {
    _worksheetMenuBuilder$1: null,
    _showMeButton$1: null,
    
    add_itemsChanged: function tab_AuthoringToolbarViewModel$add_itemsChanged(value) {
        this.__itemsChanged$1 = ss.Delegate.combine(this.__itemsChanged$1, value);
    },
    remove_itemsChanged: function tab_AuthoringToolbarViewModel$remove_itemsChanged(value) {
        this.__itemsChanged$1 = ss.Delegate.remove(this.__itemsChanged$1, value);
    },
    
    __itemsChanged$1: null,
    
    get_items: function tab_AuthoringToolbarViewModel$get_items() {
        return this._items$1;
    },
    
    updateCommands: function tab_AuthoringToolbarViewModel$updateCommands(commands, dashboardModel) {
        if (ss.isNullOrUndefined(commands) || ss.isNullOrUndefined(dashboardModel)) {
            return;
        }
        this._buildToolbarItems$1(commands, dashboardModel);
        this.raiseActionEvent(this.__itemsChanged$1);
    },
    
    _buildToolbarItems$1: function tab_AuthoringToolbarViewModel$_buildToolbarItems$1(commandsPresModel, dashboardModel) {
        this._disposeItems$1();
        var commandsWrapper = tab.CommandsPresModelWrapper.create(commandsPresModel);
        var $enum1 = ss.IEnumerator.getEnumerator(commandsWrapper.get_commandItems().extract(0, commandsWrapper.get_commandItems().length - 1));
        while ($enum1.moveNext()) {
            var commandItem = $enum1.current;
            var itemWrapper = tab.CommandItemWrapper.create(commandItem);
            switch (itemWrapper.get_commandsType()) {
                case 'separator':
                    this._items$1.add(tab.ToolbarButtonViewModel.createSeparator());
                    break;
                case 'item':
                    this._addToolbarButton$1(commandItem);
                    break;
                case 'subcommands':
                    if (itemWrapper.get_iconRes() === 'toggle-updates' || itemWrapper.get_iconRes() === 'toggle-labels') {
                        this._addToolbarToggleButton$1(tab.CommandsPresModelWrapper.create(itemWrapper.get_commands()).get_commandItems());
                    }
                    else {
                        var subItems = [];
                        tab.WidgetUtil.newMenuItemsFromCommands(subItems, itemWrapper.get_commands(), tab.WidgetUtil.createDropdownMenuCommands);
                        if (itemWrapper.get_iconRes() === 'viewsize') {
                            var subWrapper = tab.CommandsPresModelWrapper.create(itemWrapper.get_commands());
                            for (var i = 0; i < subItems.length - 1; i++) {
                                var subItemWrapper = tab.CommandItemWrapper.create(subWrapper.get_commandItems()[i]);
                                subItems[i].set_iconClassTwo('tabAuthToolbar-' + subItemWrapper.get_iconRes());
                            }
                        }
                        this._addToolbarDropdownButtonWithSubMenu$1(commandItem, new spiff.Menu(subItems));
                    }
                    break;
            }
        }
        this._items$1.add(new tab.AuthoringToolbarDropdownButtonViewModel(tab.Strings.AuthToolbarWorksheet, 'tabAuthToolbar-' + 'worksheet', this._worksheetMenuBuilder$1));
        this._items$1.add(new tab.AuthoringToolbarDropdownButtonViewModel(tab.Strings.AuthToolbarExport, 'tabAuthToolbar-' + 'export', ss.Delegate.create(this, function() {
            return this._buildExportMenu$1(dashboardModel);
        })));
        this._items$1.add(tab.ToolbarButtonViewModel.createSeparator());
        if (ss.isNullOrUndefined(this._showMeButton$1)) {
            this._showMeButton$1 = new tab.AuthoringToolbarUberPopupButtonViewModel(tab.Strings.AuthToolbarShowMe, 'tabAuthToolbar-' + 'showme', new tab.ShowMeViewModel());
        }
        this._items$1.add(this._showMeButton$1);
    },
    
    _disposeItems$1: function tab_AuthoringToolbarViewModel$_disposeItems$1() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._items$1);
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            item.dispose();
        }
        this._items$1.clear();
    },
    
    _addToolbarButton$1: function tab_AuthoringToolbarViewModel$_addToolbarButton$1(commandItem) {
        var item = tab.ToolbarButtonViewModel.createFromCommandItem(commandItem, 'tabAuthToolbar-');
        this._items$1.add(item);
    },
    
    _addToolbarToggleButton$1: function tab_AuthoringToolbarViewModel$_addToolbarToggleButton$1(commandItems) {
        if (commandItems.length !== 2) {
            tab.Log.get(this).warn('Invalid command count. Toggle button for %s not created.', commandItems.toString());
            return;
        }
        var toggleButton = tab.AuthoringToolbarToggleButtonViewModel.createFromCommandItems(commandItems[0], commandItems[1], 'tabAuthToolbar-');
        if (toggleButton != null) {
            this._items$1.add(toggleButton);
        }
    },
    
    _addToolbarDropdownButtonWithSubMenu$1: function tab_AuthoringToolbarViewModel$_addToolbarDropdownButtonWithSubMenu$1(commandItem, subMenu) {
        var itemWrapper = tab.CommandItemWrapper.create(commandItem);
        var item = new tab.AuthoringToolbarDropdownButtonViewModel(itemWrapper.get_name(), 'tabAuthToolbar-' + itemWrapper.get_iconRes(), function() {
            return subMenu;
        });
        this._items$1.add(item);
    },
    
    _buildExportMenu$1: function tab_AuthoringToolbarViewModel$_buildExportMenu$1(dashboardModel) {
        var app = tab.Application.get_instance().get_client();
        var cmds = app.get_toolbarCommands();
        var exportDataMi = spiff.MenuItem.newActionItem(tab.Strings.ToolbarExportData, ss.Delegate.create(cmds, cmds.exportData));
        var exportCrosstabMi = spiff.MenuItem.newActionItem(tab.Strings.ToolbarExportCrosstab, ss.Delegate.create(cmds, cmds.exportCrosstab));
        var hasPillsOnShelves = false;
        if (ss.isValue(dashboardModel.get_activeVisual()) && ss.isValue(dashboardModel.get_activeVisual()) && ss.isValue(dashboardModel.get_activeVisual().get_shelves()) && ss.isValue(dashboardModel.get_activeVisual().get_shelves().get_shelves())) {
            var $enum1 = ss.IEnumerator.getEnumerator(dashboardModel.get_activeVisual().get_shelves().get_shelves());
            while ($enum1.moveNext()) {
                var shelf = $enum1.current;
                if (shelf.get_pills().length > 0) {
                    hasPillsOnShelves = true;
                    break;
                }
            }
        }
        exportDataMi.set_enabled(hasPillsOnShelves);
        exportCrosstabMi.set_enabled(hasPillsOnShelves);
        return new spiff.Menu([spiff.MenuItem.newActionItem(tab.Strings.ToolbarExportImage, ss.Delegate.create(cmds, cmds.exportImage)), exportDataMi, exportCrosstabMi, spiff.MenuItem.newActionItem(tab.Strings.ToolbarPrintToPdf, ss.Delegate.create(cmds, cmds.exportPdf))]);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringViewModel

tab.AuthoringViewModel = function tab_AuthoringViewModel() {
    tab.AuthoringViewModel.initializeBase(this);
    this._dataSchemaViewModel$1 = new tab.DataSchemaViewModel();
    if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
        this._analyticsViewModel$1 = new tab.AnalyticsPaneViewModel();
    }
    this._commandsViewModel$1 = new tab.AuthoringCommandsViewModel();
    this._authoringTabNavViewModel$1 = new tab.AuthoringTabNavViewModel(this._commandsViewModel$1);
    this._toolbarViewModel$1 = new tab.AuthoringToolbarViewModel(ss.Delegate.create(this.get_authoringTabNavViewModel(), this.get_authoringTabNavViewModel().buildWorksheetMenu));
    if (!tsConfig.is_mobile_app) {
        this._authoringMastheadViewModel$1 = new tab.AuthoringMastheadViewModel();
    }
    tab.Application.get_instance().add_clientChanged(ss.Delegate.create(this, function() {
        this.notifyPropertyChanged('Client');
    }));
    this._cards$1 = {};
    this._cards$1['columns'] = this._createCardViewModel$1(1);
    this._cards$1['rows'] = this._createCardViewModel$1(1);
    this._cards$1['pages'] = this._createCardViewModel$1(0);
    this._cards$1['filters'] = this._createCardViewModel$1(0);
    this._cards$1['marks'] = this._createCardViewModel$1(0);
    this._cards$1['measureValues'] = this._createCardViewModel$1(0);
    this._vizSummaryViewModel$1 = new tab.VizSummaryViewModel();
    if (tab.FeatureFlags.isEnabled('NonModalCalculationDialog')) {
        this._calculationEditorViewModel$1 = new tab.CalculationEditorViewModel(tab.ApplicationModel.get_instance().get_calculationModel(), tab.ApplicationModel.get_instance().get_calculationFunctionListModel());
    }
    tab.StartupUtils.callAfterBootstrap(ss.Delegate.create(this, this._handleBootstrap$1));
    tab.ApplicationModel.get_instance().get_workbook().addNewDashboardHandler(ss.Delegate.create(this, this.handleNewDashboard));
}
tab.AuthoringViewModel.prototype = {
    _cards$1: null,
    _toolbarViewModel$1: null,
    _dataSchemaViewModel$1: null,
    _analyticsViewModel$1: null,
    _vizSummaryViewModel$1: null,
    _authoringMastheadViewModel$1: null,
    _authoringTabNavViewModel$1: null,
    _commandsViewModel$1: null,
    _calculationEditorViewModel$1: null,
    _marksContent$1: null,
    _dashboardModel$1: null,
    _visualModel$1: null,
    
    add_shelvesModified: function tab_AuthoringViewModel$add_shelvesModified(value) {
        this.__shelvesModified$1 = ss.Delegate.combine(this.__shelvesModified$1, value);
    },
    remove_shelvesModified: function tab_AuthoringViewModel$remove_shelvesModified(value) {
        this.__shelvesModified$1 = ss.Delegate.remove(this.__shelvesModified$1, value);
    },
    
    __shelvesModified$1: null,
    
    get_client: function tab_AuthoringViewModel$get_client() {
        return tab.Application.get_instance().get_client();
    },
    
    get_toolbarViewModel: function tab_AuthoringViewModel$get_toolbarViewModel() {
        return this._toolbarViewModel$1;
    },
    
    get_authoringMastheadViewModel: function tab_AuthoringViewModel$get_authoringMastheadViewModel() {
        return this._authoringMastheadViewModel$1;
    },
    
    get_authoringTabNavViewModel: function tab_AuthoringViewModel$get_authoringTabNavViewModel() {
        return this._authoringTabNavViewModel$1;
    },
    
    get_analyticsViewModel: function tab_AuthoringViewModel$get_analyticsViewModel() {
        return this._analyticsViewModel$1;
    },
    
    get_cards: function tab_AuthoringViewModel$get_cards() {
        return this._cards$1;
    },
    
    get_dataSchemaViewModel: function tab_AuthoringViewModel$get_dataSchemaViewModel() {
        return this._dataSchemaViewModel$1;
    },
    
    get_dataSchema: function tab_AuthoringViewModel$get_dataSchema() {
        return tab.ApplicationModel.get_instance().get_workbook().get_dataSchema();
    },
    
    get_vizSummaryViewModel: function tab_AuthoringViewModel$get_vizSummaryViewModel() {
        return this._vizSummaryViewModel$1;
    },
    
    get_calculationEditorViewModel: function tab_AuthoringViewModel$get_calculationEditorViewModel() {
        return this._calculationEditorViewModel$1;
    },
    
    dispose: function tab_AuthoringViewModel$dispose() {
        var $dict1 = this._cards$1;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            pair.value.dispose();
        }
        if (ss.isValue(this._marksContent$1)) {
            this._marksContent$1.dispose();
        }
        if (ss.isValue(this._analyticsViewModel$1)) {
            this._analyticsViewModel$1.dispose();
        }
        this._toolbarViewModel$1.dispose();
        this._dataSchemaViewModel$1.dispose();
        this._authoringTabNavViewModel$1.dispose();
        this._vizSummaryViewModel$1.dispose();
        if (ss.isValue(this._authoringMastheadViewModel$1)) {
            this._authoringMastheadViewModel$1.dispose();
        }
        this._disposeDashboard$1();
        this._disposeVisual$1();
        if (ss.isValue(this._calculationEditorViewModel$1)) {
            this._calculationEditorViewModel$1.dispose();
        }
        tab.AuthoringViewModel.callBaseMethod(this, 'dispose');
    },
    
    updatePortSizeAfterManualLayout: function tab_AuthoringViewModel$updatePortSizeAfterManualLayout() {
        var view = this.get_client().get_domNode();
        var portSize = {};
        portSize.w = view.width();
        portSize.h = view.height();
        var container = {};
        var metrics = $.extend(true, {}, tabBootstrap.ViewerBootstrap.get_instance().metricsUsedForInitialLayout);
        container.clientDashboardUiMetrics = metrics.toPresModel();
        tab.Log.get(this).debug('SetPortSize', portSize, metrics);
        tab.SheetClientCommands.setPortSize(portSize, container);
    },
    
    buildShelves: function tab_AuthoringViewModel$buildShelves() {
        var allCards = [this._cards$1['columns'], this._cards$1['rows'], this._cards$1['filters'], this._cards$1['pages'], this._cards$1['measureValues']];
        var shelves = tab.ModelUtils.findActiveOrDefaultVisual().get_shelves();
        if (ss.isValue(shelves) && ss.isValue(shelves.get_shelves())) {
            var $enum1 = ss.IEnumerator.getEnumerator(shelves.get_shelves());
            while ($enum1.moveNext()) {
                var shelf = $enum1.current;
                var card;
                switch (shelf.get_shelfType()) {
                    case 'columns-shelf':
                        card = this._cards$1['columns'];
                        break;
                    case 'rows-shelf':
                        card = this._cards$1['rows'];
                        break;
                    case 'pages-shelf':
                        card = this._cards$1['pages'];
                        break;
                    case 'measures-shelf':
                        card = this._cards$1['measureValues'];
                        break;
                    case 'filter-shelf':
                        card = this._cards$1['filters'];
                        break;
                    case 'encoding-shelf':
                        this._marksContent$1.addEncodingShelf(shelf);
                        continue;
                    default:
                        continue;
                }
                var svm = card.get_content();
                svm.set_shelf(shelf);
                card.set_content(svm);
                allCards.remove(card);
            }
        }
        var $enum2 = ss.IEnumerator.getEnumerator(allCards);
        while ($enum2.moveNext()) {
            var viewModel = $enum2.current;
            var svm = viewModel.get_content();
            svm.set_shelf(null);
        }
    },
    
    _handleBootstrap$1: function tab_AuthoringViewModel$_handleBootstrap$1() {
        tab.ApplicationModel.get_instance().get_workbook().get_commands().add_commandsChanged(ss.Delegate.create(this, this._updateCommands$1));
        if (!this._checkForExistingSession$1()) {
            this._checkForExistingAutoSave$1();
        }
    },
    
    _checkForExistingSession$1: function tab_AuthoringViewModel$_checkForExistingSession$1() {
        var isSamePage = document.referrer === tab.WindowHelper.getLocation(window.self).href;
        if (!isSamePage && tab.ApplicationModel.get_instance().get_workbook().get_isWorkbookModifiedAuthoring()) {
            tab.NotificationViewModel.showNotification(tab.Strings.AuthAutoRecoveredSessionMessage, -1);
            return true;
        }
        return false;
    },
    
    _checkForExistingAutoSave$1: function tab_AuthoringViewModel$_checkForExistingAutoSave$1() {
        if (tsConfig.isBootstrapFromAutoSave) {
            tab.NotificationViewModel.showNotification(tab.Strings.AuthAutoSavedRecoveredMessage, -1);
        }
    },
    
    handleNewDashboard: function tab_AuthoringViewModel$handleNewDashboard(newDashboard) {
        this._disposeDashboard$1();
        this._dashboardModel$1 = newDashboard;
        if (ss.isValue(this._dashboardModel$1)) {
            this._dashboardModel$1.get_zonesModel().add_newZone(ss.Delegate.create(this, this._handleNewZone$1));
        }
        this._dataSchemaViewModel$1.set_dataSchema(tab.ApplicationModel.get_instance().get_workbook().get_dataSchema());
        this._handleNewViz$1(tab.ModelUtils.findActiveOrDefaultVisual());
        this._updateCommands$1(tab.ApplicationModel.get_instance().get_workbook().get_commands());
    },
    
    _disposeDashboard$1: function tab_AuthoringViewModel$_disposeDashboard$1() {
        if (ss.isNullOrUndefined(this._dashboardModel$1)) {
            return;
        }
        this._dashboardModel$1.get_zonesModel().remove_newZone(ss.Delegate.create(this, this._handleNewZone$1));
        this._dashboardModel$1 = null;
    },
    
    _handleNewZone$1: function tab_AuthoringViewModel$_handleNewZone$1(z) {
        if (z.get_zoneType() === 'viz') {
            this._handleNewViz$1(z.get_visualModel());
        }
    },
    
    _disposeVisual$1: function tab_AuthoringViewModel$_disposeVisual$1() {
        if (ss.isNullOrUndefined(this._visualModel$1)) {
            return;
        }
        this._visualModel$1.get_shelves().remove_newShelves(ss.Delegate.create(this, this._handleNewShelves$1));
        this._visualModel$1 = null;
    },
    
    _handleNewViz$1: function tab_AuthoringViewModel$_handleNewViz$1(newVisualModel) {
        this._disposeVisual$1();
        this._visualModel$1 = newVisualModel;
        if (ss.isNullOrUndefined(this._visualModel$1)) {
            return;
        }
        if (ss.isValue(this._analyticsViewModel$1) && ss.isValue(this._visualModel$1.get_analyticsModel())) {
            this._analyticsViewModel$1.set_analyticsPaneModel(this._visualModel$1.get_analyticsModel());
        }
        this._vizSummaryViewModel$1.update(this._dataSchemaViewModel$1, this._visualModel$1.get_shelves(), this._visualModel$1.get_marksCardModel());
        if (ss.isValue(this._marksContent$1)) {
            this._marksContent$1.dispose();
        }
        this._marksContent$1 = new tab.MarksContentViewModel(this._visualModel$1.get_marksCardModel());
        this._cards$1['marks'].set_content(this._marksContent$1);
        this._visualModel$1.get_shelves().add_newShelves(ss.Delegate.create(this, this._handleNewShelves$1));
        this.buildShelves();
    },
    
    _handleNewShelves$1: function tab_AuthoringViewModel$_handleNewShelves$1() {
        this.buildShelves();
        this._dataSchemaViewModel$1.clearSelection();
        this._fireModified$1(this.__shelvesModified$1);
    },
    
    _createCardViewModel$1: function tab_AuthoringViewModel$_createCardViewModel$1(o) {
        var vm = new tab.CardViewModel();
        vm.set_content(new tab.ShelfViewModel());
        vm.set_isCollapsed(false);
        vm.set_orientation(o);
        return vm;
    },
    
    _fireModified$1: function tab_AuthoringViewModel$_fireModified$1(handler) {
        if (ss.isValue(handler)) {
            handler(this, ss.EventArgs.Empty);
        }
    },
    
    _updateCommands$1: function tab_AuthoringViewModel$_updateCommands$1(cm) {
        if (ss.isNullOrUndefined(cm)) {
            return;
        }
        this._commandsViewModel$1.update(cm.get_commands());
        this._toolbarViewModel$1.updateCommands(cm.get_commands(), this._dashboardModel$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.BaseFieldDragInstance

tab.BaseFieldDragInstance = function tab_BaseFieldDragInstance(dragged, dragAvatar) {
    this.finalDrop = $.DeferredData();
    tab.BaseFieldDragInstance.initializeBase(this, [ dragged, dragAvatar ]);
}
tab.BaseFieldDragInstance.prototype = {
    drag: null,
    
    get_dropPresModels: function tab_BaseFieldDragInstance$get_dropPresModels() {
        return (this.finalDrop.isResolved()) ? this.drag.shelfDropModels : new Array(0);
    },
    
    get_drop: function tab_BaseFieldDragInstance$get_drop() {
        return this.finalDrop;
    },
    
    dropPositionToReplacePill: function tab_BaseFieldDragInstance$dropPositionToReplacePill(pill) {
        var shelfDrops = pill.get_shelf().matchingDropsFrom(this);
        var shelfPosIndex = pill.get_indexInShelf();
        if (ss.isNullOrUndefined(shelfDrops)) {
            var gesturedDrop = {};
            gesturedDrop.shelfPosIndex = shelfPosIndex;
            gesturedDrop.shelfDropAction = 'replace';
            return gesturedDrop;
        }
        return _.find(shelfDrops.shelfDropPositions, function(dropPos) {
            return dropPos.shelfDropAction === 'replace' && dropPos.shelfPosIndex === shelfPosIndex;
        });
    },
    
    dropPositionForShelf: function tab_BaseFieldDragInstance$dropPositionForShelf(shelf, index) {
        var shelfDrops = shelf.matchingDropsFrom(this);
        if (!ss.isValue(shelfDrops)) {
            return null;
        }
        var dropPosition = _.find(shelfDrops.shelfDropPositions, function(dropPos) {
            return ((dropPos.shelfDropAction || 'insert') === 'insert') && dropPos.shelfPosIndex === (index || 0);
        });
        if (ss.isNullOrUndefined(dropPosition)) {
            dropPosition = _.find(shelfDrops.shelfDropPositions, function(dropPos) {
                return !ss.isValue(index) || dropPos.shelfPosIndex === index;
            });
        }
        return dropPosition;
    },
    
    blindDropsMatchingShelf: function tab_BaseFieldDragInstance$blindDropsMatchingShelf(shelf) {
        var fakeDrop = {};
        fakeDrop.shelfType = shelf.get_shelfType();
        var dropPositions = [];
        if (shelf._isEmpty()) {
            var singleInsert = {};
            singleInsert.shelfDropAction = 'insert';
            singleInsert.encodingType = 'invalid-encoding';
            singleInsert.shelfType = shelf.get_shelfType();
            singleInsert.shelfPosIndex = 0;
            dropPositions.add(singleInsert);
        }
        else {
            var fromDrop = this.get_fields()[0].get_defaultFieldType();
            for (var pillIndex = 0; pillIndex < shelf.get_pills().length; pillIndex++) {
                if (shelf.get_pills()[pillIndex].get_field().get_defaultFieldType() === fromDrop) {
                    var pillReplace = {};
                    pillReplace.shelfDropAction = 'replace';
                    pillReplace.shelfType = shelf.get_shelfType();
                    pillReplace.shelfPosIndex = pillIndex;
                    dropPositions.add(pillReplace);
                }
            }
        }
        fakeDrop.shelfDropPositions = dropPositions;
        return fakeDrop;
    },
    
    dropsMatchingShelf: function tab_BaseFieldDragInstance$dropsMatchingShelf(shelf) {
        if (!this.get_drop().isResolved()) {
            return this.blindDropsMatchingShelf(shelf);
        }
        else {
            return _.find(this.get_dropPresModels(), function(pm) {
                return pm.shelfType === shelf.get_shelfType();
            });
        }
    },
    
    fieldsToDropOnShelf: function tab_BaseFieldDragInstance$fieldsToDropOnShelf(st) {
        if (!this.finalDrop.isResolved()) {
            return this.get_fields();
        }
        var fieldModels = [];
        var $enum1 = ss.IEnumerator.getEnumerator(this.drag.shelfDropModels);
        while ($enum1.moveNext()) {
            var shelfDrops = $enum1.current;
            if (shelfDrops.shelfType === st) {
                var ds = tab.ApplicationModel.get_instance().get_workbook().get_dataSchema();
                var $enum2 = ss.IEnumerator.getEnumerator(shelfDrops.fieldEncodings);
                while ($enum2.moveNext()) {
                    var fieldEncoding = $enum2.current;
                    var matchingCol = ds.findField(fieldEncoding.fn);
                    if (ss.isValue(matchingCol)) {
                        fieldModels.add(matchingCol);
                    }
                }
            }
        }
        return fieldModels;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationFunctionListViewModel

tab.CalculationFunctionListViewModel = function tab_CalculationFunctionListViewModel(model) {
    tab.CalculationFunctionListViewModel.initializeBase(this);
    this._model$1 = model;
    this._model$1.add_functionListUpdated(ss.Delegate.create(this, this._updateListViewFromModel$1));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this._model$1.remove_functionListUpdated(ss.Delegate.create(this, this._updateListViewFromModel$1));
    })));
    this._listViewModel$1 = new spiff.ListViewModel(null);
    this._updateListViewFromModel$1();
}
tab.CalculationFunctionListViewModel.prototype = {
    _model$1: null,
    _listViewModel$1: null,
    
    get_model: function tab_CalculationFunctionListViewModel$get_model() {
        return this._model$1;
    },
    
    get_functions: function tab_CalculationFunctionListViewModel$get_functions() {
        return this._model$1.get_functions();
    },
    
    get_listViewModel: function tab_CalculationFunctionListViewModel$get_listViewModel() {
        return this._listViewModel$1;
    },
    
    dispose: function tab_CalculationFunctionListViewModel$dispose() {
        this._listViewModel$1.dispose();
        tab.CalculationFunctionListViewModel.callBaseMethod(this, 'dispose');
    },
    
    _updateListViewFromModel$1: function tab_CalculationFunctionListViewModel$_updateListViewFromModel$1() {
        var listItems = [];
        var functions = this._model$1.get_functions();
        for (var i = 0, len = functions.length; i < len; i++) {
            var funcModel = functions[i];
            listItems.add(spiff.ListItemViewModel.newListItem(i.toString(), funcModel.name, funcModel));
        }
        this._listViewModel$1.update(listItems);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationEditorViewModel

tab.CalculationEditorViewModel = function tab_CalculationEditorViewModel(model, calculationFunctionListModel) {
    this._dropState$1 = 0;
    tab.CalculationEditorViewModel.initializeBase(this);
    this._calculationModel$1 = model;
    if (ss.isValue(calculationFunctionListModel)) {
        this._functionListViewModel$1 = new tab.CalculationFunctionListViewModel(calculationFunctionListModel);
    }
    this._calculationModel$1.add_calculationUpdated(ss.Delegate.create(this, this._onCalculationUpdated$1));
    spiff.DragDropManager.add_dragStarted(ss.Delegate.create(this, this.dragStarted));
    spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this.dragEnded));
    this._validationRequestCount$1 = 0;
    if (this.get__modelHasCalculation$1()) {
        this._startEditingCalculation$1();
    }
}
tab.CalculationEditorViewModel.canAccept = function tab_CalculationEditorViewModel$canAccept(d) {
    var drag = Type.safeCast(d, tab.BaseFieldDragInstance);
    if (!d.get_hasPayload() || ss.isNullOrUndefined(drag)) {
        return false;
    }
    if (Type.canCast(drag, tab.PillDragInstance)) {
        var draggedObjects = drag.get_fields();
        if (draggedObjects == null) {
            return false;
        }
        return _.every(draggedObjects, function(fieldModel) {
            return fieldModel.get_isAllowedInCalcs() || fieldModel.get_isUnnamedCalc();
        });
    }
    else if (Type.canCast(drag, tab.CalcTextDragInstance)) {
        return true;
    }
    return false;
}
tab.CalculationEditorViewModel.prototype = {
    _calculationModel$1: null,
    _functionListViewModel$1: null,
    _calcCaption$1: null,
    _calcTokens$1: null,
    _calcFormula$1: null,
    _validationTimeoutHandle$1: null,
    _validationRequestCount$1: 0,
    _calcSnapshot$1: null,
    _dirtyState$1: false,
    _allowAutoCompleteRequests$1: true,
    
    add_calculationUpdated: function tab_CalculationEditorViewModel$add_calculationUpdated(value) {
        this.__calculationUpdated$1 = ss.Delegate.combine(this.__calculationUpdated$1, value);
    },
    remove_calculationUpdated: function tab_CalculationEditorViewModel$remove_calculationUpdated(value) {
        this.__calculationUpdated$1 = ss.Delegate.remove(this.__calculationUpdated$1, value);
    },
    
    __calculationUpdated$1: null,
    
    add_calculationEdited: function tab_CalculationEditorViewModel$add_calculationEdited(value) {
        this.__calculationEdited$1 = ss.Delegate.combine(this.__calculationEdited$1, value);
    },
    remove_calculationEdited: function tab_CalculationEditorViewModel$remove_calculationEdited(value) {
        this.__calculationEdited$1 = ss.Delegate.remove(this.__calculationEdited$1, value);
    },
    
    __calculationEdited$1: null,
    
    add_calculationCanceled: function tab_CalculationEditorViewModel$add_calculationCanceled(value) {
        this.__calculationCanceled$1 = ss.Delegate.combine(this.__calculationCanceled$1, value);
    },
    remove_calculationCanceled: function tab_CalculationEditorViewModel$remove_calculationCanceled(value) {
        this.__calculationCanceled$1 = ss.Delegate.remove(this.__calculationCanceled$1, value);
    },
    
    __calculationCanceled$1: null,
    
    add_dropStateChanged: function tab_CalculationEditorViewModel$add_dropStateChanged(value) {
        this.__dropStateChanged$1 = ss.Delegate.combine(this.__dropStateChanged$1, value);
    },
    remove_dropStateChanged: function tab_CalculationEditorViewModel$remove_dropStateChanged(value) {
        this.__dropStateChanged$1 = ss.Delegate.remove(this.__dropStateChanged$1, value);
    },
    
    __dropStateChanged$1: null,
    
    add_dirtyStateChanged: function tab_CalculationEditorViewModel$add_dirtyStateChanged(value) {
        this.__dirtyStateChanged$1 = ss.Delegate.combine(this.__dirtyStateChanged$1, value);
    },
    remove_dirtyStateChanged: function tab_CalculationEditorViewModel$remove_dirtyStateChanged(value) {
        this.__dirtyStateChanged$1 = ss.Delegate.remove(this.__dirtyStateChanged$1, value);
    },
    
    __dirtyStateChanged$1: null,
    
    add_dropCommandCompleted: function tab_CalculationEditorViewModel$add_dropCommandCompleted(value) {
        this.__dropCommandCompleted$1 = ss.Delegate.combine(this.__dropCommandCompleted$1, value);
    },
    remove_dropCommandCompleted: function tab_CalculationEditorViewModel$remove_dropCommandCompleted(value) {
        this.__dropCommandCompleted$1 = ss.Delegate.remove(this.__dropCommandCompleted$1, value);
    },
    
    __dropCommandCompleted$1: null,
    
    add_insertFunctionCompleted: function tab_CalculationEditorViewModel$add_insertFunctionCompleted(value) {
        this.__insertFunctionCompleted$1 = ss.Delegate.combine(this.__insertFunctionCompleted$1, value);
    },
    remove_insertFunctionCompleted: function tab_CalculationEditorViewModel$remove_insertFunctionCompleted(value) {
        this.__insertFunctionCompleted$1 = ss.Delegate.remove(this.__insertFunctionCompleted$1, value);
    },
    
    __insertFunctionCompleted$1: null,
    
    add_applyErrorMessageCompleted: function tab_CalculationEditorViewModel$add_applyErrorMessageCompleted(value) {
        this.__applyErrorMessageCompleted$1 = ss.Delegate.combine(this.__applyErrorMessageCompleted$1, value);
    },
    remove_applyErrorMessageCompleted: function tab_CalculationEditorViewModel$remove_applyErrorMessageCompleted(value) {
        this.__applyErrorMessageCompleted$1 = ss.Delegate.remove(this.__applyErrorMessageCompleted$1, value);
    },
    
    __applyErrorMessageCompleted$1: null,
    
    add_applyCalculationSuccess: function tab_CalculationEditorViewModel$add_applyCalculationSuccess(value) {
        this.__applyCalculationSuccess$1 = ss.Delegate.combine(this.__applyCalculationSuccess$1, value);
    },
    remove_applyCalculationSuccess: function tab_CalculationEditorViewModel$remove_applyCalculationSuccess(value) {
        this.__applyCalculationSuccess$1 = ss.Delegate.remove(this.__applyCalculationSuccess$1, value);
    },
    
    __applyCalculationSuccess$1: null,
    
    get__modelHasCalculation$1: function tab_CalculationEditorViewModel$get__modelHasCalculation$1() {
        return ss.isValue(this._calculationModel$1) && this._calculationModel$1.get_hasCalculation();
    },
    
    get_hasCalculation: function tab_CalculationEditorViewModel$get_hasCalculation() {
        return this.get__modelHasCalculation$1() && ss.isValue(this._calcSnapshot$1);
    },
    
    get_isNewCalculation: function tab_CalculationEditorViewModel$get_isNewCalculation() {
        return this._calculationModel$1.get_isNewCalculation();
    },
    
    get_isDirty: function tab_CalculationEditorViewModel$get_isDirty() {
        return this._dirtyState$1;
    },
    set_isDirty: function tab_CalculationEditorViewModel$set_isDirty(value) {
        if (this._dirtyState$1 !== value) {
            this._dirtyState$1 = value;
            if (ss.isValue(this.__dirtyStateChanged$1)) {
                this.__dirtyStateChanged$1(this._dirtyState$1);
            }
        }
        return value;
    },
    
    get_isCaptionDirty: function tab_CalculationEditorViewModel$get_isCaptionDirty() {
        return ss.isValue(this._calcSnapshot$1) && this._calcSnapshot$1.isCaptionDirty(this.get_caption());
    },
    
    get_isFormulaDirty: function tab_CalculationEditorViewModel$get_isFormulaDirty() {
        return ss.isValue(this._calcSnapshot$1) && this._calcSnapshot$1.isFormulaDirty(this.get_formula());
    },
    
    get_shelfType: function tab_CalculationEditorViewModel$get_shelfType() {
        return this._calculationModel$1.get_adHocShelf();
    },
    
    get_shelfPaneSpecId: function tab_CalculationEditorViewModel$get_shelfPaneSpecId() {
        return this._calculationModel$1.get_adHocPaneSpecId();
    },
    
    get_shelfPosition: function tab_CalculationEditorViewModel$get_shelfPosition() {
        return this._calculationModel$1.get_adHocShelfPosition();
    },
    
    get_tokens: function tab_CalculationEditorViewModel$get_tokens() {
        return this._calcTokens$1;
    },
    
    get_errors: function tab_CalculationEditorViewModel$get_errors() {
        return this._calculationModel$1.get_errors();
    },
    
    get_caption: function tab_CalculationEditorViewModel$get_caption() {
        return this._calcCaption$1;
    },
    set_caption: function tab_CalculationEditorViewModel$set_caption(value) {
        if (this._calcCaption$1 !== value) {
            tab.Log.get(this).debug('Updating calculation caption: %s', value);
            this._calcCaption$1 = value;
            this._validateCalculation$1();
            this._updateDirty$1();
        }
        return value;
    },
    
    get_formula: function tab_CalculationEditorViewModel$get_formula() {
        return this._calcFormula$1;
    },
    set_formula: function tab_CalculationEditorViewModel$set_formula(value) {
        if (this._calcFormula$1 !== value) {
            this._calcFormula$1 = value;
            this._validateCalculation$1();
            this._updateDirty$1();
        }
        return value;
    },
    
    get_dataSourceCaption: function tab_CalculationEditorViewModel$get_dataSourceCaption() {
        return this._calculationModel$1.get_dataSourceCaption();
    },
    
    get_shouldShowDataSourceCaption: function tab_CalculationEditorViewModel$get_shouldShowDataSourceCaption() {
        var dataSchema = tab.ApplicationModel.get_instance().get_workbook().get_dataSchema();
        if (ss.isNullOrUndefined(dataSchema)) {
            return false;
        }
        else {
            return dataSchema.getDataSourceCount(false) > 1;
        }
    },
    
    get_hasErrors: function tab_CalculationEditorViewModel$get_hasErrors() {
        return this._calculationModel$1.get_errors().length > 0;
    },
    
    get_hasDependencies: function tab_CalculationEditorViewModel$get_hasDependencies() {
        return !String.isNullOrEmpty(this.get_dependencies());
    },
    
    get_dependencies: function tab_CalculationEditorViewModel$get_dependencies() {
        return this._calculationModel$1.get_dependencies();
    },
    
    get_functionListViewModel: function tab_CalculationEditorViewModel$get_functionListViewModel() {
        return this._functionListViewModel$1;
    },
    
    get_dropState: function tab_CalculationEditorViewModel$get_dropState() {
        return this._dropState$1;
    },
    set_dropState: function tab_CalculationEditorViewModel$set_dropState(value) {
        if (this._dropState$1 === value) {
            return;
        }
        this._dropState$1 = value;
        if (ss.isValue(this.__dropStateChanged$1)) {
            this.__dropStateChanged$1(this._dropState$1);
        }
        return value;
    },
    
    dispose: function tab_CalculationEditorViewModel$dispose() {
        this._clearValidationTimeout$1();
        this._calculationModel$1.remove_calculationUpdated(ss.Delegate.create(this, this._onCalculationUpdated$1));
        if (ss.isValue(this._functionListViewModel$1)) {
            this._functionListViewModel$1.dispose();
        }
        spiff.DragDropManager.remove_dragStarted(ss.Delegate.create(this, this.dragStarted));
        spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this.dragEnded));
        tab.CalculationEditorViewModel.callBaseMethod(this, 'dispose');
    },
    
    isValidFormula: function tab_CalculationEditorViewModel$isValidFormula() {
        return !this._validationRequestCount$1 && !String.isNullOrEmpty(this.get_formula()) && !this.get_errors().length;
    },
    
    isCaptionStringDirty: function tab_CalculationEditorViewModel$isCaptionStringDirty(caption) {
        return ss.isValue(this._calcSnapshot$1) && this._calcSnapshot$1.isCaptionDirty(caption);
    },
    
    _updateDirty$1: function tab_CalculationEditorViewModel$_updateDirty$1() {
        this.set_isDirty(ss.isValue(this._calcSnapshot$1) && this._calcSnapshot$1.isDirty(this));
    },
    
    _updateCalcSnapshot$1: function tab_CalculationEditorViewModel$_updateCalcSnapshot$1() {
        if (!this._calculationModel$1.get_hasCalculation()) {
            this._calcSnapshot$1 = null;
        }
        else if (String.isNullOrEmpty(this._calculationModel$1.get_fieldName())) {
            this._calcSnapshot$1 = new tab._calculationSnapshot(this._calculationModel$1.get_name(), this._calculationModel$1.get_caption(), '');
        }
        else {
            this._calcSnapshot$1 = new tab._calculationSnapshot(this._calculationModel$1.get_name(), this._calculationModel$1.get_caption(), this._calculationModel$1.get_formula());
        }
    },
    
    applyCalculation: function tab_CalculationEditorViewModel$applyCalculation(pillViewModel, closeOnCommit) {
        if (!this.get__modelHasCalculation$1()) {
            ss.Debug.fail("There should be no way to apply a calc that doesn't exist");
            return;
        }
        this._clearValidationTimeout$1();
        if (this._calculationModel$1.get_isAdhoc() && tab.MiscUtil.isNullOrEmpty(this._calcFormula$1)) {
            if (pillViewModel != null) {
                tab.ShelfClientCommands.removeShelfPill(pillViewModel.get_shelf().get_shelf(), pillViewModel.get_pill());
            }
            if (closeOnCommit) {
                this.cancelCalculation();
            }
            this._fireApplyCalculationSuccess$1(closeOnCommit);
            return;
        }
        this.set_isDirty(false);
        var previousSnapshot = this._calcSnapshot$1;
        this._calcSnapshot$1 = new tab._calculationSnapshot(previousSnapshot.get_name(), this._calcCaption$1, this._calcFormula$1);
        var d = tab.CalculationCommands.applyCalculation(this._calculationModel$1, this._calcCaption$1, this._calcFormula$1, false, closeOnCommit);
        d.done(ss.Delegate.create(this, function(response) {
            if (response.get_resultType() === 'succeed') {
                this._updateCalcSnapshot$1();
                this._fireApplyCalculationSuccess$1(closeOnCommit);
            }
            else {
                this._calcSnapshot$1 = previousSnapshot;
                var allowReApply = response.get_resultType() !== 'invalid-caption-for-new-calc';
                this.showApplyCalcErrorDialog(response.get_errorMessage(), allowReApply);
            }
        })).always(ss.Delegate.create(this, function() {
            this._updateDirty$1();
        }));
    },
    
    showApplyCalcErrorDialog: function tab_CalculationEditorViewModel$showApplyCalcErrorDialog(errorMsg, allowReApply) {
        if (String.isNullOrEmpty(errorMsg)) {
            return;
        }
        var dlgViewModel = tab.ConfirmationViewModel.create(errorMsg.htmlEncode(), ss.Delegate.create(this, function(dlgResult) {
            if (dlgResult === 'deny') {
                tab.CalculationCommands.applyCalculation(this._calculationModel$1, this._calcCaption$1, this._calcFormula$1, true, false);
            }
            this.raiseActionEvent(this.__applyErrorMessageCompleted$1);
        }));
        if (!allowReApply) {
            dlgViewModel.set_showDenyButton(false);
            dlgViewModel.set_confirmText(tab.Strings.DialogButtonOK);
        }
        dlgViewModel.show();
    },
    
    _fireApplyCalculationSuccess$1: function tab_CalculationEditorViewModel$_fireApplyCalculationSuccess$1(closeOnCommit) {
        if (ss.isValue(this.__applyCalculationSuccess$1)) {
            this.__applyCalculationSuccess$1(closeOnCommit);
        }
    },
    
    cancelCalculation: function tab_CalculationEditorViewModel$cancelCalculation() {
        this._clearValidationTimeout$1();
        tab.CalculationCommands.cancelCalculation(this._calculationModel$1);
    },
    
    _clearValidationTimeout$1: function tab_CalculationEditorViewModel$_clearValidationTimeout$1() {
        if (ss.isValue(this._validationTimeoutHandle$1)) {
            window.clearTimeout(this._validationTimeoutHandle$1);
            this._validationTimeoutHandle$1 = null;
        }
    },
    
    _onCalculationUpdated$1: function tab_CalculationEditorViewModel$_onCalculationUpdated$1() {
        if (!this.get__modelHasCalculation$1()) {
            if (ss.isValue(this._calcSnapshot$1)) {
                this._updateCalcSnapshot$1();
                tab.Log.get(this).debug('Cancel calc');
                this.raiseActionEvent(this.__calculationCanceled$1);
            }
            this._updateDirty$1();
        }
        else if (ss.isValue(this._calcSnapshot$1) && this._calcSnapshot$1.get_name() === this._calculationModel$1.get_name()) {
            if (!this._validationRequestCount$1 && this._validationTimeoutHandle$1 == null) {
                this._updateCalcValues$1();
                tab.Log.get(this).debug('Update calc');
                this.raiseActionEvent(this.__calculationUpdated$1);
            }
        }
        else {
            tab.Log.get(this).debug('Edit calc');
            this._startEditingCalculation$1();
        }
    },
    
    _startEditingCalculation$1: function tab_CalculationEditorViewModel$_startEditingCalculation$1() {
        try {
            this._allowAutoCompleteRequests$1 = false;
            this._updateCalcSnapshot$1();
            this._updateCalcValues$1();
            this.raiseActionEvent(this.__calculationEdited$1);
        }
        finally {
            this._allowAutoCompleteRequests$1 = true;
        }
    },
    
    _updateCalcValues$1: function tab_CalculationEditorViewModel$_updateCalcValues$1() {
        this._calcCaption$1 = this._calculationModel$1.get_caption();
        this._calcTokens$1 = this._calculationModel$1.get_tokens();
        this._calcFormula$1 = this._calculationModel$1.get_formula();
        this._updateDirty$1();
    },
    
    requestAutoCompleteMenu: function tab_CalculationEditorViewModel$requestAutoCompleteMenu(context, position) {
        if (this._allowAutoCompleteRequests$1 && this.get_hasCalculation()) {
            return tab.CalculationCommands.requestAutoCompleteInfoWithContext(context, position, this._calculationModel$1.get_isAdhoc());
        }
        else {
            return $.DeferredData().reject();
        }
    },
    
    getDragInstanceForText: function tab_CalculationEditorViewModel$getDragInstanceForText(text) {
        var d = new tab.CalcTextDragInstance(text);
        var deferredDrag = tab.CalculationCommands.startDraggingText(text);
        deferredDrag.done(function(dragText) {
            if (ss.isValue(dragText) && ss.isValue(dragText)) {
                d.resolve(dragText);
            }
            else {
                d.reject(dragText);
            }
        });
        return d;
    },
    
    dragStarted: function tab_CalculationEditorViewModel$dragStarted(d) {
        if (d.get_dragType() === 'dragdrop') {
            this.set_dropState((tab.CalculationEditorViewModel.canAccept(d)) ? 1 : 2);
        }
        else {
            this.set_dropState(0);
        }
    },
    
    dragEnded: function tab_CalculationEditorViewModel$dragEnded(d) {
        this.set_dropState(0);
    },
    
    handleDrop: function tab_CalculationEditorViewModel$handleDrop(d, dropPosition, selection) {
        var result = $.DeferredData();
        if (!(Type.canCast(d, tab.BaseFieldDragInstance))) {
            result.resolve(false);
            return result;
        }
        var doHandleDrop = ss.Delegate.create(this, function(drag) {
            var willAccept = tab.CalculationEditorViewModel.canAccept(drag);
            if (!willAccept) {
                tab.Log.get(this).debug('Rejecting drop: %o', drag);
            }
            else if (drag.hasOnlyFields()) {
                tab.Log.get(this).debug('Accepting fields: %o', drag);
                var fieldNames = _.map(drag.get_fields(), function(field) {
                    return field.get_globalName();
                });
                this._flushPendingValidation$1();
                var deferredDrop;
                if (Type.canCast(drag, tab.CalcTextDragInstance)) {
                    var draggedText = (drag).get_text();
                    deferredDrop = tab.CalculationCommands.dropOnCalcEditor(fieldNames, dropPosition, 'drag-drop-dialog', selection, this._calculationModel$1.get_isAdhoc(), draggedText);
                }
                else {
                    deferredDrop = tab.CalculationCommands.dropOnCalcEditor(fieldNames, dropPosition, 'drag-drop-schema', selection, this._calculationModel$1.get_isAdhoc());
                }
                deferredDrop.done(ss.Delegate.create(this, this._fireDropCommandCompleted$1));
            }
            else if (drag.hasOnlyPills()) {
                tab.Log.get(this).debug('Accepting pill: %o', drag);
                var pillNames = [];
                pillNames.add(drag.get_pill().get_field().get_globalName());
                this._flushPendingValidation$1();
                var deferredDrop = tab.CalculationCommands.dropOnCalcEditor(pillNames, dropPosition, 'drag-drop-viz', selection, this._calculationModel$1.get_isAdhoc());
                deferredDrop.done(ss.Delegate.create(this, this._fireDropCommandCompleted$1));
            }
            result.resolve(willAccept);
        });
        var pd = Type.safeCast(d, tab.BaseFieldDragInstance);
        if (pd.get_drop().isResolved()) {
            doHandleDrop(pd);
        }
        else {
            pd.get_drop().done(doHandleDrop);
        }
        return result;
    },
    
    insertFunction: function tab_CalculationEditorViewModel$insertFunction(funcModel, selection) {
        var formula = this.get_formula();
        var deferred = tab.CalculationCommands.insertFunctionInFormula(funcModel, formula, selection);
        deferred.done(ss.Delegate.create(this, function(result) {
            if (ss.isNullOrUndefined(result) || _.isString(result)) {
                return;
            }
            var r = result;
            var replacementText = r['text'];
            var newCursorIndex = r['selectionEnd'];
            formula = formula.substr(0, selection.calcEditorTextSelectionStartPos) + replacementText + formula.substr(selection.calcEditorTextSelectionEndPos);
            if (ss.isValue(this.__insertFunctionCompleted$1)) {
                this.__insertFunctionCompleted$1(formula, newCursorIndex);
            }
            else {
                this.set_formula(formula);
            }
        }));
    },
    
    _validateCalculation$1: function tab_CalculationEditorViewModel$_validateCalculation$1() {
        this._clearValidationTimeout$1();
        this._validationTimeoutHandle$1 = window.setTimeout(ss.Delegate.create(this, function() {
            this._flushPendingValidation$1();
        }), 250);
    },
    
    _flushPendingValidation$1: function tab_CalculationEditorViewModel$_flushPendingValidation$1() {
        if (ss.isNullOrUndefined(this._validationTimeoutHandle$1)) {
            return;
        }
        this._clearValidationTimeout$1();
        this._validationRequestCount$1++;
        var d = tab.CalculationCommands.validateCalculation(this._calculationModel$1, this._calcCaption$1, this._calcFormula$1);
        d.always(ss.Delegate.create(this, function() {
            this._validationRequestCount$1--;
        }));
    },
    
    _fireDropCommandCompleted$1: function tab_CalculationEditorViewModel$_fireDropCommandCompleted$1(cursorIndex) {
        if (ss.isValue(this.__dropCommandCompleted$1)) {
            this.__dropCommandCompleted$1(cursorIndex);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._calculationSnapshot

tab._calculationSnapshot = function tab__calculationSnapshot(name, caption, formula) {
    this._name = name;
    this._caption = caption;
    this._formula = formula;
}
tab._calculationSnapshot.prototype = {
    _name: null,
    _caption: null,
    _formula: null,
    
    get_name: function tab__calculationSnapshot$get_name() {
        return this._name;
    },
    
    isDirty: function tab__calculationSnapshot$isDirty(vm) {
        return this.isCaptionDirty(vm.get_caption()) || this.isFormulaDirty(vm.get_formula());
    },
    
    isCaptionDirty: function tab__calculationSnapshot$isCaptionDirty(s) {
        return this._caption !== s;
    },
    
    isFormulaDirty: function tab__calculationSnapshot$isFormulaDirty(s) {
        return this._formula !== s;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CardViewModel

tab.CardViewModel = function tab_CardViewModel() {
    tab.CardViewModel.initializeBase(this);
}
tab.CardViewModel.prototype = {
    _orientation$1: 0,
    _isCollapsed$1: false,
    _content$1: null,
    
    add_cardChanged: function tab_CardViewModel$add_cardChanged(value) {
        this.__cardChanged$1 = ss.Delegate.combine(this.__cardChanged$1, value);
    },
    remove_cardChanged: function tab_CardViewModel$remove_cardChanged(value) {
        this.__cardChanged$1 = ss.Delegate.remove(this.__cardChanged$1, value);
    },
    
    __cardChanged$1: null,
    
    add_collapsedChanged: function tab_CardViewModel$add_collapsedChanged(value) {
        this.__collapsedChanged$1 = ss.Delegate.combine(this.__collapsedChanged$1, value);
    },
    remove_collapsedChanged: function tab_CardViewModel$remove_collapsedChanged(value) {
        this.__collapsedChanged$1 = ss.Delegate.remove(this.__collapsedChanged$1, value);
    },
    
    __collapsedChanged$1: null,
    
    add_contentDropStateChanged: function tab_CardViewModel$add_contentDropStateChanged(value) {
        this.__contentDropStateChanged$1 = ss.Delegate.combine(this.__contentDropStateChanged$1, value);
    },
    remove_contentDropStateChanged: function tab_CardViewModel$remove_contentDropStateChanged(value) {
        this.__contentDropStateChanged$1 = ss.Delegate.remove(this.__contentDropStateChanged$1, value);
    },
    
    __contentDropStateChanged$1: null,
    
    get_orientation: function tab_CardViewModel$get_orientation() {
        return this._orientation$1;
    },
    set_orientation: function tab_CardViewModel$set_orientation(value) {
        this._orientation$1 = value;
        this.handleCardChanged();
        return value;
    },
    
    get_isVisible: function tab_CardViewModel$get_isVisible() {
        return ss.isValue(this._content$1) && this._content$1.get_isVisible();
    },
    
    get_isCollapsible: function tab_CardViewModel$get_isCollapsible() {
        return !this._orientation$1;
    },
    
    get_isCollapsed: function tab_CardViewModel$get_isCollapsed() {
        return this._isCollapsed$1;
    },
    set_isCollapsed: function tab_CardViewModel$set_isCollapsed(value) {
        this._isCollapsed$1 = value;
        this.handleCollapsedChanged();
        return value;
    },
    
    get_hasIcon: function tab_CardViewModel$get_hasIcon() {
        return this._orientation$1 === 1;
    },
    
    get_iconClass: function tab_CardViewModel$get_iconClass() {
        var vm = this._content$1;
        switch (vm.get_shelfType()) {
            case 'rows-shelf':
                return 'Rows';
            case 'columns-shelf':
                return 'Columns';
            default:
                return null;
        }
    },
    
    get_content: function tab_CardViewModel$get_content() {
        return this._content$1;
    },
    set_content: function tab_CardViewModel$set_content(value) {
        if (ss.isValue(this._content$1)) {
            this._content$1.remove_dropStateChanged(ss.Delegate.create(this, this._handleContentDropStateChanged$1));
            this._content$1.remove_visibleChanged(ss.Delegate.create(this, this._handleContentVisibleChanged$1));
        }
        this._content$1 = value;
        if (ss.isValue(this._content$1)) {
            this._content$1.add_dropStateChanged(ss.Delegate.create(this, this._handleContentDropStateChanged$1));
            this._content$1.add_visibleChanged(ss.Delegate.create(this, this._handleContentVisibleChanged$1));
        }
        this.handleCardChanged();
        return value;
    },
    
    toggleExpanded: function tab_CardViewModel$toggleExpanded() {
        if (!this.get_isCollapsible()) {
            return;
        }
        this.set_isCollapsed(!this._isCollapsed$1);
    },
    
    handleCardChanged: function tab_CardViewModel$handleCardChanged() {
        if (ss.isValue(this.__cardChanged$1)) {
            this.__cardChanged$1(this);
        }
    },
    
    handleCollapsedChanged: function tab_CardViewModel$handleCollapsedChanged() {
        if (ss.isValue(this.__collapsedChanged$1)) {
            this.__collapsedChanged$1(this);
        }
    },
    
    _handleContentDropStateChanged$1: function tab_CardViewModel$_handleContentDropStateChanged$1(state) {
        if (ss.isNullOrUndefined(this.__contentDropStateChanged$1)) {
            return;
        }
        this.__contentDropStateChanged$1(state);
    },
    
    _handleContentVisibleChanged$1: function tab_CardViewModel$_handleContentVisibleChanged$1() {
        this.handleCardChanged();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPickerViewModel

tab.ColorPickerViewModel = function tab_ColorPickerViewModel(layerEncodingModel) {
    tab.ColorPickerViewModel.initializeBase(this, [ layerEncodingModel ]);
}
tab.ColorPickerViewModel.prototype = {
    _selectedColor$2: null,
    
    get_viewType: function tab_ColorPickerViewModel$get_viewType() {
        return tab.ColorPickerView;
    },
    
    get_selectedColor: function tab_ColorPickerViewModel$get_selectedColor() {
        return this._selectedColor$2;
    },
    set_selectedColor: function tab_ColorPickerViewModel$set_selectedColor(value) {
        if (this._selectedColor$2 === value) {
            return;
        }
        this._selectedColor$2 = value;
        tab.PaneClientCommands.setDefaultColor(this.get_layerEncodingModel(), this._selectedColor$2);
        return value;
    },
    
    get_blackAndWhiteColors: function tab_ColorPickerViewModel$get_blackAndWhiteColors() {
        return _.map(tab.ColorPickerViewModel._blackAndWhite$2, function(s) {
            return tab.ColorModel.fromColorCode(s);
        });
    },
    
    get_lightGrayColors: function tab_ColorPickerViewModel$get_lightGrayColors() {
        return _.map(tab.ColorPickerViewModel._lightGrays$2, function(s) {
            return tab.ColorModel.fromColorCode(s);
        });
    },
    
    get_darkGrayColors: function tab_ColorPickerViewModel$get_darkGrayColors() {
        return _.map(tab.ColorPickerViewModel._darkGrays$2, function(s) {
            return tab.ColorModel.fromColorCode(s);
        });
    },
    
    get_presetColors1: function tab_ColorPickerViewModel$get_presetColors1() {
        return _.map(tab.ColorPickerViewModel._presets1$2, function(s) {
            return tab.ColorModel.fromColorCode(s);
        });
    },
    
    get_presetColors2: function tab_ColorPickerViewModel$get_presetColors2() {
        return _.map(tab.ColorPickerViewModel._presets2$2, function(s) {
            return tab.ColorModel.fromColorCode(s);
        });
    },
    
    update: function tab_ColorPickerViewModel$update(color) {
        this._selectedColor$2 = color;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.IconUtils

tab.IconUtils = function tab_IconUtils() {
}
tab.IconUtils.getPrimitiveTypeIcon = function tab_IconUtils$getPrimitiveTypeIcon(type) {
    var pt = type.primitiveType;
    return 'tabAuthPrimitive-' + pt;
}
tab.IconUtils.getFieldIcon = function tab_IconUtils$getFieldIcon(f) {
    if (!ss.isValue(f.fieldIconResource)) {
        return '';
    }
    var classBuilder = new ss.StringBuilder('tab-schema-');
    classBuilder.append(f.fieldIconResource);
    classBuilder.append('-icon');
    return classBuilder.toString();
}
tab.IconUtils.getDataSourceIcon = function tab_IconUtils$getDataSourceIcon(iconMap, source) {
    if (ss.isNullOrUndefined(iconMap)) {
        return '';
    }
    var iconRes = (Object.keyExists(iconMap, source.get_name())) ? iconMap[source.get_name()] : null;
    if (!ss.isValue(iconRes)) {
        return '';
    }
    var classBuilder = new ss.StringBuilder('tab-schema-');
    classBuilder.append(iconRes);
    classBuilder.append('-icon');
    return classBuilder.toString();
}
tab.IconUtils.getPillEncodingTypeIcon = function tab_IconUtils$getPillEncodingTypeIcon(p) {
    if (ss.isNullOrUndefined(p.get_encodingType())) {
        return null;
    }
    return tab.IconUtils.getEncodingTypeIcon(p.get_encodingType());
}
tab.IconUtils.getEncodingTypeIcon = function tab_IconUtils$getEncodingTypeIcon(et) {
    switch (et) {
        case 'color-encoding':
        case 'size-encoding':
        case 'text-encoding':
        case 'shape-encoding':
        case 'sort-encoding':
        case 'wedge-size-encoding':
            return 'tabAuth-' + et;
        default:
            return 'tabAuth-lod-encoding';
    }
}
tab.IconUtils.getPillFilterTypeIcon = function tab_IconUtils$getPillFilterTypeIcon(p) {
    if (ss.isNullOrUndefined(p.get_filterType())) {
        return null;
    }
    switch (p.get_filterType()) {
        case 'global-filter':
            return 'tabAuthPillGlobalFilter';
        case 'shared-filter':
            return 'tabAuthPillSharedFilter';
        case 'slice-filter':
            return 'tabAuthPillSliceFilter';
        default:
            return null;
    }
}
tab.IconUtils.getPillIcons = function tab_IconUtils$getPillIcons(p) {
    var types = p.get_item().shelfIconTypes;
    if (ss.isNullOrUndefined(types) || !types.length) {
        return [];
    }
    var results = [];
    var $enum1 = ss.IEnumerator.getEnumerator(types);
    while ($enum1.moveNext()) {
        var iconType = $enum1.current;
        switch (iconType) {
            case 'secondary-datasource':
                results.add('tabAuthPillIconSecondary');
                break;
            case 'table-calc':
                results.add('tabAuthPillIconTableCalc');
                break;
            case 'table-calc-secondary':
                results.add('tabAuthPillIconTableCalcSecondary');
                break;
            case 'sort-asc':
                results.add('tabAuthPillIconSortAscending');
                break;
            case 'sort-desc':
                results.add('tabAuthPillIconSortDescending');
                break;
            case 'forecast':
                results.add('tabAuthPillIconForecast');
                break;
            case 'remote':
                break;
        }
        if ('group' === iconType) {
            results.add('tabAuthPillIconSet');
        }
    }
    return results;
}
tab.IconUtils.getLayerIcon = function tab_IconUtils$getLayerIcon(layer) {
    return (ss.isValue(layer.get_currentPrimitiveType()) && layer.get_currentPrimitiveType().primitiveType === 'multiple') ? '' : tab.IconUtils.getPrimitiveTypeIcon(layer.get_currentPrimitiveType());
}


////////////////////////////////////////////////////////////////////////////////
// tab.LayerEncodingViewModel

tab.LayerEncodingViewModel = function tab_LayerEncodingViewModel() {
    this._encodingShelf$1 = new tab.ShelfViewModel();
    this._dragOverEncoding$1 = 'invalid-encoding';
    tab.LayerEncodingViewModel.initializeBase(this);
    spiff.DragDropManager.add_dragStarted(ss.Delegate.create(this, this.dragStarted));
    spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this.dragEnded));
}
tab.LayerEncodingViewModel._isPillOfEncodingType$1 = function tab_LayerEncodingViewModel$_isPillOfEncodingType$1(m, et) {
    return m.get_item().encodingType === et;
}
tab.LayerEncodingViewModel.prototype = {
    layerEncoding: null,
    _validDropEncodings$1: null,
    
    add_modelChanged: function tab_LayerEncodingViewModel$add_modelChanged(value) {
        this.__modelChanged$1 = ss.Delegate.combine(this.__modelChanged$1, value);
    },
    remove_modelChanged: function tab_LayerEncodingViewModel$remove_modelChanged(value) {
        this.__modelChanged$1 = ss.Delegate.remove(this.__modelChanged$1, value);
    },
    
    __modelChanged$1: null,
    
    add_dragOverEncodingChanged: function tab_LayerEncodingViewModel$add_dragOverEncodingChanged(value) {
        this.__dragOverEncodingChanged$1 = ss.Delegate.combine(this.__dragOverEncodingChanged$1, value);
    },
    remove_dragOverEncodingChanged: function tab_LayerEncodingViewModel$remove_dragOverEncodingChanged(value) {
        this.__dragOverEncodingChanged$1 = ss.Delegate.remove(this.__dragOverEncodingChanged$1, value);
    },
    
    __dragOverEncodingChanged$1: null,
    
    add_validDropEncodingsChanged: function tab_LayerEncodingViewModel$add_validDropEncodingsChanged(value) {
        this.__validDropEncodingsChanged$1 = ss.Delegate.combine(this.__validDropEncodingsChanged$1, value);
    },
    remove_validDropEncodingsChanged: function tab_LayerEncodingViewModel$remove_validDropEncodingsChanged(value) {
        this.__validDropEncodingsChanged$1 = ss.Delegate.remove(this.__validDropEncodingsChanged$1, value);
    },
    
    __validDropEncodingsChanged$1: null,
    
    get_validDropEncodings: function tab_LayerEncodingViewModel$get_validDropEncodings() {
        return this._validDropEncodings$1;
    },
    set_validDropEncodings: function tab_LayerEncodingViewModel$set_validDropEncodings(value) {
        this._validDropEncodings$1 = value;
        if (ss.isValue(this.__validDropEncodingsChanged$1)) {
            this.__validDropEncodingsChanged$1(this._validDropEncodings$1);
        }
        return value;
    },
    
    get_layerEncoding: function tab_LayerEncodingViewModel$get_layerEncoding() {
        return this.layerEncoding;
    },
    
    get_encodingShelf: function tab_LayerEncodingViewModel$get_encodingShelf() {
        return this._encodingShelf$1;
    },
    
    get_dragOverEncoding: function tab_LayerEncodingViewModel$get_dragOverEncoding() {
        return this._dragOverEncoding$1;
    },
    set_dragOverEncoding: function tab_LayerEncodingViewModel$set_dragOverEncoding(value) {
        if (this._dragOverEncoding$1 === value) {
            return;
        }
        tab.Log.get(this).debug('Set DragOverEncoding: %o', value);
        this._dragOverEncoding$1 = value;
        if (ss.isValue(this.__dragOverEncodingChanged$1)) {
            this.__dragOverEncodingChanged$1(this._dragOverEncoding$1);
        }
        return value;
    },
    
    dispose: function tab_LayerEncodingViewModel$dispose() {
        spiff.DragDropManager.remove_dragStarted(ss.Delegate.create(this, this.dragStarted));
        spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this.dragEnded));
        this._encodingShelf$1.dispose();
        tab.LayerEncodingViewModel.callBaseMethod(this, 'dispose');
    },
    
    getEncodingTypeTooltip: function tab_LayerEncodingViewModel$getEncodingTypeTooltip(et) {
        return (this.isEncodingClickable(et)) ? tab.Strings.AuthMarksCardEncodingTooltipOptions : tab.Strings.AuthMarksCardEncodingTooltipBasic;
    },
    
    createEncodingButtonDropTarget: function tab_LayerEncodingViewModel$createEncodingButtonDropTarget(et) {
        return new tab._encodingButtonDropTarget(this, ss.Delegate.create(this, function() {
            this.set_dragOverEncoding(et);
        }), ss.Delegate.create(this, function() {
            this.set_dragOverEncoding('invalid-encoding');
        }), et);
    },
    
    acceptDrop: function tab_LayerEncodingViewModel$acceptDrop(d, et) {
        tab.Log.get(this).debug('Dropping field onto encoding type button: field=%o, et=%s', d.get_payload(), et);
        var result = $.DeferredData();
        if (!(Type.canCast(d, tab.BaseFieldDragInstance))) {
            result.resolve(false);
            return result;
        }
        var handleDrop = ss.Delegate.create(this, function(drag) {
            var matchingDrop = null;
            if (et !== 'invalid-encoding') {
                var drops = this._encodingShelf$1.matchingDropsFrom(drag);
                if (ss.isValue(drops)) {
                    matchingDrop = _.find(drops.shelfDropPositions, function(pos) {
                        return pos.encodingType === et;
                    });
                }
            }
            var willAccept = true;
            if (drag.hasOnlyPills()) {
                var p = drag.get_pill();
                tab.Log.get(this).debug('Accepting pill: %o', p);
                if (willAccept) {
                    tab.ShelfClientCommands.movePillToEncoding(p.get_shelf().get_shelf(), this.get_encodingShelf().get_shelf(), et, p.get_pill(), drag.isCopyDrag, matchingDrop);
                }
            }
            else if (drag.hasOnlyFields()) {
                var c = drag.fieldsToDropOnShelf(this.get_encodingShelf().get_shelfType());
                tab.Log.get(this).debug('Accepting field: %o', c);
                tab.ShelfClientCommands.addEncodingFields(this.get_encodingShelf().get_shelf(), et, c, matchingDrop, d.isShiftDrag);
            }
            result.resolve(willAccept);
        });
        if ((d).get_drop().isResolved()) {
            handleDrop(d);
        }
        else {
            (d).get_drop().done(handleDrop);
        }
        return result;
    },
    
    init: function tab_LayerEncodingViewModel$init(model) {
        tab.Log.get(this).debug('Init');
        this.layerEncoding = model;
        this._raiseModelChanged$1();
    },
    
    isColorEncodingClickable: function tab_LayerEncodingViewModel$isColorEncodingClickable() {
        if (!this._hasPillWithEncodingType$1('color-encoding')) {
            return true;
        }
        if (ss.isNullOrUndefined(this.get_layerEncoding()) || ss.isNullOrUndefined(this.get_layerEncoding().get_colorEncodingDropdown())) {
            return false;
        }
        return ss.isValue(this.get_layerEncoding().get_colorEncodingDropdown().quantitativeColor) || ss.isValue(this.get_layerEncoding().get_colorEncodingDropdown().categoricalColor);
    },
    
    isEncodingClickable: function tab_LayerEncodingViewModel$isEncodingClickable(et) {
        switch (et) {
            case 'color-encoding':
                return this.isColorEncodingClickable();
            case 'text-encoding':
                return (ss.isValue(this.get_layerEncoding()) && ss.isValue(this.get_layerEncoding().get_textEncodingDropdown()));
            case 'tooltip-encoding':
                return true;
            case 'shape-encoding':
                return !this._hasPillWithEncodingType$1(et);
            case 'size-encoding':
                return true;
            default:
                return false;
        }
    },
    
    encodingTypeClicked: function tab_LayerEncodingViewModel$encodingTypeClicked(et, relativeElement) {
        if (this.isEncodingClickable(et)) {
            switch (et) {
                case 'size-encoding':
                    this._showSizeEncodingPopup$1(relativeElement);
                    break;
                case 'shape-encoding':
                    this._showShapeEncodingPopup$1(relativeElement);
                    break;
                case 'color-encoding':
                    this._showColorEncodingPopup$1(relativeElement);
                    break;
                case 'tooltip-encoding':
                    this._showTooltipEncodingPopup$1(relativeElement);
                    break;
                case 'text-encoding':
                    this._showTextEncodingPopup$1(relativeElement);
                    break;
            }
        }
    },
    
    updatePrimitive: function tab_LayerEncodingViewModel$updatePrimitive(data) {
        tab.Log.get(this).debug('Updating primitive: %o', data);
        tab.PaneClientCommands.setPanePrimitive(this.layerEncoding, data.actualPrimitiveType);
    },
    
    dragEnded: function tab_LayerEncodingViewModel$dragEnded(d) {
        this.set_validDropEncodings(null);
        this.set_dragOverEncoding('invalid-encoding');
    },
    
    dragStarted: function tab_LayerEncodingViewModel$dragStarted(d) {
        var drag = Type.safeCast(d, tab.BaseFieldDragInstance);
        if (ss.isNullOrUndefined(drag)) {
            return;
        }
        drag.get_drop().always(ss.Delegate.create(this, this._updateValidDropEncodings$1));
        var allEncodings = [];
        if (ss.isValue(this.layerEncoding) && ss.isValue(this.layerEncoding.get_encodings())) {
            var $enum1 = ss.IEnumerator.getEnumerator(this.layerEncoding.get_encodings());
            while ($enum1.moveNext()) {
                var encoding = $enum1.current;
                allEncodings.add(encoding.encodingType);
            }
        }
        this.set_validDropEncodings(allEncodings);
    },
    
    _showUberPopupUnder$1: function tab_LayerEncodingViewModel$_showUberPopupUnder$1(viewModel, relativeElement) {
        spiff.UberPopupViewModel.createForContent(viewModel).show(new spiff.UberPopupShowOptions(relativeElement));
    },
    
    _showSizeEncodingPopup$1: function tab_LayerEncodingViewModel$_showSizeEncodingPopup$1(relativeElement) {
        var sizePickerVm = new tab.MarkSizePickerViewModel(this.get_layerEncoding().get_markSizeModel());
        this._showUberPopupUnder$1(sizePickerVm, relativeElement);
    },
    
    _showShapeEncodingPopup$1: function tab_LayerEncodingViewModel$_showShapeEncodingPopup$1(relativeElement) {
        tab.PaneClientCommands.getDefaultShapeType(this.layerEncoding, ss.Delegate.create(this, function(s) {
            var pickerVm = new tab.ShapePickerViewModel();
            if (s != null) {
                pickerVm.set_selectedShape(s);
            }
            pickerVm.add_propertyChanged(ss.Delegate.create(this, function(sender, e) {
                tab.PaneClientCommands.setDefaultShapeType(this.layerEncoding, pickerVm.get_selectedShape());
            }));
            this._showUberPopupUnder$1(pickerVm, relativeElement);
        }));
    },
    
    _hasPillWithEncodingType$1: function tab_LayerEncodingViewModel$_hasPillWithEncodingType$1(et) {
        return _.any(this._encodingShelf$1.get_pills(), function(m) {
            return tab.LayerEncodingViewModel._isPillOfEncodingType$1(m, et);
        });
    },
    
    _showColorEncodingPopup$1: function tab_LayerEncodingViewModel$_showColorEncodingPopup$1(relativeElement) {
        if (this._hasPillWithEncodingType$1('color-encoding')) {
            if (ss.isValue(this.get_layerEncoding().get_colorEncodingDropdown().quantitativeColor)) {
                var quantitativeColorOptionViewModel = new tab.QuantitativeColorOptionViewModel(this.get_layerEncoding());
                spiff.UberPopupViewModel.createForContent(quantitativeColorOptionViewModel).show(new spiff.UberPopupShowOptions(relativeElement, spiff.UberPopupHorizontalAlign.center));
            }
            else if (ss.isValue(this.get_layerEncoding().get_colorEncodingDropdown().categoricalColor)) {
                var colorOptionViewModel = new tab.CategoricalColorOptionViewModel(this.get_layerEncoding());
                spiff.UberPopupViewModel.createForContent(colorOptionViewModel).show(new spiff.UberPopupShowOptions(relativeElement, spiff.UberPopupHorizontalAlign.center));
            }
        }
        else {
            tab.PaneClientCommands.getDefaultColor(this.layerEncoding, ss.Delegate.create(this, function(color) {
                var pickerVm = new tab.ColorPickerViewModel(this.get_layerEncoding());
                if (ss.isValue(color)) {
                    pickerVm.update(color);
                }
                this._showUberPopupUnder$1(pickerVm, relativeElement);
            }));
        }
    },
    
    _showTooltipEncodingPopup$1: function tab_LayerEncodingViewModel$_showTooltipEncodingPopup$1(relativeElement) {
        var tooltipVm = new tab.TooltipContentViewModel(this.get_layerEncoding());
        this._showUberPopupUnder$1(tooltipVm, relativeElement);
    },
    
    _showTextEncodingPopup$1: function tab_LayerEncodingViewModel$_showTextEncodingPopup$1(relativeElement) {
        var textOptionsVm = new tab.TextEncodingOptionViewModel(this.layerEncoding);
        this._showUberPopupUnder$1(textOptionsVm, relativeElement);
    },
    
    _raiseModelChanged$1: function tab_LayerEncodingViewModel$_raiseModelChanged$1() {
        if (ss.isNullOrUndefined(this.__modelChanged$1)) {
            return;
        }
        this.__modelChanged$1(this);
    },
    
    _updateValidDropEncodings$1: function tab_LayerEncodingViewModel$_updateValidDropEncodings$1(drag) {
        if (ss.isNullOrUndefined(this.get_validDropEncodings())) {
            return;
        }
        var drops = this._encodingShelf$1.matchingDropsFrom(drag);
        if (ss.isValue(drops)) {
            this.set_validDropEncodings(_.filter(drops.encodingTypes, ss.Delegate.create(this, function(type) {
                return _.any(this.get_layerEncoding().get_encodings(), function(model) {
                    return model.encodingType === type && model.isEnabled;
                });
            })));
        }
        else {
            this.set_validDropEncodings(null);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._encodingButtonDropTarget

tab._encodingButtonDropTarget = function tab__encodingButtonDropTarget(vm, dragOverCallback, dragExitCallback, et) {
    this._vm = vm;
    this._dragOverCallback = dragOverCallback;
    this._dragExitCallback = dragExitCallback;
    this._encoding = et;
}
tab._encodingButtonDropTarget.prototype = {
    _vm: null,
    _encoding: null,
    _dragOverCallback: null,
    _dragExitCallback: null,
    
    get_feedbackType: function tab__encodingButtonDropTarget$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    dragOver: function tab__encodingButtonDropTarget$dragOver(d) {
        this._dragOverCallback();
        return this;
    },
    
    dragExit: function tab__encodingButtonDropTarget$dragExit(d) {
        this._dragExitCallback();
    },
    
    acceptDrop: function tab__encodingButtonDropTarget$acceptDrop(d) {
        return this._vm.acceptDrop(d, this._encoding);
    },
    
    getDropTarget: function tab__encodingButtonDropTarget$getDropTarget(hit) {
        return this;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarksContentViewModel

tab.MarksContentViewModel = function tab_MarksContentViewModel(model) {
    this._layers$1 = [];
    this._encodingShelves$1 = {};
    this._dropState$1 = 0;
    tab.MarksContentViewModel.initializeBase(this);
    this._marksModel$1 = model;
    this._marksModel$1.add_newMarksCard(ss.Delegate.create(this, this._handleNewMarksCard$1));
    this._handleNewMarksCard$1();
}
tab.MarksContentViewModel.prototype = {
    _marksModel$1: null,
    _currentLayer$1: null,
    _visible$1: true,
    
    add_dropStateChanged: function tab_MarksContentViewModel$add_dropStateChanged(value) {
        this.__dropStateChanged$1 = ss.Delegate.combine(this.__dropStateChanged$1, value);
    },
    remove_dropStateChanged: function tab_MarksContentViewModel$remove_dropStateChanged(value) {
        this.__dropStateChanged$1 = ss.Delegate.remove(this.__dropStateChanged$1, value);
    },
    
    __dropStateChanged$1: null,
    
    add_layersChanged: function tab_MarksContentViewModel$add_layersChanged(value) {
        this.__layersChanged$1 = ss.Delegate.combine(this.__layersChanged$1, value);
    },
    remove_layersChanged: function tab_MarksContentViewModel$remove_layersChanged(value) {
        this.__layersChanged$1 = ss.Delegate.remove(this.__layersChanged$1, value);
    },
    
    __layersChanged$1: null,
    
    add_visibleChanged: function tab_MarksContentViewModel$add_visibleChanged(value) {
        this.__visibleChanged$1 = ss.Delegate.combine(this.__visibleChanged$1, value);
    },
    remove_visibleChanged: function tab_MarksContentViewModel$remove_visibleChanged(value) {
        this.__visibleChanged$1 = ss.Delegate.remove(this.__visibleChanged$1, value);
    },
    
    __visibleChanged$1: null,
    
    get_isVisible: function tab_MarksContentViewModel$get_isVisible() {
        return this._visible$1;
    },
    set_isVisible: function tab_MarksContentViewModel$set_isVisible(value) {
        if (this._visible$1 === value) {
            return;
        }
        this._visible$1 = value;
        this.raiseActionEvent(this.__visibleChanged$1);
        return value;
    },
    
    get_dropState: function tab_MarksContentViewModel$get_dropState() {
        return this._dropState$1;
    },
    set_dropState: function tab_MarksContentViewModel$set_dropState(value) {
        this._dropState$1 = value;
        if (ss.isValue(this.__dropStateChanged$1)) {
            this.__dropStateChanged$1(this._dropState$1);
        }
        return value;
    },
    
    get_currentLayer: function tab_MarksContentViewModel$get_currentLayer() {
        return this._currentLayer$1;
    },
    set_currentLayer: function tab_MarksContentViewModel$set_currentLayer(value) {
        if (this._currentLayer$1 === value) {
            return;
        }
        this._currentLayer$1 = value;
        this._updateActivePaneSpecId$1();
        this.notifyPropertyChanged('CurrentLayer');
        return value;
    },
    
    get_currentPaneSpecId: function tab_MarksContentViewModel$get_currentPaneSpecId() {
        if (ss.isValue(this._currentLayer$1)) {
            return this._currentLayer$1.get_layerEncoding().get_id();
        }
        return null;
    },
    
    get_layers: function tab_MarksContentViewModel$get_layers() {
        return this._layers$1;
    },
    
    get_marksModel: function tab_MarksContentViewModel$get_marksModel() {
        return this._marksModel$1;
    },
    
    get_dropTarget: function tab_MarksContentViewModel$get_dropTarget() {
        return null;
    },
    
    get_title: function tab_MarksContentViewModel$get_title() {
        return tab.Strings.AuthCardTitleMarks;
    },
    
    get_name: function tab_MarksContentViewModel$get_name() {
        return 'marks';
    },
    
    get_collapsedTitleDetail: function tab_MarksContentViewModel$get_collapsedTitleDetail() {
        return '';
    },
    
    get_viewType: function tab_MarksContentViewModel$get_viewType() {
        return tab.MarksContentView;
    },
    
    get_viewModel: function tab_MarksContentViewModel$get_viewModel() {
        return this;
    },
    
    dispose: function tab_MarksContentViewModel$dispose() {
        this._marksModel$1.remove_newMarksCard(ss.Delegate.create(this, this._handleNewMarksCard$1));
        this._disposeLayers$1();
        tab.MarksContentViewModel.callBaseMethod(this, 'dispose');
    },
    
    addEncodingShelf: function tab_MarksContentViewModel$addEncodingShelf(newShelf) {
        this._encodingShelves$1[newShelf.get_paneId().toString()] = newShelf;
        if (this._layers$1.length === 1) {
            this._layers$1[0].get_encodingShelf().set_shelf(newShelf);
        }
        else {
            var $enum1 = ss.IEnumerator.getEnumerator(this._layers$1);
            while ($enum1.moveNext()) {
                var layer = $enum1.current;
                if (layer.get_layerEncoding().get_id() === newShelf.get_paneId()) {
                    layer.get_encodingShelf().set_shelf(newShelf);
                    return;
                }
            }
            tab.Log.get(this).warn('Unable to find an encoding layer for shelf: %o', newShelf);
        }
    },
    
    _disposeLayers$1: function tab_MarksContentViewModel$_disposeLayers$1() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._layers$1);
        while ($enum1.moveNext()) {
            var layer = $enum1.current;
            layer.dispose();
        }
        this._layers$1.clear();
    },
    
    _handleNewMarksCard$1: function tab_MarksContentViewModel$_handleNewMarksCard$1() {
        this._disposeLayers$1();
        var $enum1 = ss.IEnumerator.getEnumerator(this._marksModel$1.get_layers());
        while ($enum1.moveNext()) {
            var layer = $enum1.current;
            var layerVm = new tab.LayerEncodingViewModel();
            layerVm.init(layer);
            if (Object.getKeyCount(this._encodingShelves$1) === 1) {
                layerVm.get_encodingShelf().set_shelf(this._encodingShelves$1[Object.keys(this._encodingShelves$1)[0]]);
            }
            else if (Object.keyExists(this._encodingShelves$1, layer.get_id().toString())) {
                layerVm.get_encodingShelf().set_shelf(this._encodingShelves$1[layer.get_id().toString()]);
            }
            this._layers$1.add(layerVm);
        }
        this._updateCurrentLayer$1();
        if (ss.isValue(this.__layersChanged$1)) {
            this.__layersChanged$1();
        }
    },
    
    _updateCurrentLayer$1: function tab_MarksContentViewModel$_updateCurrentLayer$1() {
        var layerToChoose = null;
        var typeInPillId = this._typeInPillPaneSpecId$1();
        if (ss.isValue(typeInPillId)) {
            layerToChoose = _.find(this._layers$1, function(vm) {
                return vm.get_layerEncoding().get_id() === typeInPillId;
            });
        }
        var currentId = this.get_currentPaneSpecId();
        if (ss.isNullOrUndefined(layerToChoose) && ss.isValue(currentId)) {
            layerToChoose = _.find(this._layers$1, function(vm) {
                return vm.get_layerEncoding().get_id() === currentId;
            });
        }
        if (ss.isNullOrUndefined(layerToChoose)) {
            layerToChoose = _.first(this._layers$1);
        }
        this._currentLayer$1 = layerToChoose;
        this._updateActivePaneSpecId$1();
    },
    
    _typeInPillPaneSpecId$1: function tab_MarksContentViewModel$_typeInPillPaneSpecId$1() {
        var appTypeInPillModel = tab.ApplicationModel.get_instance().get_typeInPillCalculationModel();
        if (ss.isValue(appTypeInPillModel) && appTypeInPillModel.get_hasCalculation() && appTypeInPillModel.get_adHocShelf() === 'encoding-shelf') {
            return appTypeInPillModel.get_adHocPaneSpecId();
        }
        return null;
    },
    
    _updateActivePaneSpecId$1: function tab_MarksContentViewModel$_updateActivePaneSpecId$1() {
        this._marksModel$1.set_activePaneSpecId(this.get_currentPaneSpecId());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabNavViewModel

tab.AuthoringTabNavViewModel = function tab_AuthoringTabNavViewModel(commandVm) {
    this._workbookTabs$1 = [];
    tab.AuthoringTabNavViewModel.initializeBase(this);
    tab.ApplicationModel.get_instance().get_workbook().add_sheetsChanged(ss.Delegate.create(this, this._updateTabs$1));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        tab.ApplicationModel.get_instance().get_workbook().remove_sheetsChanged(ss.Delegate.create(this, this._updateTabs$1));
    })));
    if (ss.isValue(tab.ApplicationModel.get_instance().get_workbook().get_sheetsInfo())) {
        this._updateTabs$1(tab.ApplicationModel.get_instance().get_workbook());
    }
    this._commandsViewModel$1 = commandVm;
}
tab.AuthoringTabNavViewModel.prototype = {
    _commandsViewModel$1: null,
    _currentTab$1: null,
    
    add_tabsChanged: function tab_AuthoringTabNavViewModel$add_tabsChanged(value) {
        this.__tabsChanged$1 = ss.Delegate.combine(this.__tabsChanged$1, value);
    },
    remove_tabsChanged: function tab_AuthoringTabNavViewModel$remove_tabsChanged(value) {
        this.__tabsChanged$1 = ss.Delegate.remove(this.__tabsChanged$1, value);
    },
    
    __tabsChanged$1: null,
    
    get_workbookTabs: function tab_AuthoringTabNavViewModel$get_workbookTabs() {
        return this._workbookTabs$1;
    },
    
    get_currentTab: function tab_AuthoringTabNavViewModel$get_currentTab() {
        return this._currentTab$1;
    },
    
    selectTab: function tab_AuthoringTabNavViewModel$selectTab(newTab) {
        if (ss.isNullOrUndefined(newTab) || newTab === this._currentTab$1) {
            return;
        }
        var oldTab = this._currentTab$1;
        if (ss.isValue(oldTab)) {
            oldTab.set_isCurrent(false);
        }
        this._currentTab$1 = newTab;
        newTab.set_isCurrent(true);
        this.notifyPropertyChanged('CurrentTab');
        var msg = {};
        msg.sheetName = newTab.get_name();
        msg.oldSheetName = tsConfig.current_sheet_name;
        msg.noUndo = false;
        msg.repositoryUrl = tsConfig.current_workbook_name + '/' + newTab.get_name();
        var oldTabName = (ss.isValue(oldTab)) ? oldTab.get_name() : tsConfig.current_sheet_name;
        if (ss.isValue(oldTabName) && (oldTabName).length > 0) {
            msg.oldRepositoryUrl = tsConfig.current_workbook_name + '/' + oldTabName;
        }
        if (ss.isValue(oldTab)) {
            dojo.publish('onTabSelect', [ msg ]);
        }
    },
    
    createNewWorksheet: function tab_AuthoringTabNavViewModel$createNewWorksheet(insertAtEnd) {
        tab.SheetClientCommands.createSheet(null, insertAtEnd);
    },
    
    _updateTabs$1: function tab_AuthoringTabNavViewModel$_updateTabs$1(workbook) {
        var $enum1 = ss.IEnumerator.getEnumerator(this._workbookTabs$1);
        while ($enum1.moveNext()) {
            var oldTab = $enum1.current;
            oldTab.dispose();
        }
        this._workbookTabs$1.clear();
        var sheetsInfo = workbook.get_sheetsInfo();
        var $enum2 = ss.IEnumerator.getEnumerator(sheetsInfo);
        while ($enum2.moveNext()) {
            var sheetInfo = $enum2.current;
            if (sheetInfo.isDashboard) {
                continue;
            }
            var newTab = new tab.AuthoringTabViewModel(sheetInfo.sheet, !sheetInfo.isDashboard, sheetInfo.sheet === tsConfig.current_sheet_name, this);
            this._workbookTabs$1.add(newTab);
            if (newTab.get_isCurrent()) {
                this._currentTab$1 = newTab;
            }
        }
        if (ss.isValue(this.__tabsChanged$1)) {
            this.__tabsChanged$1();
        }
    },
    
    buildWorksheetMenu: function tab_AuthoringTabNavViewModel$buildWorksheetMenu(tabViewModel) {
        if (ss.isNullOrUndefined(tabViewModel)) {
            tabViewModel = this.get_currentTab();
        }
        var items = [];
        var isWorksheet = false;
        var sheetName = tsConfig.current_sheet_name;
        if (!ss.isNullOrUndefined(tabViewModel)) {
            isWorksheet = tabViewModel.isWorksheet;
            sheetName = tabViewModel.get_name();
        }
        items.add(this._commandsViewModel$1.createCommandMenuItem('new-worksheet', tab.Strings.AuthWorksheetMenuNew));
        var cmdParams = {};
        cmdParams['sheet'] = sheetName;
        items.add(this._commandsViewModel$1.createCommandMenuItem('duplicate-sheet', tab.Strings.AuthWorksheetMenuDuplicate, cmdParams));
        items.add(spiff.MenuItem.newActionItem(tab.Strings.AuthWorksheetMenuRename, function() {
            tabViewModel.renameWithPrompt();
        }));
        var deleteItem = spiff.MenuItem.newActionItem(tab.Strings.AuthWorksheetMenuDelete, function() {
            tab.SheetClientCommands.deleteSheet(sheetName);
        });
        if (this.get_workbookTabs().length === 1) {
            deleteItem.set_enabled(false);
        }
        if (!_.any(tab.ApplicationModel.get_instance().get_workbook().get_sheetsInfo(), function(model) {
            return model.isDashboard && model.namesOfSubsheets.contains(sheetName);
        })) {
            items.add(deleteItem);
        }
        if (isWorksheet) {
            items.add(spiff.MenuItem.newDivider());
            items.add(this._commandsViewModel$1.createCommandMenuItem('clear-sheet', tab.Strings.AuthWorksheetMenuClear, cmdParams));
        }
        items.add(this._commandsViewModel$1.createCommandMenuItem('clear-formatting', tab.Strings.AuthWorksheetMenuClearFormatting));
        return new spiff.Menu(items);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringMastheadViewModel

tab.AuthoringMastheadViewModel = function tab_AuthoringMastheadViewModel() {
    this._helpPages$1 = [ 'web_author_who.htm', 'web_author.htm', 'web_author_build_view.htm' ];
    tab.AuthoringMastheadViewModel.initializeBase(this);
    this._buildLinks$1();
    this.disposables.add(new tab.SubscriptionDisposable(dojo.subscribe('workbookModifiedChanged', ss.Delegate.create(this, this._handleWorkbookModifiedChanged$1))));
}
tab.AuthoringMastheadViewModel._newLink$1 = function tab_AuthoringMastheadViewModel$_newLink$1(name, href, target) {
    var mi = new spiff.MenuItem();
    mi.set_data(function() {
        tab.WindowHelper.open(href, target);
    });
    mi.set_name(name);
    mi.set_enabled(href != null);
    return mi;
}
tab.AuthoringMastheadViewModel.createUserPrefsUrl = function tab_AuthoringMastheadViewModel$createUserPrefsUrl() {
    var userNameUrlPart = encodeURIComponent(tsConfig.current_user_name);
    var domainNameUrlPart = encodeURIComponent(tsConfig.current_user_domain_name);
    var legacySiteRoot = tsConfig.site_root.toString();
    var siteUrlPart = '';
    if (legacySiteRoot.length > 0) {
        var lastSlash = legacySiteRoot.lastIndexOf('/');
        siteUrlPart = '/site/' + encodeURIComponent(legacySiteRoot.substr(lastSlash + 1));
    }
    return '/#' + siteUrlPart + '/user/' + domainNameUrlPart + '/' + userNameUrlPart + '/settings';
}
tab.AuthoringMastheadViewModel.prototype = {
    _workbookMenu$1: null,
    _userMenu$1: null,
    
    get_workbookMenu: function tab_AuthoringMastheadViewModel$get_workbookMenu() {
        return this._workbookMenu$1;
    },
    
    get_userMenu: function tab_AuthoringMastheadViewModel$get_userMenu() {
        return this._userMenu$1;
    },
    
    get_workbookName: function tab_AuthoringMastheadViewModel$get_workbookName() {
        return tsConfig.current_workbook_name;
    },
    
    get__isSaveVisible$1: function tab_AuthoringMastheadViewModel$get__isSaveVisible$1() {
        return tsConfig.allow_save || tsConfig.allow_save_as || tsConfig.is_guest;
    },
    
    get__isLoggedOn$1: function tab_AuthoringMastheadViewModel$get__isLoggedOn$1() {
        return !tsConfig.is_guest;
    },
    
    get__username$1: function tab_AuthoringMastheadViewModel$get__username$1() {
        return tsConfig.current_user_friendly_name;
    },
    
    get__helpLang$1: function tab_AuthoringMastheadViewModel$get__helpLang$1() {
        if (!ss.isValue(tsConfig.language)) {
            return 'en-us';
        }
        switch (tsConfig.language.toString()) {
            case 'de':
                return 'de-de';
            case 'en':
                return 'en-us';
            case 'es':
                return 'es-es';
            case 'fr':
                return 'fr-fr';
            case 'ja':
                return 'ja-jp';
            case 'ko':
                return 'ko-kr';
            case 'pt':
                return 'pt-br';
            case 'zh':
                return 'zh-cn';
            default:
                return 'en-us';
        }
    },
    
    get__helpVersion$1: function tab_AuthoringMastheadViewModel$get__helpVersion$1() {
        var regex = /^(\d+\.\d+)/;
        var matches = regex.exec(tsConfig.version);
        if (ss.isValue(matches)) {
            return matches[1];
        }
        else {
            return '0.0';
        }
    },
    
    get__helpEdition$1: function tab_AuthoringMastheadViewModel$get__helpEdition$1() {
        return (tsConfig.is_saas) ? 'online' : 'server';
    },
    
    _getOfflineHelpHref$1: function tab_AuthoringMastheadViewModel$_getOfflineHelpHref$1(helpPage) {
        var lang = this.get__helpLang$1().replaceAll('-', '_');
        return String.format('/offline_help/{0}/help.htm#{1}', lang, helpPage);
    },
    
    _saveClicked$1: function tab_AuthoringMastheadViewModel$_saveClicked$1() {
        tab.SaveController.get_instance().saveWorkbook(ss.Delegate.create(this, this._redirectToAuthoringView$1));
    },
    
    _saveAsClicked$1: function tab_AuthoringMastheadViewModel$_saveAsClicked$1() {
        tab.SaveController.get_instance().saveWorkbookAs();
    },
    
    _revertClicked$1: function tab_AuthoringMastheadViewModel$_revertClicked$1() {
        tab.WorksheetServerCommands.revert();
    },
    
    _helpSearchActivated$1: function tab_AuthoringMastheadViewModel$_helpSearchActivated$1(query) {
        window.open(this._makeHelpSearchUri$1(query));
    },
    
    _logOutClicked$1: function tab_AuthoringMastheadViewModel$_logOutClicked$1() {
        var failure = function() {
            tab.NotificationViewModel.showNotification(tab.Strings.SignOutFailedMessage);
        };
        tab.WorkgroupServerCommands.logOff(failure);
    },
    
    _logOnClicked$1: function tab_AuthoringMastheadViewModel$_logOnClicked$1() {
        var authoringVizUriModel = tab.VizUriModel.createForAuthoringUnpublishedSheet(tsConfig.repositoryUrl, tsConfig.current_sheet_name);
        tab.LogOnViewModel.logOnAndTransitionSession(authoringVizUriModel);
    },
    
    _userPrefsClicked$1: function tab_AuthoringMastheadViewModel$_userPrefsClicked$1() {
        var userPrefsUrl = tab.AuthoringMastheadViewModel.createUserPrefsUrl();
        tab.WindowHelper.setLocationHref(window.self, userPrefsUrl);
    },
    
    doneClicked: function tab_AuthoringMastheadViewModel$doneClicked() {
        if (tab.ApplicationModel.get_instance().get_workbook().get_isWorkbookModifiedAuthoring()) {
            tab.Log.get(this).debug('Offer to save and then Redirect to view');
            var message;
            var confirm;
            var deny;
            if (tab.SaveController.get_instance().get_isSaveEnabled()) {
                message = tab.Strings.AuthMastheadDone_Confirm_CanSave;
                confirm = tab.Strings.AuthMastheadDone_Confirm_CanSave_Confirm;
                deny = tab.Strings.AuthMastheadDone_Confirm_CanSave_Deny;
            }
            else if (tab.SaveController.get_instance().get_isSaveAsEnabled()) {
                message = tab.Strings.AuthMastheadDone_Confirm_CanSaveAs;
                confirm = tab.Strings.AuthMastheadDone_Confirm_CanSaveAs_Confirm;
                deny = tab.Strings.AuthMastheadDone_Confirm_CanSaveAs_Deny;
            }
            else if (tsConfig.is_guest) {
                message = tab.Strings.AuthMastheadDone_Confirm_CanLogin;
                confirm = tab.Strings.AuthMastheadDone_Confirm_CanLogin_Confirm;
                deny = tab.Strings.AuthMastheadDone_Confirm_CanLogin_Deny;
            }
            else {
                tab.Log.get(this).debug('Cannot save, redirect to view');
                this._redirectToView$1(null);
                return;
            }
            var confVm = tab.ConfirmationViewModel.create(message, ss.Delegate.create(this, this._handleDoneConfirmSave$1));
            confVm.set_titleText(tab.Strings.AuthMastheadDone_Confirm_Title);
            confVm.set_confirmText(confirm);
            confVm.set_denyText(deny);
            confVm.show();
        }
        else {
            tab.Log.get(this).debug('Redirect to view');
            this._redirectToView$1(null);
        }
    },
    
    _handleDoneConfirmSave$1: function tab_AuthoringMastheadViewModel$_handleDoneConfirmSave$1(result) {
        switch (result) {
            case 'confirm':
                tab.SaveController.get_instance().saveWorkbook(ss.Delegate.create(this, this._redirectToView$1));
                break;
            case 'deny':
                this._redirectToView$1(null);
                break;
            case 'cancel':
                break;
        }
    },
    
    _redirectToAuthoringView$1: function tab_AuthoringMastheadViewModel$_redirectToAuthoringView$1(newWb) {
        var newVizUriModel = tab.WorkbookViewObjectUtils.createVizUriModelForAuthoringSheetInWorkbook(tsConfig.current_sheet_name, newWb);
        if (!newVizUriModel.matchesCurrentWindowLocationUri()) {
            newVizUriModel.setWindowLocation();
        }
    },
    
    _redirectToView$1: function tab_AuthoringMastheadViewModel$_redirectToView$1(newWb) {
        var window = tabBootstrap.Utility.get_locationWindow();
        var opener = tab.WindowHelper.getOpener(tabBootstrap.Utility.get_locationWindow());
        if (ss.isValue(opener)) {
            tab.WindowHelper.close(window);
            window.setTimeout(function() {
                tab.WindowHelper.setLocationHref(window, tsConfig.vizql_root + '/doneAuthoring');
            }, 500);
            return;
        }
        var vizUriModel = tab.VizUriModel.createForCurrentWindowLocation();
        if (vizUriModel.get_isAuthorNewWorkbookUri()) {
            var newUrl = tsConfig.site_root + '/datasources';
            tab.WindowHelper.setLocationHref(window, tab.MiscUtil.replaceUriQueryParameters(newUrl, vizUriModel.get_queryParams()));
        }
        else {
            var newVizUriModel = this._createVizUriModelForViewingSheet$1(newWb);
            newVizUriModel.setWindowLocation();
        }
    },
    
    _createVizUriModelForViewingSheet$1: function tab_AuthoringMastheadViewModel$_createVizUriModelForViewingSheet$1(newWb) {
        var newVizUriModel = null;
        if (ss.isValue(newWb)) {
            newVizUriModel = tab.WorkbookViewObjectUtils.createVizUriModelForViewingSheetInWorkbook(tsConfig.current_sheet_name, newWb);
        }
        else {
            var repoUrl = tab.ApplicationModel.get_instance().get_workbook().get_outerDashboardRepositoryUrl();
            if (!tab.MiscUtil.isNullOrEmpty(repoUrl)) {
                newVizUriModel = tab.VizUriModel.createForViewingSheet(repoUrl);
            }
        }
        if (newVizUriModel == null) {
            newVizUriModel = tab.VizUriModel.createForViewingSheet(tsConfig.origin_repository_url);
        }
        return newVizUriModel;
    },
    
    _handleWorkbookModifiedChanged$1: function tab_AuthoringMastheadViewModel$_handleWorkbookModifiedChanged$1(arg) {
        this._buildLinks$1();
    },
    
    _buildLinks$1: function tab_AuthoringMastheadViewModel$_buildLinks$1() {
        this._workbookMenu$1 = new spiff.Menu([]);
        if (this.get__isSaveVisible$1()) {
            this._workbookMenu$1.get_menuItems().add(spiff.MenuItem.newActionItem(tab.Strings.AuthMastheadSave, ss.Delegate.create(this, this._saveClicked$1)));
        }
        if (tsConfig.allow_save_as) {
            this._workbookMenu$1.get_menuItems().add(spiff.MenuItem.newActionItem(tab.Strings.AuthMastheadSaveAs, ss.Delegate.create(this, this._saveAsClicked$1)));
        }
        var revertItem = spiff.MenuItem.newActionItem(tab.Strings.AuthMastheadRevert, ss.Delegate.create(this, this._revertClicked$1));
        revertItem.set_enabled(tab.ApplicationModel.get_instance().get_workbook().get_isWorkbookModifiedAuthoring());
        this._workbookMenu$1.get_menuItems().add(revertItem);
        this._workbookMenu$1.get_menuItems().add(spiff.MenuItem.newActionItem(tab.Strings.AuthMastheadDone, ss.Delegate.create(this, this.doneClicked)));
        this._userMenu$1 = new spiff.Menu([]);
        var helpSubmenu = new spiff.Menu([]);
        helpSubmenu.get_menuItems().add(spiff.MenuItem.newTextInput(ss.Delegate.create(this, this._helpSearchActivated$1)));
        helpSubmenu.get_menuItems().add(spiff.MenuItem.newActionItem('Command Shell', function() {
            tab.shell.launch();
        }));
        helpSubmenu.get_menuItems().add(tab.AuthoringMastheadViewModel._newLink$1(tab.Strings.HelpMenuItemWebAuthor1, this._makeHelpUri$1(1), '_blank'));
        helpSubmenu.get_menuItems().add(tab.AuthoringMastheadViewModel._newLink$1(tab.Strings.HelpMenuItemWebAuthor2, this._makeHelpUri$1(2), '_blank'));
        helpSubmenu.get_menuItems().add(tab.AuthoringMastheadViewModel._newLink$1(tab.Strings.HelpMenuItemWebAuthor3, this._makeHelpUri$1(3), '_blank'));
        helpSubmenu.get_menuItems().add(spiff.MenuItem.newDivider());
        if (tsConfig.is_saas) {
            helpSubmenu.get_menuItems().add(tab.AuthoringMastheadViewModel._newLink$1(tab.Strings.HelpMenuItemContactSupport, tsConfig.contact_support_uri, '_blank'));
        }
        else {
            if (!tsConfig.isPublic) {
                var href = (tsConfig.useOfflineHelp) ? this._getOfflineHelpHref$1('') : String.format('{0}/support', 'http://www.tableausoftware.com');
                helpSubmenu.get_menuItems().add(tab.AuthoringMastheadViewModel._newLink$1(tab.Strings.HelpMenuItemGetHelpAndSupport, href, '_blank'));
            }
        }
        var helpSubmenuItem = spiff.MenuItem.newItem(null, tab.Strings.AuthMastheadHelp, spiff.MenuItemCheckState.none, helpSubmenu);
        this._userMenu$1.get_menuItems().add(helpSubmenuItem);
        if (this.get__isLoggedOn$1()) {
            var submenu = new spiff.Menu([]);
            submenu.get_menuItems().add(spiff.MenuItem.newActionItem(tab.Strings.AuthMastheadUserPrefs, ss.Delegate.create(this, this._userPrefsClicked$1)));
            submenu.get_menuItems().add(spiff.MenuItem.newActionItem(tab.Strings.AuthMastheadLogout, ss.Delegate.create(this, this._logOutClicked$1)));
            var submenuItem = spiff.MenuItem.newItem(null, this.get__username$1(), spiff.MenuItemCheckState.none, submenu);
            this._userMenu$1.get_menuItems().add(submenuItem);
        }
        else {
            this._userMenu$1.get_menuItems().add(spiff.MenuItem.newActionItem(tab.Strings.AuthMastheadLogin, ss.Delegate.create(this, this._logOnClicked$1)));
        }
        this.notifyPropertyChanged('links');
    },
    
    _makeHelpUri$1: function tab_AuthoringMastheadViewModel$_makeHelpUri$1(index) {
        if (tsConfig.useOfflineHelp) {
            var helpPage = this._helpPages$1[index - 1];
            return this._getOfflineHelpHref$1(helpPage);
        }
        else {
            var lang = this.get__helpLang$1();
            var edition = this.get__helpEdition$1();
            var version = this.get__helpVersion$1();
            var category = 'webauthor';
            return String.format('{0}/{1}/app/server-{2}{3}?edition={4}&lang={1}&version={5}', 'http://www.tableausoftware.com', lang, category, index, edition, version);
        }
    },
    
    _makeHelpSearchUri$1: function tab_AuthoringMastheadViewModel$_makeHelpSearchUri$1(query) {
        var escapedQuery = encodeURIComponent(query);
        if (tsConfig.useOfflineHelp) {
            return this._getOfflineHelpHref$1(String.format('search-{0}', escapedQuery));
        }
        else {
            var lang = this.get__helpLang$1();
            if (lang === 'en-us') {
                return String.format('{0}/search/support/{1}', 'http://www.tableausoftware.com', escapedQuery);
            }
            else {
                return String.format('{0}/{1}/search/support/{2}', 'http://www.tableausoftware.com', lang, escapedQuery);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarkSizePickerViewModel

tab.MarkSizePickerViewModel = function tab_MarkSizePickerViewModel(sizeModel) {
    tab.MarkSizePickerViewModel.initializeBase(this);
    this._model$1 = sizeModel;
}
tab.MarkSizePickerViewModel.prototype = {
    _model$1: null,
    
    add_modelUpdated: function tab_MarkSizePickerViewModel$add_modelUpdated(value) {
        this.__modelUpdated$1 = ss.Delegate.combine(this.__modelUpdated$1, value);
    },
    remove_modelUpdated: function tab_MarkSizePickerViewModel$remove_modelUpdated(value) {
        this.__modelUpdated$1 = ss.Delegate.remove(this.__modelUpdated$1, value);
    },
    
    __modelUpdated$1: null,
    
    get_viewType: function tab_MarkSizePickerViewModel$get_viewType() {
        return tab.MarkSizePickerView;
    },
    
    get_viewModel: function tab_MarkSizePickerViewModel$get_viewModel() {
        return this;
    },
    
    get_markSize: function tab_MarkSizePickerViewModel$get_markSize() {
        return this._model$1;
    },
    
    get_minMarkSize: function tab_MarkSizePickerViewModel$get_minMarkSize() {
        return this._model$1.get_minMarkSize();
    },
    
    get_maxMarkSize: function tab_MarkSizePickerViewModel$get_maxMarkSize() {
        return this._model$1.get_maxMarkSize();
    },
    
    get_currentFraction: function tab_MarkSizePickerViewModel$get_currentFraction() {
        return this._model$1.get_currentSliderFraction();
    },
    set_currentFraction: function tab_MarkSizePickerViewModel$set_currentFraction(value) {
        var newMarkSize = this._model$1.get_transform().fractionToValue(value);
        if (Math.abs(this._model$1.get_currentMarkSize() - newMarkSize) > 0.001) {
            tab.PaneClientCommands.setMarkSize(this._model$1.get_parentModel(), newMarkSize);
        }
        return value;
    },
    
    disposeViewModel: function tab_MarkSizePickerViewModel$disposeViewModel() {
        this.dispose();
    },
    
    updateUberPopupViewModel: function tab_MarkSizePickerViewModel$updateUberPopupViewModel(vm) {
    },
    
    update: function tab_MarkSizePickerViewModel$update(markSizeModel) {
        this._model$1 = markSizeModel;
        if (ss.isNullOrUndefined(this.__modelUpdated$1)) {
            return;
        }
        this.__modelUpdated$1(this);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillDragInstance

tab.PillDragInstance = function tab_PillDragInstance(dragged, name, type) {
    tab.PillDragInstance.initializeBase(this, [ dragged, new tab.PillDragAvatar(name, type) ]);
    this._avatar$2 = this.get_dragAvatar();
}
tab.PillDragInstance.prototype = {
    _avatar$2: null,
    
    get_fields: function tab_PillDragInstance$get_fields() {
        if (this.hasOnlyFields()) {
            return this.draggedObject;
        }
        else if (this.hasOnlyPills()) {
            var fields = _.map(this.draggedObject, function(pillVm) {
                return pillVm.get_field();
            });
            return fields;
        }
        return null;
    },
    
    get_pills: function tab_PillDragInstance$get_pills() {
        return (this.hasOnlyPills()) ? this.draggedObject : null;
    },
    
    get_pill: function tab_PillDragInstance$get_pill() {
        var draggedPills = this.get_pills();
        return draggedPills[0];
    },
    
    hasOnlyFields: function tab_PillDragInstance$hasOnlyFields() {
        if (Type.canCast(this.draggedObject, Array)) {
            var objects = this.draggedObject;
            return _.every(objects, function(obj) {
                return Type.canCast(obj, tab.FieldModel);
            });
        }
        return Type.canCast(this.draggedObject, tab.FieldModel);
    },
    
    hasOnlyPills: function tab_PillDragInstance$hasOnlyPills() {
        if (Type.canCast(this.draggedObject, Array)) {
            var objects = this.draggedObject;
            return _.every(objects, function(obj) {
                return Type.canCast(obj, tab.PillViewModel);
            });
        }
        return Type.canCast(this.draggedObject, tab.PillViewModel);
    },
    
    resolve: function tab_PillDragInstance$resolve(dragResponse) {
        if (this.finalDrop.isResolved() || ss.isNullOrUndefined(dragResponse)) {
            return;
        }
        tab.Log.get(this).debug('Drag resolved');
        this.drag = dragResponse;
        var newDraggedObject = [];
        var currentDraggedObject = this.get_fields();
        var fieldExistInDrag = true;
        var $enum1 = ss.IEnumerator.getEnumerator(this.drag.shelfDropModels);
        while ($enum1.moveNext()) {
            var dropModel = $enum1.current;
            if (!dropModel.fieldEncodings.length) {
                continue;
            }
            var $enum2 = ss.IEnumerator.getEnumerator(dropModel.fieldEncodings);
            while ($enum2.moveNext()) {
                var fieldEncoding = $enum2.current;
                var newGlobalName = fieldEncoding.fn;
                fieldExistInDrag = fieldExistInDrag && _.any(currentDraggedObject, function(model) {
                    return model.get_globalName() === newGlobalName;
                });
                if (ss.isValue(newGlobalName)) {
                    var ds = tab.ApplicationModel.get_instance().get_workbook().get_dataSchema();
                    var matchingCol = ds.findField(newGlobalName);
                    if (ss.isValue(matchingCol) && !newDraggedObject.contains(matchingCol)) {
                        newDraggedObject.add(matchingCol);
                    }
                }
            }
            break;
        }
        if (newDraggedObject.length > 0 && !fieldExistInDrag) {
            this.draggedObject = newDraggedObject;
            this._avatar$2.set_label(newDraggedObject[0].get_description());
        }
        this.finalDrop.resolve(this);
    },
    
    reject: function tab_PillDragInstance$reject(dragResponse) {
        if (this.finalDrop.isResolved() || !ss.isNullOrUndefined(dragResponse)) {
            return;
        }
        tab.Log.get(this).debug('Drag rejected');
        if (ss.isNullOrUndefined(this.drag)) {
            this.drag = dragResponse;
        }
        this.finalDrop.reject(this);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillViewModel

tab.PillViewModel = function tab_PillViewModel() {
    tab.PillViewModel.initializeBase(this);
}
tab.PillViewModel.prototype = {
    _pill$1: null,
    _shelf$1: null,
    
    add_pillChanged: function tab_PillViewModel$add_pillChanged(value) {
        this.__pillChanged$1 = ss.Delegate.combine(this.__pillChanged$1, value);
    },
    remove_pillChanged: function tab_PillViewModel$remove_pillChanged(value) {
        this.__pillChanged$1 = ss.Delegate.remove(this.__pillChanged$1, value);
    },
    
    __pillChanged$1: null,
    
    add_showDragAccept: function tab_PillViewModel$add_showDragAccept(value) {
        this.__showDragAccept$1 = ss.Delegate.combine(this.__showDragAccept$1, value);
    },
    remove_showDragAccept: function tab_PillViewModel$remove_showDragAccept(value) {
        this.__showDragAccept$1 = ss.Delegate.remove(this.__showDragAccept$1, value);
    },
    
    __showDragAccept$1: null,
    
    get_pill: function tab_PillViewModel$get_pill() {
        return this._pill$1;
    },
    set_pill: function tab_PillViewModel$set_pill(value) {
        if (this._pill$1 === value) {
            return;
        }
        this._pill$1 = value;
        this.handlePillChanged();
        return value;
    },
    
    get_item: function tab_PillViewModel$get_item() {
        return this._pill$1.get_item();
    },
    
    get_field: function tab_PillViewModel$get_field() {
        return this._pill$1.get_column();
    },
    
    get_shelf: function tab_PillViewModel$get_shelf() {
        return this._shelf$1;
    },
    set_shelf: function tab_PillViewModel$set_shelf(value) {
        this._shelf$1 = value;
        return value;
    },
    
    get_indexInShelf: function tab_PillViewModel$get_indexInShelf() {
        return this._shelf$1.get_pills().indexOf(this);
    },
    
    get_displayName: function tab_PillViewModel$get_displayName() {
        return this._pill$1.get_displayName();
    },
    
    get_role: function tab_PillViewModel$get_role() {
        return this._pill$1.get_column().get_role();
    },
    
    get_feedbackType: function tab_PillViewModel$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    dragOver: function tab_PillViewModel$dragOver(d) {
        var accept = this._canAccept$1(d);
        if (accept) {
            this._raiseShowDragAccept$1(true);
            return this;
        }
        return this._shelf$1.createPillDividerDropTarget(this.get_indexInShelf());
    },
    
    dragExit: function tab_PillViewModel$dragExit(d) {
        this._raiseShowDragAccept$1(false);
    },
    
    _raiseShowDragAccept$1: function tab_PillViewModel$_raiseShowDragAccept$1(show) {
        if (ss.isValue(this.__showDragAccept$1)) {
            this.__showDragAccept$1(show);
        }
    },
    
    acceptDrop: function tab_PillViewModel$acceptDrop(d) {
        var result = $.DeferredData();
        if (Type.canCast(d, tab.BaseFieldDragInstance)) {
            var handleDrop = ss.Delegate.create(this, function(drag) {
                var willAccept = this._canAccept$1(drag);
                if (!willAccept) {
                    tab.Log.get(this).debug('Rejecting drop: %o', drag);
                }
                else if (drag.hasOnlyPills()) {
                    var p = drag.get_pill();
                    tab.Log.get(this).debug('Accepting pill: %o', p);
                    var dropPos = drag.dropPositionToReplacePill(this);
                    tab.ShelfClientCommands.replaceShelfPill(p.get_shelf().get_shelf(), p.get_pill(), this._shelf$1.get_shelf(), this._pill$1, dropPos, drag.isCopyDrag);
                }
                else if (drag.hasOnlyFields()) {
                    var c = drag.fieldsToDropOnShelf(this._shelf$1.get_shelfType());
                    tab.Log.get(this).debug('Accepting field: %o', c);
                    var dropPos = drag.dropPositionToReplacePill(this);
                    tab.ShelfClientCommands.replaceShelfPillWithField(this._shelf$1.get_shelf(), this._pill$1, c, dropPos);
                }
                result.resolve(willAccept);
            });
            if ((d).get_drop().isResolved()) {
                handleDrop(d);
            }
            else {
                (d).get_drop().done(handleDrop);
            }
        }
        else {
            result.resolve(false);
        }
        return result;
    },
    
    getDropTarget: function tab_PillViewModel$getDropTarget(hit) {
        return this;
    },
    
    startDrag: function tab_PillViewModel$startDrag(e) {
        var d = new tab.PillDragInstance([this], this.get_displayName(), this.get_field().get_fieldType());
        var deferredDrag = tab.ShelfClientCommands.startDrag([this._pill$1.get_column()], this._pill$1.get_encodingType(), tab.ModelUtils.findActivePaneSpecId());
        deferredDrag.done(function(drag) {
            if (ss.isValue(drag) && ss.isValue(drag.shelfDropModels)) {
                d.resolve(drag);
            }
            else {
                d.reject(drag);
            }
        });
        return d;
    },
    
    editPill: function tab_PillViewModel$editPill() {
        this._shelf$1.editPill(this._pill$1.get_item().fn, this.get_indexInShelf());
    },
    
    menuButtonClicked: function tab_PillViewModel$menuButtonClicked(buttonDom) {
        tab.Log.get(this).debug('Pill menu button clicked: %o', this.get_item());
        var vm = spiff.MenuViewModel.createForMenu(this._buildPillMenu$1(this._pill$1.get_contextMenuCommands()), ss.Delegate.create(this, this._menuItemClicked$1));
        vm.show(spiff.ShowMenuOptions.create(buttonDom, false));
    },
    
    iconClicked: function tab_PillViewModel$iconClicked() {
        if (this.get_pill().get_hasDrill()) {
            tab.ShelfClientCommands.drillOnPill(this.get_shelf().get_shelf(), this.get_pill(), this.get_indexInShelf());
        }
        tab.Log.get(this).debug('Pill icon clicked: %o', this.get_item());
    },
    
    pillClicked: function tab_PillViewModel$pillClicked() {
        tab.Log.get(this).debug('Pill clicked: %o', this.get_item());
    },
    
    updateEncodingType: function tab_PillViewModel$updateEncodingType(et) {
        if (et === this._pill$1.get_encodingType()) {
            return;
        }
        tab.ShelfClientCommands.setItemEncodingType(this._shelf$1.get_shelf(), this._pill$1, et);
    },
    
    handlePillChanged: function tab_PillViewModel$handlePillChanged() {
        if (ss.isValue(this.__pillChanged$1)) {
            this.__pillChanged$1(this);
        }
    },
    
    _canAccept$1: function tab_PillViewModel$_canAccept$1(d) {
        if (!d.get_hasPayload() || !(Type.canCast(d, tab.BaseFieldDragInstance))) {
            return false;
        }
        if (this.get_shelf().get_dropState() === 2 && !d.payloadEquals(this)) {
            return false;
        }
        var dropPos = (d).dropPositionToReplacePill(this);
        return ss.isValue(dropPos);
    },
    
    _buildPillMenu$1: function tab_PillViewModel$_buildPillMenu$1(list) {
        var items = [];
        if (ss.isValue(list)) {
            tab.WidgetUtil.newMenuItemsFromCommands(items, list, tab.WidgetUtil.createDropdownMenuCommands);
            items.add(spiff.MenuItem.newDivider());
        }
        items.add(spiff.MenuItem.newItem(ss.Delegate.create(this, function() {
            tab.ShelfClientCommands.removeShelfPill(this._shelf$1.get_shelf(), this._pill$1);
        }), tab.Strings.AuthPillRemove));
        return new spiff.Menu(items);
    },
    
    _menuItemClicked$1: function tab_PillViewModel$_menuItemClicked$1(arg) {
        if ($.isFunction(arg.get_data())) {
            (arg.get_data())();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SaveViewModel

tab.SaveViewModel = function tab_SaveViewModel() {
    this._projects$1 = [];
    tab.SaveViewModel.initializeBase(this);
    if (this.get_showProjects()) {
        tab.WorkgroupServerCommands.getWritableProjects(ss.Delegate.create(this, function(newProjects) {
            this.set_projects(newProjects);
            this.set_currentProject(_.find(newProjects, function(model) {
                return model.get_id() === tsConfig.current_project_id;
            }));
        }));
    }
    this._workbookName$1 = tsConfig.current_workbook_name;
    this._showTabs$1 = tsConfig.showTabsWorkbook;
}
tab.SaveViewModel.prototype = {
    _currentProject$1: null,
    _workbookName$1: null,
    _showTabs$1: false,
    _embedCredentials$1: false,
    
    add_shown: function tab_SaveViewModel$add_shown(value) {
        this.__shown$1 = ss.Delegate.combine(this.__shown$1, value);
    },
    remove_shown: function tab_SaveViewModel$remove_shown(value) {
        this.__shown$1 = ss.Delegate.remove(this.__shown$1, value);
    },
    
    __shown$1: null,
    
    add_hidden: function tab_SaveViewModel$add_hidden(value) {
        this.__hidden$1 = ss.Delegate.combine(this.__hidden$1, value);
    },
    remove_hidden: function tab_SaveViewModel$remove_hidden(value) {
        this.__hidden$1 = ss.Delegate.remove(this.__hidden$1, value);
    },
    
    __hidden$1: null,
    
    add_saveSucceeded: function tab_SaveViewModel$add_saveSucceeded(value) {
        this.__saveSucceeded$1 = ss.Delegate.combine(this.__saveSucceeded$1, value);
    },
    remove_saveSucceeded: function tab_SaveViewModel$remove_saveSucceeded(value) {
        this.__saveSucceeded$1 = ss.Delegate.remove(this.__saveSucceeded$1, value);
    },
    
    __saveSucceeded$1: null,
    
    add_saveCancelled: function tab_SaveViewModel$add_saveCancelled(value) {
        this.__saveCancelled$1 = ss.Delegate.combine(this.__saveCancelled$1, value);
    },
    remove_saveCancelled: function tab_SaveViewModel$remove_saveCancelled(value) {
        this.__saveCancelled$1 = ss.Delegate.remove(this.__saveCancelled$1, value);
    },
    
    __saveCancelled$1: null,
    
    get_projects: function tab_SaveViewModel$get_projects() {
        return this._projects$1;
    },
    set_projects: function tab_SaveViewModel$set_projects(value) {
        this._projects$1.clear();
        this._projects$1.addRange(value);
        this.notifyPropertyChanged('Projects');
        return value;
    },
    
    get_currentProject: function tab_SaveViewModel$get_currentProject() {
        return this._currentProject$1;
    },
    set_currentProject: function tab_SaveViewModel$set_currentProject(value) {
        if (this._currentProject$1 === value) {
            return;
        }
        this._currentProject$1 = value;
        this.notifyPropertyChanged('CurrentProject');
        return value;
    },
    
    get_workbookName: function tab_SaveViewModel$get_workbookName() {
        return this._workbookName$1;
    },
    set_workbookName: function tab_SaveViewModel$set_workbookName(value) {
        if (this._workbookName$1 === value) {
            return;
        }
        this._workbookName$1 = value;
        this.notifyPropertyChanged('WorkbookName');
        return value;
    },
    
    get_showTabs: function tab_SaveViewModel$get_showTabs() {
        return this._showTabs$1;
    },
    set_showTabs: function tab_SaveViewModel$set_showTabs(value) {
        this._showTabs$1 = value;
        this.notifyPropertyChanged('ShowTabs');
        return value;
    },
    
    get_embedCredentials: function tab_SaveViewModel$get_embedCredentials() {
        return this._embedCredentials$1;
    },
    set_embedCredentials: function tab_SaveViewModel$set_embedCredentials(value) {
        this._embedCredentials$1 = value;
        this.notifyPropertyChanged('EmbedCredentials');
        return value;
    },
    
    get_showProjects: function tab_SaveViewModel$get_showProjects() {
        return !tsConfig.isPublic;
    },
    
    get_saveEnabled: function tab_SaveViewModel$get_saveEnabled() {
        if (this.get_showProjects()) {
            return this._hasValidWorkbookName$1() && ss.isValue(this._currentProject$1);
        }
        return this._hasValidWorkbookName$1();
    },
    
    get_saveWarning: function tab_SaveViewModel$get_saveWarning() {
        if (tab.ApplicationModel.get_instance().get_workbook().get_isWorkbookIncomplete()) {
            return tab.Strings.SaveIncompleteWorkbookWarning;
        }
        return null;
    },
    
    showSave: function tab_SaveViewModel$showSave() {
        if (ss.isValue(this.__shown$1)) {
            this.__shown$1();
        }
    },
    
    cancelled: function tab_SaveViewModel$cancelled() {
        this.raiseActionEvent(this.__saveCancelled$1);
    },
    
    hide: function tab_SaveViewModel$hide() {
        this.raiseActionEvent(this.__hidden$1);
        this.dispose();
    },
    
    save: function tab_SaveViewModel$save() {
        if (!this.get_saveEnabled()) {
            return;
        }
        tab.Log.get(this).debug('Save');
        this._saveInternal$1(true);
    },
    
    _hasValidWorkbookName$1: function tab_SaveViewModel$_hasValidWorkbookName$1() {
        return ss.isValue(this._workbookName$1) && this._workbookName$1.trim().length > 0;
    },
    
    _hideInternal$1: function tab_SaveViewModel$_hideInternal$1() {
        this.raiseActionEvent(this.__hidden$1);
    },
    
    _saveInternal$1: function tab_SaveViewModel$_saveInternal$1(confirmOverwrite) {
        tab.SaveServerCommands.saveWorkbookAs(this.get_workbookName(), this.get_currentProject(), this.get_showTabs(), this.get_embedCredentials(), confirmOverwrite, ss.Delegate.create(this, function(newWb) {
            if (ss.isValue(this.__saveSucceeded$1)) {
                this.__saveSucceeded$1(newWb);
            }
            this.dispose();
        }), ss.Delegate.create(this, function(e) {
            if (ss.isValue(e) && e.code === 106) {
                var message = (e.details || e.message).htmlEncode();
                tab.ConfirmationViewModel.showConfirmation(tab.Strings.AuthSaveConfirmOverwrite(message), ss.Delegate.create(this, this._overwriteConfirmed$1));
            }
            else {
                tab.BaseSession.showAlertDialog(e.details || e.message, tab.Strings.AuthSaveErrorTitle, true);
                this.cancelled();
                this.dispose();
            }
        }));
        this._hideInternal$1();
    },
    
    _overwriteConfirmed$1: function tab_SaveViewModel$_overwriteConfirmed$1(confirm) {
        switch (confirm) {
            case 'confirm':
                this._saveInternal$1(false);
                break;
            case 'deny':
                this.showSave();
                break;
            case 'cancel':
                this.cancelled();
                this.dispose();
                break;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataSchemaViewModel

tab.DataSchemaViewModel = function tab_DataSchemaViewModel() {
    this._selectedDataSourceBySheetName$1 = {};
    this._modelsBySection$1 = {};
    this._nodeRoots$1 = {};
    this._selectedNodes$1 = [];
    tab.DataSchemaViewModel.initializeBase(this);
    this._tabSubscription$1 = dojo.subscribe('onTabSelect', ss.Delegate.create(this, this.doTabSelect));
    this._convertDropTarget$1 = new tab.ConvertUnnamedFieldsDropTarget(ss.Delegate.create(this, this._handleFieldsConverted$1));
    this._dimensionDropTarget$1 = new tab.DimensionFieldDropTarget(this._convertDropTarget$1);
    this._measureDropTarget$1 = new tab.MeasureFieldDropTarget(this._convertDropTarget$1);
    tab.DataSchemaViewModel.sectionsInOrder.forEach(ss.Delegate.create(this, function(section) {
        this._modelsBySection$1[section] = [];
    }));
}
tab.DataSchemaViewModel.filterFieldsForViewing = function tab_DataSchemaViewModel$filterFieldsForViewing(models, shouldShowHidden) {
    return models.filter(function(f) {
        if (f.get_isUnnamedCalc() || (!shouldShowHidden && f.get_isHidden())) {
            return false;
        }
        return true;
    });
}
tab.DataSchemaViewModel._nodeSortByType$1 = function tab_DataSchemaViewModel$_nodeSortByType$1(a, b) {
    var acontainer = a.isUnsortedContainer;
    var bcontainer = b.isUnsortedContainer;
    if (acontainer && !bcontainer) {
        return -1;
    }
    else if (!acontainer && bcontainer) {
        return 1;
    }
    else if (a.isCubeFolder && b.isCubeFolder) {
        return tab.DataSchemaViewModel._fieldSortOrdinal$1(a, b);
    }
    return 0;
}
tab.DataSchemaViewModel._nodeSortWithinCubeDimensions$1 = function tab_DataSchemaViewModel$_nodeSortWithinCubeDimensions$1(a, b) {
    var atype = a.instanceType;
    var btype = b.instanceType;
    if (atype === 'cubeFolder' && btype !== 'cubeFolder') {
        return -1;
    }
    else if (atype !== 'cubeFolder' && btype === 'cubeFolder') {
        return 1;
    }
    else if (atype === 'cubeFolder' && btype === 'cubeFolder') {
        return tab.DataSchemaViewModel._fieldSortOrdinal$1(a, b);
    }
    else if (atype === 'cubeHierarchy' && btype !== 'cubeHierarchy') {
        return -1;
    }
    else if (atype !== 'cubeHierarchy' && btype === 'cubeHierarchy') {
        return 1;
    }
    else if (atype === 'cubeDimension' && btype !== 'cubeDimension') {
        return 1;
    }
    else if (atype !== 'cubeDimension' && btype === 'cubeDimension') {
        return -1;
    }
    else {
        return tab.DataSchemaViewModel._fieldSortAlpha$1(a, b);
    }
}
tab.DataSchemaViewModel._fieldSortAlpha$1 = function tab_DataSchemaViewModel$_fieldSortAlpha$1(a, b) {
    if (!a.isDerived && b.isDerived) {
        return -1;
    }
    else if (a.isDerived && !b.isDerived) {
        return 1;
    }
    else if (a.isMeasureNamesOrValues) {
        return 1;
    }
    else if (b.isMeasureNamesOrValues) {
        return -1;
    }
    return (a.displayName.toUpperCase()).localeCompare(b.displayName.toUpperCase());
}
tab.DataSchemaViewModel._fieldSortOrdinal$1 = function tab_DataSchemaViewModel$_fieldSortOrdinal$1(a, b) {
    if (!a.isDerived && b.isDerived) {
        return -1;
    }
    else if (a.isDerived && !b.isDerived) {
        return 1;
    }
    else if (a.isMeasureNamesOrValues) {
        return 1;
    }
    else if (b.isMeasureNamesOrValues) {
        return -1;
    }
    var acalc = a.isCalculated;
    var bcalc = b.isCalculated;
    if (acalc && bcalc) {
        return tab.DataSchemaViewModel._fieldSortAlpha$1(a, b);
    }
    else if (acalc && !bcalc) {
        return 1;
    }
    else if (!acalc && bcalc) {
        return -1;
    }
    else {
        var aord = a.ordinal;
        var bord = b.ordinal;
        if (aord < bord) {
            return -1;
        }
        else if (aord > bord) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
tab.DataSchemaViewModel.showCommandsContextMenu = function tab_DataSchemaViewModel$showCommandsContextMenu(commands, relativeDom, handler, menuHidden) {
    tab.Param.verifyValue(commands, 'commands');
    var commandsWrapper = tab.CommandsPresModelWrapper.create(commands);
    if (tab.MiscUtil.isNullOrEmpty(commandsWrapper.get_commandItems())) {
        if (ss.isValue(menuHidden)) {
            menuHidden();
        }
        return;
    }
    var items = [];
    tab.WidgetUtil.newMenuItemsFromCommands(items, commands, function(commandModel) {
        var commandWrapper = tab.CommandItemWrapper.create(commandModel);
        var c = tab.CommandSerializer.deserialize(commandWrapper.get_command());
        var cmdAction = function() {
            tab.ServerCommands.executeServerCommand(c, 'immediately', tab.CommandUtils.createCommandRedirectSuccessHandler(null), null);
        };
        return cmdAction;
    });
    var menu = new spiff.Menu(items);
    var menuViewModel = spiff.MenuViewModel.createForMenu(menu, handler);
    menuViewModel.show(spiff.ShowMenuOptions.create(relativeDom, false));
    if (ss.isValue(menuHidden)) {
        menuViewModel.add_hidden(menuHidden);
    }
}
tab.DataSchemaViewModel.prototype = {
    _dimensionDropTarget$1: null,
    _measureDropTarget$1: null,
    _convertDropTarget$1: null,
    _schema$1: null,
    _doubleClicking$1: false,
    _tabSubscription$1: null,
    _currentSheetName$1: null,
    
    add_dataSchemaModified: function tab_DataSchemaViewModel$add_dataSchemaModified(value) {
        this.__dataSchemaModified$1 = ss.Delegate.combine(this.__dataSchemaModified$1, value);
    },
    remove_dataSchemaModified: function tab_DataSchemaViewModel$remove_dataSchemaModified(value) {
        this.__dataSchemaModified$1 = ss.Delegate.remove(this.__dataSchemaModified$1, value);
    },
    
    __dataSchemaModified$1: null,
    
    add_dataSourceListChanged: function tab_DataSchemaViewModel$add_dataSourceListChanged(value) {
        this.__dataSourceListChanged$1 = ss.Delegate.combine(this.__dataSourceListChanged$1, value);
    },
    remove_dataSourceListChanged: function tab_DataSchemaViewModel$remove_dataSourceListChanged(value) {
        this.__dataSourceListChanged$1 = ss.Delegate.remove(this.__dataSourceListChanged$1, value);
    },
    
    __dataSourceListChanged$1: null,
    
    add_nodeActivated: function tab_DataSchemaViewModel$add_nodeActivated(value) {
        this.__nodeActivated$1 = ss.Delegate.combine(this.__nodeActivated$1, value);
    },
    remove_nodeActivated: function tab_DataSchemaViewModel$remove_nodeActivated(value) {
        this.__nodeActivated$1 = ss.Delegate.remove(this.__nodeActivated$1, value);
    },
    
    __nodeActivated$1: null,
    
    get_dataSchema: function tab_DataSchemaViewModel$get_dataSchema() {
        return this._schema$1;
    },
    set_dataSchema: function tab_DataSchemaViewModel$set_dataSchema(value) {
        if (this._schema$1 === value) {
            return;
        }
        if (ss.isValue(this._schema$1)) {
            this._schema$1.remove_newDataSchema(ss.Delegate.create(this, this._handleSchemaModified$1));
        }
        this._schema$1 = value;
        this._schema$1.add_newDataSchema(ss.Delegate.create(this, this._handleSchemaModified$1));
        this._handleSchemaModified$1();
        return value;
    },
    
    get_schemaDropTarget: function tab_DataSchemaViewModel$get_schemaDropTarget() {
        return this._convertDropTarget$1;
    },
    
    get_dimensionDropTarget: function tab_DataSchemaViewModel$get_dimensionDropTarget() {
        return this._dimensionDropTarget$1;
    },
    
    get_measureDropTarget: function tab_DataSchemaViewModel$get_measureDropTarget() {
        return this._measureDropTarget$1;
    },
    
    get_currentSheetName: function tab_DataSchemaViewModel$get_currentSheetName() {
        if (tsConfig.current_sheet_name === this._currentSheetName$1) {
            this._currentSheetName$1 = null;
        }
        return (this._currentSheetName$1 || tsConfig.current_sheet_name);
    },
    set_currentSheetName: function tab_DataSchemaViewModel$set_currentSheetName(value) {
        this._currentSheetName$1 = value;
        this._update$1();
        return value;
    },
    
    get_currentSheetSchema: function tab_DataSchemaViewModel$get_currentSheetSchema() {
        return this.get_dataSchema().get_dataSchemaPresModel().worksheetDataSchemaMap[this.get_currentSheetName()];
    },
    
    get_selectedDataSource: function tab_DataSchemaViewModel$get_selectedDataSource() {
        if (ss.isNullOrUndefined(this._schema$1)) {
            return null;
        }
        if (ss.isNullOrUndefined(this._selectedDataSourceBySheetName$1[this.get_currentSheetName()])) {
            this._selectedDataSourceBySheetName$1[this.get_currentSheetName()] = this._schema$1.getDefaultDataSourceForSheet(this.get_currentSheetName());
        }
        return this._selectedDataSourceBySheetName$1[this.get_currentSheetName()];
    },
    set_selectedDataSource: function tab_DataSchemaViewModel$set_selectedDataSource(value) {
        this._updateSelectedDataSource$1(value);
        return value;
    },
    
    get_specifiedWidth: function tab_DataSchemaViewModel$get_specifiedWidth() {
        return this.get_selectedDataSource().get_specifiedWidth();
    },
    set_specifiedWidth: function tab_DataSchemaViewModel$set_specifiedWidth(value) {
        this.get_selectedDataSource().set_specifiedWidth(value);
        return value;
    },
    
    get_selectableDataSources: function tab_DataSchemaViewModel$get_selectableDataSources() {
        var ds = [];
        if (ss.isValue(this._schema$1)) {
            var $enum1 = ss.IEnumerator.getEnumerator(this._schema$1.get_dataSources());
            while ($enum1.moveNext()) {
                var dataSource = $enum1.current;
                if (dataSource !== this._schema$1.get_parametersDataSource()) {
                    ds.add(dataSource);
                }
            }
        }
        return ds;
    },
    
    get_selectedNodes: function tab_DataSchemaViewModel$get_selectedNodes() {
        return this._selectedNodes$1;
    },
    
    get_selectedFields: function tab_DataSchemaViewModel$get_selectedFields() {
        return this._selectedNodes$1.map(ss.Delegate.create(this, function(node) {
            if (node.isSelectable && ss.isValue(node.childToSelect)) {
                return this.get_dataSchema().findField(node.childToSelect);
            }
            return this.get_dataSchema().findField(node.globalFieldName || '');
        })).filter(function(fieldModel) {
            return ss.isValue(fieldModel);
        });
    },
    
    get_selectedFieldNames: function tab_DataSchemaViewModel$get_selectedFieldNames() {
        var fieldNames = [];
        var $enum1 = ss.IEnumerator.getEnumerator(this._selectedNodes$1);
        while ($enum1.moveNext()) {
            var node = $enum1.current;
            var fieldName = node.childToSelect || node.globalFieldName;
            if (ss.isValue(fieldName) && !fieldNames.contains(fieldName)) {
                fieldNames.add(fieldName);
            }
        }
        return fieldNames;
    },
    
    get_lastSelection: function tab_DataSchemaViewModel$get_lastSelection() {
        if (ss.isValue(this._selectedNodes$1) && !this._selectedNodes$1.length) {
            return null;
        }
        else {
            return this._selectedNodes$1[this._selectedNodes$1.length - 1];
        }
    },
    
    get_lastSelectedFieldName: function tab_DataSchemaViewModel$get_lastSelectedFieldName() {
        if (this.get_lastSelection() == null) {
            return null;
        }
        else {
            return this.get_lastSelection().globalFieldName;
        }
    },
    
    get_currentLayout: function tab_DataSchemaViewModel$get_currentLayout() {
        if (ss.isNullOrUndefined(this.get_selectedDataSource())) {
            var layout = {};
            layout.dsoDimensionSortOrder = 'dso-alphabetic';
            layout.dsoMeasureSortOrder = 'dso-alphabetic';
            layout.showHiddenFields = false;
            layout.showStructure = true;
            return layout;
        }
        return this.get_selectedDataSource().get_dataSourceLayoutPresModel();
    },
    
    nodeTreeForSection: function tab_DataSchemaViewModel$nodeTreeForSection(section) {
        return (Object.keyExists(this._nodeRoots$1, section)) ? this._nodeRoots$1[section].children : null;
    },
    
    buildSchemaHierarchy: function tab_DataSchemaViewModel$buildSchemaHierarchy(section) {
        var fields = this._modelsBySection$1[section];
        var roots = [];
        var possibleOrphans = {};
        var tableCount = 0;
        var lastTableNode = null;
        var layout = this.get_currentLayout();
        var showStructure = layout.showStructure;
        var showHiddenFields = layout.showHiddenFields;
        var sortOrder = 'dso-alphabetic';
        if (ss.isValue(layout)) {
            switch (section) {
                case 'measure':
                    sortOrder = layout.dsoMeasureSortOrder;
                    break;
                case 'dimensions':
                    sortOrder = layout.dsoDimensionSortOrder;
                    break;
            }
            if (sortOrder === 'dso-ordinal' && !layout.canSortOrdinal) {
                sortOrder = 'dso-alphabetic';
            }
        }
        var fieldSort = tab.DataSchemaViewModel._fieldSortAlpha$1;
        if (sortOrder === 'dso-ordinal') {
            fieldSort = tab.DataSchemaViewModel._fieldSortOrdinal$1;
        }
        var nodeSort = function(a, b) {
            var typeCompare = tab.DataSchemaViewModel._nodeSortByType$1(a, b);
            if (!!typeCompare) {
                return typeCompare;
            }
            return fieldSort(a, b);
        };
        fields = tab.DataSchemaViewModel.filterFieldsForViewing(fields, showHiddenFields);
        var $enum1 = ss.IEnumerator.getEnumerator(fields);
        while ($enum1.moveNext()) {
            var field = $enum1.current;
            var node = new tab.SchemaNode(field);
            var shouldHaveChildren = true;
            switch (field.get_instanceType()) {
                case 'drillPath':
                    var levels = field.asDrillPath().get_levels();
                    levels = tab.DataSchemaViewModel.filterFieldsForViewing(levels, showHiddenFields);
                    var $enum2 = ss.IEnumerator.getEnumerator(levels);
                    while ($enum2.moveNext()) {
                        var childColumn = $enum2.current;
                        var childNode = new tab.SchemaNode(childColumn);
                        node.children.add(childNode);
                    }
                    break;
                case 'folder':
                    var childFields = field.asFolder().get_fields();
                    if (ss.isValue(childFields)) {
                        childFields = tab.DataSchemaViewModel.filterFieldsForViewing(childFields, showHiddenFields);
                    }
                    node.section = section;
                    var $enum3 = ss.IEnumerator.getEnumerator(childFields);
                    while ($enum3.moveNext()) {
                        var childField = $enum3.current;
                        var childNode = new tab.SchemaNode(childField);
                        node.children.add(childNode);
                        if (childField.get_isDrillPath()) {
                            var childLevels = childField.asDrillPath().get_levels();
                            childLevels = tab.DataSchemaViewModel.filterFieldsForViewing(childLevels, showHiddenFields);
                            var $enum4 = ss.IEnumerator.getEnumerator(childLevels);
                            while ($enum4.moveNext()) {
                                var grandchildColumn = $enum4.current;
                                var grandchildNode = new tab.SchemaNode(grandchildColumn);
                                childNode.children.add(grandchildNode);
                            }
                        }
                    }
                    node.children.sort(nodeSort);
                    break;
                case 'relationalTable':
                    var columns = field.asRelationalTable().get_columns();
                    columns = tab.DataSchemaViewModel.filterFieldsForViewing(columns, showHiddenFields);
                    node.section = section;
                    columns = columns.filter(function(column) {
                        return column.matchesFolderRole(section);
                    });
                    var $enum5 = ss.IEnumerator.getEnumerator(columns);
                    while ($enum5.moveNext()) {
                        var childColumn = $enum5.current;
                        var childNode = new tab.SchemaNode(childColumn);
                        if (showStructure) {
                            node.children.add(childNode);
                        }
                        else {
                            possibleOrphans[childNode.get_comparisonKey()] = childNode;
                        }
                    }
                    node.children.sort(nodeSort);
                    if (node.children.length > 0) {
                        tableCount++;
                        lastTableNode = node;
                    }
                    break;
                case 'cubeFolder':
                    var folderColumns = field.asCubeFolder().get_columns();
                    folderColumns = tab.DataSchemaViewModel.filterFieldsForViewing(folderColumns, showHiddenFields);
                    node.section = section;
                    folderColumns = folderColumns.filter(function(column) {
                        return column.matchesFolderRole(section);
                    });
                    var $enum6 = ss.IEnumerator.getEnumerator(folderColumns);
                    while ($enum6.moveNext()) {
                        var childColumn = $enum6.current;
                        var childNode = new tab.SchemaNode(childColumn);
                        if (showStructure) {
                            node.children.add(childNode);
                        }
                        else {
                            possibleOrphans[childNode.get_comparisonKey()] = childNode;
                        }
                    }
                    node.children.sort(function(a, b) {
                        return tab.DataSchemaViewModel._fieldSortOrdinal$1(a, b);
                    });
                    break;
                case 'cubeDimension':
                    var dim = field.asDimension();
                    this._buildCubeSchema$1(node, dim, showHiddenFields, showStructure, false);
                    break;
                default:
                    shouldHaveChildren = false;
                    break;
            }
            if (!shouldHaveChildren || node.children.length > 0) {
                roots.add(node);
            }
        }
        if (showStructure) {
            var orphanedColumns = {};
            if (tableCount === 1) {
                roots.remove(lastTableNode);
                var $enum7 = ss.IEnumerator.getEnumerator(lastTableNode.children);
                while ($enum7.moveNext()) {
                    var childNode = $enum7.current;
                    roots.add(childNode);
                    orphanedColumns[childNode.get_comparisonKey()] = childNode;
                }
                tableCount--;
            }
            var $enum8 = ss.IEnumerator.getEnumerator(roots);
            while ($enum8.moveNext()) {
                var node = $enum8.current;
                if (node.isFolder) {
                    var $enum9 = ss.IEnumerator.getEnumerator(node.children);
                    while ($enum9.moveNext()) {
                        var childNode = $enum9.current;
                        if (!Object.keyExists(orphanedColumns, childNode.get_comparisonKey())) {
                            roots.add(childNode);
                        }
                    }
                }
            }
            roots = roots.filter(function(node) {
                return !node.isFolder;
            });
        }
        else {
            var $enum10 = ss.IEnumerator.getEnumerator(roots);
            while ($enum10.moveNext()) {
                var node = $enum10.current;
                if (node.isFolder) {
                    var $enum11 = ss.IEnumerator.getEnumerator(node.children);
                    while ($enum11.moveNext()) {
                        var childNode = $enum11.current;
                        var key = childNode.get_comparisonKey();
                        if (Object.keyExists(possibleOrphans, key)) {
                            delete possibleOrphans[key];
                        }
                    }
                }
            }
            var $dict12 = possibleOrphans;
            for (var $key13 in $dict12) {
                var orphan = { key: $key13, value: $dict12[$key13] };
                roots.add(orphan.value);
            }
        }
        roots.sort(nodeSort);
        var root = new tab.SchemaNode(null);
        root.children.addRange(roots);
        return root;
    },
    
    getEssbaseVirtualHierarchies: function tab_DataSchemaViewModel$getEssbaseVirtualHierarchies(hierarchies, dim) {
        if (hierarchies.length === 2) {
            var hierNames = _.map(hierarchies, function(model) {
                return model.get_localName();
            });
            if (hierNames.contains('Levels') && hierNames.contains('Generations')) {
                var defaultHierarchyName = (dim.get_presModel()).defaultHierarchyName;
                var filteredHierarchies = _.filter(hierarchies, function(model) {
                    return model.get_localName() === defaultHierarchyName;
                });
                if (filteredHierarchies.length > 0) {
                    hierarchies = filteredHierarchies;
                }
            }
        }
        return hierarchies;
    },
    
    _buildCubeSchema$1: function tab_DataSchemaViewModel$_buildCubeSchema$1(node, dim, showHiddenFields, showStructure, isAttributeDimension) {
        var hierarchies = dim.get_hierarchies();
        hierarchies = tab.DataSchemaViewModel.filterFieldsForViewing(hierarchies, showHiddenFields);
        var folders = dim.get_folders();
        hierarchies = this.getEssbaseVirtualHierarchies(hierarchies, dim);
        var multipleChildren = hierarchies.length + folders.length > 1;
        var $enum1 = ss.IEnumerator.getEnumerator(hierarchies);
        while ($enum1.moveNext()) {
            var childHier = $enum1.current;
            this._fillHierarchies$1(childHier, node, multipleChildren, showHiddenFields, isAttributeDimension);
        }
        var $enum2 = ss.IEnumerator.getEnumerator(folders);
        while ($enum2.moveNext()) {
            var childFolder = $enum2.current;
            var childNode = new tab.SchemaNode(childFolder);
            var showFolder = multipleChildren && showStructure;
            if (showFolder) {
                node.children.add(childNode);
            }
            var folderHierarchies = childFolder.get_hierarchies();
            folderHierarchies = tab.DataSchemaViewModel.filterFieldsForViewing(folderHierarchies, showHiddenFields);
            var $enum3 = ss.IEnumerator.getEnumerator(folderHierarchies);
            while ($enum3.moveNext()) {
                var grandchildHier = $enum3.current;
                var parentNode = ((showFolder) ? childNode : node);
                this._fillHierarchies$1(grandchildHier, parentNode, true, showHiddenFields, isAttributeDimension);
            }
            childNode.children.sort(tab.DataSchemaViewModel._nodeSortWithinCubeDimensions$1);
        }
        var $enum4 = ss.IEnumerator.getEnumerator(dim.get_attributes());
        while ($enum4.moveNext()) {
            var attribute = $enum4.current;
            var childNode = new tab.SchemaNode(attribute);
            this._buildCubeSchema$1(childNode, attribute, showHiddenFields, showStructure, true);
            node.children.add(childNode);
        }
        if (multipleChildren) {
            node.children.sort(tab.DataSchemaViewModel._nodeSortWithinCubeDimensions$1);
        }
    },
    
    _fillHierarchies$1: function tab_DataSchemaViewModel$_fillHierarchies$1(hier, parent, hasSiblings, showHiddenFields, isAttribute) {
        var levels = hier.get_levels();
        levels = tab.DataSchemaViewModel.filterFieldsForViewing(levels, showHiddenFields);
        var isSingleAttrHierachy = levels.length === 1 && (isAttribute || (levels[0].get_localName() === hier.get_localName()));
        var node = new tab.SchemaNode((isSingleAttrHierachy) ? levels[0] : hier);
        if (hasSiblings) {
            parent.children.add(node);
        }
        if (levels.length === 1 && isAttribute) {
            parent.displayName = levels[0].get_description();
            return;
        }
        if (hasSiblings && isSingleAttrHierachy) {
            return;
        }
        var levelContainer = ((hasSiblings) ? node : parent).children;
        var $enum1 = ss.IEnumerator.getEnumerator(levels);
        while ($enum1.moveNext()) {
            var level = $enum1.current;
            var levelNode = new tab.SchemaNode(level);
            levelContainer.add(levelNode);
        }
    },
    
    refreshButtonClicked: function tab_DataSchemaViewModel$refreshButtonClicked() {
        tab.ToolbarServerCommands.refreshData();
    },
    
    hasSelection: function tab_DataSchemaViewModel$hasSelection() {
        return (ss.isValue(this._selectedNodes$1) && this._selectedNodes$1.length > 0);
    },
    
    isSelected: function tab_DataSchemaViewModel$isSelected(node) {
        return _.any(this._selectedNodes$1, function(selectedNode) {
            return node.equals(selectedNode);
        });
    },
    
    _notifySelectionChange$1: function tab_DataSchemaViewModel$_notifySelectionChange$1() {
        this.notifyPropertyChanged('SelectedField');
        var calledSelection = this.get_selectedFieldNames();
        tab.SelectionClientCommands.selectFields(calledSelection, this.get_selectedDataSource().get_name(), ss.Delegate.create(this, function(pm) {
            if (_.isEqual(this.get_selectedFieldNames(), calledSelection)) {
                var showmeCommands = tab.ModelUtils.findActiveOrDefaultVisual().get_showMeModel();
                showmeCommands.forceUpdate(pm);
                showmeCommands.set_shouldUpdate((!calledSelection.length));
            }
        }));
    },
    
    addNodeToSelection: function tab_DataSchemaViewModel$addNodeToSelection(node) {
        if (!this.isSelected(node)) {
            this._selectedNodes$1.add(node);
            this._notifySelectionChange$1();
        }
    },
    
    addNodesToSelection: function tab_DataSchemaViewModel$addNodesToSelection(nodes) {
        var found = false;
        var $enum1 = ss.IEnumerator.getEnumerator(nodes);
        while ($enum1.moveNext()) {
            var node = $enum1.current;
            if (!this.isSelected(node)) {
                this._selectedNodes$1.add(node);
                found = true;
            }
        }
        if (found) {
            this._notifySelectionChange$1();
        }
    },
    
    clearAllAndSelectNodes: function tab_DataSchemaViewModel$clearAllAndSelectNodes(nodes) {
        if (!!this._selectedNodes$1.length) {
            this._selectedNodes$1.clear();
        }
        this.addNodesToSelection(nodes);
    },
    
    clearAllAndSelect: function tab_DataSchemaViewModel$clearAllAndSelect(node) {
        if (!!this._selectedNodes$1.length) {
            this._selectedNodes$1.clear();
        }
        if (ss.isValue(node)) {
            this._selectedNodes$1.add(node);
        }
        this._notifySelectionChange$1();
    },
    
    deSelectNode: function tab_DataSchemaViewModel$deSelectNode(node) {
        if (this._selectedNodes$1.remove(node)) {
            this._notifySelectionChange$1();
        }
    },
    
    deSelectNodes: function tab_DataSchemaViewModel$deSelectNodes(nodes) {
        var found = false;
        var $enum1 = ss.IEnumerator.getEnumerator(nodes);
        while ($enum1.moveNext()) {
            var node = $enum1.current;
            if (this._selectedNodes$1.remove(node)) {
                found = true;
            }
        }
        if (found) {
            this._notifySelectionChange$1();
        }
    },
    
    clearSelection: function tab_DataSchemaViewModel$clearSelection() {
        if (!!this._selectedNodes$1.length) {
            this._selectedNodes$1.clear();
            this._notifySelectionChange$1();
        }
    },
    
    _handleFieldsConverted$1: function tab_DataSchemaViewModel$_handleFieldsConverted$1(convertedFields) {
        var $enum1 = ss.IEnumerator.getEnumerator(convertedFields);
        while ($enum1.moveNext()) {
            var fn = $enum1.current;
            var ds = this._schema$1.findDataSourceFromGlobalFieldName(fn);
            if (ss.isValue(ds) && ds !== this.get_selectedDataSource()) {
                this.set_selectedDataSource(ds);
            }
            var node = this.findNode(fn);
            if (node != null) {
                this.clearAllAndSelect(node);
                if (ss.isValue(this.__nodeActivated$1)) {
                    this.__nodeActivated$1(node);
                }
                return;
            }
        }
    },
    
    findNode: function tab_DataSchemaViewModel$findNode(fieldName) {
        var $dict1 = this._nodeRoots$1;
        for (var $key2 in $dict1) {
            var root = { key: $key2, value: $dict1[$key2] };
            var node = root.value.find(fieldName);
            if (ss.isValue(node)) {
                return node;
            }
        }
        return null;
    },
    
    createDragSource: function tab_DataSchemaViewModel$createDragSource() {
        return new tab.FieldDragSource(ss.Delegate.create(this, function() {
            return this.get_selectedFields();
        }), ss.Delegate.create(this, function() {
            this.clearSelection();
        }));
    },
    
    addFieldToSheet: function tab_DataSchemaViewModel$addFieldToSheet(f) {
        if (!this._doubleClicking$1) {
            this._doubleClicking$1 = true;
            tab.SchemaClientCommands.addFieldToSheet(f, ss.Delegate.create(this, function() {
                this._doubleClicking$1 = false;
            }));
        }
    },
    
    showContextMenu: function tab_DataSchemaViewModel$showContextMenu(relativeDom, menuHidden) {
        if (ss.isNullOrUndefined(this.get_selectedDataSource())) {
            if (ss.isValue(menuHidden)) {
                menuHidden();
            }
            return;
        }
        tab.SchemaClientCommands.requestSchemaContextMenu(this.get_selectedDataSource(), ss.Delegate.create(this, function(commands) {
            tab.DataSchemaViewModel.showCommandsContextMenu(commands, relativeDom, ss.Delegate.create(this, this._onMenuItemClicked$1), menuHidden);
        }));
    },
    
    showFieldContextMenu: function tab_DataSchemaViewModel$showFieldContextMenu(f, relativeDom) {
        var fieldName = f.globalFieldName;
        if (f.isSelectable && ss.isValue(f.childToSelect)) {
            fieldName = f.childToSelect;
        }
        tab.SchemaClientCommands.requestSchemaFieldContextMenu(this.get_selectedDataSource(), fieldName, ss.Delegate.create(this, function(commands) {
            tab.DataSchemaViewModel.showCommandsContextMenu(commands, relativeDom, ss.Delegate.create(this, this._onMenuItemClicked$1), null);
        }));
    },
    
    _onMenuItemClicked$1: function tab_DataSchemaViewModel$_onMenuItemClicked$1(arg) {
        if ($.isFunction(arg.get_data())) {
            (arg.get_data())();
        }
    },
    
    doTabSelect: function tab_DataSchemaViewModel$doTabSelect(msg) {
        this.set_currentSheetName(msg.sheetName);
        if (ss.isValue(this.__dataSchemaModified$1)) {
            this.__dataSchemaModified$1();
        }
        this.clearSelection();
    },
    
    dispose: function tab_DataSchemaViewModel$dispose() {
        tab.DataSchemaViewModel.callBaseMethod(this, 'dispose');
        dojo.unsubscribe(this._tabSubscription$1);
        this._dimensionDropTarget$1.dispose();
        this._measureDropTarget$1.dispose();
        this._convertDropTarget$1.dispose();
    },
    
    _updateSelectedDataSource$1: function tab_DataSchemaViewModel$_updateSelectedDataSource$1(newDs) {
        if (Object.keyExists(this._selectedDataSourceBySheetName$1, this.get_currentSheetName())) {
            var currentValue = this._selectedDataSourceBySheetName$1[this.get_currentSheetName()];
            if (currentValue.get_name() === newDs.get_name() && _.isEqual(currentValue.get_fields(), newDs.get_fields())) {
                return false;
            }
        }
        this.clearSelection();
        this._selectedDataSourceBySheetName$1[this.get_currentSheetName()] = newDs;
        this._update$1();
        return true;
    },
    
    _handleSchemaModified$1: function tab_DataSchemaViewModel$_handleSchemaModified$1() {
        var newDataSource = (this._selectedDataSourceBySheetName$1[this.get_currentSheetName()] || this.get_dataSchema().getDefaultDataSourceForSheet(this.get_currentSheetName()));
        if (ss.isNullOrUndefined(newDataSource)) {
            return;
        }
        var matchingDS = _.find(this.get_selectableDataSources(), function(model) {
            return model.get_name() === newDataSource.get_name();
        });
        var updateCalled = false;
        if (ss.isValue(matchingDS)) {
            updateCalled = this._updateSelectedDataSource$1(matchingDS);
        }
        if (!updateCalled) {
            this._update$1();
        }
    },
    
    _update$1: function tab_DataSchemaViewModel$_update$1() {
        var m = tabBootstrap.MetricsController.get_instance().createContext('Update DataSchema', tabBootstrap.MetricsSuites.debug);
        var newModels = {};
        tab.DataSchemaViewModel.sectionsInOrder.forEach(function(section) {
            newModels[section] = [];
        });
        if (ss.isValue(this.get_selectedDataSource()) && ss.isValue(this.get_selectedDataSource().get_fields())) {
            var $enum1 = ss.IEnumerator.getEnumerator(this.get_selectedDataSource().get_fields());
            while ($enum1.moveNext()) {
                var field = $enum1.current;
                switch (field.get_instanceType()) {
                    case 'drillPath':
                    case 'cubeDimension':
                    case 'cubeHierarchy':
                        newModels['dimensions'].add(field);
                        break;
                    case 'cubeFolder':
                        newModels['dimensions'].add(field);
                        newModels['measure'].add(field);
                        break;
                    case 'relationalTable':
                        newModels['dimensions'].add(field);
                        newModels['measure'].add(field);
                        break;
                    case 'folder':
                        newModels[field.asFolder().get_folderRole()].add(field);
                        break;
                    case 'group':
                        var group = field.asGroup();
                        if (group.get_isCombinedField()) {
                            newModels['dimensions'].add(group);
                        }
                        else {
                            newModels['groups'].add(group);
                        }
                        break;
                    case 'column':
                        switch (field.get_defaultRole()) {
                            case 'measure':
                                newModels['measure'].add(field);
                                break;
                            case 'dimension':
                            default:
                                newModels['dimensions'].add(field);
                                break;
                        }
                        break;
                    default:
                        newModels['measure'].add(field);
                        break;
                }
            }
        }
        var paramDatasource = this._schema$1.get_parametersDataSource();
        if (ss.isValue(paramDatasource)) {
            newModels['parameters'].addRange(paramDatasource.get_fields());
        }
        var anyChanged = false;
        tab.DataSchemaViewModel.sectionsInOrder.forEach(ss.Delegate.create(this, function(section) {
            this._modelsBySection$1[section] = newModels[section];
            var node = this.buildSchemaHierarchy(section);
            if (!anyChanged && !_.isEqual(this._nodeRoots$1[section], node)) {
                anyChanged = true;
            }
            this._nodeRoots$1[section] = node;
        }));
        this.raiseActionEvent((anyChanged) ? this.__dataSchemaModified$1 : this.__dataSourceListChanged$1);
        m.close();
        tab.Log.get(this).debug('DataSchemaModified: %s', m.elapsedMS());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DropTargetWithDropState

tab.DropTargetWithDropState = function tab_DropTargetWithDropState() {
    spiff.DragDropManager.add_dragStarted(ss.Delegate.create(this, this.dragStarted));
    spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this.dragEnded));
}
tab.DropTargetWithDropState.prototype = {
    _dropState: 0,
    
    add_dropStateChanged: function tab_DropTargetWithDropState$add_dropStateChanged(value) {
        this.__dropStateChanged = ss.Delegate.combine(this.__dropStateChanged, value);
    },
    remove_dropStateChanged: function tab_DropTargetWithDropState$remove_dropStateChanged(value) {
        this.__dropStateChanged = ss.Delegate.remove(this.__dropStateChanged, value);
    },
    
    __dropStateChanged: null,
    
    get_feedbackType: function tab_DropTargetWithDropState$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    get_dropState: function tab_DropTargetWithDropState$get_dropState() {
        return this._dropState;
    },
    set_dropState: function tab_DropTargetWithDropState$set_dropState(value) {
        if (this._dropState === value) {
            return;
        }
        this._dropState = value;
        if (ss.isValue(this.__dropStateChanged)) {
            this.__dropStateChanged(this._dropState);
        }
        return value;
    },
    
    dispose: function tab_DropTargetWithDropState$dispose() {
        spiff.DragDropManager.remove_dragStarted(ss.Delegate.create(this, this.dragStarted));
        spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this.dragEnded));
    },
    
    dragStarted: function tab_DropTargetWithDropState$dragStarted(d) {
        this.set_dropState((this.canAccept(d)) ? 1 : 2);
    },
    
    dragEnded: function tab_DropTargetWithDropState$dragEnded(result) {
        this.set_dropState(0);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SchemaViewFieldDropTarget

tab.SchemaViewFieldDropTarget = function tab_SchemaViewFieldDropTarget(convertTarget) {
    tab.SchemaViewFieldDropTarget.initializeBase(this);
    this._convertTarget$1 = convertTarget;
}
tab.SchemaViewFieldDropTarget.prototype = {
    _convertTarget$1: null,
    
    getDropTarget: function tab_SchemaViewFieldDropTarget$getDropTarget(hit) {
        return this;
    },
    
    dragExit: function tab_SchemaViewFieldDropTarget$dragExit(d) {
        tab.Log.get(this).debug('Drag exit');
    },
    
    dragOver: function tab_SchemaViewFieldDropTarget$dragOver(d) {
        tab.Log.get(this).debug('Drag over');
        if (this.canAccept(d)) {
            return this;
        }
        return this._convertTarget$1.dragOver(d);
    },
    
    isFieldDrop: function tab_SchemaViewFieldDropTarget$isFieldDrop(d) {
        if (Type.canCast(d, tab.PillDragInstance)) {
            var pillDragInstance = d;
            return pillDragInstance.hasOnlyFields();
        }
        return false;
    },
    
    handleDrop: function tab_SchemaViewFieldDropTarget$handleDrop(d, conversionCommand) {
        if (this.canAccept(d)) {
            var pillDragInstance = (d);
            var fieldNames = _.map(pillDragInstance.get_fields(), function(fieldModel) {
                return ((fieldModel.get_isColumn() && fieldModel.asColumn().get_isInstance()) ? fieldModel.asColumn().get_baseColumn() : fieldModel).get_globalName();
            });
            conversionCommand(fieldNames);
            return true;
        }
        return false;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DimensionFieldDropTarget

tab.DimensionFieldDropTarget = function tab_DimensionFieldDropTarget(convertTarget) {
    tab.DimensionFieldDropTarget.initializeBase(this, [ convertTarget ]);
}
tab.DimensionFieldDropTarget.prototype = {
    
    canAccept: function tab_DimensionFieldDropTarget$canAccept(d) {
        var fieldConversion = tab.FeatureParamsLookup.getBool(tab.FeatureParam.fieldTypeConversion);
        if (ss.isValue(fieldConversion) && fieldConversion) {
            return this.isFieldDrop(d) && _.every((d).get_fields(), function(fieldModel) {
                return fieldModel.get_defaultRole() === 'measure';
            });
        }
        return false;
    },
    
    acceptDrop: function tab_DimensionFieldDropTarget$acceptDrop(d) {
        var result = $.DeferredData();
        result.resolve(this.handleDrop(d, tab.SchemaClientCommands.convertToDimension));
        return result;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MeasureFieldDropTarget

tab.MeasureFieldDropTarget = function tab_MeasureFieldDropTarget(convertTarget) {
    tab.MeasureFieldDropTarget.initializeBase(this, [ convertTarget ]);
}
tab.MeasureFieldDropTarget.prototype = {
    
    canAccept: function tab_MeasureFieldDropTarget$canAccept(d) {
        var fieldConversion = tab.FeatureParamsLookup.getBool(tab.FeatureParam.fieldTypeConversion);
        if (ss.isValue(fieldConversion) && fieldConversion) {
            return this.isFieldDrop(d) && _.every((d).get_fields(), function(fieldModel) {
                return fieldModel.get_defaultRole() === 'dimension';
            });
        }
        return false;
    },
    
    acceptDrop: function tab_MeasureFieldDropTarget$acceptDrop(d) {
        var result = $.DeferredData();
        result.resolve(this.handleDrop(d, tab.SchemaClientCommands.convertToMeasure));
        return result;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ConvertUnnamedFieldsDropTarget

tab.ConvertUnnamedFieldsDropTarget = function tab_ConvertUnnamedFieldsDropTarget(doneCallback) {
    tab.ConvertUnnamedFieldsDropTarget.initializeBase(this);
    this._doneCallback$1 = doneCallback;
}
tab.ConvertUnnamedFieldsDropTarget.prototype = {
    _doneCallback$1: null,
    
    get_doneCallback: function tab_ConvertUnnamedFieldsDropTarget$get_doneCallback() {
        return this._doneCallback$1;
    },
    
    dragOver: function tab_ConvertUnnamedFieldsDropTarget$dragOver(d) {
        tab.Log.get(this).debug('Drag over');
        if (!this.canAccept(d)) {
            return null;
        }
        return this;
    },
    
    dragExit: function tab_ConvertUnnamedFieldsDropTarget$dragExit(d) {
        tab.Log.get(this).debug('Drag exit');
    },
    
    acceptDrop: function tab_ConvertUnnamedFieldsDropTarget$acceptDrop(d) {
        var result = $.DeferredData();
        var pdi = Type.safeCast(d, tab.PillDragInstance);
        if (ss.isNullOrUndefined(pdi) || !this.canAccept(pdi)) {
            result.reject(false);
            return result;
        }
        var fields = tab.SchemaClientCommands.convertUnnamedFields(_.map(pdi.get_pills(), function(pill) {
            return pill.get_field().get_globalName();
        }));
        fields.done(this._doneCallback$1);
        return fields.pipe(function(f) {
            return ss.isValue(f);
        });
    },
    
    getDropTarget: function tab_ConvertUnnamedFieldsDropTarget$getDropTarget(hit) {
        return this;
    },
    
    canAccept: function tab_ConvertUnnamedFieldsDropTarget$canAccept(d) {
        var pdi = Type.safeCast(d, tab.PillDragInstance);
        if (ss.isNullOrUndefined(pdi) || !tab.FeatureFlags.isEnabled('TypeInPills')) {
            return false;
        }
        return _.any(pdi.get_pills(), function(pill) {
            return pill.get_field().get_isUnnamedCalc();
        });
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FieldDragSource

tab.FieldDragSource = function tab_FieldDragSource(fieldAccesor, onStartDrag) {
    this._getSelectedFields = fieldAccesor;
    this._onStartDrag = onStartDrag;
}
tab.FieldDragSource.prototype = {
    _onStartDrag: null,
    _getSelectedFields: null,
    
    concreteFieldsToDragFrom: function tab_FieldDragSource$concreteFieldsToDragFrom(selectedFields) {
        var draggableFields = _.filter(selectedFields, function(model) {
            return model.get_isDraggable();
        });
        var draggedFields = _.map(draggableFields, function(model) {
            return model.get_childToSelect();
        });
        return _.filter(draggedFields, function(model) {
            return ss.isValue(model);
        });
    },
    
    startDrag: function tab_FieldDragSource$startDrag(e) {
        var draggedFields = this.concreteFieldsToDragFrom(this._getSelectedFields());
        if (!draggedFields.length) {
            return null;
        }
        var firstField = draggedFields[0];
        var ft = (firstField.get_isColumn()) ? firstField.asColumn().get_defaultFieldType() : 'unknown';
        var d = new tab.PillDragInstance(draggedFields, firstField.get_description(), ft);
        var deferredDrag = tab.ShelfClientCommands.startDrag(draggedFields, 'invalid-encoding', tab.ModelUtils.findActivePaneSpecId());
        deferredDrag.done(function(drag) {
            if (ss.isValue(drag.shelfDropModels)) {
                d.resolve(drag);
            }
        });
        if (ss.isValue(this._onStartDrag)) {
            this._onStartDrag();
        }
        return d;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SchemaNode

tab.SchemaNode = function tab_SchemaNode(model) {
    this.children = [];
    if (ss.isValue(model)) {
        this.canHaveChildren = model.get_canHaveChildren();
        if (ss.isValue(model.get_childToSelect())) {
            this.childToSelect = model.get_childToSelect().get_globalName();
        }
        this.displayName = model.get_displayName();
        this.fieldIconResource = model.get_fieldIconResource();
        this.fieldType = model.get_defaultFieldType();
        this.globalFieldName = model.get_globalName();
        this.instanceType = model.get_instanceType();
        this.isCalculated = model.get_isColumn() && model.asColumn().get_isCalculated();
        this.isCubeFolder = model.get_isCubeFolder();
        this.isDerived = model.get_isDerived();
        this.isDraggable = model.get_isDraggable();
        this.isFolder = model.get_isFolder();
        this.isGenerated = model.get_isGenerated();
        this.isGroup = model.get_isGroup();
        this.isHidden = model.get_isHidden();
        if (model.get_isCubeDimension()) {
            this.isHierarchyRoot = true;
        }
        this.isMeasureNamesOrValues = model.get_isMeasureNamesOrValues();
        this.isSelectable = model.get_isSelectable();
        this.hasContextMenu = model.get_isSelectable() && !model.get_isDrillPath();
        this.isUnsortedContainer = model.get_isUnsortedContainer();
        this.localName = model.get_localName();
        this.ordinal = model.get_ordinal();
        this.tooltip = model.get_tooltip();
    }
    else {
        this.isHidden = true;
    }
}
tab.SchemaNode.prototype = {
    canHaveChildren: false,
    childToSelect: null,
    fieldIconResource: null,
    fieldType: null,
    globalFieldName: null,
    instanceType: null,
    isCalculated: false,
    isCubeFolder: false,
    isDerived: false,
    isDraggable: false,
    isFolder: false,
    isGenerated: false,
    isGroup: false,
    isHidden: false,
    isHierarchyRoot: false,
    isMeasureNamesOrValues: false,
    isSelectable: false,
    hasContextMenu: false,
    isUnsortedContainer: false,
    localName: null,
    ordinal: 0,
    tooltip: null,
    displayName: null,
    section: null,
    
    get_comparisonKey: function tab_SchemaNode$get_comparisonKey() {
        return (this.globalFieldName || this.localName) + (this.section || '');
    },
    
    find: function tab_SchemaNode$find(fieldName) {
        var queue = [];
        queue.enqueue(this);
        while (queue.length > 0) {
            var n = queue.dequeue();
            if (n.globalFieldName === fieldName) {
                return n;
            }
            var $enum1 = ss.IEnumerator.getEnumerator(n.children);
            while ($enum1.moveNext()) {
                var child = $enum1.current;
                queue.enqueue(child);
            }
        }
        return null;
    },
    
    equals: function tab_SchemaNode$equals(other) {
        return this.globalFieldName === other.globalFieldName && this.localName === other.localName && this.section === other.section;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShapePickerViewModel

tab.ShapePickerViewModel = function tab_ShapePickerViewModel() {
    this._shapes$1 = [];
    this._selectedShape$1 = new tab.ShapeModel('filled', 'square');
    tab.ShapePickerViewModel.initializeBase(this);
    var addShapes = ss.Delegate.create(this, function(palette) {
        this._shapes$1.add(new tab.ShapeModel(palette, 'circle'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'square'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'plus'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'times'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'asterisk'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'diamond'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'triangle'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'down-triangle'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'left-triangle'));
        this._shapes$1.add(new tab.ShapeModel(palette, 'right-triangle'));
    });
    addShapes(null);
    addShapes('filled');
}
tab.ShapePickerViewModel.prototype = {
    
    get_shapesPerRow: function tab_ShapePickerViewModel$get_shapesPerRow() {
        return 5;
    },
    
    get_shapes: function tab_ShapePickerViewModel$get_shapes() {
        return this._shapes$1;
    },
    
    get_selectedShape: function tab_ShapePickerViewModel$get_selectedShape() {
        return this._selectedShape$1;
    },
    set_selectedShape: function tab_ShapePickerViewModel$set_selectedShape(value) {
        if (this._selectedShape$1 === value) {
            return;
        }
        this._selectedShape$1 = value;
        this.notifyPropertyChanged('selectedShape');
        return value;
    },
    
    get_viewType: function tab_ShapePickerViewModel$get_viewType() {
        return tab.ShapePickerView;
    },
    
    get_viewModel: function tab_ShapePickerViewModel$get_viewModel() {
        return this;
    },
    
    disposeViewModel: function tab_ShapePickerViewModel$disposeViewModel() {
        this.dispose();
    },
    
    updateUberPopupViewModel: function tab_ShapePickerViewModel$updateUberPopupViewModel(vm) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfViewModel

tab.ShelfViewModel = function tab_ShelfViewModel() {
    this._pills$1 = [];
    this._dropState$1 = 0;
    tab.ShelfViewModel.initializeBase(this);
    spiff.DragDropManager.add_dragStarted(ss.Delegate.create(this, this.dragStarted));
    spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this.dragEnded));
    if (tab.FeatureFlags.isEnabled('TypeInPills')) {
        this._typeInPillCalculation$1 = new tab.CalculationEditorViewModel(tab.ApplicationModel.get_instance().get_typeInPillCalculationModel(), null);
        this._typeInPillCalculation$1.add_calculationEdited(ss.Delegate.create(this, this._calcEdited$1));
        this._typeInPillCalculation$1.add_calculationCanceled(ss.Delegate.create(this, this._calcCanceled$1));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._typeInPillCalculation$1.remove_calculationEdited(ss.Delegate.create(this, this._calcEdited$1));
            this._typeInPillCalculation$1.remove_calculationCanceled(ss.Delegate.create(this, this._calcCanceled$1));
        })));
        this._updateTypeInPillIndex$1();
    }
}
tab.ShelfViewModel.prototype = {
    _shelf$1: null,
    _typeInPillCalculation$1: null,
    _typeInPillIndex$1: null,
    _pendingTypeInPillOpen$1: false,
    _animatePillOpen$1: false,
    _dragOverDropPosition$1: null,
    _visible$1: true,
    _dragOver$1: false,
    _lastDragOverIndex$1: null,
    
    add_shelfChanged: function tab_ShelfViewModel$add_shelfChanged(value) {
        this.__shelfChanged$1 = ss.Delegate.combine(this.__shelfChanged$1, value);
    },
    remove_shelfChanged: function tab_ShelfViewModel$remove_shelfChanged(value) {
        this.__shelfChanged$1 = ss.Delegate.remove(this.__shelfChanged$1, value);
    },
    
    __shelfChanged$1: null,
    
    add_visibleChanged: function tab_ShelfViewModel$add_visibleChanged(value) {
        this.__visibleChanged$1 = ss.Delegate.combine(this.__visibleChanged$1, value);
    },
    remove_visibleChanged: function tab_ShelfViewModel$remove_visibleChanged(value) {
        this.__visibleChanged$1 = ss.Delegate.remove(this.__visibleChanged$1, value);
    },
    
    __visibleChanged$1: null,
    
    add_dropStateChanged: function tab_ShelfViewModel$add_dropStateChanged(value) {
        this.__dropStateChanged$1 = ss.Delegate.combine(this.__dropStateChanged$1, value);
    },
    remove_dropStateChanged: function tab_ShelfViewModel$remove_dropStateChanged(value) {
        this.__dropStateChanged$1 = ss.Delegate.remove(this.__dropStateChanged$1, value);
    },
    
    __dropStateChanged$1: null,
    
    add_dragOverDropPositionChanged: function tab_ShelfViewModel$add_dragOverDropPositionChanged(value) {
        this.__dragOverDropPositionChanged$1 = ss.Delegate.combine(this.__dragOverDropPositionChanged$1, value);
    },
    remove_dragOverDropPositionChanged: function tab_ShelfViewModel$remove_dragOverDropPositionChanged(value) {
        this.__dragOverDropPositionChanged$1 = ss.Delegate.remove(this.__dragOverDropPositionChanged$1, value);
    },
    
    __dragOverDropPositionChanged$1: null,
    
    add_openTypeInPill: function tab_ShelfViewModel$add_openTypeInPill(value) {
        this.__openTypeInPill$1 = ss.Delegate.combine(this.__openTypeInPill$1, value);
    },
    remove_openTypeInPill: function tab_ShelfViewModel$remove_openTypeInPill(value) {
        this.__openTypeInPill$1 = ss.Delegate.remove(this.__openTypeInPill$1, value);
    },
    
    __openTypeInPill$1: null,
    
    get_isVisible: function tab_ShelfViewModel$get_isVisible() {
        return this._visible$1;
    },
    set_isVisible: function tab_ShelfViewModel$set_isVisible(value) {
        if (this._visible$1 === value) {
            return;
        }
        this._visible$1 = value;
        this.raiseActionEvent(this.__visibleChanged$1);
        return value;
    },
    
    get_dropTarget: function tab_ShelfViewModel$get_dropTarget() {
        return this;
    },
    
    get_supportsMultiplePills: function tab_ShelfViewModel$get_supportsMultiplePills() {
        switch (this.get_shelfType()) {
            case 'columns-shelf':
            case 'rows-shelf':
            case 'pages-shelf':
            case 'filter-shelf':
            case 'encoding-shelf':
            case 'measures-shelf':
                return true;
            default:
                return false;
        }
    },
    
    get_title: function tab_ShelfViewModel$get_title() {
        var shelfName = '';
        switch (this.get_shelfType()) {
            case 'columns-shelf':
                shelfName = tab.Strings.AuthCardTitleColumns;
                break;
            case 'rows-shelf':
                shelfName = tab.Strings.AuthCardTitleRows;
                break;
            case 'pages-shelf':
                shelfName = tab.Strings.AuthCardTitlePages;
                break;
            case 'filter-shelf':
                shelfName = tab.Strings.AuthCardTitleFilters;
                break;
            case 'measures-shelf':
                shelfName = tab.Strings.AuthCardTitleMeasureValues;
                break;
        }
        return shelfName;
    },
    
    get_name: function tab_ShelfViewModel$get_name() {
        var shelfType = this.get_shelfType();
        return shelfType.replaceAll('-shelf', '');
    },
    
    get_viewModel: function tab_ShelfViewModel$get_viewModel() {
        return this;
    },
    
    get_collapsedTitleDetail: function tab_ShelfViewModel$get_collapsedTitleDetail() {
        return (ss.isValue(this._pills$1)) ? this._pills$1.length.toString() : '';
    },
    
    get_viewType: function tab_ShelfViewModel$get_viewType() {
        return tab.ShelfView;
    },
    
    get_pills: function tab_ShelfViewModel$get_pills() {
        return this._pills$1;
    },
    
    get_shelfType: function tab_ShelfViewModel$get_shelfType() {
        if (ss.isNullOrUndefined(this._shelf$1)) {
            return 'none-shelf';
        }
        return this._shelf$1.get_shelfType();
    },
    
    get_orientation: function tab_ShelfViewModel$get_orientation() {
        switch (this.get_shelfType()) {
            case 'columns-shelf':
            case 'rows-shelf':
                return 1;
            default:
                return 0;
        }
    },
    
    get_shelf: function tab_ShelfViewModel$get_shelf() {
        return this._shelf$1;
    },
    set_shelf: function tab_ShelfViewModel$set_shelf(value) {
        if (ss.isValue(this._shelf$1)) {
            this._shelf$1.remove_shelfChanged(ss.Delegate.create(this, this._shelfOnShelfChanged$1));
        }
        this._shelf$1 = value;
        this._shelf$1.add_shelfChanged(ss.Delegate.create(this, this._shelfOnShelfChanged$1));
        this._updateTypeInPillIndex$1();
        this.updatePills();
        return value;
    },
    
    get_typeInPillCalculation: function tab_ShelfViewModel$get_typeInPillCalculation() {
        return (this.get_hasTypeInPill()) ? this._typeInPillCalculation$1 : null;
    },
    
    get_dropState: function tab_ShelfViewModel$get_dropState() {
        return this._dropState$1;
    },
    set_dropState: function tab_ShelfViewModel$set_dropState(value) {
        if (this._dropState$1 === value) {
            return;
        }
        this._dropState$1 = value;
        if (ss.isValue(this.__dropStateChanged$1)) {
            this.__dropStateChanged$1(this._dropState$1);
        }
        return value;
    },
    
    get_dragOverDropPosition: function tab_ShelfViewModel$get_dragOverDropPosition() {
        return this._dragOverDropPosition$1;
    },
    set_dragOverDropPosition: function tab_ShelfViewModel$set_dragOverDropPosition(value) {
        if (this._dragOverDropPosition$1 === value) {
            return;
        }
        tab.Log.get(this).debug('set_DragOverDropPosition: %d', value);
        this._dragOverDropPosition$1 = value;
        if (ss.isValue(this.__dragOverDropPositionChanged$1)) {
            this.__dragOverDropPositionChanged$1(value);
        }
        return value;
    },
    
    get_feedbackType: function tab_ShelfViewModel$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    get_hasTypeInPill: function tab_ShelfViewModel$get_hasTypeInPill() {
        return ss.isValue(this._typeInPillCalculation$1) && this._typeInPillCalculation$1.get_hasCalculation() && this._typeInPillCalculation$1.get_shelfType() === this.get_shelfType() && (this.get_shelfType() !== 'encoding-shelf' || this._shelf$1.get_paneId() === this._typeInPillCalculation$1.get_shelfPaneSpecId());
    },
    
    get_animateTypeInPillPending: function tab_ShelfViewModel$get_animateTypeInPillPending() {
        return this._animatePillOpen$1;
    },
    
    createPillDividerDropTarget: function tab_ShelfViewModel$createPillDividerDropTarget(index) {
        return new tab._pillDividerDropTarget(this, index);
    },
    
    matchingDropsFrom: function tab_ShelfViewModel$matchingDropsFrom(drag) {
        if (!drag.get_drop().isResolved()) {
        }
        return _.find(drag.get_dropPresModels(), ss.Delegate.create(this, function(pm) {
            return pm.shelfType === this.get_shelfType();
        }));
    },
    
    canAccept: function tab_ShelfViewModel$canAccept(d, index) {
        var drag = Type.safeCast(d, tab.BaseFieldDragInstance);
        if (!d.get_hasPayload() || ss.isNullOrUndefined(drag)) {
            return false;
        }
        if (!drag.get_drop().isResolved()) {
            this.set_dragOverDropPosition(null);
            if (Type.canCast(drag, tab.PillDragInstance)) {
                return ss.isValue(drag.get_fields());
            }
            else if (Type.canCast(drag, tab.CalcTextDragInstance)) {
                return true;
            }
            return false;
        }
        var shelfDrops = this.matchingDropsFrom(drag);
        if (ss.isNullOrUndefined(shelfDrops)) {
            this.set_dragOverDropPosition(null);
            return false;
        }
        var dropPosition = this._getDropPosition$1(shelfDrops, index);
        this.set_dragOverDropPosition(dropPosition);
        return ss.isValue(dropPosition);
    },
    
    dragOver: function tab_ShelfViewModel$dragOver(d, index) {
        tab.Log.get(this).debug('Drag over');
        this._dragOver$1 = true;
        this._lastDragOverIndex$1 = index;
        var accept = this.canAccept(d, index);
        if (!accept) {
            return null;
        }
        if (ss.isValue(this._dragOverDropPosition$1) && this._dragOverDropPosition$1.shelfDropAction === 'replace' && this._dragOverDropPosition$1.shelfPosIndex < this._pills$1.length) {
            return this._pills$1[this._dragOverDropPosition$1.shelfPosIndex];
        }
        return this;
    },
    
    dragExit: function tab_ShelfViewModel$dragExit(d) {
        tab.Log.get(this).debug('Drag exit');
        this._dragOver$1 = false;
        this._lastDragOverIndex$1 = null;
        this.set_dragOverDropPosition(null);
    },
    
    getDropTarget: function tab_ShelfViewModel$getDropTarget(hit) {
        return this;
    },
    
    acceptDrop: function tab_ShelfViewModel$acceptDrop(d, index) {
        var result = $.DeferredData();
        if (!(Type.canCast(d, tab.BaseFieldDragInstance))) {
            result.resolve(false);
            return result;
        }
        var handleDrop = ss.Delegate.create(this, function(drag) {
            var willAccept = this.canAccept(drag, index);
            var shelfDrops = this.matchingDropsFrom(drag);
            var dropPosition = this._getDropPosition$1(shelfDrops, index);
            var dropIndex = -1;
            if (ss.isValue(dropPosition)) {
                dropIndex = dropPosition.shelfPosIndex;
            }
            if (!willAccept) {
                tab.Log.get(this).debug('Rejecting drop: %o at: %s', drag, index);
            }
            else if (drag.hasOnlyPills()) {
                var p = drag.get_pill();
                if (p.get_shelf().get_shelfType() === this.get_shelfType()) {
                    var pillIndex = p.get_indexInShelf();
                    if (pillIndex >= 0 && (dropIndex === pillIndex || dropIndex === pillIndex + 1)) {
                        willAccept = false;
                    }
                }
                if (willAccept) {
                    tab.Log.get(this).debug('Accepting pill: %o, %n', p, dropIndex);
                    var dropPos = drag.dropPositionForShelf(this, dropIndex);
                    tab.ShelfClientCommands.moveShelfPill(p.get_shelf().get_shelf(), this.get_shelf(), p.get_pill(), dropPos, drag.isCopyDrag);
                }
            }
            else if (drag.hasOnlyFields()) {
                var c = drag.fieldsToDropOnShelf(this.get_shelfType());
                tab.Log.get(this).debug('Accepting field: %o, %n', c, dropIndex);
                var dropPos = drag.dropPositionForShelf(this, dropIndex);
                tab.ShelfClientCommands.addShelfField(this._shelf$1, c, 'invalid-encoding', dropPos);
            }
            result.resolve(willAccept);
        });
        if ((d).get_drop().isResolved()) {
            handleDrop(d);
        }
        else {
            (d).get_drop().done(handleDrop);
        }
        return result;
    },
    
    dispose: function tab_ShelfViewModel$dispose() {
        if (ss.isValue(this._typeInPillCalculation$1)) {
            this._typeInPillCalculation$1.dispose();
        }
        spiff.DragDropManager.remove_dragStarted(ss.Delegate.create(this, this.dragStarted));
        spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this.dragEnded));
        if (ss.isValue(this._shelf$1)) {
            this._shelf$1.remove_shelfChanged(ss.Delegate.create(this, this._shelfOnShelfChanged$1));
        }
        this._clearPills$1();
        tab.ShelfViewModel.callBaseMethod(this, 'dispose');
    },
    
    dragEnded: function tab_ShelfViewModel$dragEnded(d) {
        this._dragOver$1 = false;
        this._lastDragOverIndex$1 = null;
        this.set_dropState(0);
        if (!d.canceled && !d.isCopyDrop && ss.isNullOrUndefined(d.target) && Type.canCast(d.drag, tab.BaseFieldDragInstance) && (d.drag).hasOnlyPills()) {
            var p = (d.drag).get_pill();
            if (this.hasPill(p)) {
                this.removePill(p);
            }
        }
    },
    
    dragStarted: function tab_ShelfViewModel$dragStarted(d) {
        if (d.get_dragType() === 'dragdrop') {
            if (Type.canCast(d, tab.BaseFieldDragInstance)) {
                (d).get_drop().always(ss.Delegate.create(this, this._handleDragResolved$1));
            }
            this.set_dropState((this.canAccept(d, null)) ? 1 : 2);
        }
        else {
            this.set_dropState(0);
        }
    },
    
    insertAdHocCalc: function tab_ShelfViewModel$insertAdHocCalc() {
        if (this.get_hasTypeInPill()) {
            return;
        }
        tab.CalculationCommands.createAdHocCalculation(this._shelf$1.get_shelfType(), this._pills$1.length, this._shelf$1.get_paneId());
    },
    
    editPill: function tab_ShelfViewModel$editPill(fieldName, indexInShelf) {
        tab.CalculationCommands.editPill(fieldName, this.get_shelfType(), indexInShelf, this.get_shelf().get_paneId());
    },
    
    _isEmpty: function tab_ShelfViewModel$_isEmpty() {
        return !this._pills$1.length;
    },
    
    removePill: function tab_ShelfViewModel$removePill(p) {
        tab.Log.get(this).debug('Removing pill: %o', p);
        tab.ShelfClientCommands.removeShelfPill(this._shelf$1, p.get_pill());
        this._fireShelfChanged$1();
    },
    
    hasPill: function tab_ShelfViewModel$hasPill(p) {
        return this._pills$1.contains(p);
    },
    
    updatePills: function tab_ShelfViewModel$updatePills() {
        if (ss.isNullOrUndefined(this._shelf$1)) {
            return;
        }
        this._clearPills$1();
        if (ss.isValue(this._shelf$1.get_pills())) {
            var $enum1 = ss.IEnumerator.getEnumerator(this._shelf$1.get_pills());
            while ($enum1.moveNext()) {
                var pill = $enum1.current;
                var pvm = new tab.PillViewModel();
                pvm.set_pill(pill);
                pvm.set_shelf(this);
                pvm.add_disposed(ss.Delegate.create(this, this._pillDisposed$1));
                this._pills$1.add(pvm);
            }
        }
        this.set_isVisible(this._shelf$1.get_shelfType() !== 'measures-shelf' || !this._isEmpty());
        this._fireShelfChanged$1();
    },
    
    _getDropPosition$1: function tab_ShelfViewModel$_getDropPosition$1(shelfDrops, index) {
        if (ss.isNullOrUndefined(shelfDrops)) {
            return null;
        }
        var dropIndex = ss.Delegate.create(this, function(model) {
            return Math.abs(model.shelfPosIndex - ((ss.isValue(index)) ? index : this._pills$1.length));
        });
        var dropIndexEquals = function(model) {
            return model.shelfPosIndex === index;
        };
        var found = null;
        if (ss.isValue(index)) {
            found = _.find(shelfDrops.shelfDropPositions, dropIndexEquals);
        }
        if (ss.isNullOrUndefined(found)) {
            found = _.min(shelfDrops.shelfDropPositions, dropIndex);
        }
        return found;
    },
    
    _updateTypeInPillIndex$1: function tab_ShelfViewModel$_updateTypeInPillIndex$1() {
        this._typeInPillIndex$1 = null;
        if (this.get_hasTypeInPill()) {
            this._typeInPillIndex$1 = this._typeInPillCalculation$1.get_shelfPosition();
        }
    },
    
    _openTypeInPillIfPending$1: function tab_ShelfViewModel$_openTypeInPillIfPending$1() {
        if (this._pendingTypeInPillOpen$1) {
            this._pendingTypeInPillOpen$1 = false;
            tab.CommandController.get().remove_postBootstrap(ss.Delegate.create(this, this._openTypeInPillIfPending$1));
            tab.CommandController.get().remove_postRemoteCommand(ss.Delegate.create(this, this._openTypeInPillIfPending$1));
            if (ss.isValue(this.__openTypeInPill$1)) {
                this.__openTypeInPill$1(this._animatePillOpen$1);
                this._animatePillOpen$1 = false;
            }
        }
    },
    
    _updateTypeInPill$1: function tab_ShelfViewModel$_updateTypeInPill$1() {
        if (this.get_hasTypeInPill() && ss.isValue(this._typeInPillCalculation$1.get_shelfPosition())) {
            if (!ss.isValue(this._typeInPillIndex$1) || (this._typeInPillIndex$1 !== this._typeInPillCalculation$1.get_shelfPosition())) {
                this._animatePillOpen$1 = true;
            }
            if (!this._pendingTypeInPillOpen$1) {
                this._pendingTypeInPillOpen$1 = true;
                tab.CommandController.get().add_postRemoteCommand(ss.Delegate.create(this, this._openTypeInPillIfPending$1));
                tab.CommandController.get().add_postBootstrap(ss.Delegate.create(this, this._openTypeInPillIfPending$1));
            }
        }
        this._updateTypeInPillIndex$1();
    },
    
    _shelfOnShelfChanged$1: function tab_ShelfViewModel$_shelfOnShelfChanged$1(arg) {
        this._updateTypeInPill$1();
        this.updatePills();
    },
    
    _clearPills$1: function tab_ShelfViewModel$_clearPills$1() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._pills$1);
        while ($enum1.moveNext()) {
            var pillViewModel = $enum1.current;
            pillViewModel.remove_disposed(ss.Delegate.create(this, this._pillDisposed$1));
            pillViewModel.dispose();
        }
        this._pills$1.clear();
    },
    
    _handleDragResolved$1: function tab_ShelfViewModel$_handleDragResolved$1(drag) {
        var drop = this.matchingDropsFrom(drag);
        this.set_dropState((ss.isValue(drop)) ? 1 : 2);
        if (!this._dragOver$1) {
            return;
        }
        this.canAccept(drag, this._lastDragOverIndex$1);
    },
    
    _pillDisposed$1: function tab_ShelfViewModel$_pillDisposed$1(p) {
        this._pills$1.remove(p);
        this._fireShelfChanged$1();
    },
    
    _calcEdited$1: function tab_ShelfViewModel$_calcEdited$1() {
        if (!this.get_hasTypeInPill()) {
            return;
        }
        tab.Log.get(this).debug('CalcEdited: %s', this.get_shelfType());
        this._updateTypeInPill$1();
        this._fireShelfChanged$1();
    },
    
    _calcCanceled$1: function tab_ShelfViewModel$_calcCanceled$1() {
        if (this._typeInPillIndex$1 == null) {
            return;
        }
        this._updateTypeInPillIndex$1();
        this._fireShelfChanged$1();
    },
    
    _fireShelfChanged$1: function tab_ShelfViewModel$_fireShelfChanged$1() {
        if (ss.isValue(this.__shelfChanged$1)) {
            this.__shelfChanged$1(this);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._pillDividerDropTarget

tab._pillDividerDropTarget = function tab__pillDividerDropTarget(vm, index) {
    this._vm = vm;
    this._index = index;
}
tab._pillDividerDropTarget.prototype = {
    _vm: null,
    _index: 0,
    
    get_feedbackType: function tab__pillDividerDropTarget$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    dragOver: function tab__pillDividerDropTarget$dragOver(d) {
        var target = this._vm.dragOver(d, this._index);
        if (ss.isValue(target)) {
            return this;
        }
        return null;
    },
    
    dragExit: function tab__pillDividerDropTarget$dragExit(d) {
        this._vm.dragExit(d);
    },
    
    acceptDrop: function tab__pillDividerDropTarget$acceptDrop(d) {
        return this._vm.acceptDrop(d, this._index);
    },
    
    getDropTarget: function tab__pillDividerDropTarget$getDropTarget(hit) {
        return this;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationDependencyViewModel

tab.CalculationDependencyViewModel = function tab_CalculationDependencyViewModel(dependencies, maxWidth) {
    tab.CalculationDependencyViewModel.initializeBase(this);
    this._dependencies$1 = dependencies;
    this._maxWidth$1 = maxWidth;
}
tab.CalculationDependencyViewModel.prototype = {
    _dependencies$1: null,
    _maxWidth$1: 0,
    
    get_viewType: function tab_CalculationDependencyViewModel$get_viewType() {
        return tab.CalculationDependencyView;
    },
    
    get_viewModel: function tab_CalculationDependencyViewModel$get_viewModel() {
        return this;
    },
    
    get_dependencies: function tab_CalculationDependencyViewModel$get_dependencies() {
        return this._dependencies$1;
    },
    
    get_maxWidth: function tab_CalculationDependencyViewModel$get_maxWidth() {
        return this._maxWidth$1;
    },
    
    disposeViewModel: function tab_CalculationDependencyViewModel$disposeViewModel() {
        this.dispose();
    },
    
    updateUberPopupViewModel: function tab_CalculationDependencyViewModel$updateUberPopupViewModel(vm) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShowMeViewModel

tab.ShowMeViewModel = function tab_ShowMeViewModel() {
    tab.ShowMeViewModel.initializeBase(this);
}
tab.ShowMeViewModel.prototype = {
    _showMeCommands$1: null,
    _uberPopupViewModel$1: null,
    
    get_viewType: function tab_ShowMeViewModel$get_viewType() {
        return tab.ShowMeView;
    },
    
    get_viewModel: function tab_ShowMeViewModel$get_viewModel() {
        return this;
    },
    
    get_showMeCommands: function tab_ShowMeViewModel$get_showMeCommands() {
        return this._showMeCommands$1.get_commands();
    },
    
    get_closeOnInteraction: function tab_ShowMeViewModel$get_closeOnInteraction() {
        return ss.isValue(this._uberPopupViewModel$1) && this._uberPopupViewModel$1.get_mode() === spiff.UberPopupMode.closeOnExternalInteraction;
    },
    set_closeOnInteraction: function tab_ShowMeViewModel$set_closeOnInteraction(value) {
        if (ss.isNullOrUndefined(this._uberPopupViewModel$1)) {
            return;
        }
        this._uberPopupViewModel$1.set_mode((value) ? spiff.UberPopupMode.closeOnExternalInteraction : spiff.UberPopupMode.ignoreExternalInteraction);
        return value;
    },
    
    dispose: function tab_ShowMeViewModel$dispose() {
        tab.ShowMeViewModel.callBaseMethod(this, 'dispose');
        this._showMeCommands$1.remove_commandsChanged(ss.Delegate.create(this, this._commandsChanged$1));
        tab.ApplicationModel.get_instance().get_workbook().removeDashboardHandler(ss.Delegate.create(this, this._updateDashboard$1));
    },
    
    disposeViewModel: function tab_ShowMeViewModel$disposeViewModel() {
        this.dispose();
    },
    
    updateUberPopupViewModel: function tab_ShowMeViewModel$updateUberPopupViewModel(vm) {
        this._uberPopupViewModel$1 = vm;
    },
    
    isCommandEnabled: function tab_ShowMeViewModel$isCommandEnabled(c) {
        var wrapper = tab.CommandItemWrapper.create(c);
        return wrapper.get_enabled() || ss.isNullOrUndefined(wrapper.get_enabled());
    },
    
    applyShowMeCommand: function tab_ShowMeViewModel$applyShowMeCommand(c) {
        if (ss.isValue(c) && this.isCommandEnabled(c)) {
            tab.ServerCommands.executeServerCommand(tab.CommandSerializer.deserialize(tab.CommandItemWrapper.create(c).get_command()), 'immediately');
        }
    },
    
    close: function tab_ShowMeViewModel$close() {
        if (ss.isNullOrUndefined(this._uberPopupViewModel$1)) {
            return;
        }
        this._uberPopupViewModel$1.hide();
    },
    
    initialize: function tab_ShowMeViewModel$initialize() {
        tab.ApplicationModel.get_instance().get_workbook().addNewDashboardHandler(ss.Delegate.create(this, this._updateDashboard$1));
    },
    
    _updateDashboard$1: function tab_ShowMeViewModel$_updateDashboard$1(dm) {
        if (ss.isValue(this._showMeCommands$1)) {
            this._showMeCommands$1.remove_commandsChanged(ss.Delegate.create(this, this._commandsChanged$1));
            this._showMeCommands$1 = null;
        }
        this._showMeCommands$1 = tab.ModelUtils.findActiveOrDefaultVisual().get_showMeModel();
        this._showMeCommands$1.add_commandsChanged(ss.Delegate.create(this, this._commandsChanged$1));
        this._commandsChanged$1(null);
    },
    
    _commandsChanged$1: function tab_ShowMeViewModel$_commandsChanged$1(cm) {
        this.notifyPropertyChanged('ShowMeCommands');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalcTextDragInstance

tab.CalcTextDragInstance = function tab_CalcTextDragInstance(text) {
    tab.CalcTextDragInstance.initializeBase(this, [ text, new tab.CalcTextDragAvatar(text) ]);
    this._avatar$2 = this.get_dragAvatar();
    this._text$2 = text;
}
tab.CalcTextDragInstance.prototype = {
    _avatar$2: null,
    _text$2: null,
    
    get_fields: function tab_CalcTextDragInstance$get_fields() {
        if (this.get_drop().isResolved()) {
            return this.draggedObject;
        }
        return null;
    },
    
    get_pills: function tab_CalcTextDragInstance$get_pills() {
        return null;
    },
    
    get_pill: function tab_CalcTextDragInstance$get_pill() {
        return null;
    },
    
    get_text: function tab_CalcTextDragInstance$get_text() {
        return this._text$2;
    },
    
    hasOnlyFields: function tab_CalcTextDragInstance$hasOnlyFields() {
        return true;
    },
    
    hasOnlyPills: function tab_CalcTextDragInstance$hasOnlyPills() {
        return false;
    },
    
    resolve: function tab_CalcTextDragInstance$resolve(dragResponse) {
        if (this.finalDrop.isResolved() || ss.isNullOrUndefined(dragResponse)) {
            return;
        }
        tab.Log.get(this).debug('Drag resolved');
        this.drag = (dragResponse).drag;
        var fn = (dragResponse).fn;
        var ds = tab.ApplicationModel.get_instance().get_workbook().get_dataSchema();
        var matchingCol = ds.findField(fn);
        if (ss.isValue(matchingCol)) {
            this.draggedObject = [matchingCol];
            this._avatar$2.set_label(matchingCol.get_description());
        }
        this.finalDrop.resolve(this);
    },
    
    reject: function tab_CalcTextDragInstance$reject(dragResponse) {
        if (this.finalDrop.isResolved() || !ss.isNullOrUndefined(dragResponse)) {
            return;
        }
        tab.Log.get(this).debug('Drag rejected');
        if (ss.isNullOrUndefined(this.drag)) {
            this.drag = (dragResponse).drag;
        }
        this.finalDrop.reject(this);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TooltipContentViewModel

tab.TooltipContentViewModel = function tab_TooltipContentViewModel(layerEncondingModel) {
    tab.TooltipContentViewModel.initializeBase(this);
    this._layerEncondingModel$1 = layerEncondingModel;
    this.add_resetClicked(ss.Delegate.create(this, this._resetTooltipCommand$1));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.remove_resetClicked(ss.Delegate.create(this, this._resetTooltipCommand$1));
    })));
}
tab.TooltipContentViewModel.prototype = {
    _layerEncondingModel$1: null,
    _popup$1: null,
    
    add_resetClicked: function tab_TooltipContentViewModel$add_resetClicked(value) {
        this.__resetClicked$1 = ss.Delegate.combine(this.__resetClicked$1, value);
    },
    remove_resetClicked: function tab_TooltipContentViewModel$remove_resetClicked(value) {
        this.__resetClicked$1 = ss.Delegate.remove(this.__resetClicked$1, value);
    },
    
    __resetClicked$1: null,
    
    get_viewType: function tab_TooltipContentViewModel$get_viewType() {
        return tab.TooltipContentView;
    },
    
    get_viewModel: function tab_TooltipContentViewModel$get_viewModel() {
        return this;
    },
    
    disposePopupViewModel: function tab_TooltipContentViewModel$disposePopupViewModel() {
        if (ss.isValue(this._popup$1)) {
            this._popup$1.dispose();
            this._popup$1 = null;
        }
    },
    
    disposeViewModel: function tab_TooltipContentViewModel$disposeViewModel() {
        this.dispose();
    },
    
    updateUberPopupViewModel: function tab_TooltipContentViewModel$updateUberPopupViewModel(vm) {
        this._popup$1 = vm;
    },
    
    resetTooltip: function tab_TooltipContentViewModel$resetTooltip() {
        this.__resetClicked$1();
        this.disposePopupViewModel();
    },
    
    _resetTooltipCommand$1: function tab_TooltipContentViewModel$_resetTooltipCommand$1() {
        tab.PaneClientCommands.resetTooltip(this._layerEncondingModel$1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizSummaryViewModel

tab.VizSummaryViewModel = function tab_VizSummaryViewModel() {
    tab.VizSummaryViewModel.initializeBase(this);
}
tab.VizSummaryViewModel.prototype = {
    _dataSchemaViewModel$1: null,
    _shelvesModel$1: null,
    _marksCardModel$1: null,
    _showLayers$1: false,
    _showShelves$1: false,
    
    add_summaryChanged: function tab_VizSummaryViewModel$add_summaryChanged(value) {
        this.__summaryChanged$1 = ss.Delegate.combine(this.__summaryChanged$1, value);
    },
    remove_summaryChanged: function tab_VizSummaryViewModel$remove_summaryChanged(value) {
        this.__summaryChanged$1 = ss.Delegate.remove(this.__summaryChanged$1, value);
    },
    
    __summaryChanged$1: null,
    
    get_showShelves: function tab_VizSummaryViewModel$get_showShelves() {
        return this._showShelves$1;
    },
    set_showShelves: function tab_VizSummaryViewModel$set_showShelves(value) {
        this._showShelves$1 = value;
        this._handleSummaryChanged$1();
        return value;
    },
    
    get_showLayers: function tab_VizSummaryViewModel$get_showLayers() {
        return this._showLayers$1;
    },
    set_showLayers: function tab_VizSummaryViewModel$set_showLayers(value) {
        this._showLayers$1 = value;
        this._handleSummaryChanged$1();
        return value;
    },
    
    get_numDimensions: function tab_VizSummaryViewModel$get_numDimensions() {
        if (ss.isNullOrUndefined(this._dataSchemaViewModel$1)) {
            return 0;
        }
        return this._dataSchemaViewModel$1.nodeTreeForSection('dimensions').length;
    },
    
    get_numMeasures: function tab_VizSummaryViewModel$get_numMeasures() {
        if (ss.isNullOrUndefined(this._dataSchemaViewModel$1)) {
            return 0;
        }
        return this._dataSchemaViewModel$1.nodeTreeForSection('measure').length;
    },
    
    get_numSets: function tab_VizSummaryViewModel$get_numSets() {
        if (ss.isNullOrUndefined(this._dataSchemaViewModel$1)) {
            return 0;
        }
        return this._dataSchemaViewModel$1.nodeTreeForSection('groups').length;
    },
    
    get_numParameters: function tab_VizSummaryViewModel$get_numParameters() {
        if (ss.isNullOrUndefined(this._dataSchemaViewModel$1)) {
            return 0;
        }
        return this._dataSchemaViewModel$1.nodeTreeForSection('parameters').length;
    },
    
    get_numColumnShelfItems: function tab_VizSummaryViewModel$get_numColumnShelfItems() {
        return this._countShelfItems$1('columns-shelf');
    },
    
    get_numRowShelfItems: function tab_VizSummaryViewModel$get_numRowShelfItems() {
        return this._countShelfItems$1('rows-shelf');
    },
    
    get_numFilterShelfItems: function tab_VizSummaryViewModel$get_numFilterShelfItems() {
        return this._countShelfItems$1('filter-shelf');
    },
    
    get_numPageShelfItems: function tab_VizSummaryViewModel$get_numPageShelfItems() {
        return this._countShelfItems$1('pages-shelf');
    },
    
    get_layers: function tab_VizSummaryViewModel$get_layers() {
        return [];
    },
    
    get_layerMarkTypes: function tab_VizSummaryViewModel$get_layerMarkTypes() {
        if (ss.isNullOrUndefined(this._marksCardModel$1)) {
            return [];
        }
        return _.map(this._marksCardModel$1.get_layers(), function(model) {
            return model.get_currentPrimitiveType().primitiveType;
        });
    },
    
    dispose: function tab_VizSummaryViewModel$dispose() {
        if (ss.isValue(this._dataSchemaViewModel$1)) {
            this._dataSchemaViewModel$1.remove_dataSchemaModified(ss.Delegate.create(this, this._handleSummaryChanged$1));
        }
        if (ss.isValue(this._shelvesModel$1)) {
            this._shelvesModel$1.remove_newShelves(ss.Delegate.create(this, this._handleSummaryChanged$1));
        }
        tab.VizSummaryViewModel.callBaseMethod(this, 'dispose');
    },
    
    update: function tab_VizSummaryViewModel$update(newDataSchema, newShelves, newMarks) {
        if (ss.isValue(this._dataSchemaViewModel$1)) {
            this._dataSchemaViewModel$1.remove_dataSchemaModified(ss.Delegate.create(this, this._handleSummaryChanged$1));
        }
        if (ss.isValue(this._shelvesModel$1)) {
            this._shelvesModel$1.remove_newShelves(ss.Delegate.create(this, this._handleSummaryChanged$1));
        }
        this._dataSchemaViewModel$1 = newDataSchema;
        this._shelvesModel$1 = newShelves;
        this._marksCardModel$1 = newMarks;
        if (ss.isValue(this._dataSchemaViewModel$1)) {
            this._dataSchemaViewModel$1.add_dataSchemaModified(ss.Delegate.create(this, this._handleSummaryChanged$1));
        }
        if (ss.isValue(this._shelvesModel$1)) {
            this._shelvesModel$1.add_newShelves(ss.Delegate.create(this, this._handleSummaryChanged$1));
        }
        this._handleSummaryChanged$1();
    },
    
    _countShelfItems$1: function tab_VizSummaryViewModel$_countShelfItems$1(type) {
        if (ss.isNullOrUndefined(this._shelvesModel$1)) {
            return 0;
        }
        var shelf = this._shelvesModel$1.findShelf(type);
        if (ss.isNullOrUndefined(shelf)) {
            return 0;
        }
        return shelf.get_pills().length;
    },
    
    _handleSummaryChanged$1: function tab_VizSummaryViewModel$_handleSummaryChanged$1() {
        if (ss.isNullOrUndefined(this.__summaryChanged$1)) {
            return;
        }
        this.__summaryChanged$1();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsDropTargetView

tab.AnalyticsDropTargetView = function tab_AnalyticsDropTargetView(viewModel, glassParent) {
    this._dropTargets$2 = [];
    tab.AnalyticsDropTargetView.initializeBase(this, [ viewModel, new tab.AnalyticsDropTargetTemplate() ]);
    spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this._dismiss$2));
    this._glassDropTarget$2 = new tab.GlassDropTarget(glassParent);
    this._glassDropTarget$2.set_opaque(true);
    this._glassDropTarget$2.show();
    this._buildDropTarget$2(glassParent);
    if (tab.FeatureFlags.isEnabled('AnalyticsObjectsDefaultDrop') && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.analyticsObjectsDragToViz)) {
        this._glassDropTarget$2.set_opaque(false);
        spiff.DragDropManager.attachDropTarget(this._glassDropTarget$2.get_element(), this._glassDropTarget$2);
    }
}
tab.AnalyticsDropTargetView.prototype = {
    _glassDropTarget$2: null,
    
    get__dropTargetTemplate$2: function tab_AnalyticsDropTargetView$get__dropTargetTemplate$2() {
        return this.get_template();
    },
    
    get__dropTargetViewModel$2: function tab_AnalyticsDropTargetView$get__dropTargetViewModel$2() {
        return this.get_viewModel();
    },
    
    onAddedToDom: function tab_AnalyticsDropTargetView$onAddedToDom() {
        tab.AnalyticsDropTargetView.callBaseMethod(this, 'onAddedToDom');
        this._alignAxisCells$2();
        this._alignAxisDropSpots$2();
        this._showHideScrollAxes$2(null);
        this.get_element().css('visibility', 'visible');
    },
    
    _alignAxisCells$2: function tab_AnalyticsDropTargetView$_alignAxisCells$2() {
        var maxWidth = this.get_element().find('.tabAdDropTitle').width();
        var axisNameCells = this.get_element().find('.tabAdAxisName');
        for (var i = 0, len = axisNameCells.length; i < len; i++) {
            if (axisNameCells.eq(i).width() !== maxWidth) {
                axisNameCells.eq(i).width(maxWidth);
            }
        }
    },
    
    _alignAxisDropSpots$2: function tab_AnalyticsDropTargetView$_alignAxisDropSpots$2() {
        var axisCellRows = this.get_element().find('.tabAdAxisRow');
        if (!axisCellRows.length) {
            return;
        }
        var dropCells = this.get_element().find('.tabAdDropCell');
        for (var column = 0; column < dropCells.length; column++) {
            var colWidth = dropCells.eq(column).width();
            var curColumnAxisDropSpots = axisCellRows.find('.tabAdAxisDropSpotHolder:eq(' + column + ')');
            if (curColumnAxisDropSpots.width() !== colWidth) {
                curColumnAxisDropSpots.width(colWidth);
            }
        }
    },
    
    dispose: function tab_AnalyticsDropTargetView$dispose() {
        spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this._dismiss$2));
        this._glassDropTarget$2.dispose();
        tab.AnalyticsDropTargetView.callBaseMethod(this, 'dispose');
    },
    
    onViewModelPropertyChanged: function tab_AnalyticsDropTargetView$onViewModelPropertyChanged(sender, e) {
        tab.AnalyticsDropTargetView.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
        this._updateTargetHighlights$2();
    },
    
    _updateTargetHighlights$2: function tab_AnalyticsDropTargetView$_updateTargetHighlights$2() {
        var hoveredTarget = this.get__dropTargetViewModel$2().get_hoverTarget();
        var $enum1 = ss.IEnumerator.getEnumerator(this._dropTargets$2);
        while ($enum1.moveNext()) {
            var dropTarget = $enum1.current;
            dropTarget.first.toggleClass('tabDirectHover', dropTarget.second.directMatch(hoveredTarget));
            dropTarget.first.toggleClass('tabIndirectHover', dropTarget.second.indirectMatch(hoveredTarget));
        }
    },
    
    _buildDropTarget$2: function tab_AnalyticsDropTargetView$_buildDropTarget$2(parentElement) {
        this._dropTargets$2.clear();
        this.get__dropTargetTemplate$2().setDropLabel(this.get__dropTargetViewModel$2().get_dropLabel());
        var numLinesPerDescription = 1;
        var $enum1 = ss.IEnumerator.getEnumerator(this.get__dropTargetViewModel$2().get_dropZoneItems());
        while ($enum1.moveNext()) {
            var dropZonePM = $enum1.current;
            numLinesPerDescription = Math.max(numLinesPerDescription, dropZonePM.label.toString().split('\n').length);
        }
        var $enum2 = ss.IEnumerator.getEnumerator(this.get__dropTargetViewModel$2().get_dropZoneItems());
        while ($enum2.moveNext()) {
            var dropZoneItem = $enum2.current;
            var header = this.get__dropTargetTemplate$2().addDropColumnHeader(dropZoneItem.label, numLinesPerDescription, tab.AnalyticsPaneView.getClassNameForIcon(dropZoneItem.imageRes, 'tabAuthAnalyticsPaneDrop'));
            if (dropZoneItem.isEnabled) {
                var dropSpotData = new tab.AnalyticsDropSpot(dropZoneItem, null, dropZoneItem.requiresFieldList);
                this._dropTargets$2.add(new ss.Tuple(header, dropSpotData));
            }
            else {
                header.addClass('tabAdDropDisabled');
            }
            header.get(0).id = tab.DomUtil.makeHtmlSafeId('tabAoDropTarget-' + dropZoneItem.label);
        }
        if (this.get__dropTargetViewModel$2().get_showDropMeasures()) {
            var axisNames = this.get__dropTargetViewModel$2().get_dropMeasureNamePairs();
            var $enum3 = ss.IEnumerator.getEnumerator(axisNames);
            while ($enum3.moveNext()) {
                var axisNamePair = $enum3.current;
                var rowTemplate = new tab.AnalyticsDropTargetAxisRowTemplate();
                var axisDisplayName = axisNamePair.fieldCaption;
                rowTemplate.setAxisName(axisDisplayName);
                var dropSpotData = new tab.AnalyticsDropSpot(null, axisNamePair, false);
                this._dropTargets$2.add(new ss.Tuple(rowTemplate.axisHeader, dropSpotData));
                var $enum4 = ss.IEnumerator.getEnumerator(this.get__dropTargetViewModel$2().get_dropZoneItems());
                while ($enum4.moveNext()) {
                    var dropZoneItem = $enum4.current;
                    var cell = rowTemplate._createCell();
                    if (dropZoneItem.isEnabled && (tab.MiscUtil.isNullOrEmpty(dropZoneItem.fieldVector) || !dropZoneItem.fieldVector.contains(axisNamePair.fn))) {
                        dropSpotData = new tab.AnalyticsDropSpot(dropZoneItem, axisNamePair, dropZoneItem.requiresFieldList);
                        this._dropTargets$2.add(new ss.Tuple(cell, dropSpotData));
                    }
                    else {
                        cell.css('visibility', 'hidden');
                    }
                    cell.get(0).id = tab.DomUtil.makeHtmlSafeId('tabAoDropTarget-' + axisDisplayName + dropZoneItem.label);
                }
                this.get__dropTargetTemplate$2().axisList.append(rowTemplate.get_domRoot());
            }
            var maxHeight = $(parentElement).height() - 90;
            this.get__dropTargetTemplate$2().axisListScroller.css('max-height', maxHeight + 'px');
            var scrollUpSpot = new tab.AnalyticsScrollSpot(-1, this.get__dropTargetTemplate$2().axisListScroller);
            var scrollDownSpot = new tab.AnalyticsScrollSpot(1, this.get__dropTargetTemplate$2().axisListScroller);
            spiff.DragDropManager.attachDropTarget(this.get__dropTargetTemplate$2().axisScrollTopSpot, scrollUpSpot);
            spiff.DragDropManager.attachDropTarget(this.get__dropTargetTemplate$2().axisScrollBottomSpot, scrollDownSpot);
            (this.get__dropTargetTemplate$2().axisListScroller).on('scroll', ss.Delegate.create(this, this._showHideScrollAxes$2));
        }
        else {
            this.get__dropTargetTemplate$2().horizontalDivider.hide();
        }
        var $enum5 = ss.IEnumerator.getEnumerator(this._dropTargets$2);
        while ($enum5.moveNext()) {
            var dropTarget = $enum5.current;
            spiff.DragDropManager.attachDropTarget(dropTarget.first, dropTarget.second);
        }
    },
    
    _showHideScrollAxes$2: function tab_AnalyticsDropTargetView$_showHideScrollAxes$2(evt) {
        var axisListScroller = this.get__dropTargetTemplate$2().axisListScroller;
        if (!axisListScroller.scrollTop()) {
            this.get__dropTargetTemplate$2().axisScrollTopSpot.hide();
        }
        else {
            this.get__dropTargetTemplate$2().axisScrollTopSpot.show();
        }
        var contentsHeight = this.get__dropTargetTemplate$2().axisList.height();
        if (!contentsHeight || axisListScroller.scrollTop() + parseInt(axisListScroller.css('max-height')) >= contentsHeight) {
            this.get__dropTargetTemplate$2().axisScrollBottomSpot.hide();
        }
        else {
            this.get__dropTargetTemplate$2().axisScrollBottomSpot.show();
        }
    },
    
    _dismiss$2: function tab_AnalyticsDropTargetView$_dismiss$2(arg) {
        this.dispose();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.GlassDropTarget

tab.GlassDropTarget = function tab_GlassDropTarget(glassParent) {
    tab.GlassDropTarget.initializeBase(this, [ glassParent ]);
}
tab.GlassDropTarget.prototype = {
    
    get_feedbackType: function tab_GlassDropTarget$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    dragOver: function tab_GlassDropTarget$dragOver(d) {
        return this;
    },
    
    dragExit: function tab_GlassDropTarget$dragExit(d) {
    },
    
    acceptDrop: function tab_GlassDropTarget$acceptDrop(d) {
        var vm = Type.safeCast(d.get_payload(), tab.AnalyticsDropTargetViewModel);
        var result = $.DeferredData();
        var shouldAcceptDrop = ss.isValue(vm);
        result.resolve(shouldAcceptDrop);
        if (shouldAcceptDrop) {
            vm.executeDefaultAddCommand();
        }
        return result;
    },
    
    getDropTarget: function tab_GlassDropTarget$getDropTarget(hit) {
        return this;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsDropSpot

tab.AnalyticsDropSpot = function tab_AnalyticsDropSpot(dzi, axisPair, commandUsesFieldList) {
    this._dropZoneItem = dzi;
    this._axisNamePair = axisPair;
    this._commandUsesFieldList = commandUsesFieldList;
}
tab.AnalyticsDropSpot.prototype = {
    _dropZoneItem: null,
    _axisNamePair: null,
    _commandUsesFieldList: false,
    
    get_excludedFields: function tab_AnalyticsDropSpot$get_excludedFields() {
        return this._dropZoneItem.fieldVector;
    },
    
    get_command: function tab_AnalyticsDropSpot$get_command() {
        return (ss.isValue(this._dropZoneItem)) ? this._dropZoneItem.simpleCommandModel : null;
    },
    
    get_axis: function tab_AnalyticsDropSpot$get_axis() {
        return this._axisNamePair;
    },
    
    get_commandUsesFields: function tab_AnalyticsDropSpot$get_commandUsesFields() {
        return this._commandUsesFieldList;
    },
    
    get_feedbackType: function tab_AnalyticsDropSpot$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    directMatch: function tab_AnalyticsDropSpot$directMatch(hoveredTarget) {
        return ss.isValue(hoveredTarget) && this.get_command() === hoveredTarget.get_command() && (this._axisNamePair === hoveredTarget._axisNamePair || ss.isNullOrUndefined(hoveredTarget._axisNamePair));
    },
    
    indirectMatch: function tab_AnalyticsDropSpot$indirectMatch(hoveredTarget) {
        return ss.isValue(hoveredTarget) && (this.get_command() === hoveredTarget.get_command() || ss.isNullOrUndefined(this.get_command()) || ss.isNullOrUndefined(hoveredTarget.get_command())) && (this.get_command() === hoveredTarget.get_command() || this._axisNamePair === hoveredTarget._axisNamePair || ss.isNullOrUndefined(this._axisNamePair) || ss.isNullOrUndefined(hoveredTarget._axisNamePair));
    },
    
    dragOver: function tab_AnalyticsDropSpot$dragOver(d) {
        var vm = Type.safeCast(d.get_payload(), tab.AnalyticsDropTargetViewModel);
        if (ss.isValue(vm)) {
            vm.setHoveredTarget(this);
        }
        return this;
    },
    
    dragExit: function tab_AnalyticsDropSpot$dragExit(d) {
        var vm = Type.safeCast(d.get_payload(), tab.AnalyticsDropTargetViewModel);
        if (ss.isValue(vm)) {
            vm.removeHoveredTarget(this);
        }
    },
    
    acceptDrop: function tab_AnalyticsDropSpot$acceptDrop(d) {
        var vm = Type.safeCast(d.get_payload(), tab.AnalyticsDropTargetViewModel);
        var result = $.DeferredData();
        var shouldAcceptDrop = ss.isValue(vm) && ss.isValue(this.get_command());
        result.resolve(shouldAcceptDrop);
        if (shouldAcceptDrop) {
            vm.executeDropCommand(this);
        }
        return result;
    },
    
    getDropTarget: function tab_AnalyticsDropSpot$getDropTarget(hit) {
        return this;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsScrollSpot

tab.AnalyticsScrollSpot = function tab_AnalyticsScrollSpot(scrollDir, scrollTarget) {
    this._intervalHandleId = -1;
    this._scrollDelta = scrollDir * 10;
    this._elementToScroll = scrollTarget;
}
tab.AnalyticsScrollSpot.prototype = {
    _scrollDelta: 0,
    _elementToScroll: null,
    
    get_feedbackType: function tab_AnalyticsScrollSpot$get_feedbackType() {
        return 'dropfeedbackuponentry';
    },
    
    dragOver: function tab_AnalyticsScrollSpot$dragOver(d) {
        this._intervalHandleId = window.setInterval(ss.Delegate.create(this, this._incrementScroll), 100);
        return this;
    },
    
    dragExit: function tab_AnalyticsScrollSpot$dragExit(d) {
        this._cancelInterval();
    },
    
    acceptDrop: function tab_AnalyticsScrollSpot$acceptDrop(d) {
        this._cancelInterval();
        var result = $.DeferredData();
        result.resolve(false);
        return result;
    },
    
    getDropTarget: function tab_AnalyticsScrollSpot$getDropTarget(hit) {
        return this;
    },
    
    _incrementScroll: function tab_AnalyticsScrollSpot$_incrementScroll() {
        var curScrollTop = this._elementToScroll.scrollTop();
        this._elementToScroll.scrollTop(curScrollTop + this._scrollDelta);
        if (curScrollTop === this._elementToScroll.scrollTop()) {
            this._cancelInterval();
        }
    },
    
    _cancelInterval: function tab_AnalyticsScrollSpot$_cancelInterval() {
        if (this._intervalHandleId > 0) {
            window.clearInterval(this._intervalHandleId);
            this._intervalHandleId = -1;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsDropTargetTemplate

tab.AnalyticsDropTargetTemplate = function tab_AnalyticsDropTargetTemplate() {
    tab.AnalyticsDropTargetTemplate.initializeBase(this, [ $(tab.AnalyticsDropTargetTemplate._htmlTemplate$1) ]);
    this.horizontalDivider = this.getElementBySelector('.tabAdHorizontalDivider');
    this.axisHolder = this.getElementBySelector('.tabAdAxisHolder');
    this.axisListScroller = this.getElementBySelector('.tabAdAxisListScroller');
    this.axisList = this.getElementBySelector('.tabAdAxisList');
    this._dropLabel$1 = this.getElementBySelector('.tabAdDropLabel');
    this.axisScrollTopSpot = this.getElementBySelector('.tabAdScrollHoverTop');
    this.axisScrollBottomSpot = this.getElementBySelector('.tabAdScrollHoverBottom');
}
tab.AnalyticsDropTargetTemplate.prototype = {
    horizontalDivider: null,
    axisHolder: null,
    axisListScroller: null,
    axisList: null,
    axisScrollTopSpot: null,
    axisScrollBottomSpot: null,
    _dropLabel$1: null,
    
    setDropLabel: function tab_AnalyticsDropTargetTemplate$setDropLabel(val) {
        var instructionText = val;
        var dropInstructionParts = instructionText.split('|');
        ss.Debug.assert(dropInstructionParts.length === 3, 'Drop instructions should have 3 parts to their string, separated by |');
        this.getElementBySelector('.tabAdDropInstructionTextPre').text(dropInstructionParts[0]);
        this._dropLabel$1.text(dropInstructionParts[1]);
        this.getElementBySelector('.tabAdDropInstructionTextPost').text(dropInstructionParts[2]);
    },
    
    addDropColumnHeader: function tab_AnalyticsDropTargetTemplate$addDropColumnHeader(description, numLines, iconClass) {
        var header = $(tab.AnalyticsDropTargetTemplate._dropColumnHeader$1);
        var descriptionObject = header.find('.tabAdAreaDropLabel');
        var descriptionParts = description.split('\n');
        for (var ii = 0; ii < numLines; ++ii) {
            var descriptionLine = $('<div />');
            if (ii < descriptionParts.length) {
                descriptionLine.text(descriptionParts[ii]);
            }
            else {
                descriptionLine.html('&nbsp;');
            }
            descriptionObject.append(descriptionLine);
        }
        header.find('.tabAdAreaDropImage').addClass(iconClass);
        this.getElementBySelector('.tabAdHeaderRow').append(header);
        return header;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsDropTargetAxisRowTemplate

tab.AnalyticsDropTargetAxisRowTemplate = function tab_AnalyticsDropTargetAxisRowTemplate() {
    tab.AnalyticsDropTargetAxisRowTemplate.initializeBase(this, [ $(tab.AnalyticsDropTargetAxisRowTemplate._htmlTemplate$1) ]);
    this.axisHeader = this.getElementBySelector('.tabAdAxisName');
}
tab.AnalyticsDropTargetAxisRowTemplate.prototype = {
    axisHeader: null,
    
    setAxisName: function tab_AnalyticsDropTargetAxisRowTemplate$setAxisName(val) {
        this.axisHeader.text(val);
    },
    
    _createCell: function tab_AnalyticsDropTargetAxisRowTemplate$_createCell() {
        var toRet = $(tab.AnalyticsDropTargetAxisRowTemplate._dropCellHTML$1);
        this.get_domRoot().append(toRet);
        return toRet;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsPaneView

tab.AnalyticsPaneView = function tab_AnalyticsPaneView(viewModel) {
    this._listItems$2 = [];
    tab.AnalyticsPaneView.initializeBase(this, [ viewModel, new tab.AnalyticsPaneTemplate() ]);
    this._refreshPaneList$2();
}
tab.AnalyticsPaneView.getClassNameForIcon = function tab_AnalyticsPaneView$getClassNameForIcon(iconName, className) {
    className = className || 'tabAuthAnalyticsPane';
    return className + '-' + tab.TabResources.getResourceName(tab.TabResources.lookupFullResourceAlias(iconName));
}
tab.AnalyticsPaneView.prototype = {
    
    get__analyticsViewModel$2: function tab_AnalyticsPaneView$get__analyticsViewModel$2() {
        return this.get_viewModel();
    },
    
    dispose: function tab_AnalyticsPaneView$dispose() {
        this._cleanUpList$2();
        tab.AnalyticsPaneView.callBaseMethod(this, 'dispose');
    },
    
    onViewModelPropertyChanged: function tab_AnalyticsPaneView$onViewModelPropertyChanged(sender, e) {
        this._refreshPaneList$2();
    },
    
    _refreshPaneList$2: function tab_AnalyticsPaneView$_refreshPaneList$2() {
        this._cleanUpList$2();
        var first = true;
        var $enum1 = ss.IEnumerator.getEnumerator(this.get__analyticsViewModel$2().get_analyticsItemViewModelLists());
        while ($enum1.moveNext()) {
            var analyticsItemGroup = $enum1.current;
            var header = new tab.AnalyticsListHeaderTemplate(analyticsItemGroup.first);
            this.get_element().append(header.get_domRoot());
            if (first) {
                first = false;
            }
            else {
                header.get_domRoot().addClass('tabAnalyticsListHeaderSpacer');
            }
            var $enum2 = ss.IEnumerator.getEnumerator(analyticsItemGroup.second);
            while ($enum2.moveNext()) {
                var analyticsItemVM = $enum2.current;
                var listItem = new tab.AnalyticsListItemView(analyticsItemVM);
                this.get_element().append(listItem.get_element());
                this._listItems$2.add(listItem);
                spiff.DragDropManager.attachDragSource(listItem.get_element(), listItem.get_itemViewModel());
            }
        }
    },
    
    _cleanUpList$2: function tab_AnalyticsPaneView$_cleanUpList$2() {
        this.get_element().children().remove();
        var $enum1 = ss.IEnumerator.getEnumerator(this._listItems$2);
        while ($enum1.moveNext()) {
            var li = $enum1.current;
            li.dispose();
        }
        this._listItems$2.clear();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsListItemView

tab.AnalyticsListItemView = function tab_AnalyticsListItemView(vm) {
    tab.AnalyticsListItemView.initializeBase(this, [ vm, new tab.AnalyticsListItemTemplate() ]);
    this.get__listItemTemplate$2().name.text(this.get_itemViewModel().get_analyticsItem().name);
    var iconClass = tab.AnalyticsPaneView.getClassNameForIcon(this.get_itemViewModel().get_analyticsItem().iconRes);
    this.get__listItemTemplate$2().icon.addClass(iconClass);
    if (tab.FeatureFlags.isEnabled('AnalyticsObjectsDefaultDrop')) {
        this.disposables.add(spiff.TableauClickHandler.target(this.get_element()[0]).onDoubleClick(ss.Delegate.create(this.get_itemViewModel(), this.get_itemViewModel().executeDefaultAddCommand)));
    }
    this._updateEnabled$2();
}
tab.AnalyticsListItemView.prototype = {
    
    get_itemViewModel: function tab_AnalyticsListItemView$get_itemViewModel() {
        return this.get_viewModel();
    },
    
    get__listItemTemplate$2: function tab_AnalyticsListItemView$get__listItemTemplate$2() {
        return this.get_template();
    },
    
    onViewModelPropertyChanged: function tab_AnalyticsListItemView$onViewModelPropertyChanged(sender, e) {
        tab.AnalyticsListItemView.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
        this._updateEnabled$2();
    },
    
    _updateEnabled$2: function tab_AnalyticsListItemView$_updateEnabled$2() {
        var enabled = this.get_itemViewModel().get_analyticsItem().isEnabled;
        this.get__listItemTemplate$2().name.toggleClass('tabDisabled', !enabled);
        this.get__listItemTemplate$2().name.toggleClass('tabEnabled', enabled);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsDragAvatar

tab.AnalyticsDragAvatar = function tab_AnalyticsDragAvatar(itemViewModel) {
    tab.AnalyticsDragAvatar.initializeBase(this, [ itemViewModel, new tab.AnalyticsDragAvatarTemplate(itemViewModel.get_analyticsItem().name) ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsDragAvatarTemplate

tab.AnalyticsDragAvatarTemplate = function tab_AnalyticsDragAvatarTemplate(displayName) {
    tab.AnalyticsDragAvatarTemplate.initializeBase(this, [ $("\n        <span class='tabAuthAnalyticsDragAvatar'>\n            <div class='tabAuthAnalyticsDragAvatarLabel'></div>\n        </span>") ]);
    this.getElementBySelector('.tabAuthAnalyticsDragAvatarLabel').text(displayName);
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsPaneTemplate

tab.AnalyticsPaneTemplate = function tab_AnalyticsPaneTemplate() {
    tab.AnalyticsPaneTemplate.initializeBase(this, [ $("<div class='tabAnalyticsPane'></div>") ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsListItemTemplate

tab.AnalyticsListItemTemplate = function tab_AnalyticsListItemTemplate() {
    tab.AnalyticsListItemTemplate.initializeBase(this, [ $(tab.AnalyticsListItemTemplate._html$1) ]);
    this.icon = this.getElementBySelector('.tabAnalyticsListItemIcon');
    this.name = this.getElementBySelector('.tabAnalyticsListItemName');
}
tab.AnalyticsListItemTemplate.prototype = {
    icon: null,
    name: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.AnalyticsListHeaderTemplate

tab.AnalyticsListHeaderTemplate = function tab_AnalyticsListHeaderTemplate(name) {
    tab.AnalyticsListHeaderTemplate.initializeBase(this, [ $(tab.AnalyticsListHeaderTemplate._html$1) ]);
    var nameHolder = this.getElementBySelector('.tabAnalyticsListHeaderName');
    nameHolder.text(name);
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabView

tab.AuthoringTabView = function tab_AuthoringTabView(t) {
    tab.AuthoringTabView.initializeBase(this, [ t, new tab.AuthoringTabViewTemplate() ]);
    this.tab = t;
    this.dom = this.get_template();
    this.disposables.add(spiff.TableauClickHandler.targetAndClick(this.dom.get_domRoot()[0], ss.Delegate.create(this, this.handleClick)).onDoubleClick(ss.Delegate.create(this, this.handleDoubleClick)).onRightClick(ss.Delegate.create(this, this.handleRightClick)));
    this.tab.add_onTabChanged(ss.Delegate.create(this, this._tabChanged$2));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.tab.remove_onTabChanged(ss.Delegate.create(this, this._tabChanged$2));
    })));
    this._tabChanged$2();
}
tab.AuthoringTabView.prototype = {
    dom: null,
    tab: null,
    
    get_authoringTabNavViewModel: function tab_AuthoringTabView$get_authoringTabNavViewModel() {
        return this.tab.get_parent();
    },
    
    menuButtonClicked: function tab_AuthoringTabView$menuButtonClicked(buttonDom, t) {
        var vm = t.buildMenu();
        spiff.ObjectRegistry.newView(spiff.MenuView, vm);
        vm.show(spiff.ShowMenuOptions.create(buttonDom, true));
    },
    
    handleRightClick: function tab_AuthoringTabView$handleRightClick() {
        this.menuButtonClicked(this.dom.get_domRoot(), this.tab);
    },
    
    handleClick: function tab_AuthoringTabView$handleClick(e) {
        if (this.tab === this.get_authoringTabNavViewModel().get_currentTab() && (tsConfig.is_mobile || tsConfig.is_touch)) {
            this.menuButtonClicked(this.dom.get_domRoot(), this.tab);
        }
        else {
            this.get_authoringTabNavViewModel().selectTab(this.tab);
        }
    },
    
    handleDoubleClick: function tab_AuthoringTabView$handleDoubleClick() {
        this.tab.renameWithPrompt();
    },
    
    _tabChanged$2: function tab_AuthoringTabView$_tabChanged$2() {
        this.dom.label.text(this.tab.get_name());
        this.dom.label.attr('title', this.tab.get_name());
        this.dom.get_domRoot().toggleClass('tabAuthTabChecked', this.tab.get_isCurrent());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabViewTemplate

tab.AuthoringTabViewTemplate = function tab_AuthoringTabViewTemplate() {
    tab.AuthoringTabViewTemplate.initializeBase(this, [ $(tab.AuthoringTabViewTemplate.template) ]);
    this.label = this.getElementBySelector('.tabAuthTabLabel');
}
tab.AuthoringTabViewTemplate.prototype = {
    label: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarButtonView

tab.AuthoringToolbarButtonView = function tab_AuthoringToolbarButtonView() {
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarToggleButtonTemplate

tab.AuthoringToolbarToggleButtonTemplate = function tab_AuthoringToolbarToggleButtonTemplate() {
    tab.AuthoringToolbarToggleButtonTemplate.initializeBase(this);
    this._oppositeStateText$2 = $("<span class='tabAuthToolbarToggleButtonOppositeStateText' />");
    this.get_domRoot().append(this._oppositeStateText$2);
}
tab.AuthoringToolbarToggleButtonTemplate.prototype = {
    _oppositeStateText$2: null,
    
    get_oppositeStateText: function tab_AuthoringToolbarToggleButtonTemplate$get_oppositeStateText() {
        return this._oppositeStateText$2;
    },
    
    setOppositeStateText: function tab_AuthoringToolbarToggleButtonTemplate$setOppositeStateText(text) {
        this._oppositeStateText$2.text(text);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarToggleButtonView

tab.AuthoringToolbarToggleButtonView = function tab_AuthoringToolbarToggleButtonView(viewModel) {
    tab.AuthoringToolbarToggleButtonView.initializeBase(this, [ viewModel ]);
    this._oppositeStateText$3 = $("<span class='tabAuthToolbarToggleButtonOppositeStateText' />");
    this.get_dom().get_domRoot().append(this._oppositeStateText$3);
    this.setOppositeStateText(viewModel.get_toggleToText());
}
tab.AuthoringToolbarToggleButtonView.create = function tab_AuthoringToolbarToggleButtonView$create(viewModel) {
    return new tab.AuthoringToolbarToggleButtonView(viewModel);
}
tab.AuthoringToolbarToggleButtonView.prototype = {
    _oppositeStateText$3: null,
    
    get_oppositeStateText: function tab_AuthoringToolbarToggleButtonView$get_oppositeStateText() {
        return this._oppositeStateText$3;
    },
    
    setOppositeStateText: function tab_AuthoringToolbarToggleButtonView$setOppositeStateText(text) {
        this._oppositeStateText$3.text(text);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarDropdownButtonView

tab.AuthoringToolbarDropdownButtonView = function tab_AuthoringToolbarDropdownButtonView(viewModel) {
    tab.AuthoringToolbarDropdownButtonView.initializeBase(this, [ viewModel ]);
    this._viewModel$3 = viewModel;
    this.get_toolbarButton().add_click(ss.Delegate.create(this, this._clickDropdown$3));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.get_toolbarButton().remove_click(ss.Delegate.create(this, this._clickDropdown$3));
    })));
}
tab.AuthoringToolbarDropdownButtonView.create = function tab_AuthoringToolbarDropdownButtonView$create(viewModel) {
    return new tab.AuthoringToolbarDropdownButtonView(viewModel);
}
tab.AuthoringToolbarDropdownButtonView.prototype = {
    _viewModel$3: null,
    
    _clickDropdown$3: function tab_AuthoringToolbarDropdownButtonView$_clickDropdown$3() {
        this._viewModel$3.dropdownClicked(this.get_element());
    },
    
    onViewModelPropertyChanged: function tab_AuthoringToolbarDropdownButtonView$onViewModelPropertyChanged(sender, e) {
        if (e.get_propertyName() === 'isActive') {
            this.setStateCss();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarUberPopupButtonView

tab.AuthoringToolbarUberPopupButtonView = function tab_AuthoringToolbarUberPopupButtonView(viewModel) {
    tab.AuthoringToolbarUberPopupButtonView.initializeBase(this, [ viewModel ]);
    this._viewModel$3 = viewModel;
    this.get_toolbarButton().add_click(ss.Delegate.create(this, this._clickButton$3));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.get_toolbarButton().remove_click(ss.Delegate.create(this, this._clickButton$3));
    })));
}
tab.AuthoringToolbarUberPopupButtonView._create = function tab_AuthoringToolbarUberPopupButtonView$_create(viewModel) {
    return new tab.AuthoringToolbarUberPopupButtonView(viewModel);
}
tab.AuthoringToolbarUberPopupButtonView.prototype = {
    _viewModel$3: null,
    
    _clickButton$3: function tab_AuthoringToolbarUberPopupButtonView$_clickButton$3() {
        this._viewModel$3.buttonClicked(this.get_element());
    },
    
    onViewModelPropertyChanged: function tab_AuthoringToolbarUberPopupButtonView$onViewModelPropertyChanged(sender, e) {
        if (e.get_propertyName() === 'isActive') {
            this.setStateCss();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringToolbarView

tab.AuthoringToolbarView = function tab_AuthoringToolbarView(viewModel) {
    tab.AuthoringToolbarView.initializeBase(this, [ viewModel, new tab._authoringToolbarViewTemplate() ]);
    this._viewModel$2 = viewModel;
    this._template$2 = this.get_template();
    this._viewModel$2.add_itemsChanged(ss.Delegate.create(this, function() {
        this.updateToolbarButtons();
    }));
    this.updateToolbarButtons();
}
tab.AuthoringToolbarView.prototype = {
    _template$2: null,
    _viewModel$2: null,
    
    updateToolbarButtons: function tab_AuthoringToolbarView$updateToolbarButtons() {
        var buttonArea = this._template$2.get_buttonArea();
        buttonArea.html('');
        var $enum1 = ss.IEnumerator.getEnumerator(this._viewModel$2.get_items());
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            var toggleItem = Type.safeCast(item, tab.AuthoringToolbarToggleButtonViewModel);
            var dropdownItem = Type.safeCast(item, tab.AuthoringToolbarDropdownButtonViewModel);
            var uberPopupItem = Type.safeCast(item, tab.AuthoringToolbarUberPopupButtonViewModel);
            if (item.get_isSeparator()) {
                buttonArea.append("<span class='tabAuthToolbarSeparator'/>");
            }
            else if (toggleItem != null) {
                var button = tab.AuthoringToolbarToggleButtonView.create(toggleItem);
                buttonArea.append(button.get_element());
            }
            else if (dropdownItem != null) {
                var button = tab.AuthoringToolbarDropdownButtonView.create(dropdownItem);
                buttonArea.append(button.get_element());
            }
            else if (uberPopupItem != null) {
                var button = tab.AuthoringToolbarUberPopupButtonView._create(uberPopupItem);
                buttonArea.append(button.get_element());
            }
            else {
                var button = tab.ToolbarButtonView.create(item);
                buttonArea.append(button.get_element());
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._authoringToolbarViewTemplate

tab._authoringToolbarViewTemplate = function tab__authoringToolbarViewTemplate() {
    tab._authoringToolbarViewTemplate.initializeBase(this, [ $("\n<div class='tabAuthToolbar'>\n    <div class='tabAuthToolbarButtonArea' />\n</div>") ]);
    if (!tab.BrowserSupport.get_displayInlineBlock()) {
        this.get_domRoot().addClass('noDisplayInline');
    }
}
tab._authoringToolbarViewTemplate.prototype = {
    
    get_buttonArea: function tab__authoringToolbarViewTemplate$get_buttonArea() {
        return this.getElementBySelector('.tabAuthToolbarButtonArea');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringView

tab.AuthoringView = function tab_AuthoringView(authoringViewModel) {
    this._disposables = new tab.DisposableHolder();
    this.authoringViewModel = authoringViewModel;
    this.leftPanelView = spiff.ObjectRegistry.newView(tab.LeftPanelView, this.authoringViewModel.get_dataSchemaViewModel(), this.authoringViewModel.get_analyticsViewModel());
    this.toolbar = new tab.AuthoringToolbarView(authoringViewModel.get_toolbarViewModel());
    this.tabNav = spiff.ObjectRegistry.newView(tab.AuthoringTabNavView, authoringViewModel.get_authoringTabNavViewModel());
    if (ss.isValue(this.authoringViewModel.get_authoringMastheadViewModel())) {
        this.authoringMastheadView = spiff.ObjectRegistry.newView(tab.AuthoringMastheadView, this.authoringViewModel.get_authoringMastheadViewModel());
    }
    this._initCards();
    this.authoringViewModel.add_propertyChanged(ss.Delegate.create(this, this._onViewModelPropertyChanged));
    this._disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.authoringViewModel.remove_propertyChanged(ss.Delegate.create(this, this._onViewModelPropertyChanged));
    })));
    this._disposables.add(spiff.EventUtil.bindWithDispose($(window), 'resize', ss.Delegate.create(this, this._handleWindowResize)));
    this.authoringViewModel.add_disposed(ss.Delegate.create(this, this._onViewModelDispose));
    this._disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.authoringViewModel.remove_disposed(ss.Delegate.create(this, this._onViewModelDispose));
    })));
    tab.ReferenceLineConstantValueEditorViewModel.add_showReferenceLineConstantValueEditor(ss.Delegate.create(this, this._createReferenceLineConstantValueEditor));
    spiff.DragDropManager.add_dragStarted(ss.Delegate.create(this, this._handleAnalyticsObjectDrag));
    this._disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        tab.ReferenceLineConstantValueEditorViewModel.remove_showReferenceLineConstantValueEditor(ss.Delegate.create(this, this._createReferenceLineConstantValueEditor));
        spiff.DragDropManager.remove_dragStarted(ss.Delegate.create(this, this._handleAnalyticsObjectDrag));
    })));
}
tab.AuthoringView.get_instance = function tab_AuthoringView$get_instance() {
    return tab.AuthoringView.authoringView;
}
tab.AuthoringView.prototype = {
    cards: null,
    mastheadArea: null,
    toolbarArea: null,
    insideViewArea: null,
    leftViewArea: null,
    tabArea: null,
    leftViewResizeAffordance: null,
    leftPanelView: null,
    authoringMastheadView: null,
    toolbar: null,
    tabNav: null,
    authoringViewModel: null,
    _leftShelfActualHeights: null,
    _leftShelfPreferredHeights: null,
    _leftShelfHeightsDirty: false,
    
    get_element: function tab_AuthoringView$get_element() {
        return null;
    },
    
    get_viewModel: function tab_AuthoringView$get_viewModel() {
        return this.authoringViewModel;
    },
    
    get_leftPanel: function tab_AuthoringView$get_leftPanel() {
        return this.leftPanelView;
    },
    
    _initCards: function tab_AuthoringView$_initCards() {
        this.cards = {};
        this.cards['top'] = [];
        var $enum1 = ss.IEnumerator.getEnumerator(tab.AuthoringViewModel.cardLayout['top']);
        while ($enum1.moveNext()) {
            var stripCards = $enum1.current;
            var $enum2 = ss.IEnumerator.getEnumerator(stripCards);
            while ($enum2.moveNext()) {
                var card = $enum2.current;
                this.cards['top'].add(spiff.ObjectRegistry.newView(tab.CardView, this.authoringViewModel.get_cards()[card]));
            }
        }
        this.cards['left'] = [];
        var $enum3 = ss.IEnumerator.getEnumerator(tab.AuthoringViewModel.cardLayout['left']);
        while ($enum3.moveNext()) {
            var strip = $enum3.current;
            var $enum4 = ss.IEnumerator.getEnumerator(strip);
            while ($enum4.moveNext()) {
                var card = $enum4.current;
                var vm = this.authoringViewModel.get_cards()[card];
                var newCardView = spiff.ObjectRegistry.newView(tab.CardView, vm);
                this._addCardContentChangedHandler(newCardView);
            }
        }
    },
    
    _addCardContentChangedHandler: function tab_AuthoringView$_addCardContentChangedHandler(card) {
        this.cards['left'].add(card);
        var prevResizeLeftShelves = null;
        var cardContentChangedHandler = ss.Delegate.create(this, function(content) {
            var view = Type.safeCast(content, tab.CardContentView);
            if (view != null) {
                if (prevResizeLeftShelves != null) {
                    prevResizeLeftShelves.dispose();
                    prevResizeLeftShelves = null;
                }
                view.add_scrollContentChanged(ss.Delegate.create(this, this._resizeLeftShelves));
                prevResizeLeftShelves = new tab.CallOnDispose(ss.Delegate.create(this, function() {
                    view.remove_scrollContentChanged(ss.Delegate.create(this, this._resizeLeftShelves));
                }));
            }
            this._resizeLeftShelves();
        });
        card.add_cardContentChanged(cardContentChangedHandler);
        this._disposables.add(new tab.CallOnDispose(function() {
            card.remove_cardContentChanged(cardContentChangedHandler);
        }));
    },
    
    _onViewModelDispose: function tab_AuthoringView$_onViewModelDispose(vm) {
        this.dispose();
    },
    
    dispose: function tab_AuthoringView$dispose() {
        this._disposables.dispose();
        this.leftPanelView.dispose();
        this.toolbar.dispose();
        this.tabNav.dispose();
        this._removeAreasDom();
    },
    
    buildDom: function tab_AuthoringView$buildDom() {
        this.buildAreasDom();
        this.addContentToAreas();
        this.addDomToBody();
        this.notifyContentAddedToDom();
        this.layout();
        if (ss.isValue(this.authoringViewModel.get_calculationEditorViewModel())) {
            spiff.ObjectRegistry.newView(tab.CalculationDialogView, this.authoringViewModel.get_calculationEditorViewModel());
        }
    },
    
    addDomToBody: function tab_AuthoringView$addDomToBody() {
        var body = $(document.body);
        body.append(this.insideViewArea).append(this.toolbarArea).append(this.leftViewArea).append(this.tabArea).append(this.mastheadArea);
        this.leftViewArea.append(this.leftViewResizeAffordance);
        spiff.DragDropManager.attachDragSource(this.leftViewResizeAffordance, this);
        var clickHandler = spiff.TableauClickHandler.targetAndClick(document.body, function(e) {
            if (e.currentTarget === e.target) {
                e.stopPropagation();
                tab.SelectionClientCommands.clearAllSelections(tab.ModelUtils.findActiveOrDefaultVisual().get_visualId());
            }
        });
        clickHandler.set_stopPropagationOnEvent(false);
        this._disposables.add(clickHandler);
    },
    
    notifyContentAddedToDom: function tab_AuthoringView$notifyContentAddedToDom() {
        this.leftPanelView.onAddedToDom();
        this.tabNav.onAddedToDom();
        var $dict1 = this.cards;
        for (var $key2 in $dict1) {
            var pair = { key: $key2, value: $dict1[$key2] };
            var $enum3 = ss.IEnumerator.getEnumerator(pair.value);
            while ($enum3.moveNext()) {
                var card = $enum3.current;
                card.onAddedToDom();
                if (pair.key === 'left' && ss.isValue(card.get_contentView()) && Type.canCast(card.get_contentView(), tab.CardContentView)) {
                    (card.get_contentView()).add_scrollContentChanged(ss.Delegate.create(this, this._resizeLeftShelves));
                    this._disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                        (card.get_contentView()).remove_scrollContentChanged(ss.Delegate.create(this, this._resizeLeftShelves));
                    })));
                }
            }
        }
    },
    
    buildAreasDom: function tab_AuthoringView$buildAreasDom() {
        this.mastheadArea = $("<div class='tabAuthMastheadArea'></div>");
        this.toolbarArea = $("<div class='tabAuthToolbarArea'></div>");
        this.leftViewArea = $("<div class='tabAuthLeftViewArea'></div>");
        this.leftViewResizeAffordance = $("<div class='tabAuthLeftViewAreaResizer'></div>");
        this.tabArea = $("<div class='tabAuthTabArea'></div>");
        this.insideViewArea = $("<div class='tabAuthVerticalChrome'></div>");
    },
    
    _removeAreasDom: function tab_AuthoringView$_removeAreasDom() {
        $('.tabAuthMastheadArea').remove();
        $('.tabAuthToolbarArea').remove();
        $('.tabAuthLeftViewArea').remove();
        $('.tabAuthLeftViewAreaResizer').remove();
        $('.tabAuthTabArea').remove();
        $('.tabAuthVerticalChrome').remove();
    },
    
    leftAreaResizerTouch: function tab_AuthoringView$leftAreaResizerTouch(e) {
    },
    
    leftAreaResizeStart: function tab_AuthoringView$leftAreaResizeStart(e) {
    },
    
    leftAreaResizeEnd: function tab_AuthoringView$leftAreaResizeEnd(e) {
        this.leftPanelView.resizeEnd();
        this.authoringViewModel.updatePortSizeAfterManualLayout();
    },
    
    leftAreaResizeTo: function tab_AuthoringView$leftAreaResizeTo(newWidth) {
        this.tabArea.css('left', (newWidth + 2).toString() + 'px');
        this.leftViewResizeAffordance.css('left', (newWidth - 1).toString() + 'px');
        this.leftViewArea.width(newWidth - 1);
        this.leftPanelView.set_width(newWidth - 1);
    },
    
    leftAreaHandleResizeDrag: function tab_AuthoringView$leftAreaHandleResizeDrag(e) {
        this.leftAreaResizeTo(e.clientX);
    },
    
    leftAreaHandleAutoResize: function tab_AuthoringView$leftAreaHandleAutoResize(e) {
        var maxWidth = this.leftPanelView.getMaxWidth();
        var newWidth = this.leftPanelView.getNewWidth(maxWidth);
        this.leftAreaResizeTo(newWidth);
        this.leftAreaResizeEnd(e);
    },
    
    startDrag: function tab_AuthoringView$startDrag(e) {
        return new spiff.MoveDragInstance(this.leftViewResizeAffordance, ss.Delegate.create(this, this.leftAreaHandleResizeDrag), ss.Delegate.create(this, this.leftAreaResizeEnd));
    },
    
    leftAreaWidth: function tab_AuthoringView$leftAreaWidth() {
        return this.leftPanelView.get_width();
    },
    
    layout: function tab_AuthoringView$layout() {
        var vb = tabBootstrap.ViewerBootstrap.get_instance();
        var totalVerticalChrome = vb.get_authoringMastheadHeight() + vb.get_authoringToolbarHeight() + vb.get_authoringShelfHeight();
        var totalHorizontalChrome = vb.get_authoringShelfWidth() + this.leftAreaWidth();
        var css = { position: 'absolute' };
        css['bottom'] = vb.get_authoringTabsHeight() + 'px';
        css['right'] = '0px';
        css['top'] = totalVerticalChrome + 'px';
        css['left'] = totalHorizontalChrome + 'px';
        css['overflow'] = 'hidden';
        this.authoringViewModel.get_client().get_domNode().css(css);
        this._resizeLeftShelves();
        this._alignMasthead();
    },
    
    handleClientChanged: function tab_AuthoringView$handleClientChanged() {
        this.layout();
    },
    
    _onViewModelPropertyChanged: function tab_AuthoringView$_onViewModelPropertyChanged(sender, e) {
        if (e.get_propertyName() === 'Client') {
            this.handleClientChanged();
        }
    },
    
    _handleWindowResize: function tab_AuthoringView$_handleWindowResize(e) {
        this._leftShelfActualHeights = null;
        this._resizeLeftShelves();
    },
    
    _resizeLeftShelves: function tab_AuthoringView$_resizeLeftShelves() {
        this._applyLeftShelfHeights();
        this._leftShelfHeightsDirty = true;
        _.defer(ss.Delegate.create(this, this._doResizeLeftShelves));
    },
    
    _alignMasthead: function tab_AuthoringView$_alignMasthead() {
        if (ss.isValue(this.authoringMastheadView)) {
            this.authoringMastheadView.layout();
        }
    },
    
    _doResizeLeftShelves: function tab_AuthoringView$_doResizeLeftShelves() {
        if (!this._leftShelfHeightsDirty) {
            return;
        }
        tab.Log.get(this).debug('ResizeLeftShelves');
        this._leftShelfHeightsDirty = false;
        var preferredHeightsChanged = !_.isEqual(this._leftShelfPreferredHeights, this._calculateLeftShelfPreferredHeights());
        if (ss.isNullOrUndefined(this._leftShelfActualHeights) || preferredHeightsChanged) {
            this._computeLeftShelfHeights();
        }
        this._applyLeftShelfHeights();
    },
    
    _applyLeftShelfHeights: function tab_AuthoringView$_applyLeftShelfHeights() {
        if (ss.isNullOrUndefined(this._leftShelfActualHeights)) {
            return;
        }
        tab.Log.get(this).debug('ApplyLeftShelfHeights');
        for (var i = 0; i < this._leftShelfActualHeights.length; i++) {
            var card = this.cards['left'][i];
            if (Type.canCast(card.get_contentView(), tab.CardContentView)) {
                (card.get_contentView()).setScrollableContentActualHeight(this._leftShelfActualHeights[i]);
            }
        }
    },
    
    _computeLeftShelfHeights: function tab_AuthoringView$_computeLeftShelfHeights() {
        tab.Log.get(this).debug('ComputeLeftShelfHeights');
        var leftShelvesDom = $('.tabAuthLeftShelves');
        var $enum1 = ss.IEnumerator.getEnumerator(this.cards['left']);
        while ($enum1.moveNext()) {
            var cardView = $enum1.current;
            if (Type.canCast(cardView.get_contentView(), tab.CardContentView)) {
                var ccv = cardView.get_contentView();
                ccv.setScrollableContentActualHeight(null);
            }
        }
        this._leftShelfPreferredHeights = this._calculateLeftShelfPreferredHeights();
        var leftShelfHeight = leftShelvesDom.outerHeight(true);
        var contentHeight = leftShelvesDom.children().outerHeight(true);
        if (contentHeight <= leftShelfHeight) {
            return;
        }
        var minHeight = 18;
        var totalScrollableHeight = 0;
        var shelfCount = 0;
        var $enum2 = ss.IEnumerator.getEnumerator(this.cards['left']);
        while ($enum2.moveNext()) {
            var cardView = $enum2.current;
            if (cardView.get_element().is(':visible') && Type.canCast(cardView.get_contentView(), tab.CardContentView)) {
                var ccv = cardView.get_contentView();
                totalScrollableHeight += ccv.get_scrollableContentPreferredHeight();
                shelfCount++;
            }
        }
        var fixedContentHeight = contentHeight - totalScrollableHeight;
        var heightToDistribute = leftShelfHeight - fixedContentHeight;
        var heightToDistributeAboveMin = heightToDistribute - (minHeight * shelfCount);
        this._leftShelfActualHeights = [];
        var idx = 0;
        var remainingAdditionalHeight = heightToDistributeAboveMin;
        while (idx < this._leftShelfPreferredHeights.length - 1) {
            var actualHeight = null;
            if (ss.isValue(this._leftShelfPreferredHeights[idx])) {
                actualHeight = minHeight;
                if (heightToDistributeAboveMin > 0) {
                    var additionalHeight = Math.floor(heightToDistributeAboveMin * this._leftShelfPreferredHeights[idx] / totalScrollableHeight);
                    actualHeight += additionalHeight;
                    remainingAdditionalHeight -= additionalHeight;
                }
            }
            this._leftShelfActualHeights.add(actualHeight);
            idx++;
        }
        if (ss.isValue(this._leftShelfPreferredHeights[idx])) {
            this._leftShelfActualHeights.add((heightToDistributeAboveMin > 0) ? remainingAdditionalHeight + minHeight : minHeight);
        }
        else {
            this._leftShelfActualHeights.add(null);
        }
    },
    
    _calculateLeftShelfPreferredHeights: function tab_AuthoringView$_calculateLeftShelfPreferredHeights() {
        var heights = [];
        var $enum1 = ss.IEnumerator.getEnumerator(this.cards['left']);
        while ($enum1.moveNext()) {
            var cardView = $enum1.current;
            if (cardView.get_element().is(':visible') && Type.canCast(cardView.get_contentView(), tab.CardContentView)) {
                var ccv = cardView.get_contentView();
                var preferredHeight = ccv.get_scrollableContentPreferredHeight();
                heights.add(preferredHeight);
            }
            else {
                heights.add(null);
            }
        }
        return heights;
    },
    
    _handleAnalyticsObjectDrag: function tab_AuthoringView$_handleAnalyticsObjectDrag(dragInstance) {
        var dropVM = Type.safeCast(dragInstance.get_payload(), tab.AnalyticsDropTargetViewModel);
        if (ss.isNullOrUndefined(dropVM)) {
            return;
        }
        var glassArea = $("<div class='tabAuthTempGlassForDropTarget' />");
        var glassOffset = this.calculateDropTargetOffset();
        glassArea.css({ position: 'absolute', top: glassOffset.y + 'px', bottom: this.tabArea.css('height'), left: glassOffset.x + 'px', right: '0px' });
        this.insideViewArea.append(glassArea);
        var dropView = new tab.AnalyticsDropTargetView(dropVM, glassArea.get(0));
        dropView.addToDom(glassArea);
        var removeGlassArea = function() {
            glassArea.remove();
        };
        dropView.add_disposed(removeGlassArea);
        this._disposables.add(new tab.CallOnDispose(function() {
            dropView.remove_disposed(removeGlassArea);
        }));
    },
    
    _createReferenceLineConstantValueEditor: function tab_AuthoringView$_createReferenceLineConstantValueEditor(viewModel) {
        var editorView = new tab.ReferenceLineConstantValueEditorView(viewModel, this.calculateDropTargetOffset());
        editorView.addToDom(this.insideViewArea);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationEditorDragFeedback

tab.CalculationEditorDragFeedback = function tab_CalculationEditorDragFeedback(editor) {
    this._replaceableMarkerName = 'tabTok_replace';
    this._nonReplaceableMarkerName = 'tabTok_noreplace';
    this._feedbackCursor = {};
    this._editor = editor;
    this._dropTargetPointer = $("<div class='tabEditorDropTargetPointer'></div>");
    this._dropTargetHilighter = $("<div class='tabEditorDropTargetHighlighter'></div>");
}
tab.CalculationEditorDragFeedback.prototype = {
    _dropTargetPointer: null,
    _dropTargetHilighter: null,
    _editor: null,
    _pillDragCursorPadding: 0,
    _lineElemsDuringDrag: null,
    _selectionElemsDuringDrag: null,
    
    get_replaceableMarkerName: function tab_CalculationEditorDragFeedback$get_replaceableMarkerName() {
        return this._replaceableMarkerName;
    },
    set_replaceableMarkerName: function tab_CalculationEditorDragFeedback$set_replaceableMarkerName(value) {
        this._replaceableMarkerName = value;
        return value;
    },
    
    get_nonReplaceableMarkerName: function tab_CalculationEditorDragFeedback$get_nonReplaceableMarkerName() {
        return this._nonReplaceableMarkerName;
    },
    set_nonReplaceableMarkerName: function tab_CalculationEditorDragFeedback$set_nonReplaceableMarkerName(value) {
        this._nonReplaceableMarkerName = value;
        return value;
    },
    
    get_pillDragCursorPadding: function tab_CalculationEditorDragFeedback$get_pillDragCursorPadding() {
        return this._pillDragCursorPadding;
    },
    set_pillDragCursorPadding: function tab_CalculationEditorDragFeedback$set_pillDragCursorPadding(value) {
        this._pillDragCursorPadding = value;
        return value;
    },
    
    get_cursorIndex: function tab_CalculationEditorDragFeedback$get_cursorIndex() {
        return this._editor.indexFromPos(this._feedbackCursor);
    },
    
    get_cursorPosition: function tab_CalculationEditorDragFeedback$get_cursorPosition() {
        return this._feedbackCursor;
    },
    
    dragOver: function tab_CalculationEditorDragFeedback$dragOver(d) {
        this.switchDragFeedback(d, true);
        this.showDragOverFeedback();
    },
    
    dragExit: function tab_CalculationEditorDragFeedback$dragExit(d) {
        this.switchDragFeedback(d, false);
    },
    
    handleDropStateChanged: function tab_CalculationEditorDragFeedback$handleDropStateChanged(state) {
        if (state === 1) {
            this._editor.execCommand('singleSelection');
            this._selectionElemsDuringDrag = $(this._editor.getWrapperElement()).find('.CodeMirror-selected');
            this._lineElemsDuringDrag = $(this._editor.getWrapperElement()).find('.CodeMirror-lines');
        }
        else {
            this.switchDragFeedback(null, false);
            this._selectionElemsDuringDrag = null;
            this._lineElemsDuringDrag = null;
        }
    },
    
    switchDragFeedback: function tab_CalculationEditorDragFeedback$switchDragFeedback(d, show) {
        if (ss.isValue(d) && ss.isValue(d.get_dragAvatar())) {
            d.get_dragAvatar().get_element().toggleClass('tabPillBelowCursor', show);
        }
        if (ss.isValue(this._lineElemsDuringDrag)) {
            this._lineElemsDuringDrag.toggleClass('tabActiveDropTarget', show);
        }
        if (!show) {
            this._dropTargetHilighter.remove();
            this._dropTargetPointer.remove();
            this._highlightSelection(false);
        }
    },
    
    showDragOverFeedback: function tab_CalculationEditorDragFeedback$showDragOverFeedback() {
        this._feedbackCursor = this.getDocumentPositionForEvent(spiff.DragDropManager.get_lastDragEvent(), this._editor.getCursor());
        var charIndex = this._editor.indexFromPos(this._feedbackCursor);
        if (this._showDragOverSelectionFeedback(charIndex)) {
            return;
        }
        if (this._showDragOverTokenFeedback(this._feedbackCursor, charIndex)) {
            return;
        }
        this._showInsertionPointer();
    },
    
    _showDragOverSelectionFeedback: function tab_CalculationEditorDragFeedback$_showDragOverSelectionFeedback(charIndex) {
        var selectionAtIndex = tab.CalculationEditorView.getSelectionAtIndex(this._editor, charIndex);
        if (ss.isValue(selectionAtIndex)) {
            this._dropTargetPointer.remove();
            this._dropTargetHilighter.remove();
            this._highlightSelection(true);
            return true;
        }
        this._highlightSelection(false);
        return false;
    },
    
    _showDragOverTokenFeedback: function tab_CalculationEditorDragFeedback$_showDragOverTokenFeedback(cursorPos, charIndex) {
        var feedbackToken = this._getFeedbackToken(this._editor.findMarksAt(cursorPos));
        if (ss.isValue(feedbackToken)) {
            var tokenRange = feedbackToken.find();
            var fromCharIndex = this._editor.indexFromPos(tokenRange.from);
            var toCharIndex = this._editor.indexFromPos(tokenRange.to);
            if (charIndex > fromCharIndex && charIndex < toCharIndex) {
                if (String.equals(this._replaceableMarkerName, feedbackToken.className, false)) {
                    this._highlightToken(tokenRange);
                    return true;
                }
                if (String.equals(this._nonReplaceableMarkerName, feedbackToken.className, false)) {
                    this._feedbackCursor = (charIndex > (fromCharIndex + ((toCharIndex - fromCharIndex) / 2))) ? tokenRange.to : tokenRange.from;
                    this._showInsertionPointer();
                    return true;
                }
            }
        }
        return false;
    },
    
    _highlightSelection: function tab_CalculationEditorDragFeedback$_highlightSelection(highlight) {
        if (ss.isValue(this._selectionElemsDuringDrag)) {
            this._selectionElemsDuringDrag.toggleClass('tabActiveDropTarget', highlight);
        }
    },
    
    _highlightToken: function tab_CalculationEditorDragFeedback$_highlightToken(tokenRange) {
        var toPosition = {};
        if (tokenRange.to.line > tokenRange.from.line) {
            var lineText = this._editor.getLine(tokenRange.from.line);
            var numChars = lineText.length - tokenRange.from.ch;
            toPosition.ch = tokenRange.from.ch + numChars;
            toPosition.line = tokenRange.from.line;
        }
        else {
            toPosition = tokenRange.to;
        }
        var fromRect = this._editor.charCoords(tokenRange.from, 'local');
        var toRect = this._editor.charCoords(toPosition, 'local');
        this._dropTargetHilighter.width(toRect.left - fromRect.left);
        this._dropTargetPointer.remove();
        this._editor.addWidget(tokenRange.from, this._dropTargetHilighter[0], false, 'over', null);
    },
    
    _showInsertionPointer: function tab_CalculationEditorDragFeedback$_showInsertionPointer() {
        this._dropTargetHilighter.remove();
        this._editor.addWidget(this._feedbackCursor, this._dropTargetPointer[0], false, 'over', null);
    },
    
    _getFeedbackToken: function tab_CalculationEditorDragFeedback$_getFeedbackToken(tokens) {
        if (ss.isNullOrUndefined(tokens)) {
            return null;
        }
        for (var i = 0, l = tokens.length; i < l; i++) {
            var token = tokens[i];
            if (String.equals(this._replaceableMarkerName, token.className, false) || String.equals(this._nonReplaceableMarkerName, token.className, false)) {
                return token;
            }
        }
        return null;
    },
    
    getDocumentPositionForEvent: function tab_CalculationEditorDragFeedback$getDocumentPositionForEvent(evt, defaultPos) {
        var pageCoords = {};
        pageCoords.left = evt.pageX;
        pageCoords.top = evt.pageY - this._pillDragCursorPadding;
        if (ss.isValue(defaultPos) && pageCoords.top > this._editor.heightAtLine(this._editor.lineCount(), 'page')) {
            return defaultPos;
        }
        return this._editor.coordsChar(pageCoords);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalcTextDragAvatar

tab.CalcTextDragAvatar = function tab_CalcTextDragAvatar(text) {
    tab.CalcTextDragAvatar.initializeBase(this, [ $("\n<span class='tabCalcEditorTextDragAvatar'>\n    <div class='tabCalcEditorTextDragAvatarLabel'></div>\n</span>") ]);
    this.set_label(text);
}
tab.CalcTextDragAvatar.prototype = {
    _label$1: null,
    
    get_viewModel: function tab_CalcTextDragAvatar$get_viewModel() {
        return null;
    },
    
    get_label: function tab_CalcTextDragAvatar$get_label() {
        return this._label$1;
    },
    set_label: function tab_CalcTextDragAvatar$set_label(value) {
        tab.Log.get(this).debug('Updating label: %s', value);
        this._label$1 = value;
        this.get_element().find('.tabCalcEditorTextDragAvatarLabel').text(this._label$1);
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationAutoCompleteHelper

tab.CalculationAutoCompleteHelper = function tab_CalculationAutoCompleteHelper(cm, viewModel) {
    this._touchHandlers = new tab.DisposableHolder();
    this._functionHelpIndex = -1;
    ss.Debug.assert(cm != null, 'invalid editor!');
    this._editor = cm;
    this._calcViewModel = viewModel;
    this._debounceAutoCompleteRequest = _.debounce(ss.Delegate.create(this, this._requestAutoCompleteImmediate), 100);
    this._autoCompleteOptions = {};
    this._autoCompleteOptions['hint'] = ss.Delegate.create(this, this.getHints);
    this._autoCompleteOptions['completeSingle'] = false;
    this._autoCompleteOptions['completeOnSingleClick'] = true;
    this._autoCompleteOptions['alignWithWord'] = false;
    this._autoCompleteOptions['closeOnUnfocus'] = true;
    var cmdEnterKey = (tab.BrowserSupport.get_isMac()) ? 'Cmd-Enter' : 'Ctrl-Enter';
    var extraKeys = {};
    extraKeys[cmdEnterKey] = function(editor, menu) {
        menu.pick();
    };
    this._autoCompleteOptions['extraKeys'] = extraKeys;
    this._functionHelpTooltip = new tab.Tooltip(new tab._functionHelpTooltipTemplate());
    this._functionHelpTooltip.set_horizontalOffset(0);
    this._functionHelpTooltip.set_showAbove(false);
    this._editor.on('change', ss.Delegate.create(this, this._onEditorChange));
    this._editor.on('cursorActivity', ss.Delegate.create(this, this._onCursorChange));
    this._editor.on('blur', ss.Delegate.create(this, this._onEditorBlur));
    this._editor.on('focus', ss.Delegate.create(this, this._onEditorFocus));
    spiff.GlobalTouchWatcher.add_firstTouch(ss.Delegate.create(this, this._onBodyFirstTouch));
    this._calcViewModel.add_calculationUpdated(ss.Delegate.create(this, this._onCalculationUpdated));
}
tab.CalculationAutoCompleteHelper.prototype = {
    _editor: null,
    _calcViewModel: null,
    _functionHelpTooltip: null,
    _autoCompleteOptions: null,
    _currentRequestDocState: null,
    _autoCompleteDataModel: null,
    _showingMenu: false,
    _disposed: false,
    _accumulatedWantHints: false,
    _debounceAutoCompleteRequest: null,
    _validFormulaTooltip: null,
    
    get_isShowingMenu: function tab_CalculationAutoCompleteHelper$get_isShowingMenu() {
        return this._showingMenu;
    },
    set_isShowingMenu: function tab_CalculationAutoCompleteHelper$set_isShowingMenu(value) {
        this._showingMenu = value;
        return value;
    },
    
    get__toolTipElement: function tab_CalculationAutoCompleteHelper$get__toolTipElement() {
        if (ss.isValue(this._functionHelpTooltip)) {
            return this._functionHelpTooltip.get_element()[0];
        }
        return null;
    },
    
    get__autoCompleteElement: function tab_CalculationAutoCompleteHelper$get__autoCompleteElement() {
        var autoComplete = $('.CodeMirror-hints');
        if (ss.isValue(autoComplete) && autoComplete.length > 0) {
            return autoComplete[0];
        }
        return null;
    },
    
    get_validFormulaTooltip: function tab_CalculationAutoCompleteHelper$get_validFormulaTooltip() {
        return this._validFormulaTooltip;
    },
    set_validFormulaTooltip: function tab_CalculationAutoCompleteHelper$set_validFormulaTooltip(value) {
        this._validFormulaTooltip = value;
        return value;
    },
    
    dispose: function tab_CalculationAutoCompleteHelper$dispose() {
        this._disposed = true;
        this._currentRequestDocState = null;
        this._closeAutocompletePopup();
        this._functionHelpTooltip.dispose();
        spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this._onBodyFirstTouch));
        this._touchHandlers.dispose();
        this._calcViewModel.remove_calculationUpdated(ss.Delegate.create(this, this._onCalculationUpdated));
    },
    
    close: function tab_CalculationAutoCompleteHelper$close(closeHelpTooltip) {
        if (closeHelpTooltip) {
            this._closeFunctionHelp();
        }
        this._autoCompleteDataModel = null;
    },
    
    _closeFunctionHelp: function tab_CalculationAutoCompleteHelper$_closeFunctionHelp() {
        this._functionHelpTooltip.close();
        this._functionHelpIndex = -1;
    },
    
    _closeAutocompletePopup: function tab_CalculationAutoCompleteHelper$_closeAutocompletePopup() {
        var comp = this._getCompletionsObject();
        if (comp != null) {
            comp.close();
        }
    },
    
    _onCalculationUpdated: function tab_CalculationAutoCompleteHelper$_onCalculationUpdated() {
        this._update(this.get_isShowingMenu());
    },
    
    _update: function tab_CalculationAutoCompleteHelper$_update(showHints) {
        var formula = this._editor.getValue();
        var cursorIndex = this._editor.indexFromPos(this._editor.getCursor());
        if (this._autoCompleteDataModel != null && showHints && cursorIndex >= this._autoCompleteDataModel.get_startIndex() && cursorIndex <= this._autoCompleteDataModel.get_endIndex() && this._autoCompleteDataModel.get_calculation() === formula) {
            this._closeFunctionHelp();
            this._editor.showHint(this._autoCompleteOptions);
        }
        else if (this._autoCompleteDataModel != null && !tab.MiscUtil.isNullOrEmpty(this._autoCompleteDataModel.get_functionTooltip())) {
            this._showFunctionHelp(this._autoCompleteDataModel.get_functionTooltip(), this._autoCompleteDataModel.get_functionHelpPosition());
        }
        else if (!String.isNullOrEmpty(this._validFormulaTooltip) && this._calcViewModel.isValidFormula() && this._calcViewModel.get_isDirty()) {
            this._showFunctionHelp(this._validFormulaTooltip, cursorIndex);
        }
        else {
            this._closeFunctionHelp();
        }
    },
    
    _showFunctionHelp: function tab_CalculationAutoCompleteHelper$_showFunctionHelp(text, index) {
        if (String.isNullOrEmpty(text)) {
            this._closeFunctionHelp();
        }
        else {
            tab.Log.get(this).debug('Show function help');
            var offset = 0;
            if (index >= 0 && ss.isValue(this._autoCompleteDataModel)) {
                offset = tab.CalculationEditorView.getNewLineOffset(this._autoCompleteDataModel.get_calculation().toString().substr(0, index));
            }
            this._functionHelpIndex = index;
            var functionHelpPos = this._editor.posFromIndex(offset + this._functionHelpIndex);
            var funcCoords = this._editor.cursorCoords(functionHelpPos, 'page');
            var cursorCoords = this._editor.cursorCoords(this._editor.getCursor(), 'page');
            var leftMostCoord = this._editor.cursorCoords(this._editor.posFromIndex(0), 'page').left + this._editor.getScrollInfo().left;
            var xPos = Math.max(leftMostCoord, funcCoords.left);
            var yPos = cursorCoords.top;
            this._functionHelpTooltip.show(text, tab.$create_Point(xPos, yPos));
        }
    },
    
    _onEditorChange: function tab_CalculationAutoCompleteHelper$_onEditorChange(cm, change) {
        ss.Debug.assert(cm === this._editor, 'cm != editor!');
        switch (change.origin) {
            case '+input':
            case '+delete':
                this._requestAutoComplete(true);
                break;
            case 'complete':
                tab.Log.get(this).debug('editor text updated by autocomplete');
                this._requestAutoComplete(false);
                break;
            default:
                tab.Log.get(this).debug('editor text updated, origin: ' + change.origin);
                break;
        }
    },
    
    _updateFunctionHelp: function tab_CalculationAutoCompleteHelper$_updateFunctionHelp() {
        this.close(false);
        this._requestAutoComplete(false);
    },
    
    _onEditorFocus: function tab_CalculationAutoCompleteHelper$_onEditorFocus() {
        this._updateFunctionHelp();
    },
    
    _onEditorBlur: function tab_CalculationAutoCompleteHelper$_onEditorBlur() {
        this._currentRequestDocState = null;
        this._closeFunctionHelp();
    },
    
    _onCursorChange: function tab_CalculationAutoCompleteHelper$_onCursorChange() {
        this._updateFunctionHelp();
    },
    
    _onBodyFirstTouch: function tab_CalculationAutoCompleteHelper$_onBodyFirstTouch(e, cancelCallback) {
        this.close(false);
    },
    
    _getCompletionsObject: function tab_CalculationAutoCompleteHelper$_getCompletionsObject() {
        var o = this._editor.state.completionActive;
        return o;
    },
    
    _createHintCompletionItem: function tab_CalculationAutoCompleteHelper$_createHintCompletionItem(item, from, to, separator, header) {
        var completion = {};
        completion.from = from;
        completion.to = to;
        completion.text = item.get_replaceText();
        completion.displayText = (String.isNullOrEmpty(item.get_styledLabel())) ? item.get_label() : item.get_styledLabel();
        completion.caretIndex = item.get_caretIndex();
        completion.hint = ss.Delegate.create(this, this._onHintPicked);
        var template;
        switch (item.get_itemType()) {
            case 'field':
                template = new tab._autoCompleteFieldItemTemplate(completion.displayText, item.get_iconResource());
                break;
            case 'func':
                template = new tab._autoCompleteFunctionItemTemplate(completion.displayText);
                break;
            default:
                ss.Debug.assert(false, 'invalid autocomplete item type: ' + item.get_itemType());
                return null;
        }
        template.addSeparator(separator);
        template.addHeader(header);
        template.setTooltip(item.get_tooltip());
        completion.render = ss.Delegate.create(this, function(element, self, data) {
            template.appendTo(element);
            if (tsConfig.is_mobile) {
                var handler = spiff.TableauClickHandler.target(element).onClick(ss.Delegate.create(this, function(e) {
                    e.preventDefault();
                    var comp = this._getCompletionsObject();
                    if (comp != null && comp.active() && comp.widget != null) {
                        var index = (element.hintId || 0);
                        comp.widget.changeActive(index, true);
                        comp.widget.pick();
                    }
                }));
                this._touchHandlers.add(handler);
            }
        });
        return completion;
    },
    
    _onHintSelected: function tab_CalculationAutoCompleteHelper$_onHintSelected(completion, itemElement) {
        tab.Log.get(this).debug("selected '" + completion.text + "'");
    },
    
    _onHintPicked: function tab_CalculationAutoCompleteHelper$_onHintPicked(cm, self, completion) {
        cm.replaceRange(completion.text, completion.from, completion.to, 'complete');
        cm.setCursor(cm.posFromIndex(completion.caretIndex));
    },
    
    getHints: function tab_CalculationAutoCompleteHelper$getHints(cm, options) {
        if (this._currentRequestDocState == null || this._autoCompleteDataModel == null || this._autoCompleteDataModel.get_items().length < 1) {
            return null;
        }
        var hints = {};
        hints.from = cm.posFromIndex(this._autoCompleteDataModel.get_startIndex());
        hints.to = cm.posFromIndex(this._autoCompleteDataModel.get_endIndex());
        CodeMirror.on(hints, 'select', ss.Delegate.create(this, this._onHintSelected));
        CodeMirror.on(hints, 'shown', ss.Delegate.create(this, function() {
            this.set_isShowingMenu(true);
        }));
        CodeMirror.on(hints, 'close', ss.Delegate.create(this, function() {
            this.set_isShowingMenu(false);
            this._touchHandlers.dispose();
        }));
        var hintList = [];
        var separator = false;
        var header = null;
        var $enum1 = ss.IEnumerator.getEnumerator(this._autoCompleteDataModel.get_items());
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            switch (item.get_itemType()) {
                case 'separator':
                    separator = true;
                    break;
                case 'header':
                    header = item.get_label();
                    break;
                default:
                    hintList.add(this._createHintCompletionItem(item, hints.from, hints.to, separator, header));
                    separator = false;
                    header = null;
                    break;
            }
        }
        hints.list = hintList;
        return hints;
    },
    
    _requestAutoComplete: function tab_CalculationAutoCompleteHelper$_requestAutoComplete(wantHints) {
        this._accumulatedWantHints = this._accumulatedWantHints || wantHints;
        this._debounceAutoCompleteRequest();
    },
    
    _requestAutoCompleteImmediate: function tab_CalculationAutoCompleteHelper$_requestAutoCompleteImmediate() {
        if (this._disposed) {
            return;
        }
        ss.Debug.assert(this._autoCompleteOptions != null, 'autocomplete not initialized');
        var docState = new tab._autoCompleteDocumentState(this._editor);
        var wantHints = this._accumulatedWantHints;
        this._accumulatedWantHints = false;
        if (!docState.get_hasContext()) {
            this._currentRequestDocState = null;
            return;
        }
        if (this._currentRequestDocState != null && docState.pos === this._currentRequestDocState.pos && docState.context === this._currentRequestDocState.context) {
            return;
        }
        this._currentRequestDocState = docState;
        this._calcViewModel.requestAutoCompleteMenu(this._currentRequestDocState.context, docState.pos).done(ss.Delegate.create(this, function(model) {
            if (!this._disposed && this._currentRequestDocState != null && this._currentRequestDocState.context === model.get_calculation()) {
                this._autoCompleteDataModel = model;
                this._update(wantHints);
            }
        })).fail(ss.Delegate.create(this, function(model) {
            tab.Log.get(this).debug('failed getting autocomplete');
        }));
    },
    
    isEqualOrAncestorOf: function tab_CalculationAutoCompleteHelper$isEqualOrAncestorOf(testElement) {
        return tab.DomUtil.isEqualOrAncestorOf(this.get__autoCompleteElement(), testElement) || tab.DomUtil.isEqualOrAncestorOf(this.get__toolTipElement(), testElement);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._autoCompleteDocumentState

tab._autoCompleteDocumentState = function tab__autoCompleteDocumentState(cm) {
    this.context = cm.getValue();
    this.pos = cm.indexFromPos(cm.getCursor());
}
tab._autoCompleteDocumentState.prototype = {
    context: null,
    pos: 0,
    
    get_hasContext: function tab__autoCompleteDocumentState$get_hasContext() {
        return this.context != null && this.context.length > 0;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._autoCompleteItemTemplate

tab._autoCompleteItemTemplate = function tab__autoCompleteItemTemplate() {
    tab._autoCompleteItemTemplate.initializeBase(this, [ $(tab._autoCompleteItemTemplate._itemTemplate$1) ]);
    this.item = this.getElementBySelector('.autocomplete_item');
    this.icon = this.getElementBySelector('.schema-field-icon');
}
tab._autoCompleteItemTemplate.prototype = {
    icon: null,
    item: null,
    
    setText: function tab__autoCompleteItemTemplate$setText(text) {
        $('<span>' + text + '</span>').appendTo(this.item);
    },
    
    addSeparator: function tab__autoCompleteItemTemplate$addSeparator(separator) {
        if (separator) {
            $("<div class='autocomplete_separator'></div>").insertBefore(this.item);
        }
    },
    
    addHeader: function tab__autoCompleteItemTemplate$addHeader(text) {
        if (!String.isNullOrEmpty(text)) {
            var header = $("<div class='autocomplete_header'></div>");
            header.text(text);
            header.insertBefore(this.item);
        }
    },
    
    setTooltip: function tab__autoCompleteItemTemplate$setTooltip(tooltip) {
        if (!String.isNullOrEmpty(tooltip)) {
            this.item.attr('title', tooltip);
        }
    },
    
    appendTo: function tab__autoCompleteItemTemplate$appendTo(e) {
        this.get_domRoot().appendTo(e);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._autoCompleteFieldItemTemplate

tab._autoCompleteFieldItemTemplate = function tab__autoCompleteFieldItemTemplate(text, iconRes) {
    tab._autoCompleteFieldItemTemplate.initializeBase(this);
    this.item.addClass('autocomplete_field');
    this.setText(text);
    if (iconRes.length > 0) {
        this.icon.addClass(String.format('tab-schema-{0}-icon', iconRes));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._autoCompleteFunctionItemTemplate

tab._autoCompleteFunctionItemTemplate = function tab__autoCompleteFunctionItemTemplate(text) {
    tab._autoCompleteFunctionItemTemplate.initializeBase(this);
    this.item.addClass('autocomplete_func');
    this.setText(text);
    this.icon.addClass('autocomplete-menu-function');
}


////////////////////////////////////////////////////////////////////////////////
// tab._functionHelpTooltipTemplate

tab._functionHelpTooltipTemplate = function tab__functionHelpTooltipTemplate() {
    tab._functionHelpTooltipTemplate.initializeBase(this);
    this.get_domRoot().addClass('tabCalcFunctionHelp');
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationEditorView

tab.CalculationEditorView = function tab_CalculationEditorView(viewModel, template) {
    this._lastMarkers$2 = [];
    tab.CalculationEditorView.initializeBase(this, [ viewModel, template ]);
    this._dom$2 = this.get_template();
    this.calcViewModel = viewModel;
    this.calcViewModel.add_calculationUpdated(ss.Delegate.create(this, this.updateDomFromModel));
    this.calcViewModel.add_calculationEdited(ss.Delegate.create(this, this.onCalculationEdited));
    this.calcViewModel.add_dropStateChanged(ss.Delegate.create(this, this.handleDropStateChanged));
    this.calcViewModel.add_calculationCanceled(ss.Delegate.create(this, this.onCalculationCanceled));
    this.calcViewModel.add_dropCommandCompleted(ss.Delegate.create(this, this._setCursorAndFocus$2));
    this.calcViewModel.add_insertFunctionCompleted(ss.Delegate.create(this, this._setTextAndCursor$2));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.calcViewModel.remove_calculationUpdated(ss.Delegate.create(this, this.updateDomFromModel));
        this.calcViewModel.remove_calculationEdited(ss.Delegate.create(this, this.onCalculationEdited));
        this.calcViewModel.remove_dropStateChanged(ss.Delegate.create(this, this.handleDropStateChanged));
        this.calcViewModel.remove_calculationCanceled(ss.Delegate.create(this, this.onCalculationCanceled));
        this.calcViewModel.remove_dropCommandCompleted(ss.Delegate.create(this, this._setCursorAndFocus$2));
        this.calcViewModel.remove_insertFunctionCompleted(ss.Delegate.create(this, this._setTextAndCursor$2));
    })));
    spiff.DragDropManager.attachDropTarget(this._dom$2.get_dropTarget(), this);
    spiff.DragDropManager.attachDragSource(this._dom$2.get_dragSource(), this);
}
tab.CalculationEditorView.markStyleAndErrorForTokens = function tab_CalculationEditorView$markStyleAndErrorForTokens(editor, vm) {
    var formula = vm.get_formula();
    var opts = {};
    var newlineOffset = 0;
    var markers = [];
    var $enum1 = ss.IEnumerator.getEnumerator(vm.get_tokens());
    while ($enum1.moveNext()) {
        var token = $enum1.current;
        var start = editor.posFromIndex(token.tokenPositionForStyle + newlineOffset);
        var $enum2 = ss.IEnumerator.getEnumerator(vm.get_errors());
        while ($enum2.moveNext()) {
            var err = $enum2.current;
            if ((err.startPositionForError + err.lengthOfCalcOfError) <= token.tokenPositionForStyle || err.startPositionForError >= (token.tokenPositionForStyle + token.tokenLengthForStyle)) {
                continue;
            }
            var errStart = editor.posFromIndex(err.startPositionForError + newlineOffset);
            var errEnd = editor.posFromIndex(err.startPositionForError + err.lengthOfCalcOfError + newlineOffset);
            var errOpts = {};
            errOpts.className = tab.CalculationEditorView._tokenError$2;
            errOpts.title = err.errorMessage;
            markers.add(editor.markText(errStart, errEnd, errOpts));
        }
        newlineOffset -= tab.CalculationEditorView.getNewLineOffset(formula.substr(token.tokenPositionForStyle, token.tokenLengthForStyle));
        var end = editor.posFromIndex(token.tokenPositionForStyle + token.tokenLengthForStyle + newlineOffset);
        var str = editor.getRange(start, end);
        var numLeadingSpaces = str.length - str.trimStart().length;
        if (numLeadingSpaces > 0) {
            opts.className = tab.CalculationEditorView._tokenEmpty$2;
            var emptyEnd = editor.posFromIndex(token.tokenPositionForStyle + numLeadingSpaces + newlineOffset);
            markers.add(editor.markText(start, emptyEnd, opts));
            start = emptyEnd;
        }
        if (numLeadingSpaces < str.length) {
            opts.className = 'tabTok_' + token.calculationStyle;
            markers.add(editor.markText(start, end, opts));
            var feedbackTypeName = tab.CalculationEditorView._getFeedbackNameForToken$2(token, str);
            if (ss.isValue(feedbackTypeName)) {
                opts.className = feedbackTypeName;
                markers.add(editor.markText(start, end, opts));
            }
        }
    }
    return markers;
}
tab.CalculationEditorView.getNewLineOffset = function tab_CalculationEditorView$getNewLineOffset(s, pos) {
    var lineCount = 0;
    var index = 0;
    var offset = 0;
    var isWithinLineLimit = function(line) {
        return !ss.isValue(pos) || line < pos.line;
    };
    while (isWithinLineLimit(lineCount) && (index = s.indexOf('\n', index)) >= 0) {
        if (index >= 1 && s.charAt(index - 1) === '\r') {
            offset++;
        }
        lineCount++;
        index++;
    }
    return offset;
}
tab.CalculationEditorView._determineLineSeparator$2 = function tab_CalculationEditorView$_determineLineSeparator$2(s) {
    return (s.indexOf('\r\n') >= 0) ? '\r\n' : '\n';
}
tab.CalculationEditorView._getFeedbackNameForToken$2 = function tab_CalculationEditorView$_getFeedbackNameForToken$2(token, str) {
    if (str.length <= 1) {
        return null;
    }
    switch (token.calculationStyle) {
        case 'style_prim_field':
        case 'style_sec_field':
        case 'style_invalid_field':
        case 'style_param':
            return 'tabTok_replace';
        case 'style_remote_func':
        case 'style_local_func':
        case 'style_comment':
        case 'style_default':
            return 'tabTok_noreplace';
    }
    return null;
}
tab.CalculationEditorView.getTextSelectionUnderMouse = function tab_CalculationEditorView$getTextSelectionUnderMouse(editor, e) {
    var pageCoords = {};
    pageCoords.left = e.pageX;
    pageCoords.top = e.pageY;
    var pos = editor.coordsChar(pageCoords);
    var charIndex = editor.indexFromPos(pos);
    return tab.CalculationEditorView.getSelectionAtIndex(editor, charIndex);
}
tab.CalculationEditorView.getSelectionAtIndex = function tab_CalculationEditorView$getSelectionAtIndex(editor, charIndex) {
    var selections = editor.listSelections();
    for (var i = 0, len = selections.length; i < len; i++) {
        var selectionPresModel = tab.CalculationEditorView._getSelectionPresModel$2(editor, selections[i]);
        if (ss.isValue(selectionPresModel) && charIndex > selectionPresModel.calcEditorTextSelectionStartPos && charIndex < selectionPresModel.calcEditorTextSelectionEndPos) {
            return selectionPresModel;
        }
    }
    return null;
}
tab.CalculationEditorView.getSelection = function tab_CalculationEditorView$getSelection(editor) {
    var selections = editor.listSelections();
    if (ss.isValue(selections) && selections.length > 0) {
        return tab.CalculationEditorView._getSelectionPresModel$2(editor, selections[0]);
    }
    return null;
}
tab.CalculationEditorView._getSelectionPresModel$2 = function tab_CalculationEditorView$_getSelectionPresModel$2(editor, range) {
    if (ss.isNullOrUndefined(range) || ss.isNullOrUndefined(editor)) {
        return null;
    }
    var anchorIndex = editor.indexFromPos(range.anchor);
    var headIndex = editor.indexFromPos(range.head);
    if (anchorIndex === headIndex) {
        return null;
    }
    var selectionPresModel = {};
    selectionPresModel.calcEditorTextSelectionStartPos = Math.min(anchorIndex, headIndex);
    selectionPresModel.calcEditorTextSelectionEndPos = Math.max(anchorIndex, headIndex);
    return selectionPresModel;
}
tab.CalculationEditorView.prototype = {
    calcViewModel: null,
    _dom$2: null,
    _editor$2: null,
    _pillDragFeedback$2: null,
    _lineSeparator$2: '\r\n',
    _autoCompleteHelper$2: null,
    
    get_hasEditor: function tab_CalculationEditorView$get_hasEditor() {
        return ss.isValue(this._editor$2);
    },
    
    get_editor: function tab_CalculationEditorView$get_editor() {
        return this._editor$2;
    },
    
    get_dom: function tab_CalculationEditorView$get_dom() {
        return this._dom$2;
    },
    
    get_pillViewModel: function tab_CalculationEditorView$get_pillViewModel() {
        return null;
    },
    set_pillViewModel: function tab_CalculationEditorView$set_pillViewModel(value) {
        return value;
    },
    
    get_feedbackType: function tab_CalculationEditorView$get_feedbackType() {
        return 'dropfeedbackmousemove';
    },
    
    get_pillDragFeedback: function tab_CalculationEditorView$get_pillDragFeedback() {
        return this._pillDragFeedback$2;
    },
    
    get_autoCompleteHelper: function tab_CalculationEditorView$get_autoCompleteHelper() {
        return this._autoCompleteHelper$2;
    },
    
    createCodeMirrorOptions: function tab_CalculationEditorView$createCodeMirrorOptions() {
        var options = {};
        options.indentUnit = 2;
        options.indentWithTabs = false;
        options.lineNumbers = false;
        options.lineWrapping = false;
        options.smartIndent = false;
        options.dragDrop = true;
        options.extraKeys = {};
        options.extraKeys[(tab.BrowserSupport.get_isMac()) ? 'Cmd-Enter' : 'Ctrl-Enter'] = ss.Delegate.create(this, this._onApplyCalcKey$2);
        this.addExtraKeys(options.extraKeys);
        return options;
    },
    
    addExtraKeys: function tab_CalculationEditorView$addExtraKeys(extraKeys) {
    },
    
    initDom: function tab_CalculationEditorView$initDom() {
        if (ss.isValue(this._editor$2)) {
            return;
        }
        tab.Log.get(this).debug('InitDom');
        this._editor$2 = CodeMirror(this.get_dom().get_formulaEditorHolder()[0], this.createCodeMirrorOptions());
        this._editor$2.on('change', ss.Delegate.create(this, this._onEditorChange$2));
        this._editor$2.on('dragstart', ss.Delegate.create(this, this.onDragStart));
        this._pillDragFeedback$2 = new tab.CalculationEditorDragFeedback(this._editor$2);
        this._autoCompleteHelper$2 = new tab.CalculationAutoCompleteHelper(this._editor$2, this.calcViewModel);
        this.disposables.add(this._autoCompleteHelper$2);
        if (this.calcViewModel.get_hasCalculation()) {
            this.onCalculationEdited();
        }
    },
    
    onAddedToDom: function tab_CalculationEditorView$onAddedToDom() {
        tab.CalculationEditorView.callBaseMethod(this, 'onAddedToDom');
        if (this.get_hasEditor()) {
            this._editor$2.refresh();
        }
    },
    
    focusEditor: function tab_CalculationEditorView$focusEditor() {
        if (this._editor$2.hasFocus()) {
            return;
        }
        tab.Log.get(this).debug('FocusEditor');
        this._editor$2.focus();
    },
    
    _onApplyCalcKey$2: function tab_CalculationEditorView$_onApplyCalcKey$2() {
        this.calcViewModel.applyCalculation(this.get_pillViewModel(), false);
    },
    
    onDragStart: function tab_CalculationEditorView$onDragStart(cm, e) {
        if (tab.BrowserSupport.get_isIE() && tab.BrowserSupport.get_browserVersion() < 9) {
            e.returnValue = false;
        }
        else {
            e.preventDefault();
        }
    },
    
    updateDomFromModel: function tab_CalculationEditorView$updateDomFromModel() {
        tab.Log.get(this).debug('Updating calculation from VM');
        this._lineSeparator$2 = tab.CalculationEditorView._determineLineSeparator$2(this.calcViewModel.get_formula());
        var formulaChanged = this._editor$2.getValue(this._lineSeparator$2) !== this.calcViewModel.get_formula();
        if (formulaChanged) {
            tab.Log.get(this).debug('Formula changed');
            var pos = this._editor$2.getCursor();
            this._editor$2.setValue(this.calcViewModel.get_formula());
            this._editor$2.setCursor(pos);
        }
        var $enum1 = ss.IEnumerator.getEnumerator(this._lastMarkers$2);
        while ($enum1.moveNext()) {
            var m = $enum1.current;
            m.clear();
        }
        this._lastMarkers$2 = tab.CalculationEditorView.markStyleAndErrorForTokens(this._editor$2, this.calcViewModel);
    },
    
    _setCursorAndFocus$2: function tab_CalculationEditorView$_setCursorAndFocus$2(cursorIndex) {
        if (cursorIndex >= 0) {
            var newlineOffset = tab.CalculationEditorView.getNewLineOffset(this.calcViewModel.get_formula().substr(0, cursorIndex));
            var pos = this._editor$2.posFromIndex(cursorIndex - newlineOffset);
            this._editor$2.setCursor(pos);
            this.focusEditor();
        }
    },
    
    _setTextAndCursor$2: function tab_CalculationEditorView$_setTextAndCursor$2(text, cursorIndex) {
        this.get_editor().setValue(text);
        this._setCursorAndFocus$2(cursorIndex);
    },
    
    onCalculationCanceled: function tab_CalculationEditorView$onCalculationCanceled() {
        if (ss.isValue(this.get_autoCompleteHelper())) {
            this.get_autoCompleteHelper().close(true);
        }
    },
    
    onCalculationEdited: function tab_CalculationEditorView$onCalculationEdited() {
        tab.Log.get(this).debug('Editing calculation');
        this.updateDomFromModel();
        this._editor$2.clearHistory();
        this._editor$2.execCommand('goDocEnd');
    },
    
    _onEditorChange$2: function tab_CalculationEditorView$_onEditorChange$2(cm, change) {
        this.calcViewModel.set_formula(cm.getValue(this._lineSeparator$2));
    },
    
    handleDropStateChanged: function tab_CalculationEditorView$handleDropStateChanged(state) {
        this.get_dom().get_dropInviteBorder().toggleClass('tabDropInvited', state === 1);
        this._pillDragFeedback$2.handleDropStateChanged(state);
    },
    
    dragOver: function tab_CalculationEditorView$dragOver(d) {
        if (!tab.CalculationEditorViewModel.canAccept(d)) {
            return null;
        }
        this._pillDragFeedback$2.dragOver(d);
        return this;
    },
    
    dragExit: function tab_CalculationEditorView$dragExit(d) {
        this._pillDragFeedback$2.dragExit(d);
    },
    
    acceptDrop: function tab_CalculationEditorView$acceptDrop(d) {
        tab.Log.get(this).debug('Attempting to accept drop: %o' + d);
        this._pillDragFeedback$2.dragExit(d);
        var index = this._pillDragFeedback$2.get_cursorIndex() + tab.CalculationEditorView.getNewLineOffset(this.calcViewModel.get_formula(), this._pillDragFeedback$2.get_cursorPosition());
        return this.calcViewModel.handleDrop(d, index, tab.CalculationEditorView.getSelectionAtIndex(this._editor$2, index));
    },
    
    getDropTarget: function tab_CalculationEditorView$getDropTarget(hit) {
        return this;
    },
    
    startDrag: function tab_CalculationEditorView$startDrag(e) {
        var selection = tab.CalculationEditorView.getTextSelectionUnderMouse(this._editor$2, e);
        if (ss.isNullOrUndefined(selection)) {
            return null;
        }
        var start = this._editor$2.posFromIndex(selection.calcEditorTextSelectionStartPos);
        var end = this._editor$2.posFromIndex(selection.calcEditorTextSelectionEndPos);
        return this.calcViewModel.getDragInstanceForText(this._editor$2.getRange(start, end));
    },
    
    isEqualOrAncestorOf: function tab_CalculationEditorView$isEqualOrAncestorOf(testElement) {
        if (tab.DomUtil.isEqualOrAncestorOf(this.get_element()[0], testElement)) {
            return true;
        }
        if (ss.isValue(this.get_autoCompleteHelper())) {
            return this.get_autoCompleteHelper().isEqualOrAncestorOf(testElement);
        }
        return false;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationEditorTemplate

tab.CalculationEditorTemplate = function tab_CalculationEditorTemplate(root) {
    tab.CalculationEditorTemplate.initializeBase(this, [ root ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.CardContentView

tab.CardContentView = function tab_CardContentView(viewModel, template) {
    tab.CardContentView.initializeBase(this, [ viewModel, template ]);
}
tab.CardContentView.prototype = {
    
    add_scrollContentChanged: function tab_CardContentView$add_scrollContentChanged(value) {
        this.__scrollContentChanged$2 = ss.Delegate.combine(this.__scrollContentChanged$2, value);
    },
    remove_scrollContentChanged: function tab_CardContentView$remove_scrollContentChanged(value) {
        this.__scrollContentChanged$2 = ss.Delegate.remove(this.__scrollContentChanged$2, value);
    },
    
    __scrollContentChanged$2: null,
    
    raiseScrollContentChanged: function tab_CardContentView$raiseScrollContentChanged() {
        if (ss.isValue(this.__scrollContentChanged$2)) {
            this.__scrollContentChanged$2();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CardView

tab.CardView = function tab_CardView(viewModel, t) {
    tab.CardView.initializeBase(this, [ viewModel, t ]);
    this.dom = t;
    this._viewModel$2 = viewModel;
    this._viewModel$2.add_cardChanged(ss.Delegate.create(this, this._initFromModel$2));
    this._viewModel$2.add_collapsedChanged(ss.Delegate.create(this, this._updateCollapsed$2));
    this._viewModel$2.add_contentDropStateChanged(ss.Delegate.create(this, this._dropStateChanged$2));
    this.disposables.add(spiff.ClickHandler.targetAndClick(this.dom.expandoTarget, ss.Delegate.create(this, this._handleExpandoClicked$2)));
    this._initFromModel$2(this._viewModel$2);
    if (Type.getInstanceType(this._viewModel$2.get_content()) === tab.ShelfViewModel) {
        spiff.DragDropManager.attachDropTarget(this.dom.dropTarget, this._viewModel$2.get_content());
    }
    this.dom.get_domRoot().addClass('tabAuthCardType-' + viewModel.get_content().get_name());
}
tab.CardView.prototype = {
    dom: null,
    _viewModel$2: null,
    _contentView$2: null,
    
    add_cardContentChanged: function tab_CardView$add_cardContentChanged(value) {
        this.__cardContentChanged$2 = ss.Delegate.combine(this.__cardContentChanged$2, value);
    },
    remove_cardContentChanged: function tab_CardView$remove_cardContentChanged(value) {
        this.__cardContentChanged$2 = ss.Delegate.remove(this.__cardContentChanged$2, value);
    },
    
    __cardContentChanged$2: null,
    
    get_contentView: function tab_CardView$get_contentView() {
        return this._contentView$2;
    },
    
    dispose: function tab_CardView$dispose() {
        if (ss.isValue(this._viewModel$2)) {
            this._viewModel$2.remove_cardChanged(ss.Delegate.create(this, this._initFromModel$2));
            this._viewModel$2.remove_collapsedChanged(ss.Delegate.create(this, this._updateCollapsed$2));
            this._viewModel$2.remove_contentDropStateChanged(ss.Delegate.create(this, this._dropStateChanged$2));
        }
        tab.CardView.callBaseMethod(this, 'dispose');
    },
    
    onAddedToDom: function tab_CardView$onAddedToDom() {
        if (ss.isValue(this._contentView$2) && Type.canCast(this._contentView$2, spiff.BaseView)) {
            (this._contentView$2).onAddedToDom();
        }
        tab.CardView.callBaseMethod(this, 'onAddedToDom');
    },
    
    _dropStateChanged$2: function tab_CardView$_dropStateChanged$2(arg) {
        var invited = false;
        var notValid = false;
        switch (arg) {
            case 1:
                invited = true;
                break;
            case 2:
                notValid = true;
                break;
        }
        this.get_element().toggleClass('tabAuthCardDropInvited', invited);
        this.get_element().toggleClass('tabAuthCardDropNotValid', notValid);
    },
    
    _updateCollapsed$2: function tab_CardView$_updateCollapsed$2(vm) {
        if (vm.get_isCollapsed()) {
            this.dom.content.slideUp();
        }
        else {
            this.dom.content.slideDown();
        }
        this._updateExpandoState$2();
        this._updateTitle$2();
    },
    
    _handleExpandoClicked$2: function tab_CardView$_handleExpandoClicked$2(e) {
        this._viewModel$2.toggleExpanded();
    },
    
    _updateExpandoState$2: function tab_CardView$_updateExpandoState$2() {
        this.dom.expando.toggleClass('Closed', this._viewModel$2.get_isCollapsed());
        this.dom.expando.toggleClass('Open', !this._viewModel$2.get_isCollapsed());
    },
    
    _updateTitle$2: function tab_CardView$_updateTitle$2() {
        var title = '';
        if (ss.isValue(this._viewModel$2.get_content())) {
            title = this._viewModel$2.get_content().get_title();
            if (this._viewModel$2.get_isCollapsed() && !tab.MiscUtil.isNullOrEmpty(this._viewModel$2.get_content().get_collapsedTitleDetail())) {
                title = tab.Strings.AuthCardCollapsedTitle(title, this._viewModel$2.get_content().get_collapsedTitleDetail());
            }
        }
        this.dom.label.html(title);
    },
    
    _updateIcon$2: function tab_CardView$_updateIcon$2() {
        if (this._viewModel$2.get_hasIcon()) {
            this.dom.icon.addClass(this._viewModel$2.get_iconClass());
        }
    },
    
    _initFromModel$2: function tab_CardView$_initFromModel$2(vm) {
        if (this._viewModel$2.get_isVisible()) {
            this.dom.get_domRoot().show();
        }
        else {
            this.dom.get_domRoot().hide();
        }
        var isVertical = !vm.get_orientation();
        this.dom.get_domRoot().toggleClass('tabAuthCardVertical', isVertical);
        this.dom.get_domRoot().toggleClass('tabAuthCardHorizontal', !isVertical);
        this._updateExpandoState$2();
        if (this._viewModel$2.get_isCollapsible()) {
            this.dom.expando.show();
        }
        else {
            this.dom.expando.hide();
        }
        this._updateIcon$2();
        this._updateTitle$2();
        var $enum1 = ss.IEnumerator.getEnumerator(spiff.Widget.getWidgets(this.dom.content.children()));
        while ($enum1.moveNext()) {
            var w = $enum1.current;
            w.dispose();
        }
        if (ss.isValue(vm.get_content())) {
            if (ss.isValue(this._contentView$2)) {
                (this._contentView$2).dispose();
            }
            this._contentView$2 = spiff.ObjectRegistry.newView(vm.get_content().get_viewType(), vm.get_content().get_viewModel());
            this.dom.content.append(this._contentView$2.get_element());
            if (this.get_addedToDom() && Type.canCast(this._contentView$2, spiff.Widget)) {
                (this._contentView$2).onAddedToDom();
            }
            if (ss.isValue(this.__cardContentChanged$2)) {
                this.__cardContentChanged$2(this._contentView$2);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CardViewTemplate

tab.CardViewTemplate = function tab_CardViewTemplate() {
    tab.CardViewTemplate.initializeBase(this, [ $(tab.CardViewTemplate.template) ]);
    this.icon = this.getElementBySelector('.tabAuthCardIcon');
    this.label = this.getElementBySelector('.tabAuthCardLabel');
    this.content = this.getElementBySelector('.tabAuthCardContent');
    this.expando = this.getElementBySelector('.tabAuthCardExpando');
    this.expandoTarget = this.getElementBySelector('.tabAuthCardExpandoTarget');
    this.dropTarget = this.get_domRoot();
}
tab.CardViewTemplate.prototype = {
    icon: null,
    label: null,
    content: null,
    expando: null,
    expandoTarget: null,
    dropTarget: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationDependencyView

tab.CalculationDependencyView = function tab_CalculationDependencyView(viewModel) {
    tab.CalculationDependencyView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabCalcDependencyContent'>\n            <div class='tabCalcDependencyPrefix'></div>\n            <div class='tabCalcDependencyInfo'></div>\n        </div>") ]);
    this.get_template().getElementBySelector('.tabCalcDependencyPrefix').text(tab.Strings.CalcEditorDependenciesPrefix);
    this.get_template().getElementBySelector('.tabCalcDependencyInfo').text(viewModel.get_dependencies());
}
tab.CalculationDependencyView.prototype = {
    
    get_dependencyViewModel: function tab_CalculationDependencyView$get_dependencyViewModel() {
        return this.get_viewModel();
    },
    
    onAddedToDom: function tab_CalculationDependencyView$onAddedToDom() {
        tab.CalculationDependencyView.callBaseMethod(this, 'onAddedToDom');
        this.get_element().parents('.tabUberPopup').css('max-width', this.get_dependencyViewModel().get_maxWidth() + 'px').addClass('tabCalcEditorDependsPopup');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LeftPanelView

tab.LeftPanelView = function tab_LeftPanelView(dataSchemaViewModel, analyticsPaneViewModel) {
    this.leftAreaMinWidth = (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.collapseSidePane)) ? 160 : 115;
    this._disposables$2 = new tab.DisposableHolder();
    tab.LeftPanelView.initializeBase(this, [ dataSchemaViewModel, new tab.LeftPanelTemplate() ]);
    this.dom = this.get_template();
    this.dataSchema = spiff.ObjectRegistry.newView(tab.DataSchemaView, dataSchemaViewModel);
    if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
        this.analyticsPane = spiff.ObjectRegistry.newView(tab.AnalyticsPaneView, analyticsPaneViewModel);
    }
}
tab.LeftPanelView.prototype = {
    leftAreaDefaultWidth: 170,
    leftAreaResizerWidth: 2,
    leftAreaMaxWidth: 500,
    dataSchema: null,
    analyticsPane: null,
    dom: null,
    
    get_dataSchemaView: function tab_LeftPanelView$get_dataSchemaView() {
        return this.dataSchema;
    },
    
    get_analyticsPaneView: function tab_LeftPanelView$get_analyticsPaneView() {
        return this.analyticsPane;
    },
    
    get_width: function tab_LeftPanelView$get_width() {
        return this.get_dataSchemaView().get_width();
    },
    set_width: function tab_LeftPanelView$set_width(value) {
        this.get_dataSchemaView().set_width(value);
        return value;
    },
    
    onAddedToDom: function tab_LeftPanelView$onAddedToDom() {
        tab.LeftPanelView.callBaseMethod(this, 'onAddedToDom');
        if (ss.isValue(this.get_dataSchemaView())) {
            this.get_dataSchemaView().onAddedToDom();
        }
        if (ss.isValue(this.get_analyticsPaneView())) {
            this.get_analyticsPaneView().onAddedToDom();
        }
    },
    
    dispose: function tab_LeftPanelView$dispose() {
        this._disposables$2.dispose();
        if (ss.isValue(this.get_dataSchemaView())) {
            this.get_dataSchemaView().dispose();
        }
        if (tsConfig.features['AnalyticsPane'] && ss.isValue(this.get_analyticsPaneView()) && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
            this.get_analyticsPaneView().dispose();
        }
        this.dom.dispose();
        tab.LeftPanelView.callBaseMethod(this, 'dispose');
    },
    
    resizeEnd: function tab_LeftPanelView$resizeEnd() {
        (this.get_dataSchemaView().get_viewModel()).set_specifiedWidth(this.get_dataSchemaView().get_width());
    },
    
    getMaxWidth: function tab_LeftPanelView$getMaxWidth() {
        return Math.min(this.get_dataSchemaView().get_maxDesiredWidth(), this.leftAreaMaxWidth);
    },
    
    getNewWidth: function tab_LeftPanelView$getNewWidth(maxWidth) {
        return (this.get_dataSchemaView().get_width() + this.leftAreaResizerWidth < maxWidth) ? maxWidth : this.leftAreaDefaultWidth;
    },
    
    getBracketWidth: function tab_LeftPanelView$getBracketWidth(width) {
        return Math.max(this.leftAreaMinWidth, Math.min(this.leftAreaMaxWidth, width));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LeftPanelTemplate

tab.LeftPanelTemplate = function tab_LeftPanelTemplate() {
    tab.LeftPanelTemplate.initializeBase(this, [ $("\n            <div class='tabAuthLeftPanel'>\n            </div>") ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorOptionView

tab.ColorOptionView = function tab_ColorOptionView(viewModel, template) {
    tab.ColorOptionView.initializeBase(this, [ viewModel, template ]);
    this.colorOptionViewModel = viewModel;
    this.colorOptionViewModel.add_commitChanges(ss.Delegate.create(this, this.commitChangesInView));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.colorOptionViewModel.remove_commitChanges(ss.Delegate.create(this, this.commitChangesInView));
    })));
}
tab.ColorOptionView.prototype = {
    colorOptionViewModel: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPickerView

tab.ColorPickerView = function tab_ColorPickerView(viewModel, t) {
    tab.ColorPickerView.initializeBase(this, [ viewModel, t ]);
    this.dom = t;
    this.colorPickerViewModel = viewModel;
}
tab.ColorPickerView.prototype = {
    dom: null,
    colorPickerViewModel: null,
    _colorTransparencyControlView$3: null,
    _linePatternPickerView$3: null,
    _strokeWidthPickerView$3: null,
    
    get_colorTransparencyControlView: function tab_ColorPickerView$get_colorTransparencyControlView() {
        return this._colorTransparencyControlView$3;
    },
    set_colorTransparencyControlView: function tab_ColorPickerView$set_colorTransparencyControlView(value) {
        this._colorTransparencyControlView$3 = value;
        return value;
    },
    
    get_linePatternPickerView: function tab_ColorPickerView$get_linePatternPickerView() {
        return this._linePatternPickerView$3;
    },
    set_linePatternPickerView: function tab_ColorPickerView$set_linePatternPickerView(value) {
        this._linePatternPickerView$3 = value;
        return value;
    },
    
    get_strokeWidthPickerView: function tab_ColorPickerView$get_strokeWidthPickerView() {
        return this._strokeWidthPickerView$3;
    },
    set_strokeWidthPickerView: function tab_ColorPickerView$set_strokeWidthPickerView(value) {
        this._strokeWidthPickerView$3 = value;
        return value;
    },
    
    onViewModelPropertyChanged: function tab_ColorPickerView$onViewModelPropertyChanged(sender, e) {
        this.updateContent();
    },
    
    updateContent: function tab_ColorPickerView$updateContent() {
        this.dom.removeAllColors();
        this._createColorPicker$3();
    },
    
    _createColorPicker$3: function tab_ColorPickerView$_createColorPicker$3() {
        this._buildColorItem$3(this.colorPickerViewModel.get_blackAndWhiteColors()[0], $('<span/>').addClass('tabColorPickerGroup').appendTo(this.dom.black));
        this._buildColorGroups$3(this.colorPickerViewModel.get_darkGrayColors(), this.dom.darkGrays, this.colorPickerViewModel.get_darkGrayColors().length);
        this._buildColorItem$3(this.colorPickerViewModel.get_blackAndWhiteColors()[1], $('<span/>').addClass('tabColorPickerGroup').appendTo(this.dom.white));
        this._buildColorGroups$3(this.colorPickerViewModel.get_lightGrayColors(), this.dom.lightGrays, this.colorPickerViewModel.get_lightGrayColors().length);
        this._buildColorGroups$3(this.colorPickerViewModel.get_presetColors1(), this.dom.preset1, 3);
        this._buildColorGroups$3(this.colorPickerViewModel.get_presetColors2(), this.dom.preset2, 3);
    },
    
    _buildColorItem$3: function tab_ColorPickerView$_buildColorItem$3(color, colorHolder) {
        spiff.ClickHandler.targetAndClick($('<div/>').addClass('tabColorPickerColor').toggleClass('tabColorSelected', color.equals(this.colorPickerViewModel.get_selectedColor())).css('background-color', color.toRgb()).append($('<div/>').addClass('tabColorPickerColorBorder')).appendTo(colorHolder), this._createColorClickHandler$3(color));
    },
    
    _buildColorGroups$3: function tab_ColorPickerView$_buildColorGroups$3(colors, parent, numPerGroup) {
        var colorHolder = null;
        for (var colorNum = 0; colorNum < colors.length; colorNum++) {
            if (!(colorNum % numPerGroup)) {
                colorHolder = $('<span/>').addClass('tabColorPickerGroup').appendTo(parent);
            }
            this._buildColorItem$3(colors[colorNum], colorHolder);
        }
    },
    
    _createColorClickHandler$3: function tab_ColorPickerView$_createColorClickHandler$3(color) {
        return ss.Delegate.create(this, function() {
            this.colorPickerViewModel.set_selectedColor(color);
        });
    },
    
    onAddedToDom: function tab_ColorPickerView$onAddedToDom() {
        tab.ColorPickerView.callBaseMethod(this, 'onAddedToDom');
        if (ss.isValue(this.get_colorTransparencyControlView())) {
            this.get_colorTransparencyControlView().addToDom(this.dom.addColorTransparencyControlContainer());
        }
        if (ss.isValue(this.get_linePatternPickerView())) {
            this.get_linePatternPickerView().addToDom(this.dom.addLinePatternPickerContainer());
        }
        if (ss.isValue(this.get_strokeWidthPickerView())) {
            this.get_strokeWidthPickerView().addToDom(this.dom.addStrokeWidthPickerContainer());
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPickerTemplate

tab.ColorPickerTemplate = function tab_ColorPickerTemplate() {
    tab.ColorPickerTemplate.initializeBase(this, [ $("<div class='tabColorPicker'>\n                <div class='tabColorPickerContainer'>\n                    <div class='tabColorPickerBlack'/>\n                    <div class='tabColorPickerDarkGrays'/>\n                    <div class='tabColorPickerWhite'/>\n                    <div class='tabColorPickerLightGrays'/>\n                    <div class='tabColorPickerPreset1'/>\n                    <div class='tabColorPickerPreset2'/>\n                </div>\n            </div>") ]);
    this.black = this.getElementBySelector('.tabColorPickerBlack');
    this.white = this.getElementBySelector('.tabColorPickerWhite');
    this.darkGrays = this.getElementBySelector('.tabColorPickerDarkGrays');
    this.lightGrays = this.getElementBySelector('.tabColorPickerLightGrays');
    this.preset1 = this.getElementBySelector('.tabColorPickerPreset1');
    this.preset2 = this.getElementBySelector('.tabColorPickerPreset2');
    this._colorPickerContainer$1 = this.getElementBySelector('.tabColorPickerContainer');
}
tab.ColorPickerTemplate.prototype = {
    black: null,
    darkGrays: null,
    white: null,
    lightGrays: null,
    preset1: null,
    preset2: null,
    _colorPickerContainer$1: null,
    
    addColorTransparencyControlContainer: function tab_ColorPickerTemplate$addColorTransparencyControlContainer() {
        return $("<div class='tabAuthTransparencyControlContainer'/>").appendTo(this._colorPickerContainer$1);
    },
    
    addLinePatternPickerContainer: function tab_ColorPickerTemplate$addLinePatternPickerContainer() {
        var linePatternPickerContainer = $("<div class='tabLinePatternPickerContainer'/>").insertBefore(this._colorPickerContainer$1);
        $("<div class='tabAuthDivider'/>").insertBefore(this._colorPickerContainer$1);
        return linePatternPickerContainer;
    },
    
    addStrokeWidthPickerContainer: function tab_ColorPickerTemplate$addStrokeWidthPickerContainer() {
        var strokeWidthPickerContainer = $("<div class='tabStrokeWidthPickerContainer'/>").insertBefore(this._colorPickerContainer$1);
        $("<div class='tabAuthDivider'/>").insertBefore(this._colorPickerContainer$1);
        return strokeWidthPickerContainer;
    },
    
    removeAllColors: function tab_ColorPickerTemplate$removeAllColors() {
        this.black.children().remove();
        this.darkGrays.children().remove();
        this.white.children().remove();
        this.lightGrays.children().remove();
        this.preset1.children().remove();
        this.preset2.children().remove();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarkSizePickerView

tab.MarkSizePickerView = function tab_MarkSizePickerView(viewModel) {
    tab.MarkSizePickerView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabAuthMarkSizePickerContent'><span class='tabAuthMarkSizeLabel'></span></div>") ]);
    this.markSizePickerViewModel = viewModel;
    this.markSizePickerViewModel.add_modelUpdated(ss.Delegate.create(this, this._handleModelUpdated$2));
    this.sliderViewModel = new tab.ContinuousSliderViewModel(this.markSizePickerViewModel.get_markSize());
    this.sliderViewModel.add_propertyChanged(ss.Delegate.create(this, this.handleSliderPropertyChange));
    this.sliderViewModel.add_sliderValueChange(ss.Delegate.create(this, this.sliderValueChanged));
    this.sliderViewModel.set_sliderClassName('tabAuthMarkSizeSlider');
    this.get_template().getElementBySelector('.tabAuthMarkSizeLabel').text(tab.Strings.AuthMarkSizeLabel);
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.markSizePickerViewModel.remove_modelUpdated(ss.Delegate.create(this, this._handleModelUpdated$2));
        this.sliderViewModel.remove_propertyChanged(ss.Delegate.create(this, this.handleSliderPropertyChange));
        this.sliderViewModel.remove_sliderValueChange(ss.Delegate.create(this, this.sliderValueChanged));
    })));
    this.disposables.add(this.sliderViewModel);
}
tab.MarkSizePickerView.prototype = {
    markSizePickerViewModel: null,
    sliderViewModel: null,
    
    handleSliderPropertyChange: function tab_MarkSizePickerView$handleSliderPropertyChange(sender, args) {
        this.markSizePickerViewModel.set_currentFraction(this.sliderViewModel.get_currentFraction());
    },
    
    _handleModelUpdated$2: function tab_MarkSizePickerView$_handleModelUpdated$2(pickerViewModel) {
        this.sliderViewModel.set_currentFraction(pickerViewModel.get_currentFraction());
    },
    
    onViewModelPropertyChanged: function tab_MarkSizePickerView$onViewModelPropertyChanged(sender, e) {
        this.sliderViewModel.set_currentFraction(this.markSizePickerViewModel.get_currentFraction());
    },
    
    sliderValueChanged: function tab_MarkSizePickerView$sliderValueChanged(newValue) {
        this.markSizePickerViewModel.set_currentFraction(newValue);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LayerEncodingView

tab.LayerEncodingView = function tab_LayerEncodingView(viewModel, t) {
    tab.LayerEncodingView.initializeBase(this, [ viewModel, t ]);
    this.dom = t;
    this.leViewModel = viewModel;
    this.leViewModel.add_modelChanged(ss.Delegate.create(this, this._handleModelChanged$2));
    this.leViewModel.add_dragOverEncodingChanged(ss.Delegate.create(this, this._handleDragOverEncodingChanged$2));
    this.leViewModel.add_validDropEncodingsChanged(ss.Delegate.create(this, this._viewModelOnValidDropEncodingsChanged$2));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.leViewModel.remove_modelChanged(ss.Delegate.create(this, this._handleModelChanged$2));
        this.leViewModel.remove_dragOverEncodingChanged(ss.Delegate.create(this, this._handleDragOverEncodingChanged$2));
        this.leViewModel.remove_validDropEncodingsChanged(ss.Delegate.create(this, this._viewModelOnValidDropEncodingsChanged$2));
    })));
    this._primitivesViewModel$2 = new tab.ComboBoxViewModel();
    this._primitivesViewModel$2.add_selectedItemChanged(ss.Delegate.create(this, this._primitivesSelectedItemChanged$2));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this._primitivesViewModel$2.remove_selectedItemChanged(ss.Delegate.create(this, this._primitivesSelectedItemChanged$2));
        this._primitivesViewModel$2.dispose();
    })));
    this.leViewModel.get_encodingShelf().add_shelfChanged(ss.Delegate.create(this, this._handleShelfChanged$2));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.leViewModel.get_encodingShelf().remove_shelfChanged(ss.Delegate.create(this, this._handleShelfChanged$2));
    })));
    this.dom.primitives.append(spiff.ObjectRegistry.newView(tab.ComboBoxView, this._primitivesViewModel$2).get_element());
    this._shelfView$2 = spiff.ObjectRegistry.newView(tab.ShelfView, this.leViewModel.get_encodingShelf());
    this.disposables.add(this._shelfView$2);
    this.dom.encodingShelf.append(this._shelfView$2.get_element());
    if (this.get_addedToDom()) {
        this._shelfView$2.onAddedToDom();
    }
}
tab.LayerEncodingView.prototype = {
    leViewModel: null,
    dom: null,
    _primitivesViewModel$2: null,
    _shelfView$2: null,
    
    onAddedToDom: function tab_LayerEncodingView$onAddedToDom() {
        tab.LayerEncodingView.callBaseMethod(this, 'onAddedToDom');
        if (ss.isValue(this._shelfView$2)) {
            this._shelfView$2.onAddedToDom();
        }
    },
    
    update: function tab_LayerEncodingView$update() {
        tab.Log.get(this).debug('Update');
        this.removeEncodingButtonEvents();
        this.dom.encodingButtonsRow0.children().remove();
        this.dom.encodingButtonsRow1.children().remove();
        this._primitivesViewModel$2.clearItems();
        if (ss.isValue(this.leViewModel.get_layerEncoding())) {
            var currentItem = null;
            var $enum1 = ss.IEnumerator.getEnumerator(this.leViewModel.get_layerEncoding().get_primitiveTypes());
            while ($enum1.moveNext()) {
                var type = $enum1.current;
                var item = new tab.ComboBoxItem(tab.IconUtils.getPrimitiveTypeIcon(type), type.name, type, null);
                this._primitivesViewModel$2.addItem(item);
                if (type.isSelected) {
                    currentItem = item;
                }
            }
            this._primitivesViewModel$2.set_selectedItem(currentItem);
        }
        var encodings = (ss.isValue(this.leViewModel.get_layerEncoding()) && ss.isValue(this.leViewModel.get_layerEncoding().get_encodings())) ? this.leViewModel.get_layerEncoding().get_encodings() : [];
        encodings = _.sortBy(encodings, function(model) {
            if (Object.keyExists(tab.LayerEncodingView._encodingSortOrder$2, model.encodingType)) {
                return tab.LayerEncodingView._encodingSortOrder$2[model.encodingType];
            }
            return encodings.length;
        });
        for (var i = 0; i < 6; i++) {
            var button;
            if (encodings.length > i) {
                var et = new tab.EncodingTypeButtonTemplate();
                et.get_domRoot().addClass('tabAuthEncodingButtonType-' + encodings[i].encodingType);
                et.name.text(encodings[i].name);
                switch (encodings[i].encodingType) {
                    case 'text-encoding':
                    case 'size-encoding':
                    case 'color-encoding':
                    case 'shape-encoding':
                    case 'sort-encoding':
                    case 'wedge-size-encoding':
                        et.icon.addClass(tab.IconUtils.getEncodingTypeIcon(encodings[i].encodingType));
                        break;
                    default:
                        et.get_domRoot().addClass('tabAuthEncodingButtonNoIcon');
                        break;
                }
                spiff.DragDropManager.attachDropTarget(et.get_domRoot(), this.leViewModel.createEncodingButtonDropTarget(encodings[i].encodingType));
                et.get_domRoot().data('tabAuthEncodingType', encodings[i].encodingType);
                button = et.get_domRoot();
                var b = new spiff.Button(et.get_domRoot());
                b.set_hoverTooltipText(this.leViewModel.getEncodingTypeTooltip(encodings[i].encodingType));
                b.add_click(this._createEncodingTypeClickHandler$2(encodings[i].encodingType, et.button));
                this.attachEventHandlers(b, encodings[i].encodingType);
            }
            else {
                button = $("<span class='tabAuthEncodingButtonArea'><span class='tabAuthEmptyEncodingButton' /></span>");
            }
            ((i < 3) ? this.dom.encodingButtonsRow0 : this.dom.encodingButtonsRow1).append(button);
        }
        this._viewModelOnValidDropEncodingsChanged$2(this.leViewModel.get_validDropEncodings());
    },
    
    _handleShelfChanged$2: function tab_LayerEncodingView$_handleShelfChanged$2(shelf) {
        this.update();
    },
    
    _handleModelChanged$2: function tab_LayerEncodingView$_handleModelChanged$2(arg) {
        this.update();
    },
    
    _createEncodingTypeClickHandler$2: function tab_LayerEncodingView$_createEncodingTypeClickHandler$2(et, src) {
        return ss.Delegate.create(this, function() {
            this.leViewModel.encodingTypeClicked(et, src);
        });
    },
    
    _primitivesSelectedItemChanged$2: function tab_LayerEncodingView$_primitivesSelectedItemChanged$2(arg) {
        if (ss.isNullOrUndefined(arg)) {
            return;
        }
        var sel = arg.get_data();
        if (sel.isSelected) {
            return;
        }
        this.leViewModel.updatePrimitive(sel);
    },
    
    _viewModelOnValidDropEncodingsChanged$2: function tab_LayerEncodingView$_viewModelOnValidDropEncodingsChanged$2(arg) {
        if (ss.isNullOrUndefined(arg)) {
            this.dom.get_encodingButtons().toggleClass('tabDropInvalid', false).toggleClass('tabDropInvited', false);
        }
        else {
            this.dom.get_encodingButtons().each(function(i, e) {
                var o = $(e);
                var et = o.data('tabAuthEncodingType');
                var isValid = arg.contains(et);
                o.toggleClass('tabDropInvalid', !isValid).toggleClass('tabDropInvited', isValid);
            });
        }
    },
    
    _handleDragOverEncodingChanged$2: function tab_LayerEncodingView$_handleDragOverEncodingChanged$2(arg) {
        this.dom.get_encodingButtons().each(function(i, e) {
            var o = $(e);
            o.toggleClass('tabDragOver', o.data('tabAuthEncodingType') === arg);
        });
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LayerEncodingTemplate

tab.LayerEncodingTemplate = function tab_LayerEncodingTemplate() {
    tab.LayerEncodingTemplate.initializeBase(this, [ $("<div class='tabAuthLayerEncoding'>\n    <div class='tabAuthLayerEncodingPrimitives'/>\n    <div class='tabAuthLayerEncodingButtonRow' />\n<div class='tabAuthLayerEncodingButtonRow' />\n<div class='tabAuthLayerEncodingShelf' />\n</div>") ]);
    this.primitives = this.getElementBySelector('.tabAuthLayerEncodingPrimitives');
    this.encodingButtonsRow0 = this.getElementsBySelector('.tabAuthLayerEncodingButtonRow').first();
    this.encodingButtonsRow1 = this.getElementsBySelector('.tabAuthLayerEncodingButtonRow').slice(1);
    this.encodingShelf = this.getElementsBySelector('.tabAuthLayerEncodingShelf');
}
tab.LayerEncodingTemplate.prototype = {
    encodingButtonsRow0: null,
    encodingButtonsRow1: null,
    encodingShelf: null,
    primitives: null,
    
    get_encodingButtons: function tab_LayerEncodingTemplate$get_encodingButtons() {
        return this.getElementsBySelector('.tabAuthEncodingButtonArea');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.EncodingTypeButtonTemplate

tab.EncodingTypeButtonTemplate = function tab_EncodingTypeButtonTemplate() {
    tab.EncodingTypeButtonTemplate.initializeBase(this, [ $("<span class='tabAuthEncodingButtonArea'><span class='tabAuthEncodingButton'><div class='tabAuthEncodingButtonName'/><div class='tabAuthEncodingButtonIcon'/></span></span>") ]);
    this.button = this.getElementBySelector('.tabAuthEncodingButton');
    this.name = this.getElementBySelector('.tabAuthEncodingButtonName');
    this.icon = this.getElementBySelector('.tabAuthEncodingButtonIcon');
}
tab.EncodingTypeButtonTemplate.prototype = {
    name: null,
    icon: null,
    button: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarksContentView

tab.MarksContentView = function tab_MarksContentView(viewModel, t) {
    tab.MarksContentView.initializeBase(this, [ viewModel, t ]);
    this._viewModel$3 = viewModel;
    this._viewModel$3.add_layersChanged(ss.Delegate.create(this, this.handleLayersChanged));
    this._dom$3 = t;
}
tab.MarksContentView.prototype = {
    _dom$3: null,
    _viewModel$3: null,
    _accordionViewModel$3: null,
    _accordionView$3: null,
    _currentLayerView$3: null,
    _chooseLayerButton$3: null,
    
    get_scrollContent: function tab_MarksContentView$get_scrollContent() {
        if (!this._viewModel$3.get_layers().length) {
            return this._dom$3.get_domRoot();
        }
        return this._dom$3.get_domRoot().find('.tabAuthShelf');
    },
    
    get_scrollableContentPreferredHeight: function tab_MarksContentView$get_scrollableContentPreferredHeight() {
        var w = spiff.Widget.getWidgets(this.get_scrollContent(), tab.CardContentView);
        if (w.length > 0) {
            var max = 0;
            var $enum1 = ss.IEnumerator.getEnumerator(w);
            while ($enum1.moveNext()) {
                var widget = $enum1.current;
                max = Math.max(max, (widget).get_scrollableContentPreferredHeight());
            }
            return max;
        }
        return this._dom$3.get_domRoot().outerHeight(true);
    },
    
    get_chooseLayersThreshold: function tab_MarksContentView$get_chooseLayersThreshold() {
        return 7;
    },
    
    get__accordionView$3: function tab_MarksContentView$get__accordionView$3() {
        if (ss.isNullOrUndefined(this._accordionView$3)) {
            this._accordionView$3 = spiff.ObjectRegistry.newView(tab.AccordionView, this.get__accordionViewModel$3());
        }
        return this._accordionView$3;
    },
    
    get__accordionViewModel$3: function tab_MarksContentView$get__accordionViewModel$3() {
        if (ss.isNullOrUndefined(this._accordionViewModel$3)) {
            this._accordionViewModel$3 = new tab.AccordionViewModel();
            this._accordionViewModel$3.set_allowDragOverExpand(false);
            this._accordionViewModel$3.add_propertyChanged(ss.Delegate.create(this, function(sender, e) {
                if (e.get_propertyName() !== tab.AccordionViewModel.propertyActiveItem) {
                    return;
                }
                var item = this._accordionViewModel$3.get_activeItem();
                if (ss.isNullOrUndefined(item)) {
                    return;
                }
                var lvm = item.get_content().get_viewModel();
                this._viewModel$3.set_currentLayer(lvm);
            }));
        }
        return this._accordionViewModel$3;
    },
    
    get__chooseLayerButton$3: function tab_MarksContentView$get__chooseLayerButton$3() {
        if (ss.isNullOrUndefined(this._chooseLayerButton$3)) {
            this._chooseLayerButton$3 = $("<div class='tabAuthMarksContentMore'/>");
            this._chooseLayerButton$3.append($('<span>').text(tab.Strings.AuthMarksCardChooseField));
            this._chooseLayerButton$3.append($('<span>').addClass('tabAuthMarksContentMoreIcon'));
            this.disposables.add(spiff.TableauClickHandler.targetAndClick(this._chooseLayerButton$3[0], ss.Delegate.create(this, this._handleChooseLayerButtonClick$3)));
        }
        return this._chooseLayerButton$3;
    },
    
    dispose: function tab_MarksContentView$dispose() {
        this._viewModel$3.remove_layersChanged(ss.Delegate.create(this, this.handleLayersChanged));
        if (ss.isValue(this._accordionView$3)) {
            this._accordionView$3.dispose();
            this._accordionView$3 = null;
        }
        if (ss.isValue(this._accordionViewModel$3)) {
            this._accordionViewModel$3.dispose();
            this._accordionViewModel$3 = null;
        }
        if (ss.isValue(this._currentLayerView$3)) {
            this._currentLayerView$3.dispose();
            this._currentLayerView$3 = null;
        }
        tab.MarksContentView.callBaseMethod(this, 'dispose');
    },
    
    onAddedToDom: function tab_MarksContentView$onAddedToDom() {
        tab.MarksContentView.callBaseMethod(this, 'onAddedToDom');
        this._notifyChildrenAddedToDom$3();
    },
    
    _notifyChildrenAddedToDom$3: function tab_MarksContentView$_notifyChildrenAddedToDom$3() {
        if (!this.get_addedToDom()) {
            return;
        }
        if (ss.isValue(this._currentLayerView$3)) {
            this._currentLayerView$3.onAddedToDom();
        }
        if (ss.isValue(this._accordionView$3)) {
            this._accordionView$3.onAddedToDom();
        }
    },
    
    setScrollableContentActualHeight: function tab_MarksContentView$setScrollableContentActualHeight(height) {
        var w = spiff.Widget.getWidgets(this.get_scrollContent(), tab.CardContentView);
        if (w.length > 0) {
            var $enum1 = ss.IEnumerator.getEnumerator(w);
            while ($enum1.moveNext()) {
                var widget = $enum1.current;
                (widget).setScrollableContentActualHeight(height);
            }
        }
    },
    
    onViewModelPropertyChanged: function tab_MarksContentView$onViewModelPropertyChanged(sender, e) {
        if (e.get_propertyName() === 'CurrentLayer') {
            this._handleCurrentLayerChanged$3();
        }
        tab.MarksContentView.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
    },
    
    handleLayersChanged: function tab_MarksContentView$handleLayersChanged() {
        if (ss.isValue(this._currentLayerView$3)) {
            this._currentLayerView$3.dispose();
            this._currentLayerView$3 = null;
        }
        if (this._viewModel$3.get_layers().length === 1) {
            this._currentLayerView$3 = spiff.ObjectRegistry.newView(tab.LayerEncodingView, this._viewModel$3.get_currentLayer());
            if (ss.isValue(this._accordionView$3)) {
                this._accordionView$3.dispose();
                this._accordionView$3 = null;
            }
        }
        else {
            this._updateAccordionLayers$3();
        }
        this._updateDomForModel$3();
    },
    
    _updateAccordionLayers$3: function tab_MarksContentView$_updateAccordionLayers$3() {
        if (this._viewModel$3.get_layers().length <= this.get_chooseLayersThreshold()) {
            this.get__accordionViewModel$3().updateItems(_.map(this._viewModel$3.get_layers(), ss.Delegate.create(this, this._createAccordionItem$3)));
        }
        else {
            this.get__accordionViewModel$3().updateItems([this._createAccordionItem$3(this._viewModel$3.get_currentLayer())]);
        }
        this._setAccordionActiveItem$3();
    },
    
    _createAccordionItem$3: function tab_MarksContentView$_createAccordionItem$3(layer) {
        var ai = new tab.AccordionItem(layer.get_layerEncoding().get_name(), tab.IconUtils.getLayerIcon(layer.get_layerEncoding()), new tab._layerAccordionContent(layer));
        if (layer.get_layerEncoding().get_isTableCalc()) {
            ai.set_iconClassTwo('tabAuthPillIconTableCalc');
        }
        return ai;
    },
    
    _setAccordionActiveItem$3: function tab_MarksContentView$_setAccordionActiveItem$3() {
        this.get__accordionViewModel$3().set_activeItem(_.find(this.get__accordionViewModel$3().get_items(), ss.Delegate.create(this, function(i) {
            var content = i.get_content();
            return content.get_id() === this._viewModel$3.get_currentLayer().get_layerEncoding().get_id();
        })));
        this.raiseScrollContentChanged();
    },
    
    _handleCurrentLayerChanged$3: function tab_MarksContentView$_handleCurrentLayerChanged$3() {
        if (this._viewModel$3.get_layers().length === 1) {
            this.handleLayersChanged();
        }
        else if (this._viewModel$3.get_layers().length <= this.get_chooseLayersThreshold()) {
            this._setAccordionActiveItem$3();
        }
        else {
            this._updateAccordionLayers$3();
        }
    },
    
    _updateDomForModel$3: function tab_MarksContentView$_updateDomForModel$3() {
        this._dom$3.get_domRoot().children().detach();
        if (!this._viewModel$3.get_layers().length) {
            return;
        }
        if (this._viewModel$3.get_layers().length === 1) {
            this._dom$3.get_domRoot().append(this._currentLayerView$3.get_element());
        }
        else {
            this._dom$3.get_domRoot().append(this.get__accordionView$3().get_element());
            if (this._viewModel$3.get_layers().length > this.get_chooseLayersThreshold()) {
                this._dom$3.get_domRoot().append(this.get__chooseLayerButton$3());
            }
        }
        this._notifyChildrenAddedToDom$3();
        this.raiseScrollContentChanged();
    },
    
    _handleChooseLayerButtonClick$3: function tab_MarksContentView$_handleChooseLayerButtonClick$3(e) {
        var items = [];
        var $enum1 = ss.IEnumerator.getEnumerator(this._viewModel$3.get_layers());
        while ($enum1.moveNext()) {
            var layer = $enum1.current;
            var mi = spiff.MenuItem.newItemWithIcon(layer, layer.get_layerEncoding().get_name(), tab.IconUtils.getLayerIcon(layer.get_layerEncoding()));
            if (layer === this._viewModel$3.get_currentLayer()) {
                mi.set_itemClass('tabMenuSelectedItem');
            }
            if (layer.get_layerEncoding().get_isTableCalc()) {
                mi.set_iconClassTwo('tabAuthPillIconTableCalc');
            }
            items.add(mi);
        }
        var target = $(e.target);
        var options = new spiff.ShowMenuOptions(target, false, target.outerWidth());
        var m = new spiff.Menu(items);
        spiff.MenuViewModel.createForMenu(m, ss.Delegate.create(this, this._setCurrentLayerFromMenu$3), new tab.ComboBoxMenuTheme()).show(options);
    },
    
    _setCurrentLayerFromMenu$3: function tab_MarksContentView$_setCurrentLayerFromMenu$3(item) {
        this._viewModel$3.set_currentLayer(item.get_data());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarksContentTemplate

tab.MarksContentTemplate = function tab_MarksContentTemplate() {
    tab.MarksContentTemplate.initializeBase(this, [ $("<div class='tabAuthMarksContent'/>") ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab._layerAccordionContent

tab._layerAccordionContent = function tab__layerAccordionContent(layer) {
    this._layer = layer;
}
tab._layerAccordionContent.prototype = {
    _layer: null,
    
    get_id: function tab__layerAccordionContent$get_id() {
        return this._layer.get_layerEncoding().get_id();
    },
    
    get_viewType: function tab__layerAccordionContent$get_viewType() {
        return tab.LayerEncodingView;
    },
    
    get_viewModel: function tab__layerAccordionContent$get_viewModel() {
        return this._layer;
    },
    
    get_active: function tab__layerAccordionContent$get_active() {
        return false;
    },
    set_active: function tab__layerAccordionContent$set_active(value) {
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabNavView

tab.AuthoringTabNavView = function tab_AuthoringTabNavView(viewModel) {
    tab.AuthoringTabNavView.initializeBase(this, [ viewModel, new tab.AuthoringTabNavViewTemplate() ]);
    this.authoringTabNavViewModel = viewModel;
    this.dom = this.get_template();
    this.authoringTabNavViewModel.add_tabsChanged(ss.Delegate.create(this, this.updateContent));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.authoringTabNavViewModel.remove_tabsChanged(ss.Delegate.create(this, this.updateContent));
    })));
}
tab.AuthoringTabNavView.prototype = {
    authoringTabNavViewModel: null,
    dom: null,
    
    get_tabsWidth: function tab_AuthoringTabNavView$get_tabsWidth() {
        return this.dom.tabContainer.outerWidth(true);
    },
    
    get_availableWidth: function tab_AuthoringTabNavView$get_availableWidth() {
        return this.dom.tabContainer.parent().width() - this.dom.controlsArea.width();
    },
    
    onViewModelPropertyChanged: function tab_AuthoringTabNavView$onViewModelPropertyChanged(sender, e) {
        this.updateContent();
    },
    
    updateContent: function tab_AuthoringTabNavView$updateContent() {
        this._updateTabs$2();
    },
    
    _updateTabs$2: function tab_AuthoringTabNavView$_updateTabs$2() {
        var $enum1 = ss.IEnumerator.getEnumerator(spiff.Widget.getWidgets(this.dom.tabContainer.children(), tab.AuthoringTabView));
        while ($enum1.moveNext()) {
            var w = $enum1.current;
            w.dispose();
        }
        this.dom.tabContainer.empty();
        this.dom.tabContainer.append($("<span class='tabAuthTabSpacer'/>"));
        var $enum2 = ss.IEnumerator.getEnumerator(this.authoringTabNavViewModel.get_workbookTabs());
        while ($enum2.moveNext()) {
            var t = $enum2.current;
            var tabview = new tab.AuthoringTabView(t);
            this.dom.tabContainer.append(tabview.get_element());
            this.dom.tabContainer.append($("<span class='tabAuthTabSpacer'/>"));
        }
        this.dom.tabContainer.append($("<span class='tabAuthTabSpacer tabAuthTabSpacerLast'/>"));
        var newTabBtn = $("<span class='tabAuthTab tabAuthTabNewBtn'><div class='tabAuthNewTabIcon'></div></span>");
        spiff.ClickHandler.targetAndClick(newTabBtn, ss.Delegate.create(this, function() {
            this.authoringTabNavViewModel.createNewWorksheet(true);
        }));
        this.dom.newButton = newTabBtn;
        this.dom.tabContainer.append(newTabBtn);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabNavViewTemplate

tab.AuthoringTabNavViewTemplate = function tab_AuthoringTabNavViewTemplate() {
    tab.AuthoringTabNavViewTemplate.initializeBase(this, [ $(tab.AuthoringTabNavViewTemplate.template) ]);
    this.tabContainer = this.getElementBySelector('.tabAuthTabNavTabs');
    this.controlsArea = this.getElementBySelector('.tabAuthTabNavControls');
    this.leftButton = this.getElementBySelector('.tabAuthTabNavLeftButton');
    this.rightButton = this.getElementBySelector('.tabAuthTabNavRightButton');
    this.menuButton = this.getElementBySelector('.tabAuthTabNavMenuButton');
}
tab.AuthoringTabNavViewTemplate.prototype = {
    tabContainer: null,
    controlsArea: null,
    leftButton: null,
    rightButton: null,
    menuButton: null,
    newButton: null,
    
    tabs: function tab_AuthoringTabNavViewTemplate$tabs() {
        return this.tabContainer.children();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringMastheadView

tab.AuthoringMastheadView = function tab_AuthoringMastheadView(viewModel) {
    this._menuDisposables$2 = new tab.DisposableHolder();
    tab.AuthoringMastheadView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabAuthMasthead'>") ]);
    this.authoringMastheadViewModel = viewModel;
    this.workbookNameDom = $('<div>').addClass('tabAuthMastheadWorkbookAreaName');
    this.userLinksAreaDom = $('<span>').addClass('tabAuthMastheadUserLinks');
    this.workbookLinksAreaDom = $('<div>').addClass('tabAuthMastheadWorkbookAreaLinks');
    this.logoDom = $('<a>').addClass('tabAuthMastheadLogo').css('background', String.format("url('{0}') center center no-repeat", tsConfig.serverSmallLogo));
    var workbookArea = $('<span>').addClass('tabAuthMastheadWorkbookArea').append(this.workbookNameDom).append(this.workbookLinksAreaDom);
    this.get_element().append(this.logoDom).append(workbookArea).append(this.userLinksAreaDom);
    this.updateContent();
}
tab.AuthoringMastheadView.prototype = {
    authoringMastheadViewModel: null,
    workbookNameDom: null,
    userLinksAreaDom: null,
    workbookLinksAreaDom: null,
    logoDom: null,
    
    dispose: function tab_AuthoringMastheadView$dispose() {
        this._menuDisposables$2.dispose();
        tab.AuthoringMastheadView.callBaseMethod(this, 'dispose');
    },
    
    onViewModelPropertyChanged: function tab_AuthoringMastheadView$onViewModelPropertyChanged(sender, e) {
        this.updateContent();
    },
    
    updateContent: function tab_AuthoringMastheadView$updateContent() {
        this.workbookNameDom.text(this.authoringMastheadViewModel.get_workbookName());
        this._menuDisposables$2.dispose();
        this.userLinksAreaDom.children().remove();
        this._addMenu$2(this.authoringMastheadViewModel.get_userMenu(), this.userLinksAreaDom);
        this.workbookLinksAreaDom.children().remove();
        this._addMenu$2(this.authoringMastheadViewModel.get_workbookMenu(), this.workbookLinksAreaDom);
    },
    
    layout: function tab_AuthoringMastheadView$layout() {
    },
    
    _attachClickHandler$2: function tab_AuthoringMastheadView$_attachClickHandler$2(item, dom) {
        var handler;
        if (ss.isValue(item.get_subMenu())) {
            handler = ss.Delegate.create(this, function() {
                this._openPopup$2(item.get_subMenu(), dom);
            });
        }
        else {
            handler = function() {
                (item.get_data())();
            };
        }
        this._menuDisposables$2.add(spiff.TableauClickHandler.targetAndClick(dom[0], handler));
    },
    
    _actionMenuItemClicked$2: function tab_AuthoringMastheadView$_actionMenuItemClicked$2(menuItem) {
        if ($.isFunction(menuItem.get_data())) {
            (menuItem.get_data())();
        }
    },
    
    _openPopup$2: function tab_AuthoringMastheadView$_openPopup$2(popupMenu, parent) {
        var menuViewModel = spiff.MenuViewModel.createForMenu(popupMenu, ss.Delegate.create(this, this._actionMenuItemClicked$2));
        parent.addClass('tab-masthead-toolbar-button-open');
        menuViewModel.add_hidden(function() {
            parent.removeClass('tab-masthead-toolbar-button-open');
        });
        menuViewModel.show(spiff.ShowMenuOptions.preferDownAndLeft(parent, parent.outerWidth(false)));
    },
    
    _addMenu$2: function tab_AuthoringMastheadView$_addMenu$2(links, parent) {
        var $enum1 = ss.IEnumerator.getEnumerator(links.get_menuItems());
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            var button = $("<a class='tab-masthead-toolbar-button'></a>");
            var link = $('<a>').addClass('tabAuthMastheadLink').text(item.get_name());
            button.append(link);
            if (ss.isValue(item.get_subMenu())) {
                button.append("<span class='tabAuthMastheadIcon'>\u25bc</span>");
            }
            if (item.get_enabled()) {
                this._attachClickHandler$2(item, button);
            }
            else {
                button.addClass('tabDisabled');
            }
            parent.append(button);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillDragAvatar

tab.PillDragAvatar = function tab_PillDragAvatar(name, fieldType) {
    tab.PillDragAvatar.initializeBase(this, [ $("\n<span class='tabAuthPillAvatar'>\n    <div class='tabAuthPillAvatarLabel'>{0}</div>\n</span>") ]);
    this.set_label(name);
    this.set_fieldType(fieldType);
}
tab.PillDragAvatar.prototype = {
    _label$1: null,
    _fieldType$1: null,
    
    get_viewModel: function tab_PillDragAvatar$get_viewModel() {
        return null;
    },
    
    get_label: function tab_PillDragAvatar$get_label() {
        return this._label$1;
    },
    set_label: function tab_PillDragAvatar$set_label(value) {
        tab.Log.get(this).debug('Updating label: %s', value);
        this._label$1 = value;
        this.get_element().find('.tabAuthPillAvatarLabel').text(this._label$1);
        return value;
    },
    
    get_fieldType: function tab_PillDragAvatar$get_fieldType() {
        return this._fieldType$1;
    },
    set_fieldType: function tab_PillDragAvatar$set_fieldType(value) {
        tab.Log.get(this).debug('Updating field type: %s', value);
        this._fieldType$1 = value;
        var isOrdinal = false;
        var isQuant = false;
        var isNominal = false;
        var isOther = false;
        switch (this._fieldType$1) {
            case 'ordinal':
                isOrdinal = true;
                break;
            case 'quantitative':
                isQuant = true;
                break;
            case 'nominal':
                isNominal = true;
                break;
            default:
                isOther = true;
                break;
        }
        this.get_element().toggleClass('tabAuthPillOrdinal', isOrdinal);
        this.get_element().toggleClass('tabAuthPillQuantatative', isQuant);
        this.get_element().toggleClass('tabAuthPillNominal', isNominal);
        this.get_element().toggleClass('tabAuthPillOther', isOther);
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillView

tab.PillView = function tab_PillView(viewModel, template) {
    tab.PillView.initializeBase(this, [ viewModel, template ]);
    this._viewModel$2 = viewModel;
    this.dom = template;
    this.disposables.add(spiff.TableauClickHandler.targetAndClick(this.dom.get_domRoot()[0], ss.Delegate.create(this, this.handlePillClick)).onRightClick(ss.Delegate.create(this, this.handleMenuButtonClick)).onDoubleClick(ss.Delegate.create(this._viewModel$2, this._viewModel$2.editPill)));
    this.disposables.add(spiff.TableauClickHandler.targetAndClick(this.dom.drillIcon[0], ss.Delegate.create(this, this.handleIconClick)));
    this.disposables.add(spiff.TableauClickHandler.targetAndClick(this.dom.menuButton[0], ss.Delegate.create(this, this.handleMenuButtonClick)));
    spiff.DragDropManager.attachDragSource(this.dom.dragSource, viewModel);
    spiff.DragDropManager.attachDropTarget(this.dom.get_domRoot(), viewModel);
    this.updateDom();
    this._viewModel$2.add_showDragAccept(ss.Delegate.create(this, this._showDragAcceptState$2));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this._viewModel$2.remove_showDragAccept(ss.Delegate.create(this, this._showDragAcceptState$2));
    })));
    _.defer(ss.Delegate.create(this, function() {
        this.updateLabelSizeForIcons();
    }));
}
tab.PillView.prototype = {
    dom: null,
    _viewModel$2: null,
    _currentDrillIconClass$2: null,
    _hasExternalIcon$2: false,
    _encodingItemsVm$2: null,
    _encodingItemsView$2: null,
    
    get_hasExternalIcon: function tab_PillView$get_hasExternalIcon() {
        return this._hasExternalIcon$2;
    },
    
    dispose: function tab_PillView$dispose() {
        if (ss.isValue(this._encodingItemsVm$2)) {
            this._encodingItemsVm$2.dispose();
        }
        tab.PillView.callBaseMethod(this, 'dispose');
    },
    
    handleMenuButtonClick: function tab_PillView$handleMenuButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this._viewModel$2.menuButtonClicked(this.dom.content);
    },
    
    handleIconClick: function tab_PillView$handleIconClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this._viewModel$2.iconClicked();
        this._updatePillIcon$2();
    },
    
    handlePillClick: function tab_PillView$handlePillClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this._viewModel$2.pillClicked();
    },
    
    updateDom: function tab_PillView$updateDom() {
        this._updateFieldRole$2();
        this._updateFieldType$2();
        this._updatePillIcon$2();
        this._updateDrawStyle$2();
        this._updateExternalIcon$2();
        this._updateEncodingPicker$2();
        this.dom.label.text(this._viewModel$2.get_displayName());
        this.dom.label.attr('title', this._viewModel$2.get_pill().get_tooltip());
    },
    
    updateLabelSizeForIcons: function tab_PillView$updateLabelSizeForIcons() {
        var width = (this.dom.icons.is(':visible')) ? this.dom.icons.outerWidth(true) : 10;
        this.dom.label.css('padding-right', String.format('{0}px', width));
    },
    
    _updateEncodingPicker$2: function tab_PillView$_updateEncodingPicker$2() {
        if (!this._viewModel$2.get_pill().get_alternateEncodings().length) {
            return;
        }
        if (ss.isNullOrUndefined(this._encodingItemsVm$2)) {
            this.dom.externalIcon.hide();
            this._hasExternalIcon$2 = true;
            this._encodingItemsVm$2 = new tab.ComboBoxViewModel();
            this._encodingItemsVm$2.set_theme(tab.ComboBoxTheme.compact);
            this._encodingItemsVm$2.set_showSelectedItem(false);
            this._encodingItemsVm$2.set_showDropdownIcon(!this._viewModel$2.get_pill().get_isMultipleFields());
            this._encodingItemsVm$2.set_enabled(!this._viewModel$2.get_pill().get_isMultipleFields());
            this._encodingItemsVm$2.add_selectedItemChanged(ss.Delegate.create(this, this._handleSelectedEncodingChanged$2));
            this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this._encodingItemsVm$2.remove_selectedItemChanged(ss.Delegate.create(this, this._handleSelectedEncodingChanged$2));
            })));
            this._encodingItemsView$2 = spiff.ObjectRegistry.newView(tab.ComboBoxView, this._encodingItemsVm$2);
            this.dom.encodingType.append(this._encodingItemsView$2.get_element());
        }
        this._encodingItemsVm$2.clearItems();
        var $enum1 = ss.IEnumerator.getEnumerator(this._viewModel$2.get_pill().get_alternateEncodings());
        while ($enum1.moveNext()) {
            var encoding = $enum1.current;
            var item = new tab.ComboBoxItem(tab.IconUtils.getEncodingTypeIcon(encoding.encodingType), encoding.name, encoding.encodingType, null);
            this._encodingItemsVm$2.addItem(item);
            if (encoding.encodingType === this._viewModel$2.get_pill().get_encodingType()) {
                this._encodingItemsVm$2.set_selectedItem(item);
            }
        }
        if (ss.isNullOrUndefined(this._encodingItemsVm$2.get_selectedItem())) {
            var $enum2 = ss.IEnumerator.getEnumerator(this._viewModel$2.get_pill().get_item().encodingUiItems);
            while ($enum2.moveNext()) {
                var encoding = $enum2.current;
                if (encoding.encodingType === this._viewModel$2.get_pill().get_encodingType()) {
                    var fakeItem = new tab.ComboBoxItem(tab.IconUtils.getEncodingTypeIcon(encoding.encodingType), encoding.name, encoding.encodingType, null);
                    this._encodingItemsVm$2.set_selectedItem(fakeItem);
                    break;
                }
            }
        }
    },
    
    _handleSelectedEncodingChanged$2: function tab_PillView$_handleSelectedEncodingChanged$2(cb) {
        this._viewModel$2.updateEncodingType(cb.get_data());
    },
    
    _updateExternalIcon$2: function tab_PillView$_updateExternalIcon$2() {
        var filterIcon = tab.IconUtils.getPillFilterTypeIcon(this._viewModel$2.get_pill());
        this._hasExternalIcon$2 = ss.isValue(filterIcon);
        if (ss.isValue(filterIcon)) {
            this.dom.externalIcon.addClass(filterIcon);
            this.dom.externalIcon.attr('title', this._viewModel$2.get_pill().get_sideIconToolip());
        }
    },
    
    _updateDrawStyle$2: function tab_PillView$_updateDrawStyle$2() {
        var isOpened = false;
        var isClosed = false;
        switch (this._viewModel$2.get_item().itemDrawStyle) {
            case 'opened':
                isOpened = true;
                break;
            case 'closed':
                isClosed = true;
                break;
        }
        this.dom.content.toggleClass('tabAuthPillOpened', isOpened);
        this.dom.content.toggleClass('tabAuthPillClosed', isClosed);
    },
    
    _updatePillIcon$2: function tab_PillView$_updatePillIcon$2() {
        this.dom.drillIcon.removeClass(this._currentDrillIconClass$2);
        if (this._viewModel$2.get_pill().get_hasDrill()) {
            this._currentDrillIconClass$2 = (this._viewModel$2.get_pill().get_shouldDrill()) ? 'tabAuthPillIconDrillDown' : 'tabAuthPillIconDrillUp';
        }
        else {
            this._currentDrillIconClass$2 = '';
        }
        this.dom.drillIcon.addClass(this._currentDrillIconClass$2);
        this.dom.content.toggleClass('tabAuthPillHasDrill', this._viewModel$2.get_pill().get_hasDrill());
        this.dom.icons.empty();
        var $enum1 = ss.IEnumerator.getEnumerator(tab.IconUtils.getPillIcons(this._viewModel$2.get_pill()));
        while ($enum1.moveNext()) {
            var iconClass = $enum1.current;
            this.dom.icons.append($('<span/>').addClass(iconClass).addClass('tabAuthPillIcon'));
        }
        this.updateLabelSizeForIcons();
    },
    
    _updateFieldType$2: function tab_PillView$_updateFieldType$2() {
        var isMultiple = this._viewModel$2.get_pill().get_isMultipleFields();
        var isOrdinal = false;
        var isQuantatative = false;
        var isNominal = false;
        var isOther = false;
        var isInvalid = false;
        if (this._viewModel$2.get_item().isInvalid) {
            isInvalid = true;
        }
        else if (!isMultiple) {
            switch (this._viewModel$2.get_field().get_fieldType()) {
                case 'ordinal':
                    isOrdinal = true;
                    break;
                case 'quantitative':
                    isQuantatative = true;
                    break;
                case 'nominal':
                    isNominal = true;
                    break;
                default:
                    isOther = true;
                    break;
            }
        }
        this.dom.content.toggleClass('tabAuthPillOrdinal', isOrdinal);
        this.dom.content.toggleClass('tabAuthPillQuantatative', isQuantatative);
        this.dom.content.toggleClass('tabAuthPillNominal', isNominal);
        this.dom.content.toggleClass('tabAuthPillOther', isOther);
        this.dom.content.toggleClass('tabAuthPillMultiple', isMultiple);
        this.dom.content.toggleClass('tabAuthPillInvalid', isInvalid);
    },
    
    _updateFieldRole$2: function tab_PillView$_updateFieldRole$2() {
        switch (this._viewModel$2.get_role()) {
            case 'measure':
                this.dom.content.toggleClass('tabAuthPillDimension', false);
                this.dom.content.toggleClass('tabAuthPillMeasure', true);
                break;
            case 'dimension':
            case 'unknown':
            default:
                this.dom.content.toggleClass('tabAuthPillDimension', true);
                this.dom.content.toggleClass('tabAuthPillMeasure', false);
                break;
        }
    },
    
    _showDragAcceptState$2: function tab_PillView$_showDragAcceptState$2(show) {
        this.dom.content.toggleClass('tabDropInvited', show);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillViewTemplate

tab.PillViewTemplate = function tab_PillViewTemplate(html) {
    tab.PillViewTemplate.initializeBase(this, [ $(html) ]);
    var g = ss.Delegate.create(this, this.getElementBySelector);
    this.drillIcon = g('.tabAuthPillDrillIcon');
    this.icons = g('.tabAuthPillIcons');
    this.label = g('.tabAuthPillLabel');
    this.menuButton = g('.tabAuthPillMenuBtn');
    this.content = g('.tabAuthPillContent');
    this.externalIcon = g('.tabAuthPillExternalIcon');
    this.encodingType = g('.tabAuthPillEncodingType');
    this.dragSource = this.get_domRoot();
}
tab.PillViewTemplate.prototype = {
    drillIcon: null,
    icons: null,
    label: null,
    menuButton: null,
    dragSource: null,
    content: null,
    externalIcon: null,
    encodingType: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.RenameSheetDialog

tab.RenameSheetDialog = function tab_RenameSheetDialog(oldSheetName, existingSheetNames, postAction) {
    tab.RenameSheetDialog.initializeBase(this, [ oldSheetName, $(tab.RenameSheetDialog.renameTemplate) ]);
    this._oldSheetName$3 = oldSheetName;
    this._existingSheetNames$3 = existingSheetNames;
    this._postAction$3 = postAction;
    this.set_closeButtonVisible(false);
    this.set_titleUnescaped(tab.Strings.AuthRenameSheet);
    var commitButton = spiff.StyledButton.createStyledButton(ss.Delegate.create(this, this.handleRename), tab.Strings.DialogButtonOK, 'commit', 2);
    this.disposables.add(commitButton);
    commitButton.set_disabled(true);
    var cancelButton = spiff.StyledButton.createStyledButton(ss.Delegate.create(this, this.handleCancel), tab.Strings.DialogButtonCancel, 'cancel', 3);
    this.disposables.add(cancelButton);
    this.get_element().find('.tab-dialog-actions').append(commitButton.get_element()).append(cancelButton.get_element());
    this._sheetNameInput$3 = this.get_body().find('.newSheetName');
    this._sheetNameInput$3.val(this._oldSheetName$3);
    this._sheetNameInput$3.keyup(ss.Delegate.create(this, function() {
        commitButton.set_disabled(!this.validateNewSheetName(this._sheetNameInput$3.val()));
    }));
    this._sheetNameInput$3.keydown(ss.Delegate.create(this, function(e) {
        if (e.which === 13) {
            this.handleRename();
        }
    }));
    this._statusMsg$3 = this.get_body().find('.tab-dialog-status-msg');
    this._statusMsg$3.hide();
    this.set_setFocusOnShow(false);
}
tab.RenameSheetDialog.prototype = {
    _oldSheetName$3: null,
    _existingSheetNames$3: null,
    _postAction$3: null,
    _sheetNameInput$3: null,
    _statusMsg$3: null,
    
    get__statusMessage$3: function tab_RenameSheetDialog$get__statusMessage$3() {
        return this._statusMsg$3.text();
    },
    set__statusMessage$3: function tab_RenameSheetDialog$set__statusMessage$3(value) {
        this._statusMsg$3.text(value);
        if (ss.isNull(value)) {
            this._statusMsg$3.hide();
        }
        else {
            this._statusMsg$3.show();
        }
        return value;
    },
    
    validateNewSheetName: function tab_RenameSheetDialog$validateNewSheetName(newSheetName) {
        return !(String.isNullOrEmpty(newSheetName.toString().trim()) || newSheetName === this._oldSheetName$3 || newSheetName.toString().length > 254 || this._existingSheetNames$3.contains(newSheetName));
    },
    
    handleRename: function tab_RenameSheetDialog$handleRename() {
        var newSheetName = this._sheetNameInput$3.val();
        if (!this.validateNewSheetName(newSheetName)) {
            this.set__statusMessage$3(tab.Strings.AuthRenameSheetError);
        }
        else {
            this.set__statusMessage$3(null);
            this._postAction$3(newSheetName);
            this.closeAndDispose();
        }
    },
    
    handleCancel: function tab_RenameSheetDialog$handleCancel() {
        this.closeAndDispose();
    },
    
    show: function tab_RenameSheetDialog$show() {
        tab.RenameSheetDialog.callBaseMethod(this, 'show');
        this._sheetNameInput$3.select();
        if (!tsConfig.is_touch) {
            this._sheetNameInput$3.focus();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SaveView

tab.SaveView = function tab_SaveView(viewModel) {
    tab.SaveView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabAuthSave'>") ]);
    this.saveViewModel = viewModel;
    this.saveViewModel.add_shown(ss.Delegate.create(this, this._shown$2));
    this.saveViewModel.add_hidden(ss.Delegate.create(this, this._hidden$2));
    this.buildDom();
    this.updateContent();
    this.enableTextSelection();
}
tab.SaveView._createCheckBox$2 = function tab_SaveView$_createCheckBox$2(changeHandler, label, checkClass, tabIndex) {
    return $('<label>').addClass(checkClass).append($('<span>').text(label)).prepend($("<input type='checkbox'>").attr('tabindex', tabIndex.toString()).change(changeHandler));
}
tab.SaveView.prototype = {
    saveViewModel: null,
    _nameDom$2: null,
    _projectsViewModel$2: null,
    _projectsView$2: null,
    _showTabsDom$2: null,
    _embedCredentialsDom$2: null,
    _modalDialog$2: null,
    _cancelButton$2: null,
    _saveButton$2: null,
    
    dispose: function tab_SaveView$dispose() {
        this.saveViewModel.remove_shown(ss.Delegate.create(this, this._shown$2));
        this.saveViewModel.remove_hidden(ss.Delegate.create(this, this._hidden$2));
        this._projectsViewModel$2.dispose();
        if (ss.isValue(this._modalDialog$2)) {
            this._modalDialog$2.dispose();
        }
        tab.SaveView.callBaseMethod(this, 'dispose');
    },
    
    onViewModelPropertyChanged: function tab_SaveView$onViewModelPropertyChanged(sender, e) {
        this.updateContent();
    },
    
    updateContent: function tab_SaveView$updateContent() {
        if (this._nameDom$2.val() !== this.saveViewModel.get_workbookName()) {
            this._nameDom$2.val(this.saveViewModel.get_workbookName());
        }
        this._projectsViewModel$2.remove_selectedItemChanged(ss.Delegate.create(this, this._projectsSelectedItemChanged$2));
        this._projectsViewModel$2.clearItems();
        var selectedItem = null;
        var $enum1 = ss.IEnumerator.getEnumerator(this.saveViewModel.get_projects());
        while ($enum1.moveNext()) {
            var projectModel = $enum1.current;
            var item = new tab.ComboBoxItem('', projectModel.get_name(), projectModel, null);
            this._projectsViewModel$2.addItem(item);
            if (projectModel === this.saveViewModel.get_currentProject()) {
                selectedItem = item;
            }
        }
        this._projectsViewModel$2.set_selectedItem(selectedItem);
        this._projectsViewModel$2.add_selectedItemChanged(ss.Delegate.create(this, this._projectsSelectedItemChanged$2));
        this._showTabsDom$2.find('input').prop('checked', this.saveViewModel.get_showTabs());
        this._embedCredentialsDom$2.find('input').prop('checked', this.saveViewModel.get_embedCredentials());
        this._saveButton$2.set_disabled(!this.saveViewModel.get_saveEnabled());
        this.get_element().find('.tabAuthSaveProjectRow').toggle(this.saveViewModel.get_showProjects());
    },
    
    buildDom: function tab_SaveView$buildDom() {
        this._nameDom$2 = $("<input type='text' tabindex='1'>").keyup(ss.Delegate.create(this, this._nameChanged$2));
        spiff.Widget.enableTextSelectionOnElement(this._nameDom$2);
        this._projectsViewModel$2 = new tab.ComboBoxViewModel();
        this._projectsView$2 = spiff.ObjectRegistry.newView(tab.ComboBoxView, this._projectsViewModel$2);
        this._projectsView$2.get_element().addClass('tabAuthSaveProjects').prop('tabindex', '2');
        this._showTabsDom$2 = tab.SaveView._createCheckBox$2(ss.Delegate.create(this, this._showTabsChanged$2), tab.Strings.AuthSaveLabelShowTabs, 'tabAuthSaveShowTabsCheck', 3);
        this._embedCredentialsDom$2 = tab.SaveView._createCheckBox$2(ss.Delegate.create(this, this._embedCredentialsChanged$2), tab.Strings.AuthSaveLabelEmbedPassword, 'tabAuthSaveEmbedCredsCheck', 4);
        this._cancelButton$2 = spiff.StyledButton.createStyledButton(ss.Delegate.create(this, this._cancelClicked$2), tab.Strings.AuthSaveButtonCancel, 'tabAuthSaveCancelButton', 6);
        this._saveButton$2 = spiff.StyledButton.createStyledButton(ss.Delegate.create(this, this._saveClicked$2), tab.Strings.AuthSaveButtonSave, 'tabAuthSaveSaveButton', 5);
        if (ss.isValue(this.saveViewModel.get_saveWarning())) {
            this.get_element().append($('<div>').addClass('tabAuthSaveWarning').append($('<div>').addClass('tabAuthSaveWarningIcon')).append($('<div>').addClass('tabAuthSaveWarningText').text(this.saveViewModel.get_saveWarning())));
        }
        this.get_element().append($('<table>').addClass('tabAuthSaveLayoutTable').append($('<tr>').append($('<td>').append($('<div>').addClass('tabAuthSaveLabel').text(tab.Strings.AuthSaveLabelName)))).append($('<tr>').append($('<td>').append($('<div>').addClass('tabAuthSaveNameRowValue').append(this._nameDom$2)))).append($('<tr>').append($("<td class='tabAuthSaveProject'>").append($('<div>').addClass('tabAuthSaveLabel').text(tab.Strings.AuthSaveLabelProject)))).append($('<tr>').append($('<td>').append(this._projectsView$2.get_element()))).append($('<tr>').append($("<td class='tabAuthFirstSaveOption'>").append($('<div>').addClass('tabAuthSaveOption').append(this._showTabsDom$2)))).append($('<tr>').append($('<td>').append($('<div>').addClass('tabAuthSaveOption').append(this._embedCredentialsDom$2)))));
        this.get_element().append($('<div>').addClass('tabAuthSaveButtons').append(this._saveButton$2.get_element()).append(this._cancelButton$2.get_element()));
    },
    
    _handleDialogKeydown$2: function tab_SaveView$_handleDialogKeydown$2(e) {
        switch (e.which) {
            case 13:
                e.preventDefault();
                e.stopPropagation();
                this.saveViewModel.save();
                break;
        }
    },
    
    _saveClicked$2: function tab_SaveView$_saveClicked$2() {
        this.saveViewModel.save();
    },
    
    _cancelClicked$2: function tab_SaveView$_cancelClicked$2() {
        this.saveViewModel.cancelled();
        this.saveViewModel.hide();
    },
    
    _hidden$2: function tab_SaveView$_hidden$2() {
        if (ss.isValue(this._modalDialog$2)) {
            spiff.ClickBuster.remove_clickBustDetected(ss.Delegate.create(this, this._handleClickBust$2));
            this._modalDialog$2.remove_closed(ss.Delegate.create(this, this._handleDialogClosed$2));
            this._modalDialog$2.close();
            this.get_element().detach();
            this._modalDialog$2.dispose();
        }
        this._modalDialog$2 = null;
    },
    
    _shown$2: function tab_SaveView$_shown$2() {
        this._modalDialog$2 = new spiff.ModalDialog(tab.Strings.AuthSaveTitle, this.get_element());
        this._modalDialog$2.enableTextSelection();
        this._modalDialog$2.set_setFocusOnShow(true);
        this._modalDialog$2.get_element().keydown(ss.Delegate.create(this, this._handleDialogKeydown$2));
        this._modalDialog$2.add_closed(ss.Delegate.create(this, this._handleDialogClosed$2));
        this._modalDialog$2.show();
    },
    
    _handleClickBust$2: function tab_SaveView$_handleClickBust$2(e) {
        if (ss.isValue(this._modalDialog$2)) {
            this._modalDialog$2.setInitialFocus();
            spiff.ClickBuster.remove_clickBustDetected(ss.Delegate.create(this, this._handleClickBust$2));
        }
    },
    
    _handleDialogClosed$2: function tab_SaveView$_handleDialogClosed$2(o, a) {
        this.saveViewModel.cancelled();
        this.saveViewModel.hide();
    },
    
    _embedCredentialsChanged$2: function tab_SaveView$_embedCredentialsChanged$2(e) {
        this.saveViewModel.set_embedCredentials($(e.target).prop('checked'));
    },
    
    _showTabsChanged$2: function tab_SaveView$_showTabsChanged$2(e) {
        this.saveViewModel.set_showTabs($(e.target).prop('checked'));
    },
    
    _nameChanged$2: function tab_SaveView$_nameChanged$2(e) {
        this.saveViewModel.set_workbookName(this._nameDom$2.val());
    },
    
    _projectsSelectedItemChanged$2: function tab_SaveView$_projectsSelectedItemChanged$2(arg) {
        this.saveViewModel.set_currentProject((ss.isValue(arg)) ? arg.get_data() : null);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataSchemaView

tab.DataSchemaView = function tab_DataSchemaView(viewModel) {
    this.perInitDisposables = new tab.DisposableHolder();
    this._expandedFields$2 = {};
    tab.DataSchemaView.initializeBase(this, [ viewModel, new tab.SchemaViewerTemplate() ]);
    this.dom = this.get_template();
    if (tab.FeatureFlags.isEnabled('AnalyticsPane') && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
        this.dom.sourcesHeader.css('display', 'none');
    }
    else {
        this.dom.sourcesHeader.text(tab.Strings.AuthSchemaViewerHeaderData);
    }
    this.dom.headers['dimensions'].text(tab.Strings.AuthSchemaViewerHeaderDimensions);
    this.dom.headers['measure'].text(tab.Strings.AuthSchemaViewerHeaderMeaures);
    this.dom.headers['groups'].text(tab.Strings.AuthSchemaViewerHeaderSets);
    this.dom.headers['parameters'].text(tab.Strings.AuthSchemaViewerHeaderParameters);
    this.get_dataSchemaViewModel().add_dataSchemaModified(ss.Delegate.create(this, this.initFromModel));
    this.get_dataSchemaViewModel().add_dataSourceListChanged(ss.Delegate.create(this, this._updateDataSourceList$2));
    this.get_dataSchemaViewModel().add_nodeActivated(ss.Delegate.create(this, this.ensureNodeIsVisible));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.get_dataSchemaViewModel().remove_dataSchemaModified(ss.Delegate.create(this, this.initFromModel));
        this.get_dataSchemaViewModel().remove_dataSourceListChanged(ss.Delegate.create(this, this._updateDataSourceList$2));
        this.get_dataSchemaViewModel().remove_nodeActivated(ss.Delegate.create(this, this.ensureNodeIsVisible));
    })));
    spiff.DragDropManager.attachDropTarget(this.dom.sections['dimensions'], this.get_dataSchemaViewModel().get_dimensionDropTarget());
    spiff.DragDropManager.attachDropTarget(this.dom.sections['measure'], this.get_dataSchemaViewModel().get_measureDropTarget());
    spiff.DragDropManager.attachDropTarget(this.dom.get_domRoot(), this.get_dataSchemaViewModel().get_schemaDropTarget());
    this.get_dataSchemaViewModel().get_schemaDropTarget().add_dropStateChanged(ss.Delegate.create(this, this._handleSchemaDropStateChange$2));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.get_dataSchemaViewModel().get_schemaDropTarget().remove_dropStateChanged(ss.Delegate.create(this, this._handleSchemaDropStateChange$2));
    })));
    if (tab.FeatureFlags.isEnabled('NonModalCalculationDialog')) {
        this._contextMenuButton$2 = new spiff.ToggleButton($("<span><span class='icon'/></span>"));
        this._contextMenuButton$2.get_element().addClass('tab-schema-menu-button');
        this.dom.headers['dimensions'].append(this._contextMenuButton$2.get_element());
        this._contextMenuButton$2.add_click(ss.Delegate.create(this, this._contextMenuButtonClicked$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._contextMenuButton$2.remove_click(ss.Delegate.create(this, this._contextMenuButtonClicked$2));
        })));
        this.disposables.add(this._contextMenuButton$2);
    }
    tab.DataSchemaViewModel.sectionsInOrder.forEach(ss.Delegate.create(this, function(section) {
        spiff.DragDropManager.attachDragSource(this.dom.sections[section], this.get_dataSchemaViewModel().createDragSource());
    }));
}
tab.DataSchemaView.prototype = {
    dom: null,
    _contextMenuButton$2: null,
    lastSelected: null,
    _shiftSelectRange$2: null,
    _dataSourceTitles$2: null,
    
    get_dataSchemaViewModel: function tab_DataSchemaView$get_dataSchemaViewModel() {
        return this.get_viewModel();
    },
    
    get_width: function tab_DataSchemaView$get_width() {
        return this.dom.get_domRoot().width();
    },
    set_width: function tab_DataSchemaView$set_width(value) {
        this.dom.get_domRoot().width(value);
        return value;
    },
    
    get_maxDesiredWidth: function tab_DataSchemaView$get_maxDesiredWidth() {
        var minResult = 0;
        this.dom.contentArea.find('.tab-schema-field-label-area').each(function(index, e) {
            if (e.clientWidth > minResult) {
                minResult = e.clientWidth;
            }
        });
        return minResult + 22;
    },
    
    get_allElements: function tab_DataSchemaView$get_allElements() {
        return this.dom.get_schemaElements().toArray();
    },
    
    get_dataSourceTitles: function tab_DataSchemaView$get_dataSourceTitles() {
        return this._dataSourceTitles$2;
    },
    
    dispose: function tab_DataSchemaView$dispose() {
        this.perInitDisposables.dispose();
        tab.DataSchemaView.callBaseMethod(this, 'dispose');
    },
    
    findFieldTemplate: function tab_DataSchemaView$findFieldTemplate(node) {
        var field = null;
        this.dom.get_schemaElements().each(function(index, e) {
            var ft = tab.FieldTemplate.fromDom($(e));
            if (ft.get_node() === node) {
                field = ft;
                return false;
            }
            return true;
        });
        return field;
    },
    
    initFromModel: function tab_DataSchemaView$initFromModel() {
        tab.Log.get(this).debug('InitFromModel');
        this.perInitDisposables.dispose();
        this._initDataSources$2();
        tab.DataSchemaViewModel.sectionsInOrder.forEach(ss.Delegate.create(this, function(section) {
            this._initSection$2(section);
        }));
    },
    
    fieldExpanded: function tab_DataSchemaView$fieldExpanded(field, expanded) {
    },
    
    ensureNodeIsVisible: function tab_DataSchemaView$ensureNodeIsVisible(node) {
        var field = this.findFieldTemplate(node);
        if (field == null) {
            tab.Log.get(this).debug('Unable to find node for field: %s', node.displayName);
            return;
        }
        this.scrollFieldIntoView(field);
    },
    
    scrollFieldIntoView: function tab_DataSchemaView$scrollFieldIntoView(field) {
        var currentScrollTop = this.get_scrollTop();
        var viewportHeight = this.dom.contentAreaScroll.height();
        var fieldTop = field.get_domRoot().position().top;
        var fieldBottom = fieldTop + field.get_domRoot().height();
        var newScrollTop = null;
        if (fieldTop < 0) {
            newScrollTop = currentScrollTop + fieldTop - 10;
        }
        else if (fieldBottom > viewportHeight) {
            newScrollTop = currentScrollTop + fieldBottom - viewportHeight + 10;
        }
        if (!ss.isValue(newScrollTop)) {
            return;
        }
        tab.Log.get(this).debug('Scrolling field into view: %s', field.get_node().displayName);
        this.set_scrollTop(newScrollTop);
    },
    
    onViewModelPropertyChanged: function tab_DataSchemaView$onViewModelPropertyChanged(sender, e) {
        tab.DataSchemaView.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
        if (e.get_propertyName() === 'SelectedField') {
            this._handleFieldSelectionChange$2();
        }
    },
    
    _handleSchemaDropStateChange$2: function tab_DataSchemaView$_handleSchemaDropStateChange$2(state) {
        this.dom.dropInviteElements.toggle(state === 1);
    },
    
    _contextMenuButtonClicked$2: function tab_DataSchemaView$_contextMenuButtonClicked$2() {
        this._contextMenuButton$2.set_selected(true);
        this.get_dataSchemaViewModel().showContextMenu(this._contextMenuButton$2.get_element(), ss.Delegate.create(this, this._handleContextMenuHidden$2));
    },
    
    _handleContextMenuHidden$2: function tab_DataSchemaView$_handleContextMenuHidden$2() {
        this._contextMenuButton$2.set_selected(false);
    },
    
    _handleFieldSelectionChange$2: function tab_DataSchemaView$_handleFieldSelectionChange$2() {
        tab.Log.get(this).debug('FieldSelectionChange start. Clearing selected class on all fields');
        this.dom.get_domRoot().find('.selected').removeClass('selected');
        if (this.get_dataSchemaViewModel().hasSelection()) {
            tab.Log.get(this).debug('For each selected field, Adding selected class. Fields are : %o', this.get_dataSchemaViewModel().get_selectedFields());
            this.dom.get_schemaElements().each(ss.Delegate.create(this, function(index, e) {
                var t = tab.FieldTemplate.fromDom($(e));
                if (ss.isValue(t) && this.get_dataSchemaViewModel().isSelected(t.get_node())) {
                    tab.Log.get(this).debug('Selecting %s', t.get_node().globalFieldName);
                    if (!t.get_node().isUnsortedContainer) {
                        t.pill.addClass('selected');
                    }
                    else {
                        t.name.addClass('selected');
                    }
                }
                return true;
            }));
        }
        else {
            tab.Log.get(this).debug('There is no selection.');
            this.lastSelected = null;
        }
    },
    
    _handleExpandoClick$2: function tab_DataSchemaView$_handleExpandoClick$2(e) {
        var fieldObj = $(e.target).parents('.tab-schema-field').first();
        var template = tab.FieldTemplate.fromDom(fieldObj);
        var field = template.get_node();
        if (ss.isValue(field) && field.canHaveChildren) {
            this._setFieldExpandedState$2(template, template.expandoIcon.hasClass('tab-schema-collapsed'), true);
        }
    },
    
    _setFieldExpandedState$2: function tab_DataSchemaView$_setFieldExpandedState$2(field, expand, animate) {
        this._expandedFields$2[field.get_node().get_comparisonKey()] = expand;
        var onComplete = ss.Delegate.create(this, function() {
            this.fieldExpanded(field, expand);
        });
        if (expand) {
            if (ss.isValue(field.deferredCreateChildren)) {
                field.deferredCreateChildren();
                field.deferredCreateChildren = null;
            }
            if (animate) {
                field.children.slideDown('fast', onComplete);
            }
            else {
                field.children.show();
            }
        }
        else {
            if (animate) {
                field.children.slideUp('fast', onComplete);
            }
            else {
                field.children.hide();
            }
        }
        if (field.get_node().isCubeFolder) {
            field.icon.toggleClass('tab-schema-cube-d-folder-closed-icon', !expand).toggleClass('tab-schema-cube-d-folder-open-icon', expand);
        }
        else if (field.get_node().isFolder) {
            field.icon.toggleClass('tab-schema-folder-closed-icon', !expand).toggleClass('tab-schema-folder-open-icon', expand);
        }
        field.expandoIcon.toggleClass('tab-schema-expanded', expand).toggleClass('tab-schema-collapsed', !expand);
    },
    
    _createFieldTemplate$2: function tab_DataSchemaView$_createFieldTemplate$2(node) {
        var template = new tab.FieldTemplate();
        template.set_node(node);
        template.get_domRoot().addClass('tab-field-column').attr('title', node.tooltip);
        template.name.text(node.displayName);
        this._setFieldIcon$2(template, node);
        return template;
    },
    
    _attachNodeEventHandlers$2: function tab_DataSchemaView$_attachNodeEventHandlers$2(node, field, ft, isHidden) {
        if (field.isSelectable || node.children.length > 0) {
            var dragField = field.childToSelect;
            this.attachFieldEventHandlers(ft.get_node(), dragField, ft, isHidden);
        }
    },
    
    toggleSelection: function tab_DataSchemaView$toggleSelection(node, selectedFieldElement) {
        if (this.get_dataSchemaViewModel().isSelected(node)) {
            this.get_dataSchemaViewModel().deSelectNode(node);
        }
        else {
            this.get_dataSchemaViewModel().addNodeToSelection(node);
            this.lastSelected = selectedFieldElement;
        }
    },
    
    _shiftSelect$2: function tab_DataSchemaView$_shiftSelect$2(selectedFieldElement) {
        if (ss.isNullOrUndefined(this.lastSelected) || ss.isNullOrUndefined(selectedFieldElement)) {
            return;
        }
        var elements = this.get_allElements();
        var selectedFieldIndex = elements.indexOf(selectedFieldElement);
        var lastSelectedFieldIndex = elements.indexOf(this.lastSelected);
        var newSelectionRangeLower = Math.min(selectedFieldIndex, lastSelectedFieldIndex);
        var newSelectionRangeUpper = Math.max(selectedFieldIndex, lastSelectedFieldIndex);
        if (this._shouldAddNewNodesToSelection$2(newSelectionRangeLower, newSelectionRangeUpper)) {
            if (ss.isValue(this._shiftSelectRange$2)) {
                newSelectionRangeLower = Math.min(newSelectionRangeLower, this._shiftSelectRange$2.first);
                newSelectionRangeUpper = Math.max(newSelectionRangeUpper, this._shiftSelectRange$2.second);
            }
            this._addNodesToSelection$2(newSelectionRangeLower, newSelectionRangeUpper);
        }
        else {
            this._removeNodesNotInRange$2(newSelectionRangeLower, newSelectionRangeUpper);
        }
    },
    
    _shouldAddNewNodesToSelection$2: function tab_DataSchemaView$_shouldAddNewNodesToSelection$2(lowIndex, highIndex) {
        return ss.isNullOrUndefined(this._shiftSelectRange$2) || (this._shiftSelectRange$2.first > lowIndex || this._shiftSelectRange$2.second < highIndex);
    },
    
    _addNodesToSelection$2: function tab_DataSchemaView$_addNodesToSelection$2(newLower, newUpper) {
        var numElements = this.get_allElements().length;
        if (newLower < 0 || newUpper < 0 || newLower >= numElements || newUpper >= numElements) {
            return;
        }
        var selectedNodes = [];
        var elements = this.get_allElements();
        for (var i = newLower; i <= newUpper; i++) {
            var currentNode = tab.FieldTemplate.fromDom($(elements[i])).get_node();
            selectedNodes.add(currentNode);
        }
        this._shiftSelectRange$2 = new ss.Tuple(newLower, newUpper);
        this.get_dataSchemaViewModel().addNodesToSelection(selectedNodes);
    },
    
    _removeNodesNotInRange$2: function tab_DataSchemaView$_removeNodesNotInRange$2(newSelectionLowIndex, newSelectionHighIndex) {
        var removeFromSelection = [];
        var elements = this.get_allElements();
        for (var i = this._shiftSelectRange$2.first; i <= this._shiftSelectRange$2.second; i++) {
            if (i < newSelectionLowIndex || i > newSelectionHighIndex) {
                var currentNode = tab.FieldTemplate.fromDom($(elements[i])).get_node();
                removeFromSelection.add(currentNode);
            }
        }
        this._shiftSelectRange$2 = new ss.Tuple(newSelectionLowIndex, newSelectionHighIndex);
        this.get_dataSchemaViewModel().deSelectNodes(removeFromSelection);
    },
    
    attachSelectionEventHandler: function tab_DataSchemaView$attachSelectionEventHandler(ft) {
        ft.getLabelClickHandler(this.perInitDisposables).onPress(ss.Delegate.create(this, function(queryEvent) {
            var selectedFieldElement = ft.get_domRoot().get(0);
            if (queryEvent.shiftKey) {
                if (ss.isValue(this.lastSelected) && this.get_dataSchemaViewModel().hasSelection()) {
                    this._shiftSelect$2(selectedFieldElement);
                }
                else {
                    this.get_dataSchemaViewModel().clearAllAndSelect(ft.get_node());
                }
                this.lastSelected = selectedFieldElement;
            }
            else if (queryEvent.ctrlKey || (tab.BrowserSupport.get_isMac() && queryEvent.metaKey)) {
                this.toggleSelection(ft.get_node(), selectedFieldElement);
                this._shiftSelectRange$2 = null;
            }
            else if (!this.get_dataSchemaViewModel().isSelected(ft.get_node())) {
                this._restartSelection$2(ft);
            }
        })).onClick(ss.Delegate.create(this, function(queryEvent) {
            if (!queryEvent.shiftKey && !queryEvent.ctrlKey) {
                this._restartSelection$2(ft);
            }
        })).onRightClick(ss.Delegate.create(this, function(queryEvent) {
            if (!this.get_dataSchemaViewModel().isSelected(ft.get_node())) {
                this._restartSelection$2(ft);
            }
        }));
    },
    
    _restartSelection$2: function tab_DataSchemaView$_restartSelection$2(ft) {
        this.get_dataSchemaViewModel().clearAllAndSelect(ft.get_node());
        this.lastSelected = ft.get_domRoot().get(0);
        this._shiftSelectRange$2 = null;
    },
    
    attachFieldEventHandlers: function tab_DataSchemaView$attachFieldEventHandlers(field, dragField, ft, isHidden) {
        if (!isHidden) {
            if (field.isDraggable) {
                ft.labelArea.dblclick(ss.Delegate.create(this, function() {
                    this.get_dataSchemaViewModel().addFieldToSheet(dragField);
                }));
            }
            else if (field.isUnsortedContainer) {
                ft.getLabelClickHandler(this.perInitDisposables).onDoubleClick(ss.Delegate.create(this, this._handleExpandoClick$2));
            }
        }
        this.attachSelectionEventHandler(ft);
        if (field.canHaveChildren) {
            ft.getExpandoClickHandler(this.perInitDisposables).onPress(ss.Delegate.create(this, this._handleExpandoClick$2));
        }
    },
    
    _getPillClass$2: function tab_DataSchemaView$_getPillClass$2(type, isHidden) {
        if (isHidden) {
            return 'tab-schema-field-pill-inactive';
        }
        switch (type) {
            case 'quantitative':
                return 'tab-schema-field-pill-measure';
            case 'ordinal':
            case 'nominal':
            default:
                return 'tab-schema-field-pill-dimension';
        }
    },
    
    _buildDomForNode$2: function tab_DataSchemaView$_buildDomForNode$2(parentDom, node, parentIsHidden) {
        var nodeTemplate = this._createFieldTemplate$2(node);
        if (node.isSelectable) {
            nodeTemplate.pill.addClass(this._getPillClass$2(node.fieldType, parentIsHidden));
        }
        if (!node.hasContextMenu) {
            nodeTemplate.menuButton.hide();
        }
        if (node.isGenerated && !node.children.length) {
            nodeTemplate.get_domRoot().addClass('tab-field-generated');
        }
        if (node.isHierarchyRoot && node.children.length > 0) {
            nodeTemplate.name.addClass('tab-schema-dimension-label');
        }
        if (node.isGroup) {
            nodeTemplate.get_domRoot().add('tab-set');
        }
        if (this.get_dataSchemaViewModel().isSelected(node)) {
            if (!node.isUnsortedContainer) {
                nodeTemplate.pill.addClass('selected');
            }
            else {
                nodeTemplate.name.addClass('selected');
            }
        }
        var shouldHide = parentIsHidden || node.isHidden;
        if (shouldHide) {
            nodeTemplate.name.addClass('tab-schema-field-hidden');
        }
        if (node.children.length > 0) {
            var expanded = (this._expandedFields$2[node.get_comparisonKey()] || false);
            var createChildren = ss.Delegate.create(this, function() {
                var $enum1 = ss.IEnumerator.getEnumerator(node.children);
                while ($enum1.moveNext()) {
                    var childNode = $enum1.current;
                    this._buildDomForNode$2(nodeTemplate.children, childNode, shouldHide);
                }
            });
            if (expanded) {
                createChildren();
            }
            else {
                nodeTemplate.deferredCreateChildren = createChildren;
                nodeTemplate.children.hide();
            }
            this._setFieldExpandedState$2(nodeTemplate, expanded, false);
        }
        else {
            nodeTemplate.children.hide();
        }
        this._attachNodeEventHandlers$2(node, node, nodeTemplate, shouldHide);
        parentDom.append(nodeTemplate.get_domRoot());
    },
    
    _initSection$2: function tab_DataSchemaView$_initSection$2(section) {
        var pane = this.dom.sections[section];
        var roots = this.get_dataSchemaViewModel().nodeTreeForSection(section);
        pane.empty();
        var $enum1 = ss.IEnumerator.getEnumerator(roots);
        while ($enum1.moveNext()) {
            var node = $enum1.current;
            this._buildDomForNode$2(pane, node, node.isHidden);
        }
        var visible = true;
        if (section === 'groups' || section === 'parameters') {
            visible = roots.length > 0;
        }
        pane.toggle(visible);
        this.dom.headers[section].toggle(visible);
        var hasChildren = roots.some(function(node) {
            return node.children.length > 0;
        });
        pane.toggleClass('tab-schema-has-hierarchies', hasChildren);
        pane.toggleClass('tab-schema-no-hierarchies', !hasChildren);
    },
    
    _initDataSources$2: function tab_DataSchemaView$_initDataSources$2() {
        this._dataSourceTitles$2 = [];
        var $enum1 = ss.IEnumerator.getEnumerator(this.get_dataSchemaViewModel().get_selectableDataSources());
        while ($enum1.moveNext()) {
            var source = $enum1.current;
            var template = new tab.DataSourceTemplate();
            template.get_domRoot().prop('title', source.get_caption());
            template.get_domRoot().prop('DataSource', source);
            this._updateDataSourceTitle$2(template, source);
            this.perInitDisposables.add(spiff.TableauClickHandler.target(template.get_domRoot()[0]).onClick(this._createDataSourceClickHandler$2(source)));
            this.get_dataSourceTitles().add(template);
        }
        this.get_dataSourceTitles().sort(function(a, b) {
            return a.name.text().localeCompare(b.name.text());
        });
        this.dom.sourceTitles.empty();
        this.get_dataSourceTitles().forEach(ss.Delegate.create(this, function(template) {
            this.dom.sourceTitles.append(template.get_domRoot());
        }));
        var refreshButton = new spiff.IconButton();
        refreshButton.setIcon('tabAuthDataRefreshIcon');
        refreshButton.set_hoverTooltipText(tab.Strings.ToolbarRefreshData);
        refreshButton.addClass('tabDataRefresh');
        refreshButton.add_click(ss.Delegate.create((this.get_viewModel()), (this.get_viewModel()).refreshButtonClicked));
        this.perInitDisposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            refreshButton.remove_click(ss.Delegate.create((this.get_viewModel()), (this.get_viewModel()).refreshButtonClicked));
        })));
        this.dom.refreshButtonArea.empty();
        this.dom.refreshButtonArea.append(refreshButton.get_element());
    },
    
    _updateDataSourceList$2: function tab_DataSchemaView$_updateDataSourceList$2() {
        var $enum1 = ss.IEnumerator.getEnumerator(this.get_dataSourceTitles());
        while ($enum1.moveNext()) {
            var dataSourceTitle = $enum1.current;
            var source = _.find(this.get_dataSchemaViewModel().get_selectableDataSources(), function(model) {
                return dataSourceTitle.get_domRoot().prop('DataSource') === model;
            });
            if (ss.isValue(source)) {
                this._updateDataSourceTitle$2(dataSourceTitle, source);
            }
        }
    },
    
    _updateDataSourceTitle$2: function tab_DataSchemaView$_updateDataSourceTitle$2(template, source) {
        var sheetSchema = this.get_dataSchemaViewModel().get_currentSheetSchema();
        var iconMap = sheetSchema.datasourceIcons;
        template.name.text(source.get_caption());
        template.icon.removeClass();
        template.icon.addClass('tab-schema-dataSourceIcon');
        template.icon.addClass(tab.IconUtils.getDataSourceIcon(iconMap, source));
        var canSelect = this.get_dataSchemaViewModel().get_selectableDataSources().length > 1;
        if (canSelect && source === this.get_dataSchemaViewModel().get_selectedDataSource()) {
            template.get_domRoot().addClass('tab-schema-dataSourceSelected');
        }
    },
    
    _createDataSourceClickHandler$2: function tab_DataSchemaView$_createDataSourceClickHandler$2(source) {
        return ss.Delegate.create(this, function() {
            this.get_dataSchemaViewModel().set_selectedDataSource(source);
        });
    },
    
    _setFieldIcon$2: function tab_DataSchemaView$_setFieldIcon$2(ft, f) {
        if (ss.isNullOrUndefined(f.fieldIconResource) || !f.fieldIconResource.length) {
            ft.iconArea.toggleClass('no-icon', true);
            return;
        }
        ft.iconArea.toggleClass('no-icon', false);
        ft.icon.addClass(tab.IconUtils.getFieldIcon(f));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataSourceTemplate

tab.DataSourceTemplate = function tab_DataSourceTemplate() {
    tab.DataSourceTemplate.initializeBase(this, [ $("<div class='tab-dataSource'><div class='tab-schema-dataSourceIcon'/><div class='tab-schema-dataSourceName'/></div>") ]);
    this.icon = this.getElementBySelector('.tab-schema-dataSourceIcon');
    this.name = this.getElementBySelector('.tab-schema-dataSourceName');
}
tab.DataSourceTemplate.prototype = {
    icon: null,
    name: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.FieldTemplate

tab.FieldTemplate = function tab_FieldTemplate() {
    tab.FieldTemplate.initializeBase(this, [ $(tab.FieldTemplate.template) ]);
    this.get_domRoot().data('FieldTemplate', this);
    this.icon = this.getElementBySelector('.tab-schema-field-icon');
    this.iconArea = this.getElementBySelector('.tab-schema-field-icon-area');
    this.name = this.getElementBySelector('.tab-schema-field-label');
    this.children = this.getElementBySelector('.tab-schema-field-children');
    this.expandoIcon = this.getElementBySelector('.tab-schema-field-expando-icon');
    this.labelArea = this.getElementBySelector('.tab-schema-field-label-area');
    this.pill = this.getElementBySelector('.tab-schema-field-pill');
    this.menuButton = this.getElementBySelector('.tab-schema-field-pill-menu-btn');
    if (!tab.FeatureFlags.isEnabled('NonModalCalculationDialog')) {
        this.pill.addClass('disablecontextmenu');
    }
}
tab.FieldTemplate.fromDom = function tab_FieldTemplate$fromDom(dom) {
    return dom.data('FieldTemplate');
}
tab.FieldTemplate.prototype = {
    expandoIcon: null,
    icon: null,
    iconArea: null,
    name: null,
    labelArea: null,
    children: null,
    pill: null,
    menuButton: null,
    deferredCreateChildren: null,
    _menuClickHandler$1: null,
    _labelClickHandler$1: null,
    _expandoClickHandler$1: null,
    
    get_node: function tab_FieldTemplate$get_node() {
        return this.get_domRoot().data('Node');
    },
    set_node: function tab_FieldTemplate$set_node(value) {
        this.get_domRoot().data('Node', value);
        return value;
    },
    
    firstChild: function tab_FieldTemplate$firstChild() {
        return tab.FieldTemplate.fromDom(this.children.find('.tab-schema-field').first());
    },
    
    getMenuClickHandler: function tab_FieldTemplate$getMenuClickHandler(d) {
        if (ss.isNullOrUndefined(this._menuClickHandler$1)) {
            this._menuClickHandler$1 = spiff.TableauClickHandler.target(this.menuButton[0]);
            d.add(this._menuClickHandler$1);
        }
        return this._menuClickHandler$1;
    },
    
    getExpandoClickHandler: function tab_FieldTemplate$getExpandoClickHandler(d) {
        if (ss.isNullOrUndefined(this._expandoClickHandler$1)) {
            this._expandoClickHandler$1 = spiff.TableauClickHandler.target(this.expandoIcon[0]);
            d.add(this._expandoClickHandler$1);
        }
        return this._expandoClickHandler$1;
    },
    
    getLabelClickHandler: function tab_FieldTemplate$getLabelClickHandler(d) {
        if (ss.isNullOrUndefined(this._labelClickHandler$1)) {
            this._labelClickHandler$1 = spiff.TableauClickHandler.target(this.labelArea[0]);
            d.add(this._labelClickHandler$1);
        }
        return this._labelClickHandler$1;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SchemaViewerTemplate

tab.SchemaViewerTemplate = function tab_SchemaViewerTemplate() {
    this.sections = {};
    this.headers = {};
    tab.SchemaViewerTemplate.initializeBase(this, [ $("\n<div class='tab-schemaViewer'>\n  <div class='tab-schemaViewerScroll'>\n      <div class='tab-schemaViewerContentArea'>\n        <div class='tab-schemaHeader tab-schemaDataSourcesHeader'>Data</div>\n        <div class='tab-dataSources'>\n            <div class='tab-dataSourceTitles'/>\n            <div class='tab-dataRefreshButtonArea'/>\n        </div>\n        <div class='tab-schemaHeader tab-schemaDimensionsHeader'>Dimensions</div>\n        <div class='tab-schemaDimensions'><div class='tab-schemaViewerContent'></div></div>\n        <div class='tab-schemaHeader tab-schemaMeasuresHeader'>Measures</div>\n        <div class='tab-schemaMeasures'><div class='tab-schemaViewerContent'></div></div>\n        <div class='tab-schemaHeader tab-schemaSetsHeader'>Sets</div>\n        <div class='tab-schemaSets'><div class='tab-schemaViewerContent'></div></div>\n        <div class='tab-schemaHeader tab-schemaParametersHeader'>Parameters</div>\n        <div class='tab-schemaParameters'><div class='tab-schemaViewerContent'></div></div>\n      </div>\n  </div>\n  <div class='tab-schemaDropInviteTop'></div>\n  <div class='tab-schemaDropInviteLeft'></div>\n  <div class='tab-schemaDropInviteBottom'></div>\n  <div class='tab-schemaDropInviteRight'></div>\n</div>") ]);
    this.sources = this.getElementBySelector('.tab-dataSources');
    this.sourceTitles = this.getElementBySelector('.tab-dataSourceTitles');
    this.refreshButtonArea = this.getElementBySelector('.tab-dataRefreshButtonArea');
    this.sections['dimensions'] = this.getElementBySelector('.tab-schemaDimensions .tab-schemaViewerContent');
    this.sections['measure'] = this.getElementBySelector('.tab-schemaMeasures .tab-schemaViewerContent');
    this.sections['groups'] = this.getElementBySelector('.tab-schemaSets .tab-schemaViewerContent');
    this.sections['parameters'] = this.getElementBySelector('.tab-schemaParameters .tab-schemaViewerContent');
    this.sourcesHeader = this.getElementBySelector('.tab-schemaDataSourcesHeader');
    this.headers['dimensions'] = this.getElementBySelector('.tab-schemaDimensionsHeader');
    this.headers['measure'] = this.getElementBySelector('.tab-schemaMeasuresHeader');
    this.headers['groups'] = this.getElementBySelector('.tab-schemaSetsHeader');
    this.headers['parameters'] = this.getElementBySelector('.tab-schemaParametersHeader');
    this.contentArea = this.getElementBySelector('.tab-schemaViewerContentArea');
    this.contentAreaScroll = this.getElementBySelector('.tab-schemaViewerScroll');
    this.dropInviteElements = this.getElementsBySelector('.tab-schemaDropInviteTop, .tab-schemaDropInviteLeft, .tab-schemaDropInviteBottom, .tab-schemaDropInviteRight');
}
tab.SchemaViewerTemplate.prototype = {
    sources: null,
    sourceTitles: null,
    refreshButtonArea: null,
    sourcesHeader: null,
    contentArea: null,
    contentAreaScroll: null,
    dropInviteElements: null,
    
    get_schemaElements: function tab_SchemaViewerTemplate$get_schemaElements() {
        return this.get_domRoot().find('.tab-schema-field');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShapePickerView

tab.ShapePickerView = function tab_ShapePickerView(viewModel, t) {
    tab.ShapePickerView.initializeBase(this, [ viewModel, t ]);
    this.dom = t;
    this.shapePickerViewModel = viewModel;
}
tab.ShapePickerView._getShapeClass$2 = function tab_ShapePickerView$_getShapeClass$2(m) {
    return 'tabShape-' + ((ss.isValue(m.get_palette())) ? m.get_palette().toString() : 'def') + '-' + m.get_shapeType();
}
tab.ShapePickerView.prototype = {
    dom: null,
    shapePickerViewModel: null,
    
    onViewModelPropertyChanged: function tab_ShapePickerView$onViewModelPropertyChanged(sender, e) {
        this.updateContent();
    },
    
    updateContent: function tab_ShapePickerView$updateContent() {
        this.dom.rows.children().remove();
        var row = null;
        var shapeNum = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(this.shapePickerViewModel.get_shapes());
        while ($enum1.moveNext()) {
            var shape = $enum1.current;
            if (row == null || shapeNum === this.shapePickerViewModel.get_shapesPerRow()) {
                row = $("<div class='tabAuthShapePickerRow'/>");
                this.dom.rows.append(row);
                shapeNum = 0;
            }
            spiff.ClickHandler.targetAndClick($("<span class='tabAuthShapePickerItem'/>").addClass(tab.ShapePickerView._getShapeClass$2(shape)).toggleClass('tabAuthShapeSelected', shape.equals(this.shapePickerViewModel.get_selectedShape())).data('tabShape', shape).appendTo(row), this._createClickHandler$2(shape));
            shapeNum++;
        }
    },
    
    _createClickHandler$2: function tab_ShapePickerView$_createClickHandler$2(shape) {
        return ss.Delegate.create(this, function() {
            this.shapePickerViewModel.set_selectedShape(shape);
        });
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShapePickerTemplate

tab.ShapePickerTemplate = function tab_ShapePickerTemplate() {
    tab.ShapePickerTemplate.initializeBase(this, [ $("<div class='tabAuthShapePicker'><div class='tabAuthShapePickerRows'/></div>") ]);
    this.rows = this.getElementBySelector('.tabAuthShapePickerRows');
}
tab.ShapePickerTemplate.prototype = {
    rows: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfView

tab.ShelfView = function tab_ShelfView(viewModel, t) {
    this._pillViews$3 = new tab.DisposableHolder();
    this._pillDividers$3 = [];
    tab.ShelfView.initializeBase(this, [ viewModel, t ]);
    this.shelfViewModel = viewModel;
    this.shelfViewModel.add_shelfChanged(ss.Delegate.create(this, this.initFromModel));
    this.shelfViewModel.add_dropStateChanged(ss.Delegate.create(this, this._dropStateChanged$3));
    this.shelfViewModel.add_dragOverDropPositionChanged(ss.Delegate.create(this, this._dragOverDropPositionChanged$3));
    this.shelfViewModel.add_openTypeInPill(ss.Delegate.create(this, this._openTypeInPill$3));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.shelfViewModel.remove_shelfChanged(ss.Delegate.create(this, this.initFromModel));
        this.shelfViewModel.remove_dropStateChanged(ss.Delegate.create(this, this._dropStateChanged$3));
        this.shelfViewModel.remove_dragOverDropPositionChanged(ss.Delegate.create(this, this._dragOverDropPositionChanged$3));
        this.shelfViewModel.remove_openTypeInPill(ss.Delegate.create(this, this._openTypeInPill$3));
    })));
    this.disposables.add(spiff.TableauClickHandler.target(this.get_element()[0]).onDoubleClick(ss.Delegate.create(viewModel, viewModel.insertAdHocCalc)));
    this.dom = t;
    spiff.DragDropManager.attachDropTarget(this.dom.dropTarget, viewModel);
}
tab.ShelfView.prototype = {
    shelfViewModel: null,
    dom: null,
    _targettedDivider$3: null,
    _typeInPill$3: null,
    _preferredHeight$3: 0,
    _preferredWidth$3: 0,
    
    get_preferredWidth: function tab_ShelfView$get_preferredWidth() {
        if (!this._preferredWidth$3) {
            this._updatePreferredSizes$3();
        }
        return this._preferredWidth$3;
    },
    
    get_scrollableContentPreferredHeight: function tab_ShelfView$get_scrollableContentPreferredHeight() {
        if (!this._preferredHeight$3) {
            this._updatePreferredSizes$3();
        }
        return this._preferredHeight$3;
    },
    
    get_typeInPillView: function tab_ShelfView$get_typeInPillView() {
        return this._typeInPill$3;
    },
    
    setScrollableContentActualHeight: function tab_ShelfView$setScrollableContentActualHeight(height) {
        this.dom.pillHolder.css('height', (ss.isValue(height)) ? (height + 'px') : '');
    },
    
    dispose: function tab_ShelfView$dispose() {
        this._pillViews$3.dispose();
        if (ss.isValue(this._typeInPill$3)) {
            this._typeInPill$3.dispose();
            this._typeInPill$3 = null;
        }
        tab.ShelfView.callBaseMethod(this, 'dispose');
    },
    
    onAddedToDom: function tab_ShelfView$onAddedToDom() {
        tab.ShelfView.callBaseMethod(this, 'onAddedToDom');
        this._updateDomAfterAdd$3();
    },
    
    ensureItemInView: function tab_ShelfView$ensureItemInView(item) {
        var horizontal = this.shelfViewModel.get_orientation() === 1;
        var posMin = (horizontal) ? item.position().left : item.position().top;
        var posMax = posMin + ((horizontal) ? item.outerWidth(true) : item.outerHeight(true));
        var containerSize = this.get_scrollContainerSize();
        if (posMin < 0) {
            this.set_scroll(posMin);
        }
        else if (posMax > containerSize) {
            this.set_scroll(this.get_scroll() + (posMax - containerSize + 10));
        }
    },
    
    _updateDomAfterAdd$3: function tab_ShelfView$_updateDomAfterAdd$3() {
        if (!this.get_addedToDom()) {
            return;
        }
        if (ss.isValue(this._typeInPill$3)) {
            this._typeInPill$3.onAddedToDom();
        }
        this._updatePreferredSizes$3();
        this._updateHorizontalOverflow$3();
        this._updateTypeInPillSize$3();
        this.raiseScrollContentChanged();
        if (ss.isValue(this._typeInPill$3)) {
            this.ensureItemInView(this._typeInPill$3.get_element());
        }
    },
    
    initFromModel: function tab_ShelfView$initFromModel(vm) {
        if (!ss.isValue(vm.get_pills())) {
            return;
        }
        this._pillViews$3.dispose();
        this.dom.pillContent.toggleClass('tabAuthPillsHorizOverflow', false);
        this.dom.get_clickSpacer().remove();
        this.dom.get_dividers().remove();
        this._pillDividers$3.clear();
        var anyExternalIcons = false;
        var typeInPillIndex = -1;
        var createdTypeInPill = false;
        if (this.shelfViewModel.get_hasTypeInPill()) {
            typeInPillIndex = this.shelfViewModel.get_typeInPillCalculation().get_shelfPosition();
            if (ss.isNullOrUndefined(this._typeInPill$3)) {
                createdTypeInPill = true;
                this._typeInPill$3 = spiff.ObjectRegistry.newView(tab.TypeInPillView, this.shelfViewModel.get_typeInPillCalculation());
            }
        }
        else if (ss.isValue(this._typeInPill$3)) {
            this._typeInPill$3.dispose();
            this._typeInPill$3 = null;
        }
        tab.Log.get(this).debug('InitFromModel: %s, %s pills, index=%s', vm.get_shelfType(), vm.get_pills().length, typeInPillIndex);
        var divider;
        var index = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(vm.get_pills());
        while ($enum1.moveNext()) {
            var pill = $enum1.current;
            if (this.shelfViewModel.get_supportsMultiplePills()) {
                divider = $(tab.ShelfCardTemplate.templatePillDivider);
                if (!index) {
                    divider.addClass('tabAuthShelfPillDividerFirst');
                }
                this.dom.pillContent.append(divider);
                this._pillDividers$3.add(divider);
                spiff.DragDropManager.attachDropTarget(divider, this.shelfViewModel.createPillDividerDropTarget(index));
            }
            if (index === typeInPillIndex) {
                if (createdTypeInPill) {
                    this._typeInPill$3.addToDom(this.dom.pillContent);
                }
                this._typeInPill$3.set_pillViewModel(pill);
            }
            else {
                var pv = spiff.ObjectRegistry.newView(tab.PillView, pill);
                this._pillViews$3.add(pv);
                if (index < typeInPillIndex && !createdTypeInPill) {
                    pv.get_element().insertBefore(this._typeInPill$3.get_element());
                }
                else {
                    this.dom.pillContent.append(pv.get_element());
                }
                anyExternalIcons = anyExternalIcons || pv.get_hasExternalIcon();
            }
            index++;
        }
        if (ss.isValue(vm.get_shelf())) {
            this.dom.get_domRoot().attr('title', vm.get_shelf().get_tooltip());
        }
        if (this.shelfViewModel.get_supportsMultiplePills()) {
            divider = $(tab.ShelfCardTemplate.templatePillDivider);
            this.dom.pillContent.append(divider);
            this._pillDividers$3.add(divider);
            spiff.DragDropManager.attachDropTarget(divider, this.shelfViewModel.createPillDividerDropTarget(index));
        }
        if (typeInPillIndex >= index) {
            if (createdTypeInPill) {
                this._typeInPill$3.addToDom(this.dom.pillContent);
            }
            this._typeInPill$3.set_pillViewModel(null);
        }
        if (this.shelfViewModel.get_supportsMultiplePills()) {
            var spacer = $(tab.ShelfCardTemplate.templateClickSpacer);
            this.dom.pillContent.append(spacer);
        }
        this.dom.get_dividers().hide();
        this.dom.pillContent.toggleClass('tabHasExternalIcon', anyExternalIcons);
        this._updateDomAfterAdd$3();
    },
    
    _openTypeInPill$3: function tab_ShelfView$_openTypeInPill$3(animate) {
        if (ss.isNullOrUndefined(this._typeInPill$3)) {
            return;
        }
        if (animate && this.shelfViewModel.get_orientation() === 1) {
            this._updatePreferredSizes$3();
            this._typeInPill$3.animateOpen(this._typeInPillStartWidth$3(), this._typeInPillMinWidth$3(), this._typeInPillMaxWidth$3());
        }
        else {
            this._typeInPill$3.onOpenCompleted();
        }
        this.ensureItemInView(this._typeInPill$3.get_element());
    },
    
    _updatePreferredSizes$3: function tab_ShelfView$_updatePreferredSizes$3() {
        this.dom.pillHolder.css('position', 'absolute');
        this._preferredHeight$3 = this.dom.pillContent.outerHeight(true);
        this._preferredWidth$3 = this.dom.pillContent.outerWidth(true);
        this.dom.pillHolder.css('position', 'relative');
    },
    
    _dragOverDropPositionChanged$3: function tab_ShelfView$_dragOverDropPositionChanged$3(arg) {
        if (ss.isValue(arg) && (arg.shelfDropAction || 'insert') === 'insert') {
            if (ss.isValue(arg.shelfPosIndex) && arg.shelfPosIndex < this._pillDividers$3.length) {
                var divider = this._pillDividers$3[arg.shelfPosIndex];
                if (this._targettedDivider$3 === divider) {
                    return;
                }
                if (ss.isValue(this._targettedDivider$3)) {
                    this.dom.placeholdersIn(this._targettedDivider$3).hide();
                }
                this.dom.placeholdersIn(divider).show();
                this._targettedDivider$3 = divider;
            }
        }
        else {
            this._targettedDivider$3 = null;
            this.dom.placeholdersIn(this.dom.pillHolder).hide();
        }
    },
    
    _dropStateChanged$3: function tab_ShelfView$_dropStateChanged$3(s) {
        switch (s) {
            case 0:
            case 2:
                if (ss.isValue(this._targettedDivider$3)) {
                    this.dom.placeholdersIn(this._targettedDivider$3).toggle('fast');
                    this._targettedDivider$3 = null;
                }
                this.dom.get_dividers().hide();
                break;
            case 1:
                this.dom.get_dividers().css('display', '');
                break;
        }
    },
    
    _updateHorizontalOverflow$3: function tab_ShelfView$_updateHorizontalOverflow$3() {
        var hadOverflow = this.dom.pillContent.hasClass('tabAuthPillsHorizOverflow');
        var needsOverflow = this.shelfViewModel.get_orientation() === 1 && this.get_preferredWidth() > this.dom.pillHolder.outerWidth();
        this.dom.pillContent.toggleClass('tabAuthPillsHorizOverflow', needsOverflow);
        if (hadOverflow !== needsOverflow) {
            this._updatePreferredSizes$3();
        }
    },
    
    _updateTypeInPillSize$3: function tab_ShelfView$_updateTypeInPillSize$3() {
        if (this.shelfViewModel.get_orientation() === 1 && ss.isValue(this._typeInPill$3)) {
            var minW = this._typeInPillMinWidth$3();
            var maxW = this._typeInPillMaxWidth$3();
            if (this.shelfViewModel.get_animateTypeInPillPending()) {
                var startW = this._typeInPillStartWidth$3();
                minW = startW;
                maxW = startW;
            }
            this._typeInPill$3.get_dom().get_domRoot().css('min-width', minW + 'px');
            this._typeInPill$3.get_dom().get_domRoot().css('max-width', maxW + 'px');
            this._updatePreferredSizes$3();
        }
    },
    
    _typeInPillMaxWidth$3: function tab_ShelfView$_typeInPillMaxWidth$3() {
        var pillsWidth = this.get_preferredWidth();
        if (ss.isValue(this._typeInPill$3)) {
            pillsWidth -= this._typeInPill$3.get_dom().get_domRoot().outerWidth();
        }
        var spaceRemaining = this.dom.pillContent.outerWidth() - pillsWidth - this.dom.get_clickSpacer().outerWidth();
        return Math.max(spaceRemaining, 108);
    },
    
    _typeInPillMinWidth$3: function tab_ShelfView$_typeInPillMinWidth$3() {
        return Math.min(this._typeInPillMaxWidth$3(), 250);
    },
    
    _typeInPillStartWidth$3: function tab_ShelfView$_typeInPillStartWidth$3() {
        var startWidth = 12;
        var editingExisting = this.shelfViewModel.get_typeInPillCalculation().get_shelfPosition() < this.shelfViewModel.get_pills().length;
        if (editingExisting) {
            var pills = this.dom.get_domRoot().find('.tabAuthShelfPill');
            startWidth = (ss.isValue(pills) && pills.length > 0) ? pills.first().outerWidth() : 148;
        }
        return startWidth;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfCardTemplate

tab.ShelfCardTemplate = function tab_ShelfCardTemplate() {
    tab.ShelfCardTemplate.initializeBase(this, [ $(tab.ShelfCardTemplate.template) ]);
    this.pillHolder = this.getElementBySelector('.tabAuthShelfPills');
    this.pillContent = this.getElementBySelector('.tabAuthShelfPillsContent');
    this.dropTarget = this.getElementBySelector('.tabAuthShelfDropTarget');
}
tab.ShelfCardTemplate.prototype = {
    pillHolder: null,
    pillContent: null,
    dropTarget: null,
    
    get_dividers: function tab_ShelfCardTemplate$get_dividers() {
        return this.getElementsBySelector('.tabAuthShelfPillDivider');
    },
    
    get_clickSpacer: function tab_ShelfCardTemplate$get_clickSpacer() {
        return this.getElementsBySelector('.tabAuthShelfClickArea');
    },
    
    placeholdersIn: function tab_ShelfCardTemplate$placeholdersIn(divider) {
        return divider.find('.tabAuthShelfPillDividerPlaceholder');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShowMeView

tab.ShowMeView = function tab_ShowMeView(viewModel) {
    this.perUpdateDisposables = new tab.DisposableHolder();
    tab.ShowMeView.initializeBase(this, [ viewModel, new spiff.Template($('<div/>').addClass('tabAuthShowMe')) ]);
    this.smViewModel = viewModel;
    this.smViewModel.initialize();
    this.smViewModel.add_propertyChanged(ss.Delegate.create(this, this.onViewModelPropertyChanged));
    this.smViewModel.set_closeOnInteraction(false);
}
tab.ShowMeView.prototype = {
    smViewModel: null,
    summaryDom: null,
    buttonsDom: null,
    
    onViewModelPropertyChanged: function tab_ShowMeView$onViewModelPropertyChanged(sender, e) {
        tab.ShowMeView.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
        if (e.get_propertyName() === 'ShowMeCommands') {
            this.updateCommands();
        }
    },
    
    initContent: function tab_ShowMeView$initContent() {
        this.summaryDom = $('<div/>').addClass('tabAuthShowMeSummary');
        this.buttonsDom = $('<div/>').addClass('tabAuthShowMeButtons');
        this.updateCommands();
        this.get_element().append(this.buttonsDom);
        this.get_element().append(this.summaryDom);
    },
    
    updateCommands: function tab_ShowMeView$updateCommands() {
        if (ss.isNullOrUndefined(this.buttonsDom)) {
            return;
        }
        this.buttonsDom.children().remove();
        this.perUpdateDisposables.dispose();
        var commandsWrapper = tab.CommandsPresModelWrapper.create(this.smViewModel.get_showMeCommands());
        var defaultRow = (commandsWrapper.get_defaultItem() || 0);
        var row = -1;
        var $enum1 = ss.IEnumerator.getEnumerator(commandsWrapper.get_commandItems());
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            var itemWrapper = tab.CommandItemWrapper.create(item);
            row++;
            if (itemWrapper.get_commandsType() === 'separator') {
                $('<div/>').addClass('tabAuthShowMeDivider').appendTo(this.buttonsDom);
                continue;
            }
            var parent = $('<div/>').addClass('tabAuthShowMeRow').appendTo(this.buttonsDom);
            if (ss.isNullOrUndefined(itemWrapper.get_commands())) {
                continue;
            }
            var subCommandsWrapper = tab.CommandsPresModelWrapper.create(itemWrapper.get_commands());
            var column = -1;
            var defaultColumn = (subCommandsWrapper.get_defaultItem() || 0);
            var $enum2 = ss.IEnumerator.getEnumerator(subCommandsWrapper.get_commandItems());
            while ($enum2.moveNext()) {
                var c = $enum2.current;
                column++;
                var obj = $('<span/>').addClass('tabAuthShowMeButton').appendTo(parent);
                if (column === defaultColumn && row === defaultRow) {
                    this.setActiveItem(c, obj);
                }
                this.attachEventHandlers(c, obj);
                this.setCommandIcon(c, obj);
            }
        }
    },
    
    updateDescription: function tab_ShowMeView$updateDescription(c) {
        this.summaryDom.children().remove().end().append(this._cleanUpDescription$2(tab.CommandItemWrapper.create(c).get_description()));
        if (tab.BrowserSupport.get_isIE() && tab.BrowserSupport.get_browserVersion() >= 9) {
            var body = $(document.body);
            body.css('z-index', '1').css('z-index', '0');
        }
    },
    
    setActiveItem: function tab_ShowMeView$setActiveItem(c, activeButton) {
        this.get_element().find('.active').removeClass('active');
        activeButton.addClass('active');
        this.updateDescription(c);
    },
    
    setCommandIcon: function tab_ShowMeView$setCommandIcon(c, obj) {
        var imgKey = this._classNameFromResourceKey$2(tab.CommandItemWrapper.create(c).get_iconRes());
        if (ss.isValue(imgKey)) {
            var iconResourceKey = imgKey;
            var commandEnabled = this.smViewModel.isCommandEnabled(c);
            obj.toggleClass('tabAuthShowMe-' + iconResourceKey, commandEnabled);
            obj.toggleClass('tabAuthShowMeDisabled-' + iconResourceKey, !commandEnabled);
        }
    },
    
    _cleanUpDescription$2: function tab_ShowMeView$_cleanUpDescription$2(description) {
        var iconRegex = new RegExp("<img src=['\"]([^'\"]*)['\"][^>]*>", 'g');
        var imageMatches = null;
        var imageKeys = [];
        do {
            imageMatches = iconRegex.exec(description);
            if (imageMatches != null) {
                imageKeys.push(imageMatches[1]);
            }
        } while (ss.isValue(imageMatches) && imageMatches.length > 0);
        description = description.replace(iconRegex, '<img>');
        var dom = $(description);
        if (dom[0].tagName.toUpperCase() === 'FONT') {
            dom = dom.children();
        }
        var images = dom.find('img');
        if (ss.isValue(images) && images.length > 0) {
            images.each(ss.Delegate.create(this, function(i, element) {
                var imageDiv = $(element);
                var imgKey = this._classNameFromResourceKey$2(imageKeys[i]);
                if (!String.isNullOrEmpty(imgKey)) {
                    imageDiv.replaceWith($('<span>').css('display', 'inline-block').addClass('tabAuthShowMeIcon-' + imgKey));
                }
            }));
        }
        return dom;
    },
    
    _classNameFromResourceKey$2: function tab_ShowMeView$_classNameFromResourceKey$2(input) {
        var iconRegex = new RegExp('/(\\w+)\\.png');
        var imgMatch = tab.TabResources.lookupFullResourceAlias(input).match(iconRegex);
        if (ss.isValue(imgMatch) && imgMatch.length >= 2) {
            return imgMatch[1];
        }
        return null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SidebarCollapsedWidget

tab.SidebarCollapsedWidget = function tab_SidebarCollapsedWidget() {
    tab.SidebarCollapsedWidget.initializeBase(this, [ $("<div class='tabAuthSchemaCollapsed'>\n                <div class='tabAuthSchemaCollapsed collapsedItems'>\n                </div>\n            </div>") ]);
    this.buttonHeader = this.get_element().find('.collapsedItems');
    this.contentArea = this.get_element().find('.tabAuthSchemaCollapsed');
    this._addButtonsToPanel$1();
    if (tab.BrowserSupport.get_isIE() && tab.BrowserSupport.get_browserVersion() < 9) {
        this._dataTabButton$1.addClass(this._ie678$1);
        this._analyticsTabButton$1.addClass(this._ie678$1);
        this._dataTabButton$1.get_labelElement().addClass(this._ie678$1);
        this._analyticsTabButton$1.get_labelElement().addClass(this._ie678$1);
    }
}
tab.SidebarCollapsedWidget.prototype = {
    _ie678$1: 'ie678',
    dom: null,
    buttonHeader: null,
    contentArea: null,
    _showButton$1: null,
    _dataTabButton$1: null,
    _analyticsTabButton$1: null,
    
    add_expandButtonClicked: function tab_SidebarCollapsedWidget$add_expandButtonClicked(value) {
        this.__expandButtonClicked$1 = ss.Delegate.combine(this.__expandButtonClicked$1, value);
    },
    remove_expandButtonClicked: function tab_SidebarCollapsedWidget$remove_expandButtonClicked(value) {
        this.__expandButtonClicked$1 = ss.Delegate.remove(this.__expandButtonClicked$1, value);
    },
    
    __expandButtonClicked$1: null,
    
    add_tabButtonClicked: function tab_SidebarCollapsedWidget$add_tabButtonClicked(value) {
        this.__tabButtonClicked$1 = ss.Delegate.combine(this.__tabButtonClicked$1, value);
    },
    remove_tabButtonClicked: function tab_SidebarCollapsedWidget$remove_tabButtonClicked(value) {
        this.__tabButtonClicked$1 = ss.Delegate.remove(this.__tabButtonClicked$1, value);
    },
    
    __tabButtonClicked$1: null,
    
    get_width: function tab_SidebarCollapsedWidget$get_width() {
        return this.get_element().width();
    },
    set_width: function tab_SidebarCollapsedWidget$set_width(value) {
        this.get_element().width(value);
        return value;
    },
    
    _addButtonsToPanel$1: function tab_SidebarCollapsedWidget$_addButtonsToPanel$1() {
        this._showButton$1 = new spiff.IconButton();
        this._showButton$1.add_click(ss.Delegate.create(this, this._expandButtonClickedHandler$1));
        this._showButton$1.setIcon('tabAuthExpandIcon');
        this._showButton$1.set_hoverTooltipText(tab.Strings.ExpandSchemaPane);
        this._showButton$1.addClass('tabExpandSidebar');
        this.buttonHeader.append(this._showButton$1.get_element());
        this._dataTabButton$1 = spiff.LabelButton.newTextButton();
        this._dataTabButton$1.set_label(tab.Strings.AuthSchemaViewerHeaderData);
        this._dataTabButton$1.add_click(ss.Delegate.create(this, this._dataTabButtonClickedHandler$1));
        this._dataTabButton$1.addClass('dataTabButton');
        this.contentArea.append(this._dataTabButton$1.get_element());
        this._analyticsTabButton$1 = spiff.LabelButton.newTextButton();
        this._analyticsTabButton$1.set_label(tab.Strings.AuthLeftPaneTabLabelAnalytics);
        this._analyticsTabButton$1.add_click(ss.Delegate.create(this, this._analyticsTabButtonClickedHandler$1));
        this._analyticsTabButton$1.addClass('analyticsTabButton');
        this.contentArea.append(this._analyticsTabButton$1.get_element());
    },
    
    _expandButtonClickedHandler$1: function tab_SidebarCollapsedWidget$_expandButtonClickedHandler$1() {
        if (ss.isValue(this.__expandButtonClicked$1)) {
            this.__expandButtonClicked$1();
        }
    },
    
    _dataTabButtonClickedHandler$1: function tab_SidebarCollapsedWidget$_dataTabButtonClickedHandler$1() {
        if (ss.isValue(this.__tabButtonClicked$1)) {
            this.__tabButtonClicked$1(this._dataTabButton$1.get_label());
        }
    },
    
    _analyticsTabButtonClickedHandler$1: function tab_SidebarCollapsedWidget$_analyticsTabButtonClickedHandler$1() {
        if (ss.isValue(this.__tabButtonClicked$1)) {
            this.__tabButtonClicked$1(this._analyticsTabButton$1.get_label());
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TooltipContentView

tab.TooltipContentView = function tab_TooltipContentView(viewModel) {
    tab.TooltipContentView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabTooltipContent'></div>") ]);
    this.tooltipContentViewModel = viewModel;
    this._button$2 = spiff.StyledButton.createStyledButton(ss.Delegate.create(this, this._handleClick$2), tab.Strings.AuthResetTooltip, 'tabTooltipContentReset', 1);
    this.get_element().append(this._button$2.get_element());
}
tab.TooltipContentView.prototype = {
    tooltipContentViewModel: null,
    _button$2: null,
    
    _handleClick$2: function tab_TooltipContentView$_handleClick$2() {
        this.tooltipContentViewModel.resetTooltip();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizSummaryView

tab.VizSummaryView = function tab_VizSummaryView(viewModel, t) {
    tab.VizSummaryView.initializeBase(this, [ viewModel, t ]);
    this._viewModel$2 = viewModel;
    this._viewModel$2.add_summaryChanged(ss.Delegate.create(this, this.update));
    this._t$2 = t;
}
tab.VizSummaryView.prototype = {
    _viewModel$2: null,
    _t$2: null,
    
    dispose: function tab_VizSummaryView$dispose() {
        this._viewModel$2.remove_summaryChanged(ss.Delegate.create(this, this.update));
        tab.VizSummaryView.callBaseMethod(this, 'dispose');
    },
    
    update: function tab_VizSummaryView$update() {
        this._t$2.numDimensions.updateLabelCount(this._viewModel$2.get_numDimensions(), false);
        this._t$2.numMeasures.updateLabelCount(this._viewModel$2.get_numMeasures(), false);
        this._t$2.numSets.updateLabelCount(this._viewModel$2.get_numSets(), true);
        this._t$2.numParameters.updateLabelCount(this._viewModel$2.get_numParameters(), true);
        this._t$2.numCol.updateLabelCount(this._viewModel$2.get_numColumnShelfItems(), false);
        this._t$2.numRows.updateLabelCount(this._viewModel$2.get_numRowShelfItems(), false);
        this._t$2.numPages.updateLabelCount(this._viewModel$2.get_numPageShelfItems(), true);
        this._t$2.numFilters.updateLabelCount(this._viewModel$2.get_numFilterShelfItems(), true);
        this._t$2.shelfArea.toggle(this._viewModel$2.get_showShelves());
        this._t$2.layerArea.children('.tabAuthVizSummaryBadge').remove();
        var $enum1 = ss.IEnumerator.getEnumerator(this._viewModel$2.get_layerMarkTypes());
        while ($enum1.moveNext()) {
            var primitiveType = $enum1.current;
            var pt = new tab.VizSummaryBadgeTemplate();
            pt.get_domRoot().appendTo(this._t$2.layerArea).addClass('tabAuthVizSummaryMark-' + primitiveType);
        }
        this._t$2.layerArea.toggle(this._viewModel$2.get_showLayers());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizSummaryTemplate

tab.VizSummaryTemplate = function tab_VizSummaryTemplate() {
    tab.VizSummaryTemplate.initializeBase(this, [ $("<div class='tabAuthVizSummary'>\n<div class='tabAuthVizSummaryArea tabAuthVizSummarySchema'>\n</div>\n<div class='tabAuthVizSummaryArea tabAuthVizSummaryShelf'>\n    <div class='tabAuthVizSummaryDivider'/>\n</div>\n<div class='tabAuthVizSummaryArea tabAuthVizSummaryLayers'>\n    <div class='tabAuthVizSummaryDivider'/>\n</div>\n<div class='tabAuthBorderRight'/>\n</div>") ]);
    this.schemaArea = this.getElementBySelector('.tabAuthVizSummarySchema');
    this.shelfArea = this.getElementBySelector('.tabAuthVizSummaryShelf');
    this.layerArea = this.getElementBySelector('.tabAuthVizSummaryLayers');
    var createBadge = function(badgeClass, parent) {
        var t = new tab.VizSummaryBadgeTemplate();
        t.get_domRoot().appendTo(parent).addClass(badgeClass);
        return t;
    };
    this.numDimensions = createBadge('tabAuthVizSummaryDims', this.schemaArea);
    this.numMeasures = createBadge('tabAuthVizSummaryMeas', this.schemaArea);
    this.numSets = createBadge('tabAuthVizSummarySets', this.schemaArea);
    this.numParameters = createBadge('tabAuthVizSummaryParams', this.schemaArea);
    this.numCol = createBadge('tabAuthVizSummaryCols', this.shelfArea);
    this.numRows = createBadge('tabAuthVizSummaryRows', this.shelfArea);
    this.numPages = createBadge('tabAuthVizSummaryPages', this.shelfArea);
    this.numFilters = createBadge('tabAuthVizSummaryFilters', this.shelfArea);
}
tab.VizSummaryTemplate.prototype = {
    schemaArea: null,
    shelfArea: null,
    layerArea: null,
    numDimensions: null,
    numMeasures: null,
    numSets: null,
    numParameters: null,
    numCol: null,
    numRows: null,
    numPages: null,
    numFilters: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizSummaryBadgeTemplate

tab.VizSummaryBadgeTemplate = function tab_VizSummaryBadgeTemplate() {
    tab.VizSummaryBadgeTemplate.initializeBase(this, [ $("<div class='tabAuthVizSummaryBadge'><div class='tabAuthIcon'/><div class='tabAuthLabel'/></div>") ]);
    this.label = this.getElementBySelector('.tabAuthLabel');
}
tab.VizSummaryBadgeTemplate.prototype = {
    label: null,
    
    updateLabelCount: function tab_VizSummaryBadgeTemplate$updateLabelCount(count, hideIfZero) {
        this.label.text(count.toString());
        this.get_domRoot().toggle(count > 0 || !hideIfZero);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringCommandsViewModel

tab.AuthoringCommandsViewModel = function tab_AuthoringCommandsViewModel() {
    this._serverCommandsLookup = {};
}
tab.AuthoringCommandsViewModel.commandMenuItemClicked = function tab_AuthoringCommandsViewModel$commandMenuItemClicked(menuItem) {
    if (Type.getInstanceType(menuItem.get_data()) === Function) {
        (menuItem.get_data())();
    }
    else {
        var command = menuItem.get_data();
        tab.ServerCommands.executeServerCommand(command, 'immediately');
    }
}
tab.AuthoringCommandsViewModel.prototype = {
    
    update: function tab_AuthoringCommandsViewModel$update(commands) {
        var commandsWrapper = tab.CommandsPresModelWrapper.create(commands);
        Object.clearKeys(this._serverCommandsLookup);
        if (ss.isNullOrUndefined(commandsWrapper) || ss.isNullOrUndefined(commandsWrapper.get_commandItems())) {
            return;
        }
        var $enum1 = ss.IEnumerator.getEnumerator(commandsWrapper.get_commandItems());
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            this._addCommandsToServerCommandsLookup(item);
        }
    },
    
    _addCommandsToServerCommandsLookup: function tab_AuthoringCommandsViewModel$_addCommandsToServerCommandsLookup(item) {
        var itemWrapper = tab.CommandItemWrapper.create(item);
        switch (itemWrapper.get_commandsType()) {
            case 'item':
                var command = tab.CommandSerializer.deserialize(itemWrapper.get_command());
                if (command.commandNamespace === 'tabdoc') {
                    var values = this._serverCommandsLookup[command.commandName];
                    if (ss.isNullOrUndefined(values)) {
                        this._serverCommandsLookup[command.commandName] = values = [];
                    }
                    values.add(item);
                }
                break;
            case 'subcommands':
                var subCommandsWrapper = tab.CommandsPresModelWrapper.create(itemWrapper.get_commands());
                var $enum1 = ss.IEnumerator.getEnumerator(subCommandsWrapper.get_commandItems());
                while ($enum1.moveNext()) {
                    var commandItem = $enum1.current;
                    this._addCommandsToServerCommandsLookup(commandItem);
                }
                break;
        }
    },
    
    commandsCount: function tab_AuthoringCommandsViewModel$commandsCount() {
        return Object.getKeyCount(this._serverCommandsLookup);
    },
    
    getCommands: function tab_AuthoringCommandsViewModel$getCommands(commandKey) {
        return this._serverCommandsLookup[commandKey];
    },
    
    createMenuItem: function tab_AuthoringCommandsViewModel$createMenuItem(commandType, text, expectedNumberOfCommands, predicate, commandParams) {
        var commandItems = this._serverCommandsLookup[commandType];
        ss.Debug.assert(ss.isValue(commandItems) && commandItems.length === expectedNumberOfCommands, 'There should be ' + expectedNumberOfCommands + ' commands of type ' + commandType);
        var $enum1 = ss.IEnumerator.getEnumerator(commandItems);
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            var itemWrapper = tab.CommandItemWrapper.create(item);
            var command = tab.CommandSerializer.deserialize(itemWrapper.get_command());
            if (predicate(command)) {
                var checkState = (itemWrapper.get_isRadioOn()) ? spiff.MenuItemCheckState.radio : spiff.MenuItemCheckState.none;
                if (itemWrapper.get_isChecked()) {
                    checkState = spiff.MenuItemCheckState.check;
                }
                if (ss.isValue(commandParams)) {
                    command.commandParams = commandParams;
                }
                var menuItem = spiff.MenuItem.newItem(command, text, checkState);
                menuItem.set_enabled(!ss.isValue(itemWrapper.get_enabled()) || itemWrapper.get_enabled());
                return menuItem;
            }
        }
        throw Error.createError("Couldn't create a menu item for the '" + commandType + "' command.", null);
    },
    
    createCommandMenuItem: function tab_AuthoringCommandsViewModel$createCommandMenuItem(commandType, text, commandParam) {
        return this.createMenuItem(commandType, text, 1, function(command) {
            return command.commandName === commandType;
        }, commandParam);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalColorOptionViewModel

tab.CategoricalColorOptionViewModel = function tab_CategoricalColorOptionViewModel(layerEncondingModel) {
    tab.CategoricalColorOptionViewModel.initializeBase(this, [ layerEncondingModel ]);
    this._palettePickerViewModel$2 = new tab.ColorPalettePickerViewModel(this.get_selectedColorPalette(), tab.ApplicationModel.get_instance().get_colorPalettes().get_catColorPaletteGroups());
    this._palettePickerViewModel$2.add_propertyChanged(ss.Delegate.create(this, function(sender, args) {
        if (args.get_propertyName() === 'SelectedPalette') {
            this.set_selectedColorPalette(this._palettePickerViewModel$2.get_selectedPalette());
        }
    }));
}
tab.CategoricalColorOptionViewModel.prototype = {
    _palettePickerViewModel$2: null,
    
    get_selectedColorPalette: function tab_CategoricalColorOptionViewModel$get_selectedColorPalette() {
        if (ss.isValue(this.get_layerEncodingModel().get_colorEncodingDropdown().categoricalColor)) {
            return this.get_layerEncodingModel().get_colorEncodingDropdown().categoricalColor.paletteName;
        }
        return '';
    },
    set_selectedColorPalette: function tab_CategoricalColorOptionViewModel$set_selectedColorPalette(value) {
        tab.PaneClientCommands.setCatColorPalette(this.get_layerEncodingModel(), value);
        return value;
    },
    
    get_viewType: function tab_CategoricalColorOptionViewModel$get_viewType() {
        return tab.CategoricalColorOptionView;
    },
    
    get_palettePickerViewModel: function tab_CategoricalColorOptionViewModel$get_palettePickerViewModel() {
        return this._palettePickerViewModel$2;
    },
    
    handleUpdatedLayerEncoding: function tab_CategoricalColorOptionViewModel$handleUpdatedLayerEncoding() {
        this.get_palettePickerViewModel().set_selectedPalette(this.get_layerEncodingModel().get_colorEncodingDropdown().categoricalColor.paletteName);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorTransparencyControlViewModel

tab.ColorTransparencyControlViewModel = function tab_ColorTransparencyControlViewModel(model) {
    tab.ColorTransparencyControlViewModel.initializeBase(this);
    this._layerEncodingModel$1 = model;
    this._transform$1 = new tab.LinearRangeTransform(0, 255);
    this._layerEncodingModel$1.add_newLayerEncoding(ss.Delegate.create(this, this._handleUpdatedLayerEncoding$1));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this._layerEncodingModel$1.remove_newLayerEncoding(ss.Delegate.create(this, this._handleUpdatedLayerEncoding$1));
    })));
}
tab.ColorTransparencyControlViewModel._roundTwoDecimalPlaces$1 = function tab_ColorTransparencyControlViewModel$_roundTwoDecimalPlaces$1(val) {
    return Math.round(val * 100) / 100;
}
tab.ColorTransparencyControlViewModel.prototype = {
    _transform$1: null,
    _layerEncodingModel$1: null,
    
    add_sliderFractionUpdated: function tab_ColorTransparencyControlViewModel$add_sliderFractionUpdated(value) {
        this.__sliderFractionUpdated$1 = ss.Delegate.combine(this.__sliderFractionUpdated$1, value);
    },
    remove_sliderFractionUpdated: function tab_ColorTransparencyControlViewModel$remove_sliderFractionUpdated(value) {
        this.__sliderFractionUpdated$1 = ss.Delegate.remove(this.__sliderFractionUpdated$1, value);
    },
    
    __sliderFractionUpdated$1: null,
    
    get_viewType: function tab_ColorTransparencyControlViewModel$get_viewType() {
        return tab.ColorTransparencyControlView;
    },
    
    get_viewModel: function tab_ColorTransparencyControlViewModel$get_viewModel() {
        return this;
    },
    
    get_layerEncodingModel: function tab_ColorTransparencyControlViewModel$get_layerEncodingModel() {
        return this._layerEncodingModel$1;
    },
    
    get_alphaLevel: function tab_ColorTransparencyControlViewModel$get_alphaLevel() {
        return this.get_layerEncodingModel().get_colorEncodingDropdown().alphaLevel;
    },
    set_alphaLevel: function tab_ColorTransparencyControlViewModel$set_alphaLevel(value) {
        var newAlphaValue = Math.round(value);
        if (newAlphaValue !== Math.round(this.get_alphaLevel())) {
            tab.PaneClientCommands.setColorAlphaLevel(this.get_layerEncodingModel(), newAlphaValue);
        }
        return value;
    },
    
    getCurrentFraction: function tab_ColorTransparencyControlViewModel$getCurrentFraction() {
        return tab.ColorTransparencyControlViewModel._roundTwoDecimalPlaces$1(this._transform$1.valueToFraction(this.get_alphaLevel()));
    },
    
    setCurrentFraction: function tab_ColorTransparencyControlViewModel$setCurrentFraction(newValue) {
        this.set_alphaLevel(this._transform$1.fractionToValue(tab.ColorTransparencyControlViewModel._roundTwoDecimalPlaces$1(newValue)));
    },
    
    _handleUpdatedLayerEncoding$1: function tab_ColorTransparencyControlViewModel$_handleUpdatedLayerEncoding$1() {
        this.__sliderFractionUpdated$1(this.getCurrentFraction());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LinePatternPickerViewModel

tab.LinePatternPickerViewModel = function tab_LinePatternPickerViewModel() {
    this._selectedLinePattern$1 = 'none';
    tab.LinePatternPickerViewModel.initializeBase(this);
}
tab.LinePatternPickerViewModel.prototype = {
    
    get_selectedLinePattern: function tab_LinePatternPickerViewModel$get_selectedLinePattern() {
        return this._selectedLinePattern$1;
    },
    set_selectedLinePattern: function tab_LinePatternPickerViewModel$set_selectedLinePattern(value) {
        if (this._selectedLinePattern$1 === value) {
            return;
        }
        this._selectedLinePattern$1 = value;
        this.notifyPropertyChanged('SelectedLinePattern');
        tab.Log.get(this).info('PaneClientCommands.SetDefaultLinePattern: %s', this._selectedLinePattern$1);
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.StrokeWidthPickerViewModel

tab.StrokeWidthPickerViewModel = function tab_StrokeWidthPickerViewModel() {
    tab.StrokeWidthPickerViewModel.initializeBase(this);
}
tab.StrokeWidthPickerViewModel.prototype = {
    _selectedStrokeWidth$1: 1,
    
    get_selectedStrokeWidth: function tab_StrokeWidthPickerViewModel$get_selectedStrokeWidth() {
        return this._selectedStrokeWidth$1;
    },
    set_selectedStrokeWidth: function tab_StrokeWidthPickerViewModel$set_selectedStrokeWidth(value) {
        if (this._selectedStrokeWidth$1 === value) {
            return;
        }
        this._selectedStrokeWidth$1 = value;
        this.notifyPropertyChanged('SelectedStrokeWidth');
        tab.Log.get(this).info('PaneClientCommands.SetDefaultStrokeWidth: %s', this._selectedStrokeWidth$1);
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorOptionViewModel

tab.QuantitativeColorOptionViewModel = function tab_QuantitativeColorOptionViewModel(layerEncodingModel) {
    tab.QuantitativeColorOptionViewModel.initializeBase(this, [ layerEncodingModel ]);
    this._stepCount$2 = layerEncodingModel.get_colorEncodingDropdown().quantitativeColor.steps;
    this._isStepped$2 = this._stepCount$2 >= 2;
    this._isReversed$2 = layerEncodingModel.get_colorEncodingDropdown().quantitativeColor.isReversed;
    this._palettePickerViewModel$2 = new tab.ColorPalettePickerViewModel(this.get_selectedColorPalette(), tab.ApplicationModel.get_instance().get_colorPalettes().get_qColorPaletteGroups());
    this._palettePickerViewModel$2.add_propertyChanged(ss.Delegate.create(this, function(sender, args) {
        if (args.get_propertyName() === 'SelectedPalette') {
            this.set_selectedColorPalette(this._palettePickerViewModel$2.get_selectedPalette());
        }
    }));
    this._stepperControlViewModel$2 = new tab.StepperControlViewModel(2, 100, 1, (this._isStepped$2) ? this._stepCount$2 : 5);
    this._stepperControlViewModel$2.textClass = tab.QuantitativeColorOptionViewModel.colorStepTextClassName;
    this._stepperControlViewModel$2.set_isEnabled(this._isStepped$2);
    this._stepperControlViewModel$2.add_propertyChanged(ss.Delegate.create(this, function(sender, args) {
        if (args.get_propertyName() === tab.StepperControlViewModel.valueProperty) {
            this.set_stepCount(this._stepperControlViewModel$2.get_value());
        }
    }));
}
tab.QuantitativeColorOptionViewModel._isValidNumber$2 = function tab_QuantitativeColorOptionViewModel$_isValidNumber$2(value) {
    return ss.isValue(value) && value > 0 && isFinite(value);
}
tab.QuantitativeColorOptionViewModel.prototype = {
    _palettePickerViewModel$2: null,
    _stepperControlViewModel$2: null,
    _stepCount$2: 0,
    _isStepped$2: false,
    _isReversed$2: false,
    
    add_isSteppedChanged: function tab_QuantitativeColorOptionViewModel$add_isSteppedChanged(value) {
        this.__isSteppedChanged$2 = ss.Delegate.combine(this.__isSteppedChanged$2, value);
    },
    remove_isSteppedChanged: function tab_QuantitativeColorOptionViewModel$remove_isSteppedChanged(value) {
        this.__isSteppedChanged$2 = ss.Delegate.remove(this.__isSteppedChanged$2, value);
    },
    
    __isSteppedChanged$2: null,
    
    add_isReversedChanged: function tab_QuantitativeColorOptionViewModel$add_isReversedChanged(value) {
        this.__isReversedChanged$2 = ss.Delegate.combine(this.__isReversedChanged$2, value);
    },
    remove_isReversedChanged: function tab_QuantitativeColorOptionViewModel$remove_isReversedChanged(value) {
        this.__isReversedChanged$2 = ss.Delegate.remove(this.__isReversedChanged$2, value);
    },
    
    __isReversedChanged$2: null,
    
    get_viewType: function tab_QuantitativeColorOptionViewModel$get_viewType() {
        return tab.QuantitativeColorOptionView;
    },
    
    get_palettePickerViewModel: function tab_QuantitativeColorOptionViewModel$get_palettePickerViewModel() {
        return this._palettePickerViewModel$2;
    },
    
    get_stepperControlViewModel: function tab_QuantitativeColorOptionViewModel$get_stepperControlViewModel() {
        return this._stepperControlViewModel$2;
    },
    
    get_isStepped: function tab_QuantitativeColorOptionViewModel$get_isStepped() {
        return this._isStepped$2;
    },
    set_isStepped: function tab_QuantitativeColorOptionViewModel$set_isStepped(value) {
        if (this._isStepped$2 === value) {
            return;
        }
        this._isStepped$2 = value;
        if (ss.isValue(this.__isSteppedChanged$2)) {
            this.__isSteppedChanged$2(this._isStepped$2);
        }
        return value;
    },
    
    get_stepCount: function tab_QuantitativeColorOptionViewModel$get_stepCount() {
        return this._stepCount$2;
    },
    set_stepCount: function tab_QuantitativeColorOptionViewModel$set_stepCount(value) {
        if (tab.QuantitativeColorOptionViewModel._isValidNumber$2(value) && this._stepCount$2 !== value) {
            this._stepCount$2 = value;
            tab.PaneClientCommands.setSteppedColor(this.get_layerEncodingModel(), this._stepCount$2);
        }
        return value;
    },
    
    get_isReversed: function tab_QuantitativeColorOptionViewModel$get_isReversed() {
        return this._isReversed$2;
    },
    set_isReversed: function tab_QuantitativeColorOptionViewModel$set_isReversed(value) {
        if (this._isReversed$2 === value) {
            return;
        }
        this._isReversed$2 = value;
        if (ss.isValue(this.__isReversedChanged$2)) {
            this.__isReversedChanged$2(this._isReversed$2);
        }
        return value;
    },
    
    get_selectedColorPalette: function tab_QuantitativeColorOptionViewModel$get_selectedColorPalette() {
        return this.get_layerEncodingModel().get_colorEncodingDropdown().quantitativeColor.paletteName;
    },
    set_selectedColorPalette: function tab_QuantitativeColorOptionViewModel$set_selectedColorPalette(value) {
        tab.PaneClientCommands.setQuantColorPalette(this.get_layerEncodingModel(), value);
        return value;
    },
    
    toggleColorReversal: function tab_QuantitativeColorOptionViewModel$toggleColorReversal() {
        tab.PaneClientCommands.reverseColor(this.get_layerEncodingModel(), !this.get_isReversed());
    },
    
    toggleIsStepped: function tab_QuantitativeColorOptionViewModel$toggleIsStepped() {
        this.set_isStepped(!this.get_isStepped());
        this.get_stepperControlViewModel().set_isEnabled(this.get_isStepped());
        tab.PaneClientCommands.setSteppedColor(this.get_layerEncodingModel(), (this.get_isStepped()) ? this.get_stepperControlViewModel().get_value() : 0);
    },
    
    handleUpdatedLayerEncoding: function tab_QuantitativeColorOptionViewModel$handleUpdatedLayerEncoding() {
        this.get_palettePickerViewModel().set_selectedPalette(this.get_layerEncodingModel().get_colorEncodingDropdown().quantitativeColor.paletteName);
        this.set_isReversed(this.get_layerEncodingModel().get_colorEncodingDropdown().quantitativeColor.isReversed);
        this.set_isStepped(this.get_layerEncodingModel().get_colorEncodingDropdown().quantitativeColor.steps >= 2);
        this.get_stepperControlViewModel().set_isEnabled(this.get_isStepped());
        this._stepperControlViewModel$2.set_value(this.get_layerEncodingModel().get_colorEncodingDropdown().quantitativeColor.steps);
    },
    
    dispose: function tab_QuantitativeColorOptionViewModel$dispose() {
        if (ss.isValue(this._palettePickerViewModel$2)) {
            this._palettePickerViewModel$2.dispose();
        }
        if (ss.isValue(this._stepperControlViewModel$2)) {
            this._stepperControlViewModel$2.dispose();
        }
        tab.QuantitativeColorOptionViewModel.callBaseMethod(this, 'dispose');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorOptionViewModel

tab.ColorOptionViewModel = function tab_ColorOptionViewModel(model) {
    tab.ColorOptionViewModel.initializeBase(this);
    this._layerEncodingModel$1 = model;
    this.transparencyControlViewModel = new tab.ColorTransparencyControlViewModel(this._layerEncodingModel$1);
    this.patternPickerViewModel = new tab.LinePatternPickerViewModel();
    this.widthPickerViewModel = new tab.StrokeWidthPickerViewModel();
    this._layerEncodingModel$1.add_newLayerEncoding(ss.Delegate.create(this, this.handleUpdatedLayerEncoding));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this._layerEncodingModel$1.remove_newLayerEncoding(ss.Delegate.create(this, this.handleUpdatedLayerEncoding));
    })));
}
tab.ColorOptionViewModel.prototype = {
    _layerEncodingModel$1: null,
    transparencyControlViewModel: null,
    patternPickerViewModel: null,
    widthPickerViewModel: null,
    
    add_commitChanges: function tab_ColorOptionViewModel$add_commitChanges(value) {
        this.__commitChanges$1 = ss.Delegate.combine(this.__commitChanges$1, value);
    },
    remove_commitChanges: function tab_ColorOptionViewModel$remove_commitChanges(value) {
        this.__commitChanges$1 = ss.Delegate.remove(this.__commitChanges$1, value);
    },
    
    __commitChanges$1: null,
    
    get_layerEncodingModel: function tab_ColorOptionViewModel$get_layerEncodingModel() {
        return this._layerEncodingModel$1;
    },
    
    get_colorTransparencyControlViewModel: function tab_ColorOptionViewModel$get_colorTransparencyControlViewModel() {
        return this.transparencyControlViewModel;
    },
    
    get_linePatternPickerViewModel: function tab_ColorOptionViewModel$get_linePatternPickerViewModel() {
        return this.patternPickerViewModel;
    },
    
    get_strokeWidthPickerViewModel: function tab_ColorOptionViewModel$get_strokeWidthPickerViewModel() {
        return this.widthPickerViewModel;
    },
    
    get_viewModel: function tab_ColorOptionViewModel$get_viewModel() {
        return this;
    },
    
    get_viewType: function tab_ColorOptionViewModel$get_viewType() {
        return tab.ColorOptionView;
    },
    
    handleUpdatedLayerEncoding: function tab_ColorOptionViewModel$handleUpdatedLayerEncoding() {
    },
    
    disposeViewModel: function tab_ColorOptionViewModel$disposeViewModel() {
        this.dispose();
    },
    
    updateUberPopupViewModel: function tab_ColorOptionViewModel$updateUberPopupViewModel(vm) {
        vm.add_commit(ss.Delegate.create(this, this._fireCommitChanges$1));
        vm.addDisposables(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            vm.remove_commit(ss.Delegate.create(this, this._fireCommitChanges$1));
        })));
    },
    
    _fireCommitChanges$1: function tab_ColorOptionViewModel$_fireCommitChanges$1() {
        if (ss.isValue(this.__commitChanges$1)) {
            this.__commitChanges$1();
        }
    },
    
    dispose: function tab_ColorOptionViewModel$dispose() {
        this.transparencyControlViewModel.dispose();
        this.patternPickerViewModel.dispose();
        this.widthPickerViewModel.dispose();
        tab.ColorOptionViewModel.callBaseMethod(this, 'dispose');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPalettePickerViewModel

tab.ColorPalettePickerViewModel = function tab_ColorPalettePickerViewModel(selectedPalette, paletteGroups) {
    this._pages$1 = [];
    tab.ColorPalettePickerViewModel.initializeBase(this);
    this._selectedPalette$1 = selectedPalette;
    this._currentPageIndex$1 = 0;
    this._colorPaletteGroups$1 = paletteGroups;
    this._initializePages$1();
}
tab.ColorPalettePickerViewModel.prototype = {
    _colorPaletteGroups$1: null,
    _currentPageIndex$1: 0,
    _selectedPalette$1: null,
    
    get_selectedPalette: function tab_ColorPalettePickerViewModel$get_selectedPalette() {
        return this._selectedPalette$1;
    },
    set_selectedPalette: function tab_ColorPalettePickerViewModel$set_selectedPalette(value) {
        if (value !== this._selectedPalette$1) {
            this._selectedPalette$1 = value;
            this.notifyPropertyChanged('SelectedPalette');
        }
        return value;
    },
    
    get_automaticPaletteSelected: function tab_ColorPalettePickerViewModel$get_automaticPaletteSelected() {
        return String.isNullOrEmpty(this._selectedPalette$1) || this._selectedPalette$1 === tab.Strings.AuthColorPaletteAutomatic;
    },
    set_automaticPaletteSelected: function tab_ColorPalettePickerViewModel$set_automaticPaletteSelected(value) {
        if (value) {
            this._selectedPalette$1 = '';
        }
        return value;
    },
    
    get_currentPageIndex: function tab_ColorPalettePickerViewModel$get_currentPageIndex() {
        return this._currentPageIndex$1;
    },
    set_currentPageIndex: function tab_ColorPalettePickerViewModel$set_currentPageIndex(value) {
        var safeValue = Math.min(Math.max(0, value), this._pages$1.length - 1);
        if (safeValue !== this._currentPageIndex$1) {
            this._currentPageIndex$1 = safeValue;
            this.notifyPropertyChanged('CurrentPage');
        }
        return value;
    },
    
    get_isAtLastPage: function tab_ColorPalettePickerViewModel$get_isAtLastPage() {
        return this.get_currentPageIndex() === this._pages$1.length - 1;
    },
    
    get_isAtFisrtPage: function tab_ColorPalettePickerViewModel$get_isAtFisrtPage() {
        return !this.get_currentPageIndex();
    },
    
    get_pages: function tab_ColorPalettePickerViewModel$get_pages() {
        return this._pages$1;
    },
    
    get_currentPage: function tab_ColorPalettePickerViewModel$get_currentPage() {
        return this._pages$1[this._currentPageIndex$1];
    },
    
    get_paletteCollectionModel: function tab_ColorPalettePickerViewModel$get_paletteCollectionModel() {
        return tab.ApplicationModel.get_instance().get_colorPalettes();
    },
    
    _initializePages$1: function tab_ColorPalettePickerViewModel$_initializePages$1() {
        this._pages$1 = [];
        var pageCount = Math.ceil(this._colorPaletteGroups$1.length / 2);
        for (var pageIndex = 0; pageIndex < pageCount; pageIndex++) {
            var page = new tab.PalettePage();
            var firstGroupOnPageIndex = pageIndex * 2;
            for (var groupIndex = firstGroupOnPageIndex; groupIndex < firstGroupOnPageIndex + 2; groupIndex++) {
                page.addGroup(this.get_paletteCollectionModel().colorPaletteGroup(this._colorPaletteGroups$1[groupIndex]));
            }
            this._pages$1.add(page);
        }
        if (this._customPaletteSelected$1()) {
            this._pages$1.add(new tab.PalettePage());
        }
    },
    
    _customPaletteSelected$1: function tab_ColorPalettePickerViewModel$_customPaletteSelected$1() {
        return !this.get_automaticPaletteSelected() && !_.any(this._colorPaletteGroups$1, ss.Delegate.create(this, function(groupPresModel) {
            return _.any(groupPresModel.palettesIndices, ss.Delegate.create(this, function(index) {
                var palette = this.get_paletteCollectionModel().get_colorPalettes()[index];
                return palette.paletteName === this.get_selectedPalette();
            }));
        }));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPaletteItem

tab.ColorPaletteItem = function tab_ColorPaletteItem(presModel) {
    this.paletteLabel = presModel.paletteNameLoc;
    this.paletteName = presModel.paletteName;
    this.type = presModel.colorPaletteType;
    this.colors = presModel.colors;
}
tab.ColorPaletteItem.prototype = {
    paletteName: null,
    paletteLabel: null,
    type: null,
    colors: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPaletteGroup

tab.ColorPaletteGroup = function tab_ColorPaletteGroup(palettePresModels) {
    this.paletteItems = _.map(palettePresModels, function(palettePresModel) {
        return new tab.ColorPaletteItem(palettePresModel);
    });
}
tab.ColorPaletteGroup.prototype = {
    paletteItems: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.PalettePage

tab.PalettePage = function tab_PalettePage() {
    this._paletteGroups = [];
}
tab.PalettePage.prototype = {
    _paletteGroups: null,
    
    get_isCustomPalettePage: function tab_PalettePage$get_isCustomPalettePage() {
        return !this._paletteGroups.length;
    },
    
    get_paletteGroups: function tab_PalettePage$get_paletteGroups() {
        return this._paletteGroups;
    },
    
    addGroup: function tab_PalettePage$addGroup(group) {
        this._paletteGroups.push(new tab.ColorPaletteGroup(group));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TextEncodingOptionViewModel

tab.TextEncodingOptionViewModel = function tab_TextEncodingOptionViewModel(model) {
    tab.TextEncodingOptionViewModel.initializeBase(this);
    this._layerEncodingModel$1 = model;
    this._layerEncodingModel$1.add_newLayerEncoding(ss.Delegate.create(this, this.update));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this._layerEncodingModel$1.remove_newLayerEncoding(ss.Delegate.create(this, this.update));
    })));
    this._labelsOn$1 = this._layerEncodingModel$1.get_textEncodingDropdown().toggleState;
}
tab.TextEncodingOptionViewModel.prototype = {
    _layerEncodingModel$1: null,
    _labelsOn$1: false,
    
    add_labelsOnChanged: function tab_TextEncodingOptionViewModel$add_labelsOnChanged(value) {
        this.__labelsOnChanged$1 = ss.Delegate.combine(this.__labelsOnChanged$1, value);
    },
    remove_labelsOnChanged: function tab_TextEncodingOptionViewModel$remove_labelsOnChanged(value) {
        this.__labelsOnChanged$1 = ss.Delegate.remove(this.__labelsOnChanged$1, value);
    },
    
    __labelsOnChanged$1: null,
    
    get_layerEncodingModel: function tab_TextEncodingOptionViewModel$get_layerEncodingModel() {
        return this._layerEncodingModel$1;
    },
    
    get_labelsOn: function tab_TextEncodingOptionViewModel$get_labelsOn() {
        return this._labelsOn$1;
    },
    set_labelsOn: function tab_TextEncodingOptionViewModel$set_labelsOn(value) {
        if (this._labelsOn$1 !== value) {
            this._labelsOn$1 = value;
            if (ss.isValue(this.__labelsOnChanged$1)) {
                this.__labelsOnChanged$1(this._labelsOn$1);
            }
        }
        return value;
    },
    
    get_controlLabel: function tab_TextEncodingOptionViewModel$get_controlLabel() {
        return this._layerEncodingModel$1.get_textEncodingDropdown().controlLabel;
    },
    
    get_viewType: function tab_TextEncodingOptionViewModel$get_viewType() {
        return tab.TextEncodingOptionView;
    },
    
    get_viewModel: function tab_TextEncodingOptionViewModel$get_viewModel() {
        return this;
    },
    
    disposeViewModel: function tab_TextEncodingOptionViewModel$disposeViewModel() {
        this.dispose();
    },
    
    updateUberPopupViewModel: function tab_TextEncodingOptionViewModel$updateUberPopupViewModel(vm) {
    },
    
    toggleLabels: function tab_TextEncodingOptionViewModel$toggleLabels() {
        tab.PaneClientCommands.toggleMarkLabels(this.get_layerEncodingModel());
    },
    
    update: function tab_TextEncodingOptionViewModel$update() {
        this.set_labelsOn(this.get_layerEncodingModel().get_textEncodingDropdown().toggleState);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationDialogView

tab.CalculationDialogView = function tab_CalculationDialogView(viewModel) {
    tab.CalculationDialogView.initializeBase(this, [ viewModel, new tab.CalculationDialogTemplate() ]);
    this.calcViewModel.add_dirtyStateChanged(ss.Delegate.create(this, this._onCalculationDirtyStateChanged$3));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.calcViewModel.remove_dirtyStateChanged(ss.Delegate.create(this, this._onCalculationDirtyStateChanged$3));
    })));
}
tab.CalculationDialogView.prototype = {
    _editableCaption$3: null,
    _titleArea$3: null,
    _funcFlyoutControl$3: null,
    _dialog$3: null,
    _errorButton$3: null,
    _dependenciesButton$3: null,
    _applyButton$3: null,
    _oKButton$3: null,
    _calculationFunctionListView$3: null,
    
    get_editableCaption: function tab_CalculationDialogView$get_editableCaption() {
        return this._editableCaption$3;
    },
    
    get_dialog: function tab_CalculationDialogView$get_dialog() {
        return this._dialog$3;
    },
    
    get__dialogDom$3: function tab_CalculationDialogView$get__dialogDom$3() {
        return this.get_template();
    },
    
    initDom: function tab_CalculationDialogView$initDom() {
        this._applyButton$3 = spiff.StyledTextButton.createSecondaryButton(ss.Delegate.create(this, this.applyCalc), tab.Strings.CalcEditorApply, 'tabCalcEditorApplyButton', spiff.ButtonSize.medium, 1);
        this.get__dialogDom$3().get_buttonArea().append(this._applyButton$3.get_element());
        this.disposables.add(this._applyButton$3);
        this._updateApplyButtonState$3();
        this._applyButton$3.set_hoverTooltipText((tab.BrowserSupport.get_isMac()) ? tab.Strings.CalcEditorApplyTooltipMac : tab.Strings.CalcEditorApplyTooltip);
        this._oKButton$3 = spiff.StyledTextButton.createPrimaryButton(ss.Delegate.create(this, this.applyCalcAndClose), tab.Strings.DialogButtonOK, 'tabCalcEditorOkButton', spiff.ButtonSize.medium, 2);
        this.get__dialogDom$3().get_buttonArea().append(this._oKButton$3.get_element());
        this.disposables.add(this._oKButton$3);
        this._oKButton$3.set_hoverTooltipText(tab.Strings.CalcEditorOkButtonTooltip);
        this.get__dialogDom$3().get_statusErrorText().text(tab.Strings.CalcEditorCalcError);
        this.get__dialogDom$3().get_statusOkText().text(tab.Strings.CalcEditorCalcOk);
        this._errorButton$3 = new spiff.Button(this.get__dialogDom$3().get_statusErrorButton());
        this._errorButton$3.add_click(ss.Delegate.create(this, this._errorButtonOnClick$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._errorButton$3.remove_click(ss.Delegate.create(this, this._errorButtonOnClick$3));
            this._errorButton$3.dispose();
        })));
        this._dependenciesButton$3 = new spiff.Button(this.get__dialogDom$3().get_dependenciesButton());
        this._dependenciesButton$3.add_click(ss.Delegate.create(this, this._dependenciesButtonOnClick$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._dependenciesButton$3.remove_click(ss.Delegate.create(this, this._dependenciesButtonOnClick$3));
            this._dependenciesButton$3.dispose();
        })));
        this.calcViewModel.add_applyErrorMessageCompleted(ss.Delegate.create(this, this._onApplyErrorMessageCompleted$3));
        this.calcViewModel.add_applyCalculationSuccess(ss.Delegate.create(this, this._onApplyCalculationSuccess$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.calcViewModel.remove_applyErrorMessageCompleted(ss.Delegate.create(this, this._onApplyErrorMessageCompleted$3));
            this.calcViewModel.remove_applyCalculationSuccess(ss.Delegate.create(this, this._onApplyCalculationSuccess$3));
        })));
        this._initFunctionList$3();
        tab.CalculationDialogView.callBaseMethod(this, 'initDom');
    },
    
    ensureDialogIsOnScreen: function tab_CalculationDialogView$ensureDialogIsOnScreen() {
        if (ss.isNullOrUndefined(this._dialog$3)) {
            return;
        }
        this._dialog$3.ensureOnScreen();
    },
    
    onCalculationCanceled: function tab_CalculationDialogView$onCalculationCanceled() {
        tab.CalculationDialogView.callBaseMethod(this, 'onCalculationCanceled');
        this._dialog$3.close();
    },
    
    _onCalculationDirtyStateChanged$3: function tab_CalculationDialogView$_onCalculationDirtyStateChanged$3(newValue) {
        this._updateApplyButtonState$3();
    },
    
    _onApplyCalculationSuccess$3: function tab_CalculationDialogView$_onApplyCalculationSuccess$3(closeOnCommit) {
        if (closeOnCommit) {
            this._dialog$3.close();
        }
    },
    
    applyCalc: function tab_CalculationDialogView$applyCalc() {
        this.calcViewModel.applyCalculation(null, false);
    },
    
    applyCalcAndClose: function tab_CalculationDialogView$applyCalcAndClose() {
        this.calcViewModel.applyCalculation(null, true);
    },
    
    updateDomFromModel: function tab_CalculationDialogView$updateDomFromModel() {
        tab.Log.get(this).debug('Updating calculation from VM');
        this._editableCaption$3.set_text(this.calcViewModel.get_caption());
        this._updateErrorState$3();
        this._updateDependenciesState$3();
        tab.CalculationDialogView.callBaseMethod(this, 'updateDomFromModel');
    },
    
    _toggleFunctionFlyoutControl$3: function tab_CalculationDialogView$_toggleFunctionFlyoutControl$3(button, eventArgs) {
        if (eventArgs.get_propertyName() === spiff.ToggleButton.selectedProperty) {
            this._calculationFunctionListView$3.get_element().toggleClass('shown', (button).get_selected());
        }
    },
    
    _initFunctionList$3: function tab_CalculationDialogView$_initFunctionList$3() {
        if (ss.isValue(this._calculationFunctionListView$3)) {
            return;
        }
        var useFunctionList = !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.calcDialogFuncList);
        if (!useFunctionList) {
            return;
        }
        this._calculationFunctionListView$3 = spiff.ObjectRegistry.newView(tab.CalculationFunctionListView, this.calcViewModel.get_functionListViewModel());
        this._calculationFunctionListView$3.add_doubleClickedItem(ss.Delegate.create(this, this._onDoubleClickFunction$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._calculationFunctionListView$3.remove_doubleClickedItem(ss.Delegate.create(this, this._onDoubleClickFunction$3));
            this._calculationFunctionListView$3.dispose();
            this._calculationFunctionListView$3 = null;
        })));
    },
    
    createDialog: function tab_CalculationDialogView$createDialog() {
        this._dialog$3 = new spiff.Dialog('', this.get_element());
        this._dialog$3.disableTextSelection();
        this._dialog$3.configMoveDragSource(function(d) {
            return new tab._calculationDialogMoveDragSource(d);
        });
        this._dialog$3.get_dialogElement().addClass('tabCalcEditDialog');
        this._dialog$3.get_dialogElement().addClass(tab.PaneTableView.suppressVizTooltipsAndOverlays);
        this._dialog$3.set_resizeable(true);
        this._dialog$3.add_closing(ss.Delegate.create(this, this._onDialogClosing$3));
        this._dialog$3.add_closed(ss.Delegate.create(this, this._onDialogClose$3));
        this._dialog$3.add_resizeEnd(ss.Delegate.create(this, this._onDialogResizeEnd$3));
        this._editableCaption$3 = spiff.EditableTextView.newEditableTextView(this.calcViewModel.get_caption(), '');
        this._editableCaption$3.add_committed(ss.Delegate.create(this, this._onEditableCaptionCommitted$3));
        this._editableCaption$3.add_propertyChanged(ss.Delegate.create(this, this._onEditableCaptionChanged$3));
        this._editableCaption$3.add_hoverStateChanged(ss.Delegate.create(this, this._updateDataSourceLabelVisibility$3));
        var updateVisibilityByEditingState = ss.Delegate.create(this, function() {
            this._updateDataSourceLabelVisibility$3(this._editableCaption$3.get_element().hasClass('hover'));
        });
        this._editableCaption$3.add_editing(updateVisibilityByEditingState);
        this._editableCaption$3.add_committed(updateVisibilityByEditingState);
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._dialog$3.remove_closing(ss.Delegate.create(this, this._onDialogClosing$3));
            this._dialog$3.remove_closed(ss.Delegate.create(this, this._onDialogClose$3));
            this._dialog$3.remove_resizeEnd(ss.Delegate.create(this, this._onDialogResizeEnd$3));
            this._dialog$3.dispose();
            this._editableCaption$3.remove_committed(ss.Delegate.create(this, this._onEditableCaptionCommitted$3));
            this._editableCaption$3.remove_propertyChanged(ss.Delegate.create(this, this._onEditableCaptionChanged$3));
            this._editableCaption$3.remove_hoverStateChanged(ss.Delegate.create(this, this._updateDataSourceLabelVisibility$3));
            this._editableCaption$3.remove_editing(updateVisibilityByEditingState);
            this._editableCaption$3.remove_committed(updateVisibilityByEditingState);
            this._editableCaption$3.dispose();
        })));
        this._titleArea$3 = new tab.CalculationTitleAreaTemplate();
        this._dialog$3.get_titleBarElement().find('.tab-dialogTitle').append(this._titleArea$3.get_domRoot());
        this.disposables.add(this._titleArea$3);
        if (ss.isNullOrUndefined(this._calculationFunctionListView$3)) {
            return;
        }
        this._dialog$3.get_element().prepend($("<div class='tabCalcEditorFunctionFlyoutCover'/>"));
        this._dialog$3.get_element().prepend(this._calculationFunctionListView$3.get_element());
        this._calculationFunctionListView$3.onAddedToDom();
        var flyoutTemplate = new tab.FunctionFlyoutControlTemplate();
        this._funcFlyoutControl$3 = new spiff.ToggleButton(flyoutTemplate.get_domRoot(), 'flyoutShown');
        this._funcFlyoutControl$3.add_propertyChanged(ss.Delegate.create(this, this._toggleFunctionFlyoutControl$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._funcFlyoutControl$3.remove_propertyChanged(ss.Delegate.create(this, this._toggleFunctionFlyoutControl$3));
        })));
        this._funcFlyoutControl$3.addToDom(this._dialog$3.get_element());
        this.disposables.add(this._funcFlyoutControl$3);
        this.disposables.add(flyoutTemplate);
        this._funcFlyoutControl$3.set_selected(false);
    },
    
    _updateDataSourceLabelVisibility$3: function tab_CalculationDialogView$_updateDataSourceLabelVisibility$3(onHover) {
        this._titleArea$3.get_dataSourceLabel().css('display', (this._editableCaption$3.get_isEditing() || onHover) ? 'none' : 'inline-block');
    },
    
    _updateAndAlignDataSourceLabel$3: function tab_CalculationDialogView$_updateAndAlignDataSourceLabel$3() {
        var shouldShowDataSourceCaption = this.calcViewModel.get_shouldShowDataSourceCaption();
        this._titleArea$3.get_dataSourceIcon().toggle(shouldShowDataSourceCaption);
        if (shouldShowDataSourceCaption) {
            this._titleArea$3.get_dataSourceLabelText().text(this.calcViewModel.get_dataSourceCaption());
        }
        this._titleArea$3.get_dataSourceLabel().css('left', this._editableCaption$3.get_textDisplayWidth() + 'px');
    },
    
    onCalculationEdited: function tab_CalculationDialogView$onCalculationEdited() {
        tab.Log.get(this).debug('Editing new calculation');
        if (ss.isNullOrUndefined(this._dialog$3)) {
            this.createDialog();
        }
        var notShown = !this.get_dialog().get_isShown();
        if (notShown) {
            this.get_dialog().show();
            this.onAddedToDom();
            this._editableCaption$3.addToDom(this._titleArea$3.get_captionContainer());
        }
        tab.CalculationDialogView.callBaseMethod(this, 'onCalculationEdited');
        this._updateAndAlignDataSourceLabel$3();
        this._updateApplyButtonState$3();
        if (notShown) {
            if (this.calcViewModel.get_isNewCalculation()) {
                this._editableCaption$3.edit();
            }
            else {
                this.focusEditor();
            }
        }
        else {
            if (this._editableCaption$3.get_isEditing()) {
                tab.DomUtil.selectAllInputText(this._editableCaption$3.get_inputElement());
            }
            else {
                this.get_editor().execCommand('goDocEnd');
            }
        }
    },
    
    _updateErrorState$3: function tab_CalculationDialogView$_updateErrorState$3() {
        this.get__dialogDom$3().get_statusOk().toggle(!this.calcViewModel.get_hasErrors());
        this.get__dialogDom$3().get_statusError().toggle(this.calcViewModel.get_hasErrors());
    },
    
    _updateDependenciesState$3: function tab_CalculationDialogView$_updateDependenciesState$3() {
        this.get__dialogDom$3().get_dependenciesButton().css('visibility', (this.calcViewModel.get_hasDependencies()) ? 'visible' : 'hidden');
    },
    
    _errorButtonOnClick$3: function tab_CalculationDialogView$_errorButtonOnClick$3() {
        var menuItems = _.map(this.calcViewModel.get_errors(), function(e) {
            return spiff.MenuItem.newItem(e, e.errorMessage);
        });
        spiff.MenuViewModel.createForMenu(new spiff.Menu(menuItems), ss.Delegate.create(this, this._errorMenuItemOnClicked$3)).show(spiff.ShowMenuOptions.create(this.get__dialogDom$3().get_statusErrorText()));
    },
    
    _errorMenuItemOnClicked$3: function tab_CalculationDialogView$_errorMenuItemOnClicked$3(i) {
        var err = i.get_data();
        var offset = tab.CalculationEditorView.getNewLineOffset(this.calcViewModel.get_formula().substr(0, err.startPositionForError));
        var errStart = this.get_editor().posFromIndex(err.startPositionForError - offset);
        var errEnd = this.get_editor().posFromIndex(err.startPositionForError + err.lengthOfCalcOfError - offset);
        this.get_editor().setCursor(errStart);
        this.focusEditor();
        this.get_editor().setSelection(errStart, errEnd);
    },
    
    _dependenciesButtonOnClick$3: function tab_CalculationDialogView$_dependenciesButtonOnClick$3() {
        this._dependenciesButton$3.get_element().addClass('tabOpen');
        var popupVM = spiff.UberPopupViewModel.createForContent(new tab.CalculationDependencyViewModel(this.calcViewModel.get_dependencies(), this.get_element().outerWidth()));
        var options = new spiff.UberPopupShowOptions(this.get__dialogDom$3().get_dependenciesButton(), spiff.UberPopupHorizontalAlign.left);
        options.limitPopupHeight = true;
        popupVM.show(options);
        popupVM.add_hidden(ss.Delegate.create(this, function() {
            this._dependenciesButton$3.get_element().removeClass('tabOpen');
        }));
    },
    
    _onEditableCaptionCommitted$3: function tab_CalculationDialogView$_onEditableCaptionCommitted$3() {
        if (String.isNullOrEmpty(this._editableCaption$3.get_text())) {
            this._editableCaption$3.set_text(this.calcViewModel.get_caption());
        }
        else {
            this.calcViewModel.set_caption(this._editableCaption$3.get_text());
        }
        this._updateAndAlignDataSourceLabel$3();
    },
    
    _onEditableCaptionChanged$3: function tab_CalculationDialogView$_onEditableCaptionChanged$3(sender, e) {
        if (e.get_propertyName() === spiff.TextInputView.textPropertyName) {
            if (ss.isNullOrUndefined(this._applyButton$3) || ss.isNullOrUndefined(this._editableCaption$3)) {
                return;
            }
            this._applyButton$3.set_disabled(!(this.calcViewModel.isCaptionStringDirty(this._editableCaption$3.get_text()) || this.calcViewModel.get_isFormulaDirty()));
        }
    },
    
    _updateApplyButtonState$3: function tab_CalculationDialogView$_updateApplyButtonState$3() {
        if (ss.isNullOrUndefined(this._applyButton$3)) {
            return;
        }
        this._applyButton$3.set_disabled(!this.calcViewModel.get_isDirty());
    },
    
    _onDialogClosing$3: function tab_CalculationDialogView$_onDialogClosing$3(sender, e) {
        document.activeElement.blur();
    },
    
    _onDialogClose$3: function tab_CalculationDialogView$_onDialogClose$3(source, args) {
        this.calcViewModel.cancelCalculation();
    },
    
    _onDialogResizeEnd$3: function tab_CalculationDialogView$_onDialogResizeEnd$3() {
        this.get_editor().refresh();
        this._calculationFunctionListView$3.handleResize();
    },
    
    _onApplyErrorMessageCompleted$3: function tab_CalculationDialogView$_onApplyErrorMessageCompleted$3() {
        this.focusEditor();
    },
    
    _onDoubleClickFunction$3: function tab_CalculationDialogView$_onDoubleClickFunction$3(funcModel) {
        var cursorIndex = this.get_editor().indexFromPos(this.get_editor().getCursor());
        var selection = tab.CalculationEditorView.getSelection(this.get_editor());
        if (ss.isNullOrUndefined(selection)) {
            selection = {};
            selection.calcEditorTextSelectionStartPos = cursorIndex;
            selection.calcEditorTextSelectionEndPos = cursorIndex;
        }
        this.calcViewModel.insertFunction(funcModel, selection);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._calculationDialogMoveDragSource

tab._calculationDialogMoveDragSource = function tab__calculationDialogMoveDragSource(dialog) {
    tab._calculationDialogMoveDragSource.initializeBase(this, [ dialog.get_titleBarElement(), dialog.get_element() ]);
    this.set_documentBodySize('useClientSize');
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationTitleAreaTemplate

tab.CalculationTitleAreaTemplate = function tab_CalculationTitleAreaTemplate() {
    tab.CalculationTitleAreaTemplate.initializeBase(this, [ $("\n<div class='tabCalcEditorTitleArea'>\n  <div class='tabCalcEditorCaptionContainer'/>\n  <div class='tabCalcEditorDataSourceLabel'><div class='tabCalcEditorDatasourceIcon'/><span/></div>\n</div>") ]);
    this._captionContainer$1 = this.getElementBySelector('.tabCalcEditorCaptionContainer');
    this._dataSourceLabel$1 = this.getElementBySelector('.tabCalcEditorDataSourceLabel');
    this._dataSourceIcon$1 = this.getElementBySelector('.tabCalcEditorDatasourceIcon');
}
tab.CalculationTitleAreaTemplate.prototype = {
    _captionContainer$1: null,
    _dataSourceLabel$1: null,
    _dataSourceIcon$1: null,
    
    get_captionContainer: function tab_CalculationTitleAreaTemplate$get_captionContainer() {
        return this._captionContainer$1;
    },
    
    get_dataSourceLabel: function tab_CalculationTitleAreaTemplate$get_dataSourceLabel() {
        return this._dataSourceLabel$1;
    },
    
    get_dataSourceLabelText: function tab_CalculationTitleAreaTemplate$get_dataSourceLabelText() {
        return this._dataSourceLabel$1.find('span');
    },
    
    get_dataSourceIcon: function tab_CalculationTitleAreaTemplate$get_dataSourceIcon() {
        return this._dataSourceIcon$1;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FunctionFlyoutControlTemplate

tab.FunctionFlyoutControlTemplate = function tab_FunctionFlyoutControlTemplate() {
    tab.FunctionFlyoutControlTemplate.initializeBase(this, [ $("\n<div class='tabCalcEditorFuncFlyoutControl'>\n    <div class='tabCalcEditorFuncFlyoutExpander'/>\n    <div class='tabCalcEditorFuncFlyoutCollapser'/>\n    <div class='tabCalcEditorFuncFlyoutControlHit'/>\n</div>") ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationDialogTemplate

tab.CalculationDialogTemplate = function tab_CalculationDialogTemplate() {
    tab.CalculationDialogTemplate.initializeBase(this, [ $(tab.CalculationDialogTemplate._htmlTemplate$2) ]);
    this._calcEditorBody$2 = this.getElementBySelector('.tabCalcEditorBody');
    this._formulaEditorHolder$2 = this.getElementBySelector('.tabCalcEditorCmHolder');
    this._dropTarget$2 = this.getElementBySelector('.tabCalcEditorDropTarget');
    this._buttonArea$2 = this.getElementBySelector('.tabCalcEditorBtnArea');
    this._controlArea$2 = this.getElementBySelector('.tabCalcEditorControlArea');
    this._statusErrorText$2 = this.getElementBySelector('.tabCalcEditorStatusErrorText');
    this._statusOkText$2 = this.getElementBySelector('.tabCalcEditorStatusOkText');
    this._statusError$2 = this.getElementBySelector('.tabCalcEditorStatusError');
    this._statusErrorButton$2 = this.getElementBySelector('.tabCalcEditorStatusErrorBtn');
    this._statusOk$2 = this.getElementBySelector('.tabCalcEditorStatusOk');
    this._dependenciesButton$2 = this.getElementBySelector('.tabCalcEditorDependsBtn');
    this.getElementBySelector('.tabCalcEditorAffectedSheets').text(tab.Strings.CalcEditorAffectedSheets);
}
tab.CalculationDialogTemplate.prototype = {
    _formulaEditorHolder$2: null,
    _dropTarget$2: null,
    _buttonArea$2: null,
    _controlArea$2: null,
    _statusError$2: null,
    _statusOk$2: null,
    _statusErrorButton$2: null,
    _statusErrorText$2: null,
    _statusOkText$2: null,
    _dependenciesButton$2: null,
    _calcEditorBody$2: null,
    
    get_calcEditorBody: function tab_CalculationDialogTemplate$get_calcEditorBody() {
        return this._calcEditorBody$2;
    },
    
    get_formulaEditorHolder: function tab_CalculationDialogTemplate$get_formulaEditorHolder() {
        return this._formulaEditorHolder$2;
    },
    
    get_dragSource: function tab_CalculationDialogTemplate$get_dragSource() {
        return this._formulaEditorHolder$2;
    },
    
    get_dropTarget: function tab_CalculationDialogTemplate$get_dropTarget() {
        return this._dropTarget$2;
    },
    
    get_dropInviteBorder: function tab_CalculationDialogTemplate$get_dropInviteBorder() {
        return this._formulaEditorHolder$2;
    },
    
    get_buttonArea: function tab_CalculationDialogTemplate$get_buttonArea() {
        return this._buttonArea$2;
    },
    
    get_controlArea: function tab_CalculationDialogTemplate$get_controlArea() {
        return this._controlArea$2;
    },
    
    get_statusError: function tab_CalculationDialogTemplate$get_statusError() {
        return this._statusError$2;
    },
    
    get_statusErrorButton: function tab_CalculationDialogTemplate$get_statusErrorButton() {
        return this._statusErrorButton$2;
    },
    
    get_statusOk: function tab_CalculationDialogTemplate$get_statusOk() {
        return this._statusOk$2;
    },
    
    get_statusErrorText: function tab_CalculationDialogTemplate$get_statusErrorText() {
        return this._statusErrorText$2;
    },
    
    get_statusOkText: function tab_CalculationDialogTemplate$get_statusOkText() {
        return this._statusOkText$2;
    },
    
    get_dependenciesButton: function tab_CalculationDialogTemplate$get_dependenciesButton() {
        return this._dependenciesButton$2;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationFunctionListView

tab.CalculationFunctionListView = function tab_CalculationFunctionListView(viewModel) {
    tab.CalculationFunctionListView.initializeBase(this, [ viewModel, new tab.CalculationFunctionListTemplate() ]);
    this._functionListViewModel$2 = viewModel;
    this._dom$2 = this.get_template();
}
tab.CalculationFunctionListView.prototype = {
    _functionListViewModel$2: null,
    _dom$2: null,
    _listView$2: null,
    _funcTypeVm$2: null,
    _searchTextInputView$2: null,
    _scrollableViewModel$2: null,
    _funcInfo$2: null,
    _funcInfoScrollableViewModel$2: null,
    
    add_doubleClickedItem: function tab_CalculationFunctionListView$add_doubleClickedItem(value) {
        this.__doubleClickedItem$2 = ss.Delegate.combine(this.__doubleClickedItem$2, value);
    },
    remove_doubleClickedItem: function tab_CalculationFunctionListView$remove_doubleClickedItem(value) {
        this.__doubleClickedItem$2 = ss.Delegate.remove(this.__doubleClickedItem$2, value);
    },
    
    __doubleClickedItem$2: null,
    
    get_dom: function tab_CalculationFunctionListView$get_dom() {
        return this._dom$2;
    },
    
    get_listView: function tab_CalculationFunctionListView$get_listView() {
        return this._listView$2;
    },
    
    get_funcInfo: function tab_CalculationFunctionListView$get_funcInfo() {
        return this._funcInfo$2;
    },
    
    get_funcTypeVm: function tab_CalculationFunctionListView$get_funcTypeVm() {
        return this._funcTypeVm$2;
    },
    
    get_searchTextInputView: function tab_CalculationFunctionListView$get_searchTextInputView() {
        return this._searchTextInputView$2;
    },
    
    onAddedToDom: function tab_CalculationFunctionListView$onAddedToDom() {
        tab.CalculationFunctionListView.callBaseMethod(this, 'onAddedToDom');
        this._listView$2 = spiff.ListView.createListView(this._functionListViewModel$2.get_listViewModel(), false);
        this._scrollableViewModel$2 = new spiff.ScrollableViewModel(false);
        this._scrollableViewModel$2.set_content(this._listView$2.get_element()[0]);
        this._scrollableViewModel$2.set_scrollY(true);
        this.disposables.add(this._scrollableViewModel$2);
        var scrollableView = spiff.ScrollableView.createScrollableView(this._scrollableViewModel$2);
        scrollableView.addToDom(this._dom$2.get_functionListArea());
        this._listView$2.useScrollableView(scrollableView);
        this._funcInfo$2 = new tab.CalculationFunctionInfoTemplate();
        this._funcInfoScrollableViewModel$2 = new spiff.ScrollableViewModel(false);
        this._funcInfoScrollableViewModel$2.set_content(this.get_funcInfo().get_domRoot().get(0));
        this._funcInfoScrollableViewModel$2.set_scrollY(true);
        this.disposables.add(this._funcInfoScrollableViewModel$2);
        this.disposables.add(this._funcInfo$2);
        var funcInfoScrollableView = spiff.ScrollableView.createScrollableView(this._funcInfoScrollableViewModel$2);
        funcInfoScrollableView.addToDom(this._dom$2.get_functionInfoArea());
        this._listView$2.tabIndex(0);
        this._listView$2.add_selectionChanged(ss.Delegate.create(this, this._onListViewSelectionChange$2));
        this._listView$2.add_submitSelection(ss.Delegate.create(this, this._onListViewDoubleClick$2));
        this._listView$2.add_listItemsUpdated(ss.Delegate.create(this, this._onListViewUpdated$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._listView$2.remove_selectionChanged(ss.Delegate.create(this, this._onListViewSelectionChange$2));
            this._listView$2.remove_submitSelection(ss.Delegate.create(this, this._onListViewDoubleClick$2));
            this._listView$2.remove_listItemsUpdated(ss.Delegate.create(this, this._onListViewUpdated$2));
            this._listView$2.dispose();
        })));
        this._funcTypeVm$2 = new tab.ComboBoxViewModel();
        this._addComboItem$2(tab.Strings.FunctionTypeAll, 'all');
        this._addComboItem$2(tab.Strings.FunctionTypeNumber, 'num');
        this._addComboItem$2(tab.Strings.FunctionTypeString, 'str');
        this._addComboItem$2(tab.Strings.FunctionTypeDate, 'date');
        this._addComboItem$2(tab.Strings.FunctionTypeType, 'cast');
        this._addComboItem$2(tab.Strings.FunctionTypeLogical, 'logic');
        this._addComboItem$2(tab.Strings.FunctionTypeAggregate, 'agg');
        this._addComboItem$2(tab.Strings.FunctionTypeUser, 'user');
        this._addComboItem$2(tab.Strings.FunctionTypeTableCalculation, 'table');
        this._funcTypeVm$2.set_selectedItem(this._funcTypeVm$2.get_items()[0]);
        this._dom$2.get_funcType().append(spiff.ObjectRegistry.newView(tab.ComboBoxView, this._funcTypeVm$2).get_element());
        this._funcTypeVm$2.add_selectedItemChanged(ss.Delegate.create(this, this._funcTypeVmChanged$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._funcTypeVm$2.remove_selectedItemChanged(ss.Delegate.create(this, this._funcTypeVmChanged$2));
            this._funcTypeVm$2.dispose();
        })));
        this._searchTextInputView$2 = spiff.ClearableTextInputView.newClearableTextInputView('', tab.Strings.FunctionTypeSearchHint, tab.Strings.FunctionTypeClearTooltip);
        this._searchTextInputView$2.addToDom(this._dom$2.get_searchBox());
        this._searchTextInputView$2.add_propertyChanged(ss.Delegate.create(this, this._onSearchTextInputView$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._searchTextInputView$2.remove_propertyChanged(ss.Delegate.create(this, this._onSearchTextInputView$2));
            this._searchTextInputView$2.dispose();
        })));
        this._listView$2.selectItemByIndex(0);
        this._handleSearchBoxChange$2();
    },
    
    _addComboItem$2: function tab_CalculationFunctionListView$_addComboItem$2(name, data) {
        var item = new tab.ComboBoxItem(null, name, data, null);
        this._funcTypeVm$2.addItem(item);
    },
    
    _handleSearchBoxChange$2: function tab_CalculationFunctionListView$_handleSearchBoxChange$2() {
        this._functionListViewModel$2.get_listViewModel().set_filter(ss.Delegate.create(this, function(value, index, list) {
            var data = value.get_data();
            var funcTypeValue = this._funcTypeVm$2.get_selectedItem().get_data();
            if (funcTypeValue !== 'all' && !data.funcGrps.contains(funcTypeValue)) {
                return false;
            }
            var searchBoxValue = this._searchTextInputView$2.get_text();
            if (searchBoxValue != null && !String.isNullOrEmpty(searchBoxValue.trim())) {
                return data.name.toString().toLowerCase().indexOf(searchBoxValue.toLowerCase()) >= 0;
            }
            return true;
        }));
    },
    
    _funcTypeVmChanged$2: function tab_CalculationFunctionListView$_funcTypeVmChanged$2(arg) {
        if (!String.isNullOrEmpty(this._searchTextInputView$2.get_text())) {
            this._searchTextInputView$2.set_text('');
        }
        else {
            this._handleSearchBoxChange$2();
        }
    },
    
    _onSearchTextInputView$2: function tab_CalculationFunctionListView$_onSearchTextInputView$2(sender, e) {
        this._handleSearchBoxChange$2();
    },
    
    handleResize: function tab_CalculationFunctionListView$handleResize() {
        this._scrollableViewModel$2.triggerRefresh();
        this._funcInfoScrollableViewModel$2.triggerRefresh();
    },
    
    _onListViewUpdated$2: function tab_CalculationFunctionListView$_onListViewUpdated$2() {
        this._listView$2.selectItemByIndex(0);
        this._scrollableViewModel$2.triggerRefresh();
    },
    
    _onListViewSelectionChange$2: function tab_CalculationFunctionListView$_onListViewSelectionChange$2() {
        var signature = '';
        var info = '';
        var funcModel = this._getSelectedFunction$2();
        if (ss.isValue(funcModel)) {
            signature = funcModel.funcSig || '';
            info = funcModel.helpContents || '';
        }
        this.get_funcInfo().get_functionName().text(signature);
        this.get_funcInfo().get_functionDescription().text(info);
        this._funcInfoScrollableViewModel$2.triggerRefresh();
    },
    
    _onListViewDoubleClick$2: function tab_CalculationFunctionListView$_onListViewDoubleClick$2() {
        if (ss.isValue(this.__doubleClickedItem$2)) {
            this.__doubleClickedItem$2(this._getSelectedFunction$2());
        }
    },
    
    _getSelectedFunction$2: function tab_CalculationFunctionListView$_getSelectedFunction$2() {
        var item = this._listView$2.get_firstSelectedItem();
        return (ss.isValue(item)) ? item.get_data() : null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationFunctionListTemplate

tab.CalculationFunctionListTemplate = function tab_CalculationFunctionListTemplate() {
    tab.CalculationFunctionListTemplate.initializeBase(this, [ $(tab.CalculationFunctionListTemplate._htmlTemplate$1) ]);
    this._functionListArea$1 = this.getElementBySelector('.tabCalcEditorFuncListArea');
    this._functionInfoArea$1 = this.getElementBySelector('.tabCalcEditorFuncInfoArea');
    this._searchBox$1 = this.getElementBySelector('.tabCalcEditorFuncSearchBox');
    this._funcType$1 = this.getElementBySelector('.tabCalcEditorFuncType');
}
tab.CalculationFunctionListTemplate.prototype = {
    _functionListArea$1: null,
    _functionInfoArea$1: null,
    _searchBox$1: null,
    _funcType$1: null,
    
    get_functionListArea: function tab_CalculationFunctionListTemplate$get_functionListArea() {
        return this._functionListArea$1;
    },
    
    get_functionInfoArea: function tab_CalculationFunctionListTemplate$get_functionInfoArea() {
        return this._functionInfoArea$1;
    },
    
    get_searchBox: function tab_CalculationFunctionListTemplate$get_searchBox() {
        return this._searchBox$1;
    },
    
    get_funcType: function tab_CalculationFunctionListTemplate$get_funcType() {
        return this._funcType$1;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationFunctionInfoTemplate

tab.CalculationFunctionInfoTemplate = function tab_CalculationFunctionInfoTemplate() {
    tab.CalculationFunctionInfoTemplate.initializeBase(this, [ $("\n<div class='tabCalcEditorFunctionInfo'>\n  <div class='tabCalcEditorFunctionName'/>\n  <div class='tabCalcEditorFunctionDescription'/>\n</div>") ]);
    this._functionName$1 = this.getElementBySelector('.tabCalcEditorFunctionName');
    this._functionDescription$1 = this.getElementBySelector('.tabCalcEditorFunctionDescription');
}
tab.CalculationFunctionInfoTemplate.prototype = {
    _functionName$1: null,
    _functionDescription$1: null,
    
    get_functionName: function tab_CalculationFunctionInfoTemplate$get_functionName() {
        return this._functionName$1;
    },
    
    get_functionDescription: function tab_CalculationFunctionInfoTemplate$get_functionDescription() {
        return this._functionDescription$1;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalColorOptionView

tab.CategoricalColorOptionView = function tab_CategoricalColorOptionView(viewModel) {
    tab.CategoricalColorOptionView.initializeBase(this, [ viewModel, new tab.CategoricalColorOptionTemplate() ]);
    this.dom = this.get_template();
    this.categoricalColorOptionViewModel = viewModel;
    this.createColorControls();
}
tab.CategoricalColorOptionView.prototype = {
    categoricalColorOptionViewModel: null,
    dom: null,
    _colorTransparencyControlView$3: null,
    
    get_colorTransparencyControlView: function tab_CategoricalColorOptionView$get_colorTransparencyControlView() {
        return this._colorTransparencyControlView$3;
    },
    set_colorTransparencyControlView: function tab_CategoricalColorOptionView$set_colorTransparencyControlView(value) {
        this._colorTransparencyControlView$3 = value;
        return value;
    },
    
    createColorControls: function tab_CategoricalColorOptionView$createColorControls() {
        var palettePickerView = spiff.ObjectRegistry.newView(tab.ColorPalettePickerView, this.categoricalColorOptionViewModel.get_palettePickerViewModel());
        palettePickerView.addToDom(this.dom.colorPaletteSelectionControlContainer);
        this.disposables.add(palettePickerView);
    },
    
    onAddedToDom: function tab_CategoricalColorOptionView$onAddedToDom() {
        tab.CategoricalColorOptionView.callBaseMethod(this, 'onAddedToDom');
        this.get_colorTransparencyControlView().addToDom(this.dom.transparencyControlContainer);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalColorOptionTemplate

tab.CategoricalColorOptionTemplate = function tab_CategoricalColorOptionTemplate() {
    tab.CategoricalColorOptionTemplate.initializeBase(this, [ $("<div class='tabAuthCategoricalColorOptionContent'>\n    <div class='tabColorPalettePickerContainer'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthTransparencyControlContainer'/>\n</div>") ]);
    this.colorPaletteSelectionControlContainer = this.getElementBySelector('.tabColorPalettePickerContainer');
    this.transparencyControlContainer = this.getElementBySelector('.tabAuthTransparencyControlContainer');
}
tab.CategoricalColorOptionTemplate.prototype = {
    colorPaletteSelectionControlContainer: null,
    transparencyControlContainer: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorTransparencyControlView

tab.ColorTransparencyControlView = function tab_ColorTransparencyControlView(viewModel) {
    tab.ColorTransparencyControlView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabAuthTransparencyControl'/>") ]);
}
tab.ColorTransparencyControlView.prototype = {
    sliderViewModel: null,
    
    createTransparencyLabel: function tab_ColorTransparencyControlView$createTransparencyLabel() {
        this.get_element().append($('<div>').addClass('tabAuthTransparencyLabel').append($('<span>').text(tab.Strings.AuthColorTransparencyLabel)));
    },
    
    createSlider: function tab_ColorTransparencyControlView$createSlider(rangeModel) {
        this.sliderViewModel = new tab.ContinuousSliderViewModel(rangeModel);
        this.sliderViewModel.set_sliderClassName('tabAuthTransparencySlider');
        this.sliderViewModel.add_sliderValueChange(ss.Delegate.create(rangeModel, rangeModel.setCurrentFraction));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.sliderViewModel.remove_sliderValueChange(ss.Delegate.create(rangeModel, rangeModel.setCurrentFraction));
        })));
        this.disposables.add(this.sliderViewModel);
    },
    
    createTransparencySettings: function tab_ColorTransparencyControlView$createTransparencySettings(rangeModel) {
        this.createTransparencyLabel();
        this.createSlider(rangeModel);
    },
    
    commitTransparencyPercentageText: function tab_ColorTransparencyControlView$commitTransparencyPercentageText() {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LinePatternPickerView

tab.LinePatternPickerView = function tab_LinePatternPickerView(viewModel) {
    this._patternToSpriteName$3 = {};
    this._patternOrder$3 = [ 'solid', 'dashed', 'dotted' ];
    tab.LinePatternPickerView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabLinePatternPicker'/>") ]);
    this._patternToSpriteName$3['none'] = 'linepattern-none';
    this._patternToSpriteName$3['solid'] = 'linepattern-solid';
    this._patternToSpriteName$3['dashed'] = 'linepattern-dashed';
    this._patternToSpriteName$3['dotted'] = 'linepattern-dotted';
}
tab.LinePatternPickerView.prototype = {
    
    get__linePatternPickerViewModel$3: function tab_LinePatternPickerView$get__linePatternPickerViewModel$3() {
        return this.get_viewModel();
    },
    
    onAddedToDom: function tab_LinePatternPickerView$onAddedToDom() {
        tab.LinePatternPickerView.callBaseMethod(this, 'onAddedToDom');
        this.createPicker();
    },
    
    onViewModelPropertyChanged: function tab_LinePatternPickerView$onViewModelPropertyChanged(sender, e) {
        this.updateContent();
    },
    
    createPicker: function tab_LinePatternPickerView$createPicker() {
        spiff.ClickHandler.targetAndClick($('<div/>').html(tab.Strings.LinePatternNone).addClass('tabLinePatternTextButton').addClass('tabStylePickerButton').toggleClass('tabStylePickerButtonSelected', 'none' === this.get__linePatternPickerViewModel$3().get_selectedLinePattern()).appendTo(this.get_element()), this._createLinePatternClickHandler$3('none'));
        var $enum1 = ss.IEnumerator.getEnumerator(this._patternOrder$3);
        while ($enum1.moveNext()) {
            var linePattern = $enum1.current;
            var spriteName = this._patternToSpriteName$3[linePattern];
            spiff.ClickHandler.targetAndClick($('<div/>').addClass(spriteName).addClass('tabLinePattern').addClass('tabStylePickerButton').toggleClass('tabStylePickerButtonSelected', linePattern === this.get__linePatternPickerViewModel$3().get_selectedLinePattern()).appendTo(this.get_element()), this._createLinePatternClickHandler$3(linePattern));
        }
    },
    
    _createLinePatternClickHandler$3: function tab_LinePatternPickerView$_createLinePatternClickHandler$3(linePattern) {
        return ss.Delegate.create(this, function() {
            this.get__linePatternPickerViewModel$3().set_selectedLinePattern(linePattern);
        });
    },
    
    updateContent: function tab_LinePatternPickerView$updateContent() {
        this.removePicker();
        this.createPicker();
    },
    
    removePicker: function tab_LinePatternPickerView$removePicker() {
        this.get_element().children().remove();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.StrokeWidthPickerView

tab.StrokeWidthPickerView = function tab_StrokeWidthPickerView(viewModel) {
    tab.StrokeWidthPickerView.initializeBase(this, [ viewModel, spiff.Template.fromHtml("<div class='tabStrokeWidthPicker'/>") ]);
}
tab.StrokeWidthPickerView.prototype = {
    
    get__strokeWidthPickerViewModel$3: function tab_StrokeWidthPickerView$get__strokeWidthPickerViewModel$3() {
        return this.get_viewModel();
    },
    
    onAddedToDom: function tab_StrokeWidthPickerView$onAddedToDom() {
        tab.StrokeWidthPickerView.callBaseMethod(this, 'onAddedToDom');
        this.createPicker();
    },
    
    onViewModelPropertyChanged: function tab_StrokeWidthPickerView$onViewModelPropertyChanged(sender, e) {
        this.updateContent();
    },
    
    createPicker: function tab_StrokeWidthPickerView$createPicker() {
        for (var strokeWidth = 1; strokeWidth <= 5; strokeWidth++) {
            this._buildStrokeWidthItem$3(strokeWidth);
        }
    },
    
    _buildStrokeWidthItem$3: function tab_StrokeWidthPickerView$_buildStrokeWidthItem$3(strokeWidth) {
        var spriteName = 'strokewidth' + strokeWidth;
        spiff.ClickHandler.targetAndClick($('<div/>').addClass(spriteName).addClass('tabStrokeWidth').addClass('tabStylePickerButton').toggleClass('tabStylePickerButtonSelected', strokeWidth === this.get__strokeWidthPickerViewModel$3().get_selectedStrokeWidth()).appendTo(this.get_element()), this._createStrokeWidthClickHandler$3(strokeWidth));
    },
    
    _createStrokeWidthClickHandler$3: function tab_StrokeWidthPickerView$_createStrokeWidthClickHandler$3(strokeWidth) {
        return ss.Delegate.create(this, function() {
            this.get__strokeWidthPickerViewModel$3().set_selectedStrokeWidth(strokeWidth);
        });
    },
    
    updateContent: function tab_StrokeWidthPickerView$updateContent() {
        this.removePicker();
        this.createPicker();
    },
    
    removePicker: function tab_StrokeWidthPickerView$removePicker() {
        this.get_element().children().remove();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorOptionView

tab.QuantitativeColorOptionView = function tab_QuantitativeColorOptionView(viewModel, t) {
    tab.QuantitativeColorOptionView.initializeBase(this, [ viewModel, t ]);
    this.dom = t;
    this.quantitativeColorOptionViewModel = viewModel;
    this.quantitativeColorOptionViewModel.add_isReversedChanged(ss.Delegate.create(this, this.handleIsReversedChanged));
    this.quantitativeColorOptionViewModel.add_isSteppedChanged(ss.Delegate.create(this, this.handleIsSteppedChanged));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.quantitativeColorOptionViewModel.remove_isReversedChanged(ss.Delegate.create(this, this.handleIsReversedChanged));
        this.quantitativeColorOptionViewModel.remove_isSteppedChanged(ss.Delegate.create(this, this.handleIsSteppedChanged));
    })));
}
tab.QuantitativeColorOptionView.prototype = {
    quantitativeColorOptionViewModel: null,
    dom: null,
    _stepperControlView$3: null,
    _colorTransparencyControlView$3: null,
    
    get_stepperControlView: function tab_QuantitativeColorOptionView$get_stepperControlView() {
        return this._stepperControlView$3;
    },
    
    get_colorTransparencyControlView: function tab_QuantitativeColorOptionView$get_colorTransparencyControlView() {
        return this._colorTransparencyControlView$3;
    },
    set_colorTransparencyControlView: function tab_QuantitativeColorOptionView$set_colorTransparencyControlView(value) {
        this._colorTransparencyControlView$3 = value;
        return value;
    },
    
    createColorControls: function tab_QuantitativeColorOptionView$createColorControls() {
        this.createColorPaletteSelectionControl();
        this.createColorReversalControl();
        this.addSteppedColorSettings();
    },
    
    createColorPaletteSelectionControl: function tab_QuantitativeColorOptionView$createColorPaletteSelectionControl() {
        var palettePickerView = spiff.ObjectRegistry.newView(tab.ColorPalettePickerView, this.quantitativeColorOptionViewModel.get_palettePickerViewModel());
        palettePickerView.addToDom(this.dom.colorPaletteSelectionControlContainer);
        this.disposables.add(palettePickerView);
    },
    
    createColorReversalControl: function tab_QuantitativeColorOptionView$createColorReversalControl() {
        var colorReversalControl = tableau.util.createCheckBox(ss.Delegate.create(this, function() {
            this.quantitativeColorOptionViewModel.toggleColorReversal();
        }), tab.Strings.AuthReverseColorLabel, 'tabAuthColorReverseCheck', 3, this.quantitativeColorOptionViewModel.get_isReversed(), this.disposables);
        this.dom.colorReversalControl.append(colorReversalControl);
    },
    
    createStepperControl: function tab_QuantitativeColorOptionView$createStepperControl(attachTo) {
        this._stepperControlView$3 = spiff.ObjectRegistry.newView(tab.StepperControlView, this.quantitativeColorOptionViewModel.get_stepperControlViewModel());
        attachTo.append(this.get_stepperControlView().get_element());
        this.disposables.add(this.get_stepperControlView());
    },
    
    createSteppedCheckbox: function tab_QuantitativeColorOptionView$createSteppedCheckbox() {
        return tableau.util.createCheckBox(ss.Delegate.create(this, function() {
            this.quantitativeColorOptionViewModel.toggleIsStepped();
        }), tab.Strings.AuthSteppedColorLabel, 'tabAuthSteppedCheck', 3, this.quantitativeColorOptionViewModel.get_isStepped(), this.disposables);
    },
    
    addSteppedColorSettings: function tab_QuantitativeColorOptionView$addSteppedColorSettings() {
        this.dom.steppedColorControl.append(this.createSteppedCheckbox());
        this.createStepperControl(this.dom.steppedColorControl);
    },
    
    handleIsSteppedChanged: function tab_QuantitativeColorOptionView$handleIsSteppedChanged(isStepped) {
        this.dom.getElementBySelector('.' + 'tabAuthSteppedCheck' + ' input').prop('checked', isStepped);
    },
    
    handleIsReversedChanged: function tab_QuantitativeColorOptionView$handleIsReversedChanged(isReversed) {
        this.dom.getElementBySelector('.' + 'tabAuthColorReverseCheck' + ' input').prop('checked', isReversed);
    },
    
    onAddedToDom: function tab_QuantitativeColorOptionView$onAddedToDom() {
        tab.QuantitativeColorOptionView.callBaseMethod(this, 'onAddedToDom');
        this.get_colorTransparencyControlView().addToDom(this.dom.transparencyControlContainer);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorOptionTemplate

tab.QuantitativeColorOptionTemplate = function tab_QuantitativeColorOptionTemplate(root) {
    tab.QuantitativeColorOptionTemplate.initializeBase(this, [ root ]);
    this.colorPaletteSelectionControlContainer = this.getElementBySelector('.tabColorPalettePickerContainer');
    this.colorReversalControl = this.getElementBySelector('.tabAuthColorReverseControl');
    this.steppedColorControl = this.getElementBySelector('.tabColorSteps');
    this.transparencyControlContainer = this.getElementBySelector('.tabAuthTransparencyControlContainer');
}
tab.QuantitativeColorOptionTemplate.prototype = {
    colorPaletteSelectionControlContainer: null,
    colorReversalControl: null,
    steppedColorControl: null,
    transparencyControlContainer: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPalettePickerView

tab.ColorPalettePickerView = function tab_ColorPalettePickerView(viewModel) {
    tab.ColorPalettePickerView.initializeBase(this, [ viewModel, new tab.ColorPalettePickerTemplate() ]);
    this.colorPalettePickerViewModel = viewModel;
    this.dom = this.get_template();
    this._setupColorPaletteSwatches$2();
    this.setupNavigationControl();
    this.setupPageControls();
}
tab.ColorPalettePickerView.prototype = {
    dom: null,
    colorPalettePickerViewModel: null,
    
    setupPageControls: function tab_ColorPalettePickerView$setupPageControls() {
        for (var pageNo = 0; pageNo < this.colorPalettePickerViewModel.get_pages().length; pageNo++) {
            var pageLink = $('<a>').data('pageNo', pageNo);
            this.disposables.add(spiff.TableauClickHandler.targetAndClick(pageLink.get(0), ss.Delegate.create(this, function(e) {
                var pageLinkObject = $(e.target);
                this.colorPalettePickerViewModel.set_currentPageIndex(pageLinkObject.data()['pageNo']);
                this.dom.pageControls.children('a.tabPageHighlight').removeClass('tabPageHighlight');
                pageLinkObject.addClass('tabPageHighlight');
            })));
            if (pageNo === this.colorPalettePickerViewModel.get_currentPageIndex()) {
                pageLink.addClass('tabPageHighlight');
            }
            this.dom.pageControls.append(pageLink);
        }
    },
    
    onViewModelPropertyChanged: function tab_ColorPalettePickerView$onViewModelPropertyChanged(sender, e) {
        tab.ColorPalettePickerView.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
        if (e.get_propertyName() === 'CurrentPage') {
            this.handleCurrentPageChange();
        }
        else if (e.get_propertyName() === 'SelectedPalette') {
            this.dom.clearSelection();
            this.dom.get_domRoot().find('.tabColorPalette').each(ss.Delegate.create(this, function(i, paletteDiv) {
                var paletteDivObj = $(paletteDiv);
                var paletteName = paletteDivObj.data('paletteName');
                if (ss.isValue(paletteName) && paletteName === this.colorPalettePickerViewModel.get_selectedPalette()) {
                    paletteDivObj.addClass('tabPaletteSelected');
                }
            }));
        }
    },
    
    updateNavigationButtons: function tab_ColorPalettePickerView$updateNavigationButtons() {
        this.dom.leftButton.toggleClass('disabled', this.colorPalettePickerViewModel.get_isAtFisrtPage());
        this.dom.rightButton.toggleClass('disabled', this.colorPalettePickerViewModel.get_isAtLastPage());
    },
    
    handleCurrentPageChange: function tab_ColorPalettePickerView$handleCurrentPageChange() {
        var pageNo = this.colorPalettePickerViewModel.get_currentPageIndex();
        this.dom.pageControls.find('a').each(ss.Delegate.create(this, function(i, e) {
            var pageLink = $(e);
            var data = pageLink.data();
            if (ss.isNullOrUndefined(data)) {
                return;
            }
            var pageId = parseInt(data['pageNo']);
            var shouldHighlight = (isFinite(pageId) && pageId === this.colorPalettePickerViewModel.get_currentPageIndex());
            pageLink.toggleClass('tabPageHighlight', shouldHighlight);
        }));
        this.scrollToPageNo(pageNo);
        this.updateNavigationButtons();
    },
    
    _setupColorPaletteSwatches$2: function tab_ColorPalettePickerView$_setupColorPaletteSwatches$2() {
        this.dom.clear();
        var pageNo = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(this.colorPalettePickerViewModel.get_pages());
        while ($enum1.moveNext()) {
            var page = $enum1.current;
            var pageTemplate = new tab.ColorPalettePageTemplate();
            if (page.get_isCustomPalettePage()) {
                pageTemplate.get_domRoot().empty();
                var customPaletteDiv = $('<div>').addClass('tabColorSpecialPalette').addClass('tabColorCustomPalette').addClass('tabPaletteSelected');
                customPaletteDiv.append($('<div>').addClass('tabPaletteBorder'));
                customPaletteDiv.append($('<span>').text(this.colorPalettePickerViewModel.get_selectedPalette()));
                pageTemplate.get_domRoot().append(customPaletteDiv);
            }
            else {
                var autoButton = this._createAutomaticButton$2(pageTemplate);
                if (!!pageNo) {
                    autoButton.hide();
                }
                for (var groupNo = 0; groupNo < pageTemplate.paletteColumnList.length; ++groupNo) {
                    this._buildColorGroups$2(page.get_paletteGroups()[groupNo].paletteItems, pageTemplate.paletteColumnList[groupNo], page.get_paletteGroups()[groupNo].paletteItems.length);
                }
            }
            this.dom.palettePickerPageContainer.append(pageTemplate.get_domRoot());
            pageNo++;
        }
        this.initPaletteEventHandlers();
        this.updateNavigationButtons();
    },
    
    _createAutomaticButton$2: function tab_ColorPalettePickerView$_createAutomaticButton$2(pageTemplate) {
        var autoButton = pageTemplate.automaticPalette;
        autoButton.data('paletteName', '');
        autoButton.toggleClass('tabPaletteSelected', this.colorPalettePickerViewModel.get_automaticPaletteSelected());
        autoButton.append($('<span/>').text(tab.Strings.AuthColorPaletteAutomatic));
        this.disposables.add(spiff.TableauClickHandler.targetAndClick(autoButton.get(0), ss.Delegate.create(this, function(e) {
            this.selectPaletteElement(autoButton);
            this.dom.clearSelection();
            autoButton.addClass('tabPaletteSelected');
            this.colorPalettePickerViewModel.set_automaticPaletteSelected(true);
        })));
        return autoButton;
    },
    
    _buildColorGroups$2: function tab_ColorPalettePickerView$_buildColorGroups$2(colorPaletteItems, parent, numPerGroup) {
        var colorHolder = null;
        for (var colorNum = 0; colorNum < colorPaletteItems.length; colorNum++) {
            if (!(colorNum % numPerGroup)) {
                colorHolder = $('<span/>').addClass('tabColorPaletteGroup').appendTo(parent);
            }
            this._buildColorItem$2(colorPaletteItems[colorNum], colorHolder);
        }
    },
    
    _buildColorItem$2: function tab_ColorPalettePickerView$_buildColorItem$2(colorPalette, colorHolder) {
        var paletteDiv = $('<div/>').addClass('tabColorPalette').toggleClass('tabPaletteSelected', colorPalette.paletteName === this.colorPalettePickerViewModel.get_selectedPalette()).addClass('tabAuthPalette-' + colorPalette.paletteName).attr('title', colorPalette.paletteLabel).data('paletteName', colorPalette.paletteName);
        paletteDiv.append($('<div/>').addClass('tabPaletteBorder')).appendTo(colorHolder);
    },
    
    initPaletteEventHandlers: function tab_ColorPalettePickerView$initPaletteEventHandlers() {
        var registerPaletteEventHandler = ss.Delegate.create(this, function(i, element) {
            var palette = $(element);
            this.disposables.add(spiff.TableauClickHandler.targetAndClick(palette.get(0), ss.Delegate.create(this, function(e) {
                this.selectPaletteElement(palette);
            })));
        });
        var palettes = this.dom.get_palettes();
        palettes.each(registerPaletteEventHandler);
        var customPalettes = this.dom.get_customPalettes();
        customPalettes.each(registerPaletteEventHandler);
    },
    
    selectPaletteElement: function tab_ColorPalettePickerView$selectPaletteElement(paletteDiv) {
        this.dom.clearSelection();
        paletteDiv.addClass('tabPaletteSelected');
        this.colorPalettePickerViewModel.set_selectedPalette(paletteDiv.data('paletteName'));
    },
    
    scrollToOffset: function tab_ColorPalettePickerView$scrollToOffset(offset, transition) {
        tab.DomUtil.setElementPosition(this.dom.palettePickerPageContainer, offset, 0, (transition) ? '400ms' : '0');
    },
    
    scrollOffsetForPageNo: function tab_ColorPalettePickerView$scrollOffsetForPageNo(pageNo) {
        return -pageNo * this.dom.get_pages().first().width();
    },
    
    scrollToPageNo: function tab_ColorPalettePickerView$scrollToPageNo(pageNo) {
        this.scrollToOffset(this.scrollOffsetForPageNo(pageNo), true);
    },
    
    setupNavigationControl: function tab_ColorPalettePickerView$setupNavigationControl() {
        this.disposables.add(spiff.TableauClickHandler.targetAndClick(this.dom.leftButtonArea.get(0), ss.Delegate.create(this, function(e) {
            this.colorPalettePickerViewModel.set_currentPageIndex(this.colorPalettePickerViewModel.get_currentPageIndex() - 1);
        })));
        this.disposables.add(spiff.TableauClickHandler.targetAndClick(this.dom.rightButtonArea.get(0), ss.Delegate.create(this, function(e) {
            this.colorPalettePickerViewModel.set_currentPageIndex(this.colorPalettePickerViewModel.get_currentPageIndex() + 1);
        })));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPalettePickerTemplate

tab.ColorPalettePickerTemplate = function tab_ColorPalettePickerTemplate() {
    tab.ColorPalettePickerTemplate.initializeBase(this, [ $("<div class='tabColorPalettePicker'>\n        <div class='tabAuthLeftButtonArea'>\n            <div class='tabAuthPalettePickerLeftButton'/>\n        </div>\n        <div class='tabColorPalettePickerWindow'>\n            <div class='tabColorPalettePickerPageContainer'/>\n        </div>\n        <div class='tabAuthRightButtonArea'>\n            <div class='tabAuthPalettePickerRightButton'/>\n        </div>\n        <div class='tabPalettePageControlsArea'>\n            <div class='tabPalettePageControls'/>\n        </div>\n    </div>") ]);
    this.palettePickerWindow = this.getElementBySelector('.tabColorPalettePickerWindow');
    this.palettePickerPageContainer = this.getElementBySelector('.tabColorPalettePickerPageContainer');
    this.leftButtonArea = this.getElementBySelector('.tabAuthLeftButtonArea');
    this.rightButtonArea = this.getElementBySelector('.tabAuthRightButtonArea');
    this.leftButton = this.getElementBySelector('.tabAuthPalettePickerLeftButton');
    this.rightButton = this.getElementBySelector('.tabAuthPalettePickerRightButton');
    this.pageControls = this.getElementBySelector('.tabPalettePageControls');
}
tab.ColorPalettePickerTemplate.prototype = {
    palettePickerWindow: null,
    palettePickerPageContainer: null,
    leftButtonArea: null,
    rightButtonArea: null,
    leftButton: null,
    rightButton: null,
    pageControls: null,
    
    get_pages: function tab_ColorPalettePickerTemplate$get_pages() {
        return this.getElementsBySelector('.tabColorPalettePage');
    },
    
    get_palettes: function tab_ColorPalettePickerTemplate$get_palettes() {
        return this.getElementsBySelector('.tabColorPalette');
    },
    
    get_automaticPalette: function tab_ColorPalettePickerTemplate$get_automaticPalette() {
        return this.getElementsBySelector('.tabColorAutomaticPalette');
    },
    
    get_customPalettes: function tab_ColorPalettePickerTemplate$get_customPalettes() {
        return this.getElementsBySelector('.tabColorCustomPalette');
    },
    
    clear: function tab_ColorPalettePickerTemplate$clear() {
        this.get_pages().remove();
    },
    
    clearSelection: function tab_ColorPalettePickerTemplate$clearSelection() {
        this.get_automaticPalette().removeClass('tabPaletteSelected');
        this.get_palettes().removeClass('tabPaletteSelected');
        this.get_customPalettes().removeClass('tabPaletteSelected');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPalettePageTemplate

tab.ColorPalettePageTemplate = function tab_ColorPalettePageTemplate() {
    tab.ColorPalettePageTemplate.initializeBase(this, [ $("<span class='tabColorPalettePage'>\n    <div class='tabColorSpecialPalette tabColorAutomaticPalette tabColorPalette'>\n        <div class='tabPaletteBorder'/>\n    </div>\n    <div class='tabColorPalettePageColumns'>\n        <span class='tabColorPalettePageColumn0'/>\n        <span class='tabColorPalettePageColumn1'/>\n    </div>\n</span>") ]);
    this.automaticPalette = this.getElementBySelector('.tabColorAutomaticPalette');
    this.paletteColumns = this.getElementBySelector('.tabColorPalettePageColumns');
    this.paletteColumnList = new Array(2);
    for (var groupNo = 0; groupNo < this.paletteColumnList.length; ++groupNo) {
        this.paletteColumnList[groupNo] = this.getElementBySelector('.tabColorPalettePageColumn' + groupNo.toString());
    }
}
tab.ColorPalettePageTemplate.prototype = {
    automaticPalette: null,
    paletteColumns: null,
    paletteColumnList: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.StylePickerView

tab.StylePickerView = function tab_StylePickerView(viewModel, template) {
    tab.StylePickerView.initializeBase(this, [ viewModel, template ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.TextEncodingOptionView

tab.TextEncodingOptionView = function tab_TextEncodingOptionView(vm) {
    tab.TextEncodingOptionView.initializeBase(this, [ vm, new tab.TextEncodingOptionTemplate() ]);
    this.dom = this.get_template();
    this.textOptionViewModel = vm;
    this.textOptionViewModel.add_labelsOnChanged(ss.Delegate.create(this, this.handleLabelsOnChanged));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.textOptionViewModel.remove_labelsOnChanged(ss.Delegate.create(this, this.handleLabelsOnChanged));
    })));
}
tab.TextEncodingOptionView.prototype = {
    textOptionViewModel: null,
    dom: null,
    
    handleLabelsOnChanged: function tab_TextEncodingOptionView$handleLabelsOnChanged(labelsOn) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TextEncodingOptionTemplate

tab.TextEncodingOptionTemplate = function tab_TextEncodingOptionTemplate() {
    tab.TextEncodingOptionTemplate.initializeBase(this, [ $("<div class='tabAuthTextOptionContent'></div>") ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.TypeInPillView

tab.TypeInPillView = function tab_TypeInPillView(viewModel) {
    tab.TypeInPillView.initializeBase(this, [ viewModel, new tab.TypeInPillTemplate() ]);
    this.initDom();
}
tab.TypeInPillView.prototype = {
    _pillView$3: null,
    _sawMouseDown$3: false,
    _mouseDownOnMe$3: false,
    _dragEndedOnMe$3: false,
    _appliedCalc$3: false,
    
    get_pillViewModel: function tab_TypeInPillView$get_pillViewModel() {
        return this._pillView$3;
    },
    set_pillViewModel: function tab_TypeInPillView$set_pillViewModel(value) {
        if (this._pillView$3 === value) {
            return;
        }
        this._pillView$3 = value;
        return value;
    },
    
    dispose: function tab_TypeInPillView$dispose() {
        this._removeClickDetector$3();
        tab.TypeInPillView.callBaseMethod(this, 'dispose');
    },
    
    addToDom: function tab_TypeInPillView$addToDom(parent) {
        parent.append(this.get_element());
    },
    
    onAddedToDom: function tab_TypeInPillView$onAddedToDom() {
        if (!tsConfig.is_mobile) {
            this.get_autoCompleteHelper().set_validFormulaTooltip((tab.BrowserSupport.get_isMac()) ? tab.Strings.CalcEditorApplyTooltipMac : tab.Strings.CalcEditorApplyTooltip);
        }
        tab.TypeInPillView.callBaseMethod(this, 'onAddedToDom');
        this.focusEditor();
    },
    
    initDom: function tab_TypeInPillView$initDom() {
        tab.TypeInPillView.callBaseMethod(this, 'initDom');
        this._addClickDetector$3();
    },
    
    onOpenCompleted: function tab_TypeInPillView$onOpenCompleted() {
        if (!this.get_hasEditor()) {
            return;
        }
        this.get_editor().execCommand('goDocEnd');
    },
    
    createCodeMirrorOptions: function tab_TypeInPillView$createCodeMirrorOptions() {
        var options = tab.TypeInPillView.callBaseMethod(this, 'createCodeMirrorOptions');
        options.extraKeys['Esc'] = ss.Delegate.create(this, this._onEscKey$3);
        return options;
    },
    
    _onEscKey$3: function tab_TypeInPillView$_onEscKey$3() {
        this.calcViewModel.cancelCalculation();
    },
    
    _addClickDetector$3: function tab_TypeInPillView$_addClickDetector$3() {
        this._resetMouseState$3();
        this._removeClickDetector$3();
        spiff.GlobalTouchWatcher.add_firstTouch(ss.Delegate.create(this, this._handleBrowserMouseDown$3));
        spiff.GlobalTouchWatcher.add_press(ss.Delegate.create(this, this._handleBrowserMouseDown$3));
        spiff.GlobalTouchWatcher.add_potentialTap(ss.Delegate.create(this, this._handleBrowserMouseUp$3));
        spiff.GlobalTouchWatcher.add_rightClick(ss.Delegate.create(this, this._handleBrowserRightClick$3));
        spiff.GlobalTouchWatcher.add_dragEnd(ss.Delegate.create(this, this._handleDragEnd$3));
    },
    
    _removeClickDetector$3: function tab_TypeInPillView$_removeClickDetector$3() {
        spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this._handleBrowserMouseDown$3));
        spiff.GlobalTouchWatcher.remove_press(ss.Delegate.create(this, this._handleBrowserMouseDown$3));
        spiff.GlobalTouchWatcher.remove_potentialTap(ss.Delegate.create(this, this._handleBrowserMouseUp$3));
        spiff.GlobalTouchWatcher.remove_rightClick(ss.Delegate.create(this, this._handleBrowserRightClick$3));
        spiff.GlobalTouchWatcher.remove_dragEnd(ss.Delegate.create(this, this._handleDragEnd$3));
    },
    
    _resetMouseState$3: function tab_TypeInPillView$_resetMouseState$3() {
        this._mouseDownOnMe$3 = false;
        this._dragEndedOnMe$3 = false;
        this._appliedCalc$3 = false;
        this._sawMouseDown$3 = false;
    },
    
    _handleDragEnd$3: function tab_TypeInPillView$_handleDragEnd$3(e, cancelCallback) {
        if (this._appliedCalc$3) {
            return;
        }
        var dropTarget = spiff.DragDropManager.findDropTarget(e);
        this._dragEndedOnMe$3 = (dropTarget === this);
        this._handleBrowserMouseUp$3(null, cancelCallback);
    },
    
    _handleBrowserMouseDown$3: function tab_TypeInPillView$_handleBrowserMouseDown$3(e, cancelCallback) {
        this._resetMouseState$3();
        this._sawMouseDown$3 = true;
        this._mouseDownOnMe$3 = this.isEqualOrAncestorOf(e.target);
    },
    
    _handleBrowserRightClick$3: function tab_TypeInPillView$_handleBrowserRightClick$3(e, cancelCallback) {
        this._sawMouseDown$3 = true;
        this._handleBrowserMouseUp$3(e, cancelCallback);
    },
    
    _handleBrowserMouseUp$3: function tab_TypeInPillView$_handleBrowserMouseUp$3(e, cancelCallback) {
        if (!this._sawMouseDown$3 || this._mouseDownOnMe$3 || this._dragEndedOnMe$3) {
            return;
        }
        if (ss.isNullOrUndefined(e) || !this.isEqualOrAncestorOf(e.target)) {
            if (ss.isValue(cancelCallback)) {
                cancelCallback(true);
            }
            if (!this._appliedCalc$3) {
                this._appliedCalc$3 = true;
                this.calcViewModel.applyCalculation(this.get_pillViewModel(), true);
            }
        }
    },
    
    addExtraKeys: function tab_TypeInPillView$addExtraKeys(extraKeys) {
        extraKeys['Enter'] = ss.Delegate.create(this, function() {
            this._appliedCalc$3 = true;
            this.calcViewModel.applyCalculation(this.get_pillViewModel(), true);
        });
    },
    
    animateOpen: function tab_TypeInPillView$animateOpen(startWidth, endWidth, maxWidth) {
        this.get_element().css({ 'max-width': startWidth + 'px', 'min-width': startWidth + 'px' });
        window.setTimeout(ss.Delegate.create(this, function() {
            var lines = $(this.get_editor().getWrapperElement()).find('.CodeMirror-lines');
            var linesMax = (ss.isValue(lines)) ? lines.outerWidth() + 30 : 0;
            var animToWidth = Math.max(endWidth, Math.min(maxWidth, linesMax));
            this.get_element().addClass('tabAnimationTransition');
            this.get_element().css({ 'max-width': animToWidth + 'px', 'min-width': animToWidth + 'px' });
            window.setTimeout(ss.Delegate.create(this, function() {
                this.get_element().removeClass('tabAnimationTransition');
                this.get_element().css({ 'max-width': maxWidth + 'px', 'min-width': animToWidth + 'px' });
                this.onOpenCompleted();
            }), 300);
        }), 1);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TypeInPillTemplate

tab.TypeInPillTemplate = function tab_TypeInPillTemplate() {
    tab.TypeInPillTemplate.initializeBase(this, [ $(tab.TypeInPillTemplate._html$2) ]);
}
tab.TypeInPillTemplate.prototype = {
    
    get_dragSource: function tab_TypeInPillTemplate$get_dragSource() {
        return this.getElementBySelector('.tabTypeInPillCmHolder');
    },
    
    get_dropTarget: function tab_TypeInPillTemplate$get_dropTarget() {
        return this.getElementBySelector('.tabTypeInPillCmHolder');
    },
    
    get_formulaEditorHolder: function tab_TypeInPillTemplate$get_formulaEditorHolder() {
        return this.getElementBySelector('.tabTypeInPillCmHolder');
    },
    
    get_dropInviteBorder: function tab_TypeInPillTemplate$get_dropInviteBorder() {
        return this.get_domRoot();
    }
}


tab.SaveController.registerClass('tab.SaveController');
tab.AnalyticsDropTargetViewModel.registerClass('tab.AnalyticsDropTargetViewModel', spiff.BaseViewModel);
tab.AnalyticsPaneViewModel.registerClass('tab.AnalyticsPaneViewModel', spiff.BaseViewModel);
tab.AnalyticsListItemViewModel.registerClass('tab.AnalyticsListItemViewModel', spiff.BaseViewModel, spiff.IDragSource);
tab.AuthoringTabViewModel.registerClass('tab.AuthoringTabViewModel', spiff.BaseViewModel);
tab.AuthoringToolbarDropdownButtonViewModel.registerClass('tab.AuthoringToolbarDropdownButtonViewModel', tab.ToolbarButtonViewModel);
tab.AuthoringToolbarToggleButtonViewModel.registerClass('tab.AuthoringToolbarToggleButtonViewModel', tab.ToolbarButtonViewModel);
tab.AuthoringToolbarUberPopupButtonViewModel.registerClass('tab.AuthoringToolbarUberPopupButtonViewModel', tab.ToolbarButtonViewModel);
tab.AuthoringToolbarViewModel.registerClass('tab.AuthoringToolbarViewModel', spiff.BaseViewModel);
tab.AuthoringViewModel.registerClass('tab.AuthoringViewModel', spiff.BaseViewModel);
tab.BaseFieldDragInstance.registerClass('tab.BaseFieldDragInstance', spiff.DragInstance);
tab.CalculationFunctionListViewModel.registerClass('tab.CalculationFunctionListViewModel', spiff.BaseViewModel);
tab.CalculationEditorViewModel.registerClass('tab.CalculationEditorViewModel', spiff.BaseViewModel, spiff.IDragResponder);
tab._calculationSnapshot.registerClass('tab._calculationSnapshot');
tab.CardViewModel.registerClass('tab.CardViewModel', spiff.BaseViewModel);
tab.ColorOptionViewModel.registerClass('tab.ColorOptionViewModel', spiff.BaseViewModel, spiff.IUberPopupContent);
tab.ColorPickerViewModel.registerClass('tab.ColorPickerViewModel', tab.ColorOptionViewModel);
tab.IconUtils.registerClass('tab.IconUtils');
tab.LayerEncodingViewModel.registerClass('tab.LayerEncodingViewModel', spiff.BaseViewModel, spiff.IDragResponder);
tab._encodingButtonDropTarget.registerClass('tab._encodingButtonDropTarget', null, spiff.IDropTarget);
tab.MarksContentViewModel.registerClass('tab.MarksContentViewModel', spiff.BaseViewModel, tab.ICardContent);
tab.AuthoringTabNavViewModel.registerClass('tab.AuthoringTabNavViewModel', spiff.BaseViewModel);
tab.AuthoringMastheadViewModel.registerClass('tab.AuthoringMastheadViewModel', spiff.BaseViewModel);
tab.MarkSizePickerViewModel.registerClass('tab.MarkSizePickerViewModel', spiff.BaseViewModel, spiff.IUberPopupContent);
tab.PillDragInstance.registerClass('tab.PillDragInstance', tab.BaseFieldDragInstance);
tab.PillViewModel.registerClass('tab.PillViewModel', spiff.BaseViewModel, spiff.IDragSource, spiff.IDropTarget);
tab.SaveViewModel.registerClass('tab.SaveViewModel', spiff.BaseViewModel);
tab.DataSchemaViewModel.registerClass('tab.DataSchemaViewModel', spiff.BaseViewModel);
tab.DropTargetWithDropState.registerClass('tab.DropTargetWithDropState', null, spiff.IDropTarget, ss.IDisposable);
tab.SchemaViewFieldDropTarget.registerClass('tab.SchemaViewFieldDropTarget', tab.DropTargetWithDropState);
tab.DimensionFieldDropTarget.registerClass('tab.DimensionFieldDropTarget', tab.SchemaViewFieldDropTarget);
tab.MeasureFieldDropTarget.registerClass('tab.MeasureFieldDropTarget', tab.SchemaViewFieldDropTarget);
tab.ConvertUnnamedFieldsDropTarget.registerClass('tab.ConvertUnnamedFieldsDropTarget', tab.DropTargetWithDropState);
tab.FieldDragSource.registerClass('tab.FieldDragSource', null, spiff.IDragSource);
tab.SchemaNode.registerClass('tab.SchemaNode');
tab.ShapePickerViewModel.registerClass('tab.ShapePickerViewModel', spiff.BaseViewModel, spiff.IUberPopupContent);
tab.ShelfViewModel.registerClass('tab.ShelfViewModel', spiff.BaseViewModel, tab.ICardContent, spiff.IDropTarget, spiff.IDragResponder);
tab._pillDividerDropTarget.registerClass('tab._pillDividerDropTarget', null, spiff.IDropTarget);
tab.CalculationDependencyViewModel.registerClass('tab.CalculationDependencyViewModel', spiff.BaseViewModel, spiff.IUberPopupContent);
tab.ShowMeViewModel.registerClass('tab.ShowMeViewModel', spiff.BaseViewModel, spiff.IUberPopupContent);
tab.CalcTextDragInstance.registerClass('tab.CalcTextDragInstance', tab.BaseFieldDragInstance);
tab.TooltipContentViewModel.registerClass('tab.TooltipContentViewModel', spiff.BaseViewModel, spiff.IUberPopupContent);
tab.VizSummaryViewModel.registerClass('tab.VizSummaryViewModel', spiff.BaseViewModel);
tab.AnalyticsDropTargetView.registerClass('tab.AnalyticsDropTargetView', spiff.BaseView);
tab.GlassDropTarget.registerClass('tab.GlassDropTarget', spiff.Glass, spiff.IDropTarget);
tab.AnalyticsDropSpot.registerClass('tab.AnalyticsDropSpot', null, spiff.IDropTarget);
tab.AnalyticsScrollSpot.registerClass('tab.AnalyticsScrollSpot', null, spiff.IDropTarget);
tab.AnalyticsDropTargetTemplate.registerClass('tab.AnalyticsDropTargetTemplate', spiff.Template);
tab.AnalyticsDropTargetAxisRowTemplate.registerClass('tab.AnalyticsDropTargetAxisRowTemplate', spiff.Template);
tab.AnalyticsPaneView.registerClass('tab.AnalyticsPaneView', spiff.BaseView);
tab.AnalyticsListItemView.registerClass('tab.AnalyticsListItemView', spiff.BaseView);
tab.AnalyticsDragAvatar.registerClass('tab.AnalyticsDragAvatar', spiff.BaseView);
tab.AnalyticsDragAvatarTemplate.registerClass('tab.AnalyticsDragAvatarTemplate', spiff.Template);
tab.AnalyticsPaneTemplate.registerClass('tab.AnalyticsPaneTemplate', spiff.Template);
tab.AnalyticsListItemTemplate.registerClass('tab.AnalyticsListItemTemplate', spiff.Template);
tab.AnalyticsListHeaderTemplate.registerClass('tab.AnalyticsListHeaderTemplate', spiff.Template);
tab.AuthoringTabView.registerClass('tab.AuthoringTabView', spiff.BaseView);
tab.AuthoringTabViewTemplate.registerClass('tab.AuthoringTabViewTemplate', spiff.Template);
tab.AuthoringToolbarButtonView.registerClass('tab.AuthoringToolbarButtonView');
tab.AuthoringToolbarToggleButtonTemplate.registerClass('tab.AuthoringToolbarToggleButtonTemplate', tab.ToolbarButtonTemplate);
tab.AuthoringToolbarToggleButtonView.registerClass('tab.AuthoringToolbarToggleButtonView', tab.ToolbarButtonView);
tab.AuthoringToolbarDropdownButtonView.registerClass('tab.AuthoringToolbarDropdownButtonView', tab.ToolbarButtonView);
tab.AuthoringToolbarUberPopupButtonView.registerClass('tab.AuthoringToolbarUberPopupButtonView', tab.ToolbarButtonView);
tab.AuthoringToolbarView.registerClass('tab.AuthoringToolbarView', spiff.BaseView);
tab._authoringToolbarViewTemplate.registerClass('tab._authoringToolbarViewTemplate', spiff.Template);
tab.AuthoringView.registerClass('tab.AuthoringView', null, spiff.IView, spiff.IDragSource);
tab.CalculationEditorDragFeedback.registerClass('tab.CalculationEditorDragFeedback');
tab.CalcTextDragAvatar.registerClass('tab.CalcTextDragAvatar', spiff.Widget, spiff.IView);
tab.CalculationAutoCompleteHelper.registerClass('tab.CalculationAutoCompleteHelper', null, ss.IDisposable);
tab._autoCompleteDocumentState.registerClass('tab._autoCompleteDocumentState');
tab._autoCompleteItemTemplate.registerClass('tab._autoCompleteItemTemplate', spiff.Template);
tab._autoCompleteFieldItemTemplate.registerClass('tab._autoCompleteFieldItemTemplate', tab._autoCompleteItemTemplate);
tab._autoCompleteFunctionItemTemplate.registerClass('tab._autoCompleteFunctionItemTemplate', tab._autoCompleteItemTemplate);
tab._functionHelpTooltipTemplate.registerClass('tab._functionHelpTooltipTemplate', tab.TooltipTemplate);
tab.CalculationEditorView.registerClass('tab.CalculationEditorView', spiff.BaseView, spiff.IDropTarget, spiff.IDragSource);
tab.CalculationEditorTemplate.registerClass('tab.CalculationEditorTemplate', spiff.Template);
tab.CardContentView.registerClass('tab.CardContentView', spiff.BaseView);
tab.CardView.registerClass('tab.CardView', spiff.BaseView);
tab.CardViewTemplate.registerClass('tab.CardViewTemplate', spiff.Template);
tab.CalculationDependencyView.registerClass('tab.CalculationDependencyView', spiff.BaseView);
tab.LeftPanelView.registerClass('tab.LeftPanelView', spiff.BaseView);
tab.LeftPanelTemplate.registerClass('tab.LeftPanelTemplate', spiff.Template);
tab.ColorOptionView.registerClass('tab.ColorOptionView', spiff.BaseView);
tab.ColorPickerView.registerClass('tab.ColorPickerView', tab.ColorOptionView);
tab.ColorPickerTemplate.registerClass('tab.ColorPickerTemplate', spiff.Template);
tab.MarkSizePickerView.registerClass('tab.MarkSizePickerView', spiff.BaseView);
tab.LayerEncodingView.registerClass('tab.LayerEncodingView', spiff.BaseView);
tab.LayerEncodingTemplate.registerClass('tab.LayerEncodingTemplate', spiff.Template);
tab.EncodingTypeButtonTemplate.registerClass('tab.EncodingTypeButtonTemplate', spiff.Template);
tab.MarksContentView.registerClass('tab.MarksContentView', tab.CardContentView);
tab.MarksContentTemplate.registerClass('tab.MarksContentTemplate', spiff.Template);
tab._layerAccordionContent.registerClass('tab._layerAccordionContent', null, tab.IAccordionContent);
tab.AuthoringTabNavView.registerClass('tab.AuthoringTabNavView', spiff.BaseView);
tab.AuthoringTabNavViewTemplate.registerClass('tab.AuthoringTabNavViewTemplate', spiff.Template);
tab.AuthoringMastheadView.registerClass('tab.AuthoringMastheadView', spiff.BaseView);
tab.PillDragAvatar.registerClass('tab.PillDragAvatar', spiff.Widget, spiff.IView);
tab.PillView.registerClass('tab.PillView', spiff.BaseView);
tab.PillViewTemplate.registerClass('tab.PillViewTemplate', spiff.Template);
tab.RenameSheetDialog.registerClass('tab.RenameSheetDialog', spiff.ModalDialog);
tab.SaveView.registerClass('tab.SaveView', spiff.BaseView);
tab.DataSchemaView.registerClass('tab.DataSchemaView', spiff.BaseView);
tab.DataSourceTemplate.registerClass('tab.DataSourceTemplate', spiff.Template);
tab.FieldTemplate.registerClass('tab.FieldTemplate', spiff.Template);
tab.SchemaViewerTemplate.registerClass('tab.SchemaViewerTemplate', spiff.Template);
tab.ShapePickerView.registerClass('tab.ShapePickerView', spiff.BaseView);
tab.ShapePickerTemplate.registerClass('tab.ShapePickerTemplate', spiff.Template);
tab.ShelfView.registerClass('tab.ShelfView', tab.CardContentView);
tab.ShelfCardTemplate.registerClass('tab.ShelfCardTemplate', spiff.Template);
tab.ShowMeView.registerClass('tab.ShowMeView', spiff.BaseView);
tab.SidebarCollapsedWidget.registerClass('tab.SidebarCollapsedWidget', spiff.Widget);
tab.TooltipContentView.registerClass('tab.TooltipContentView', spiff.BaseView);
tab.VizSummaryView.registerClass('tab.VizSummaryView', spiff.BaseView);
tab.VizSummaryTemplate.registerClass('tab.VizSummaryTemplate', spiff.Template);
tab.VizSummaryBadgeTemplate.registerClass('tab.VizSummaryBadgeTemplate', spiff.Template);
tab.AuthoringCommandsViewModel.registerClass('tab.AuthoringCommandsViewModel');
tab.CategoricalColorOptionViewModel.registerClass('tab.CategoricalColorOptionViewModel', tab.ColorOptionViewModel);
tab.ColorTransparencyControlViewModel.registerClass('tab.ColorTransparencyControlViewModel', spiff.BaseViewModel, tab.IContinuousRangeModel);
tab.LinePatternPickerViewModel.registerClass('tab.LinePatternPickerViewModel', spiff.BaseViewModel);
tab.StrokeWidthPickerViewModel.registerClass('tab.StrokeWidthPickerViewModel', spiff.BaseViewModel);
tab.QuantitativeColorOptionViewModel.registerClass('tab.QuantitativeColorOptionViewModel', tab.ColorOptionViewModel);
tab.ColorPalettePickerViewModel.registerClass('tab.ColorPalettePickerViewModel', spiff.BaseViewModel);
tab.ColorPaletteItem.registerClass('tab.ColorPaletteItem');
tab.ColorPaletteGroup.registerClass('tab.ColorPaletteGroup');
tab.PalettePage.registerClass('tab.PalettePage');
tab.TextEncodingOptionViewModel.registerClass('tab.TextEncodingOptionViewModel', spiff.BaseViewModel, spiff.IUberPopupContent);
tab.CalculationDialogView.registerClass('tab.CalculationDialogView', tab.CalculationEditorView);
tab._calculationDialogMoveDragSource.registerClass('tab._calculationDialogMoveDragSource', spiff.MoveDragSource);
tab.CalculationTitleAreaTemplate.registerClass('tab.CalculationTitleAreaTemplate', spiff.Template);
tab.FunctionFlyoutControlTemplate.registerClass('tab.FunctionFlyoutControlTemplate', spiff.Template);
tab.CalculationDialogTemplate.registerClass('tab.CalculationDialogTemplate', tab.CalculationEditorTemplate);
tab.CalculationFunctionListView.registerClass('tab.CalculationFunctionListView', spiff.BaseView);
tab.CalculationFunctionListTemplate.registerClass('tab.CalculationFunctionListTemplate', spiff.Template);
tab.CalculationFunctionInfoTemplate.registerClass('tab.CalculationFunctionInfoTemplate', spiff.Template);
tab.CategoricalColorOptionView.registerClass('tab.CategoricalColorOptionView', tab.ColorOptionView);
tab.CategoricalColorOptionTemplate.registerClass('tab.CategoricalColorOptionTemplate', spiff.Template);
tab.ColorTransparencyControlView.registerClass('tab.ColorTransparencyControlView', spiff.BaseView);
tab.StylePickerView.registerClass('tab.StylePickerView', spiff.BaseView);
tab.LinePatternPickerView.registerClass('tab.LinePatternPickerView', tab.StylePickerView);
tab.StrokeWidthPickerView.registerClass('tab.StrokeWidthPickerView', tab.StylePickerView);
tab.QuantitativeColorOptionView.registerClass('tab.QuantitativeColorOptionView', tab.ColorOptionView);
tab.QuantitativeColorOptionTemplate.registerClass('tab.QuantitativeColorOptionTemplate', spiff.Template);
tab.ColorPalettePickerView.registerClass('tab.ColorPalettePickerView', spiff.BaseView);
tab.ColorPalettePickerTemplate.registerClass('tab.ColorPalettePickerTemplate', spiff.Template);
tab.ColorPalettePageTemplate.registerClass('tab.ColorPalettePageTemplate', spiff.Template);
tab.TextEncodingOptionView.registerClass('tab.TextEncodingOptionView', spiff.BaseView);
tab.TextEncodingOptionTemplate.registerClass('tab.TextEncodingOptionTemplate', spiff.Template);
tab.TypeInPillView.registerClass('tab.TypeInPillView', tab.CalculationEditorView);
tab.TypeInPillTemplate.registerClass('tab.TypeInPillTemplate', tab.CalculationEditorTemplate);
tab.SaveController._instance = null;
tab.AnalyticsDropTargetViewModel.hoverTargetChanged = 'HoverTarget';
tab.AuthoringViewModel.cardLayout = {};
(function () {
    tab.StartupUtils.callAfterBootstrap(function() {
        var l = tab.WindowHelper.getLocation(window.self);
        var queryParams = tab.MiscUtil.getUriQueryParameters(l.search);
        if (Object.keyExists(queryParams, ':showSaveAs')) {
            tab.SaveController.get_instance().saveWorkbookAs();
        }
        var transitionToGuest = tabBootstrap.Utility.getValueFromUrlHash('guest') === 'n';
        if (transitionToGuest) {
            tabBootstrap.Utility.removeEntryFromUrlHash('guest');
            if (tsConfig.is_authoring && tsConfig.is_guest) {
                var pathAndQuery = tab.WindowHelper.getPathAndSearch(window.self);
                var vizportalSignInUrl = '/signin' + '?externalRedirect=' + encodeURIComponent(pathAndQuery) + '&site=' + encodeURIComponent(tsConfig.site_url_name);
                tab.WindowHelper.setLocationHref(window.self, vizportalSignInUrl);
            }
        }
    });
    tab.AuthoringViewModel.cardLayout['top'] = [['columns'], ['rows']];
    tab.AuthoringViewModel.cardLayout['left'] = [['pages', 'filters', 'marks', 'measureValues']];
    tab.AuthoringViewModel.cardLayout['right'] = [];
    tab.AuthoringViewModel.cardLayout['bottom'] = [];
})();
tab.CalculationEditorViewModel.validationDelay = 250;
tab.ColorPickerViewModel._blackAndWhite$2 = ['#000000', '#FFFFFF'];
tab.ColorPickerViewModel._darkGrays$2 = ['#1B1B1B', '#353535', '#555555', '#686868', '#898989'];
tab.ColorPickerViewModel._lightGrays$2 = ['#F7F7F7', '#F0F0F0', '#D7D7D7', '#C0C0C0', '#ACACAC'];
tab.ColorPickerViewModel._presets1$2 = ['#735C3A', '#9C835F', '#C1A681', '#820000', '#B40F1E', '#D8504C', '#9E4C00', '#CC721E', '#F1923E', '#906800', '#B68900', '#DAA800', '#567332', '#7C9B57', '#99B872', '#26794A', '#4D9F6D', '#67B986'];
tab.ColorPickerViewModel._presets2$2 = ['#437564', '#679A88', '#87BBA8', '#3F6A6E', '#628E92', '#87B4B8', '#4F6E8D', '#6F95BF', '#8DB5E0', '#297A98', '#439AB9', '#62B6D5', '#404B73', '#7780A2', '#A4ACCC', '#605D7C', '#928DAF', '#ADA8CB'];
tab.IconUtils.tableCalcIconClass = 'tabAuthPillIconTableCalc';
tab.MarksContentViewModel.propertyCurrentLayer = 'CurrentLayer';
tab.AuthoringTabNavViewModel.currentTabProperty = 'CurrentTab';
tab.MarkSizePickerViewModel.markSizeProperty = 'CurrentFraction';
tab.DataSchemaViewModel.selectedFieldProperty = 'SelectedField';
tab.DataSchemaViewModel.sectionsInOrder = ['dimensions', 'measure', 'groups', 'parameters'];
tab.ShowMeViewModel.showMeCommandsProperty = 'ShowMeCommands';
tab.AnalyticsDropTargetView.dropTargetIdPrefix = 'tabAoDropTarget-';
tab.AnalyticsDropTargetView.dropSpotDirectHoverClass = 'tabDirectHover';
tab.AnalyticsDropTargetView.dropSpotIndirectHoverClass = 'tabIndirectHover';
tab.AnalyticsScrollSpot.scrollDelay = 100;
tab.AnalyticsDropTargetTemplate._dropColumnHeader$1 = "<span class='tabAdAreaDropSpot tabAdDropCell'>" + "<div class='tabAdAreaDropImage'></div>" + "<div class='tabAdAreaDropLabel'></div>" + '</span>';
tab.AnalyticsDropTargetTemplate._htmlTemplate$1 = "<div class='tabAdDropTarget'>" + "<div class='tabAdHeaderRow'>" + "<span class='tabAdDropTitle tabAdAxisCell'>" + "<div class='tabAdDropInstructionTextPre'></div>" + "<div class='tabAdDropLabel'></div>" + "<div class='tabAdDropInstructionTextPost'></div>" + '</span>' + '</div>' + "<div class='tabAdHorizontalDivider'></div>" + "<div class='tabAdAxisHolder'>" + "<div class='tabAdAxisListScroller'>" + "<div class='tabAdAxisList'></div>" + "<div class='tabAdScrollHoverTop'></div>" + "<div class='tabAdScrollHoverBottom'></div>" + '</div>' + '</div>' + '</div>';
tab.AnalyticsDropTargetAxisRowTemplate._dropCellHTML$1 = "<span class='tabAdAxisDropSpotHolder'>" + "<span class='tabAdAxisDropSpot'></span>" + '</span>';
tab.AnalyticsDropTargetAxisRowTemplate._htmlTemplate$1 = "<div class='tabAdAxisRow'>" + "<span class='tabAdAxisName tabAdAxisCell'></span>" + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.AnalyticsPaneView, tab.AnalyticsPaneView);
})();
tab.AnalyticsListItemTemplate._html$1 = "<div class='tabAnalyticsListItem'>" + "<span class='tabAnalyticsListItemIcon' />" + "<span class='tabAnalyticsListItemName' />" + '</div>';
tab.AnalyticsListHeaderTemplate._html$1 = "<div class='tabAnalyticsListHeader'>" + "<span class='tabAnalyticsListHeaderName' />" + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.AuthoringTabView, tab.AuthoringTabView);
})();
tab.AuthoringTabViewTemplate.selectedTabClass = 'tabAuthTabChecked';
tab.AuthoringTabViewTemplate.template = "<span class='tabAuthTab'>\n    <div class='tabAuthTabLabel'></div>\n</span>";
tab.AuthoringView.authoringView = null;
(function () {
    var createView = function() {
        var vm = new tab.AuthoringViewModel();
        tab.AuthoringView.authoringView = spiff.ObjectRegistry.newView(tab.AuthoringView, vm);
    };
    tab.StartupUtils.callAfterBootstrap(createView);
})();
tab.CalculationEditorDragFeedback.replaceableMarkerClassname = 'tabTok_replace';
tab.CalculationEditorDragFeedback.nonReplaceableMarkerClassname = 'tabTok_noreplace';
tab.CalculationAutoCompleteHelper.autoCompleteDebounceTimeout = 100;
tab._autoCompleteItemTemplate._itemTemplate$1 = '<div>' + "<div  class='autocomplete_item'>" + "<span class='field-icon-area'><div class='schema-field-icon'></div></span>" + '</div>' + '</div>';
tab.CalculationEditorView.dropInvitedClassName = 'tabDropInvited';
tab.CalculationEditorView._tokenError$2 = 'tabTok_' + 'error';
tab.CalculationEditorView._tokenEmpty$2 = 'tabTok_' + 'empty';
tab.CardViewTemplate.template = "\n<div class='tabAuthCard'>\n    <div class='tabAuthCardShadow'></div>\n    <div class='tabAuthCardLabelArea'>\n        <div class='tabAuthCardExpando'></div>\n        <div class='tabAuthCardIcon'></div>\n        <div class='tabAuthCardLabel'></div>\n        <div class='tabAuthCardExpandoTarget'></div>\n        <div class='tabAuthCardContent'></div>\n    </div>\n</div>";
(function () {
    spiff.ObjectRegistry.registerType(tab.CalculationDependencyView, tab.CalculationDependencyView);
})();
tab.LeftPanelTemplate.htmlTemplate = "\n            <div class='tabAuthLeftPanel'>\n            </div>";
(function () {
    spiff.ObjectRegistry.registerType(tab.MarkSizePickerView, tab.MarkSizePickerView);
})();
tab.LayerEncodingView._encodingSortOrder$2 = null;
(function () {
    tab.LayerEncodingView._encodingSortOrder$2 = {};
    tab.LayerEncodingView._encodingSortOrder$2['color-encoding'] = 1;
    tab.LayerEncodingView._encodingSortOrder$2['size-encoding'] = 2;
    tab.LayerEncodingView._encodingSortOrder$2['text-encoding'] = 3;
    tab.LayerEncodingView._encodingSortOrder$2['level-of-detail-encoding'] = 4;
    tab.LayerEncodingView._encodingSortOrder$2['tooltip-encoding'] = 5;
})();
tab.LayerEncodingTemplate.htmlTemplate = "<div class='tabAuthLayerEncoding'>\n    <div class='tabAuthLayerEncodingPrimitives'/>\n    <div class='tabAuthLayerEncodingButtonRow' />\n<div class='tabAuthLayerEncodingButtonRow' />\n<div class='tabAuthLayerEncodingShelf' />\n</div>";
tab.AuthoringTabNavViewTemplate.template = "\n<div class='tabAuthTabNav'>\n    <div class='tabAuthTabNavControls'>\n        <div class='tabAuthTabNavButton tabAuthTabNavLeftButton'><div class='tabIcon'><div class='tabAuthHitTarget'/></div></div>\n        <div class='tabAuthTabNavButton tabAuthTabNavRightButton'><div class='tabIcon'><div class='tabAuthHitTarget'/></div></div>\n        <div class='tabAuthTabNavButton tabAuthTabNavMenuButton'><div class='tnMenuButton'><div class='tabAuthHitTarget'/></div></div>\n    </div>\n    <div class='tabAuthTabNavTabs'></div>\n</div>";
tab.PillViewTemplate.htmlTemplate = "\n<span class='tabAuthShelfPill tabAuthPillDragSource'>\n    <span class='tabAuthPillExternalIcon' />\n    <span class='tabAuthPillEncodingType' />\n    <span class='tabAuthPillContent'>\n        <div class='tabAuthPillDrillIcon'><div class='tabAuthHitTarget'/></div>\n        <div class='tabAuthPillLabel'>{0}</div>\n        <div class='tabAuthPillMenuBtn'><div class='tabAuthHitTarget'/></div>\n        <div class='tabAuthPillIcons'></div>\n    </span>\n</span>";
tab.RenameSheetDialog.maxSheetNameLength = 254;
tab.RenameSheetDialog.renameTemplate = "\n<div class='tabAuthRenameSheet'>\n    <div>\n        <input name='newSheetName' class='newSheetName' type='text' tabindex='1' maxlength='" + 254 + "'></input>\n    </div>\n    <div class='tab-dialog-status-msg'></div>\n    <div class='tab-dialog-actions tab-dialog-actions-top-spacing'></div>\n</div>";
(function () {
    spiff.ObjectRegistry.registerType(tab.SaveView, tab.SaveView);
})();
tab.DataSourceTemplate.htmlTemplate = "<div class='tab-dataSource'><div class='tab-schema-dataSourceIcon'/><div class='tab-schema-dataSourceName'/></div>";
tab.DataSourceTemplate.dataSourceIconClassName = 'tab-schema-dataSourceIcon';
tab.DataSourceTemplate.selectedDataSourceClassName = 'tab-schema-dataSourceSelected';
tab.FieldTemplate.fieldDomSelector = '.tab-schema-field';
tab.FieldTemplate.selectedFieldDomSelector = '.selected';
tab.FieldTemplate.fieldAreaDomSelector = '.tab-schema-field-label-area';
tab.FieldTemplate.template = "<div class='tab-schema-field'>" + "<span class='tab-schema-field-expando'><div class='tab-schema-field-expando-icon'><div class='tabAuthHitTarget' /></div></span>" + "<span class='tab-schema-field-label-area'>" + "<span class='tab-schema-field-icon-area'><div class='tab-schema-field-icon' /></span>" + "<div class='tab-schema-field-pill'>" + "<span class='tab-schema-field-content'>" + "<div class='tab-schema-field-label' />" + "<div class='tab-schema-field-pill-menu-btn'>" + "<div class='tab-schema-field-pill-menu-icon' />" + '</div>' + '</span>' + '</div>' + '</span>' + "<div class='tab-schema-field-children' />" + '</div>';
tab.SchemaViewerTemplate.template = "\n<div class='tab-schemaViewer'>\n  <div class='tab-schemaViewerScroll'>\n      <div class='tab-schemaViewerContentArea'>\n        <div class='tab-schemaHeader tab-schemaDataSourcesHeader'>Data</div>\n        <div class='tab-dataSources'>\n            <div class='tab-dataSourceTitles'/>\n            <div class='tab-dataRefreshButtonArea'/>\n        </div>\n        <div class='tab-schemaHeader tab-schemaDimensionsHeader'>Dimensions</div>\n        <div class='tab-schemaDimensions'><div class='tab-schemaViewerContent'></div></div>\n        <div class='tab-schemaHeader tab-schemaMeasuresHeader'>Measures</div>\n        <div class='tab-schemaMeasures'><div class='tab-schemaViewerContent'></div></div>\n        <div class='tab-schemaHeader tab-schemaSetsHeader'>Sets</div>\n        <div class='tab-schemaSets'><div class='tab-schemaViewerContent'></div></div>\n        <div class='tab-schemaHeader tab-schemaParametersHeader'>Parameters</div>\n        <div class='tab-schemaParameters'><div class='tab-schemaViewerContent'></div></div>\n      </div>\n  </div>\n  <div class='tab-schemaDropInviteTop'></div>\n  <div class='tab-schemaDropInviteLeft'></div>\n  <div class='tab-schemaDropInviteBottom'></div>\n  <div class='tab-schemaDropInviteRight'></div>\n</div>";
tab.ShelfCardTemplate.template = "<div class='tabAuthShelf'><div class='tabAuthShelfPills'><div class='tabAuthShelfPillsContent tabAuthShelfDropTarget'/></div></div>";
tab.ShelfCardTemplate.templatePillDivider = "<span class='tabAuthShelfPillDivider'><div class='tabAuthShelfPillDividerTarget'/><div class='tabAuthShelfPillDividerPlaceholder'/></span>";
tab.ShelfCardTemplate.templateClickSpacer = "<span class='tabAuthShelfClickArea'/>";
(function () {
    spiff.ObjectRegistry.registerType(tab.ShowMeView, tab.ShowMeView);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.TooltipContentView, tab.TooltipContentView);
})();
tab.LinePatternPickerViewModel.selectedLinePatternProperty = 'SelectedLinePattern';
tab.StrokeWidthPickerViewModel.selectedStrokeWidthProperty = 'SelectedStrokeWidth';
tab.QuantitativeColorOptionViewModel.colorStepTextClassName = 'tabAuthColorStepText';
tab.ColorPalettePickerViewModel.groupsPerPage = 2;
tab.ColorPalettePickerViewModel.currentPageProperty = 'CurrentPage';
tab.ColorPalettePickerViewModel.selectedPaletteProperty = 'SelectedPalette';
(function () {
    spiff.ObjectRegistry.registerType(tab.CalculationDialogView, tab.CalculationDialogView);
})();
tab.CalculationDialogTemplate._htmlTemplate$2 = "<div class='tabCalcEditor'>" + "<div class='tabCalcEditorBody'>" + "<div class='tabCalcEditorCmHolder tabCalcEditorDropTarget'></div>" + '</div>' + "<div class='tabCalcEditorControlArea'>" + "<div class='tabCalcEditorStatusHolder'>" + "<div class='tabCalcEditorStatusOk'><span class='tabCalcEditorStatusOkText'/></div>" + "<div class='tabCalcEditorStatusError'>" + "<div class='tabCalcEditorStatusErrorBtn'><span class='tabCalcEditorStatusErrorText'/><span class='tabCalcEditorDropdownBtnIcon'/></div>" + '</div>' + "<div class='tabCalcEditorDependency'>" + "<div class='tabCalcEditorDependsBtn'><span class='tabCalcEditorAffectedSheets'/><span class='tabCalcEditorDropdownBtnIcon'/></div>" + '</div>' + '</div>' + "<div class='tabCalcEditorBtnArea' />" + '</div>' + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.CalculationFunctionListView, tab.CalculationFunctionListView);
})();
tab.CalculationFunctionListTemplate._htmlTemplate$1 = "<div class='tabCalcEditorFunctionArea'>" + "<div class='tabCalcEditorSearchableFuncList'>" + "<div class='tabCalcEditorFuncType'/>" + "<div class='tabCalcEditorFuncSearchBox'/>" + "<div class='tabCalcEditorFuncListSeparator'/>" + "<div class='tabCalcEditorFuncListArea'/>" + '</div>' + "<div class='tabCalcEditorFuncInfoArea'/>" + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.CategoricalColorOptionView, tab.CategoricalColorOptionView);
})();
tab.CategoricalColorOptionTemplate.htmlTemplate = "<div class='tabAuthCategoricalColorOptionContent'>\n    <div class='tabColorPalettePickerContainer'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthTransparencyControlContainer'/>\n</div>";
tab.QuantitativeColorOptionView.colorReverseCheckClassName = 'tabAuthColorReverseCheck';
tab.QuantitativeColorOptionView.steppedCheckClassName = 'tabAuthSteppedCheck';
(function () {
    spiff.ObjectRegistry.registerType(tab.QuantitativeColorOptionView, tab.QuantitativeColorOptionView);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ColorPalettePickerView, tab.ColorPalettePickerView);
})();
tab.ColorPalettePickerTemplate.selectedClass = 'tabPaletteSelected';
tab.ColorPalettePickerTemplate.highlightClass = 'tabPageHighlight';
tab.ColorPalettePageTemplate.specialPaletteClass = 'tabColorSpecialPalette';
tab.ColorPalettePageTemplate.colorPaletteClass = 'tabColorPalette';
tab.StylePickerView.stylePickerButtonClassName = 'tabStylePickerButton';
tab.StylePickerView.stylePickerSelectedButtonClassName = 'tabStylePickerButtonSelected';
tab.TextEncodingOptionView.marksLabelCheckClass = 'tabAuthMarksLabelCheck';
(function () {
    spiff.ObjectRegistry.registerType(tab.TextEncodingOptionView, tab.TextEncodingOptionView);
})();
tab.TextEncodingOptionTemplate.htmlTemplate = "<div class='tabAuthTextOptionContent'></div>";
(function () {
    spiff.ObjectRegistry.registerType(tab.TypeInPillView, tab.TypeInPillView);
})();
tab.TypeInPillTemplate._html$2 = "<span class='tabTypeInPill' title=''>" + "<div class='tabTypeInPillCmHolder'></div>" + '</span>';
});

//! This script was generated using Script# v0.7.4.0
