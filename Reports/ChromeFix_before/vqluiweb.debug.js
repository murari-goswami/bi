//! vqluiweb.debug.js
//

dojo.addOnLoad(function() {

Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalLegendViewWeb

tab.CategoricalLegendViewWeb = function tab_CategoricalLegendViewWeb(viewModel) {
    tab.CategoricalLegendViewWeb.initializeBase(this, [ viewModel, new tab.CategoricalLegendTemplateWeb() ]);
    this._inputSpec$4 = this._makeInputHandlers$4();
    this.get__catLegendTemplateWeb$4().get_domRoot().css('cursor', 'default');
    this._iterButtons$4 = new tab.IteratorButtons(this.get_catLegendTemplate().columnsHolder, true, tab.LegendBaseViewModel.horizontalIteratorButtonSize);
    this.get__catLegendTemplateWeb$4().scroller.append(this._iterButtons$4.get_domRoot());
}
tab.CategoricalLegendViewWeb.prototype = {
    _inputSpec$4: null,
    _iterButtons$4: null,
    _hoverBehavior$4: null,
    
    get__containerWidth$4: function tab_CategoricalLegendViewWeb$get__containerWidth$4() {
        return this.get__catLegendTemplateWeb$4().columnsHolder.width();
    },
    
    get__scrollWidth$4: function tab_CategoricalLegendViewWeb$get__scrollWidth$4() {
        return (this.get_catLegendViewModel().get_categoricalLegendPM().catLegendLayout.colCount * this.get_catLegendViewModel().get_categoricalLegendPM().catLegendLayout.colWidth);
    },
    
    get__catLegendTemplateWeb$4: function tab_CategoricalLegendViewWeb$get__catLegendTemplateWeb$4() {
        return this.get_template();
    },
    
    dispose: function tab_CategoricalLegendViewWeb$dispose() {
        this._inputSpec$4.dispose();
        this._hoverBehavior$4.dispose();
        this._iterButtons$4.dispose();
        tab.CategoricalLegendViewWeb.callBaseMethod(this, 'dispose');
    },
    
    drawLegend: function tab_CategoricalLegendViewWeb$drawLegend() {
        tab.CategoricalLegendViewWeb.callBaseMethod(this, 'drawLegend');
        var catLegendPM = this.get_catLegendViewModel().get_categoricalLegendPM();
        var catlayoutPM = catLegendPM.catLegendLayout;
        var titleHeight = this.get__catLegendTemplateWeb$4().titleArea.height();
        var highlightTop = tab.BaseLegendView.controlsMargin;
        var highlightRight = tab.BaseLegendView.controlsMargin;
        var highlighterInContent = !this.highlighterFitsUpperRight();
        if (highlighterInContent && !this.get_catLegendViewModel().get_titleInline()) {
            highlightTop += titleHeight;
        }
        var allowScrollX = false;
        var allowScrollY = false;
        if (this._shouldShowCustomScrollArrows$4()) {
            this.get_catLegendTemplate().columnsHolder.css('overflow-x', 'hidden');
            this.get_catLegendTemplate().columnsHolder.css('overflow-y', 'hidden');
            var colWidth = this.get_catLegendViewModel().get_categoricalLegendPM().catLegendLayout.colWidth;
            this._iterButtons$4.set_scrollIncrement(colWidth);
            this._iterButtons$4.reset();
            this.viewportWidth -= tab.LegendBaseViewModel.horizontalIteratorButtonHolderWidth;
            if (highlighterInContent) {
                highlightRight += tab.LegendBaseViewModel.horizontalIteratorButtonHolderWidth + tab.BaseLegendView.controlsMargin;
            }
            if (this.get_catLegendViewModel().get_titleInline()) {
                this.get__catLegendTemplateWeb$4().scroller.css('top', '0px');
            }
            else {
                this.get__catLegendTemplateWeb$4().scroller.css('top', titleHeight + 'px');
            }
        }
        else {
            if (catlayoutPM.legendLayout === 'horizontal' || catlayoutPM.legendLayout === 'grid') {
                allowScrollX = true;
            }
            else {
                allowScrollY = true;
            }
        }
        if (highlighterInContent && allowScrollY) {
            var contentHeight = catlayoutPM.rowCount * catlayoutPM.rowHeight;
            if (this.viewportHeight < contentHeight) {
                var scrollWidth = tab.Metrics.get_scrollW();
                highlightRight += scrollWidth;
            }
        }
        this.get_catLegendTemplate().columnsHolder.css('overflow-x', (allowScrollX) ? 'auto' : 'hidden');
        this.get_catLegendTemplate().columnsHolder.css('overflow-y', (allowScrollY) ? 'auto' : 'hidden');
        this.get__catLegendTemplateWeb$4().legendHighlighter.css('top', highlightTop + 'px');
        this.get__catLegendTemplateWeb$4().legendHighlighter.css('right', highlightRight + 'px');
        this.setContentSize(this.viewportHeight, this.viewportWidth);
        this._updateScroller$4();
    },
    
    _makeInputHandlers$4: function tab_CategoricalLegendViewWeb$_makeInputHandlers$4() {
        this._hoverBehavior$4 = new spiff.HoverBehavior(this, null, ss.Delegate.create(this, this._onMouseEnter$4), ss.Delegate.create(this, this._onMouseLeave$4));
        var spec = spiff.$create_EventHandleSpec();
        spec.tap = ss.Delegate.create(this, this._onTap$4);
        spec.hover = ss.Delegate.create(this, this._onHover$4);
        spec.hoverDelay = spiff.Hover.hoverTime;
        var mh = new spiff.TableauEventHandler(this.get__catLegendTemplateWeb$4().get_domRoot().get(0), spec);
        return mh;
    },
    
    _onMouseEnter$4: function tab_CategoricalLegendViewWeb$_onMouseEnter$4(e) {
        this.setHighlightButtonVisibility(true);
    },
    
    _onMouseLeave$4: function tab_CategoricalLegendViewWeb$_onMouseLeave$4(e) {
        this.setHighlightButtonVisibility(false);
    },
    
    _onHover$4: function tab_CategoricalLegendViewWeb$_onHover$4(pseudoEvent) {
        if (spiff.DragDropManager.get_isDragging()) {
            return;
        }
        var hoveredItem = this.getLegendItemFromEvent(pseudoEvent);
        if (ss.isValue(hoveredItem)) {
            var viewportPos = this.getViewportPosition(pseudoEvent);
            var docPoint = this.getDocumentPosition(viewportPos);
            var selRect = tab.$create_RectXY(docPoint.x, docPoint.y, 0, 0);
            this.performHoverOnItem(viewportPos, selRect);
            tab.Log.get(this).debug('Show ubertip for: %o', hoveredItem);
        }
        pseudoEvent.preventDefault();
    },
    
    _onTap$4: function tab_CategoricalLegendViewWeb$_onTap$4(pseudoEvent) {
        if (pseudoEvent.target === this.get__catLegendTemplateWeb$4().legendHighlighter.get(0)) {
            this.onLegendHighlighterTapped();
        }
        else {
            var item = this.getLegendItemFromEvent(pseudoEvent);
            var selectionType = tab.ResolveSelectAction.fromNormalizedEvent(pseudoEvent);
            if (ss.isValue(item)) {
                var viewportPos = this.getViewportPosition(pseudoEvent);
                var docPoint = this.getDocumentPosition(viewportPos);
                var selRect = tab.$create_RectXY(docPoint.x, docPoint.y, 0, 0);
                this.performSelectOnItem(item, selectionType, viewportPos, selRect);
            }
            else {
                this.get_catLegendViewModel().selectNone(selectionType);
            }
        }
        pseudoEvent.preventDefault();
    },
    
    _shouldShowCustomScrollArrows$4: function tab_CategoricalLegendViewWeb$_shouldShowCustomScrollArrows$4() {
        var catLayoutPM = this.get_catLegendViewModel().get_categoricalLegendPM().catLegendLayout;
        if (catLayoutPM.legendLayout === 'vertical') {
            return false;
        }
        var requiredHeight = (catLayoutPM.rowHeight + tab.Metrics.get_scrollH());
        return (this.get__containerWidth$4() < this.get__scrollWidth$4() && requiredHeight >= this.get__catLegendTemplateWeb$4().columnsHolder.height());
    },
    
    _updateScroller$4: function tab_CategoricalLegendViewWeb$_updateScroller$4() {
        if (this._shouldShowCustomScrollArrows$4()) {
            this.get__catLegendTemplateWeb$4().scroller.show();
        }
        else {
            this.get__catLegendTemplateWeb$4().scroller.hide();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalLegendTemplateWeb

tab.CategoricalLegendTemplateWeb = function tab_CategoricalLegendTemplateWeb() {
    tab.CategoricalLegendTemplateWeb.initializeBase(this, [ $("\n            <div class='tabLegendPanel'>\n                <div class='tabLegendBox'>\n                    <div class='tabLegendTitle'></div>\n                    <div class='tabLegendContentHolder' style='overflow:auto'>\n                        <div class='tabLegendColumnHolder' style='white-space:nowrap'></div>\n                    </div>\n                    <div class='tabCatLegendScroll'></div>\n                </div>\n            </div>") ]);
    this.scroller = this.getElementBySelector('.tabCatLegendScroll');
    this.legendContentArea = this.columnsHolder;
}
tab.CategoricalLegendTemplateWeb.prototype = {
    scroller: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.MapsSearchViewWeb

tab.MapsSearchViewWeb = function tab_MapsSearchViewWeb(vm) {
    tab.MapsSearchViewWeb.initializeBase(this, [ vm, tab.MapsSearchView.newMapsSearchViewTemplate() ]);
    this.get_compositeSearchWidget().get_textInputView().get_inputElement().focusin(ss.Delegate.create(this, this._handleSearchBoxFocusIn$3));
    this.get_compositeSearchWidget().get_textInputView().get_inputElement().focusout(ss.Delegate.create(this, this._handleSearchBoxFocusOut$3));
    this.get_compositeSearchWidget().get_textInputView().get_inputElement().mouseup(ss.Delegate.create(this, this._handleSearchBoxMouseUp$3));
    var compositeSearchWidgetWeb = this.get_compositeSearchWidget();
    compositeSearchWidgetWeb.add_highlightedListItemChanged(ss.Delegate.create(this, this._highlightedItemChanged$3));
    compositeSearchWidgetWeb.add_tabKeyPressed(ss.Delegate.create(this, this._handleTabKeyPress$3));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        compositeSearchWidgetWeb.remove_highlightedListItemChanged(ss.Delegate.create(this, this._highlightedItemChanged$3));
        compositeSearchWidgetWeb.remove_tabKeyPressed(ss.Delegate.create(this, this._handleTabKeyPress$3));
    })));
}
tab.MapsSearchViewWeb.prototype = {
    _selectTextOnMouseUp$3: false,
    _highlightedListItem$3: null,
    
    updateSearchTextValue: function tab_MapsSearchViewWeb$updateSearchTextValue(candidate) {
        this._updateSearchTextValueWeb$3(candidate, true);
    },
    
    _updateSearchTextValueWeb$3: function tab_MapsSearchViewWeb$_updateSearchTextValueWeb$3(candidate, selectAllSearchText) {
        tab.MapsSearchViewWeb.callBaseMethod(this, 'updateSearchTextValue', [ candidate ]);
        if (!!selectAllSearchText) {
            this.selectAllSearchText();
        }
    },
    
    _handleSearchBoxFocusIn$3: function tab_MapsSearchViewWeb$_handleSearchBoxFocusIn$3(e) {
        this._selectTextOnMouseUp$3 = true;
    },
    
    _handleSearchBoxFocusOut$3: function tab_MapsSearchViewWeb$_handleSearchBoxFocusOut$3(e) {
        this._selectTextOnMouseUp$3 = false;
    },
    
    _handleSearchBoxMouseUp$3: function tab_MapsSearchViewWeb$_handleSearchBoxMouseUp$3(e) {
        if (!this._selectTextOnMouseUp$3) {
            return;
        }
        this._selectTextOnMouseUp$3 = false;
        if (this.showingInitialText) {
            return;
        }
        var selectionStart = this.get_compositeSearchWidget().get_textInputView().get_inputElement().prop('selectionStart');
        var selectionEnd = this.get_compositeSearchWidget().get_textInputView().get_inputElement().prop('selectionEnd');
        if (ss.isValue(selectionStart) && ss.isValue(selectionEnd) && selectionStart !== selectionEnd) {
            return;
        }
        this.selectAllSearchText();
    },
    
    _highlightedItemChanged$3: function tab_MapsSearchViewWeb$_highlightedItemChanged$3(newHighlightedListItem) {
        this._highlightedListItem$3 = newHighlightedListItem;
        var $enum1 = ss.IEnumerator.getEnumerator(this.get_compositeSearchWidget().get_listView().get_itemViews());
        while ($enum1.moveNext()) {
            var listItemView = $enum1.current;
            listItemView.get_element().removeClass(tab.MapsSearchViewWeb.suggestionHighlighted);
        }
        if (ss.isValue(newHighlightedListItem)) {
            newHighlightedListItem.get_element().addClass(tab.MapsSearchViewWeb.suggestionHighlighted);
            var highlightedCandidate = newHighlightedListItem.get_viewModel().get_data();
            this._updateSearchTextValueWeb$3(highlightedCandidate, false);
        }
    },
    
    handleEnterKeyPress: function tab_MapsSearchViewWeb$handleEnterKeyPress() {
        if (ss.isValue(this._highlightedListItem$3)) {
            this.mapsSearchViewModel.moveMapToCandidateBounds(this._highlightedListItem$3.get_viewModel().get_data());
            this.get_compositeSearchWidget().removeList();
            return;
        }
        tab.MapsSearchViewWeb.callBaseMethod(this, 'handleEnterKeyPress');
    },
    
    _handleTabKeyPress$3: function tab_MapsSearchViewWeb$_handleTabKeyPress$3() {
        if (ss.isNullOrUndefined(this.get_compositeSearchWidget().get_listViewModel()) || ss.isValue(this.queryDelayTimer) || ss.isValue(this._highlightedListItem$3)) {
            return;
        }
        var compositeSearchWidgetWeb = this.get_compositeSearchWidget();
        compositeSearchWidgetWeb.highlightNextListItem(false);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ApplicationViewModelWeb

tab.ApplicationViewModelWeb = function tab_ApplicationViewModelWeb(skipInit, layoutSession) {
    tab.ApplicationViewModelWeb.initializeBase(this, [ skipInit, layoutSession ]);
    $(window).bind(this.createNamespacedEventName('resize'), ss.Delegate.create(this, function() {
        this.resize(false);
    }));
}
tab.ApplicationViewModelWeb.prototype = {
    
    destroy: function tab_ApplicationViewModelWeb$destroy() {
        $(window).unbind(this.createNamespacedEventName('resize'));
        tab.ApplicationViewModelWeb.callBaseMethod(this, 'destroy');
    },
    
    makeExportPdfDialog: function tab_ApplicationViewModelWeb$makeExportPdfDialog(session) {
        return new tab.ExportPdfDialog(session, false);
    },
    
    makeViewingToolbar: function tab_ApplicationViewModelWeb$makeViewingToolbar(isTop) {
        return new tab.ViewingToolbarWeb(this, isTop);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyLegendViewWeb

tab.LegacyLegendViewWeb = function tab_LegacyLegendViewWeb(viewModel) {
    this._disposables$4 = new tab.DisposableHolder();
    tab.LegacyLegendViewWeb.initializeBase(this, [ viewModel, new tab.LegacyLegendTemplateWeb() ]);
}
tab.LegacyLegendViewWeb.prototype = {
    
    onAddedToDom: function tab_LegacyLegendViewWeb$onAddedToDom() {
        tab.LegacyLegendViewWeb.callBaseMethod(this, 'onAddedToDom');
        var horizScroll = (this.get_legendTemplate()).domHorizScrollButtonHolder;
        horizScroll.append(this.iterButtons.get_domRoot());
        horizScroll.css('visibility', 'hidden');
        this.get_legendTemplate().domHighlighter.attr('title', tab.Strings.LegendPanelHighlightSelectedItems);
    },
    
    dispose: function tab_LegacyLegendViewWeb$dispose() {
        this._disposables$4.dispose();
        tab.LegacyLegendViewWeb.callBaseMethod(this, 'dispose');
    },
    
    makeViewerInputHandler: function tab_LegacyLegendViewWeb$makeViewerInputHandler(viewSession, element) {
        var spec = spiff.$create_EventHandleSpec();
        spec.tap = ss.Delegate.create(this, this.onTap);
        spec.hover = ss.Delegate.create(this, this.onHover);
        return new spiff.TableauEventHandler(element, spec);
    },
    
    doConnections: function tab_LegacyLegendViewWeb$doConnections() {
        var jqueryDomNode = $(this.get_domNode());
        this._disposables$4.add(spiff.EventUtil.bindWithDispose(jqueryDomNode, 'mouseenter', ss.Delegate.create(this, this._onMouseOver$4)));
        this._disposables$4.add(spiff.EventUtil.bindWithDispose(jqueryDomNode, 'mouseleave', ss.Delegate.create(this, this._onMouseOut$4)));
    },
    
    layoutButtons: function tab_LegacyLegendViewWeb$layoutButtons(contentSize) {
        var highlightTop = tab.BaseLegendView.controlsMargin;
        var highlightRight = tab.BaseLegendView.controlsMargin;
        this.get_legendTemplate().domHighlighter.css('right', '');
        var highlighterInContent = !this.highlighterFitsUpperRight();
        if (highlighterInContent && !this.get_legendViewModel().get_titleInline()) {
            highlightTop += this.get_serverRenderedModel().titleHeight;
        }
        var domHorizScrollButtonHolder = (this.get_template()).domHorizScrollButtonHolder;
        domHorizScrollButtonHolder.css('visibility', 'hidden');
        if (this.get_serverRenderedModel().isVisuallyCat) {
            if (this.get_serverRenderedModel().legendLayout !== 'vertical') {
                if (contentSize.h < tab.Metrics.get_minScrollHeight() && contentSize.h > 1) {
                    dojo.addClass(this.get_domNode(), 'LegendHorizontal');
                    var bodyW = this.bodySize.w;
                    if (bodyW > contentSize.w) {
                        contentSize.w -= tab.LegendBaseViewModel.horizontalIteratorButtonHolderWidth;
                        if (this.get_serverRenderedModel().isVisuallyCat && (!!this.get_legendViewModel().get_titleInline() || (!this.get_serverRenderedModel().titleHtml.toString().length && !this.get_serverRenderedModel().titleWidth && !this.get_serverRenderedModel().titleHeight))) {
                            contentSize.w -= 18;
                            this.get_legendTemplate().domHighlighter.css('right', (tab.LegendBaseViewModel.horizontalIteratorButtonHolderWidth + 4) + 'px');
                        }
                        this.iterButtons.set_scrollIncrement((this.get_serverRenderedModel().colWidth || this.get_legendTemplate().get_contentArea().get(0).clientWidth / 2 || 120));
                        domHorizScrollButtonHolder.css('visibility', 'visible');
                        var horizScrollButtonHolderTop = (!!this.get_legendViewModel().get_titleInline()) ? 0 : this.get_serverRenderedModel().titleHeight;
                        domHorizScrollButtonHolder.css('top', horizScrollButtonHolderTop + 'px');
                        if (highlighterInContent) {
                            highlightRight += tab.LegendBaseViewModel.horizontalIteratorButtonHolderWidth + tab.BaseLegendView.controlsMargin;
                        }
                    }
                    else {
                        domHorizScrollButtonHolder.css('visibility', 'hidden');
                        this.get_legendTemplate().get_contentArea().css('overflow-x', 'auto');
                    }
                }
                else {
                    this.get_legendTemplate().get_contentArea().css('overflow', 'auto');
                }
            }
            if (this.get_serverRenderedModel().legendLayout === 'vertical') {
                this.get_legendTemplate().get_contentArea().css('overflow-y', 'auto');
                if (highlighterInContent) {
                    if (this.get_serverRenderedModel().regionHeight > contentSize.h) {
                        highlightRight += tab.Metrics.get_scrollW();
                    }
                }
            }
            dojo.marginBox(this.get_legendTemplate().get_contentArea().get(0), tab.$create_Size(contentSize.w, contentSize.h));
        }
        else {
            domHorizScrollButtonHolder.css('visibility', 'hidden');
            this.get_legendTemplate().get_contentArea().css('overflow', 'hidden');
            if (contentSize.w > 0) {
                dojo.marginBox(this.get_legendTemplate().get_contentArea().get(0), tab.$create_Size(contentSize.w, contentSize.h));
            }
        }
        this.get_legendTemplate().domHighlighter.css('top', highlightTop + 'px');
        this.get_legendTemplate().domHighlighter.css('right', highlightRight + 'px');
        this.iterButtons.updateButtonState();
    },
    
    _onMouseOver$4: function tab_LegacyLegendViewWeb$_onMouseOver$4(e) {
        if (!tsConfig.allow_highlight) {
            return;
        }
        if (this.get_serverRenderedModel().isVisuallyCat) {
            if (this.get_serverRenderedModel().isHighlightAllowed) {
                this.get_legendTemplate().domHighlighter.css('visibility', '');
            }
            this.get_domRoot().addClass('tvmodeSelect');
        }
    },
    
    _onMouseOut$4: function tab_LegacyLegendViewWeb$_onMouseOut$4(e) {
        var c = dojo.coords(this.get_domNode(), true);
        if (c.x > e.pageX || (c.x + c.w) <= e.pageX || c.y > e.pageY || (c.y + c.h) <= e.pageY) {
            this.hideControls();
        }
    },
    
    onTap: function tab_LegacyLegendViewWeb$onTap(pseudoEvent) {
        if (pseudoEvent.originalEvent.button > 1) {
            return;
        }
        this.disallowHover();
        var documentPoint = this.getDocumentPoint(pseudoEvent);
        var point = this.documentPointToContentPoint(documentPoint);
        var contentPoint = tab.$create_RectXY(point.x, point.y, 0, 0);
        var selectAction = tableau.util.getSelectAction(pseudoEvent);
        if (this.get_serverRenderedModel().legendType !== 'map') {
            tab.SelectionClientCommands.selectRegion(this.get_legendViewModel().get_regionType(), contentPoint, selectAction, this.get_visualId(), this.getFieldNameVec());
        }
        window.setTimeout(ss.Delegate.create(this, function() {
            this.get_legendTooltip().singleSelectCoordinates(documentPoint, point, this.get_legendViewModel().get_regionType(), 'legenditem');
        }), 15);
    },
    
    allowHover: function tab_LegacyLegendViewWeb$allowHover() {
        this.eventHandler.unsuppressHover();
    },
    
    disallowHover: function tab_LegacyLegendViewWeb$disallowHover() {
        this.eventHandler.suppressHover();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyLegendTemplateWeb

tab.LegacyLegendTemplateWeb = function tab_LegacyLegendTemplateWeb() {
    tab.LegacyLegendTemplateWeb.initializeBase(this, [ $(tab.LegacyLegendTemplateWeb._htmlTemplate$3) ]);
    this.domHorizScrollButtonHolder = this.getElementBySelector('.tabCatLegendScroll');
    this.legendContentArea = this.domContent;
}
tab.LegacyLegendTemplateWeb.prototype = {
    domHorizScrollButtonHolder: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.PaneTableViewWeb

tab.PaneTableViewWeb = function tab_PaneTableViewWeb(paneTableVM) {
    this._inputHandlers$3 = {};
    tab.PaneTableViewWeb.initializeBase(this, [ paneTableVM, new tab.PaneTableTemplateWeb() ]);
    this._domWeb$3 = this.dom;
    var spec = spiff.$create_EventHandleSpec();
    spec.tap = ss.Delegate.create(this, function(e) {
        if (e.currentTarget === e.target) {
            this.clearSelection();
        }
    });
    this.disposables.add(new spiff.TableauEventHandler(this.get_dom().enclosingDiv.get(0), spec));
    this.init();
}
tab.PaneTableViewWeb._adjustMarkHitTestCoord$3 = function tab_PaneTableViewWeb$_adjustMarkHitTestCoord$3(coords, markBBox) {
    var ShiftSize = 2;
    var toRet = tab.$create_Point(coords.x, coords.y);
    if (markBBox.w > ShiftSize * 2) {
        toRet = tab.RectXYUtil.horizontalShiftCoordsTowardsCenter(toRet, markBBox, ShiftSize);
    }
    else {
        toRet = tab.$create_Point(markBBox.x + (markBBox.w / 2), toRet.y);
    }
    if (markBBox.h > ShiftSize * 2) {
        toRet = tab.RectXYUtil.verticalShiftCoordsTowardsCenter(toRet, markBBox, ShiftSize);
    }
    else {
        toRet = tab.$create_Point(toRet.x, markBBox.y + (markBBox.h / 2));
    }
    return toRet;
}
tab.PaneTableViewWeb.prototype = {
    _domWeb$3: null,
    _potentialTap$3: false,
    _dragStarted$3: false,
    _ignoreNextTap$3: false,
    _dragHandler$3: null,
    _onUpdate$3: null,
    _drillWidget$3: null,
    _sortWidget$3: null,
    _scrollXTW$3: null,
    _scrollYTW$3: null,
    _hoverApi$3: null,
    _lastVizHoverPoint$3: null,
    _isMouseInVizRegion$3: false,
    _wasPressOverlayJustUpdated$3: false,
    _responsiveMouseHandler$3: null,
    _visualPartHoverCommandTimeOut$3: null,
    
    get_inputHandlers: function tab_PaneTableViewWeb$get_inputHandlers() {
        return this._inputHandlers$3;
    },
    
    get_domWeb: function tab_PaneTableViewWeb$get_domWeb() {
        return this._domWeb$3;
    },
    
    get_responsiveMouseHandler: function tab_PaneTableViewWeb$get_responsiveMouseHandler() {
        return this._responsiveMouseHandler$3;
    },
    
    _zoomOnCenter: function tab_PaneTableViewWeb$_zoomOnCenter(scale) {
        var pane = this.resolvePane(tab.$create_Point(1, 1));
        this.disposeOfOverlayImages();
        this._getWebRegion$3('viz')._zoomOnCenter(pane, scale);
    },
    
    getDomNodeForContentRegion: function tab_PaneTableViewWeb$getDomNodeForContentRegion(domNode) {
        return domNode.get(0);
    },
    
    makeFloatingZoomToolbar: function tab_PaneTableViewWeb$makeFloatingZoomToolbar(viewNode) {
        var api = new tab.FZTOpsWeb(this);
        var floatingZoomToolbarWeb = new tab.FloatingZoomToolbarWeb(viewNode.get(0), api, this.shouldUseFullFloatingZoomToolbar(), this.get_mapsSearchEnabled());
        floatingZoomToolbarWeb.addClass(tab.PaneTableView.suppressVizTooltipsAndOverlays);
        return floatingZoomToolbarWeb;
    },
    
    connectTooltipEventHandlers: function tab_PaneTableViewWeb$connectTooltipEventHandlers() {
        tab.PaneTableViewWeb.callBaseMethod(this, 'connectTooltipEventHandlers');
        this.get_vizToolTip().add_mouseExitedTooltip(ss.Delegate.create(this, this._onMouseLeaveTooltip$3));
    },
    
    makeConnections: function tab_PaneTableViewWeb$makeConnections() {
        this._domWeb$3.scrollX.scroll(ss.Delegate.create(this, function(e) {
            this._onscrollX$3();
        }));
        this._domWeb$3.scrollY.scroll(ss.Delegate.create(this, function(e) {
            this._onscrollY$3();
        }));
        this.dom.get_domRoot().bind(tab.BrowserSupport.get_mouseWheelEvent(), ss.Delegate.create(this, function(e) {
            this._onMouseWheelScroll$3(e);
        }));
        this.dom.get_domRoot().mouseout(ss.Delegate.create(this, function(e) {
            this.onMouseOut(e);
        }));
        this.dom.get_domRoot().mousemove(ss.Delegate.create(this, function(e) {
            this.onMouseMove(e);
        }));
        this.dom.view.mouseover(ss.Delegate.create(this, function(e) {
            this.onViewMouseOver(e);
        }));
        this.dom.view.mouseout(ss.Delegate.create(this, function(e) {
            this.onViewMouseOut(e);
        }));
        this.dom.view.mousemove(ss.Delegate.create(this, function(e) {
            this.onViewMouseMove(e);
        }));
        if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
            this.dom.get_domRoot().attr('tabindex', '0');
            this.disposables.add(spiff.EventUtil.bindWithDispose(this.dom.get_domRoot(), 'keyup', ss.Delegate.create(this, this._onKeyUp$3)));
        }
    },
    
    makeMapsSearchViewConnections: function tab_PaneTableViewWeb$makeMapsSearchViewConnections() {
        if (ss.isValue(this.mapsSearchView)) {
            var msvInputElement = this.mapsSearchView.get_compositeSearchWidget().get_textInputView().get_inputElement();
            msvInputElement.focusin(ss.Delegate.create(this, function(e) {
                this.checkForSuppressTooltipsAndOverlays(e.target);
            }));
            msvInputElement.focusout(ss.Delegate.create(this, function(e) {
                this.checkForSuppressTooltipsAndOverlays(e.relatedTarget);
            }));
            msvInputElement.keypress(ss.Delegate.create(this, function(e) {
                this.checkForSuppressTooltipsAndOverlays(e.target);
            }));
        }
    },
    
    makeRegions: function tab_PaneTableViewWeb$makeRegions() {
        tab.Log.get(this).debug('MakeRegions');
        var nonVizRegions = this.listNonVizRegions();
        var regionCallbacks = this.makeHoverAPI();
        Object.clearKeys(this.regions);
        var noPanZoom = function() {
            return false;
        };
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(nonVizRegions));
        while ($enum1.moveNext()) {
            var regionKey = $enum1.current;
            var regionDomNode = nonVizRegions[regionKey];
            this.regions[regionKey] = new tab.TiledViewerRegionWeb(regionKey, regionDomNode.get(0), this.get_session(), regionCallbacks, this._domWeb$3.scrollX, this._domWeb$3.scrollY, noPanZoom, this.get_sheetid(), this.get_paneTableVM());
        }
        var allowPanZoomCallback = ss.Delegate.create(this, this.allowPanZoom);
        var vizRegionDomNode = this.dom.view.children().first();
        this.regions['viz'] = new tab.TiledViewerRegionWeb('viz', vizRegionDomNode.get(0), this.get_session(), regionCallbacks, this._domWeb$3.scrollX, this._domWeb$3.scrollY, allowPanZoomCallback, this.get_sheetid(), this.get_paneTableVM());
    },
    
    makeTooltip: function tab_PaneTableViewWeb$makeTooltip() {
        var contextProvider = null;
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            contextProvider = new tab.TooltipContextProvider(this.get_paneTableVM().get_visualModel().get_selectionsModel());
        }
        var mode = this.get_paneTableVM().get_visualModel().get_tooltipMode();
        var isTooltipAllowed = ss.isNullOrUndefined(tsConfig.allow_tooltip) || tsConfig.allow_tooltip;
        if (isTooltipAllowed && mode === 'smooth') {
            return new tab.TooltipResponsiveMode(contextProvider, this.get_visualId());
        }
        else if (isTooltipAllowed && mode === 'sticky') {
            return new tab.TooltipLegacyMode(contextProvider, this.get_visualId());
        }
        else {
            return new tab.TooltipDisabledMode(contextProvider, this.get_visualId());
        }
    },
    
    cancelHover: function tab_PaneTableViewWeb$cancelHover() {
    },
    
    makeInputHandlers: function tab_PaneTableViewWeb$makeInputHandlers() {
        var spec;
        Object.clearKeys(this._inputHandlers$3);
        var nonVizRegions = this.listNonVizRegions();
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(nonVizRegions));
        while ($enum1.moveNext()) {
            var regionKey = $enum1.current;
            var regionDomNode = nonVizRegions[regionKey];
            spec = this.makeMouseSpec(this._getWebRegion$3(regionKey));
            this._inputHandlers$3[regionKey] = new spiff.TableauEventHandler(regionDomNode.get(0), spec);
        }
        spec = this.makeMouseSpec(this._getWebRegion$3('viz'));
        var vizRegionDomNode = this.dom.view.children().first();
        this._inputHandlers$3['viz'] = new spiff.TableauEventHandler(vizRegionDomNode.get(0), spec);
        var config = spiff.$create_EventHandleSpec();
        spiff.TableauEventHandler.setHandler(config, 'dragStart', function(e) {
        });
        this._dragHandler$3 = new spiff.TableauEventHandler(document.body, config);
        this.disposables.add(this._dragHandler$3);
        var responsiveSpec = spiff.$create_EventHandleSpec();
        responsiveSpec.hover = ss.Delegate.create(this, function(e) {
            this._onHoverOverlay$3(this._getWebRegion$3('viz'), e);
        });
        responsiveSpec.hoverDelay = 0;
        if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.categoricalHeadersVisualFeedback)) {
            this._makeCategoricalHeaderEventHandlers$3();
        }
        this._responsiveMouseHandler$3 = new spiff.TableauEventHandler(vizRegionDomNode.get(0), responsiveSpec);
        this.disposables.add(this._responsiveMouseHandler$3);
        vizRegionDomNode.addClass('tvmodeRectSelect');
    },
    
    _makeCategoricalHeaderEventHandlers$3: function tab_PaneTableViewWeb$_makeCategoricalHeaderEventHandlers$3() {
        var nonVizRegions = this.listNonVizRegions();
        var createHoverSpec = ss.Delegate.create(this, function(regionPart) {
            var spec = spiff.$create_EventHandleSpec();
            spec.hover = ss.Delegate.create(this, function(e) {
                this._onHoverCategoricalHeaders$3(this._getWebRegion$3(regionPart), e);
            });
            spec.hoverDelay = 0;
            spec.firstTouch = ss.Delegate.create(this, function(e) {
                this._onPressCategoricalHeaders$3(this._getWebRegion$3(regionPart), e);
            });
            this.disposables.add(new spiff.TableauEventHandler(nonVizRegions[regionPart].get(0), spec));
            nonVizRegions[regionPart].mouseout(ss.Delegate.create(this, function(e) {
                this._onMouseOutCategoricalHeaders$3(regionPart);
            }));
        });
        createHoverSpec('xheader');
        createHoverSpec('yheader');
        createHoverSpec('topaxis');
        createHoverSpec('bottomaxis');
    },
    
    makeHoverAPI: function tab_PaneTableViewWeb$makeHoverAPI() {
        if (ss.isNullOrUndefined(this._hoverApi$3)) {
            this._hoverApi$3 = new tab.HoverApi(this);
            this.disposables.add(this._hoverApi$3);
        }
        return this._hoverApi$3;
    },
    
    makeMouseSpec: function tab_PaneTableViewWeb$makeMouseSpec(region) {
        var spec = spiff.$create_EventHandleSpec();
        spec.hover = ss.Delegate.create(this, function(e) {
            this._onHoverTooltip$3(region, e);
        });
        spec.hoverDelay = (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) ? spiff.Hover.fastHoverTime : spiff.Hover.hoverTime;
        var mode = this.get_paneTableVM().get_visualModel().get_tooltipMode();
        if (mode !== 'sticky') {
            if (tab.ApplicationModel.get_instance().get_isLocalRenderMode() && region.get_regionPart() === 'viz') {
                spec.hoverDelay = 0;
            }
            else {
                var hoverDelay = tab.FeatureParamsLookup.getInt(tab.FeatureParam.hoverDelay);
                spec.hoverDelay = (ss.isValue(hoverDelay)) ? hoverDelay : spiff.Hover.fastHoverTime;
            }
        }
        spec.firstTouch = ss.Delegate.create(this, function(e) {
            this._onFirstTouch$3(region, e);
        });
        spec.tap = ss.Delegate.create(this, function(e) {
            this._onTap$3(region, e);
        });
        spec.doubleTap = ss.Delegate.create(this, function(e) {
            this._onDoubleTap$3(region, e);
        });
        spec.lastTouch = ss.Delegate.create(this, function(e) {
            this._onLastTouch$3(region, e);
        });
        if (region.get_regionPart() === 'viz') {
            spec.dragStart = ss.Delegate.create(this, function(e) {
                this._onDragStart$3(region, e);
            });
            if (tsConfig.allow_filter) {
                spec.press = ss.Delegate.create(this, function(e) {
                    this._onPress$3(region, e);
                });
                spec.potentialTap = ss.Delegate.create(this, function(e) {
                    this._onPotentialTap$3(region, e);
                });
                spec.cancelPotentialTap = ss.Delegate.create(this, function(e) {
                    this._onCancelPotentialTap$3(region, e);
                });
                spec.pressDragStart = ss.Delegate.create(this, function(e) {
                    this._onPressDragStart$3(region, e);
                });
            }
        }
        return spec;
    },
    
    makeRegionContentProviders: function tab_PaneTableViewWeb$makeRegionContentProviders() {
        var onQueueComplete = ss.Delegate.create(this, function(sender, e) {
            this.regions['viz'].reset();
        });
        this.makeRegionContentProvidersHelper(this.dom.view.children().first(), onQueueComplete);
        this._scrollYTW$3 = this.makeTiledWindow(this._domWeb$3.scrollY, null, null, null, null);
        this._scrollXTW$3 = this.makeTiledWindow(this._domWeb$3.scrollX, null, null, null, null);
    },
    
    makeTiledWindow: function tab_PaneTableViewWeb$makeTiledWindow(domNode, sessionRef, controllerRef, getRID, optionalCallback) {
        return this.makeTiledWindowHelper(domNode, sessionRef, controllerRef, getRID, optionalCallback, true);
    },
    
    refreshScrollingAndDrilling: function tab_PaneTableViewWeb$refreshScrollingAndDrilling() {
        var currentOnUpdate = this._onUpdate$3;
        this._onUpdate$3 = null;
        if (typeof(currentOnUpdate) === 'function') {
            currentOnUpdate();
        }
        if (ss.isValue(this._drillWidget$3)) {
            this._drillWidget$3.onUpdate();
        }
        if (ss.isValue(this._sortWidget$3)) {
            this._sortWidget$3.onUpdate();
        }
    },
    
    destroyRegions: function tab_PaneTableViewWeb$destroyRegions() {
        tab.PaneTableViewWeb.callBaseMethod(this, 'destroyRegions');
        this._scrollYTW$3.destroy();
        this._scrollXTW$3.destroy();
    },
    
    destroyInputHandlers: function tab_PaneTableViewWeb$destroyInputHandlers() {
        tab.Log.get(this).debug('DestroyInputHandlers');
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(this._inputHandlers$3));
        while ($enum1.moveNext()) {
            var p = $enum1.current;
            this._inputHandlers$3[p].dispose();
            this._inputHandlers$3[p] = null;
        }
        Object.clearKeys(this._inputHandlers$3);
        this.get_vizToolTip().remove_mouseExitedTooltip(ss.Delegate.create(this, this._onMouseLeaveTooltip$3));
        this._removeDocumentListeners$3();
    },
    
    refreshImages: function tab_PaneTableViewWeb$refreshImages(cacheInfo) {
        tab.PaneTableViewWeb.callBaseMethod(this, 'refreshImages', [ cacheInfo ]);
        this._scrollYTW$3.refreshImages(cacheInfo);
        this._scrollXTW$3.refreshImages(cacheInfo);
    },
    
    onTooltipClosed: function tab_PaneTableViewWeb$onTooltipClosed() {
        tab.PaneTableViewWeb.callBaseMethod(this, 'onTooltipClosed');
        this._checkForOverlay$3();
    },
    
    _onMouseLeaveTooltip$3: function tab_PaneTableViewWeb$_onMouseLeaveTooltip$3(mousePoint) {
        var c = tab.DomUtil.getDojoCoordsJQ(this.dom.view);
        if (c.x > mousePoint.x || (c.x + c.w) <= mousePoint.x || c.y > mousePoint.y || (c.y + c.h) <= mousePoint.y) {
            this.disposeOfOverlayImages();
            if (this.get_vizToolTip().get_isTooltipShown()) {
                this.get_vizToolTip().clearTooltipWithFakeHover();
            }
        }
    },
    
    onViewMouseOver: function tab_PaneTableViewWeb$onViewMouseOver(e) {
        this._isMouseInVizRegion$3 = true;
        this.showFloatingZoomToolbar(true);
        if (ss.isValue(this.mapsSearchView) && this.get_mapsSearchEnabled()) {
            this.mapsSearchView.set_isVisible(true);
        }
        this.checkForSuppressTooltipsAndOverlays(e.target);
    },
    
    _isPointOutsideOfViz$3: function tab_PaneTableViewWeb$_isPointOutsideOfViz$3(c, e) {
        return (c.x > e.pageX || (c.x + c.w) <= e.pageX || c.y > e.pageY || (c.y + c.h) <= e.pageY);
    },
    
    onMouseOut: function tab_PaneTableViewWeb$onMouseOut(e) {
        var c = tab.DomUtil.getDojoCoordsJQ(this.dom.get_domRoot());
        if (this._isPointOutsideOfViz$3(c, e)) {
            if (ss.isValue(this._sortWidget$3)) {
                this._sortWidget$3.hideSortIndicator();
            }
            if (ss.isValue(this._drillWidget$3)) {
                this._drillWidget$3.turnDrillWidgetsOff();
            }
            this.get_vizToolTip().clearTooltipWithFakeHover();
            this._clearOverlays$3();
        }
    },
    
    _clearOverlays$3: function tab_PaneTableViewWeb$_clearOverlays$3() {
        if (!this._dragStarted$3) {
            this.disposeOfOverlayImages();
        }
    },
    
    onMouseMove: function tab_PaneTableViewWeb$onMouseMove(e) {
        var tooltip = this.get_vizToolTip();
        if (tooltip.get_isTooltipShown() && !tooltip.shownTooltipIsStatic()) {
            var c = tab.DomUtil.getDojoCoordsJQ(this.dom.view);
            if (this._isPointOutsideOfViz$3(c, e)) {
                tooltip.hoverOverWhitespace(tab.$create_Point(c.x, c.y), 'viz');
            }
        }
    },
    
    onViewMouseOut: function tab_PaneTableViewWeb$onViewMouseOut(e) {
        this._isMouseInVizRegion$3 = false;
        var c = tab.DomUtil.getDojoCoordsJQ(this.dom.view);
        var tooltip = this.get_vizToolTip();
        if (this._isPointOutsideOfViz$3(c, e)) {
            this.showFloatingZoomToolbar(false);
            if (ss.isValue(this.mapsSearchView)) {
                this.mapsSearchView.set_isVisible(false);
            }
            if (tooltip.get_isTooltipShown() && !tooltip.shownTooltipIsStatic()) {
                tooltip.hoverOverWhitespace(tab.$create_Point(c.x, c.y), 'viz');
            }
        }
        if (!tooltip.get_isTooltipShown()) {
            this._clearOverlays$3();
        }
        this.checkForSuppressTooltipsAndOverlays(e.relatedTarget);
    },
    
    onViewMouseMove: function tab_PaneTableViewWeb$onViewMouseMove(e) {
        this._isMouseInVizRegion$3 = true;
        this.checkForSuppressTooltipsAndOverlays(e.target);
    },
    
    setupSortIndicators: function tab_PaneTableViewWeb$setupSortIndicators() {
        this._sortWidget$3 = new tab.Sorting(this, this.get_dom().get_domRoot().get(0));
        this.disposables.add(this._sortWidget$3);
    },
    
    setupDrilling: function tab_PaneTableViewWeb$setupDrilling() {
        this._drillWidget$3 = new tab.Drilling(this, this.get_dom().get_domRoot().get(0));
        this.disposables.add(this._drillWidget$3);
    },
    
    setRegionGeometryHelper: function tab_PaneTableViewWeb$setRegionGeometryHelper(domNode, marginBoxSpec) {
        if (ss.isValue(domNode) && domNode.children().first().hasClass('tvScrollContainer')) {
            tab.DomUtil.setMarginBoxJQ(domNode.children().first(), tab.$create_Rect(0, 0, marginBoxSpec.w, marginBoxSpec.h));
        }
    },
    
    setGeometryForWebScrollbars: function tab_PaneTableViewWeb$setGeometryForWebScrollbars(viewHeight, viewWidth, scrollWidth, scrollHeight, scrollYTop, overallWidth, scrollXTop, scrollXLeft, scrollableHeight, scrollableWidth) {
        var scrollYinfo = null, scrollXinfo = null;
        if (ss.isValue(scrollWidth) && scrollWidth > 0) {
            var scrollYHeight = Math.max(tab.Metrics.get_minScrollHeight(), viewHeight);
            tab.DomUtil.setMarginBoxJQ(this._domWeb$3.scrollY, tab.$create_Rect(overallWidth, scrollYTop, scrollWidth, scrollYHeight));
            this._domWeb$3.scrollY.css('display', '');
        }
        else {
            this._domWeb$3.scrollY.css('display', 'none');
        }
        if (ss.isValue(scrollHeight) && scrollHeight > 0) {
            var scrollXWidth = Math.max(tab.Metrics.get_minScrollWidth(), viewWidth);
            tab.DomUtil.setMarginBoxJQ(this._domWeb$3.scrollX, tab.$create_Rect(scrollXLeft, scrollXTop, scrollXWidth, scrollHeight));
            this._domWeb$3.scrollX.css('display', '');
        }
        else {
            this._domWeb$3.scrollX.css('display', 'none');
        }
        if (this._domWeb$3.scrollY.css('display') !== 'none') {
            scrollYinfo = tab.$create_RegionRect(0, 0, 1, scrollableHeight, null);
        }
        this._scrollYTW$3.reset(scrollYinfo, this.geometry.ts);
        if (this._domWeb$3.scrollX.css('display') !== 'none') {
            scrollXinfo = tab.$create_RegionRect(0, 0, scrollableWidth, 1, null);
        }
        this._scrollXTW$3.reset(scrollXinfo, this.geometry.ts);
    },
    
    maybeShowOverlayImages: function tab_PaneTableViewWeb$maybeShowOverlayImages(ubertipModel) {
        if (!tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            var overlayImage = null;
            if (ss.isValue(ubertipModel) && tab.BrowserSupport.get_dataUri() && ss.isValue(ubertipModel.overlayImage)) {
                overlayImage = this.createOverlayImageFromDataUri(ubertipModel.overlayImage);
            }
            else if (ss.isValue(ubertipModel.overlayImageKey)) {
                overlayImage = this.createOverlayImageFromFile(ubertipModel.overlayImageKey);
            }
            this.showOverlayImages(overlayImage, ubertipModel.overlayAnchors);
        }
    },
    
    _onMouseWheelScroll$3: function tab_PaneTableViewWeb$_onMouseWheelScroll$3(e) {
        var scrollX, scrollY;
        var origEvent = null;
        if (ss.isValue(e.originalEvent)) {
            origEvent = e.originalEvent;
        }
        if (ss.isValue(origEvent.detail) && !!origEvent.detail) {
            scrollY = (origEvent.axis === origEvent.HORIZONTAL_AXIS) ? 0 : origEvent.detail;
            scrollX = (origEvent.axis === origEvent.HORIZONTAL_AXIS) ? origEvent.detail : 0;
        }
        else if ((ss.isValue(origEvent.wheelDeltaY) && !!origEvent.wheelDeltaY) || (ss.isValue(origEvent.wheelDeltaX) && !!origEvent.wheelDeltaX)) {
            scrollY = -origEvent.wheelDeltaY;
            scrollX = -origEvent.wheelDeltaX;
        }
        else if ((ss.isValue(origEvent.deltaY) && !!origEvent.deltaY) || (ss.isValue(origEvent.deltaX) && !!origEvent.deltaX)) {
            scrollY = 40 * origEvent.deltaY;
            scrollX = 40 * origEvent.deltaX;
        }
        else {
            scrollY = -origEvent.wheelDelta;
            scrollX = 0;
        }
        var previousScrollTop = this._domWeb$3.scrollY.scrollTop();
        var previousScrollLeft = this._domWeb$3.scrollX.scrollLeft();
        this._domWeb$3.scrollY.scrollTop(previousScrollTop + scrollY);
        this._domWeb$3.scrollX.scrollLeft(previousScrollLeft + scrollX);
        var newScrollTop = this._domWeb$3.scrollY.scrollTop();
        var newScrollLeft = this._domWeb$3.scrollX.scrollLeft();
        if (previousScrollTop !== newScrollTop) {
            this._doscrollY$3(newScrollTop);
            e.preventDefault();
        }
        if (previousScrollLeft !== newScrollLeft) {
            this._doscrollX$3(newScrollLeft);
            e.preventDefault();
        }
        this.get_vizToolTip().onScroll();
        this.disposeOfOverlayImages();
    },
    
    _onscrollY$3: function tab_PaneTableViewWeb$_onscrollY$3() {
        this.get_vizToolTip().onScroll();
        this._doscrollY$3(this._domWeb$3.scrollY.scrollTop());
    },
    
    _doscrollY$3: function tab_PaneTableViewWeb$_doscrollY$3(topPos) {
        var $enum1 = ss.IEnumerator.getEnumerator(tab.PaneTableView.scrollableYRegions);
        while ($enum1.moveNext()) {
            var key = $enum1.current;
            this._getWebRegion$3(key).setYPos(topPos);
        }
        var newScrollPos = tab.$create_Point(this._domWeb$3.scrollX.scrollLeft(), topPos);
        this.set_scrollPosition(newScrollPos);
    },
    
    _doscrollX$3: function tab_PaneTableViewWeb$_doscrollX$3(leftPos) {
        var $enum1 = ss.IEnumerator.getEnumerator(tab.PaneTableView.scrollableXRegions);
        while ($enum1.moveNext()) {
            var key = $enum1.current;
            this._getWebRegion$3(key).setXPos(leftPos);
        }
        var newScrollPos = tab.$create_Point(leftPos, this._domWeb$3.scrollY.scrollTop());
        this.set_scrollPosition(newScrollPos);
    },
    
    _onscrollX$3: function tab_PaneTableViewWeb$_onscrollX$3() {
        this.get_vizToolTip().onScroll();
        this._doscrollX$3(this._domWeb$3.scrollX.scrollLeft());
    },
    
    _onKeyUp$3: function tab_PaneTableViewWeb$_onKeyUp$3(e) {
        if (this._getWebRegion$3('viz').get_isDragTracking()) {
            return;
        }
        if (e.target !== this.get_element().get(0) && e.target !== this.dom.view.find('.tvimagesContainer').get(0)) {
            return;
        }
        var mode = this.defaultPointerToolMode();
        switch (e.which) {
            case 68:
                mode = 'lassoSelect';
                break;
            case 83:
                mode = 'radialSelect';
                break;
            case 65:
                mode = 'rectSelect';
                break;
            default:
                return;
        }
        if (mode === this._getWebRegion$3('viz').get_currentPointerToolMode()) {
            mode = this.defaultPointerToolMode();
        }
        if (ss.isValue(this.zoomToolbar)) {
            this.zoomToolbar.setToolMode(mode, e.shiftKey);
        }
        else {
            this.setPointerToolMode(mode, e.shiftKey);
        }
    },
    
    _hitTestSingleMarksAndVisualParts$3: function tab_PaneTableViewWeb$_hitTestSingleMarksAndVisualParts$3(p, isHover) {
        var selectionRect = tab.$create_RectXY(p.x, p.y, 1, 1);
        var region = this._getWebRegion$3('viz');
        var markHits = region.hitTestMarks(selectionRect, true);
        var visualPartHits = region.hitTestVisualPartsHelper(selectionRect, true, markHits);
        var toRet = tab.HitTestResult.tieBreakHits(markHits, visualPartHits);
        if (isHover && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.responsiveUi)) {
            region.setMouseOverMarkOrVisualPart(toRet.get_hitType() !== tab.HitResultHitType.noHit);
        }
        return toRet;
    },
    
    checkForHoverOverlay: function tab_PaneTableViewWeb$checkForHoverOverlay() {
        if (ss.isValue(this._lastVizHoverPoint$3) && this._isMouseInVizRegion$3) {
            var objectHit = this._hitTestSingleMarksAndVisualParts$3(this._lastVizHoverPoint$3, true);
            if (objectHit.get_shouldRenderOverlay()) {
                this.updateOverlayTarget(objectHit.get_id(), 'hover', objectHit.get_visualPart());
                return;
            }
        }
        this.disposeOfOverlayImages();
    },
    
    _checkForOverlay$3: function tab_PaneTableViewWeb$_checkForOverlay$3() {
        if (ss.isValue(this._lastVizHoverPoint$3) && this._isMouseInVizRegion$3) {
            var objectHit = this._hitTestSingleMarksAndVisualParts$3(this._lastVizHoverPoint$3, true);
            if (objectHit.get_hitType() === tab.HitResultHitType.noHit) {
                this.hoverOverWhitespace();
            }
            if (objectHit.get_shouldRenderOverlay()) {
                this.updateOverlayForLastTargetState(objectHit.get_id(), objectHit.get_visualPart());
                return;
            }
        }
        this.disposeOfOverlayImages();
    },
    
    _onHoverCategoricalHeaders$3: function tab_PaneTableViewWeb$_onHoverCategoricalHeaders$3(region, pseudoEvent) {
        if (!tab.ApplicationModel.get_instance().get_isLocalRenderMode() || ss.isNullOrUndefined(region.get_contentProvider())) {
            return;
        }
        var regionCoordinates = region.toLocalCoordsEvent(pseudoEvent);
        var hoveredNode = region.hitTestNodes(regionCoordinates);
        var visualPart = tab.ModelUtils.regionToVisualPartMap[region.get_regionPart()];
        this.updateCategoricalHeaders(hoveredNode, 'hover', visualPart);
    },
    
    _onPressCategoricalHeaders$3: function tab_PaneTableViewWeb$_onPressCategoricalHeaders$3(region, pseudoEvent) {
        if (!tab.ApplicationModel.get_instance().get_isLocalRenderMode() || ss.isNullOrUndefined(region.get_contentProvider())) {
            return;
        }
        var regionCoordinates = region.toLocalCoordsEvent(pseudoEvent);
        var pressedNode = region.hitTestNodes(regionCoordinates);
        var visualPart = tab.ModelUtils.regionToVisualPartMap[region.get_regionPart()];
        this.updateCategoricalHeaders(pressedNode, 'press', visualPart);
    },
    
    _onMouseOutCategoricalHeaders$3: function tab_PaneTableViewWeb$_onMouseOutCategoricalHeaders$3(regionPart) {
        var visualPart = tab.ModelUtils.regionToVisualPartMap[regionPart];
        var vlvm = this.get_paneTableVM().get_vizRegionMap()[visualPart];
        if (ss.isValue(vlvm)) {
            vlvm.set_hoverNode(null);
        }
    },
    
    _onHoverOverlay$3: function tab_PaneTableViewWeb$_onHoverOverlay$3(region, pseudoEvent) {
        if (this._wasPressOverlayJustUpdated$3) {
            this._wasPressOverlayJustUpdated$3 = false;
            return;
        }
        if (spiff.DragDropManager.get_isDragging()) {
            return;
        }
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode() && region.get_regionPart() === 'viz' && (region.isSelectingToolActive() || region._isDefaultToolActive())) {
            var regionCoordinates = region.toLocalCoordsEvent(pseudoEvent);
            var pageCoordinates = tab.PointUtil.add(regionCoordinates, tab.RecordCast.dojoCoordsAsPoint(region.getLocalOffset()));
            if (this.get_vizToolTip().isHoverAllowed(pageCoordinates)) {
                var objectHit = this._hitTestSingleMarksAndVisualParts$3(regionCoordinates, true);
                if (objectHit.get_hitType() === tab.HitResultHitType.noHit) {
                    this.hoverOverWhitespace();
                }
                if (objectHit.get_shouldRenderOverlay()) {
                    this.updateOverlayTarget(objectHit.get_id(), 'hover', objectHit.get_visualPart());
                }
                else {
                    this.disposeOfOverlayImages();
                }
            }
        }
    },
    
    _onHoverTooltip$3: function tab_PaneTableViewWeb$_onHoverTooltip$3(region, pseudoEvent) {
        if (spiff.DragDropManager.get_isDragging()) {
            return;
        }
        var tooltip = this.get_vizToolTip();
        if (tooltip.get_isTooltipShown() && tooltip.shownTooltipIsStatic()) {
            return;
        }
        var regionCoordinates = region.toLocalCoordsEvent(pseudoEvent);
        var pageCoordinates = tab.PointUtil.add(regionCoordinates, tab.RecordCast.dojoCoordsAsPoint(region.getLocalOffset()));
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            var hitSomething = false;
            if (region.get_regionPart() === 'viz') {
                this._clearVisualPartHoverTimeOut$3();
                this._lastVizHoverPoint$3 = regionCoordinates;
                region.get_shapeSelector().setSingleSelectPoint(regionCoordinates);
                var tooltipObject = this._hitTestSingleMarksAndVisualParts$3(regionCoordinates, true);
                hitSomething = tooltipObject.get_hitType() !== tab.HitResultHitType.noHit;
                if (hitSomething) {
                    switch (tooltipObject.get_hitObjectType()) {
                        case tab.HitResultObjectType.mark:
                            var markBBox = this.get_paneTableVM().get_scene().getMarkBoundingBox(tooltipObject.get_id());
                            regionCoordinates = tab.PaneTableViewWeb._adjustMarkHitTestCoord$3(regionCoordinates, markBBox);
                            var selectionsModel = this.get_paneTableVM().get_visualModel().get_selectionsModel();
                            var isSelected = selectionsModel.get_tupleSelection().isMarkSelected(tooltipObject.get_id());
                            var paneDescriptorKey = tab.SceneUtils.getPaneDescriptorKeyFromTupleId(tooltipObject.get_id(), this.get_paneTableVM().get_scene().get_scene());
                            tooltip.hoverOverObject(pageCoordinates, regionCoordinates, tooltipObject.get_id(), isSelected, paneDescriptorKey, 'mark', region.get_regionPart());
                            break;
                        case tab.HitResultObjectType.referenceLine:
                        case tab.HitResultObjectType.trendLine:
                            this._visualPartHoverCommandTimeOut$3 = window.setTimeout(function() {
                                tooltip.hoverOverCoordinates(pageCoordinates, regionCoordinates, 'visualparts', region.get_regionPart());
                            }, spiff.Hover.fastHoverTime);
                            break;
                        default:
                            break;
                    }
                }
            }
            else if (ss.isValue(region.get_contentProvider())) {
                this._lastVizHoverPoint$3 = null;
                var hoveredNode = region.hitTestNodes(regionCoordinates);
                if (ss.isValue(hoveredNode)) {
                    tooltip.hoverOverCoordinates(pageCoordinates, regionCoordinates, 'header', region.get_regionPart());
                    hitSomething = true;
                }
            }
            if (!hitSomething) {
                tooltip.hoverOverWhitespace(pageCoordinates, region.get_regionPart());
            }
        }
        else {
            var targetType = tab.PaneTableView.guessTooltipTargetTypeFromRegion(region.get_regionPart());
            tooltip.hoverOverCoordinates(pageCoordinates, regionCoordinates, targetType, region.get_regionPart());
        }
    },
    
    _onMoving$3: function tab_PaneTableViewWeb$_onMoving$3(region, pseudoEvent) {
        this.get_vizToolTip().onMoving();
        this.disposeOfOverlayImages();
    },
    
    _onFirstTouch$3: function tab_PaneTableViewWeb$_onFirstTouch$3(region, pseudoEvent) {
        if (ss.isValue(this.mapsSearchView)) {
            this.mapsSearchView.get_compositeSearchWidget().removeList();
        }
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode() && region.get_regionPart() === 'viz' && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.responsiveUi)) {
            var coords = region.toLocalCoordsEvent(pseudoEvent);
            var objectHit = this._hitTestSingleMarksAndVisualParts$3(coords, false);
            if (objectHit.get_shouldRenderOverlay()) {
                this._wasPressOverlayJustUpdated$3 = true;
                this.updateOverlayTarget(objectHit.get_id(), 'press', objectHit.get_visualPart());
            }
        }
    },
    
    _existsLegendSelectionForViz$3: function tab_PaneTableViewWeb$_existsLegendSelectionForViz$3() {
        var $enum1 = ss.IEnumerator.getEnumerator(this.get_paneTableVM().get_selectionsModel().get_allLegendSelections());
        while ($enum1.moveNext()) {
            var legendSelectionModel = $enum1.current;
            if (!legendSelectionModel.get_isEmpty()) {
                return true;
            }
        }
        return false;
    },
    
    isSelectActionOnVizAllowed: function tab_PaneTableViewWeb$isSelectActionOnVizAllowed(action) {
        return (action === 'simple' || !this._existsLegendSelectionForViz$3());
    },
    
    _onTap$3: function tab_PaneTableViewWeb$_onTap$3(region, pseudoEvent) {
        if (this._ignoreNextTap$3) {
            this._ignoreNextTap$3 = false;
            return;
        }
        this.get_vizToolTip().onTap();
        this._potentialTap$3 = false;
        this.disposeOfOverlayImages();
        if (pseudoEvent.originalEvent.button > 1) {
            return;
        }
        var regionCoords = region.toLocalCoordsEvent(pseudoEvent);
        var pageCoords = tab.PointUtil.add(regionCoords, tab.RecordCast.dojoCoordsAsPoint(region.getLocalOffset()));
        var action;
        if (region.get_regionPart() === 'viz') {
            action = tab.ResolveSelectAction.fromNormalizedEvent(pseudoEvent, false, true);
        }
        else {
            action = tab.ResolveSelectAction.fromNormalizedEvent(pseudoEvent);
        }
        if (this.allowPanZoom() && (region._isZoomModKeys(pseudoEvent) || region.get_currentPointerToolMode() === 'zoom')) {
            var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
            region._zoomFromClick(pseudoEvent, pane);
            return;
        }
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            this.handleLocalTap(region, action, pageCoords, regionCoords);
        }
        else {
            var tooltipCallback = ss.Delegate.create(this, function() {
                if (!tsConfig.allow_select) {
                    this.makeHoverAPI().unsuppressHover(region);
                }
                var targetType = tab.PaneTableView.guessTooltipTargetTypeFromRegion(region.get_regionPart());
                this.get_vizToolTip().singleSelectCoordinates(pageCoords, regionCoords, region.get_regionPart(), targetType);
            });
            var regionSelectionRect = tab.$create_RectXY(regionCoords.x, regionCoords.y, 0, 0);
            tab.SelectionClientCommands.selectRectRegionAndDoUbertip(region.get_regionPart(), regionSelectionRect, action, this.get_paneTableVM().get_visualId(), tooltipCallback);
            if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
                this.dom.get_domRoot().focus();
            }
        }
    },
    
    _onDoubleTap$3: function tab_PaneTableViewWeb$_onDoubleTap$3(region, pseudoEvent) {
        this._potentialTap$3 = false;
        var scale = (region._isZoomOutDoubleClickModKeys(pseudoEvent)) ? 0.5 : 2;
        this.doDoubleTap(region, pseudoEvent, scale);
    },
    
    _onDragStart$3: function tab_PaneTableViewWeb$_onDragStart$3(region, pseudoEvent) {
        var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
        this._hookUpDocumentDragListeners$3();
        if (region._isPanModKeys(pseudoEvent)) {
            this.setPointerToolMode('pan', false);
        }
        else if (region._isZoomModKeys(pseudoEvent)) {
            this.setPointerToolMode('zoom', false);
        }
        else if (!tsConfig.allow_filter) {
            this.setPointerToolMode(region.get_currentPointerToolMode(), false);
        }
        this._removeToolTipAndOverlays$3(region);
        if (ss.isValue(this.mapsSearchView)) {
            this.mapsSearchView.enableUserInteraction(false);
        }
        if (ss.isValue(this.zoomToolbar)) {
            this.zoomToolbar.enableUserInteraction(false);
        }
        this.updateTextSelectability(false);
        region._dragStart(pseudoEvent, pane);
    },
    
    _onDrag$3: function tab_PaneTableViewWeb$_onDrag$3(pseudoEvent) {
        var vizRegion = this._getWebRegion$3('viz');
        vizRegion._dragMove(pseudoEvent);
        if (vizRegion.isSelectingToolActive()) {
            this.checkForDragOverlays();
            this._dragStarted$3 = true;
        }
    },
    
    _onDragEnd$3: function tab_PaneTableViewWeb$_onDragEnd$3(pseudoEvent) {
        this._ignoreNextTap$3 = pseudoEvent.type === 'mousedown';
        this.get_vizToolTip().onDragEnd();
        this.disposeOfOverlayImages();
        this._dragStarted$3 = false;
        this._getWebRegion$3('viz')._dragEnd(pseudoEvent, this.get_vizToolTip());
        this._removeDocumentListeners$3();
        if (!this.isPointerToolLocked) {
            this.resetPointerToolMode();
        }
        if (ss.isValue(this.mapsSearchView)) {
            this.mapsSearchView.enableUserInteraction(true);
        }
        if (ss.isValue(this.zoomToolbar)) {
            this.zoomToolbar.enableUserInteraction(true);
        }
        this.updateTextSelectability(true);
    },
    
    _onPress$3: function tab_PaneTableViewWeb$_onPress$3(region, pseudoEvent) {
        if (this._dragStarted$3 || !region._isDefaultToolActive()) {
            return;
        }
        this._ignoreNextTap$3 = false;
        region.setPointerToolMode('pan');
        this.get_vizToolTip().onPress();
        this._clearVisualPartHoverTimeOut$3();
        this.disposeOfOverlayImages();
    },
    
    _onPressDragStart$3: function tab_PaneTableViewWeb$_onPressDragStart$3(region, pseudoEvent) {
        var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
        this._hookUpDocumentDragListeners$3();
        region._dragStart(pseudoEvent, pane);
        this._removeToolTipAndOverlays$3(region);
    },
    
    _onPotentialTap$3: function tab_PaneTableViewWeb$_onPotentialTap$3(region, pseudoEvent) {
        this._potentialTap$3 = true;
    },
    
    _onCancelPotentialTap$3: function tab_PaneTableViewWeb$_onCancelPotentialTap$3(region, pseudoEvent) {
        this._potentialTap$3 = false;
        if (!this.isPointerToolLocked) {
            this.resetPointerToolMode();
        }
    },
    
    _onLastTouch$3: function tab_PaneTableViewWeb$_onLastTouch$3(region, pseudoEvent) {
        if (!this._potentialTap$3 && !this.isPointerToolLocked) {
            this.resetPointerToolMode();
        }
    },
    
    _removeToolTipAndOverlays$3: function tab_PaneTableViewWeb$_removeToolTipAndOverlays$3(region) {
        this._lastVizHoverPoint$3 = null;
        this.get_vizToolTip().onPanOrDragStart();
        if (!region.isSelectingToolActive()) {
            this.disposeOfOverlayImages();
        }
    },
    
    _removeDocumentListeners$3: function tab_PaneTableViewWeb$_removeDocumentListeners$3() {
        var config = spiff.$create_EventHandleSpec();
        spiff.TableauEventHandler.removeHandler(config, 'dragMove');
        spiff.TableauEventHandler.removeHandler(config, 'dragEnd');
        this._dragHandler$3.update(config);
    },
    
    _hookUpDocumentDragListeners$3: function tab_PaneTableViewWeb$_hookUpDocumentDragListeners$3() {
        var config = spiff.$create_EventHandleSpec();
        spiff.TableauEventHandler.setHandler(config, 'dragMove', ss.Delegate.create(this, this._onDrag$3));
        spiff.TableauEventHandler.setHandler(config, 'dragEnd', ss.Delegate.create(this, this._onDragEnd$3));
        this._dragHandler$3.update(config);
    },
    
    _getWebRegion$3: function tab_PaneTableViewWeb$_getWebRegion$3(regionKey) {
        return Type.safeCast(this.regions[regionKey], tab.TiledViewerRegionWeb);
    },
    
    _clearVisualPartHoverTimeOut$3: function tab_PaneTableViewWeb$_clearVisualPartHoverTimeOut$3() {
        if (ss.isValue(this._visualPartHoverCommandTimeOut$3)) {
            window.clearTimeout(this._visualPartHoverCommandTimeOut$3);
            this._visualPartHoverCommandTimeOut$3 = null;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FZTOpsWeb

tab.FZTOpsWeb = function tab_FZTOpsWeb(tv) {
    this._tv = tv;
}
tab.FZTOpsWeb.prototype = {
    _tv: null,
    
    zoomHome: function tab_FZTOpsWeb$zoomHome() {
        this._tv.zoomHome();
    },
    
    zoomIn: function tab_FZTOpsWeb$zoomIn() {
        this._tv._zoomOnCenter(2);
    },
    
    zoomOut: function tab_FZTOpsWeb$zoomOut() {
        this._tv._zoomOnCenter(0.5);
    },
    
    setPointerToolMode: function tab_FZTOpsWeb$setPointerToolMode(pointerToolMode, isLocked) {
        this._tv.setPointerToolMode(pointerToolMode, isLocked);
    },
    
    setAppendMode: function tab_FZTOpsWeb$setAppendMode(isAppending) {
    },
    
    anyButtonTouched: function tab_FZTOpsWeb$anyButtonTouched() {
    },
    
    defaultPointerToolMode: function tab_FZTOpsWeb$defaultPointerToolMode() {
        return this._tv.defaultPointerToolMode();
    },
    
    isExistingSelection: function tab_FZTOpsWeb$isExistingSelection() {
        return this._tv.isExistingSelection();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.HoverApi

tab.HoverApi = function tab_HoverApi(tv) {
    this._tv = tv;
}
tab.HoverApi.prototype = {
    _tv: null,
    
    dispose: function tab_HoverApi$dispose() {
        this._tv = null;
    },
    
    unsuppressHover: function tab_HoverApi$unsuppressHover(region) {
        var mouseHandler = this._tv.get_inputHandlers()[region.get_regionPart()];
        if (ss.isValue(mouseHandler)) {
            mouseHandler.unsuppressHover();
        }
        var responsiveHandler = this._tv.get_responsiveMouseHandler();
        if (ss.isValue(responsiveHandler)) {
            responsiveHandler.unsuppressHover();
        }
    },
    
    suppressHover: function tab_HoverApi$suppressHover(region) {
        var mouseHandler = this._tv.get_inputHandlers()[region.get_regionPart()];
        if (ss.isValue(mouseHandler)) {
            mouseHandler.suppressHover();
        }
        var responsiveHandler = this._tv.get_responsiveMouseHandler();
        if (ss.isValue(responsiveHandler)) {
            responsiveHandler.suppressHover();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PaneTableTemplateWeb

tab.PaneTableTemplateWeb = function tab_PaneTableTemplateWeb() {
    tab.PaneTableTemplateWeb.initializeBase(this, [ $(tab.PaneTableTemplateWeb.htmlTemplate) ]);
    var g = ss.Delegate.create(this, this.getElementBySelector);
    this.scrollX = g('.tab-tvScrollX');
    this.scrollY = g('.tab-tvScrollY');
}
tab.PaneTableTemplateWeb.prototype = {
    scrollX: null,
    scrollY: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.AccordionViewWeb

tab.AccordionViewWeb = function tab_AccordionViewWeb(viewModel) {
    tab.AccordionViewWeb.initializeBase(this, [ viewModel, new tab.AccordionTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.ComboBoxViewWeb

tab.ComboBoxViewWeb = function tab_ComboBoxViewWeb(viewModel) {
    tab.ComboBoxViewWeb.initializeBase(this, [ viewModel, new tab.ComboBoxTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.CustomViewsPanelWeb

tab.CustomViewsPanelWeb = function tab_CustomViewsPanelWeb(viewModel, toolbarButton) {
    tab.CustomViewsPanelWeb.initializeBase(this, [ viewModel, toolbarButton ]);
    this.resizeHandle.addClass((this.viewModel.get_isTop()) ? 'tab-cv-resize-handle-se' : 'tab-cv-resize-handle-ne');
    this.resizeHandle.find('.tab-cv-resize-handle-icon').addClass((this.viewModel.get_isTop()) ? 'tab-icon-cv-resize-se' : 'tab-icon-cv-resize-ne');
}
tab.CustomViewsPanelWeb.prototype = {
    
    get_defaultPanelWidth: function tab_CustomViewsPanelWeb$get_defaultPanelWidth() {
        return 300;
    },
    
    get_defaultPanelHeight: function tab_CustomViewsPanelWeb$get_defaultPanelHeight() {
        return 380;
    },
    
    get_panelBorder: function tab_CustomViewsPanelWeb$get_panelBorder() {
        return 1;
    },
    
    show: function tab_CustomViewsPanelWeb$show() {
        tab.CustomViewsPanelWeb.callBaseMethod(this, 'show');
        this.rememberNameInput.focus();
    },
    
    updateRememberControls: function tab_CustomViewsPanelWeb$updateRememberControls() {
        tab.CustomViewsPanelWeb.callBaseMethod(this, 'updateRememberControls');
        this.rememberNameInput.select();
    },
    
    bindControls: function tab_CustomViewsPanelWeb$bindControls() {
        tab.CustomViewsPanelWeb.callBaseMethod(this, 'bindControls');
        this.resizeHandle.unbind('mousedown');
        this.resizeHandle.mousedown(ss.Delegate.create(this, this.startResize));
    },
    
    startDrag: function tab_CustomViewsPanelWeb$startDrag() {
        $(document).mousemove(ss.Delegate.create(this, this.continueResize));
        $(document).mouseup(ss.Delegate.create(this, this.endResize));
    },
    
    endDrag: function tab_CustomViewsPanelWeb$endDrag() {
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
    },
    
    appendSelectListItemNameAndAuthorHtml: function tab_CustomViewsPanelWeb$appendSelectListItemNameAndAuthorHtml(sb, customViewName, ownerName, isDefault) {
        sb.append('<span unselectable="on" class="tab-cv-select-list-item-name">').append(customViewName);
        if (isDefault) {
            sb.append(' (').append(tab.Strings.CustomViewsDefault).append(')');
        }
        if (ss.isValue(ownerName)) {
            sb.append(' <span unselectable="on" class="tab-cv-select-list-item-name-owner">(').append(ownerName).append(')</span>');
        }
        sb.append('</span>');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DojoWidgetsWeb

tab.DojoWidgetsWeb = function tab_DojoWidgetsWeb() {
}


////////////////////////////////////////////////////////////////////////////////
// tab.Drilling

tab.Drilling = function tab_Drilling(tiledViewer, domNode) {
    tab.Drilling.initializeBase(this, [ $(document.createElement('div')) ]);
    this._parentViewer$2 = tiledViewer;
    this._inputHandlers$2 = this._parentViewer$2.get_inputHandlers();
    this.get_element().addClass('tab-tiledViewerDrill');
    this._domLevelDrillDown$2 = $("<span class='tab-tvLevelDrillDown tab-levelDrillingIcon tvDrillDown' />").appendTo(this.get_element());
    this._levelDrillDownButton$2 = new spiff.Button(this._domLevelDrillDown$2);
    this._levelDrillDownButton$2.add_press(ss.Delegate.create(this, this._onLevelDrillDown$2));
    this._domLevelDrillUp$2 = $("<span class='tab-tvLevelDrillUp tab-levelDrillingIcon tvDrillUp' />").appendTo(this.get_element());
    this._levelDrillUpButton$2 = new spiff.Button(this._domLevelDrillUp$2);
    this._levelDrillUpButton$2.add_press(ss.Delegate.create(this, this._onLevelDrillUp$2));
    domNode.appendChild(this.get_element().get(0));
    this._setupDrilling$2(domNode);
    this.turnDrillWidgetsOff();
}
tab.Drilling.prototype = {
    _inputHandlers$2: null,
    _levelDrillDownButton$2: null,
    _levelDrillUpButton$2: null,
    _domLevelDrillDown$2: null,
    _domLevelDrillUp$2: null,
    _parentViewer$2: null,
    _drillInFlight$2: false,
    _drillWidgets$2: null,
    _domLevelDrillXYRect$2: null,
    _geometry$2: null,
    _visGeo$2: null,
    _updateDelegate$2: null,
    
    dispose: function tab_Drilling$dispose() {
        this._parentViewer$2 = null;
        this._levelDrillDownButton$2.dispose();
        this._levelDrillUpButton$2.dispose();
        tab.Drilling.callBaseMethod(this, 'dispose');
    },
    
    onUpdate: function tab_Drilling$onUpdate() {
        if (this._updateDelegate$2 != null) {
            this._updateDelegate$2();
            this._updateDelegate$2 = null;
        }
        this._drillInFlight$2 = false;
        this._geometry$2 = this._parentViewer$2.get_geometry();
        this._visGeo$2 = this._parentViewer$2.get_visibleGeometry();
    },
    
    isActiveInRect: function tab_Drilling$isActiveInRect(rect) {
        if ($(this._domLevelDrillDown$2.get(0)).css('display') !== 'none' || $(this._domLevelDrillUp$2.get(0)).css('display') !== 'none') {
            if (ss.isValue(this._domLevelDrillXYRect$2) && tab.RectXYUtil.intersectsWith(this._domLevelDrillXYRect$2, rect)) {
                return true;
            }
        }
        return false;
    },
    
    turnDrillWidgetsOff: function tab_Drilling$turnDrillWidgetsOff() {
        var handlersToModify = [ 'bottomaxis', 'xheader', 'yheader' ];
        var $enum1 = ss.IEnumerator.getEnumerator(handlersToModify);
        while ($enum1.moveNext()) {
            var vir = $enum1.current;
            if (ss.isValue(this._inputHandlers$2[vir])) {
                this._inputHandlers$2[vir].unsuppressHover();
            }
        }
        this.hideNode(this._domLevelDrillDown$2.get(0));
        this.hideNode(this._domLevelDrillUp$2.get(0));
        this._drillWidgets$2 = new tab._drillWidgets();
    },
    
    _setupDrilling$2: function tab_Drilling$_setupDrilling$2(domNode) {
        if (tsConfig.allow_filter) {
            $(domNode).mousemove(ss.Delegate.create(this, function(e) {
                this._drillOnTVMouseMove$2(e);
            }));
        }
    },
    
    _drillOnTVMouseMove$2: function tab_Drilling$_drillOnTVMouseMove$2(e) {
        var emptyObj = {};
        var inxheader = false;
        var inxnomaxis = false;
        var inyheader = false;
        var insameLevel = false;
        var intlSpacerAreaY = false;
        var intlSpacerAreaX = false;
        var inblSpacerArea = false;
        var needToExtendTLY = true;
        if (this._drillInFlight$2) {
            return;
        }
        if (e.button > 0) {
            return;
        }
        if (ss.isNullOrUndefined(this._geometry$2) || ss.isNullOrUndefined(this._geometry$2.di) || this._geometry$2.di === emptyObj || !tsConfig.allow_filter) {
            return;
        }
        var viewerPos = this._parentViewer$2.get_posTV();
        var mouse = tab.$create_Point(e.pageX - viewerPos.x, e.pageY - viewerPos.y);
        if (ss.isValue(this._visGeo$2.xheaderArea)) {
            inxheader = tab.RectUtil.inRect(this._visGeo$2.xheaderArea, mouse);
        }
        var tlspacerAreaX = this._parentViewer$2.get_tlspacerAreaX();
        var tlspacerAreaY = this._parentViewer$2.get_tlspacerAreaY();
        if (inxheader && ss.isValue(tlspacerAreaX) && ss.isValue(tlspacerAreaY) && ss.isValue(this._visGeo$2.uleftArea)) {
            tlspacerAreaY.w = tlspacerAreaX.l;
            needToExtendTLY = false;
        }
        if (ss.isValue(this._visGeo$2.bottomaxisArea) && !this._geometry$2.pi.hasXQAxis && !inxheader) {
            inxnomaxis = tab.RectUtil.inRect(this._visGeo$2.bottomaxisArea, mouse);
        }
        if (ss.isValue(this._visGeo$2.yheaderArea) && !inxheader && !inxnomaxis) {
            inyheader = tab.RectUtil.inRect(this._visGeo$2.yheaderArea, mouse);
        }
        if (ss.isValue(tlspacerAreaY) && !inxheader && !inxnomaxis && ss.isValue(this._visGeo$2.yheaderArea)) {
            intlSpacerAreaY = tab.RectUtil.inRect(tlspacerAreaY, mouse);
        }
        if (ss.isValue(tlspacerAreaX) && !intlSpacerAreaY && !inyheader && !inxnomaxis && ss.isValue(this._visGeo$2.xheaderArea)) {
            intlSpacerAreaX = tab.RectUtil.inRect(tlspacerAreaX, mouse);
        }
        var blspacerArea = this._parentViewer$2.get_blspacerArea();
        if (ss.isValue(blspacerArea) && !intlSpacerAreaY && !intlSpacerAreaX) {
            inblSpacerArea = tab.RectUtil.inRect(blspacerArea, mouse);
        }
        if (!inxheader && !inyheader && !inxnomaxis && !insameLevel && !intlSpacerAreaY && !intlSpacerAreaX && !inblSpacerArea) {
            this.turnDrillWidgetsOff();
        }
        else if (intlSpacerAreaX) {
            needToExtendTLY = false;
            if (this._drillWidgets$2._area === 'yheader') {
                this._drillWidgets$2._level = null;
            }
            this._updateDrillWidgetsX$2(e, mouse, insameLevel, intlSpacerAreaX);
        }
        else if (intlSpacerAreaY) {
            if (this._drillWidgets$2._area === 'xheader') {
                this._drillWidgets$2._level = null;
            }
            this._updateDrillWidgetsY$2(e, mouse, insameLevel, intlSpacerAreaY);
        }
        else if (inxheader || (insameLevel && this._drillWidgets$2._area === 'xheader')) {
            needToExtendTLY = false;
            this._updateDrillWidgetsX$2(e, mouse, insameLevel, inxheader);
        }
        else if (inyheader || (insameLevel && this._drillWidgets$2._area === 'yheader')) {
            this._updateDrillWidgetsY$2(e, mouse, insameLevel, inyheader);
        }
        else if (inxnomaxis || (insameLevel && this._drillWidgets$2._area === 'bottomaxis')) {
            this._updateDrillWidgetsBottomAxis$2(e, insameLevel);
        }
        else if (inblSpacerArea) {
            this._updateDrillWidgetsBottomAxis$2(e, insameLevel);
        }
        if (needToExtendTLY && ss.isValue(tlspacerAreaY) && ss.isValue(this._visGeo$2.uleftArea)) {
            tlspacerAreaY.w = this._visGeo$2.uleftArea.w;
        }
    },
    
    _onLevelDrillDown$2: function tab_Drilling$_onLevelDrillDown$2() {
        this._onDrill$2('down');
    },
    
    _onLevelDrillUp$2: function tab_Drilling$_onLevelDrillUp$2() {
        this._onDrill$2('up');
    },
    
    _onDrill$2: function tab_Drilling$_onDrill$2(direction) {
        this._drillInFlight$2 = true;
        var session = this._parentViewer$2.get_session();
        session.levelDrill(this._drillWidgets$2._levelnum, direction, this._drillWidgets$2._area);
        this.turnDrillWidgetsOff();
    },
    
    _updateDrillWidgetsX$2: function tab_Drilling$_updateDrillWidgetsX$2(e, tvpt, inlevel, inxheader) {
        var xs = this._geometry$2.di.xs + this._parentViewer$2.get_titleHeight();
        if (ss.isNullOrUndefined(this._drillWidgets$2._level) || !inlevel) {
            var px = this._calcTargetLevelInIntList$2(tvpt.y, xs, this._geometry$2.di.xy);
            if (px._levelNum >= 0 && px._levelNum < this._geometry$2.di.xy.length && inxheader) {
                this._updateLevelDrillWidgets$2('x', px, this._geometry$2.di.xy);
            }
            else {
                this.turnDrillWidgetsOff();
            }
        }
    },
    
    _updateDrillWidgetsY$2: function tab_Drilling$_updateDrillWidgetsY$2(e, tvpt, inlevel, inyheader) {
        if (ss.isNullOrUndefined(this._drillWidgets$2._level) || !inlevel) {
            var px = this._calcTargetLevelInIntList$2(tvpt.x, this._geometry$2.di.ys, this._geometry$2.di.yx);
            var levelNum = px._levelNum;
            if (levelNum >= 0 && levelNum < this._geometry$2.di.yx.length && inyheader) {
                this._updateLevelDrillWidgets$2('y', px, this._geometry$2.di.yx);
            }
        }
    },
    
    _updateDrillWidgetsBottomAxis$2: function tab_Drilling$_updateDrillWidgetsBottomAxis$2(e, inlevel) {
        var levelNum = this._geometry$2.di.xy.length - 1;
        if (!inlevel) {
            var margin = Math.min(this._visGeo$2.bottomaxisArea.l, 20);
            var rect = tab.$create_Rect(this._visGeo$2.bottomaxisArea.l - margin, this._visGeo$2.bottomaxisArea.t, this._visGeo$2.bottomaxisArea.w + margin, this._visGeo$2.bottomaxisArea.h);
            this._setDrillLevel$2(rect, this._geometry$2.di.xy[levelNum][1], 'x');
            this._drillWidgets$2._levelnum = levelNum;
            this._drillWidgets$2._area = 'bottomaxis';
        }
    },
    
    _updateLevelDrillWidgets$2: function tab_Drilling$_updateLevelDrillWidgets$2(axis, px, intLists) {
        var rect;
        var margin = 0;
        if (axis === 'x') {
            if (ss.isValue(this._visGeo$2.uleftArea)) {
                margin = Math.min(this._visGeo$2.xheaderArea.l, 20);
            }
            rect = tab.$create_Rect(this._visGeo$2.xheaderArea.l - margin, px._lowerPx, this._visGeo$2.xheaderArea.w + margin, px._upperPx - px._lowerPx);
        }
        else {
            if (ss.isValue(this._visGeo$2.uleftArea)) {
                margin = Math.min(this._visGeo$2.yheaderArea.t, 20);
            }
            rect = tab.$create_Rect(px._lowerPx, this._visGeo$2.yheaderArea.t - margin, px._upperPx - px._lowerPx, this._visGeo$2.yheaderArea.h + margin);
        }
        this._setDrillLevel$2(rect, intLists[px._levelNum][1], axis);
        this._drillWidgets$2._levelnum = px._levelNum;
        this._drillWidgets$2._area = axis + 'header';
    },
    
    _showLevelNode$2: function tab_Drilling$_showLevelNode$2(domNode, rect, dimension) {
        var tl = this.getWidgetPos('level', rect, dimension);
        var h = this._domLevelDrillDown$2.outerHeight();
        var w = this._domLevelDrillDown$2.outerWidth();
        this._domLevelDrillXYRect$2 = tab.$create_RectXY(tl.x, tl.y, w, h);
        if (this.isOtherActiveInRect(this._domLevelDrillXYRect$2)) {
            return;
        }
        this.showNodeAt(domNode, tl.y, tl.x);
    },
    
    _setDrillLevel$2: function tab_Drilling$_setDrillLevel$2(rect, state, dim) {
        this._drillWidgets$2._level = rect;
        switch (state) {
            case 0:
                this.hideNode(this._domLevelDrillDown$2.get(0));
                this.hideNode(this._domLevelDrillUp$2.get(0));
                break;
            case 1:
                this._showLevelNode$2(this._domLevelDrillDown$2.get(0), rect, dim);
                this.hideNode(this._domLevelDrillUp$2.get(0));
                break;
            case 2:
                this._showLevelNode$2(this._domLevelDrillUp$2.get(0), rect, dim);
                this.hideNode(this._domLevelDrillDown$2.get(0));
                break;
            case 3:
                break;
        }
    },
    
    _calcTargetLevelInIntList$2: function tab_Drilling$_calcTargetLevelInIntList$2(target, spannerWidth, pairlist) {
        var lowerPx = -1;
        var upperPx = spannerWidth - 1;
        var levelNum = -1;
        if (ss.isNullOrUndefined(pairlist)) {
            return new tab._pxLevel(-1, -1, -1);
        }
        while (upperPx < target && levelNum < pairlist.length - 1) {
            levelNum += 1;
            lowerPx = upperPx;
            upperPx += pairlist[levelNum][0];
        }
        if (upperPx < target) {
            return new tab._pxLevel(-1, -1, -1);
        }
        return new tab._pxLevel(lowerPx, upperPx, levelNum);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._drillWidgets

tab._drillWidgets = function tab__drillWidgets() {
}
tab._drillWidgets.prototype = {
    _area: null,
    _level: null,
    _levelnum: 0
}


////////////////////////////////////////////////////////////////////////////////
// tab._sortIndicatorState

tab._sortIndicatorState = function tab__sortIndicatorState(region, item, itemIdx, direction, status, isActive) {
    this._siRegion = region;
    this._siItem = item;
    this._siItemIdx = itemIdx;
    this._direction = direction;
    this._status = status;
    this._isActive = isActive;
}
tab._sortIndicatorState.prototype = {
    _siRegion: null,
    _siItem: null,
    _siItemIdx: 0,
    _direction: null,
    _status: null,
    _isActive: false
}


////////////////////////////////////////////////////////////////////////////////
// tab._pxLevel

tab._pxLevel = function tab__pxLevel(lowerPx, upperPx, levelNum) {
    this._lowerPx = lowerPx;
    this._upperPx = upperPx;
    this._levelNum = levelNum;
}
tab._pxLevel.prototype = {
    _lowerPx: 0,
    _upperPx: 0,
    _levelNum: 0
}


////////////////////////////////////////////////////////////////////////////////
// tab.FloatingZoomToolbarWeb

tab.FloatingZoomToolbarWeb = function tab_FloatingZoomToolbarWeb(containerDiv, zoomFuncs, useAllButtons, addMapsSearchOffset) {
    tab.FloatingZoomToolbarWeb.initializeBase(this, [ containerDiv, zoomFuncs, useAllButtons, addMapsSearchOffset ]);
    this.init();
}
tab.FloatingZoomToolbarWeb.prototype = {
    
    clickZoomHome: function tab_FloatingZoomToolbarWeb$clickZoomHome() {
        tab.FloatingZoomToolbarWeb.callBaseMethod(this, 'clickZoomHome');
        if (!this.isFullToolbar) {
            this.setActiveState(false);
        }
    },
    
    createButtons: function tab_FloatingZoomToolbarWeb$createButtons() {
        if (!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
            this.oldCreateButtons();
        }
        else {
            this.createButtonContainer();
            if (this.isFullToolbar) {
                this.zoomInBtn = this.addButton(this.buttonContainer, 'buttonZoomIn', tab.Strings.PanZoomSelectToolsZoomInTooltip);
                this.zoomOutBtn = this.addButton(this.buttonContainer, 'buttonZoomOut', tab.Strings.PanZoomSelectToolsZoomOutTooltip);
                this.zoomHomeBtn = this.addButton(this.buttonContainer, 'buttonZoomHome', tab.Strings.PanZoomSelectToolsZoomHomeTooltip);
                this.addSpacer();
                this.flyOutBtn = this.addButton(this.buttonContainer, 'buttonFlyOut', '');
                this.createButtonFlyOut();
                this._createFlyOutButtons$2();
            }
            else {
                this.zoomHomeBtn = this.addButton(this.buttonContainer, 'buttonZoomHome', tab.Strings.PanZoomSelectToolsZoomHomeTooltip);
            }
        }
        this.setupEventHandling();
    },
    
    _createFlyOutButtons$2: function tab_FloatingZoomToolbarWeb$_createFlyOutButtons$2() {
        var tooltip = this._createTooltip$2((tab.BrowserSupport.get_isMac()) ? tab.Strings.PanZoomSelectToolsZoomAreaTooltipMac : tab.Strings.PanZoomSelectToolsZoomAreaTooltip);
        this.zoomAreaBtn = this.addToggleButton(this.flyOutButtons, 'buttonZoomArea', tooltip);
        if (this.api.defaultPointerToolMode() !== 'rectSelect') {
            tooltip = this._createTooltip$2(tab.Strings.PanZoomSelectToolsRectangularSelectionTooltip);
            this.rectSelectBtn = this.addToggleButton(this.flyOutButtons, 'buttonRectSelect', tooltip);
        }
        else {
            tooltip = this._createTooltip$2(tab.Strings.PanZoomSelectToolsPanTooltip);
            this.panBtn = this.addToggleButton(this.flyOutButtons, 'buttonPan', tooltip);
        }
        tooltip = this._createTooltip$2(tab.Strings.PanZoomSelectToolsRadialSelectionTooltip);
        this.radialSelectBtn = this.addToggleButton(this.flyOutButtons, 'buttonRadialSelect', tooltip);
        tooltip = this._createTooltip$2(tab.Strings.PanZoomSelectToolsLassoSelectionTooltip);
        this.lassoSelectBtn = this.addToggleButton(this.flyOutButtons, 'buttonLassoSelect', tooltip);
    },
    
    _createTooltip$2: function tab_FloatingZoomToolbarWeb$_createTooltip$2(initial) {
        return initial + '\n' + tab.Strings.SelectionToolsLockTooltip;
    },
    
    setupEventHandling: function tab_FloatingZoomToolbarWeb$setupEventHandling() {
        tab.FloatingZoomToolbarWeb.callBaseMethod(this, 'setupEventHandling');
        if (this.isFullToolbar) {
            this.disposables.add(this.zoomInBtn.onClick(ss.Delegate.create(this, function() {
                this.api.zoomIn();
            })));
            this.disposables.add(this.zoomOutBtn.onClick(ss.Delegate.create(this, function() {
                this.api.zoomOut();
            })));
            this.disposables.add(this.zoomAreaBtn.onClick(ss.Delegate.create(this, function() {
                this.setToolMode('zoom', false);
            })));
            this.disposables.add(this.zoomAreaBtn.onShiftClick(ss.Delegate.create(this, function() {
                this.setToolMode('zoom', true);
            })));
            if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
                this.flyOutContainer.mouseout(ss.Delegate.create(this, function(e) {
                    this._flyOutMouseOut$2(e);
                }));
                this.flyOutBtn.get_element().mouseout(ss.Delegate.create(this, function(e) {
                    this._flyOutButtonMouseOut$2(e);
                }));
            }
            this.zoomHomeBtn.add_enter(ss.Delegate.create(this, this._onZoomHomeBtnHover$2));
            this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this.zoomHomeBtn.remove_enter(ss.Delegate.create(this, this._onZoomHomeBtnHover$2));
            })));
            if (this.flyOutBtn != null) {
                this.flyOutBtn.add_enter(ss.Delegate.create(this, this.showFlyout));
                this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                    this.flyOutBtn.remove_enter(ss.Delegate.create(this, this.showFlyout));
                })));
            }
        }
    },
    
    _onZoomHomeBtnHover$2: function tab_FloatingZoomToolbarWeb$_onZoomHomeBtnHover$2() {
        if (!this.canZoomHome) {
            this.zoomHomeBtn.get_element().removeClass(this.zoomHomeBtn.get_hoverClass());
        }
    },
    
    _flyOutMouseOut$2: function tab_FloatingZoomToolbarWeb$_flyOutMouseOut$2(e) {
        var pos = this.flyOutContainer.offset();
        if (pos.top >= e.pageY) {
            this.updateFlyOutVisibility(false);
            return;
        }
        var right = pos.left + this.flyOutContainer.width();
        var bottom = pos.top + this.flyOutContainer.height();
        if (e.pageX >= right || e.pageY >= bottom) {
            this.updateFlyOutVisibility(false);
        }
    },
    
    _flyOutButtonMouseOut$2: function tab_FloatingZoomToolbarWeb$_flyOutButtonMouseOut$2(e) {
        var pos = this.flyOutBtn.get_element().offset();
        if (pos.left >= e.pageX || pos.top >= e.pageY) {
            this.updateFlyOutVisibility(false);
            return;
        }
        var bottom = pos.top + this.flyOutBtn.get_element().height();
        if (e.pageY >= bottom) {
            this.updateFlyOutVisibility(false);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SortDrillBase

tab.SortDrillBase = function tab_SortDrillBase(node) {
    tab.SortDrillBase.initializeBase(this, [ node ]);
    this._index$1 = tab.SortDrillBase._instances$1.length;
    tab.SortDrillBase._instances$1.add(this);
}
tab.SortDrillBase.prototype = {
    _index$1: 0,
    
    dispose: function tab_SortDrillBase$dispose() {
        tab.SortDrillBase._instances$1.remove(this);
        this.get_element().remove();
        tab.SortDrillBase.callBaseMethod(this, 'dispose');
    },
    
    isOtherActiveInRect: function tab_SortDrillBase$isOtherActiveInRect(rect) {
        for (var i = 0; i < tab.SortDrillBase._instances$1.length; i++) {
            if (i !== this._index$1) {
                var inst = tab.SortDrillBase._instances$1[i];
                if (inst.isActiveInRect(rect)) {
                    return true;
                }
            }
        }
        return false;
    },
    
    isActiveInRect: function tab_SortDrillBase$isActiveInRect(rect) {
        return false;
    },
    
    getSIRegionFromName: function tab_SortDrillBase$getSIRegionFromName(parentViewer, areaName) {
        var i, len;
        var regionName = areaName.replaceAll('Area', '');
        var si = parentViewer.get_sortIndicators();
        var regions = si.sortIndicatorRegions;
        for (i = 0, len = regions.length; i < len; i++) {
            if (regions[i].sortRegion === regionName) {
                return regions[i];
            }
        }
        return null;
    },
    
    showNodeAt: function tab_SortDrillBase$showNodeAt(domNode, top, left) {
        $(domNode).css('top', top + 'px');
        $(domNode).css('left', left + 'px');
        $(domNode).css('display', '');
    },
    
    getWidgetPos: function tab_SortDrillBase$getWidgetPos(type, rect, dimension) {
        if (type === 'level') {
            if (dimension === 'y') {
                return tab.$create_Point(rect.l + (rect.w / 2) - 4, rect.t + 2);
            }
            else {
                return tab.$create_Point(rect.l + 2, rect.t + (rect.h / 2) - 4);
            }
        }
        else {
            return tab.$create_Point(rect.x + 2, rect.y + 2);
        }
    },
    
    hideNode: function tab_SortDrillBase$hideNode(domNode) {
        $(domNode).css('display', 'none');
    },
    
    regionHitTest: function tab_SortDrillBase$regionHitTest(regions, point) {
        var regionDict = regions;
        var $dict1 = regionDict;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            if (ss.isValue(entry.value) && tab.RectUtil.inRect(entry.value, point)) {
                return entry.key;
            }
        }
        return null;
    },
    
    clone: function tab_SortDrillBase$clone(src) {
        if (ss.isNullOrUndefined(src)) {
            return src;
        }
        return this.mixin({}, src);
    },
    
    mixin: function tab_SortDrillBase$mixin(src, other) {
        var otherDict = other;
        var $dict1 = otherDict;
        for (var $key2 in $dict1) {
            var entry = { key: $key2, value: $dict1[$key2] };
            var obj = src[entry.key];
            if (ss.isNullOrUndefined(obj) || obj !== otherDict[entry.key]) {
                src[entry.key] = otherDict[entry.key];
            }
        }
        return src;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TiledViewerModel

tab.TiledViewerModel = function tab_TiledViewerModel() {
}
tab.TiledViewerModel.prototype = {
    geometry: null,
    visibleGeometry: null,
    sortIndicators: null,
    posTVx: 0,
    posTVy: 0,
    dom: null,
    sheetid: null,
    layoutSession: null,
    session: null,
    inputHandlers: null,
    tlspacerAreaX: null,
    tlspacerAreaY: null,
    blspacerArea: null,
    regions: null,
    titleHeight: 0
}


////////////////////////////////////////////////////////////////////////////////
// tab.Sorting

tab.Sorting = function tab_Sorting(tiledViewer, domNode) {
    tab.Sorting.initializeBase(this, [ $(document.createElement('div')) ]);
    this._parentViewer$2 = tiledViewer;
    this.get_element().addClass('tab-tiledViewerSort');
    this._sortIndicatorButton$2 = spiff.LabelButton.newNativeButton();
    this._sortIndicatorButton$2.get_element().addClass('tab-tvSortIndicator');
    this._sortIndicatorButton$2.get_element().css('border', '0');
    this._sortIndicatorButton$2.get_element().css('position', 'absolute');
    this._sortIndicatorButton$2.get_element().css('padding', '0px');
    this.get_element().append(this._sortIndicatorButton$2.get_element());
    this._domSortIndicator$2 = this._sortIndicatorButton$2.get_element();
    domNode.appendChild(this.get_element().get(0));
    this._attachStaticEventHandlers$2();
    this._setupSortIndicators$2(domNode);
    this._domSortIndicator$2.css('display', 'none');
}
tab.Sorting.prototype = {
    _sortIndicatorButton$2: null,
    _domSortIndicator$2: null,
    _parentViewer$2: null,
    _sortIndicatorState$2: null,
    _domSortIndicatorXYRect$2: null,
    _sortIndicators$2: null,
    _visGeo$2: null,
    _updateDelegate$2: null,
    
    dispose: function tab_Sorting$dispose() {
        this._parentViewer$2 = null;
        this._sortIndicatorButton$2.get_element().remove();
        this._sortIndicatorButton$2.dispose();
        tab.Sorting.callBaseMethod(this, 'dispose');
    },
    
    onUpdate: function tab_Sorting$onUpdate() {
        if (this._updateDelegate$2 != null) {
            this._updateDelegate$2();
            this._updateDelegate$2 = null;
        }
        this._visGeo$2 = this._parentViewer$2.get_visibleGeometry();
        this._sortIndicators$2 = this._parentViewer$2.get_sortIndicators();
    },
    
    hideSortIndicator: function tab_Sorting$hideSortIndicator() {
        if (!this._isSortIndicatorVisible$2()) {
            return;
        }
        var regex = new RegExp('(sortInd\\w+)?', 'g');
        this._domSortIndicator$2.get(0).className = this._domSortIndicator$2.get(0).className.replace(regex, '');
        this._domSortIndicator$2.css('display', 'none');
        this._sortIndicatorState$2 = null;
    },
    
    isActiveInRect: function tab_Sorting$isActiveInRect(rect) {
        if (ss.isValue(this._sortIndicatorState$2) && this._sortIndicatorState$2._isActive && tab.RectXYUtil.intersectsWith(rect, this._domSortIndicatorXYRect$2)) {
            return true;
        }
        return false;
    },
    
    _setupSortIndicators$2: function tab_Sorting$_setupSortIndicators$2(domNode) {
        this._sortIndicators$2 = this._parentViewer$2.get_sortIndicators();
        if (ss.isValue(this._sortIndicators$2) && tsConfig.allow_filter) {
            $(domNode).mousemove(ss.Delegate.create(this, function(e) {
                this._indicateSortOnTVMouseMove$2(e);
            }));
        }
    },
    
    _attachStaticEventHandlers$2: function tab_Sorting$_attachStaticEventHandlers$2() {
        this._domSortIndicator$2.click(ss.Delegate.create(this, function(e) {
            this._onSortIndicatorClick$2(e);
        }));
        this._domSortIndicator$2.mouseover(ss.Delegate.create(this, function(e) {
            this._onSortIndicatorMouseOver$2(e);
        }));
        this._domSortIndicator$2.mouseout(ss.Delegate.create(this, function(e) {
            this._onSortIndicatorMouseOut$2(e);
        }));
    },
    
    _indicateSortOnTVMouseMove$2: function tab_Sorting$_indicateSortOnTVMouseMove$2(e) {
        if (e.button > 0) {
            return;
        }
        if (ss.isNullOrUndefined(this._sortIndicators$2) || !tsConfig.allow_filter) {
            return;
        }
        var viewerPos = this._parentViewer$2.get_posTV();
        var mouse = tab.$create_Point(e.pageX - viewerPos.x, e.pageY - viewerPos.y);
        var domScrollX = this._parentViewer$2.get_domWeb().scrollX.get(0);
        var domScrollY = this._parentViewer$2.get_domWeb().scrollY.get(0);
        var scrollAmount = tab.$create_Point(domScrollX.scrollLeft, domScrollY.scrollTop);
        var regionsDict = this._visGeo$2;
        var region = this.regionHitTest(this._visGeo$2, mouse);
        if (ss.isValue(region)) {
            this._possiblyShowSortIndicatorInRegion$2(this.getSIRegionFromName(this._parentViewer$2, region), regionsDict[region], mouse, scrollAmount);
        }
        else {
            this.hideSortIndicator();
        }
    },
    
    _updateSortIndicator$2: function tab_Sorting$_updateSortIndicator$2(siregion, siitemIdx, isActive) {
        var direction;
        var siitem = siregion.sortIndicatorItems[siitemIdx];
        var currState = this._sortIndicatorState$2;
        if (!siregion.isHorizontal) {
            direction = (siitem.sortOrder === 'asc') ? 'Left' : 'Right';
        }
        else {
            direction = (siitem.sortOrder === 'asc') ? 'Up' : 'Down';
        }
        var status = (siitem.isSorted) ? 'Solid' : 'Hollow';
        this._sortIndicatorState$2 = new tab._sortIndicatorState(siregion, siitem, siitemIdx, direction, status, isActive);
        if (ss.isNullOrUndefined(currState) || currState._direction !== direction || currState._status !== status || currState._isActive !== isActive) {
            this._updateSortIndicatorClass$2();
        }
    },
    
    _updateSortIndicatorClass$2: function tab_Sorting$_updateSortIndicatorClass$2() {
        if (ss.isNullOrUndefined(this._sortIndicatorState$2)) {
            return;
        }
        var newClass = 'sortInd' + this._sortIndicatorState$2._status + this._sortIndicatorState$2._direction + ((this._sortIndicatorState$2._isActive) ? 'Active' : '');
        var regex = new RegExp('(sortInd\\w+)?', 'g');
        this._domSortIndicator$2.get(0).className = this._domSortIndicator$2.get(0).className.replace(regex, '');
        this._domSortIndicator$2.addClass(newClass);
    },
    
    _toggleSortIndicatorState$2: function tab_Sorting$_toggleSortIndicatorState$2() {
        if (!this._isSortIndicatorVisible$2()) {
            return;
        }
        var siitem = this._sortIndicatorState$2._siItem;
        var siregion = this._sortIndicatorState$2._siRegion;
        if (!siitem.isSorted) {
            siitem.isSorted = true;
            siitem.sortOrder = siregion.defSortOrder;
        }
        else {
            if (siitem.sortOrder === siregion.defSortOrder) {
                siitem.sortOrder = (siregion.defSortOrder === 'asc') ? 'desc' : 'asc';
            }
            else {
                siitem.sortOrder = siregion.defSortOrder;
                siitem.isSorted = false;
            }
        }
        this._updateSortIndicator$2(siregion, this._sortIndicatorState$2._siItemIdx, this._sortIndicatorState$2._isActive);
    },
    
    _onSortIndicatorMouseOver$2: function tab_Sorting$_onSortIndicatorMouseOver$2(e) {
        if (this.isOtherActiveInRect(this._domSortIndicatorXYRect$2)) {
            return;
        }
        if (this._isSortIndicatorVisible$2() && !this._sortIndicatorState$2._isActive) {
            this._sortIndicatorState$2._isActive = true;
            this._updateSortIndicatorClass$2();
        }
        e.stopPropagation();
    },
    
    _onSortIndicatorMouseOut$2: function tab_Sorting$_onSortIndicatorMouseOut$2(e) {
        if (!this._isSortIndicatorVisible$2()) {
            return;
        }
        var pos = $(this._domSortIndicator$2.get(0)).offset();
        var height = $(this._domSortIndicator$2.get(0)).outerHeight();
        var width = $(this._domSortIndicator$2.get(0)).outerWidth();
        if (pos.left > e.pageX || (pos.left + width) <= e.pageX || pos.top > e.pageY || (pos.top + height) <= e.pageY) {
            this._sortIndicatorState$2._isActive = false;
            this._updateSortIndicatorClass$2();
            e.stopPropagation();
        }
    },
    
    _onSortIndicatorClick$2: function tab_Sorting$_onSortIndicatorClick$2(e) {
        e.stopPropagation();
        e.preventDefault();
        var viewerPos = this._parentViewer$2.get_posTV();
        var posTVx = viewerPos.x;
        var posTVy = viewerPos.y;
        var mouse = tab.$create_Point(e.pageX - posTVx, e.pageY - posTVy);
        var domScrollX = this._parentViewer$2.get_domWeb().scrollX.get(0);
        var domScrollY = this._parentViewer$2.get_domWeb().scrollY.get(0);
        var scrollAmount = tab.$create_Point(domScrollX.scrollLeft, domScrollY.scrollTop);
        var region = this.regionHitTest(this._visGeo$2, mouse);
        if (ss.isNullOrUndefined(region)) {
            return;
        }
        var siregion = this.getSIRegionFromName(this._parentViewer$2, region);
        var regionRect = siregion.regionRect;
        var regionsDict = this._visGeo$2;
        mouse.y += (regionRect.y - regionsDict[region].t);
        mouse.x += (regionRect.x - regionsDict[region].l);
        this._toggleSortIndicatorState$2();
        this._domSortIndicator$2.addClass('clicked');
        this._updateDelegate$2 = ss.Delegate.create(this, function() {
            this._domSortIndicator$2.removeClass('clicked');
        });
        tab.SortServerCommands.sortFromIndicator(mouse, scrollAmount, this._parentViewer$2.get_visualId());
    },
    
    _showSortIndicator$2: function tab_Sorting$_showSortIndicator$2(siregion, siitemIdx, xyrect, isActive) {
        if (this.isOtherActiveInRect(xyrect)) {
            return;
        }
        this._domSortIndicatorXYRect$2 = xyrect;
        this._updateSortIndicator$2(siregion, siitemIdx, isActive);
        this.showNodeAt(this._domSortIndicator$2.get(0), xyrect.y, xyrect.x);
    },
    
    _isSortIndicatorVisible$2: function tab_Sorting$_isSortIndicatorVisible$2() {
        return ss.isValue(this._sortIndicatorState$2);
    },
    
    _possiblyShowSortIndicatorInRegion$2: function tab_Sorting$_possiblyShowSortIndicatorInRegion$2(siregion, tvregionRect, mouse, scrollAmount) {
        if (ss.isNullOrUndefined(siregion)) {
            this.hideSortIndicator();
            return false;
        }
        if (ss.isValue(this._sortIndicatorState$2) && ss.isValue(this._sortIndicatorState$2._siRegion) && siregion.sortRegion !== this._sortIndicatorState$2._siRegion.sortRegion) {
            this.hideSortIndicator();
        }
        var pointInRegion = tab.$create_Point(mouse.x, mouse.y);
        var regionRect = siregion.regionRect;
        pointInRegion.y += (regionRect.y - tvregionRect.t);
        pointInRegion.x += (regionRect.x - tvregionRect.l);
        if (siregion.canScrollY) {
            pointInRegion.y += scrollAmount.y;
        }
        if (siregion.canScrollX) {
            pointInRegion.x += scrollAmount.x;
        }
        var items = siregion.sortIndicatorItems;
        for (var i = 0, len = items.length; i < len; i++) {
            if (ss.isNullOrUndefined(items[i].itemRect)) {
                continue;
            }
            if (ss.isNullOrUndefined(items[i].buttonRect)) {
                continue;
            }
            var itemRect = tab.RecordCast.rectPresModelAsRectXY(items[i].itemRect);
            if (tab.RectXYUtil.inRect(itemRect, pointInRegion)) {
                var buttonRect = tab.RecordCast.rectPresModelAsRectXY(items[i].buttonRect);
                var tvbuttonRect = this.clone(buttonRect);
                tvbuttonRect.y -= (pointInRegion.y - mouse.y);
                tvbuttonRect.x -= (pointInRegion.x - mouse.x);
                var tvbuttonTopLeft = tab.$create_Point(tvbuttonRect.x + 2, tvbuttonRect.y + 2);
                var tvbuttonBottomRight = tab.$create_Point(tvbuttonRect.x + tvbuttonRect.w - 2, tvbuttonRect.y + tvbuttonRect.h - 2);
                if (tab.RectUtil.inRect(tvregionRect, tvbuttonTopLeft) && tab.RectUtil.inRect(tvregionRect, tvbuttonBottomRight)) {
                    this._showSortIndicator$2(siregion, i, tvbuttonRect, tab.RectXYUtil.inRect(tvbuttonRect, pointInRegion));
                    return true;
                }
            }
        }
        return false;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TiledViewerRegionWeb

tab.TiledViewerRegionWeb = function tab_TiledViewerRegionWeb(regionPart, domNode, sess, hoverApi, scrollHNode, scrollVNode, allowPanZoom, sheetID, viewModel) {
    this._modeAfterDataWait$1 = new ss.Tuple(false, 'silent');
    tab.TiledViewerRegionWeb.initializeBase(this, [ regionPart, domNode, sess, allowPanZoom, sheetID, viewModel ]);
    this._hoverApi$1 = hoverApi;
    if (this.get_regionPart() === 'viz') {
        this.makeDomDrag();
        this.get_shapeSelector().createDomAndAppend(this.connectNode);
    }
    this._allowRegionSelect$1 = true;
    this.disposables.add(new tab.SubscriptionDisposable(dojo.subscribe('modifierKeysChanged', ss.Delegate.create(this, function(evt) {
        this.modifierKeysChanged(evt);
    }))));
    this.scroller = new tab.WebScroller(scrollHNode, scrollVNode);
}
tab.TiledViewerRegionWeb.prototype = {
    _allowRegionSelect$1: false,
    _scrollTimer$1: null,
    _hoverApi$1: null,
    _delegateDragStart$1: null,
    _onDragMouseMove$1: null,
    _onDragMouseUp$1: null,
    _delegateDragEnd$1: null,
    _dragTracking$1: false,
    _mouseOverMarkOrVisualPart$1: false,
    _isMultiSelectKeyDown$1: false,
    
    get__useExtendedCursors$1: function tab_TiledViewerRegionWeb$get__useExtendedCursors$1() {
        return this._isMultiSelectKeyDown$1;
    },
    
    get_isDragTracking: function tab_TiledViewerRegionWeb$get_isDragTracking() {
        return this._dragTracking$1;
    },
    
    destroy: function tab_TiledViewerRegionWeb$destroy() {
        this._hoverApi$1 = null;
        tab.TiledViewerRegionWeb.callBaseMethod(this, 'destroy');
    },
    
    setXPos: function tab_TiledViewerRegionWeb$setXPos(xPos) {
        if (this.regionContent != null) {
            this.regionContent.setXPos(xPos);
            this.backgroundMap.setScrollX(xPos);
        }
    },
    
    setYPos: function tab_TiledViewerRegionWeb$setYPos(yPos) {
        if (this.regionContent != null) {
            this.regionContent.setYPos(yPos);
            this.backgroundMap.setScrollY(yPos);
        }
    },
    
    reset: function tab_TiledViewerRegionWeb$reset() {
        this.resetIsWaitingOnData = false;
        if (this._modeAfterDataWait$1.first) {
            this._modeAfterDataWait$1.first = false;
            this.setMode(this._modeAfterDataWait$1.second);
        }
        if (this.resetIsWaitingOnTransition) {
            return;
        }
        tab.TiledViewerRegionWeb.callBaseMethod(this, 'reset');
        if (this.isScrolling) {
            this.wasScrolling = false;
            return;
        }
        if (!this._allowRegionSelect$1) {
            return;
        }
        if (this.allowPanZoom()) {
            this.connectNode.addClass('allowPanZoom');
        }
        this._hoverApi$1.unsuppressHover(this);
    },
    
    setMouseOverMarkOrVisualPart: function tab_TiledViewerRegionWeb$setMouseOverMarkOrVisualPart(over) {
        if (this._mouseOverMarkOrVisualPart$1 !== over) {
            this._mouseOverMarkOrVisualPart$1 = over;
            this._setCursorForPointerToolMode$1(this.get_currentPointerToolMode());
        }
    },
    
    _dragStart: function tab_TiledViewerRegionWeb$_dragStart(pseudoEvent, pane) {
        this._delegateDragStart$1(pseudoEvent, pane);
    },
    
    _selectDragStart: function tab_TiledViewerRegionWeb$_selectDragStart(pseudoEvent, pane) {
        this._startShowingMarquee(this.get_shapeSelector());
        this._startDragTracking$1(pseudoEvent);
    },
    
    _zoomDragStart: function tab_TiledViewerRegionWeb$_zoomDragStart(pseudoEvent, pane) {
        this._startShowingMarquee(this.domPanZoomRect);
        this._startDragTracking$1(pseudoEvent);
        this.domPanZoomRect.set_pi(pane);
    },
    
    _dragMove: function tab_TiledViewerRegionWeb$_dragMove(pseudoEvent) {
        if (this._dragTracking$1) {
            this._onDragMouseMove$1(pseudoEvent);
        }
    },
    
    _dragEnd: function tab_TiledViewerRegionWeb$_dragEnd(pseudoEvent, tooltipMode) {
        if (this._dragTracking$1) {
            this._onDragMouseUp$1(pseudoEvent, tooltipMode);
        }
    },
    
    _zoomFromClick: function tab_TiledViewerRegionWeb$_zoomFromClick(pseudoEvent, paneInfo) {
        var coords = this.toLocalCoordsEvent(pseudoEvent);
        var scale = (this._isZoomOutModKeys$1(pseudoEvent)) ? 0.5 : 2;
        this.zoomPoint(paneInfo, coords, scale, false, null);
    },
    
    _getCenterPointFromRectXY: function tab_TiledViewerRegionWeb$_getCenterPointFromRectXY(rect) {
        var x = Math.floor(rect.w / 2) + rect.x;
        var y = Math.floor(rect.h / 2) + rect.y;
        return tab.$create_Point(x, y);
    },
    
    _zoomOnCenter: function tab_TiledViewerRegionWeb$_zoomOnCenter(paneInfo, scale) {
        this.zoomPoint(paneInfo, this.getCenterPoint(paneInfo), scale, false, null);
    },
    
    _noop: function tab_TiledViewerRegionWeb$_noop() {
    },
    
    _stopShowingMarquee: function tab_TiledViewerRegionWeb$_stopShowingMarquee(selector) {
        if (ss.isValue(selector)) {
            selector.hide();
        }
    },
    
    _startShowingMarquee: function tab_TiledViewerRegionWeb$_startShowingMarquee(selector) {
        if (ss.isValue(selector)) {
            selector.show();
        }
    },
    
    setMode: function tab_TiledViewerRegionWeb$setMode(mode) {
        if (this.resetIsWaitingOnData) {
            this._modeAfterDataWait$1.first = true;
            this._modeAfterDataWait$1.second = mode;
            return;
        }
        tab.TiledViewerRegionWeb.callBaseMethod(this, 'setMode', [ mode ]);
        this._setClass(mode);
        switch (mode) {
            case 'silent':
                this._onDragMouseMove$1 = ss.Delegate.create(this, this._noop);
                this._onDragMouseUp$1 = ss.Delegate.create(this, this._noop);
                this._delegateDragStart$1 = ss.Delegate.create(this, this._noop);
                this._delegateDragEnd$1 = ss.Delegate.create(this, this._noop);
                break;
            case 'rectSelect':
            case 'lassoSelect':
            case 'radialSelect':
                this._onDragMouseMove$1 = ss.Delegate.create(this, this.onMarqueeMouseMove);
                this._onDragMouseUp$1 = ss.Delegate.create(this, this._onMarqueeMouseUp$1);
                this._delegateDragStart$1 = ss.Delegate.create(this, this._selectDragStart);
                this._delegateDragEnd$1 = ss.Delegate.create(this, this._selectDragEnd$1);
                break;
            case 'pan':
                if (!this.allowPanZoom()) {
                    this.setMode('rectSelect');
                    break;
                }
                this._onDragMouseMove$1 = ss.Delegate.create(this, this._onPanMouseMove$1);
                this._onDragMouseUp$1 = ss.Delegate.create(this, this._onPanMouseUp$1);
                this._delegateDragStart$1 = ss.Delegate.create(this, this._onPanStart$1);
                this._delegateDragEnd$1 = ss.Delegate.create(this, this._noop);
                break;
            case 'zoom':
                if (!this.allowPanZoom()) {
                    this.setMode('rectSelect');
                    break;
                }
                this._onDragMouseMove$1 = ss.Delegate.create(this, this.onZoomBoxMouseMove);
                this._onDragMouseUp$1 = ss.Delegate.create(this, this._onZoomBoxMouseUp$1);
                this._delegateDragStart$1 = ss.Delegate.create(this, this._zoomDragStart);
                this._delegateDragEnd$1 = ss.Delegate.create(this, this._zoomDragEnd$1);
                break;
        }
    },
    
    _isDefaultToolActive: function tab_TiledViewerRegionWeb$_isDefaultToolActive() {
        return this.get_currentPointerToolMode() === this.get_defaultPointerToolMode();
    },
    
    _setClass: function tab_TiledViewerRegionWeb$_setClass(mode) {
        if (ss.isNullOrUndefined(this.connectNode) || String.isNullOrEmpty(this.connectNode.attr('class'))) {
            return;
        }
        mode = (mode === 'silent') ? this.get_defaultPointerToolMode() : mode;
        var pointerToolModeStr = mode;
        var className = 'tvmode' + pointerToolModeStr.charAt(0).toString().toUpperCase() + pointerToolModeStr.substr(1);
        this.connectNode.attr('class', this.connectNode.attr('class').replace(new RegExp('tvmode\\S*'), className));
        this._setCursorForPointerToolMode$1(mode);
    },
    
    _isPanModKeys: function tab_TiledViewerRegionWeb$_isPanModKeys(pseudoEvent) {
        return pseudoEvent.shiftKey && !spiff.EventUtil.isCtrlKey(pseudoEvent);
    },
    
    _isZoomModKeys: function tab_TiledViewerRegionWeb$_isZoomModKeys(pseudoEvent) {
        return pseudoEvent.shiftKey && spiff.EventUtil.isCtrlKey(pseudoEvent);
    },
    
    _isZoomOutDoubleClickModKeys: function tab_TiledViewerRegionWeb$_isZoomOutDoubleClickModKeys(pseudoEvent) {
        return (pseudoEvent.shiftKey && !spiff.EventUtil.isCtrlKey(pseudoEvent)) || this._isZoomOutModKeys$1(pseudoEvent);
    },
    
    modifierKeysChanged: function tab_TiledViewerRegionWeb$modifierKeysChanged(pseudoEvent) {
        var oldMultiSelectKeyDown = this._isMultiSelectKeyDown$1;
        this._isMultiSelectKeyDown$1 = spiff.EventUtil.isCtrlKey(pseudoEvent);
        if (!this.allowPanZoom() || this._dragTracking$1) {
            if (this._dragTracking$1 && oldMultiSelectKeyDown !== this._isMultiSelectKeyDown$1) {
                this._setCursorForPointerToolMode$1(this.get_currentPointerToolMode());
            }
            return;
        }
        if (this._isPanModKeys(pseudoEvent)) {
            if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
                this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['PanDrag']);
            }
            else {
                this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['Pan']);
            }
        }
        else if (this._isZoomOutModKeys$1(pseudoEvent)) {
            this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['ZoomOut']);
        }
        else if (this._isZoomModKeys(pseudoEvent)) {
            this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['ZoomIn']);
        }
        else {
            this._setCursorForPointerToolMode$1(this.get_currentPointerToolMode());
        }
    },
    
    startScrolling: function tab_TiledViewerRegionWeb$startScrolling(scrollX, scrollY, scrollSpeed) {
        this.stopScrolling();
        if (!((!!scrollX && this.scroller.get_canScrollX()) || (!!scrollY && this.scroller.get_canScrollY()))) {
            return;
        }
        if (!ss.isValue(this._scrollTimer$1)) {
            this._handleScrollInterval$1(scrollX, scrollY, scrollSpeed);
        }
        var scrollInterval = (scrollSpeed === 'fast') ? 15 : 200;
        tab.Log.get(this).debug('scrolling with interval ' + scrollInterval);
        this._scrollTimer$1 = window.setInterval(ss.Delegate.create(this, function() {
            this._handleScrollInterval$1(scrollX, scrollY, scrollSpeed);
        }), scrollInterval);
        this.isScrolling = true;
    },
    
    stopScrolling: function tab_TiledViewerRegionWeb$stopScrolling() {
        if (ss.isValue(this._scrollTimer$1)) {
            window.clearInterval(this._scrollTimer$1);
        }
        this._scrollTimer$1 = null;
        this.wasScrolling = this.isScrolling;
        this.isScrolling = false;
    },
    
    _handleScrollInterval$1: function tab_TiledViewerRegionWeb$_handleScrollInterval$1(scrollXDir, scrollYDir, scrollSpeed) {
        var scrollAmountX = 0;
        var scrollAmountY = 0;
        if (!!scrollXDir) {
            scrollAmountX = this._computeAxisScrollAmount$1(0, scrollXDir);
            this.scroller.scrollX(scrollAmountX);
        }
        if (!!scrollYDir) {
            scrollAmountY = this._computeAxisScrollAmount$1(1, scrollYDir);
            this.scroller.scrollY(scrollAmountY);
        }
        this.get_shapeSelector().shapeScrolled(scrollAmountX, scrollAmountY);
        this.get_shapeSelector().get_dom().css('display', '');
        if ((!scrollAmountX && !!scrollXDir) || (!scrollAmountY && !!scrollYDir)) {
            var scrollXDirNew = (!scrollAmountX) ? 0 : scrollXDir;
            var scrollYDirNew = (!scrollAmountY) ? 0 : scrollYDir;
            this.startScrolling(scrollXDirNew, scrollYDirNew, scrollSpeed);
        }
    },
    
    _computeAxisScrollAmount$1: function tab_TiledViewerRegionWeb$_computeAxisScrollAmount$1(scrollAxis, scrollDirection) {
        var scrollCurrent = (!scrollAxis) ? this.scroller.get_scrollPos().x : this.scroller.get_scrollPos().y;
        var scrollMax = (!scrollAxis) ? this.scroller.get_maxScroll().x : this.scroller.get_maxScroll().y;
        var scrollAmount = scrollDirection * 15;
        var scrollNew = Math.max(0, Math.min(scrollCurrent + scrollAmount, scrollMax));
        return scrollNew - scrollCurrent;
    },
    
    determineScrollDirection: function tab_TiledViewerRegionWeb$determineScrollDirection(scrollAxis, outsideViz) {
        var scrollCurrent = (!scrollAxis) ? this.scroller.get_scrollPos().x : this.scroller.get_scrollPos().y;
        var scrollMax = (!scrollAxis) ? this.scroller.get_maxScroll().x : this.scroller.get_maxScroll().y;
        var scrollDir = (outsideViz < 0) ? -1 : ((outsideViz > 0) ? 1 : 0);
        if ((scrollDir === -1 && !scrollCurrent) || (scrollDir === 1 && scrollCurrent >= scrollMax)) {
            scrollDir = 0;
        }
        return scrollDir;
    },
    
    suppressTooltips: function tab_TiledViewerRegionWeb$suppressTooltips() {
        this._hoverApi$1.suppressHover(this);
    },
    
    _setCursorForPointerToolMode$1: function tab_TiledViewerRegionWeb$_setCursorForPointerToolMode$1(mode) {
        switch (mode) {
            case 'pan':
                if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
                    if (this.isToolDefault(mode)) {
                        this._adjustCursorForDefault$1('PanDrag', 'Default');
                    }
                    else {
                        this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['PanDrag']);
                    }
                }
                else {
                    this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['Pan']);
                }
                break;
            case 'zoom':
                this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['ZoomIn']);
                break;
            case 'lassoSelect':
                this.connectNode.css('cursor', (this.get__useExtendedCursors$1()) ? tab.TiledViewerRegionWeb._cursors$1['LassoExtended'] : tab.TiledViewerRegionWeb._cursors$1['LassoSelect']);
                break;
            case 'radialSelect':
                this.connectNode.css('cursor', (this.get__useExtendedCursors$1()) ? tab.TiledViewerRegionWeb._cursors$1['RadialExtended'] : tab.TiledViewerRegionWeb._cursors$1['RadialSelect']);
                break;
            case 'rectSelect':
                if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
                    var cursorKey = (this.get__useExtendedCursors$1()) ? 'RectExtended' : 'RectSelect';
                    if (this.isToolDefault(mode)) {
                        this._adjustCursorForDefault$1(cursorKey, 'Default');
                    }
                    else {
                        this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1[cursorKey]);
                    }
                }
                else {
                    this._adjustCursorForDefault$1('DragSelect', 'Default');
                }
                break;
            default:
                this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['Default']);
                break;
        }
    },
    
    _adjustCursorForDefault$1: function tab_TiledViewerRegionWeb$_adjustCursorForDefault$1(activeCursorId, defaultCursorId) {
        if (this._dragTracking$1) {
            this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1[activeCursorId]);
        }
        else if (this._mouseOverMarkOrVisualPart$1) {
            this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['Select']);
        }
        else {
            this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1[defaultCursorId]);
        }
    },
    
    _startDragTracking$1: function tab_TiledViewerRegionWeb$_startDragTracking$1(pseudoEvent) {
        if (pseudoEvent.originalEvent.button > 1) {
            return;
        }
        if (this._dragTracking$1) {
            return;
        }
        this._dragTracking$1 = true;
        tab.Log.get(this).debug('Start drag tracking...');
        dojo.publish('close-menus-all');
        pseudoEvent.preventDefault();
        this.connectNode.parent().addClass('tableauDrag');
        this._hoverApi$1.suppressHover(this);
        var info = pseudoEvent.get_gestureInfo();
        this.domPanZoomRect.set_pi(null);
        this.domPanZoomRect.dragStarted(info.startX, info.startY, tab.RecordCast.dojoCoordsAsRectXY(this.getLocalOffset(true)));
        this.get_shapeSelector().dragStarted(info.startX, info.startY, tab.RecordCast.dojoCoordsAsRectXY(this.getLocalOffset(true)));
        if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.responsiveUi)) {
            this._setCursorForPointerToolMode$1(this.get_currentPointerToolMode());
        }
    },
    
    _stopDragTracking$1: function tab_TiledViewerRegionWeb$_stopDragTracking$1(e, selector) {
        if (!this._dragTracking$1) {
            return;
        }
        this._dragTracking$1 = false;
        this.connectNode.parent().removeClass('tableauDrag');
        this._stopShowingMarquee(selector);
        this.stopScrolling();
        if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.responsiveUi)) {
            this._setCursorForPointerToolMode$1(this.get_currentPointerToolMode());
        }
    },
    
    _onZoomBoxMouseUp$1: function tab_TiledViewerRegionWeb$_onZoomBoxMouseUp$1(e, tooltipMode) {
        this._onSelectorMouseUp$1(e, tooltipMode, this.domPanZoomRect);
    },
    
    _onMarqueeMouseUp$1: function tab_TiledViewerRegionWeb$_onMarqueeMouseUp$1(e, tooltipMode) {
        this._onSelectorMouseUp$1(e, tooltipMode, this.get_shapeSelector());
    },
    
    _onSelectorMouseUp$1: function tab_TiledViewerRegionWeb$_onSelectorMouseUp$1(e, tooltipMode, selector) {
        if (!this._dragTracking$1) {
            return;
        }
        var original = e.originalEvent;
        if (original.button > 1) {
            return;
        }
        this._stopDragTracking$1(e, selector);
        this.debugWindowLog(function() {
            return '';
        });
        this._hoverApi$1.suppressHover(this);
        this._delegateDragEnd$1(e, tooltipMode);
        tab.Log.get(this).debug('handled mouse up');
    },
    
    _onPanMouseMove$1: function tab_TiledViewerRegionWeb$_onPanMouseMove$1(pseudoEvent) {
        pseudoEvent.preventDefault();
        pseudoEvent.stopPropagation();
        var info = pseudoEvent.get_gestureInfo();
        var offsetLeft = info.pageX - this.domPanZoomRect.get_dragStart().x;
        var offsetTop = info.pageY - this.domPanZoomRect.get_dragStart().y;
        if (ss.isNullOrUndefined(this.domPanZoomRect.get_pi()) || !this.domPanZoomRect.get_pi().canDragH) {
            offsetLeft = 0;
        }
        if (ss.isNullOrUndefined(this.domPanZoomRect.get_pi()) || !this.domPanZoomRect.get_pi().canDragV) {
            offsetTop = 0;
        }
        var AdditionalOffset = tab.TiledViewerRegion.paneBorderMaskSize - tab.TiledViewerRegion.canvasBorderPixels;
        offsetLeft += AdditionalOffset;
        offsetTop += AdditionalOffset;
        if (!tab.FeatureParamsLookup.getBool(tab.FeatureParam.newSelectionTools)) {
            this.connectNode.css('cursor', tab.TiledViewerRegionWeb._cursors$1['Panning']);
        }
        tab.DomUtil.setMarginBoxJQ(this.domDragImage, tab.$create_Rect(offsetLeft, offsetTop, this.domDragImage.width(), this.domDragImage.height()));
        this.backgroundMap.panTo(info.deltaX, info.deltaY);
        this.debugWindowLog(ss.Delegate.create(this, function() {
            var actual = tab.DomUtil.getDojoCoordsJQ(this.domDragImage);
            var t = 'Origin=(' + this.domPanZoomRect.get_dragStart().x + ',' + this.domPanZoomRect.get_dragStart().y + ')<br>';
            t += 'Event=(' + info.pageX + ',' + info.pageY + ')<br>';
            t += 'Offset=(' + offsetLeft + ',' + offsetTop + '}<br>';
            t += 'Actual=(' + actual.x + ',' + actual.y + ',' + (actual.x + actual.w) + ',' + (actual.y + actual.h) + ')<br>';
            return t;
        }));
    },
    
    _onPanMouseUp$1: function tab_TiledViewerRegionWeb$_onPanMouseUp$1(pseudoEvent, tooltipMode) {
        if (!this._dragTracking$1) {
            return;
        }
        if (pseudoEvent.originalEvent.button > 1) {
            return;
        }
        pseudoEvent.preventDefault();
        pseudoEvent.stopPropagation();
        this._stopDragTracking$1(pseudoEvent, null);
        this.debugWindowLog(function() {
            return '';
        });
        var info = pseudoEvent.get_gestureInfo();
        this._hoverApi$1.suppressHover(this);
        var origin = this.toLocalCoords(this.domPanZoomRect.get_dragStart());
        var delta = tab.$create_Point(info.pageX - this.domPanZoomRect.get_dragStart().x, info.pageY - this.domPanZoomRect.get_dragStart().y);
        if (ss.isNullOrUndefined(this.domPanZoomRect.get_pi()) || !this.domPanZoomRect.get_pi().canDragH) {
            delta.x = 0;
        }
        if (ss.isNullOrUndefined(this.domPanZoomRect.get_pi()) || !this.domPanZoomRect.get_pi().canDragV) {
            delta.y = 0;
        }
        this._panDragEnd$1(pseudoEvent, origin, delta);
        tab.Log.get(this).debug('handled mouse up');
    },
    
    _panDragEnd$1: function tab_TiledViewerRegionWeb$_panDragEnd$1(pseudoEvent, origin, delta) {
        this.waitingOnPanZoomServerResponse = 'waitingOnServer';
        this.resetIsWaitingOnTransition = false;
        var reset = ss.Delegate.create(this, function() {
            this.reset();
        });
        this.viewSession.pan(this.get_regionPart(), origin, delta, reset);
    },
    
    _onPanStart$1: function tab_TiledViewerRegionWeb$_onPanStart$1(pseudoEvent, paneInfo) {
        if (this.waitingOnPanZoomServerResponse !== 'normal') {
            return;
        }
        this._startDragTracking$1(pseudoEvent);
        this.domPanZoomRect.set_pi(paneInfo);
        tab.Log.get(this).debug('_onPanStart canDragH: ' + paneInfo.canDragH + ' canDragV: ' + paneInfo.canDragV);
        this.resetIsWaitingOnTransition = true;
        this.resetIsWaitingOnData = true;
        this.showDomDragImage(paneInfo);
    },
    
    _selectDragEnd$1: function tab_TiledViewerRegionWeb$_selectDragEnd$1(normalizedEvent, tooltipMode) {
        var tooltipAnchor = this.get_shapeSelector().get_tooltipAnchor();
        var vizRegion = this.get_regionPart();
        var pageTooltipAnchor = tab.PointUtil.add(tooltipAnchor, tab.RecordCast.dojoCoordsAsPoint(this.getLocalOffset()));
        var tooltipCallback = ss.Delegate.create(this, function() {
            tooltipMode.multiSelectComplete(pageTooltipAnchor, this.get_shapeSelector().get_hitTestingBox(), vizRegion);
            this._hoverApi$1.unsuppressHover(this);
        });
        var action = tab.ResolveSelectAction.fromNormalizedEvent(normalizedEvent, true);
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            var interactedIds = this.doSelectMarkAndUbertipFromSelectionShape(action, tooltipCallback);
            if (tab.MiscUtil.isNullOrEmpty(interactedIds) || !tsConfig.allow_tooltip) {
                this._hoverApi$1.unsuppressHover(this);
            }
        }
        else {
            this.get_shapeSelector().sendSelectionCommand(vizRegion, action, this.paneTableViewModel.get_visualId(), tooltipCallback);
            if (!tsConfig.allow_select) {
                this._hoverApi$1.unsuppressHover(this);
            }
        }
    },
    
    _zoomDragEnd$1: function tab_TiledViewerRegionWeb$_zoomDragEnd$1(pseudoEvent, tooltipMode) {
        var dragRegionCoords = tab.DomUtil.getDojoCoordsJQ(this.domPanZoomRect.get_dom());
        var dragRegionRect = tab.RecordCast.dojoCoordsAsRectXY(dragRegionCoords);
        var rect = this.toLocalCoordsRect(dragRegionRect);
        this.waitingOnPanZoomServerResponse = 'waitingOnServer';
        var pane = this.domPanZoomRect.get_pi();
        if (rect.w < 4 && rect.h < 4) {
            this._zoomFromClick(pseudoEvent, pane);
        }
        var paneCenter = this.getCenterPoint(pane);
        if (this._isZoomOutModKeys$1(pseudoEvent)) {
            this._zoomOnCenter(pane, 0.5);
            return;
        }
        else {
            this.backgroundMap.zoomRect(rect);
            this.viewSession.zoomIn(this.get_regionPart(), rect, paneCenter);
        }
        var zoomPoint = this._getCenterPointFromRectXY(rect);
        var scaleX = (this._isZoomOutModKeys$1(pseudoEvent)) ? rect.w / pane.w : pane.w / rect.w;
        var scaleY = (this._isZoomOutModKeys$1(pseudoEvent)) ? rect.h / pane.h : pane.h / rect.h;
        if (pane.canDragH && pane.canDragV) {
            var scale = Math.min(scaleX, scaleY);
            var mapData = this.paneTableViewModel.get_mapServerModel();
            if (mapData.get_hasPresModel()) {
                scale = tab.ZoomComputer.resolveDesiredScale(mapData.get_mapServerPresModel(), scale);
            }
            scaleX = scaleY = scale;
        }
        else if (!pane.canDragV) {
            scaleY = 1;
            zoomPoint.y = paneCenter.y;
        }
        else if (!pane.canDragH) {
            scaleX = 1;
            zoomPoint.x = paneCenter.x;
        }
        else {
            return;
        }
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode() || this.paneTableViewModel.get_visualModel().get_cacheUrlInfo().useUrl) {
            this.animateZoomOnPoint(pane, zoomPoint, scaleX, scaleY);
        }
    },
    
    _isZoomOutModKeys$1: function tab_TiledViewerRegionWeb$_isZoomOutModKeys$1(pseudoEvent) {
        return (this.get_currentPointerToolMode() === 'zoom' && pseudoEvent.altKey) || (pseudoEvent.shiftKey && spiff.EventUtil.isCtrlKey(pseudoEvent) && pseudoEvent.altKey);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ViewingToolbarWeb

tab.ViewingToolbarWeb = function tab_ViewingToolbarWeb(app, isTop) {
    tab.ViewingToolbarWeb.initializeBase(this, [ app, isTop ]);
}
tab.ViewingToolbarWeb.prototype = {
    
    makeCustomViewsPanel: function tab_ViewingToolbarWeb$makeCustomViewsPanel(viewModel, toolbarButton) {
        return new tab.CustomViewsPanelWeb(viewModel, toolbarButton);
    },
    
    makeMenuView: function tab_ViewingToolbarWeb$makeMenuView(viewModel) {
        return new spiff.MenuViewWeb(viewModel);
    },
    
    makeShareButtons: function tab_ViewingToolbarWeb$makeShareButtons() {
        var buttons = [];
        var shareButton = new tab.ToolbarTextButton(ss.Delegate.create(this, this.shareButtonClicked));
        shareButton.setLeftIcon('tab-icon-share').setText(tab.Strings.ToolbarShare);
        shareButton.get_element().addClass('wcShareButton');
        if (tsConfig.isPublic) {
            shareButton.get_element().addClass('tab-toolbar-share-text-button-public');
        }
        buttons.add(shareButton);
        if (tsConfig.isPublic) {
            var facebookButton = new tab.ToolbarIconButton(ss.Delegate.create(this, this.facebookButtonClicked));
            facebookButton.setIcon('tab-icon-facebook');
            facebookButton.get_element().addClass('tab-icon-public');
            buttons.add(facebookButton);
            var twitterButton = new tab.ToolbarIconButton(ss.Delegate.create(this, this.twitterButtonClicked));
            twitterButton.setIcon('tab-icon-twitter');
            twitterButton.get_element().addClass('tab-icon-public');
            buttons.add(twitterButton);
            var mailButton = new tab.ToolbarIconButton(ss.Delegate.create(this, this.mailButtonClicked));
            mailButton.setIcon('tab-icon-mail');
            mailButton.get_element().addClass('tab-icon-public');
            buttons.add(mailButton);
            var linkButton = new tab.ToolbarIconButton(ss.Delegate.create(this, this.linkButtonClicked));
            linkButton.setIcon('tab-icon-link');
            linkButton.get_element().addClass('wcShareButton');
            linkButton.get_element().addClass('tab-icon-public');
            buttons.add(linkButton);
        }
        buttons.forEach(ss.Delegate.create(this.disposables, this.disposables.add));
        return buttons;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.WebScroller

tab.WebScroller = function tab_WebScroller(domHNodeToScroll, domVNodeToScroll) {
    this._scrollHNode = domHNodeToScroll.get(0);
    this._scrollVNode = domVNodeToScroll.get(0);
}
tab.WebScroller.prototype = {
    _scrollHNode: null,
    _scrollVNode: null,
    
    get_canScrollX: function tab_WebScroller$get_canScrollX() {
        return this.get_maxScroll().x > 0;
    },
    
    get_canScrollY: function tab_WebScroller$get_canScrollY() {
        return this.get_maxScroll().y > 0;
    },
    
    get_scrollPos: function tab_WebScroller$get_scrollPos() {
        var x = (ss.isNullOrUndefined(this._scrollHNode)) ? 0 : $(this._scrollHNode).scrollLeft();
        var y = (ss.isNullOrUndefined(this._scrollVNode)) ? 0 : $(this._scrollVNode).scrollTop();
        return tab.$create_Point(x, y);
    },
    
    get_maxScroll: function tab_WebScroller$get_maxScroll() {
        return tab.$create_Point((ss.isNullOrUndefined(this._scrollHNode)) ? 0 : (this._scrollHNode.scrollWidth - this._scrollHNode.offsetWidth), (ss.isNullOrUndefined(this._scrollVNode)) ? 0 : (this._scrollVNode.scrollHeight - this._scrollVNode.offsetHeight));
    },
    
    get_visibleArea: function tab_WebScroller$get_visibleArea() {
        return tab.$create_Size((ss.isNullOrUndefined(this._scrollHNode)) ? 0 : this._scrollHNode.offsetWidth, (ss.isNullOrUndefined(this._scrollVNode)) ? 0 : this._scrollVNode.offsetHeight);
    },
    
    scrollX: function tab_WebScroller$scrollX(amount) {
        if (this.get_canScrollX()) {
            this._scrollHNode.scrollLeft += amount;
        }
    },
    
    scrollY: function tab_WebScroller$scrollY(amount) {
        if (this.get_canScrollY()) {
            this._scrollVNode.scrollTop += amount;
        }
    },
    
    refresh: function tab_WebScroller$refresh() {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyTooltipBehavior

tab.LegacyTooltipBehavior = function tab_LegacyTooltipBehavior(tooltip) {
    this._disposables = new tab.DisposableHolder();
    tab.Param.verifyValue(tooltip, 'tooltip');
    this._tooltip = tooltip;
    this._timeoutHandles = [];
    this._uniqueMouseEventType = tab.LegacyTooltipBehavior._getNewUniqueMouseMoveEventType();
}
tab.LegacyTooltipBehavior._getNewUniqueMouseMoveEventType = function tab_LegacyTooltipBehavior$_getNewUniqueMouseMoveEventType() {
    tab.LegacyTooltipBehavior._uniqueEventTypeCounter++;
    return 'mousemove.LegacyTooltipBehavior' + tab.LegacyTooltipBehavior._uniqueEventTypeCounter.toString();
}
tab.LegacyTooltipBehavior.prototype = {
    _tooltip: null,
    _timeoutHandles: null,
    _uniqueMouseEventType: null,
    _timeoutInitialShown: 10000,
    _timeoutMove: 10000,
    _timeoutLeaveTooltip: 200,
    _closeTimeoutHandle: null,
    _mouseStopTimeoutHandle: null,
    _movedSinceShow: false,
    _timeTooltipShown: null,
    _isFrozen: false,
    
    get_timeoutInitialShown: function tab_LegacyTooltipBehavior$get_timeoutInitialShown() {
        return this._timeoutInitialShown;
    },
    
    get_timeoutMove: function tab_LegacyTooltipBehavior$get_timeoutMove() {
        return this._timeoutMove;
    },
    
    get_timeoutLeaveTooltip: function tab_LegacyTooltipBehavior$get_timeoutLeaveTooltip() {
        return this._timeoutLeaveTooltip;
    },
    
    attach: function tab_LegacyTooltipBehavior$attach() {
        this._tooltip.add_showed(ss.Delegate.create(this, this._onShowed));
        this._tooltip.add_closed(ss.Delegate.create(this, this._onClose));
        this._tooltip.add_disposed(ss.Delegate.create(this, this._tooltipDisposed));
        var config = spiff.$create_EventHandleSpec();
        spiff.TableauEventHandler.setHandler(config, 'hover', ss.Delegate.create(this, this._onTooltipHover));
        spiff.TableauEventHandler.setHandler(config, 'mouseleave', ss.Delegate.create(this, this._onMouseLeaveToolip));
        spiff.TableauEventHandler.setHandler(config, 'potentialTap', ss.Delegate.create(this, this._onPotentialTooltipTap));
        this._disposables.add(new spiff.TableauEventHandler(this._tooltip.get_element()[0], config));
        $(window.document.documentElement).bind(this._uniqueMouseEventType, ss.Delegate.create(this, this._onMouseMove));
        tab.Log.get(this).debug('TooltipBehavior created for tooltip with instance id: %d / unique mouse event type: %s', this._tooltip.get_instanceId(), this._uniqueMouseEventType);
    },
    
    detach: function tab_LegacyTooltipBehavior$detach() {
        this._cancelTimeouts();
        this._disposables.dispose();
        if (ss.isValue(this._tooltip)) {
            this._tooltip.remove_showed(ss.Delegate.create(this, this._onShowed));
            this._tooltip.remove_closed(ss.Delegate.create(this, this._onClose));
            this._tooltip.remove_disposed(ss.Delegate.create(this, this._tooltipDisposed));
        }
        this._removeMoveHandler();
    },
    
    dispose: function tab_LegacyTooltipBehavior$dispose() {
        this.detach();
    },
    
    shownTooltipIsStatic: function tab_LegacyTooltipBehavior$shownTooltipIsStatic() {
        return true;
    },
    
    isHoverAllowed: function tab_LegacyTooltipBehavior$isHoverAllowed(pageCoords) {
        return !(this._tooltip.get_isShown() && this.isInSafeZone(pageCoords));
    },
    
    shouldShowCommandButtons: function tab_LegacyTooltipBehavior$shouldShowCommandButtons() {
        return true;
    },
    
    handleUbertipMenuToggle: function tab_LegacyTooltipBehavior$handleUbertipMenuToggle(areMenuItemsVisible) {
        this._isFrozen = areMenuItemsVisible;
    },
    
    handleUbertipMenuClose: function tab_LegacyTooltipBehavior$handleUbertipMenuClose() {
        this._tooltip.close();
    },
    
    hoverOverObject: function tab_LegacyTooltipBehavior$hoverOverObject(pageCoords, isSelected, isEmpty, isSameObject) {
        this.showTooltip(pageCoords);
    },
    
    hoverOverWhitespace: function tab_LegacyTooltipBehavior$hoverOverWhitespace(pageCoords) {
        if (this._tooltip.get_isShown() && this.isInSafeZone(pageCoords)) {
            return;
        }
        if (this._tooltip.get_isShown()) {
            this._tooltip.close();
        }
    },
    
    multiSelectComplete: function tab_LegacyTooltipBehavior$multiSelectComplete(pageAnchorPoint) {
        this.showTooltip(pageAnchorPoint);
    },
    
    singleSelectComplete: function tab_LegacyTooltipBehavior$singleSelectComplete(pageCoords) {
        this.showTooltip(pageCoords);
    },
    
    onPanningOrDragging: function tab_LegacyTooltipBehavior$onPanningOrDragging() {
        if (this._tooltip.get_isShown()) {
            this._tooltip.close();
        }
    },
    
    onScroll: function tab_LegacyTooltipBehavior$onScroll() {
        if (this._tooltip.get_isShown()) {
            this._tooltip.close();
        }
    },
    
    mouseDown: function tab_LegacyTooltipBehavior$mouseDown(pageCoords, objectUnderMouse) {
        this._tooltip.close();
    },
    
    showTooltip: function tab_LegacyTooltipBehavior$showTooltip(pageCoords) {
        tab.Log.get(this).debug('ShowTooltip: position=%o', pageCoords);
        if (this._tooltip.get_isShown() && tab.PointUtil.equals(this._tooltip.get_location(), pageCoords)) {
            return;
        }
        if (this._tooltip.get_isShown() && this.isInSafeZone(pageCoords)) {
            return;
        }
        this._tooltip.show(this._tooltip.get_body().children()[0], pageCoords);
    },
    
    _onShowed: function tab_LegacyTooltipBehavior$_onShowed(sender, e) {
        tab.Log.get(this).debug('OnShowed');
        this._cancelTimeouts();
        this._movedSinceShow = false;
        this._timeTooltipShown = Date.get_now();
        this._tooltip.set_lastLocation(tab.$create_Point(e.origX, e.origY));
        this._closeWithTimeout(this.get_timeoutInitialShown());
    },
    
    _onClose: function tab_LegacyTooltipBehavior$_onClose() {
        this._tooltip.get_element().unbind('.LegacyTooltipBehavior');
        this._tooltip.set_lastLocation(null);
        this._cancelTimeouts();
        this._timeTooltipShown = null;
        tab.Log.get(this).debug('OnClose');
    },
    
    _onMouseMove: function tab_LegacyTooltipBehavior$_onMouseMove(e) {
        var prevLocation = this._tooltip.get_lastLocation();
        this._tooltip.set_lastLocation(tab.$create_Point(e.pageX, e.pageY));
        if (ss.isNullOrUndefined(prevLocation)) {
            return;
        }
        var moveDistance = -1;
        if (ss.isValue(prevLocation)) {
            moveDistance = tab.PointUtil.distance(prevLocation, this._tooltip.get_lastLocation());
        }
        if (!this._tooltip.get_isShown() || this._isMouseOverTooltip(this._tooltip.get_lastLocation())) {
            return;
        }
        if (!this._isFrozen && !this.isInSafeZone(this._tooltip.get_lastLocation())) {
            tab.Log.get(this).debug('Prev location: %o | Current location: %o', prevLocation, this._tooltip.get_lastLocation());
            this._tooltip.close();
            return;
        }
        var millisecondsSinceShown = Date.get_now() - this._timeTooltipShown;
        tab.Log.get(this).debug('Milliseconds since shown: %d. Distance: %d.', millisecondsSinceShown, moveDistance);
        if (moveDistance > 10 && millisecondsSinceShown > 500) {
            tab.Log.get(this).debug('Moving', moveDistance);
            this._movedSinceShow = true;
            if (ss.isValue(this._closeTimeoutHandle)) {
                tab.Log.get(this).debug('Moving, clear timeout: %d distance', moveDistance);
                window.clearTimeout(this._closeTimeoutHandle);
                this._timeoutHandles.remove(this._closeTimeoutHandle);
                this._closeTimeoutHandle = null;
            }
            this._detectMouseStop();
        }
        else if (this._movedSinceShow) {
            if (ss.isNullOrUndefined(this._closeTimeoutHandle)) {
                tab.Log.get(this).debug('Stopped moving, schedule close: %d distance', moveDistance);
                this._closeTimeoutHandle = this._closeWithTimeout(this.get_timeoutMove());
            }
        }
    },
    
    _detectMouseStop: function tab_LegacyTooltipBehavior$_detectMouseStop() {
        if (ss.isValue(this._mouseStopTimeoutHandle)) {
            window.clearTimeout(this._mouseStopTimeoutHandle);
            this._mouseStopTimeoutHandle = null;
        }
        this._mouseStopTimeoutHandle = window.setTimeout(ss.Delegate.create(this, function() {
            tab.Log.get(this).debug("Mouse hasn't moved for 250 ms. Preparing to close.");
            if (ss.isNullOrUndefined(this._closeTimeoutHandle)) {
                this._closeTimeoutHandle = this._closeWithTimeout(this.get_timeoutMove());
            }
        }), 250);
    },
    
    _onPotentialTooltipTap: function tab_LegacyTooltipBehavior$_onPotentialTooltipTap(arg) {
        tab.Log.get(this).debug('OnPotentialTap: closing tooltip');
        arg.preventDefault();
        arg.stopPropagation();
        this._tooltip.close();
    },
    
    _removeMoveHandler: function tab_LegacyTooltipBehavior$_removeMoveHandler() {
        tab.Log.get(this).debug('Unique mouse event type unbound: ' + this._uniqueMouseEventType);
        $(window.document.documentElement).unbind(this._uniqueMouseEventType);
    },
    
    isInSafeZone: function tab_LegacyTooltipBehavior$isInSafeZone(position) {
        var tooltipPosition = this._tooltip.get_element().position();
        var width = this._tooltip.get_element().outerWidth();
        var height = this._tooltip.get_element().outerHeight();
        var bufferSize = (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.responsiveUi)) ? 4 : 10;
        var horizontalBuffer = this._tooltip.get_horizontalOffset() + bufferSize;
        var verticalBuffer = this._tooltip.get_verticalOffset() + bufferSize;
        return (position.x >= tooltipPosition.left - horizontalBuffer && position.x <= tooltipPosition.left + width + horizontalBuffer && position.y >= tooltipPosition.top - verticalBuffer && position.y <= tooltipPosition.top + height + verticalBuffer);
    },
    
    _isMouseOverTooltip: function tab_LegacyTooltipBehavior$_isMouseOverTooltip(mouse) {
        if (ss.isNullOrUndefined(mouse)) {
            return false;
        }
        var bounds = this._getTooltipBounds();
        return tab.RectUtil.inRect(bounds, mouse);
    },
    
    _getTooltipBounds: function tab_LegacyTooltipBehavior$_getTooltipBounds() {
        var pos = this._tooltip.get_element().position();
        var bounds = tab.$create_Rect(pos.left, pos.top, this._tooltip.get_element().width(), this._tooltip.get_element().height());
        return bounds;
    },
    
    _closeWithTimeout: function tab_LegacyTooltipBehavior$_closeWithTimeout(timeout) {
        var start = Date.get_now();
        var handle = window.setTimeout(ss.Delegate.create(this, function() {
            if (this._isMouseOverTooltip(this._tooltip.get_lastLocation())) {
                return;
            }
            tab.Log.get(this).debug('Close timeout after %dms, actual %dms', timeout, Date.get_now() - start);
            this._tooltip.close();
        }), timeout);
        this._timeoutHandles.add(handle);
        return handle;
    },
    
    _onMouseLeaveToolip: function tab_LegacyTooltipBehavior$_onMouseLeaveToolip(e) {
        tab.Log.get(this).debug('Mouse leave tooltip');
        if (!this._isFrozen) {
            this._closeWithTimeout(this.get_timeoutLeaveTooltip());
        }
    },
    
    _onTooltipHover: function tab_LegacyTooltipBehavior$_onTooltipHover(arg) {
        if (this._isMouseOverTooltip(this._tooltip.get_lastLocation())) {
            return;
        }
        tab.Log.get(this).debug('On hover');
        this._cancelTimeouts();
    },
    
    _tooltipDisposed: function tab_LegacyTooltipBehavior$_tooltipDisposed(sender, e) {
        this.dispose();
    },
    
    _cancelTimeouts: function tab_LegacyTooltipBehavior$_cancelTimeouts() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._timeoutHandles);
        while ($enum1.moveNext()) {
            var timeoutHandle = $enum1.current;
            window.clearTimeout(timeoutHandle);
        }
        this._timeoutHandles.clear();
        if (ss.isValue(this._closeTimeoutHandle)) {
            window.clearTimeout(this._closeTimeoutHandle);
            this._closeTimeoutHandle = null;
        }
        if (ss.isValue(this._mouseStopTimeoutHandle)) {
            window.clearTimeout(this._mouseStopTimeoutHandle);
            this._mouseStopTimeoutHandle = null;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ContinuousSliderWeb

tab.ContinuousSliderWeb = function tab_ContinuousSliderWeb(viewModel) {
    tab.ContinuousSliderWeb.initializeBase(this, [ viewModel ]);
    this.viewModel = viewModel;
    var sliderParams = tab.$create_ContinuousSliderParams();
    sliderParams.templateString = tab.ContinuousSliderWeb.tableauSliderTemplate;
    sliderParams.onChange = ss.Delegate.create(this, this._handleIntermediateChanges$3);
    sliderParams.value = viewModel.get_sliderCurrentValue();
    sliderParams.minimum = viewModel.get_sliderMinimumValue();
    sliderParams.maximum = viewModel.get_sliderMaximumValue();
    sliderParams.slideDuration = 0;
    sliderParams.intermediateChanges = true;
    sliderParams.style = 'width:' + viewModel.get_pixelWidth() + 'px;';
    sliderParams.showButtons = false;
    this._horizontalSlider$3 = new dijit.form.HorizontalSlider(sliderParams, this.get_template().get_domRoot().get(0));
    this._startSub$3 = dojo.subscribe('/dnd/move/start', ss.Delegate.create(this, this._startDrag$3));
    this._stopSub$3 = dojo.subscribe('/dnd/move/stop', ss.Delegate.create(this, this._stopDrag$3));
    this.viewModel.add_sliderValueChange(ss.Delegate.create(this, this._updateSlider$3));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.viewModel.remove_sliderValueChange(ss.Delegate.create(this, this._updateSlider$3));
    })));
    this.get_template().get_domRoot().append(this._horizontalSlider$3.domNode);
    if (this.viewModel.get_ruleTickCount() > 0) {
        var rule = $("<div class='tabSliderRule'>");
        var rulesParams = { count: this.viewModel.get_ruleTickCount() };
        this._horizontalRule$3 = new dijit.form.HorizontalRule(rulesParams, rule.get(0));
        rule.append(this._horizontalRule$3.domNode);
        this._horizontalRule$3.startup();
        this.get_template().get_domRoot().append(rule);
    }
    this._isDragging$3 = false;
}
tab.ContinuousSliderWeb.prototype = {
    _horizontalSlider$3: null,
    _horizontalRule$3: null,
    _isDragging$3: false,
    _startSub$3: null,
    _stopSub$3: null,
    
    _updateSlider$3: function tab_ContinuousSliderWeb$_updateSlider$3(newFractionValue) {
        this._horizontalSlider$3._setValueAttr(this.viewModel.get_sliderCurrentValue());
    },
    
    _startDrag$3: function tab_ContinuousSliderWeb$_startDrag$3(mover) {
        if (ss.isValue(mover) && mover.node === this._horizontalSlider$3.sliderHandle) {
            this._isDragging$3 = true;
        }
    },
    
    _stopDrag$3: function tab_ContinuousSliderWeb$_stopDrag$3(mover) {
        if (ss.isValue(mover) && mover.node === this._horizontalSlider$3.sliderHandle) {
            this._isDragging$3 = false;
            this.applyChanges(this.viewModel.get_sliderIntermediateValue());
        }
    },
    
    _handleIntermediateChanges$3: function tab_ContinuousSliderWeb$_handleIntermediateChanges$3(newValue) {
        this.viewModel.applyIntermediateChange(newValue);
        if (!this._isDragging$3) {
            this.applyChanges(this.viewModel.get_sliderIntermediateValue());
        }
    },
    
    dispose: function tab_ContinuousSliderWeb$dispose() {
        dojo.unsubscribe(this._startSub$3);
        dojo.unsubscribe(this._stopSub$3);
        tab.ContinuousSliderWeb.callBaseMethod(this, 'dispose');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.StepperControlViewWeb

tab.StepperControlViewWeb = function tab_StepperControlViewWeb(viewModel) {
    tab.StepperControlViewWeb.initializeBase(this, [ viewModel, new tab.WebStepperControlTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.WebStepperControlTemplate

tab.WebStepperControlTemplate = function tab_WebStepperControlTemplate() {
    tab.WebStepperControlTemplate.initializeBase(this, [ "<span class='tabStepperControl'>\n            <div class='tabButtonContainer'>\n                <div class='tabIncrementButton'>&#x25B2;</div>\n                <div class='tabDecrementButton'>&#x25BC;</div>\n            </div>\n            <input class='tabStepCountValue' type='text'></input>\n        </span>" ]);
    this.decrementButton = this.getElementBySelector('.tabDecrementButton');
    this.incrementButton = this.getElementBySelector('.tabIncrementButton');
    this.valueText = this.getElementBySelector('.tabStepCountValue');
}


////////////////////////////////////////////////////////////////////////////////
// tab.TooltipLegacyMode

tab.TooltipLegacyMode = function tab_TooltipLegacyMode(contextProvider, visualId) {
    tab.TooltipLegacyMode.initializeBase(this, [ contextProvider, visualId ]);
}
tab.TooltipLegacyMode.prototype = {
    
    onMoving: function tab_TooltipLegacyMode$onMoving() {
        this.get_tooltip().close();
    },
    
    onDragEnd: function tab_TooltipLegacyMode$onDragEnd() {
        this.get_tooltip().close();
    },
    
    buildBehaviorsDictionary: function tab_TooltipLegacyMode$buildBehaviorsDictionary() {
        var legacyTooltipBehavior = new tab.LegacyTooltipBehavior(this.get_tooltip());
        this.tooltipBehaviors['sticky'] = legacyTooltipBehavior;
    },
    
    clearTooltipWithFakeHover: function tab_TooltipLegacyMode$clearTooltipWithFakeHover() {
        var legacyTooltipBehavior = this.get_currentBehavior();
        if (!this.get_tooltip().get_isShown() || !ss.isValue(this.get_tooltip().get_lastLocation()) || !legacyTooltipBehavior.isInSafeZone(this.get_tooltip().get_lastLocation())) {
            tab.TooltipLegacyMode.callBaseMethod(this, 'clearTooltipWithFakeHover');
        }
    }
}


tab.CategoricalLegendViewWeb.registerClass('tab.CategoricalLegendViewWeb', tab.CategoricalLegendView);
tab.CategoricalLegendTemplateWeb.registerClass('tab.CategoricalLegendTemplateWeb', tab.CategoricalLegendTemplate);
tab.MapsSearchViewWeb.registerClass('tab.MapsSearchViewWeb', tab.MapsSearchView);
tab.ApplicationViewModelWeb.registerClass('tab.ApplicationViewModelWeb', tab.ApplicationViewModel);
tab.LegacyLegendViewWeb.registerClass('tab.LegacyLegendViewWeb', tab.LegacyLegendView);
tab.LegacyLegendTemplateWeb.registerClass('tab.LegacyLegendTemplateWeb', tab.LegacyLegendTemplate);
tab.PaneTableViewWeb.registerClass('tab.PaneTableViewWeb', tab.PaneTableView);
tab.FZTOpsWeb.registerClass('tab.FZTOpsWeb', null, tab.IFloatingZoomToolbarOps);
tab.HoverApi.registerClass('tab.HoverApi', null, ss.IDisposable);
tab.PaneTableTemplateWeb.registerClass('tab.PaneTableTemplateWeb', tab.PaneTableTemplate);
tab.AccordionViewWeb.registerClass('tab.AccordionViewWeb', tab.AccordionView);
tab.ComboBoxViewWeb.registerClass('tab.ComboBoxViewWeb', tab.ComboBoxView);
tab.CustomViewsPanelWeb.registerClass('tab.CustomViewsPanelWeb', tab.CustomViewsPanel);
tab.DojoWidgetsWeb.registerClass('tab.DojoWidgetsWeb');
tab.SortDrillBase.registerClass('tab.SortDrillBase', spiff.Widget);
tab.Drilling.registerClass('tab.Drilling', tab.SortDrillBase);
tab._drillWidgets.registerClass('tab._drillWidgets');
tab._sortIndicatorState.registerClass('tab._sortIndicatorState');
tab._pxLevel.registerClass('tab._pxLevel');
tab.FloatingZoomToolbarWeb.registerClass('tab.FloatingZoomToolbarWeb', tab.FloatingZoomToolbar);
tab.TiledViewerModel.registerClass('tab.TiledViewerModel');
tab.Sorting.registerClass('tab.Sorting', tab.SortDrillBase);
tab.TiledViewerRegionWeb.registerClass('tab.TiledViewerRegionWeb', tab.TiledViewerRegion);
tab.ViewingToolbarWeb.registerClass('tab.ViewingToolbarWeb', tab.ViewingToolbar);
tab.WebScroller.registerClass('tab.WebScroller', null, spiff.IScroller);
tab.LegacyTooltipBehavior.registerClass('tab.LegacyTooltipBehavior', null, tab.ITooltipBehavior, ss.IDisposable);
tab.ContinuousSliderWeb.registerClass('tab.ContinuousSliderWeb', tab.ContinuousSlider);
tab.StepperControlViewWeb.registerClass('tab.StepperControlViewWeb', tab.StepperControlView);
tab.WebStepperControlTemplate.registerClass('tab.WebStepperControlTemplate', tab.StepperControlTemplate);
tab.TooltipLegacyMode.registerClass('tab.TooltipLegacyMode', tab.TooltipBaseLegacyMode);
(function () {
    spiff.ObjectRegistry.registerType(tab.CategoricalLegendView, tab.CategoricalLegendViewWeb);
})();
tab.MapsSearchViewWeb.suggestionHighlighted = tab.MapsSearchView.widgetClassName + 'SuggestionHighlighted';
(function () {
    spiff.ObjectRegistry.registerType(tab.MapsSearchView, tab.MapsSearchViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.LegacyLegendView, tab.LegacyLegendViewWeb);
})();
tab.LegacyLegendTemplateWeb._htmlTemplate$3 = "<div class='LegendPanel'>" + "<div class='LegendBox'>" + "<div class='tabLegendTitle'></div>" + "<div class='LegendContent'>" + "<img class='LegendImageBody'/></div>" + "<div class='tabCatLegendScroll'></div>" + '</div>' + "<div class='" + tab.LegendTemplate.legendHighlighterClass + "' showlabel='false' title='Highlight Selected Items'></div>" + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.PaneTableView, tab.PaneTableViewWeb);
})();
tab.PaneTableTemplateWeb.htmlTemplate = "<div class='tab-tiledViewer placeholder'>" + "<div class='tab-clip'>" + "<div class='tab-tvTLSpacer tvimagesNS'><img></img></div>" + "<div class='tab-tvTRSpacer tvimagesNS'><img></img></div>" + "<div class='tab-tvBLSpacer tvimagesNS'><img></img></div>" + "<div class='tab-tvBRSpacer tvimagesNS'><img></img></div>" + "<div class='tab-tvYLabel tvimagesNS'><div class='tvimagesContainer'></div></div>" + "<div class='tab-tvLeftAxis tvimagesNS'><div class='tvimagesContainer'></div></div>" + "<div class='tab-tvRightAxis tvimagesNS'><div class='tvimagesContainer'></div></div>" + "<div class='tab-tvXLabel tvimagesNS'><div class='tvimagesContainer'></div></div>" + "<div class='tab-tvBottomAxis tvimagesNS'><div class='tvimagesContainer'></div></div>" + "<div class='tab-tvTopAxis tvimagesNS'><div class='tvimagesContainer'></div></div>" + "<div class='tab-tvView tvimagesNS'>" + "<div class='tvScrollContainer'>" + "<div class='tvBackgroundContainer'></div>" + "<div class='tvimagesContainer'></div>" + "<div class='tvViewportBorders'></div>" + '</div>' + '</div>' + "<div class='tab-tvTitle tvimagesNS'></div>" + "<div class='tab-tvCaption tvimagesNS'></div>" + "<div class='tab-tvScrollX tvimages'><div class='tvimagesContainer'></div></div>" + "<div class='tab-tvScrollY tvimages'><div class='tvimagesContainer'></div></div>" + '</div>' + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.AccordionView, tab.AccordionViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ComboBoxView, tab.ComboBoxViewWeb);
})();
(function () {
    dojo.require('tableau.web.WebClient');
})();
tab.SortDrillBase._instances$1 = [];
tab.TiledViewerRegionWeb._cursors$1 = null;
(function () {
    tab.Application.add_started(function() {
        tab.TiledViewerRegionWeb._cursors$1 = {};
        tab.TiledViewerRegionWeb._cursors$1['ZoomIn'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/zoomin.png', true) + ') 8 7, pointer';
        tab.TiledViewerRegionWeb._cursors$1['ZoomOut'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/zoomout.png', true) + ') 8 7, pointer';
        tab.TiledViewerRegionWeb._cursors$1['Pan'] = (tab.BrowserSupport.get_isIE()) ? 'move' : 'url(' + tableau.util.assetUrl('cursors/pan.gif', true) + ') 8 10, pointer';
        tab.TiledViewerRegionWeb._cursors$1['PanDrag'] = (tab.BrowserSupport.get_isIE()) ? 'move' : 'url(' + tableau.util.assetUrl('cursors/pandrag.png', true) + ') 9 9, pointer';
        tab.TiledViewerRegionWeb._cursors$1['Panning'] = (tab.BrowserSupport.get_isIE()) ? 'move' : 'url(' + tableau.util.assetUrl('cursors/pandrag.gif', true) + ') 8 10, pointer';
        tab.TiledViewerRegionWeb._cursors$1['RectSelect'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/rectdrag.png', true) + ') 2 2, pointer';
        tab.TiledViewerRegionWeb._cursors$1['LassoSelect'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/lassodrag.png', true) + ') 2 2, pointer';
        tab.TiledViewerRegionWeb._cursors$1['RadialSelect'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/radialdrag.png', true) + ') 2 2, pointer';
        tab.TiledViewerRegionWeb._cursors$1['RectExtended'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/rectdragextended.png', true) + ') 2 2, pointer';
        tab.TiledViewerRegionWeb._cursors$1['LassoExtended'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/lassodragextended.png', true) + ') 2 2, pointer';
        tab.TiledViewerRegionWeb._cursors$1['RadialExtended'] = (tab.BrowserSupport.get_isIE()) ? 'crosshair' : 'url(' + tableau.util.assetUrl('cursors/radialdragextended.png', true) + ') 2 2, pointer';
        tab.TiledViewerRegionWeb._cursors$1['DragSelect'] = 'crosshair';
        tab.TiledViewerRegionWeb._cursors$1['Select'] = 'pointer';
        tab.TiledViewerRegionWeb._cursors$1['Default'] = 'default';
    });
})();
tab.LegacyTooltipBehavior._uniqueEventTypeCounter = 0;
(function () {
    spiff.ObjectRegistry.registerType(tab.ITooltipBehavior, tab.LegacyTooltipBehavior);
})();
tab.ContinuousSliderWeb.tableauSliderTemplate = "<div class='dijit dijitReset'>" + "<div class='dijitReset tableauSlider' dojoAttachPoint='tableauSlider'>" + "<table class='dijit dijitReset' cellspacing='0' cellpadding='0' border='0' rules='none' dojoAttachEvent='onkeypress:_onKeyPress'>" + "<tr class='dijitReset'>" + "<td class='dijitReset'></td>" + "<td dojoAttachPoint='containerNode,topDecoration' class='dijitReset' style='text-align:center;width:100%;'></td>" + "<td class='dijitReset'></td>" + '</tr>' + "<tr class='dijitReset'>" + "<td class='dijitReset'>" + "<div class='dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderLeftBumper dijitSliderLeftBumper' dojoAttachEvent='onclick:_onClkDecBumper'></div>" + '</td>' + "<td class='dijitReset'>" + "<input dojoAttachPoint='valueNode' type='hidden' name='${name}'>" + "<div class='dijitReset dijitSliderBarContainerH' waiRole='presentation' dojoAttachPoint='sliderBarContainer'>" + "<div waiRole='presentation' dojoAttachPoint='progressBar' class='dijitSliderBar dijitSliderBarH dijitSliderProgressBar dijitSliderProgressBarH' dojoAttachEvent='onclick:_onBarClick'>" + "<div class='dijitSliderMoveable dijitSliderMoveableH'>" + "<div dojoAttachPoint='sliderHandle,focusNode' class='dijitSliderImageHandle dijitSliderImageHandleH' dojoAttachEvent='onmousedown:_onHandleClick' waiRole='slider' valuemin='${minimum}' valuemax='${maximum}'></div>" + '</div>' + '</div>' + "<div waiRole='presentation' dojoAttachPoint='remainingBar' class='dijitSliderBar dijitSliderBarH dijitSliderRemainingBar dijitSliderRemainingBarH' dojoAttachEvent='onclick:_onBarClick'></div>" + '</div>' + '</td>' + "<td class='dijitReset'>" + "<div class='dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderRightBumper dijitSliderRightBumper' dojoAttachEvent='onclick:_onClkIncBumper'></div>" + '</td>' + '</tr>' + "<tr class='dijitReset'>" + "<td class='dijitReset'></td>" + "<td dojoAttachPoint='containerNode,bottomDecoration' class='dijitReset'></td>" + "<td class='dijitReset'></td>" + '</tr>' + '</table>' + '</div>' + "<div class='dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH tableauArrowDec' style='display:none' dojoAttachPoint='decrementButton'>" + "<div class='dijitSliderDecrementIconH' tabIndex='-1'>" + "<span class='dijitSliderButtonInner'>-</span>" + '</div>' + '</div>' + "<div class='dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH tableauArrowInc' style='display:none' dojoAttachPoint='incrementButton'>" + "<div class='dijitSliderIncrementIconH' tabIndex='-1'>" + "<span class='dijitSliderButtonInner'>+</span>" + '</div>' + '</div>' + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.ContinuousSlider, tab.ContinuousSliderWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.StepperControlView, tab.StepperControlViewWeb);
})();
tab.WebStepperControlTemplate.template = "<span class='tabStepperControl'>\n            <div class='tabButtonContainer'>\n                <div class='tabIncrementButton'>&#x25B2;</div>\n                <div class='tabDecrementButton'>&#x25BC;</div>\n            </div>\n            <input class='tabStepCountValue' type='text'></input>\n        </span>";
(function () {
    spiff.ObjectRegistry.registerType(tab.TooltipBaseLegacyMode, tab.TooltipLegacyMode);
})();
});

//! This script was generated using Script# v0.7.4.0
