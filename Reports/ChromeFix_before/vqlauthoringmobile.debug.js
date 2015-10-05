//! vqlauthoringmobile.debug.js
//

dojo.addOnLoad(function() {

Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tab.ColorPalettePickerViewMobile

tab.ColorPalettePickerViewMobile = function tab_ColorPalettePickerViewMobile(viewModel) {
    tab.ColorPalettePickerViewMobile.initializeBase(this, [ viewModel ]);
}
tab.ColorPalettePickerViewMobile.prototype = {
    _palettePageSwipeHandler$3: null,
    _dragStartHorizontalOffset$3: 0,
    _paletteScrollHorizontalOffset$3: 0,
    
    setupNavigationControl: function tab_ColorPalettePickerViewMobile$setupNavigationControl() {
        this.dom.leftButtonArea.hide();
        this.dom.rightButtonArea.hide();
    },
    
    initPaletteEventHandlers: function tab_ColorPalettePickerViewMobile$initPaletteEventHandlers() {
        var spec = spiff.$create_EventHandleSpec();
        spec.dragStart = ss.Delegate.create(this, this._onDragStart$3);
        spec.dragMove = ss.Delegate.create(this, this._onDragMove$3);
        spec.dragEnd = ss.Delegate.create(this, this._onDragEnded$3);
        spec.tap = ss.Delegate.create(this, this._onTap$3);
        this._palettePageSwipeHandler$3 = new spiff.TableauEventHandler(this.dom.palettePickerWindow[0], spec);
    },
    
    dispose: function tab_ColorPalettePickerViewMobile$dispose() {
        tab.ColorPalettePickerViewMobile.callBaseMethod(this, 'dispose');
        if (ss.isValue(this._palettePageSwipeHandler$3)) {
            this._palettePageSwipeHandler$3.dispose();
            this._palettePageSwipeHandler$3 = null;
        }
    },
    
    _onTap$3: function tab_ColorPalettePickerViewMobile$_onTap$3(e) {
        var target = $(e.target);
        var palette = target.parent('.tabColorPalette');
        if (palette.length > 0) {
            this.selectPaletteElement(palette.first());
        }
    },
    
    _onDragStart$3: function tab_ColorPalettePickerViewMobile$_onDragStart$3(e) {
        this._dragStartHorizontalOffset$3 = e.pageX;
    },
    
    _onDragMove$3: function tab_ColorPalettePickerViewMobile$_onDragMove$3(e) {
        e.preventDefault();
        this._paletteScrollHorizontalOffset$3 = e.pageX - this._dragStartHorizontalOffset$3;
        this.scrollToOffset(this._paletteScrollHorizontalOffset$3 + this.scrollOffsetForPageNo(this.colorPalettePickerViewModel.get_currentPageIndex()), false);
    },
    
    _onDragEnded$3: function tab_ColorPalettePickerViewMobile$_onDragEnded$3(e) {
        var offsetRatio = this._paletteScrollHorizontalOffset$3 / 310;
        var pageNo = this.colorPalettePickerViewModel.get_currentPageIndex();
        var pageShift = 0;
        if (offsetRatio > 0.3 && pageNo > 0) {
            pageShift = Math.round(offsetRatio + 1 - 0.3);
        }
        else if (offsetRatio < -0.3 && pageNo < this.colorPalettePickerViewModel.get_pages().length - 1) {
            pageShift = Math.round(offsetRatio - (1 - 0.3));
        }
        if (!!pageShift) {
            this.colorPalettePickerViewModel.set_currentPageIndex(pageNo - pageShift);
        }
        else {
            this.scrollToPageNo(pageNo);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MobileAppHelper

tab.MobileAppHelper = function tab_MobileAppHelper() {
}
tab.MobileAppHelper.isSaveVisible = function tab_MobileAppHelper$isSaveVisible() {
    return tsConfig.allow_save || tsConfig.is_guest;
}
tab.MobileAppHelper.isAllowSaveAs = function tab_MobileAppHelper$isAllowSaveAs() {
    return tsConfig.allow_save_as;
}
tab.MobileAppHelper.invokeSave = function tab_MobileAppHelper$invokeSave(onSuccess, onCancel) {
    tab.SaveController.get_instance().saveWorkbook(onSuccess, onCancel);
}
tab.MobileAppHelper.invokeSaveAs = function tab_MobileAppHelper$invokeSaveAs(onSuccess, onCancel) {
    tab.SaveController.get_instance().saveWorkbookAs(onSuccess, onCancel);
}
tab.MobileAppHelper.invokeRevert = function tab_MobileAppHelper$invokeRevert() {
    tab.WorksheetServerCommands.revert();
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringMastheadViewMobile

tab.AuthoringMastheadViewMobile = function tab_AuthoringMastheadViewMobile(vm) {
    tab.AuthoringMastheadViewMobile.initializeBase(this, [ vm ]);
}
tab.AuthoringMastheadViewMobile.prototype = {
    
    layout: function tab_AuthoringMastheadViewMobile$layout() {
        var windowHelper = new tab.WindowHelper(window.self);
        var maxWorkbookNameDomWidth = windowHelper.get_innerWidth() - this.logoDom.outerWidth() - this.userLinksAreaDom.outerWidth() - this.workbookNameDom.parent().offset().left - this.workbookLinksAreaDom.outerWidth();
        this.workbookNameDom.css('max-width', maxWorkbookNameDomWidth + 'px');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabNavViewMobile

tab.AuthoringTabNavViewMobile = function tab_AuthoringTabNavViewMobile(viewModel) {
    tab.AuthoringTabNavViewMobile.initializeBase(this, [ viewModel ]);
    this.updateContent();
    this._attachScrollHandler$3(this.dom.tabContainer);
}
tab.AuthoringTabNavViewMobile.prototype = {
    _scroller$3: null,
    
    dispose: function tab_AuthoringTabNavViewMobile$dispose() {
        this._scroller$3.dispose();
        tab.AuthoringTabNavViewMobile.callBaseMethod(this, 'dispose');
    },
    
    onAddedToDom: function tab_AuthoringTabNavViewMobile$onAddedToDom() {
        tab.AuthoringTabNavViewMobile.callBaseMethod(this, 'onAddedToDom');
        this._refreshScroller$3();
        this._scrollToActiveTab$3();
    },
    
    onViewModelPropertyChanged: function tab_AuthoringTabNavViewMobile$onViewModelPropertyChanged(sender, e) {
        tab.AuthoringTabNavViewMobile.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
        if (e.get_propertyName() === tab.AuthoringTabNavViewModel.currentTabProperty) {
            this._scrollToActiveTab$3();
        }
    },
    
    updateContent: function tab_AuthoringTabNavViewMobile$updateContent() {
        tab.AuthoringTabNavViewMobile.callBaseMethod(this, 'updateContent');
        this._refreshScroller$3();
        this._scrollToActiveTab$3();
    },
    
    _refreshScroller$3: function tab_AuthoringTabNavViewMobile$_refreshScroller$3() {
        if (ss.isValue(this._scroller$3)) {
            this._scroller$3.resetPosition();
            this._scroller$3.refresh();
        }
    },
    
    _scrollToActiveTab$3: function tab_AuthoringTabNavViewMobile$_scrollToActiveTab$3() {
        if (!this.get_addedToDom()) {
            return;
        }
        var $enum1 = ss.IEnumerator.getEnumerator(spiff.Widget.getWidgets(this.dom.tabContainer.children(), tab.AuthoringTabView));
        while ($enum1.moveNext()) {
            var w = $enum1.current;
            if (w.get_viewModel() === this.authoringTabNavViewModel.get_currentTab() && ss.isValue(this._scroller$3)) {
                var pos = w.get_element().position();
                var currPos = this._scroller$3.get_scrollPos();
                if (pos.left < currPos.x || pos.left > currPos.x + this._scroller$3.get_visibleArea().w) {
                    this._scroller$3.scrollTo(-pos.left, this._scroller$3.get_scrollPos().y);
                }
            }
        }
    },
    
    _attachScrollHandler$3: function tab_AuthoringTabNavViewMobile$_attachScrollHandler$3(container) {
        var touchHandler = new spiff.TableauEventHandler(container[0], spiff.$create_EventHandleSpec());
        var o = spiff.$create_MobileScrollerOptions();
        this._scroller$3 = new spiff.MobileScroller(container[0], touchHandler, o);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringViewMobile

tab.AuthoringViewMobile = function tab_AuthoringViewMobile(authoringViewModel) {
    this._disposables$1 = new tab.DisposableHolder();
    this._currentShelfPosition$1 = 'expanded';
    tab.AuthoringViewMobile.initializeBase(this, [ authoringViewModel ]);
    this._vizSummaryView$1 = spiff.ObjectRegistry.newView(tab.VizSummaryView, this.authoringViewModel.get_vizSummaryViewModel());
    this._topShelvesDom$1 = $("<div class='tabAuthTopShelves'></div>");
    this._leftShelvesDom$1 = $("<div class='tabAuthLeftShelves'></div>");
    this._disposables$1.add(spiff.ClickHandler.targetAndClick(this._vizSummaryView$1.get_element(), ss.Delegate.create(this, function() {
        var pos = this.get_shelfPosition();
        switch (pos) {
            case 'expanded':
                pos = 'collapsed';
                break;
            case 'collapsed':
                pos = 'expanded';
                break;
        }
        this.set_shelfPosition(pos);
    })));
    this.buildDom();
    this.set_shelfPosition(this._currentShelfPosition$1);
    var w = $(window.self);
    this._disposables$1.add(spiff.EventUtil.bindWithDispose(w, 'resize', ss.Delegate.create(this, this._handleResize$1)));
    this._disposables$1.add(spiff.EventUtil.bindWithDispose(w, 'focusout', ss.Delegate.create(this, this._handleResize$1)));
    spiff.OrientationHandler.add_orientationChanged(ss.Delegate.create(this, this._handleOrientationChange$1));
    this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        spiff.OrientationHandler.remove_orientationChanged(ss.Delegate.create(this, this._handleOrientationChange$1));
    })));
}
tab.AuthoringViewMobile.prototype = {
    _vizSummaryView$1: null,
    _topShelvesDom$1: null,
    _leftShelvesDom$1: null,
    _glass$1: null,
    
    get_shelfPosition: function tab_AuthoringViewMobile$get_shelfPosition() {
        return this._currentShelfPosition$1;
    },
    set_shelfPosition: function tab_AuthoringViewMobile$set_shelfPosition(value) {
        window.scrollTo(0, 0);
        var Transition = '300ms ease-out';
        var cssTransformSelector = tab.BrowserSupport.get_cssTransformName();
        var cssTransitionSelector = tab.BrowserSupport.get_cssTransitionName();
        var vizCss = {};
        vizCss[cssTransitionSelector] = Transition;
        var topCss = {};
        topCss[cssTransitionSelector] = Transition;
        var leftShelfCss = {};
        leftShelfCss[cssTransitionSelector] = Transition;
        var schemaCss = {};
        schemaCss[cssTransitionSelector] = Transition;
        switch (value) {
            case 'expanded':
                schemaCss[cssTransformSelector] = '';
                leftShelfCss[cssTransformSelector] = '';
                topCss[cssTransformSelector] = '';
                var startWidth = this.authoringViewModel.get_client().get_domNode().width();
                var leftDisplacement = 225 + 225 - 50;
                var remainingWidth = startWidth - leftDisplacement;
                var scaleFactor = Math.max(0, Math.min(1, remainingWidth / startWidth));
                var translatePct = (1 - scaleFactor) / 2 * 100;
                vizCss[cssTransformSelector] = String.format('translate({0}px, {1}px) translate(-{2}%, -{2}%) scale({3}, {3})', leftDisplacement, 78, translatePct, scaleFactor);
                break;
            case 'collapsed':
                schemaCss[cssTransformSelector] = String.format('translate({0}px, 0px)', -(225 + 225));
                leftShelfCss[cssTransformSelector] = String.format('translate({0}px, 0px)', -(225 + 225));
                topCss[cssTransformSelector] = String.format('translate(0px, {0}px)', -78);
                vizCss[cssTransformSelector] = '';
                break;
            default:
                return;
        }
        this._currentShelfPosition$1 = value;
        this._vizSummaryView$1.get_element().toggle(value !== 'expanded');
        if (value === 'expanded') {
            tab.VizEvent.notifyMobileVizReduceTransform();
            this._showGlass$1();
        }
        else {
            tab.VizEvent.notifyMobileVizExpandTransform();
            this._removeGlass$1();
        }
        this.authoringViewModel.get_vizSummaryViewModel().set_showShelves(value === 'collapsed');
        this.authoringViewModel.get_vizSummaryViewModel().set_showLayers(value === 'collapsed');
        this.leftPanelView.get_dataSchemaView().get_element().css(schemaCss);
        this._leftShelvesDom$1.css(leftShelfCss);
        this._topShelvesDom$1.css(topCss);
        this.authoringViewModel.get_client().get_domNode().css(vizCss);
        return value;
    },
    
    dispose: function tab_AuthoringViewMobile$dispose() {
        this._vizSummaryView$1.dispose();
        this._topShelvesDom$1.remove();
        this._leftShelvesDom$1.remove();
        this._disposables$1.dispose();
        this._removeAreasDom$1();
        tab.AuthoringViewMobile.callBaseMethod(this, 'dispose');
    },
    
    _removeGlass$1: function tab_AuthoringViewMobile$_removeGlass$1() {
        if (ss.isValue(this._glass$1)) {
            this._glass$1.remove_click(ss.Delegate.create(this, this._glassClicked$1));
            this._glass$1.dispose();
            this._glass$1 = null;
        }
    },
    
    _showGlass$1: function tab_AuthoringViewMobile$_showGlass$1() {
        if (ss.isNullOrUndefined(this._glass$1)) {
            this._glass$1 = new spiff.Glass();
            this._glass$1.add_click(ss.Delegate.create(this, this._glassClicked$1));
            this._glass$1.get_element().addClass('tabShelfGlass').addClass((tsConfig.is_mobile_app) ? 'tab-mobileApp' : 'tab-mobileWeb');
            this._glass$1.show();
        }
    },
    
    _glassClicked$1: function tab_AuthoringViewMobile$_glassClicked$1() {
        this.set_shelfPosition('collapsed');
    },
    
    _removeAreasDom$1: function tab_AuthoringViewMobile$_removeAreasDom$1() {
        $('.tabAuthTopShelves').remove();
        $('.tabAuthLeftShelves').remove();
        $('.tabAuthVizSummary').remove();
        this._removeGlass$1();
    },
    
    addContentToAreas: function tab_AuthoringViewMobile$addContentToAreas() {
        var mobileTypeClass = (tsConfig.is_mobile_app) ? 'tab-mobileApp' : 'tab-mobileWeb';
        if (ss.isValue(this.authoringMastheadView)) {
            this.mastheadArea.append(this.authoringMastheadView.get_element());
        }
        this.toolbarArea.append(this.toolbar.get_element());
        this.tabArea.append(this.tabNav.get_element());
        var $enum1 = ss.IEnumerator.getEnumerator(this.cards['top']);
        while ($enum1.moveNext()) {
            var card = $enum1.current;
            this._topShelvesDom$1.append(card.get_element());
        }
        var shelvesHolderDom = $('<div>').appendTo(this._leftShelvesDom$1);
        var $enum2 = ss.IEnumerator.getEnumerator(this.cards['left']);
        while ($enum2.moveNext()) {
            var card = $enum2.current;
            shelvesHolderDom.append(card.get_element());
        }
        this._leftShelvesDom$1.append("<div class='tabAuthBorderRight'/>");
        this._topShelvesDom$1.append("<div class='tabAuthBorderBottom'/>");
        this.leftViewArea.append(this.leftPanelView.get_element());
        $('body').append(this._vizSummaryView$1.get_element()).append(this._leftShelvesDom$1).append(this._topShelvesDom$1);
        this._vizSummaryView$1.get_element().addClass(mobileTypeClass);
        this._leftShelvesDom$1.addClass(mobileTypeClass);
        this._topShelvesDom$1.addClass(mobileTypeClass);
        this.leftPanelView.get_dataSchemaView().get_element().addClass(mobileTypeClass);
        this.mastheadArea.addClass(mobileTypeClass);
        this.toolbarArea.addClass(mobileTypeClass);
    },
    
    leftAreaWidth: function tab_AuthoringViewMobile$leftAreaWidth() {
        return 0;
    },
    
    notifyContentAddedToDom: function tab_AuthoringViewMobile$notifyContentAddedToDom() {
        tab.AuthoringViewMobile.callBaseMethod(this, 'notifyContentAddedToDom');
        this._vizSummaryView$1.onAddedToDom();
    },
    
    handleClientChanged: function tab_AuthoringViewMobile$handleClientChanged() {
        tab.AuthoringViewMobile.callBaseMethod(this, 'handleClientChanged');
        this.set_shelfPosition(this._currentShelfPosition$1);
    },
    
    calculateDropTargetOffset: function tab_AuthoringViewMobile$calculateDropTargetOffset() {
        var topOffset = this.toolbarArea.offset().top + this.toolbarArea.height();
        var leftOffset = 0;
        return tab.$create_Point(leftOffset, topOffset);
    },
    
    _handleResize$1: function tab_AuthoringViewMobile$_handleResize$1(e) {
        this.set_shelfPosition(this._currentShelfPosition$1);
    },
    
    _handleOrientationChange$1: function tab_AuthoringViewMobile$_handleOrientationChange$1() {
        this._handleResize$1(null);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CardViewMobile

tab.CardViewMobile = function tab_CardViewMobile(vm) {
    tab.CardViewMobile.initializeBase(this, [ vm, new tab.CardViewTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.LeftPanelViewMobile

tab.LeftPanelViewMobile = function tab_LeftPanelViewMobile(dataSchemaViewModel, analyticsPaneViewModel) {
    this._disposables$3 = new tab.DisposableHolder();
    tab.LeftPanelViewMobile.initializeBase(this, [ dataSchemaViewModel, analyticsPaneViewModel ]);
    this.dom.get_domRoot().append(this.get_dataSchemaView().get_element());
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPickerViewMobile

tab.ColorPickerViewMobile = function tab_ColorPickerViewMobile(viewModel) {
    tab.ColorPickerViewMobile.initializeBase(this, [ viewModel, new tab.ColorPickerTemplate() ]);
    this.updateContent();
    this.createTransparencyControl();
}
tab.ColorPickerViewMobile.prototype = {
    
    createTransparencyControl: function tab_ColorPickerViewMobile$createTransparencyControl() {
        this.set_colorTransparencyControlView(spiff.ObjectRegistry.newView(tab.ColorTransparencyControlView, this.colorOptionViewModel.get_colorTransparencyControlViewModel()));
        this.get_colorTransparencyControlView().createTransparencySettings(this.colorOptionViewModel.get_colorTransparencyControlViewModel());
    },
    
    _createLinePatternPicker$4: function tab_ColorPickerViewMobile$_createLinePatternPicker$4() {
        this.set_linePatternPickerView(spiff.ObjectRegistry.newView(tab.LinePatternPickerView, this.colorOptionViewModel.get_linePatternPickerViewModel()));
    },
    
    _createStrokeWidthPicker$4: function tab_ColorPickerViewMobile$_createStrokeWidthPicker$4() {
        this.set_strokeWidthPickerView(spiff.ObjectRegistry.newView(tab.StrokeWidthPickerView, this.colorOptionViewModel.get_strokeWidthPickerViewModel()));
    },
    
    commitChangesInView: function tab_ColorPickerViewMobile$commitChangesInView() {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LayerEncodingViewMobile

tab.LayerEncodingViewMobile = function tab_LayerEncodingViewMobile(viewModel) {
    tab.LayerEncodingViewMobile.initializeBase(this, [ viewModel, new tab.LayerEncodingTemplate() ]);
    this.update();
}
tab.LayerEncodingViewMobile.prototype = {
    
    attachEventHandlers: function tab_LayerEncodingViewMobile$attachEventHandlers(button, et) {
    },
    
    removeEncodingButtonEvents: function tab_LayerEncodingViewMobile$removeEncodingButtonEvents() {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarksContentViewMobile

tab.MarksContentViewMobile = function tab_MarksContentViewMobile(viewModel) {
    tab.MarksContentViewMobile.initializeBase(this, [ viewModel, new tab.MarksContentTemplate() ]);
    spiff.OrientationHandler.add_orientationChanged(ss.Delegate.create(this, this._onOrientationChange$4));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        spiff.OrientationHandler.remove_orientationChanged(ss.Delegate.create(this, this._onOrientationChange$4));
    })));
    this.handleLayersChanged();
}
tab.MarksContentViewMobile.prototype = {
    
    get_chooseLayersThreshold: function tab_MarksContentViewMobile$get_chooseLayersThreshold() {
        if (spiff.OrientationHandler.get_isLandscape()) {
            return 3;
        }
        return tab.MarksContentViewMobile.callBaseMethod(this, 'get_chooseLayersThreshold');
    },
    
    _onOrientationChange$4: function tab_MarksContentViewMobile$_onOrientationChange$4() {
        this.handleLayersChanged();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillViewMobile

tab.PillViewMobile = function tab_PillViewMobile(viewModel) {
    tab.PillViewMobile.initializeBase(this, [ viewModel, new tab.PillViewMobileTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillViewMobileTemplate

tab.PillViewMobileTemplate = function tab_PillViewMobileTemplate() {
    tab.PillViewMobileTemplate.initializeBase(this, [ tab.PillViewTemplate.htmlTemplate ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataSchemaViewMobile

tab.DataSchemaViewMobile = function tab_DataSchemaViewMobile(viewModel) {
    tab.DataSchemaViewMobile.initializeBase(this, [ viewModel ]);
    if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
        this.dom.sourcesHeader.css('display', 'block');
        this.dom.sourcesHeader.text(tab.Strings.AuthSchemaViewerHeaderData);
    }
    this._dragScrollHandler$3 = new tab.DragDropAndScrollHandler(this.dom.contentArea);
    this._dragScrollHandler$3.add_draggingStarted(ss.Delegate.create(this, this._handleSelectionAfterDragStart$3));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this._dragScrollHandler$3.remove_draggingStarted(ss.Delegate.create(this, this._handleSelectionAfterDragStart$3));
    })));
    if (ss.isValue(this.get_dataSchemaViewModel().get_selectedDataSource())) {
        this.initFromModel();
    }
}
tab.DataSchemaViewMobile.prototype = {
    _dragScrollHandler$3: null,
    _pressedNode$3: null,
    
    get_scrollTop: function tab_DataSchemaViewMobile$get_scrollTop() {
        return this._dragScrollHandler$3.get_scroller().get_scrollPos().y;
    },
    set_scrollTop: function tab_DataSchemaViewMobile$set_scrollTop(value) {
        if (value === this.get_scrollTop() || value < 0 || value > this.dom.contentArea.height()) {
            return;
        }
        this._dragScrollHandler$3.get_scroller().scrollY(this.get_scrollTop() - value);
        return value;
    },
    
    dispose: function tab_DataSchemaViewMobile$dispose() {
        tab.DataSchemaViewMobile.callBaseMethod(this, 'dispose');
        if (ss.isValue(this._dragScrollHandler$3)) {
            this._dragScrollHandler$3.dispose();
            this._dragScrollHandler$3 = null;
        }
    },
    
    onAddedToDom: function tab_DataSchemaViewMobile$onAddedToDom() {
        tab.DataSchemaViewMobile.callBaseMethod(this, 'onAddedToDom');
        this._updateScrollers$3();
    },
    
    initFromModel: function tab_DataSchemaViewMobile$initFromModel() {
        tab.DataSchemaViewMobile.callBaseMethod(this, 'initFromModel');
        this.dom.get_domRoot().find('.tab-schemaViewerContent .tab-schema-field:not(:last)').addClass('tabListItemNotLast');
        this._updateScrollers$3();
    },
    
    fieldExpanded: function tab_DataSchemaViewMobile$fieldExpanded(field, expanded) {
        tab.DataSchemaViewMobile.callBaseMethod(this, 'fieldExpanded', [ field, expanded ]);
        this._updateScrollers$3();
    },
    
    _updateScrollers$3: function tab_DataSchemaViewMobile$_updateScrollers$3() {
        if (ss.isValue(this._dragScrollHandler$3)) {
            this._dragScrollHandler$3.updateScrollableContentSize();
        }
    },
    
    attachSelectionEventHandler: function tab_DataSchemaViewMobile$attachSelectionEventHandler(ft) {
        var showContext = tab.FeatureFlags.isEnabled('NonModalCalculationDialog') && ft.get_node().hasContextMenu;
        ft.getLabelClickHandler(this.perInitDisposables).onPress(ss.Delegate.create(this, function(e) {
            this._pressedNode$3 = ft.get_node();
        })).onClick(ss.Delegate.create(this, function(e) {
            if (showContext && this.get_dataSchemaViewModel().isSelected(ft.get_node())) {
                this.get_dataSchemaViewModel().showFieldContextMenu(ft.get_node(), ft.pill);
            }
            else {
                this.get_dataSchemaViewModel().clearAllAndSelect(ft.get_node());
            }
        }));
    },
    
    _handleSelectionAfterDragStart$3: function tab_DataSchemaViewMobile$_handleSelectionAfterDragStart$3() {
        this.get_dataSchemaViewModel().clearAllAndSelect(this._pressedNode$3);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShapePickerViewMobile

tab.ShapePickerViewMobile = function tab_ShapePickerViewMobile(viewModel) {
    tab.ShapePickerViewMobile.initializeBase(this, [ viewModel, new tab.ShapePickerTemplate() ]);
    this.updateContent();
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfViewMobile

tab.ShelfViewMobile = function tab_ShelfViewMobile(viewModel) {
    tab.ShelfViewMobile.initializeBase(this, [ viewModel, new tab.ShelfCardTemplate() ]);
    this._dragScrollHandler$4 = new tab.DragDropAndScrollHandler(this.dom.pillContent);
    this.disposables.add(this._dragScrollHandler$4);
    this.initFromModel(viewModel);
    this.add_scrollContentChanged(ss.Delegate.create(this, this._updateScroller$4));
}
tab.ShelfViewMobile.prototype = {
    _dragScrollHandler$4: null,
    
    get_scrollContainerSize: function tab_ShelfViewMobile$get_scrollContainerSize() {
        var area = this._dragScrollHandler$4.get_scroller().get_visibleArea();
        return (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? area.h : area.w;
    },
    
    get_scroll: function tab_ShelfViewMobile$get_scroll() {
        return (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? this._dragScrollHandler$4.get_scroller().get_scrollPos().y : this._dragScrollHandler$4.get_scroller().get_scrollPos().x;
    },
    set_scroll: function tab_ShelfViewMobile$set_scroll(value) {
        if (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) {
            this._dragScrollHandler$4.get_scroller().scrollY(-value);
        }
        else {
            this._dragScrollHandler$4.get_scroller().scrollX(-value);
        }
        return value;
    },
    
    setScrollableContentActualHeight: function tab_ShelfViewMobile$setScrollableContentActualHeight(height) {
        tab.ShelfViewMobile.callBaseMethod(this, 'setScrollableContentActualHeight', [ height ]);
        this._updateScroller$4();
    },
    
    initFromModel: function tab_ShelfViewMobile$initFromModel(vm) {
        tab.ShelfViewMobile.callBaseMethod(this, 'initFromModel', [ vm ]);
        this._updateScroller$4();
    },
    
    _updateScroller$4: function tab_ShelfViewMobile$_updateScroller$4() {
        this._dragScrollHandler$4.set_orientation((this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? 1 : 2);
        this._dragScrollHandler$4.updateScrollableContentSize();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShowMeViewMobile

tab.ShowMeViewMobile = function tab_ShowMeViewMobile(viewModel) {
    tab.ShowMeViewMobile.initializeBase(this, [ viewModel ]);
    this._optionDom$3 = $('<div/>').addClass('tabAuthShowMeChoose').append($('<div/>').addClass('tabAuthShowMeChooseText'));
    var spec = spiff.$create_EventHandleSpec();
    spec.tap = ss.Delegate.create(this, function() {
        this._applyCurrentCommand$3();
    });
    this._optionHander$3 = new spiff.TableauEventHandler(this._optionDom$3[0], spec);
    this._closeDom$3 = $('<div/>').addClass('tabAuthShowMeClose').text('X');
    this.disposables.add(spiff.TableauClickHandler.targetAndClick(this._closeDom$3[0], ss.Delegate.create(this, this._close$3)));
    this.get_element().addClass('tabAuthShowMeButtonMode');
    this.initContent();
}
tab.ShowMeViewMobile.prototype = {
    _optionDom$3: null,
    _closeDom$3: null,
    _currentCommand$3: null,
    _optionHander$3: null,
    
    dispose: function tab_ShowMeViewMobile$dispose() {
        this._optionHander$3.dispose();
        tab.ShowMeViewMobile.callBaseMethod(this, 'dispose');
    },
    
    attachEventHandlers: function tab_ShowMeViewMobile$attachEventHandlers(c, showMeDom) {
        this.perUpdateDisposables.add(spiff.TableauClickHandler.targetAndClick(showMeDom[0], ss.Delegate.create(this, function() {
            this._showOption$3(c, showMeDom);
        })));
    },
    
    updateCommands: function tab_ShowMeViewMobile$updateCommands() {
        if (ss.isValue(this._currentCommand$3)) {
            this._currentCommand$3 = this._findUpdatedCommand$3(this._currentCommand$3, this.smViewModel.get_showMeCommands());
            this._updateCurrentCommandDom$3();
        }
        else {
            tab.ShowMeViewMobile.callBaseMethod(this, 'updateCommands');
        }
    },
    
    _updateCurrentCommandDom$3: function tab_ShowMeViewMobile$_updateCurrentCommandDom$3() {
        this.setCommandIcon(this._currentCommand$3, this.get_element().find('.tabAuthShowMeChooseIcon'));
        var enabled = this.smViewModel.isCommandEnabled(this._currentCommand$3);
        this._optionDom$3.find('.tabAuthShowMeChooseText').text((enabled) ? tab.Strings.AuthShowMeApply : tab.Strings.AuthShowMeCantApply);
        this._optionDom$3.toggleClass('enabled', enabled);
    },
    
    _findUpdatedCommand$3: function tab_ShowMeViewMobile$_findUpdatedCommand$3(oldCommand, commands) {
        var oldItemWrapper = tab.CommandItemWrapper.create(oldCommand);
        var commandsWrapper = tab.CommandsPresModelWrapper.create(commands);
        var $enum1 = ss.IEnumerator.getEnumerator(commandsWrapper.get_commandItems());
        while ($enum1.moveNext()) {
            var item = $enum1.current;
            var itemWrapper = tab.CommandItemWrapper.create(item);
            if (itemWrapper.get_commandsType() !== 'subcommands') {
                continue;
            }
            var subCommandsWrapper = tab.CommandsPresModelWrapper.create(itemWrapper.get_commands());
            var $enum2 = ss.IEnumerator.getEnumerator(subCommandsWrapper.get_commandItems());
            while ($enum2.moveNext()) {
                var c = $enum2.current;
                var subItemWrapper = tab.CommandItemWrapper.create(c);
                if (subItemWrapper.get_name() === oldItemWrapper.get_name()) {
                    return c;
                }
            }
        }
        return null;
    },
    
    _applyCurrentCommand$3: function tab_ShowMeViewMobile$_applyCurrentCommand$3() {
        if (!this.smViewModel.isCommandEnabled(this._currentCommand$3)) {
            return;
        }
        var c = this._currentCommand$3;
        this._close$3();
        this.smViewModel.applyShowMeCommand(c);
    },
    
    _close$3: function tab_ShowMeViewMobile$_close$3() {
        this._currentCommand$3 = null;
        this.smViewModel.close();
    },
    
    _showOption$3: function tab_ShowMeViewMobile$_showOption$3(c, showMeDom) {
        this.updateDescription(c);
        if (this.smViewModel.isCommandEnabled(c)) {
            this.setActiveItem(c, showMeDom);
            this.smViewModel.applyShowMeCommand(c);
        }
        else {
            this.smViewModel.set_closeOnInteraction(false);
            this._currentCommand$3 = c;
            this._optionDom$3.find('.tabAuthShowMeChooseIcon').remove();
            $('<div/>').addClass('tabAuthShowMeChooseIcon').insertBefore(this._optionDom$3.find('.tabAuthShowMeChooseText'));
            this._updateCurrentCommandDom$3();
            this.summaryDom.before(this._optionDom$3);
            this.get_element().append(this._closeDom$3);
            var height = this._optionDom$3.outerHeight(true) + this.summaryDom.outerHeight(true);
            var width = Math.max(this._optionDom$3.outerWidth(true), this.summaryDom.outerWidth(true));
            this.get_element().css({ height: height + 'px', width: width + 'px' });
            this.get_element().toggleClass('tabAuthShowMeChooseMode');
            this.get_element().toggleClass('tabAuthShowMeButtonMode');
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.VizSummaryViewMobile

tab.VizSummaryViewMobile = function tab_VizSummaryViewMobile(viewModel) {
    tab.VizSummaryViewMobile.initializeBase(this, [ viewModel, new tab.VizSummaryTemplate() ]);
    this.update();
}


////////////////////////////////////////////////////////////////////////////////
// tab.CalculationDialogViewMobile

tab.CalculationDialogViewMobile = function tab_CalculationDialogViewMobile(viewModel) {
    tab.CalculationDialogViewMobile.initializeBase(this, [ viewModel ]);
    this.initDom();
    this.get_pillDragFeedback().set_pillDragCursorPadding(this.get_editor().defaultTextHeight());
    spiff.OrientationHandler.add_orientationChanged(ss.Delegate.create(this, this.ensureDialogIsOnScreen));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        spiff.OrientationHandler.remove_orientationChanged(ss.Delegate.create(this, this.ensureDialogIsOnScreen));
    })));
}
tab.CalculationDialogViewMobile.prototype = {
    _focusEditorAfterDrag$4: false,
    
    initDom: function tab_CalculationDialogViewMobile$initDom() {
        tab.CalculationDialogViewMobile.callBaseMethod(this, 'initDom');
        spiff.DragDropManager.add_dragStarted(ss.Delegate.create(this, this._onDragStarted$4));
        spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this._onDragEnded$4));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            spiff.DragDropManager.remove_dragStarted(ss.Delegate.create(this, this._onDragStarted$4));
            spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this._onDragEnded$4));
        })));
    },
    
    createDialog: function tab_CalculationDialogViewMobile$createDialog() {
        tab.CalculationDialogViewMobile.callBaseMethod(this, 'createDialog');
        this.get_dialog().set_vertOffset(200);
        this.get_dialog().set_setFocusOnShow(false);
    },
    
    applyCalc: function tab_CalculationDialogViewMobile$applyCalc() {
        this.get_editableCaption().commit();
        tab.CalculationDialogViewMobile.callBaseMethod(this, 'applyCalc');
    },
    
    applyCalcAndClose: function tab_CalculationDialogViewMobile$applyCalcAndClose() {
        this.get_editableCaption().commit();
        tab.CalculationDialogViewMobile.callBaseMethod(this, 'applyCalcAndClose');
    },
    
    _onDragStarted$4: function tab_CalculationDialogViewMobile$_onDragStarted$4(d) {
        var e = spiff.DragDropManager.get_lastDragEvent();
        var target = $((ss.isValue(e)) ? e.target : null);
        this._focusEditorAfterDrag$4 = false;
        if (target.parents('.tabCalcEditDialog').length > 0) {
            if (this.get_editableCaption().get_isEditing()) {
                this.get_editableCaption().commit();
                this._focusEditorAfterDrag$4 = true;
                document.activeElement.blur();
            }
            else if (this.get_editor().hasFocus()) {
                this._focusEditorAfterDrag$4 = true;
                document.activeElement.blur();
            }
        }
    },
    
    _onDragEnded$4: function tab_CalculationDialogViewMobile$_onDragEnded$4(r) {
        if (this._focusEditorAfterDrag$4) {
            this._focusEditorAfterDrag$4 = false;
            this.get_editor().focus();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalColorOptionViewMobile

tab.CategoricalColorOptionViewMobile = function tab_CategoricalColorOptionViewMobile(viewModel) {
    tab.CategoricalColorOptionViewMobile.initializeBase(this, [ viewModel ]);
    this.createTransparencyControl();
}
tab.CategoricalColorOptionViewMobile.prototype = {
    
    createTransparencyControl: function tab_CategoricalColorOptionViewMobile$createTransparencyControl() {
        this.set_colorTransparencyControlView(spiff.ObjectRegistry.newView(tab.ColorTransparencyControlView, this.colorOptionViewModel.get_colorTransparencyControlViewModel()));
        this.get_colorTransparencyControlView().createTransparencySettings(this.colorOptionViewModel.get_colorTransparencyControlViewModel());
    },
    
    commitChangesInView: function tab_CategoricalColorOptionViewMobile$commitChangesInView() {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorTransparencyControlViewMobile

tab.ColorTransparencyControlViewMobile = function tab_ColorTransparencyControlViewMobile(viewModel) {
    tab.ColorTransparencyControlViewMobile.initializeBase(this, [ viewModel ]);
}
tab.ColorTransparencyControlViewMobile.prototype = {
    
    onAddedToDom: function tab_ColorTransparencyControlViewMobile$onAddedToDom() {
        tab.ColorTransparencyControlViewMobile.callBaseMethod(this, 'onAddedToDom');
        var sliderView = spiff.ObjectRegistry.newView(tab.ContinuousSlider, this.sliderViewModel);
        this.get_element().append(sliderView.get_element());
        sliderView.onAddedToDom();
    },
    
    createSlider: function tab_ColorTransparencyControlViewMobile$createSlider(rangeModel) {
        tab.ColorTransparencyControlViewMobile.callBaseMethod(this, 'createSlider', [ rangeModel ]);
        this.sliderViewModel.set_pixelWidth(127);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LinePatternPickerViewMobile

tab.LinePatternPickerViewMobile = function tab_LinePatternPickerViewMobile(viewModel) {
    tab.LinePatternPickerViewMobile.initializeBase(this, [ viewModel ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.StrokeWidthPickerViewMobile

tab.StrokeWidthPickerViewMobile = function tab_StrokeWidthPickerViewMobile(viewModel) {
    tab.StrokeWidthPickerViewMobile.initializeBase(this, [ viewModel ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorOptionViewMobile

tab.QuantitativeColorOptionViewMobile = function tab_QuantitativeColorOptionViewMobile(viewModel) {
    tab.QuantitativeColorOptionViewMobile.initializeBase(this, [ viewModel, new tab.QuantitativeColorOptionTemplateMobile() ]);
    this.createColorControls();
    this.createTransparencyControl();
}
tab.QuantitativeColorOptionViewMobile.prototype = {
    
    createColorReversalControl: function tab_QuantitativeColorOptionViewMobile$createColorReversalControl() {
        var colorReverseCheckboxLabel = tableau.util.createMobileCheckBox(ss.Delegate.create(this, function() {
            this.quantitativeColorOptionViewModel.toggleColorReversal();
        }), tab.Strings.AuthReverseColorLabel, tab.QuantitativeColorOptionView.colorReverseCheckClassName, 4, this.quantitativeColorOptionViewModel.get_isReversed(), this.disposables);
        this.dom.colorReversalControl.addClass('tabAuthReverseArea').append(colorReverseCheckboxLabel);
    },
    
    createSteppedCheckbox: function tab_QuantitativeColorOptionViewMobile$createSteppedCheckbox() {
        return tableau.util.createMobileCheckBox(ss.Delegate.create(this, function() {
            this.quantitativeColorOptionViewModel.toggleIsStepped();
        }), tab.Strings.AuthSteppedColorLabel, tab.QuantitativeColorOptionView.steppedCheckClassName, 5, this.quantitativeColorOptionViewModel.get_isStepped(), this.disposables);
    },
    
    handleIsSteppedChanged: function tab_QuantitativeColorOptionViewMobile$handleIsSteppedChanged(isStepped) {
        this.dom.getElementBySelector('.' + tab.QuantitativeColorOptionView.steppedCheckClassName + ' .' + 'tabAuthCheckbox').toggleClass('checked', isStepped);
        this.quantitativeColorOptionViewModel.get_stepperControlViewModel().set_isEnabled(isStepped);
    },
    
    handleIsReversedChanged: function tab_QuantitativeColorOptionViewMobile$handleIsReversedChanged(isReversed) {
        this.dom.getElementBySelector('.' + tab.QuantitativeColorOptionView.colorReverseCheckClassName + ' .' + 'tabAuthCheckbox').toggleClass('checked', isReversed);
    },
    
    createTransparencyControl: function tab_QuantitativeColorOptionViewMobile$createTransparencyControl() {
        this.set_colorTransparencyControlView(spiff.ObjectRegistry.newView(tab.ColorTransparencyControlView, this.colorOptionViewModel.get_colorTransparencyControlViewModel()));
        this.get_colorTransparencyControlView().createTransparencySettings(this.colorOptionViewModel.get_colorTransparencyControlViewModel());
    },
    
    commitChangesInView: function tab_QuantitativeColorOptionViewMobile$commitChangesInView() {
        this.get_stepperControlView().commitStepValueText();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorOptionTemplateMobile

tab.QuantitativeColorOptionTemplateMobile = function tab_QuantitativeColorOptionTemplateMobile() {
    tab.QuantitativeColorOptionTemplateMobile.initializeBase(this, [ $("<div class='tabAuthQuantitativeColorOptionContent'>\n    <div class='tabColorPalettePickerContainer'/>\n    <div class='tabAuthColorReverseControl'/>\n    <div class='tabColorSteps'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthTransparencyControlContainer'/>\n</div>") ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarkSizePickerViewMobile

tab.MarkSizePickerViewMobile = function tab_MarkSizePickerViewMobile(viewModel) {
    tab.MarkSizePickerViewMobile.initializeBase(this, [ viewModel ]);
    this.sliderViewModel.set_pixelWidth(280);
}
tab.MarkSizePickerViewMobile.prototype = {
    
    onAddedToDom: function tab_MarkSizePickerViewMobile$onAddedToDom() {
        tab.MarkSizePickerViewMobile.callBaseMethod(this, 'onAddedToDom');
        var sliderView = spiff.ObjectRegistry.newView(tab.ContinuousSlider, this.sliderViewModel);
        this.get_element().append(sliderView.get_element());
        sliderView.onAddedToDom();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TextEncodingOptionViewMobile

tab.TextEncodingOptionViewMobile = function tab_TextEncodingOptionViewMobile(vm) {
    tab.TextEncodingOptionViewMobile.initializeBase(this, [ vm ]);
    var marksLabelCheckboxLabel = tableau.util.createMobileCheckBox(ss.Delegate.create(this, this._handleValueChange$3), this.textOptionViewModel.get_controlLabel(), tab.TextEncodingOptionView.marksLabelCheckClass, 1, this.textOptionViewModel.get_labelsOn(), this.disposables);
    this.dom.get_domRoot().append(marksLabelCheckboxLabel);
}
tab.TextEncodingOptionViewMobile.prototype = {
    
    _handleValueChange$3: function tab_TextEncodingOptionViewMobile$_handleValueChange$3(newVal) {
        this.textOptionViewModel.toggleLabels();
    },
    
    handleLabelsOnChanged: function tab_TextEncodingOptionViewMobile$handleLabelsOnChanged(labelsOn) {
        this.dom.getElementBySelector('.tabAuthCheckbox').toggleClass('checked', labelsOn);
    }
}


tab.ColorPalettePickerViewMobile.registerClass('tab.ColorPalettePickerViewMobile', tab.ColorPalettePickerView);
tab.MobileAppHelper.registerClass('tab.MobileAppHelper');
tab.AuthoringMastheadViewMobile.registerClass('tab.AuthoringMastheadViewMobile', tab.AuthoringMastheadView);
tab.AuthoringTabNavViewMobile.registerClass('tab.AuthoringTabNavViewMobile', tab.AuthoringTabNavView);
tab.AuthoringViewMobile.registerClass('tab.AuthoringViewMobile', tab.AuthoringView);
tab.CardViewMobile.registerClass('tab.CardViewMobile', tab.CardView);
tab.LeftPanelViewMobile.registerClass('tab.LeftPanelViewMobile', tab.LeftPanelView);
tab.ColorPickerViewMobile.registerClass('tab.ColorPickerViewMobile', tab.ColorPickerView);
tab.LayerEncodingViewMobile.registerClass('tab.LayerEncodingViewMobile', tab.LayerEncodingView);
tab.MarksContentViewMobile.registerClass('tab.MarksContentViewMobile', tab.MarksContentView);
tab.PillViewMobile.registerClass('tab.PillViewMobile', tab.PillView);
tab.PillViewMobileTemplate.registerClass('tab.PillViewMobileTemplate', tab.PillViewTemplate);
tab.DataSchemaViewMobile.registerClass('tab.DataSchemaViewMobile', tab.DataSchemaView);
tab.ShapePickerViewMobile.registerClass('tab.ShapePickerViewMobile', tab.ShapePickerView);
tab.ShelfViewMobile.registerClass('tab.ShelfViewMobile', tab.ShelfView);
tab.ShowMeViewMobile.registerClass('tab.ShowMeViewMobile', tab.ShowMeView);
tab.VizSummaryViewMobile.registerClass('tab.VizSummaryViewMobile', tab.VizSummaryView);
tab.CalculationDialogViewMobile.registerClass('tab.CalculationDialogViewMobile', tab.CalculationDialogView);
tab.CategoricalColorOptionViewMobile.registerClass('tab.CategoricalColorOptionViewMobile', tab.CategoricalColorOptionView);
tab.ColorTransparencyControlViewMobile.registerClass('tab.ColorTransparencyControlViewMobile', tab.ColorTransparencyControlView);
tab.LinePatternPickerViewMobile.registerClass('tab.LinePatternPickerViewMobile', tab.LinePatternPickerView);
tab.StrokeWidthPickerViewMobile.registerClass('tab.StrokeWidthPickerViewMobile', tab.StrokeWidthPickerView);
tab.QuantitativeColorOptionViewMobile.registerClass('tab.QuantitativeColorOptionViewMobile', tab.QuantitativeColorOptionView);
tab.QuantitativeColorOptionTemplateMobile.registerClass('tab.QuantitativeColorOptionTemplateMobile', tab.QuantitativeColorOptionTemplate);
tab.MarkSizePickerViewMobile.registerClass('tab.MarkSizePickerViewMobile', tab.MarkSizePickerView);
tab.TextEncodingOptionViewMobile.registerClass('tab.TextEncodingOptionViewMobile', tab.TextEncodingOptionView);
(function () {
    spiff.ObjectRegistry.registerType(tab.ColorPalettePickerView, tab.ColorPalettePickerViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.AuthoringMastheadView, tab.AuthoringMastheadViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.AuthoringTabNavView, tab.AuthoringTabNavViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.AuthoringView, tab.AuthoringViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.CardView, tab.CardViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.LeftPanelView, tab.LeftPanelViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ColorPickerView, tab.ColorPickerViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.LayerEncodingView, tab.LayerEncodingViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.MarksContentView, tab.MarksContentViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.PillView, tab.PillViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.DataSchemaView, tab.DataSchemaViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ShapePickerView, tab.ShapePickerViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ShelfView, tab.ShelfViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ShowMeView, tab.ShowMeViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.VizSummaryView, tab.VizSummaryViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.CalculationDialogView, tab.CalculationDialogViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.CategoricalColorOptionView, tab.CategoricalColorOptionViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ColorTransparencyControlView, tab.ColorTransparencyControlViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.LinePatternPickerView, tab.LinePatternPickerViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.StrokeWidthPickerView, tab.StrokeWidthPickerViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.QuantitativeColorOptionView, tab.QuantitativeColorOptionViewMobile);
})();
tab.QuantitativeColorOptionTemplateMobile.htmlTemplate = "<div class='tabAuthQuantitativeColorOptionContent'>\n    <div class='tabColorPalettePickerContainer'/>\n    <div class='tabAuthColorReverseControl'/>\n    <div class='tabColorSteps'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthTransparencyControlContainer'/>\n</div>";
(function () {
    spiff.ObjectRegistry.registerType(tab.MarkSizePickerView, tab.MarkSizePickerViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.TextEncodingOptionView, tab.TextEncodingOptionViewMobile);
})();
});

//! This script was generated using Script# v0.7.4.0
