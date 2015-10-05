//! vqluimobile.debug.js
//

dojo.addOnLoad(function() {

Type.registerNamespace('tableau.mobile.util');

Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tableau.mobile.util.scaling

tableau.mobile.util.scaling = function tableau_mobile_util_scaling() {
}
tableau.mobile.util.scaling.logToWindow = function tableau_mobile_util_scaling$logToWindow(msg) {
    tab.Logger.global.debug(msg);
}
tableau.mobile.util.scaling.logToWindowII = function tableau_mobile_util_scaling$logToWindowII(msg) {
}
tableau.mobile.util.scaling.doWithScaleFactor = function tableau_mobile_util_scaling$doWithScaleFactor(cb) {
    tsConfig.getScale(function(sf, scrollX, scrollY) {
        tableau.mobile.util.scaling._scaleFactor = sf;
        tableau.mobile.util.scaling._scaleToFactor = 1 / sf;
        if (ss.isValue(cb)) {
            cb(sf, scrollX, scrollY);
        }
    });
}
tableau.mobile.util.scaling.getZoomScaleFactor = function tableau_mobile_util_scaling$getZoomScaleFactor() {
    if (ss.isNullOrUndefined(tableau.mobile.util.scaling._scaleFactor)) {
        tableau.mobile.util.scaling.doWithScaleFactor(null);
    }
    return tableau.mobile.util.scaling._scaleFactor;
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalLegendViewMobile

tab.CategoricalLegendViewMobile = function tab_CategoricalLegendViewMobile(viewModel) {
    tab.CategoricalLegendViewMobile.initializeBase(this, [ viewModel, new tab.CategoricalLegendTemplateMobile() ]);
    this._inputSpec$4 = this._makeInputHandlers$4();
    this._mobileScroller$4 = new spiff.MobileScroller(this.get_catLegendTemplate().columnsHolder.get(0), this._inputSpec$4, spiff.$create_MobileScrollerOptions());
}
tab.CategoricalLegendViewMobile.prototype = {
    _inputSpec$4: null,
    _mobileScroller$4: null,
    _splash$4: null,
    
    get_scrollOffset: function tab_CategoricalLegendViewMobile$get_scrollOffset() {
        return this._mobileScroller$4.get_scrollPos();
    },
    set_scrollOffset: function tab_CategoricalLegendViewMobile$set_scrollOffset(value) {
        this._mobileScroller$4.scrollTo(value.x, value.y);
        return value;
    },
    
    dispose: function tab_CategoricalLegendViewMobile$dispose() {
        this._inputSpec$4.dispose();
        this._mobileScroller$4.dispose();
        tab.CategoricalLegendViewMobile.callBaseMethod(this, 'dispose');
    },
    
    setContentSize: function tab_CategoricalLegendViewMobile$setContentSize(viewportHeight, viewportWidth) {
        tab.CategoricalLegendViewMobile.callBaseMethod(this, 'setContentSize', [ viewportHeight, viewportWidth ]);
        tab.CategoricalLegendView.setDomNodeStyleSize(this.get_catLegendTemplate().get_contentArea(), viewportWidth, viewportHeight);
    },
    
    resetLegend: function tab_CategoricalLegendViewMobile$resetLegend() {
        this._mobileScroller$4.resetPosition();
        this._mobileScroller$4.refresh();
        tab.CategoricalLegendViewMobile.callBaseMethod(this, 'resetLegend');
    },
    
    drawLegend: function tab_CategoricalLegendViewMobile$drawLegend() {
        tab.CategoricalLegendViewMobile.callBaseMethod(this, 'drawLegend');
        this._mobileScroller$4.refresh();
    },
    
    _makeInputHandlers$4: function tab_CategoricalLegendViewMobile$_makeInputHandlers$4() {
        var spec = spiff.$create_EventHandleSpec();
        spec.tap = ss.Delegate.create(this, this._onTap$4);
        spec.potentialTap = ss.Delegate.create(this, this._onFingerUp$4);
        var mh = new spiff.TableauEventHandler(this.get_baseLegendTemplate().get_domRoot().get(0), spec);
        return mh;
    },
    
    _onTap$4: function tab_CategoricalLegendViewMobile$_onTap$4(pseudoEvent) {
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
        pseudoEvent.preventDefault();
    },
    
    _onFingerUp$4: function tab_CategoricalLegendViewMobile$_onFingerUp$4(pseudoEvent) {
        this._splash$4 = tab.FeedbackMobile.createTapFeedback(this.get_catLegendTemplate().get_domRoot().closest('.tab-dashboard').get(0), pseudoEvent);
        pseudoEvent.stopPropagation();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalLegendTemplateMobile

tab.CategoricalLegendTemplateMobile = function tab_CategoricalLegendTemplateMobile() {
    tab.CategoricalLegendTemplateMobile.initializeBase(this, [ $("\n            <div class='tabLegendPanel'>\n                <div class='tabLegendBox'>\n                    <div class='tabLegendTitle'></div>\n                    <div class='tabLegendContentBox'>\n                        <div class='tabLegendContentHolder'>\n                            <div class='tabLegendColumnHolder' style='white-space:nowrap'></div>\n                        </div>\n                    </div>\n                    <div class='tabLegendHorizScroll'></div>\n                </div>\n            </div>") ]);
    this.legendContentArea = this.getElementBySelector('.tabLegendContentBox');
}


////////////////////////////////////////////////////////////////////////////////
// tab.MapsSearchViewMobile

tab.MapsSearchViewMobile = function tab_MapsSearchViewMobile(vm) {
    tab.MapsSearchViewMobile.initializeBase(this, [ vm, tab.MapsSearchView.newMapsSearchViewTemplate() ]);
    this._eventHandler$3 = this._makeEventHandlers$3(this.mapsSearchViewTemplate.get_domRoot()[0], ss.Delegate.create(this, this._cancelEvent$3));
    var clearButtonClickedDelegate = ss.Delegate.create(this, function() {
        this._clearButtonClicked$3();
    });
    this.get_compositeSearchWidget().get_clearButton().add_click(clearButtonClickedDelegate);
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        this.get_compositeSearchWidget().get_clearButton().remove_click(clearButtonClickedDelegate);
        this._eventHandler$3.dispose();
    })));
}
tab.MapsSearchViewMobile.prototype = {
    _eventHandler$3: null,
    
    _clearButtonClicked$3: function tab_MapsSearchViewMobile$_clearButtonClicked$3() {
        this.showInitialSearchText(true);
    },
    
    _makeEventHandlers$3: function tab_MapsSearchViewMobile$_makeEventHandlers$3(element, eventHandlerMethod) {
        var spec = spiff.$create_EventHandleSpec();
        spec.tap = eventHandlerMethod;
        spec.press = eventHandlerMethod;
        spec.potentialTap = eventHandlerMethod;
        spec.potentialPress = eventHandlerMethod;
        spec.firstTouch = eventHandlerMethod;
        spec.touchMove = eventHandlerMethod;
        spec.lastTouch = eventHandlerMethod;
        spec.dragStart = eventHandlerMethod;
        spec.dragMove = eventHandlerMethod;
        spec.dragEnd = eventHandlerMethod;
        var eh = new spiff.TableauEventHandler(element, spec);
        return eh;
    },
    
    _cancelEvent$3: function tab_MapsSearchViewMobile$_cancelEvent$3(pseudoEvent) {
        pseudoEvent.preventDefault();
        pseudoEvent.stopPropagation();
    },
    
    handleEnterKeyPress: function tab_MapsSearchViewMobile$handleEnterKeyPress() {
        tab.MapsSearchViewMobile.callBaseMethod(this, 'handleEnterKeyPress');
        this.removeMobileKeyboard();
    },
    
    handleListItemClick: function tab_MapsSearchViewMobile$handleListItemClick(listItem) {
        tab.MapsSearchViewMobile.callBaseMethod(this, 'handleListItemClick', [ listItem ]);
        this.removeMobileKeyboard();
    },
    
    handleSearchButtonClick: function tab_MapsSearchViewMobile$handleSearchButtonClick() {
        tab.MapsSearchViewMobile.callBaseMethod(this, 'handleSearchButtonClick');
        if (this.get_isCollapsed()) {
            this.removeMobileKeyboard();
        }
    },
    
    removeMobileKeyboard: function tab_MapsSearchViewMobile$removeMobileKeyboard() {
        this.get_compositeSearchWidget().get_textInputView().get_inputElement().blur();
        this.get_compositeSearchWidget().get_searchButton().get_element()[0].focus();
        document.activeElement.blur();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DragDropAndScrollHandler

tab.DragDropAndScrollHandler = function tab_DragDropAndScrollHandler(dragScrollContainer) {
    this._orientation = 1;
    var events = spiff.$create_EventHandleSpec();
    events.firstTouch = ss.Delegate.create(this, this._onFirstTouch);
    events.dragStart = ss.Delegate.create(this, this._onDragStart);
    events.dragMove = ss.Delegate.create(this, this._onDragMove);
    events.dragEnd = ss.Delegate.create(this, this._onDragEnd);
    this._touchHandler = new spiff.TableauEventHandler(dragScrollContainer[0], events);
    spiff.GlobalTouchWatcher.add_lastTouch(ss.Delegate.create(this, this._onLastTouch));
    var o = spiff.$create_MobileScrollerOptions();
    this._mobileScroller = new spiff.MobileScroller(dragScrollContainer[0], null, o);
}
tab.DragDropAndScrollHandler.get_dragInProgress = function tab_DragDropAndScrollHandler$get_dragInProgress() {
    return tab.DragDropAndScrollHandler._dragInProgress;
}
tab.DragDropAndScrollHandler.get_scrollInProgress = function tab_DragDropAndScrollHandler$get_scrollInProgress() {
    return tab.DragDropAndScrollHandler._scrollInProgress;
}
tab.DragDropAndScrollHandler.prototype = {
    _touchHandler: null,
    _mobileScroller: null,
    _startTimestamp: 0,
    _pressToDragTimeout: null,
    _firstTouch: null,
    _startScreenX: 0,
    _startScreenY: 0,
    
    add_draggingStarted: function tab_DragDropAndScrollHandler$add_draggingStarted(value) {
        this.__draggingStarted = ss.Delegate.combine(this.__draggingStarted, value);
    },
    remove_draggingStarted: function tab_DragDropAndScrollHandler$remove_draggingStarted(value) {
        this.__draggingStarted = ss.Delegate.remove(this.__draggingStarted, value);
    },
    
    __draggingStarted: null,
    
    get_orientation: function tab_DragDropAndScrollHandler$get_orientation() {
        return this._orientation;
    },
    set_orientation: function tab_DragDropAndScrollHandler$set_orientation(value) {
        this._orientation = value;
        return value;
    },
    
    get_scroller: function tab_DragDropAndScrollHandler$get_scroller() {
        return this._mobileScroller;
    },
    
    dispose: function tab_DragDropAndScrollHandler$dispose() {
        if (ss.isValue(this._touchHandler)) {
            this._touchHandler.dispose();
            this._touchHandler = null;
        }
        if (ss.isValue(this._mobileScroller)) {
            this._mobileScroller.dispose();
            this._mobileScroller = null;
        }
        this._clearPressToDragTimeout();
        spiff.GlobalTouchWatcher.remove_lastTouch(ss.Delegate.create(this, this._onLastTouch));
    },
    
    updateScrollableContentSize: function tab_DragDropAndScrollHandler$updateScrollableContentSize() {
        this._mobileScroller.resetPosition();
        this._mobileScroller.refresh();
    },
    
    _clearPressToDragTimeout: function tab_DragDropAndScrollHandler$_clearPressToDragTimeout() {
        if (ss.isValue(this._pressToDragTimeout)) {
            window.clearTimeout(this._pressToDragTimeout);
            this._pressToDragTimeout = null;
            document.removeEventListener('touchend', ss.Delegate.create(this, this._onTouchEndCapture), true);
        }
    },
    
    _startPressDrag: function tab_DragDropAndScrollHandler$_startPressDrag() {
        if (this._pressToDragTimeout == null) {
            return;
        }
        this._clearPressToDragTimeout();
        if (tab.DragDropAndScrollHandler._dragInProgress || tab.DragDropAndScrollHandler._scrollInProgress) {
            return;
        }
        this._startDragging(this._firstTouch);
    },
    
    _startDragging: function tab_DragDropAndScrollHandler$_startDragging(arg) {
        if (tab.DragDropAndScrollHandler._dragInProgress) {
            return;
        }
        tab.Log.get(this).debug('Start drag');
        tab.DragDropAndScrollHandler._dragInProgress = true;
        this._clearPressToDragTimeout();
        if (ss.isValue(this.__draggingStarted)) {
            this.__draggingStarted();
        }
        spiff.DragDropManager.firstTouch(this._firstTouch);
        spiff.DragDropManager.dragStart(arg);
        spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this._onDragDropManagerDragEnded));
    },
    
    _startScrolling: function tab_DragDropAndScrollHandler$_startScrolling(arg) {
        if (tab.DragDropAndScrollHandler._scrollInProgress) {
            return;
        }
        tab.Log.get(this).debug('StartScrolling');
        tab.DragDropAndScrollHandler._scrollInProgress = true;
        this._clearPressToDragTimeout();
        this._mobileScroller.touchStart(this._firstTouch);
        this._mobileScroller.touchMove(arg);
    },
    
    _onLastTouch: function tab_DragDropAndScrollHandler$_onLastTouch(arg, cancelCallback) {
        this._clearPressToDragTimeout();
        window.setTimeout(ss.Delegate.create(this, function() {
            if (tab.DragDropAndScrollHandler._dragInProgress) {
                tab.Log.get(this).debug('OnLastTouch - canceling drag');
                spiff.DragDropManager.cancelDrag();
            }
        }), 0);
    },
    
    _onDragDropManagerDragEnded: function tab_DragDropAndScrollHandler$_onDragDropManagerDragEnded(result) {
        tab.Log.get(this).debug('OnDragDropManagerDragEnded');
        tab.DragDropAndScrollHandler._dragInProgress = false;
        spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this._onDragDropManagerDragEnded));
    },
    
    _onFirstTouch: function tab_DragDropAndScrollHandler$_onFirstTouch(arg) {
        this._firstTouch = arg;
        this._startTimestamp = new Date().getMilliseconds();
        this._startScreenX = arg.touches[0].screenX;
        this._startScreenY = arg.touches[0].screenY;
        this._clearPressToDragTimeout();
        this._pressToDragTimeout = window.setTimeout(ss.Delegate.create(this, this._startPressDrag), 250);
        document.addEventListener('touchend', ss.Delegate.create(this, this._onTouchEndCapture), true);
    },
    
    _onTouchEndCapture: function tab_DragDropAndScrollHandler$_onTouchEndCapture(e) {
        tab.Log.get(this).debug('OnTouchEndCapture');
        this._clearPressToDragTimeout();
    },
    
    _onDragEnd: function tab_DragDropAndScrollHandler$_onDragEnd(arg) {
        if (tab.DragDropAndScrollHandler._dragInProgress) {
            tab.Log.get(this).debug('End drag');
            tab.DragDropAndScrollHandler._dragInProgress = false;
            spiff.DragDropManager.dragEnd(arg);
        }
        else if (tab.DragDropAndScrollHandler._scrollInProgress) {
            tab.Log.get(this).debug('End scroll');
            this._mobileScroller.touchEnd(arg);
            tab.DragDropAndScrollHandler._scrollInProgress = false;
        }
    },
    
    _onDragMove: function tab_DragDropAndScrollHandler$_onDragMove(arg) {
        arg.stopPropagation();
        arg.preventDefault();
        if (tab.DragDropAndScrollHandler._dragInProgress) {
            spiff.DragDropManager.dragMove(arg);
        }
        else if (tab.DragDropAndScrollHandler._scrollInProgress) {
            tab.Log.get(this).debug('Scroll move');
            this._mobileScroller.touchMove(arg);
        }
        else {
            var deltaY = arg.changedTouches[0].screenY - this._startScreenY;
            var deltaX = arg.changedTouches[0].screenX - this._startScreenX;
            var distanceSquared = (deltaY * deltaY) + (deltaX * deltaX);
            tab.Log.get(this).debug('Moved: %s', distanceSquared);
            if (distanceSquared > tab.DragDropAndScrollHandler._touchBecomesGestureDistanceSquared) {
                var speed = distanceSquared / (new Date().getMilliseconds() - this._startTimestamp);
                var slope = 99999;
                if (!!deltaX && this._orientation === 1) {
                    slope = Math.abs(deltaY / deltaX);
                }
                if (!!deltaY && this._orientation === 2) {
                    slope = Math.abs(deltaX / deltaY);
                }
                if (this._mobileScroller.get_canScroll() && ((speed > 1 && slope > 0.5) || slope >= 2)) {
                    this._startScrolling(arg);
                }
                else {
                    this._startDragging(arg);
                }
            }
        }
    },
    
    _onDragStart: function tab_DragDropAndScrollHandler$_onDragStart(arg) {
        this._onDragMove(arg);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.IInplaceMobile

tab.IInplaceMobile = function() { };
tab.IInplaceMobile.prototype = {
    get_popup : null,
    get_touchHandler : null,
    createPopup : null,
    destroyPopup : null,
    setupTouchHandler : null,
    connectPopup : null,
    connectPopupAndAttachHandler : null,
    onFingerUp : null,
    disconnectPopup : null,
    isPopupVisible : null
}
tab.IInplaceMobile.registerInterface('tab.IInplaceMobile');


////////////////////////////////////////////////////////////////////////////////
// tab.IInplaceMobilePopupWidget

tab.IInplaceMobilePopupWidget = function() { };
tab.IInplaceMobilePopupWidget.prototype = {
    get_domNodeElement : null,
    get_domBoxElement : null,
    get_uniqueNodeId : null
}
tab.IInplaceMobilePopupWidget.registerInterface('tab.IInplaceMobilePopupWidget');


////////////////////////////////////////////////////////////////////////////////
// tab.TooltipLegacyMode

tab.TooltipLegacyMode = function tab_TooltipLegacyMode(contextProvider, visualId) {
    tab.TooltipLegacyMode.initializeBase(this, [ contextProvider, visualId ]);
}
tab.TooltipLegacyMode.prototype = {
    
    onMoving: function tab_TooltipLegacyMode$onMoving() {
    },
    
    onDragEnd: function tab_TooltipLegacyMode$onDragEnd(regionDimension) {
        if (ss.isValue(regionDimension)) {
            this._closeTooltipIfOutOfBounds$2(regionDimension);
        }
    },
    
    onPinchEnd: function tab_TooltipLegacyMode$onPinchEnd(regionDimension) {
        if (ss.isValue(regionDimension)) {
            this._closeTooltipIfOutOfBounds$2(regionDimension);
        }
    },
    
    buildBehaviorsDictionary: function tab_TooltipLegacyMode$buildBehaviorsDictionary() {
        var legacyTooltipBehavior = new tab.LegacyTooltipBehavior(this.get_tooltip());
        this.tooltipBehaviors['sticky'] = legacyTooltipBehavior;
    },
    
    _closeTooltipIfOutOfBounds$2: function tab_TooltipLegacyMode$_closeTooltipIfOutOfBounds$2(regionDimension) {
        var target = this.get_tooltip().get_location();
        if (ss.isValue(target) && (target.x < regionDimension.x || target.x > (regionDimension.w + regionDimension.x) || target.y < regionDimension.y || target.y > (regionDimension.h + regionDimension.y))) {
            this.get_tooltip().close();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ContinuousSliderMobile

tab.ContinuousSliderMobile = function tab_ContinuousSliderMobile(viewModel) {
    tab.ContinuousSliderMobile.initializeBase(this, [ viewModel ]);
    this.viewModel = viewModel;
    this._setupSlider$3();
}
tab.ContinuousSliderMobile.prototype = {
    singleSlider: null,
    
    _setupSlider$3: function tab_ContinuousSliderMobile$_setupSlider$3() {
        var sliderParams = {};
        sliderParams.bShowSlider = true;
        sliderParams.bShowArrows = false;
        sliderParams.currentValue = this.viewModel.get_currentFraction() * this.viewModel.get_pixelWidth();
        sliderParams.isPercentageMode = true;
        sliderParams.length = this.viewModel.get_pixelWidth();
        this.singleSlider = new tableau.mobile.widget.catmode.popup.SingleSlider(sliderParams);
        var attachPoint = this.get_template().get_domRoot().get(0);
        this.singleSlider.setParentContainerNode(attachPoint);
        this.singleSlider.placeAt(attachPoint);
        this.singleSlider.setParentContainerNode(attachPoint);
        this.singleSlider.add_onPopupSliderChange(ss.Delegate.create(this, this.handleIntermediateChange));
        this.singleSlider.add_onPopupSliderDragEnd(ss.Delegate.create(this, this.applyChangeFromSlider));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.singleSlider.remove_onPopupSliderChange(ss.Delegate.create(this, this.handleIntermediateChange));
            this.singleSlider.remove_onPopupSliderDragEnd(ss.Delegate.create(this, this.applyChangeFromSlider));
            this.singleSlider.destroy();
        })));
    },
    
    onAddedToDom: function tab_ContinuousSliderMobile$onAddedToDom() {
        tab.ContinuousSliderMobile.callBaseMethod(this, 'onAddedToDom');
        this.singleSlider.startup();
    },
    
    applyChangeFromSlider: function tab_ContinuousSliderMobile$applyChangeFromSlider(value) {
        this.viewModel.set_currentFraction(value / this.viewModel.get_pixelWidth());
    },
    
    handleIntermediateChange: function tab_ContinuousSliderMobile$handleIntermediateChange(value, updated) {
        this.viewModel.applyIntermediateChange(value);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TapFeedbackArgs

tab.$create_TapFeedbackArgs = function tab_TapFeedbackArgs(parent, newEvent, finishedCallback) {
    var $o = { };
    $o.parent = parent;
    $o.event = newEvent;
    $o.finishedCallback = finishedCallback;
    return $o;
}


////////////////////////////////////////////////////////////////////////////////
// tab.PressFeedbackArgs

tab.$create_PressFeedbackArgs = function tab_PressFeedbackArgs(parent, newEvent) {
    var $o = { };
    $o.parent = parent;
    $o.event = newEvent;
    return $o;
}


Type.registerNamespace('tableau.mobile');

Type.registerNamespace('tableau.mobile.widget.ui');

////////////////////////////////////////////////////////////////////////////////
// tab.PaneTableViewMobile

tab.PaneTableViewMobile = function tab_PaneTableViewMobile(paneTableVM) {
    this._scrollAnimationIntervalId$3 = -1;
    tab.PaneTableViewMobile.initializeBase(this, [ paneTableVM, new tab.PaneTableTemplateMobile() ]);
    this._allScrollableRegionKeys$3 = [];
    this._allScrollableRegionKeys$3.addRange(tab.PaneTableView.scrollableYRegions);
    this._allScrollableRegionKeys$3.remove('viz');
    this._allScrollableRegionKeys$3.addRange(tab.PaneTableView.scrollableXRegions);
    this.init();
}
tab.PaneTableViewMobile.prototype = {
    _allScrollableRegionKeys$3: null,
    _inputHandlers$3: null,
    _iscrollers$3: null,
    _pressFeedback$3: null,
    _pinchInThisGestureSequence$3: false,
    _areaSelect$3: false,
    _appendingSelection$3: false,
    
    get__isAppending: function tab_PaneTableViewMobile$get__isAppending() {
        return this._appendingSelection$3;
    },
    set__isAppending: function tab_PaneTableViewMobile$set__isAppending(value) {
        this._appendingSelection$3 = value;
        return value;
    },
    
    get_mapsSearchViewMobile: function tab_PaneTableViewMobile$get_mapsSearchViewMobile() {
        return this.mapsSearchView;
    },
    
    getDomNodeForContentRegion: function tab_PaneTableViewMobile$getDomNodeForContentRegion(domNode) {
        return domNode.get(0).firstChild;
    },
    
    makeFloatingZoomToolbar: function tab_PaneTableViewMobile$makeFloatingZoomToolbar(viewNode) {
        var api = new tab.FZTOpsMobile(this);
        var floatingZoomToolbarMobile = new tab.FloatingZoomToolbarMobile(viewNode.get(0), api, this.shouldUseFullFloatingZoomToolbar(), this.get_mapsSearchEnabled());
        floatingZoomToolbarMobile.addClass(tab.PaneTableView.suppressVizTooltipsAndOverlays);
        return floatingZoomToolbarMobile;
    },
    
    makeRegions: function tab_PaneTableViewMobile$makeRegions() {
        var nonVizRegions = this.listNonVizRegions();
        var noPanZoom = function() {
            return false;
        };
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(nonVizRegions));
        while ($enum1.moveNext()) {
            var regionKey = $enum1.current;
            var regionDomNode = nonVizRegions[regionKey];
            this.regions[regionKey] = new tab.TiledViewerRegionMobile(regionKey, regionDomNode.get(0).firstChild, this.get_session(), noPanZoom, this.get_sheetid(), this.get_paneTableVM());
        }
        var allowPanZoomCallback = ss.Delegate.create(this, this.allowPanZoom);
        this.regions['viz'] = new tab.TiledViewerRegionMobile('viz', this.dom.view.get(0).firstChild, this.get_session(), allowPanZoomCallback, this.get_sheetid(), this.get_paneTableVM());
    },
    
    makeTooltip: function tab_PaneTableViewMobile$makeTooltip() {
        var contextProvider = null;
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            contextProvider = new tab.TooltipContextProvider(this.get_paneTableVM().get_visualModel().get_selectionsModel());
        }
        var mode = this.get_paneTableVM().get_visualModel().get_tooltipMode();
        var isTooltipAllowed = ss.isNullOrUndefined(tsConfig.allow_tooltip) || tsConfig.allow_tooltip;
        if (!isTooltipAllowed || mode === 'none') {
            return new tab.TooltipDisabledMode(contextProvider, this.get_visualId());
        }
        else if (mode === 'smooth' && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.selectionToolsMobile)) {
            return new tab.TooltipResponsiveMode(contextProvider, this.get_visualId());
        }
        else {
            return new tab.TooltipLegacyMode(contextProvider, this.get_visualId());
        }
    },
    
    makeInputHandlers: function tab_PaneTableViewMobile$makeInputHandlers() {
        var spec;
        this._inputHandlers$3 = {};
        this._iscrollers$3 = {};
        var nonVizRegions = this.listNonVizRegions();
        var scrollOptions = spiff.$create_MobileScrollerOptions();
        scrollOptions.displayPolicy = 'never';
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(nonVizRegions));
        while ($enum1.moveNext()) {
            var regionKey = $enum1.current;
            var regionDomNode = nonVizRegions[regionKey];
            spec = this._makeTouchSpec$3(this._getMobileRegion$3(regionKey));
            this._makeTouchHandlerAndScroller$3(regionKey, regionDomNode, spec, scrollOptions);
        }
        spec = this._makeTouchSpec$3(this._getMobileRegion$3('viz'));
        scrollOptions.displayPolicy = 'active';
        this._makeTouchHandlerAndScroller$3('viz', this.dom.view, spec, scrollOptions);
        spiff.DragDropManager.add_dragStarted(ss.Delegate.create(this, this._onDragStarted$3));
        spiff.DragDropManager.add_dragEnded(ss.Delegate.create(this, this._onDragEnded$3));
    },
    
    _onDragStarted$3: function tab_PaneTableViewMobile$_onDragStarted$3(d) {
        if (ss.isValue(spiff.DragDropManager.get_lastDragEvent())) {
            this.checkForSuppressTooltipsAndOverlays(spiff.DragDropManager.get_lastDragEvent().target);
        }
    },
    
    _onDragEnded$3: function tab_PaneTableViewMobile$_onDragEnded$3(r) {
        this.get_vizToolTip().get_tooltip().setSuppressTooltip(false);
    },
    
    destroyInputHandlers: function tab_PaneTableViewMobile$destroyInputHandlers() {
        if (ss.isValue(this._inputHandlers$3)) {
            var $dict1 = this._inputHandlers$3;
            for (var $key2 in $dict1) {
                var pair = { key: $key2, value: $dict1[$key2] };
                pair.value.dispose();
            }
            Object.clearKeys(this._inputHandlers$3);
            this._inputHandlers$3 = null;
        }
        if (ss.isValue(this._iscrollers$3)) {
            var $dict3 = this._iscrollers$3;
            for (var $key4 in $dict3) {
                var pair = { key: $key4, value: $dict3[$key4] };
                pair.value.dispose();
            }
            Object.clearKeys(this._iscrollers$3);
            this._iscrollers$3 = null;
        }
        if (ss.isValue(this.regions)) {
            var $dict5 = this.regions;
            for (var $key6 in $dict5) {
                var pair = { key: $key6, value: $dict5[$key6] };
                pair.value.destroy();
            }
            Object.clearKeys(this.regions);
        }
        spiff.DragDropManager.remove_dragStarted(ss.Delegate.create(this, this._onDragStarted$3));
        spiff.DragDropManager.remove_dragEnded(ss.Delegate.create(this, this._onDragEnded$3));
    },
    
    makeMapsSearchViewConnections: function tab_PaneTableViewMobile$makeMapsSearchViewConnections() {
        if (ss.isValue(this.mapsSearchView)) {
            this.mapsSearchView.get_compositeSearchWidget().get_textInputView().get_inputElement().focusin(ss.Delegate.create(this, function(e) {
                this.get_vizToolTip().get_tooltip().close();
            }));
            this.mapsSearchView.get_compositeSearchWidget().get_textInputView().get_inputElement().keypress(ss.Delegate.create(this, function(e) {
                this.get_vizToolTip().get_tooltip().close();
            }));
        }
    },
    
    makeRegionContentProviders: function tab_PaneTableViewMobile$makeRegionContentProviders() {
        var onQueueComplete = ss.Delegate.create(this, function(sender, e) {
            this.regions['viz'].reset();
        });
        this.makeRegionContentProvidersHelper(this.dom.view, onQueueComplete);
        this._connectScrollersToRegions$3();
    },
    
    makeTiledWindow: function tab_PaneTableViewMobile$makeTiledWindow(domNode, sessionRef, controllerRef, getRID, optionalCallback) {
        return this.makeTiledWindowHelper(domNode, sessionRef, controllerRef, getRID, optionalCallback, false);
    },
    
    refreshScrollingAndDrilling: function tab_PaneTableViewMobile$refreshScrollingAndDrilling() {
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(this._iscrollers$3));
        while ($enum1.moveNext()) {
            var p = $enum1.current;
            this._iscrollers$3[p].refresh();
        }
    },
    
    setRegionGeometryHelper: function tab_PaneTableViewMobile$setRegionGeometryHelper(domNode, marginBoxSpec) {
        if (ss.isValue(domNode.get(0).firstChild) && $(domNode.get(0).firstChild).hasClass('tvMScrollContainer')) {
            var dummy = tab.$create_Rect(0, 0, marginBoxSpec.w, marginBoxSpec.h);
            tab.DomUtil.setMarginBox(domNode.get(0).firstChild, dummy);
        }
    },
    
    allowPanZoom: function tab_PaneTableViewMobile$allowPanZoom() {
        return this.isMap;
    },
    
    maybeShowOverlayImages: function tab_PaneTableViewMobile$maybeShowOverlayImages(ubertipModel) {
    },
    
    checkForHoverOverlay: function tab_PaneTableViewMobile$checkForHoverOverlay() {
    },
    
    updateRegionContentProvider: function tab_PaneTableViewMobile$updateRegionContentProvider(regionKey, canvasView) {
        tab.PaneTableViewMobile.callBaseMethod(this, 'updateRegionContentProvider', [ regionKey, canvasView ]);
        this._getMobileRegion$3(regionKey)._setScrollerScrollTargetToRegionContent();
    },
    
    _makeTouchSpec$3: function tab_PaneTableViewMobile$_makeTouchSpec$3(region) {
        var spec = spiff.$create_EventHandleSpec();
        spec.potentialTap = ss.Delegate.create(this, function(e) {
            this._onFingerUp$3(region, e);
        });
        spec.tap = ss.Delegate.create(this, function(e) {
            this._onTap$3(region, e);
        });
        spec.lastTouch = ss.Delegate.create(this, function(e) {
            this._onLastTouch$3(region, e);
        });
        if (tsConfig.allow_filter || !this.isMap) {
            spec.dragStart = ss.Delegate.create(this, function(e) {
                this._onDragStart$3(region, e);
            });
            spec.dragMove = ss.Delegate.create(this, function(e) {
                this._onDragMove$3(region, e);
            });
            spec.dragEnd = ss.Delegate.create(this, function(e) {
                this._onDragEnd$3(region, e);
            });
        }
        if (region.get_regionPart() === 'viz') {
            spec.firstTouch = ss.Delegate.create(this, function(e) {
                this._onFirstTouch$3(region, e);
            });
            spec.doubleTap = ss.Delegate.create(this, function(e) {
                this._onDoubleTap$3(region, e);
            });
            spec.potentialPress = ss.Delegate.create(this, function(e) {
                this._onPotentialPress$3(region, e);
            });
            spec.cancelPotentialPress = ss.Delegate.create(this, function(e) {
                this._onCancelPotentialPress$3(region, e);
            });
            spec.pressDragStart = ss.Delegate.create(this, function(e) {
                this._onPressDragStart$3(region, e);
            });
            spec.pressDragMove = ss.Delegate.create(this, function(e) {
                this._onPressDragMove$3(region, e);
            });
            spec.pressDragEnd = ss.Delegate.create(this, function(e) {
                this._onPressDragEnd$3(region, e);
            });
            if (tsConfig.allow_filter && this.isMap) {
                spec.pinchStart = ss.Delegate.create(this, function(e) {
                    this._onPinchStart$3(region, e);
                });
                spec.pinchMove = ss.Delegate.create(this, function(e) {
                    this._onPinchMove$3(region, e);
                });
                spec.pinchEnd = ss.Delegate.create(this, function(e) {
                    this._onPinchEnd$3(region, e);
                });
            }
        }
        return spec;
    },
    
    _makeTouchHandlerAndScroller$3: function tab_PaneTableViewMobile$_makeTouchHandlerAndScroller$3(regionName, domNode, spec, scrollOptions) {
        var uniqueScrollOptions = $.extend(spiff.$create_MobileScrollerOptions(), scrollOptions);
        this._inputHandlers$3[regionName] = new spiff.TableauEventHandler(domNode.get(0), spec);
        this._iscrollers$3[regionName] = new spiff.MobileScroller(domNode.get(0).firstChild.firstChild, null, uniqueScrollOptions);
    },
    
    _connectScrollersToRegions$3: function tab_PaneTableViewMobile$_connectScrollersToRegions$3() {
        var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(this._iscrollers$3));
        while ($enum1.moveNext()) {
            var region = $enum1.current;
            this._iscrollers$3[region].set_isCssScrollingEnabled(Type.canCast(this.regions[region].get_contentProvider(), tab.TiledWindow));
            this._getMobileRegion$3(region).setScroller(this._iscrollers$3[region]);
            this._getMobileRegion$3(region)._setScrollerScrollTargetToRegionContent();
        }
    },
    
    _onFingerUp$3: function tab_PaneTableViewMobile$_onFingerUp$3(region, pseudoEvent) {
        tab.FeedbackMobile.createTapFeedback(this.dom.get_domRoot().closest('.tab-dashboard').get(0), pseudoEvent);
        pseudoEvent.stopPropagation();
    },
    
    _showMapsSearchAfterTouchEvent$3: function tab_PaneTableViewMobile$_showMapsSearchAfterTouchEvent$3() {
        if (ss.isValue(this.mapsSearchView) && this.get_mapsSearchEnabled()) {
            this.mapsSearchView.get_compositeSearchWidget().removeList();
            this.mapsSearchView.set_isVisible(true);
        }
    },
    
    _onTap$3: function tab_PaneTableViewMobile$_onTap$3(region, pseudoEvent) {
        pseudoEvent.stopPropagation();
        if (ss.isValue(this.mapsSearchView)) {
            this.mapsSearchView.get_compositeSearchWidget().get_textInputView().get_inputElement().blur();
        }
        this.get_vizToolTip().onTap();
        this.disposeOfOverlayImages();
        var regionCoords = region.toLocalCoordsEvent(pseudoEvent);
        var pageCoords = tab.PointUtil.add(regionCoords, tab.RecordCast.dojoCoordsAsPoint(region.getLocalOffset()));
        var action = tab.ResolveSelectAction.fromNormalizedEvent(pseudoEvent);
        if (this._appendingSelection$3 && action === 'simple') {
            action = 'toggle';
        }
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            this.handleLocalTap(region, action, pageCoords, regionCoords);
        }
        else {
            var tooltipCallback = ss.Delegate.create(this, function() {
                var targetType = tab.PaneTableView.guessTooltipTargetTypeFromRegion(region.get_regionPart());
                this.get_vizToolTip().singleSelectCoordinates(pageCoords, regionCoords, region.get_regionPart(), targetType);
            });
            var regionSelectionRect = tab.$create_RectXY(regionCoords.x, regionCoords.y, 0, 0);
            tab.SelectionClientCommands.selectRectRegionAndDoUbertip(region.get_regionPart(), regionSelectionRect, action, this.get_paneTableVM().get_visualId(), tooltipCallback);
        }
        this._showMapsSearchAfterTouchEvent$3();
    },
    
    _onDoubleTap$3: function tab_PaneTableViewMobile$_onDoubleTap$3(region, pseudoEvent) {
        pseudoEvent.preventDefault();
        pseudoEvent.stopPropagation();
        this.doDoubleTap(region, pseudoEvent, 2);
    },
    
    _onDragStart$3: function tab_PaneTableViewMobile$_onDragStart$3(region, pseudoEvent) {
        switch (region.get_currentPointerToolMode()) {
            case 'rectSelect':
            case 'radialSelect':
            case 'lassoSelect':
                this._onAreaSelectStart$3(region, pseudoEvent);
                break;
            case 'pan':
                this._onPanStart$3(region, pseudoEvent);
                break;
            case 'singleSelect':
                this._onSingleSelectDragStart$3(region, pseudoEvent);
                break;
            default:
                break;
        }
    },
    
    _onDragMove$3: function tab_PaneTableViewMobile$_onDragMove$3(region, pseudoEvent) {
        if (this._areaSelect$3) {
            this._onAreaSelectMove$3(region, pseudoEvent);
        }
        else if (region.get_currentPointerToolMode() === 'singleSelect') {
            this._onSingleSelectMove$3(region, pseudoEvent);
        }
        else {
            this._onPanMove$3(region, pseudoEvent);
        }
    },
    
    _onDragEnd$3: function tab_PaneTableViewMobile$_onDragEnd$3(region, pseudoEvent) {
        if (this._areaSelect$3) {
            this._onAreaSelectEnd$3(region, pseudoEvent);
        }
        else {
            this._onPanEnd$3(region, pseudoEvent);
        }
        this._showMapsSearchAfterTouchEvent$3();
    },
    
    _allowPanOnDrag$3: function tab_PaneTableViewMobile$_allowPanOnDrag$3() {
        return (this.isMap && this.isOneVisiblePane()) || this._pinchInThisGestureSequence$3;
    },
    
    _onPinchStart$3: function tab_PaneTableViewMobile$_onPinchStart$3(region, pseudoEvent) {
        if (this.allowPanZoom()) {
            tab.Log.get(this).debug('pinch start {0}', region.get_name());
            var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
            this._pinchInThisGestureSequence$3 = true;
            region._panScaleStart(pseudoEvent, pane);
        }
    },
    
    _onPinchMove$3: function tab_PaneTableViewMobile$_onPinchMove$3(region, pseudoEvent) {
        this.disposeOfOverlayImages();
        tab.Log.get(this).debug('pinch move. Scale: {0} {1}', pseudoEvent.get_gestureInfo().scale.toFixed(2), region.get_name());
        var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
        region._panScale(pseudoEvent, pane, this.geometry.pi);
    },
    
    _onPinchEnd$3: function tab_PaneTableViewMobile$_onPinchEnd$3(region, pseudoEvent) {
        var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
        region._panScaleEnd(pseudoEvent, pane, this.geometry.pi);
        this.get_vizToolTip().onPinchEnd(region._getCoords());
        this._showMapsSearchAfterTouchEvent$3();
    },
    
    _onPotentialPress$3: function tab_PaneTableViewMobile$_onPotentialPress$3(region, pseudoEvent) {
        if (this._allowAreaSelectOnPress$3(region)) {
            this.disposeOfOverlayImages();
            var parent = this.dom.get_domRoot();
            this._pressFeedback$3 = tab.FeedbackMobile.createPressFeedback(parent.get(0), pseudoEvent);
        }
    },
    
    _onCancelPotentialPress$3: function tab_PaneTableViewMobile$_onCancelPotentialPress$3(region, pseudoEvent) {
        if (ss.isValue(this._pressFeedback$3)) {
            this._pressFeedback$3.onPressEnd();
        }
    },
    
    _onAreaSelectStart$3: function tab_PaneTableViewMobile$_onAreaSelectStart$3(region, pseudoEvent) {
        if (ss.isValue(this.zoomToolbar)) {
            this.zoomToolbar.enableUserInteraction(false);
        }
        this._areaSelect$3 = true;
        region._areaSelectStart(pseudoEvent);
    },
    
    _onPanStart$3: function tab_PaneTableViewMobile$_onPanStart$3(region, pseudoEvent) {
        if (this._allowPanOnDrag$3()) {
            tab.Log.get(this).debug('pan start %s', region.get_name());
            var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
            region._panScaleStart(pseudoEvent, pane);
        }
        else {
            this._doScroll$3(region, pseudoEvent, 'touchStart');
        }
    },
    
    _onSingleSelectDragStart$3: function tab_PaneTableViewMobile$_onSingleSelectDragStart$3(region, pseudoEvent) {
        pseudoEvent.preventDefault();
    },
    
    _onAreaSelectMove$3: function tab_PaneTableViewMobile$_onAreaSelectMove$3(region, pseudoEvent) {
        pseudoEvent.preventDefault();
        region._areaSelectMove(pseudoEvent);
        this.checkForDragOverlays();
    },
    
    _onPanMove$3: function tab_PaneTableViewMobile$_onPanMove$3(region, pseudoEvent) {
        if (this._allowPanOnDrag$3()) {
            this.disposeOfOverlayImages();
            tab.Log.get(this).debug('panning %s', region.get_name());
            var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
            region._panScale(pseudoEvent, pane, this.geometry.pi);
        }
        else {
            this._doScroll$3(region, pseudoEvent, 'touchMove');
        }
    },
    
    _onSingleSelectMove$3: function tab_PaneTableViewMobile$_onSingleSelectMove$3(region, pseudoEvent) {
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode() && region.get_regionPart() === 'viz') {
            this.disposeOfOverlayImages();
            var regionCoords = region.toLocalCoordsEvent(pseudoEvent);
            var pageCoords = tab.PointUtil.add(regionCoords, tab.RecordCast.dojoCoordsAsPoint(region.getLocalOffset()));
            region.get_shapeSelector().setSingleSelectPoint(regionCoords);
            var selectionRect = tab.$create_RectXY(regionCoords.x, regionCoords.y, 1, 1);
            var interactedTuples = region.hitTestMarks(selectionRect, true);
            var interactedVisualParts = region.hitTestVisualPartsHelper(selectionRect, true, interactedTuples);
            var tooltipObject = tab.HitTestResult.tieBreakHits(interactedTuples, interactedVisualParts);
            if (tooltipObject.get_hitType() !== tab.HitResultHitType.noHit && tooltipObject.get_hitObjectType() === tab.HitResultObjectType.mark) {
                var selectionsModel = this.get_paneTableVM().get_visualModel().get_selectionsModel();
                var isSelected = selectionsModel.get_tupleSelection().get_ids().contains(tooltipObject.get_id());
                var paneDescriptorKey = tab.SceneUtils.getPaneDescriptorKeyFromTupleId(tooltipObject.get_id(), this.get_paneTableVM().get_scene().get_scene());
                this.get_vizToolTip().hoverOverObject(pageCoords, regionCoords, tooltipObject.get_id(), isSelected, paneDescriptorKey, 'mark', region.get_regionPart());
            }
            else {
                this.get_vizToolTip().hoverOverWhitespace(pageCoords, region.get_regionPart());
            }
        }
    },
    
    _onAreaSelectEnd$3: function tab_PaneTableViewMobile$_onAreaSelectEnd$3(region, pseudoEvent) {
        var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
        this._areaSelect$3 = true;
        region._areaSelectEnd(pseudoEvent, pane);
        if (ss.isValue(this.zoomToolbar)) {
            this.zoomToolbar.enableUserInteraction(true);
        }
    },
    
    _onPanEnd$3: function tab_PaneTableViewMobile$_onPanEnd$3(region, pseudoEvent) {
        if (this._allowPanOnDrag$3()) {
            var pane = this.resolvePane(region.toLocalCoordsEvent(pseudoEvent));
            region._panScaleEnd(pseudoEvent, pane, this.geometry.pi);
            this.get_vizToolTip().onDragEnd(region._getCoords());
        }
        else {
            this._doScroll$3(region, pseudoEvent, 'touchEnd');
        }
    },
    
    _onSingleSelectDragEnd$3: function tab_PaneTableViewMobile$_onSingleSelectDragEnd$3(region, pseudoEvent) {
        this.get_vizToolTip().onDragEnd();
    },
    
    _onFirstTouch$3: function tab_PaneTableViewMobile$_onFirstTouch$3(region, pseudoEvent) {
        if (ss.isNullOrUndefined(this.zoomToolbar)) {
            this.createZoomToolbar();
        }
        if (ss.isValue(this.mapsSearchView)) {
            this.mapsSearchView.get_compositeSearchWidget().removeList();
            this.get_mapsSearchViewMobile().removeMobileKeyboard();
        }
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode() && region.get_regionPart() === 'viz' && !this.get_vizToolTip().get_isTooltipShown() && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.responsiveUi)) {
            var coords = region.toLocalCoordsEvent(pseudoEvent);
            region.get_shapeSelector().setSingleSelectPoint(coords);
            var selectionRect = tab.$create_RectXY(coords.x, coords.y, 1, 1);
            var tupleHits = region.hitTestMarks(selectionRect, true);
            var visualPartHits = region.hitTestVisualPartsHelper(selectionRect, true, tupleHits);
            var hitObject = tab.HitTestResult.tieBreakHits(tupleHits, visualPartHits);
            switch (hitObject.get_hitObjectType()) {
                case tab.HitResultObjectType.mark:
                    this.updateOverlayTarget(hitObject.get_id(), 'press', 'marks');
                    break;
                case tab.HitResultObjectType.referenceLine:
                case tab.HitResultObjectType.trendLine:
                    this.updateOverlayTarget(hitObject.get_id(), 'press', visualPartHits[0].get_visualPart());
                    break;
            }
        }
    },
    
    _onLastTouch$3: function tab_PaneTableViewMobile$_onLastTouch$3(region, pseudoEvent) {
        var delta = region._getAndResetDelta();
        tab.Log.get(this).debug('OnLastTouch scale: %s, panx: %s, pany: %s', delta.scale, delta.x, delta.y);
        this._pinchInThisGestureSequence$3 = false;
        this.disposeOfOverlayImages();
        if (ss.isValue(this._pressFeedback$3)) {
            this._pressFeedback$3.onPressEnd(pseudoEvent);
            this._pressFeedback$3 = null;
        }
        this.showFloatingZoomToolbar(true);
        if (ss.isValue(this.zoomToolbar)) {
            this.zoomToolbar.resetVisualState();
        }
        if (!ss.isValue(delta)) {
            return;
        }
        if (this._areaSelect$3) {
            var vizRegion = Type.safeCast(this.regions['viz'], tab.TiledViewerRegionMobile);
            if (region !== vizRegion) {
                this._onAreaSelectEnd$3(vizRegion, pseudoEvent);
                this._onLastTouch$3(vizRegion, pseudoEvent);
            }
            else {
                this._areaSelect$3 = false;
                this._doAreaSelect$3(pseudoEvent, region);
            }
            if (!tab.FeatureParamsLookup.getBool(tab.FeatureParam.selectionToolsMobile)) {
                this.resetPointerToolMode();
            }
            return;
        }
        if (Math.abs(delta.scale - 1) > 0.05) {
            var paneResolverPoint = region.toLocalCoords(tab.$create_Point(pseudoEvent.get_gestureInfo().startX, pseudoEvent.get_gestureInfo().startY));
            this._doZoom$3(region, delta, paneResolverPoint);
        }
        else if (!!delta.x || !!delta.y) {
            var deltaPoint = tab.$create_Point(delta.x, delta.y);
            this._doPan$3(region, deltaPoint);
        }
    },
    
    _onPressDragStart$3: function tab_PaneTableViewMobile$_onPressDragStart$3(region, pseudoEvent) {
        if (region.isSelectingToolActive() || this._allowAreaSelectOnPress$3(region)) {
            this._onAreaSelectStart$3(region, pseudoEvent);
        }
    },
    
    _onPressDragMove$3: function tab_PaneTableViewMobile$_onPressDragMove$3(region, pseudoEvent) {
        if (region.isSelectingToolActive() || this._allowAreaSelectOnPress$3(region)) {
            this._onAreaSelectMove$3(region, pseudoEvent);
        }
    },
    
    _onPressDragEnd$3: function tab_PaneTableViewMobile$_onPressDragEnd$3(region, pseudoEvent) {
        if (region.isSelectingToolActive() || this._allowAreaSelectOnPress$3(region)) {
            this._onAreaSelectEnd$3(region, pseudoEvent);
        }
    },
    
    _doScroll$3: function tab_PaneTableViewMobile$_doScroll$3(region, pseudoEvent, scrollFunction) {
        this.disposeOfOverlayImages();
        this._lockEventToAppropriateDimension$3(region, pseudoEvent);
        var maxTransitionTime = 0;
        var vizPos = null;
        var $enum1 = ss.IEnumerator.getEnumerator(this._allScrollableRegionKeys$3);
        while ($enum1.moveNext()) {
            var scrollRegionName = $enum1.current;
            var scroller = this._iscrollers$3[scrollRegionName];
            var scrolled = scroller[scrollFunction](pseudoEvent);
            maxTransitionTime = Math.max(maxTransitionTime, scroller.get_transitionTime());
            if (scrolled) {
                this.get_vizToolTip().onScroll();
            }
            if (scrollRegionName === 'viz') {
                vizPos = this._iscrollers$3['viz'].get_scrollPos();
            }
        }
        if (scrollFunction === 'touchEnd') {
            this._syncScrollRegions$3($(pseudoEvent.currentTarget));
        }
        if (ss.isValue(vizPos)) {
            this.set_scrollPosition(vizPos);
        }
        if (this._scrollAnimationIntervalId$3 >= 0) {
            tab.WindowHelper.cancelAnimationFrame(this._scrollAnimationIntervalId$3);
            this._scrollAnimationIntervalId$3 = -1;
            this._setRegionScrollPositions$3(0);
        }
        if (!maxTransitionTime) {
            this._setRegionScrollPositions$3(1);
        }
        else {
            var startTime = Date.get_now().getTime();
            var maxTime = maxTransitionTime;
            var alreadyBounced = this._iscrollers$3['viz'].isResettingAfterBounce();
            var animationLoopEvaluator = null;
            animationLoopEvaluator = ss.Delegate.create(this, function() {
                var deltaT = Date.get_now().getTime() - startTime;
                if (deltaT > maxTime && !alreadyBounced) {
                    var paneTableScroller = this._iscrollers$3['viz'];
                    var resetting = paneTableScroller.isResettingAfterBounce() || paneTableScroller.isPointOutOfBounds(paneTableScroller.get_scrollPos());
                    if (resetting) {
                        startTime = startTime + deltaT;
                        deltaT -= maxTransitionTime;
                        maxTime = spiff.MobileScroller.defaultScrollTiming;
                        alreadyBounced = true;
                    }
                }
                if (deltaT > maxTime) {
                    this._setRegionScrollPositions$3(1);
                }
                else {
                    var timeAlpha = (deltaT) / maxTime;
                    this._setRegionScrollPositions$3(timeAlpha);
                    this._scrollAnimationIntervalId$3 = tab.WindowHelper.requestAnimationFrame(animationLoopEvaluator);
                }
            });
            this._scrollAnimationIntervalId$3 = tab.WindowHelper.requestAnimationFrame(animationLoopEvaluator);
        }
    },
    
    _syncScrollRegions$3: function tab_PaneTableViewMobile$_syncScrollRegions$3(eventTarget) {
        var scrollRegion = 'caption';
        if (eventTarget.hasClass('tab-tvView')) {
            scrollRegion = 'viz';
        }
        else if (eventTarget.hasClass('tab-tvYLabel')) {
            scrollRegion = 'yheader';
        }
        else if (eventTarget.hasClass('tab-tvLeftAxis')) {
            scrollRegion = 'leftaxis';
        }
        else if (eventTarget.hasClass('tab-tvRightAxis')) {
            scrollRegion = 'rightaxis';
        }
        else if (eventTarget.hasClass('tab-tvXLabel')) {
            scrollRegion = 'xheader';
        }
        else if (eventTarget.hasClass('tab-tvTopAxis')) {
            scrollRegion = 'topaxis';
        }
        else if (eventTarget.hasClass('tab-tvBottomAxis')) {
            scrollRegion = 'bottomaxis';
        }
        if (this._iscrollers$3[scrollRegion].get_canScrollY()) {
            var $enum1 = ss.IEnumerator.getEnumerator(tab.PaneTableView.scrollableYRegions);
            while ($enum1.moveNext()) {
                var region = $enum1.current;
                if (this._iscrollers$3[region].get_scrollPos().y !== this._iscrollers$3[scrollRegion].get_scrollPos().y) {
                    this._iscrollers$3[region].scrollTo(-this._iscrollers$3[region].get_scrollPos().x, -this._iscrollers$3[scrollRegion].get_scrollPos().y);
                }
            }
        }
        if (this._iscrollers$3[scrollRegion].get_canScrollX()) {
            var $enum2 = ss.IEnumerator.getEnumerator(tab.PaneTableView.scrollableXRegions);
            while ($enum2.moveNext()) {
                var region = $enum2.current;
                if (this._iscrollers$3[region].get_scrollPos().x !== this._iscrollers$3[scrollRegion].get_scrollPos().x) {
                    this._iscrollers$3[region].scrollTo(-this._iscrollers$3[scrollRegion].get_scrollPos().x, -this._iscrollers$3[region].get_scrollPos().y);
                }
            }
        }
    },
    
    _setRegionScrollPositions$3: function tab_PaneTableViewMobile$_setRegionScrollPositions$3(completedTransitionRatio) {
        var $enum1 = ss.IEnumerator.getEnumerator(this._allScrollableRegionKeys$3);
        while ($enum1.moveNext()) {
            var scrollRegionName = $enum1.current;
            var scroller = this._iscrollers$3[scrollRegionName];
            scroller.setScrollTransitionPoint(completedTransitionRatio);
        }
    },
    
    _doAreaSelect$3: function tab_PaneTableViewMobile$_doAreaSelect$3(e, region) {
        this.disposeOfOverlayImages();
        var action = tab.ResolveSelectAction.fromNormalizedEvent(e);
        if (this._appendingSelection$3 && action === 'simple') {
            action = 'range';
        }
        var tooltipAnchor = region.get_shapeSelector().get_tooltipAnchor();
        var vizRegion = region.get_regionPart();
        var pageTooltipAnchor = tab.PointUtil.add(tooltipAnchor, tab.RecordCast.dojoCoordsAsPoint(region.getLocalOffset()));
        var tooltipCallback = ss.Delegate.create(this, function() {
            this.get_vizToolTip().multiSelectComplete(pageTooltipAnchor, region.get_shapeSelector().get_hitTestingBox(), vizRegion);
        });
        if (tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            region.doSelectMarkAndUbertipFromSelectionShape(action, tooltipCallback);
        }
        else {
            region.get_shapeSelector().sendSelectionCommand(vizRegion, action, this.get_visualId(), tooltipCallback);
        }
    },
    
    _doPan$3: function tab_PaneTableViewMobile$_doPan$3(region, delta) {
        tab.Log.get(this).debug('finishing pan %s', region.get_name());
        var resetRegion = function() {
            region.reset();
        };
        this.get_session().pan(region.get_regionPart(), tab.$create_Point(0, 0), delta, resetRegion);
    },
    
    _doZoom$3: function tab_PaneTableViewMobile$_doZoom$3(region, delta, paneResolverPoint) {
        var rect = tab.$create_RectXY(0, 0, 0, 0);
        var paneW = this.geometry.pi.xWidths[0];
        var paneH = this.geometry.pi.yHeights[0];
        paneResolverPoint.x %= paneW;
        paneResolverPoint.y %= paneH;
        rect.w = parseInt((paneW / delta.scale));
        rect.h = parseInt((paneH / delta.scale));
        rect.x = parseInt(((paneW / 2) - (rect.w / 2) - (delta.x / delta.scale)));
        rect.y = parseInt(((paneH / 2) - (rect.h / 2) - (delta.y / delta.scale)));
        this.get_session().zoomIn(region.get_regionPart(), rect, paneResolverPoint);
    },
    
    _regionCanScrollX$3: function tab_PaneTableViewMobile$_regionCanScrollX$3(regionName) {
        return tab.PaneTableView.scrollableXRegions.contains(regionName);
    },
    
    _regionCanScrollY$3: function tab_PaneTableViewMobile$_regionCanScrollY$3(regionName) {
        return tab.PaneTableView.scrollableYRegions.contains(regionName);
    },
    
    _lockEventToAppropriateDimension$3: function tab_PaneTableViewMobile$_lockEventToAppropriateDimension$3(region, pseudoEvent) {
        if (!this._regionCanScrollX$3(region.get_regionPart())) {
            pseudoEvent.get_gestureInfo().pageX = pseudoEvent.get_gestureInfo().startX;
        }
        if (!this._regionCanScrollY$3(region.get_regionPart())) {
            pseudoEvent.get_gestureInfo().pageY = pseudoEvent.get_gestureInfo().startY;
        }
    },
    
    _getMobileRegion$3: function tab_PaneTableViewMobile$_getMobileRegion$3(regionKey) {
        return Type.safeCast(this.regions[regionKey], tab.TiledViewerRegionMobile);
    },
    
    _allowAreaSelectOnPress$3: function tab_PaneTableViewMobile$_allowAreaSelectOnPress$3(region) {
        return region.get_currentPointerToolMode() === 'pan' || !tab.FeatureParamsLookup.getBool(tab.FeatureParam.selectionToolsMobile);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FZTOpsMobile

tab.FZTOpsMobile = function tab_FZTOpsMobile(tv) {
    this._tv = tv;
}
tab.FZTOpsMobile.prototype = {
    _tv: null,
    
    zoomHome: function tab_FZTOpsMobile$zoomHome() {
        this._tv.zoomHome();
    },
    
    zoomIn: function tab_FZTOpsMobile$zoomIn() {
    },
    
    zoomOut: function tab_FZTOpsMobile$zoomOut() {
    },
    
    setPointerToolMode: function tab_FZTOpsMobile$setPointerToolMode(pointerToolMode, isLocked) {
        this._tv.setPointerToolMode(pointerToolMode, isLocked);
    },
    
    setAppendMode: function tab_FZTOpsMobile$setAppendMode(isAppending) {
        this._tv.set__isAppending(isAppending);
    },
    
    anyButtonTouched: function tab_FZTOpsMobile$anyButtonTouched() {
        if (ss.isValue(this._tv.get_mapsSearchViewMobile())) {
            this._tv.get_mapsSearchViewMobile().removeMobileKeyboard();
        }
    },
    
    defaultPointerToolMode: function tab_FZTOpsMobile$defaultPointerToolMode() {
        return this._tv.defaultPointerToolMode();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PaneTableTemplateMobile

tab.PaneTableTemplateMobile = function tab_PaneTableTemplateMobile() {
    tab.PaneTableTemplateMobile.initializeBase(this, [ $(tab.PaneTableTemplateMobile.htmlTemplate) ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParameterControlViewMobile

tab.ParameterControlViewMobile = function tab_ParameterControlViewMobile(viewModel) {
    tab.ParameterControlViewMobile.initializeBase(this, [ viewModel ]);
}
tab.ParameterControlViewMobile.prototype = {
    
    makeParameterControl: function tab_ParameterControlViewMobile$makeParameterControl(oProps) {
        return new tableau.mobile.widget.ParameterControlMobile(oProps);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuickFilterDisplayViewMobile

tab.QuickFilterDisplayViewMobile = function tab_QuickFilterDisplayViewMobile(viewModel) {
    tab.QuickFilterDisplayViewMobile.initializeBase(this, [ viewModel ]);
}
tab.QuickFilterDisplayViewMobile.prototype = {
    
    makeFilterPanel: function tab_QuickFilterDisplayViewMobile$makeFilterPanel(oProps) {
        return new tableau.mobile.widget.FilterPanelMobile(oProps);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.BasePopupMobile

tab.BasePopupMobile = function tab_BasePopupMobile() {
    this.templateString = tab.BasePopupMobile.basePopupTemplate;
    this._disposables$1 = new tab.DisposableHolder();
    tab.BasePopupMobile.initializeBase(this);
}
tab.BasePopupMobile.prototype = {
    touchHandler: null,
    _topic$1: null,
    _topic2$1: null,
    _scaleFactor$1: 1,
    _xPos$1: 0,
    _yPos$1: 0,
    _pageX$1: null,
    _pageY$1: null,
    _mode$1: '',
    qf: null,
    widgetsInTemplate: true,
    _hasControls$1: false,
    _tools: null,
    optionsWidget: null,
    _searchWidget$1: null,
    _titleContents: null,
    _borderNode: null,
    _shadowNode: null,
    _title: null,
    _title$1: null,
    _searchPane: null,
    _layoutContainer: null,
    _applyPane: null,
    containerNode: null,
    contentContainerNode: null,
    domSearch: null,
    domOptions: null,
    domContent: null,
    domApplyButton: null,
    list: null,
    _content$1: null,
    _moveDragSource$1: null,
    
    add_dispatchItemsChanged: function tab_BasePopupMobile$add_dispatchItemsChanged(value) {
        this.__dispatchItemsChanged$1 = ss.Delegate.combine(this.__dispatchItemsChanged$1, value);
    },
    remove_dispatchItemsChanged: function tab_BasePopupMobile$remove_dispatchItemsChanged(value) {
        this.__dispatchItemsChanged$1 = ss.Delegate.remove(this.__dispatchItemsChanged$1, value);
    },
    
    __dispatchItemsChanged$1: null,
    
    get_searchWidget: function tab_BasePopupMobile$get_searchWidget() {
        return this._searchWidget$1;
    },
    set_searchWidget: function tab_BasePopupMobile$set_searchWidget(value) {
        this._searchWidget$1 = value;
        return value;
    },
    
    get_title: function tab_BasePopupMobile$get_title() {
        return this._title$1;
    },
    set_title: function tab_BasePopupMobile$set_title(value) {
        this._title$1 = value;
        return value;
    },
    
    get_list: function tab_BasePopupMobile$get_list() {
        return this.list;
    },
    set_list: function tab_BasePopupMobile$set_list(value) {
        this.list = value;
        return value;
    },
    
    get_content: function tab_BasePopupMobile$get_content() {
        return this._content$1;
    },
    set_content: function tab_BasePopupMobile$set_content(value) {
        this._content$1 = value;
        return value;
    },
    
    get__categoricalFilter$1: function tab_BasePopupMobile$get__categoricalFilter$1() {
        return this.qf;
    },
    
    get__hackHackAnyQFCast$1: function tab_BasePopupMobile$get__hackHackAnyQFCast$1() {
        return this.qf;
    },
    
    update: function tab_BasePopupMobile$update(popupParams) {
        if (this._hasControls$1) {
            if (!!this._tools) {
                this._tools.update(this.qf);
            }
            if (!!this.optionsWidget) {
                this.optionsWidget.update(this.qf);
            }
            if (!!this.get_searchWidget()) {
                this.get_searchWidget().update(this.qf);
            }
        }
        if (!!this.get__hackHackAnyQFCast$1().oFilter) {
            if (this.get__hackHackAnyQFCast$1().oFilter.all) {
                dojo.addClass(this.domNode, 'CFAll');
            }
            else {
                dojo.removeClass(this.domNode, 'CFAll');
            }
            if (this.get__hackHackAnyQFCast$1().oFilter.exclude) {
                dojo.addClass(this.domNode, 'CFExclusive');
            }
            else {
                dojo.removeClass(this.domNode, 'CFExclusive');
            }
        }
        if ((typeof(this._refreshContent) === 'function')) {
            this._refreshContent(popupParams);
            this.doResize(null, null);
        }
    },
    
    postMixInProperties: function tab_BasePopupMobile$postMixInProperties() {
    },
    
    postCreate: function tab_BasePopupMobile$postCreate() {
        this._moveDragSource$1 = new spiff.MoveDragSource($(this._title), $(this.containerNode));
        this._moveDragSource$1.add_endAction(ss.Delegate.create(this, this._handleMoveEnd$1));
        this.touchHandler = new spiff.TableauEventHandler(this.domNode, null);
        spiff.GlobalTouchWatcher.add_firstTouch(ss.Delegate.create(this, this.onGlobalFirstTouch));
        this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._moveDragSource$1.remove_endAction(ss.Delegate.create(this, this._handleMoveEnd$1));
            spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this.onGlobalFirstTouch));
        })));
        this._layoutContainer.resize();
    },
    
    _handleMoveEnd$1: function tab_BasePopupMobile$_handleMoveEnd$1(e) {
        var newPosition = $(this.containerNode).position();
        this._pageX$1 = newPosition.left;
        this._pageY$1 = newPosition.top;
    },
    
    createControls: function tab_BasePopupMobile$createControls() {
        if (this._hasControls$1) {
            return;
        }
        this._hasControls$1 = true;
        this._tools = new tableau.mobile.widget.catmode.popup.ControlsToolbar({ qf: this.get__hackHackAnyQFCast$1() }, this._tools);
        if (this.get__hackHackAnyQFCast$1().declaredClass.indexOf('Quantitative') < 0 && this.get__hackHackAnyQFCast$1().declaredClass.indexOf('Relative') < 0 && this.get__hackHackAnyQFCast$1().mode !== 'typeinlist') {
            if (this._usingFilteringSearchWidget$1()) {
                this.set_searchWidget(this._makeFilteringSearchWidgetMobile$1());
            }
            else {
                this.set_searchWidget(this._makeSearchWidgetMobile$1());
            }
        }
        var isAll = this.get__hackHackAnyQFCast$1().oFilter.all;
        if (isAll) {
            dojo.addClass(this.domNode, 'CFAll');
        }
        else {
            dojo.removeClass(this.domNode, 'CFAll');
        }
        if (this.get__hackHackAnyQFCast$1().oFilter.exclude) {
            dojo.addClass(this.domNode, 'CFExclusive');
        }
        else {
            dojo.removeClass(this.domNode, 'CFExclusive');
        }
        if (!this.get__hackHackAnyQFCast$1().shouldHideContextMenu()) {
            this.optionsWidget = this._makeOptionsWidget$1({ qf: this.get__hackHackAnyQFCast$1(), popup: this, hideExclusiveVsInclusiveInMenu: this._tools.hideExclusiveVsInclusiveInMenu, hideSingleVsMultipleInMenu: this._tools.hideSingleVsMultipleInMenu, hideNullControls: this._tools.hideNullControls });
        }
        if (this.get__hackHackAnyQFCast$1().declaredClass.indexOf('Categorical') >= 0 && this.get__categoricalFilter$1().shouldDeferChanges()) {
            this.get__categoricalFilter$1().get_modeContents().appendApplyButton($(this.domApplyButton));
        }
        if (!!this.get_searchWidget()) {
            this._connectSearchWidget$1();
            this.get_searchWidget().startup();
        }
        var domainTappedHandler = ss.Delegate.create(this, function() {
            if (!!this.get_searchWidget()) {
                this.get_searchWidget().hideUI();
            }
            this.get__hackHackAnyQFCast$1().toggleDomain();
            if ((typeof('this'._resetScrollPos) === 'function')) {
                this._resetScrollPos();
            }
        });
        this._tools.add_domainTapped(domainTappedHandler);
        this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._tools.remove_domainTapped(domainTappedHandler);
        })));
        var resetTappedHandler = ss.Delegate.create(this, function() {
            if (!!this.get_searchWidget()) {
                this.get_searchWidget().hideUI();
            }
            this.get__hackHackAnyQFCast$1().toggleReset();
        });
        this._tools.add_resetTapped(resetTappedHandler);
        this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._tools.remove_resetTapped(resetTappedHandler);
        })));
        if (!!this.optionsWidget) {
            var optionsTappedHandler = ss.Delegate.create(this, function() {
                this.optionsWidget.toggleUI();
                if (!!this.get_searchWidget()) {
                    this.get_searchWidget().hideUI();
                }
                this.doResize(null, null);
            });
            this._tools.add_optionsTapped(optionsTappedHandler);
            this.optionsWidget.add_hideUICalled(ss.Delegate.create(this, this._optionsHide$1));
            this.optionsWidget.add_handleOptionsSelection(ss.Delegate.create(this, this._optionsWidgetModeChanged$1));
            this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this._tools.remove_optionsTapped(optionsTappedHandler);
                this.optionsWidget.remove_hideUICalled(ss.Delegate.create(this, this._optionsHide$1));
                this.optionsWidget.remove_handleOptionsSelection(ss.Delegate.create(this, this._optionsWidgetModeChanged$1));
            })));
        }
    },
    
    _connectSearchWidget$1: function tab_BasePopupMobile$_connectSearchWidget$1() {
        if (!!this.get_searchWidget()) {
            var searchTappedHandler = ss.Delegate.create(this, function() {
                this.get_searchWidget().toggleUI();
                if (!!this.optionsWidget) {
                    this.optionsWidget.hideUI();
                }
                this.doResize(null, null);
            });
            this._tools.add_searchTapped(searchTappedHandler);
            this.get_searchWidget().add_onXButtonClickCalled(ss.Delegate.create(this, this.doResize));
            this.get_searchWidget().add_attachItemsChangedHandlerCalled(ss.Delegate.create(this, this._attachItemsChangedHandler$1));
            this.get_searchWidget().add_hideUICalled(ss.Delegate.create(this, this._searchHide$1));
            this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this._tools.remove_searchTapped(searchTappedHandler);
                this.get_searchWidget().remove_onXButtonClickCalled(ss.Delegate.create(this, this.doResize));
                this.get_searchWidget().remove_attachItemsChangedHandlerCalled(ss.Delegate.create(this, this._attachItemsChangedHandler$1));
                this.get_searchWidget().remove_hideUICalled(ss.Delegate.create(this, this._searchHide$1));
            })));
        }
    },
    
    _optionsHide$1: function tab_BasePopupMobile$_optionsHide$1() {
        this._tools.setOptionsButtonState(false);
        this.doResize(null, null);
    },
    
    _searchHide$1: function tab_BasePopupMobile$_searchHide$1() {
        this._tools.setSearchButtonState(false);
        this.doResize(null, null);
    },
    
    _optionsWidgetModeChanged$1: function tab_BasePopupMobile$_optionsWidgetModeChanged$1() {
        this.hide();
    },
    
    _attachItemsChangedHandler$1: function tab_BasePopupMobile$_attachItemsChangedHandler$1(newRef) {
        var newList = newRef;
        var itemsChangedHandler = ss.Delegate.create(this, function(changedListItem, index) {
            var state = changedListItem[0].rowState;
            if (this.get__hackHackAnyQFCast$1().declaredClass === 'tableau.mobile.widget.HierarchicalFilterMobile') {
                var changed = this.get_searchWidget()._applyChangesHier();
                this.get_searchWidget().notifyParentFilterOfChanged(changed);
            }
            else if (this._usingFilteringSearchWidget$1()) {
                return;
            }
            else if (this.get__hackHackAnyQFCast$1().mode === 'slider') {
                this.updateFromSearch(index);
            }
            else if (this.get__categoricalFilter$1().isSingleSelect()) {
                this.get_list().singleValueHitTest(index);
            }
            else {
                this.get_list().multiValueHitTest(index, state);
            }
        });
        newRef.add_dispatchItemsChanged(itemsChangedHandler);
        this._disposables$1.add(new tab.CallOnDispose(function() {
            newRef.remove_dispatchItemsChanged(itemsChangedHandler);
        }));
        var height = newList.getListSize();
        dojo.style(newList.scrollWrapper, 'height', Math.max(Math.min(200, height), 0) + 'px');
        newList.iscrollObj.refresh();
        this.doResize(null, null);
    },
    
    dispose: function tab_BasePopupMobile$dispose() {
        this._disposables$1.dispose();
        this._moveDragSource$1.dispose();
        this.touchHandler.dispose();
    },
    
    destroy: function tab_BasePopupMobile$destroy() {
        if (!!this._tools && (typeof(this._tools.destroy) === 'function')) {
            this._tools.destroy();
        }
        this.inherited(arguments);
        this.dispose();
    },
    
    onGlobalFirstTouch: function tab_BasePopupMobile$onGlobalFirstTouch(e, cancelCallback) {
        if (this.isVisible() && !tab.DomUtil.isAncestorOf(this.domNode, e.target)) {
            this.hide();
            if (ss.isValue(cancelCallback)) {
                cancelCallback(false);
            }
        }
    },
    
    isVisible: function tab_BasePopupMobile$isVisible() {
        return dojo.style(this.containerNode, 'visibility') === 'visible';
    },
    
    doResize: function tab_BasePopupMobile$doResize(newPageX, newPageY) {
        newPageX = (newPageX || this._pageX$1);
        newPageY = (newPageY || this._pageY$1);
        this.layoutPopupUsingAsyncHelpers(newPageX, newPageY);
    },
    
    hide: function tab_BasePopupMobile$hide() {
        this.prepareToHide();
        dojo.style(this.containerNode, 'visibility', 'hidden');
        dojo.style(this.containerNode, 'display', 'none');
    },
    
    prepareToHide: function tab_BasePopupMobile$prepareToHide() {
        if (!!this.get_searchWidget()) {
            this.get_searchWidget().hideUI();
        }
        if (!!this.optionsWidget) {
            this.optionsWidget.hideUI();
        }
    },
    
    show: function tab_BasePopupMobile$show(newPageX, newPageY) {
        if (!ss.isValue(this._pageX$1)) {
            this._pageX$1 = newPageX;
        }
        if (!ss.isValue(this._pageY$1)) {
            this._pageY$1 = newPageY;
        }
        dojo.style(this.containerNode, 'display', 'block');
        this.layoutPopupUsingAsyncHelpers(this._pageX$1, this._pageY$1);
        var makeVisibleFunc = function(node, obj) {
            dojo.style(node, 'visibility', 'visible');
        };
        var makeVisibleFuncClosure = dojo.partial(makeVisibleFunc, this.containerNode);
        window.setTimeout(dojo.partial(makeVisibleFuncClosure, this.containerNode), 50);
    },
    
    layoutPopupUsingAsyncHelpers: function tab_BasePopupMobile$layoutPopupUsingAsyncHelpers(newPageX, newPageY) {
        var scaleCallback = ss.Delegate.create(this, function(sf, scrollX, scrollY) {
            var viewportCallback = ss.Delegate.create(this, function(viewportRect) {
                if (!ss.isNullOrUndefined(this.domNode)) {
                    this.layoutPopup(newPageX, newPageY, sf, viewportRect);
                }
            });
            tab.BrowserViewport.getViewport(viewportCallback);
        });
        tableau.mobile.util.scaling.doWithScaleFactor(scaleCallback);
    },
    
    layoutPopup: function tab_BasePopupMobile$layoutPopup(newPageX, newPageY, sf, viewportRect) {
        var box = {};
        var scaleChanged = false;
        var reverseScaleFactor = 1 / sf;
        if (this._scaleFactor$1 !== reverseScaleFactor) {
            this._scaleFactor$1 = reverseScaleFactor;
            scaleChanged = true;
        }
        this._resizePopup$1(sf, viewportRect);
        dojo.mixin(box, dojo.marginBox(this.containerNode));
        this._scalePopup$1(reverseScaleFactor, scaleChanged);
        if (ss.isValue(newPageX)) {
            this._placePopup$1(box, newPageX, newPageY);
            this._handlePopupExcess$1(box, viewportRect);
            this._pageX$1 = box.l;
            this._pageY$1 = box.t;
        }
        dojo.marginBox(this.containerNode, box);
        tab.DomUtil.setElementPosition($(this.containerNode), box.l, box.t);
    },
    
    _resizePopup$1: function tab_BasePopupMobile$_resizePopup$1(scale, viewportRect) {
        var searchHeight = (!!this._searchPane && !!this._searchPane.domNode) ? dojo.marginBox(this._searchPane.domNode).h : 0;
        this._setApplyPaneSize$1();
        var applyHeight = (!!this._applyPane) ? dojo.marginBox(this._applyPane.domNode).h : 0;
        this._setTitleSize$1();
        var titleDims = dojo.marginBox(this._title);
        var availableHeight = this._getAvailableHeight$1(viewportRect, searchHeight, applyHeight);
        var contentDims = this.getContentDimensions(availableHeight);
        this._layoutContainer.resize({ h: contentDims.h + searchHeight + applyHeight });
        this.resizeSpecificContent({ h: contentDims.h });
        var totalHeight = contentDims.h + titleDims.h + searchHeight + applyHeight;
        dojo.style(this.containerNode, 'height', (totalHeight + 21) + 'px');
        if (!!this._borderNode) {
            dojo.style(this._borderNode, 'height', (totalHeight + 21) + 'px');
        }
        if (!!this._shadowNode) {
            dojo.style(this._shadowNode, 'height', (totalHeight - 3) + 'px');
        }
        if (!!this.contentContainerNode) {
            dojo.style(this.contentContainerNode, 'height', Math.max(totalHeight, 0) + 'px');
        }
    },
    
    _getAvailableHeight$1: function tab_BasePopupMobile$_getAvailableHeight$1(viewportRect, searchHeight, applyHeight) {
        var newScaleFactor;
        var topVizVisible;
        var botVizVisible;
        var availableHeight;
        newScaleFactor = 1 / this._scaleFactor$1;
        var viewportDims = tabBootstrap.ViewerBootstrap.get_instance().getViewport();
        var vizPosPerScreen = viewportRect.translatePositionToViewport(tab.$create_Point(0, 0));
        var topVizPerScreen = vizPosPerScreen.y;
        var botVizPerScreen = topVizPerScreen + tab.ApplicationModel.get_instance().get_workbook().get_outerDashboardPortSize().h;
        topVizVisible = Math.max(topVizPerScreen, 0);
        botVizVisible = Math.min(botVizPerScreen, viewportDims.h, viewportRect.get_dimensions().h);
        availableHeight = botVizVisible - topVizVisible;
        availableHeight = Math.floor(Math.max(availableHeight - (((searchHeight + applyHeight) / newScaleFactor) + 60), 0));
        availableHeight = newScaleFactor * availableHeight;
        return availableHeight;
    },
    
    _placePopup$1: function tab_BasePopupMobile$_placePopup$1(box, newPageX, newPageY) {
        box.l = newPageX + window.pageXOffset;
        box.t = newPageY + window.pageYOffset;
    },
    
    _scalePopup$1: function tab_BasePopupMobile$_scalePopup$1(reverseScaleFactor, scaleChanged) {
        if (scaleChanged) {
            dojo.style(this.containerNode, '-webkit-transform', 'scale(' + reverseScaleFactor + ')');
            dojo.style(this.containerNode, '-webkit-transform-origin', 'left top');
        }
    },
    
    _handlePopupExcess$1: function tab_BasePopupMobile$_handlePopupExcess$1(box, viewportRect) {
        var localPos = tab.$create_Point(box.l, box.t);
        var screenPos = viewportRect.translatePositionToViewport(localPos);
        var roomRight = Math.min(viewportRect.get_dimensions().w - screenPos.x, $(window).width() - localPos.x);
        var roomLeft = Math.min(screenPos.x, localPos.x);
        var rightExcess = box.w - roomRight;
        if (rightExcess > 0) {
            box.l -= Math.min(rightExcess, roomLeft);
        }
        if (roomLeft < 0) {
            box.l += Math.abs(roomLeft);
        }
        var roomBottom = Math.min(viewportRect.get_dimensions().h - screenPos.y, $(window).height() - localPos.y);
        var roomTop = Math.min(screenPos.y, localPos.y);
        var bottomExcess = box.h - roomBottom;
        if (bottomExcess > 0) {
            box.t -= Math.min(bottomExcess, roomTop);
        }
        if (roomTop < 0) {
            box.t += Math.abs(roomTop);
        }
    },
    
    resizeSpecificContent: function tab_BasePopupMobile$resizeSpecificContent(size) {
    },
    
    _setTitleSize$1: function tab_BasePopupMobile$_setTitleSize$1() {
        var btnCount = 0;
        if (!!this._tools && (typeof(this._tools._getButtonCount) === 'function')) {
            btnCount = this._tools._getButtonCount();
        }
        var titleDims = dojo.marginBox(this._title);
        dojo.style(this._titleContents, 'width', (titleDims.w - ((btnCount * 44) + 10)) + 'px');
    },
    
    _setApplyPaneSize$1: function tab_BasePopupMobile$_setApplyPaneSize$1() {
        dojo.style(this._applyPane.domNode, 'width', this._layoutContainer.domNode.clientWidth + 'px');
    },
    
    getContentDimensions: function tab_BasePopupMobile$getContentDimensions(availableHeight) {
        var toRet = tab.$create_DojoCoords();
        toRet.h = 0;
        toRet.l = 0;
        toRet.t = 0;
        toRet.w = 0;
        toRet.x = 0;
        toRet.y = 0;
        return toRet;
    },
    
    _makeOptionsWidget$1: function tab_BasePopupMobile$_makeOptionsWidget$1(param) {
        return new tableau.mobile.widget.OptionsWidgetMobile(param, this.domOptions);
    },
    
    _makeSearchWidgetMobile$1: function tab_BasePopupMobile$_makeSearchWidgetMobile$1() {
        var thisQf = tab.$create_SearchWidgetQfProperty();
        thisQf.qf = this.qf;
        return new tableau.mobile.widget.SearchWidgetMobile(thisQf, this.domSearch);
    },
    
    _makeFilteringSearchWidgetMobile$1: function tab_BasePopupMobile$_makeFilteringSearchWidgetMobile$1() {
        var thisQf = tab.$create_SearchWidgetQfProperty();
        thisQf.qf = this.qf;
        var updateListInPopover = ss.Delegate.create(this, function(scrollingList) {
            if (ss.isValue(this.get_list())) {
                this.get_list().destroy();
            }
            this.set_list(scrollingList);
            this.get_list().placeAt(this.domContent);
            if (ss.isValue(this.__dispatchItemsChanged$1)) {
                this.get_list().add_dispatchItemsChanged(this.__dispatchItemsChanged$1);
                this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                    this.get_list().remove_dispatchItemsChanged(this.__dispatchItemsChanged$1);
                })));
            }
        });
        return new tableau.mobile.widget.FilteringSearchWidgetMobile(thisQf, this.domSearch, updateListInPopover);
    },
    
    _usingFilteringSearchWidget$1: function tab_BasePopupMobile$_usingFilteringSearchWidget$1() {
        return this.get__hackHackAnyQFCast$1().declaredClass.indexOf('Categorical') >= 0 && ss.isValue(this.get__categoricalFilter$1()) && (this.get__categoricalFilter$1().get_mode() === 'checklist' || this.get__categoricalFilter$1().get_mode() === 'radiolist' || this.get__categoricalFilter$1().get_mode() === 'dropdown' || this.get__categoricalFilter$1().get_mode() === 'checkdropdown');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CheckDropdownMobile

tab.CheckDropdownMobile = function tab_CheckDropdownMobile(parent, div, attrs) {
    tab.CheckDropdownMobile.initializeBase(this, [ parent, div, attrs ]);
}
tab.CheckDropdownMobile.prototype = {
    
    get_popup: function tab_CheckDropdownMobile$get_popup() {
        return this.get_inplaceMobile().get_popup();
    },
    
    instantiate: function tab_CheckDropdownMobile$instantiate(tuples, itemName, facet) {
        this.setUpForPendingChanges();
        tab.CheckDropdownMobile.callBaseMethod(this, 'instantiate', [ tuples, itemName, facet ]);
    },
    
    createPopup: function tab_CheckDropdownMobile$createPopup(items, facet) {
        var title = tableau.format.formatColumnDisplayName(this.parent.get_oFilter(), false);
        var popupClass = tableau.mobile.widget.catmode.popup.ListPopup;
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.filter = this.parent;
        popupParams.listParams.listItems = items;
        popupParams.listParams.bFacet = facet;
        popupParams.title = title;
        popupParams.qf = this.parent;
        popupParams.listParams.itemFormatter = tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopupAndAttachHandler(ss.Delegate.create(this, this._applyChangesToItem$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get_popup().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$3));
        })));
        this.get_popup().createControls();
    },
    
    _applyChangesToItem$3: function tab_CheckDropdownMobile$_applyChangesToItem$3(changedItemList, listIndex) {
        if (!changedItemList.length) {
            return;
        }
        if (listIndex === tab.FilterItemUtil.allItemIndex) {
            if (ss.isValue(this._pendingManagerMobile$3())) {
                this._pendingManagerMobile$3().handleMobileItemClicked(tab.FilterItemUtil.allItemIndex, this.get_popup().get_list());
            }
            this.parent.doSelectAll(changedItemList[0].rowState);
        }
        else if (changedItemList.length === 1) {
            if (ss.isValue(this._pendingManagerMobile$3())) {
                this._pendingManagerMobile$3().handleMobileItemClicked(changedItemList[0].rowIndex, this.get_popup().get_list());
            }
            if (this.parent.get_oFilter().allChecked && !changedItemList[0].rowState) {
                this.parent.get_oFilter().allChecked = false;
            }
            this.parent.set_stateId(this.parent.get_stateId() + 1);
            var change = new tab.RawChange();
            var changelist = new tab.Changelist();
            change.setRange(new tab.IntegerRange(changedItemList[0].rowIndex, changedItemList[0].rowIndex), changedItemList[0].rowState);
            changelist.addChange(change);
            this.parent.applyChangesByChangelist(changelist);
        }
    },
    
    fetchChildNodeByIndex: function tab_CheckDropdownMobile$fetchChildNodeByIndex(index) {
        return null;
    },
    
    fetchAllItem: function tab_CheckDropdownMobile$fetchAllItem() {
        return null;
    },
    
    resetPendingVisuals: function tab_CheckDropdownMobile$resetPendingVisuals(resetCheckState) {
        var tiles = $(this.get_popup().get_list()._scrollingListArea).find('.tile');
        tab.FilterItemUtil.resetPendingFilterItems(tiles.children().get(), resetCheckState);
    },
    
    _pendingManagerMobile$3: function tab_CheckDropdownMobile$_pendingManagerMobile$3() {
        return this.pendingManager;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ChecklistMobile

tab.ChecklistMobile = function tab_ChecklistMobile(parent, div, attrs) {
    tab.ChecklistMobile.initializeBase(this, [ parent, div, attrs ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.ChecklistMobile.prototype = {
    touchHandler: null,
    iscroller: null,
    contentNode: null,
    _inplaceMobile$3: null,
    domNode: null,
    domBox: null,
    
    get_inplaceMobile: function tab_ChecklistMobile$get_inplaceMobile() {
        return this._inplaceMobile$3;
    },
    set_inplaceMobile: function tab_ChecklistMobile$set_inplaceMobile(value) {
        this._inplaceMobile$3 = value;
        return value;
    },
    
    get_popup: function tab_ChecklistMobile$get_popup() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_ChecklistMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_ChecklistMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBox() : this.domBox;
    },
    
    instantiate: function tab_ChecklistMobile$instantiate(tuples, itemName, facet) {
        this.setUpForPendingChanges();
        this.contentNode = dojo.doc.createElement('div');
        this.div.appendChild(this.contentNode);
        dojo.style(this.div, 'overflow', 'hidden');
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this.iscroller = new spiff.MobileScroller(this.contentNode, this.touchHandler, null);
        this._fillChecklistContent$3(tuples, itemName, facet);
        tableau.util.defer(ss.Delegate.create(this, function() {
            this.createPopup(tuples, facet);
        }));
    },
    
    resetContent: function tab_ChecklistMobile$resetContent(tuples, itemName, facet) {
        this._destroyPopup$3();
        var jqueryDiv = $(this.contentNode);
        jqueryDiv.empty();
        if (ss.isValue(this.tiledWidget)) {
            this.tiledWidget.destroy();
            this.tiledWidget = null;
        }
        this._fillChecklistContent$3(tuples, itemName, facet);
        this.createPopup(tuples, facet);
    },
    
    _fillChecklistContent$3: function tab_ChecklistMobile$_fillChecklistContent$3(t, itemName, facet) {
        if (this.shouldUseAllItem() && t.length > 0) {
            tab.Checklist.addAllItem($(this.contentNode), this.parent, itemName, facet, tab.Checklist.shouldCheckAllItem(this.parent.get_oFilter(), this.pendingManager), tableau.mobile.FilterItemMobile.formatChecklistFilterItemHtml);
        }
        var formatter = new tab.ChecklistContentFormatter(this.parent, itemName, tableau.mobile.FilterItemMobile.formatChecklistFilterItemHtml);
        if (ss.isValue(this.tiledWidget)) {
            this.tiledWidget.destroy();
        }
        this.tiledWidget = tab.TiledWidgetFactory.createListTiledWidget(this.parent, t, this.contentNode, formatter, this.get_lineHeight());
    },
    
    shouldNotReinstantiate: function tab_ChecklistMobile$shouldNotReinstantiate() {
        return ss.isValue(this.get_popup()) && ss.isValue(this.get_popup().get_searchWidget()) && this.get_popup().get_searchWidget().isShowingResults();
    },
    
    layout: function tab_ChecklistMobile$layout(contentSize, horizontalLayout) {
        dojo.marginBox(this.div, contentSize);
        if (!!this.iscroller) {
            this.iscroller.refresh();
        }
    },
    
    dispose: function tab_ChecklistMobile$dispose() {
        this._destroyPopup$3();
        tab.ChecklistMobile.callBaseMethod(this, 'dispose');
    },
    
    destroy: function tab_ChecklistMobile$destroy() {
        this.dispose();
    },
    
    _destroyPopup$3: function tab_ChecklistMobile$_destroyPopup$3() {
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
        if (!!this.iscroller) {
            this.iscroller.dispose();
        }
    },
    
    _applyChangesToItem$3: function tab_ChecklistMobile$_applyChangesToItem$3(changedItemList, listIndex) {
        var table = this.parent.get_oFilter().table;
        var currentState = {};
        currentState.schema = table.schema;
        currentState.tuples = [];
        var t = table.tuples;
        if (!changedItemList.length) {
            return;
        }
        if (listIndex === tab.FilterItemUtil.allItemIndex) {
            tableau.FilterItem.setChecked(this.contentNode.firstChild, changedItemList[0].rowState);
            var turnOn = !this.parent.get_oFilter().all;
            if (ss.isValue(this._pendingManagerMobile$3())) {
                this._pendingManagerMobile$3().handleMobileItemClicked(tab.FilterItemUtil.allItemIndex, this.get_popup().get_list());
            }
            this.parent.doSelectAll(turnOn);
        }
        else {
            var item = this.fetchChildNodeByIndex(changedItemList[0].rowIndex);
            tableau.FilterItem.setChecked(item, changedItemList[0].rowState);
            if (ss.isValue(this._pendingManagerMobile$3())) {
                this._pendingManagerMobile$3().handleMobileItemClicked(tableau.FilterItem.getIndex(item), this.get_popup().get_list());
            }
            if (this.parent.get_oFilter().all || this.parent.get_oFilter().allChecked) {
                currentState.tuples.push(tab.$create_TupleStruct(null, changedItemList[0].rowState, t[changedItemList[0].rowIndex].t));
            }
            else {
                for (var i = 0; i < t.length; i++) {
                    item = this.tiledWidget.getElement(i);
                    if (tableau.FilterItem.isChecked(item) !== t[i].s) {
                        currentState.tuples.push(t[i]);
                    }
                }
            }
            if (!!currentState.tuples.length) {
                this.parent.set_stateId(this.parent.get_stateId() + 1);
                var change = new tab.RawChange();
                var changelist = new tab.Changelist();
                change.setRange(new tab.IntegerRange(changedItemList[0].rowIndex, changedItemList[0].rowIndex), changedItemList[0].rowState);
                changelist.addChange(change);
                this.parent.applyChangesByChangelist(changelist);
            }
        }
    },
    
    createPopup: function tab_ChecklistMobile$createPopup(items, facet) {
        var title = tableau.format.formatColumnDisplayName(this.parent.get_oFilter(), false);
        var popupClass = tableau.mobile.widget.catmode.popup.ListPopup;
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.filter = this.parent;
        popupParams.listParams.listItems = items;
        popupParams.listParams.bFacet = facet;
        popupParams.listParams.itemFormatter = tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml;
        popupParams.title = title;
        popupParams.qf = this.parent;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopupAndAttachHandler(ss.Delegate.create(this, this._applyChangesToItem$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            if (ss.isValue(this.get_popup())) {
                this.get_popup().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$3));
            }
        })));
        this.get_popup().createControls();
    },
    
    fetchAllItem: function tab_ChecklistMobile$fetchAllItem() {
        return this.contentNode.firstChild;
    },
    
    resetPendingVisuals: function tab_ChecklistMobile$resetPendingVisuals(resetCheckState) {
        var jqueryDiv = $(this.contentNode);
        var $enum1 = ss.IEnumerator.getEnumerator(jqueryDiv.children().get());
        while ($enum1.moveNext()) {
            var checkbox = $enum1.current;
            if (tableau.FilterItem.isPending(checkbox)) {
                tableau.FilterItem.togglePendingState(checkbox);
                if (resetCheckState) {
                    tableau.FilterItem.setChecked(checkbox, !tableau.FilterItem.isChecked(checkbox));
                }
            }
        }
        var $enum2 = ss.IEnumerator.getEnumerator(this.get_popup().get_list().getRowList().get());
        while ($enum2.moveNext()) {
            var row = $enum2.current;
            if (this.get_popup().get_list().isPendingRow(row)) {
                this.get_popup().get_list().togglePendingRow(row);
                if (resetCheckState) {
                    this.get_popup().get_list().toggleSelectedRow(row);
                }
            }
        }
    },
    
    get_uniqueNodeId: function tab_ChecklistMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    _pendingManagerMobile$3: function tab_ChecklistMobile$_pendingManagerMobile$3() {
        return this.pendingManager;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DropdownMobile

tab.DropdownMobile = function tab_DropdownMobile(parent, div, attrs) {
    tab.DropdownMobile.initializeBase(this, [ parent, div, attrs ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.DropdownMobile.prototype = {
    _currentlySelected$2: 0,
    _multimode$2: false,
    domNode: null,
    domBox: null,
    fillSummary: null,
    _inplaceMobile$2: null,
    
    get_inplaceMobile: function tab_DropdownMobile$get_inplaceMobile() {
        return this._inplaceMobile$2;
    },
    set_inplaceMobile: function tab_DropdownMobile$set_inplaceMobile(value) {
        this._inplaceMobile$2 = value;
        return value;
    },
    
    get_uniqueNodeId: function tab_DropdownMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    get_domNodeElement: function tab_DropdownMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_DropdownMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBox() : this.domBox;
    },
    
    instantiate: function tab_DropdownMobile$instantiate(tuples, itemName, facet) {
        this.fillSummary = ss.Delegate.create(this, function(tupleParam, isAll) {
            this._fillDropdownSummaryContent$2(tupleParam, itemName, facet, isAll);
        });
        this.fillSummary(tuples, tab.FilterItemUtil.isAllOrAllChecked(this.parent));
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this.createPopup(tuples, facet);
    },
    
    resetContent: function tab_DropdownMobile$resetContent(tuples, itemName, facet) {
        this._destroyPopup$2();
        this.fillSummary(tuples, tab.FilterItemUtil.isAllOrAllChecked(this.parent));
        this.createPopup(tuples, facet);
    },
    
    _fillDropdownSummaryContent$2: function tab_DropdownMobile$_fillDropdownSummaryContent$2(tuples, itemName, facet, isAll) {
        var itemHTML = [];
        this._currentlySelected$2 = -1;
        this._multimode$2 = false;
        if (tab.FilterItemUtil.isAllOrAllChecked(this.parent) && this.parent.isSingleSelect()) {
            for (var i = 0; i < tuples.length; i++) {
                tuples[i].s = false;
            }
        }
        var allItemsHappenToBeChecked = true;
        if (isAll) {
            itemHTML.push(tab.FilterItemUtil.getAllItemHtml(this.parent, itemName, facet, false, tableau.mobile.FilterItemMobile.formatDropdownListFilterItemHtml));
        }
        else {
            for (var i = 0; i < tuples.length; i++) {
                if (tuples[i].s) {
                    if (!this._multimode$2) {
                        itemHTML.push(tableau.mobile.FilterItemMobile.formatDropdownListFilterItemHtml(this.parent, tuples[i], itemName, i));
                    }
                    if (this._currentlySelected$2 > -1) {
                        this._multimode$2 = true;
                        itemHTML = [];
                    }
                    else {
                        this._currentlySelected$2 = i;
                    }
                }
                else {
                    allItemsHappenToBeChecked = false;
                }
            }
        }
        if (allItemsHappenToBeChecked) {
            itemHTML = [];
            itemHTML.push(tab.FilterItemUtil.getAllItemHtml(this.parent, itemName, facet, false, tableau.mobile.FilterItemMobile.formatDropdownListFilterItemHtml));
        }
        else if (this._multimode$2 && !isAll) {
            itemHTML.push(tableau.mobile.FilterItemMobile.getDropdownHtml(itemName + '_' + tuples.length, tab.Strings.QuickFilterMultipleValues, 'true', isAll));
        }
        else if (this._currentlySelected$2 === -1 && this.hasSummaryText()) {
            itemHTML.push(tableau.mobile.FilterItemMobile.getDropdownHtml(itemName + '_' + tuples.length, this.getSummaryText(), 'true', isAll));
        }
        this.div.innerHTML = itemHTML.join('');
    },
    
    shouldNotReinstantiate: function tab_DropdownMobile$shouldNotReinstantiate() {
        return ss.isValue(this.get_inplaceMobile().get_popup()) && ss.isValue(this.get_inplaceMobile().get_popup().get_searchWidget()) && this.get_inplaceMobile().get_popup().get_searchWidget().isShowingResults();
    },
    
    destroy: function tab_DropdownMobile$destroy() {
        this.dispose();
        this._destroyPopup$2();
    },
    
    _destroyPopup$2: function tab_DropdownMobile$_destroyPopup$2() {
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
    },
    
    createPopup: function tab_DropdownMobile$createPopup(items, facet) {
        var title = tableau.format.formatColumnDisplayName(this.parent.get_oFilter(), false);
        var popupClass = tableau.mobile.widget.catmode.popup.ListPopup;
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.filter = this.parent;
        popupParams.listParams.listItems = items;
        popupParams.listParams.isMultiValue = false;
        popupParams.listParams.bFacet = facet;
        popupParams.title = title;
        popupParams.mode = 'dropdown';
        popupParams.qf = this.parent;
        popupParams.listParams.itemFormatter = tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopupAndAttachHandler(ss.Delegate.create(this, this._applyChangesToItem$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get_inplaceMobile().get_popup().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$2));
        })));
        this.get_inplaceMobile().get_popup().createControls();
    },
    
    _applyChangesToItem$2: function tab_DropdownMobile$_applyChangesToItem$2(changedItemList, listIndex) {
        var table = this.parent.get_oFilter().table;
        var aliases = [];
        var currentState = {};
        currentState.schema = table.schema;
        currentState.tuples = new Array(0);
        var t = table.tuples;
        if (changedItemList.length < 1) {
            return;
        }
        var target = changedItemList[0];
        if (target.rowIndex === tab.FilterItemUtil.allItemIndex) {
            this.parent.doSelectAll(true);
        }
        else {
            for (var j = 0; j < t.length; ++j) {
                if (listIndex === j && !t[j].s) {
                    t[j].s = true;
                    currentState.tuples.push(t[j]);
                    break;
                }
                else if (t[j].s) {
                    t[j].s = false;
                }
            }
            this.fillSummary(currentState.tuples, tab.FilterItemUtil.isAllOrAllChecked(this.parent));
            var alias = this.parent.get_oFilter().table.tuples[listIndex].d || this.parent.get_oFilter().table.tuples[listIndex].t[0].v;
            aliases.push(alias);
            if (!!currentState.tuples.length) {
                this.parent.set_stateId(this.parent.get_stateId() + 1);
                tab.FilterClientCommands.setCategoricalFilterValues(this.parent.get_session().get_visualId(), this.parent.get_field(), 'filter-replace', aliases);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.HierarchicalFilterMobile

tab.HierarchicalFilterMobile = function tab_HierarchicalFilterMobile(filterProps) {
    tab.HierarchicalFilterMobile.initializeBase(this, [ filterProps ]);
    this.templateString = "<div class='MobilePanel HierarchicalFilterMobile'>" + "<div class='MobilePanelBox HierarchicalFilterMobileBox' dojoAttachPoint='domBox'>" + "<div class='TitleAndControls' dojoAttachPoint='domControls'>" + "<div class='FilterTitle' dojoAttachPoint='domTitleBar'></div>" + '</div>' + "<div class='HFSelection tab-ctrl-formatted-text' dojoAttachPoint='domContent'></div>" + "<div dojoType='tableau.base.widget.ConditionalsWidget' dojoAttachPoint='conditionals'></div>" + '</div>' + "<div class='MobilePanelBorderOuter'><div class='MobilePanelBorderInner'></div></div>" + '</div>';
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.HierarchicalFilterMobile.prototype = {
    _applyDelay$3: 500,
    _disposables$3: null,
    _scrollWrapper: null,
    iscroller: null,
    domNode: null,
    parent: null,
    _inplaceMobile$3: null,
    
    get_inplaceMobile: function tab_HierarchicalFilterMobile$get_inplaceMobile() {
        return this._inplaceMobile$3;
    },
    set_inplaceMobile: function tab_HierarchicalFilterMobile$set_inplaceMobile(value) {
        this._inplaceMobile$3 = value;
        return value;
    },
    
    get_popup: function tab_HierarchicalFilterMobile$get_popup() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_HierarchicalFilterMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_HierarchicalFilterMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.domBox : this.domBox;
    },
    
    createTreeDom: function tab_HierarchicalFilterMobile$createTreeDom() {
        var model = new tableau.mobile.TreeModel(this.get_session(), this.get_field(), this.get_oFilter().levels.length, this.isSingleSelect());
        model.onChildrenChange(model.root, model.itemsFromTable(this.get_oFilter().table[0], 0));
        this._scrollWrapper = document.createElement('div');
        this.get_domContent().appendChild(this._scrollWrapper);
        var treeOptions = {};
        treeOptions.model = model;
        treeOptions.showRoot = false;
        this.tree = new tableau.mobile.InPlaceTree(treeOptions);
        this._scrollWrapper.appendChild(this.tree.domNode);
        var scrollSpec = spiff.$create_MobileScrollerOptions();
        this.iscroller = new spiff.MobileScroller(this._scrollWrapper, this.get_inplaceMobile().get_touchHandler(), scrollSpec);
    },
    
    resize: function tab_HierarchicalFilterMobile$resize(marginBox) {
        this.inherited(arguments);
        if (ss.isValue(this.iscroller)) {
            this.iscroller.refresh();
        }
    },
    
    initFromState: function tab_HierarchicalFilterMobile$initFromState(suppressRefresh) {
        this.inherited(arguments);
        this._disposables$3 = new tab.DisposableHolder();
        if (!suppressRefresh) {
            this.tree.model.refresh(this.get_oFilter().table);
        }
        this.get_inplaceMobile().setupTouchHandler(this.domTitleBar);
        this.createPopup();
        this.connect(this.tree, 'treeSizeChanged', ss.Delegate.create(this, this.treeSizeChanged));
    },
    
    treeSizeChanged: function tab_HierarchicalFilterMobile$treeSizeChanged() {
        if (ss.isValue(this.iscroller)) {
            this.iscroller.refresh();
        }
    },
    
    _onLevelClickInPopup$3: function tab_HierarchicalFilterMobile$_onLevelClickInPopup$3(lvl, newState) {
        var addLevels = [];
        var removeLevels = [];
        if (newState) {
            addLevels.push(lvl);
        }
        else {
            removeLevels.push(lvl);
        }
        if (addLevels.length > 0 || removeLevels.length > 0) {
            tab.FilterClientCommands.doLevelHierarchialFilter(this.get_session().get_visualId(), this.get_field(), addLevels, removeLevels, 'filter-delta');
        }
    },
    
    applyChangesFromPopup: function tab_HierarchicalFilterMobile$applyChangesFromPopup() {
        var curSchema = [];
        var curTuples = [];
        var nodes = [].concat((this.get_inplaceMobile().get_popup().get_content()).tree.rootNode.getChildren());
        var toAdd = [];
        var toRemove = [];
        if (!nodes.length) {
            return;
        }
        var updateMode = 'filter-delta';
        do {
            var node = nodes.shift();
            var treeTuple = node.item.tuple;
            var t = tab.$create_TupleStruct(treeTuple.d, treeTuple.s, treeTuple.t);
            if (node.item.schema.length > curSchema.length) {
                curSchema = node.item.schema;
            }
            if (node.isChecked && !t.s) {
                t.s = true;
                curTuples.push(t);
                if (this.isSingleSelect()) {
                    updateMode = 'filter-replace';
                    break;
                }
            }
            else if (!node.isChecked && t.s) {
                delete t.s;
                curTuples.push(t);
            }
            nodes = nodes.concat(node.getChildren());
        } while (!!nodes.length);
        var tuples = curTuples;
        if (!!tuples.length) {
            for (var i = 0; i < tuples.length; i++) {
                var lastIndex = tuples[i].t.length - 1;
                var alias = tuples[i].t[lastIndex].v;
                if (tuples[i].s) {
                    toAdd.push(alias);
                }
                else {
                    toRemove.push(alias);
                }
            }
            tab.FilterClientCommands.doMemberHierarchialFilter(this.get_session().get_visualId(), this.get_field(), toAdd, toRemove, updateMode);
        }
    },
    
    _notifyPopupMemberChange$3: function tab_HierarchicalFilterMobile$_notifyPopupMemberChange$3(e) {
        if (dojo.hasClass(e.target, 'checkArea') || dojo.hasClass(e.target.parentNode, 'HFTreeNodeLabel')) {
            if (ss.isValue(this._applyTimer)) {
                window.clearTimeout(this._applyTimer);
                this._applyTimer = null;
            }
            this.set_stateId(this.get_stateId() + 1) - 1;
            if (!!e.shiftKey && !!this.tree.prev_anchor && this.tree.getDepth(this.tree.prev_anchor) === this.tree.getDepth(this.tree.anchor) && !this.isSingleSelect()) {
                this.updateCheckboxRange(this.tree.anchor, this.tree.prev_anchor);
                this.applyChangesFromPopup();
            }
            else {
                this._applyTimer = window.setTimeout(ss.Delegate.create(this, this.applyChangesFromPopup), this._applyDelay$3);
            }
        }
    },
    
    createPopup: function tab_HierarchicalFilterMobile$createPopup() {
        var title = tableau.format.formatColumnDisplayName(this.get_oFilter());
        var popupClass = tableau.mobile.widget.catmode.popup.HierarchicalControlPopup;
        var popupParams = {};
        popupParams.showLevels = this.get_attributes()['show-levels'] !== 'false';
        popupParams.isSingleSelect = this.isSingleSelect();
        popupParams.model = this.tree.model;
        popupParams.oFilter = this.get_oFilter();
        popupParams.session = this.get_session();
        popupParams.title = title;
        popupParams.qf = this;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get_inplaceMobile().get_popup().createControls();
        this.get_popup().add_notifyMemberChangeCalled(ss.Delegate.create(this, this._notifyPopupMemberChange$3));
        this.get_popup().add_onExpandNodeCalled(ss.Delegate.create(this, this.onExpandNode));
        this.get_popup().add_onCollapseNodeCalled(ss.Delegate.create(this, this.onCollapseNode));
        this.get_popup().add_onLevelClickInPopupCalled(ss.Delegate.create(this, this._onLevelClickInPopup$3));
        this._disposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get_popup().remove_notifyMemberChangeCalled(ss.Delegate.create(this, this._notifyPopupMemberChange$3));
            this.get_popup().remove_onExpandNodeCalled(ss.Delegate.create(this, this.onExpandNode));
            this.get_popup().remove_onCollapseNodeCalled(ss.Delegate.create(this, this.onCollapseNode));
            this.get_popup().remove_onLevelClickInPopupCalled(ss.Delegate.create(this, this._onLevelClickInPopup$3));
        })));
    },
    
    onCollapseNode: function tab_HierarchicalFilterMobile$onCollapseNode(item, collapsedNode) {
        var foundNode = this.findMatchingNode(collapsedNode);
        if (ss.isValue(foundNode)) {
            this.tree._collapseNode(foundNode);
        }
    },
    
    onExpandNode: function tab_HierarchicalFilterMobile$onExpandNode(item, node) {
        var foundNode = this.findMatchingNode(node);
        if (ss.isValue(foundNode)) {
            this.tree._expandNode(foundNode);
        }
    },
    
    findMatchingNode: function tab_HierarchicalFilterMobile$findMatchingNode(popupNode) {
        var nodes = [].concat(this.tree.rootNode.getChildren());
        if (!nodes.length) {
            return null;
        }
        do {
            var node = nodes.shift();
            if (node.item.tuple === popupNode.item.tuple) {
                return node;
            }
            nodes = nodes.concat(node.getChildren());
        } while (!!nodes.length);
        return null;
    },
    
    get_uniqueNodeId: function tab_HierarchicalFilterMobile$get_uniqueNodeId() {
        return this.id;
    },
    
    destroy: function tab_HierarchicalFilterMobile$destroy() {
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
        this.dispose();
    },
    
    dispose: function tab_HierarchicalFilterMobile$dispose() {
        this._disposables$3.dispose();
        if (ss.isValue(this.iscroller)) {
            this.iscroller.dispose();
            this.iscroller = null;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalSliderPopup

tab.CategoricalSliderPopup = function tab_CategoricalSliderPopup(popupParams, srcRefNode) {
    this._atterReadout$2 = [ 'show-readout', 'hide-readout' ];
    this._atterSlider$2 = [ 'show-slider', 'hide-slider' ];
    this._atterArrows$2 = [ 'show-step-btns', 'hide-buttons' ];
    this._disposableList$2 = new tab.DisposableHolder();
    tab.CategoricalSliderPopup.initializeBase(this);
    this._attributes$2 = popupParams.attributes;
    this.initValues = popupParams.initValues;
}
tab.CategoricalSliderPopup.prototype = {
    _singleSlider$2: null,
    _attributes$2: null,
    initValues: null,
    parentObject: null,
    _sliderReadoutWrapper$2: null,
    _leftReadout$2: null,
    _facetDiv$2: null,
    
    add_onPopupSliderChange: function tab_CategoricalSliderPopup$add_onPopupSliderChange(value) {
        this.__onPopupSliderChange$2 = ss.Delegate.combine(this.__onPopupSliderChange$2, value);
    },
    remove_onPopupSliderChange: function tab_CategoricalSliderPopup$remove_onPopupSliderChange(value) {
        this.__onPopupSliderChange$2 = ss.Delegate.remove(this.__onPopupSliderChange$2, value);
    },
    
    __onPopupSliderChange$2: null,
    
    startup: function tab_CategoricalSliderPopup$startup() {
        if (this._singleSlider$2 != null) {
            this._singleSlider$2.startup();
        }
        this.inherited(arguments);
    },
    
    prepareToHide: function tab_CategoricalSliderPopup$prepareToHide() {
        this.inherited(arguments);
    },
    
    getContentDimensions: function tab_CategoricalSliderPopup$getContentDimensions(availableHeight) {
        var toRet = tab.$create_DojoCoords();
        toRet.h = 100;
        toRet.w = 0;
        toRet.l = 0;
        toRet.t = 0;
        return toRet;
    },
    
    postCreate: function tab_CategoricalSliderPopup$postCreate() {
        this._sliderReadoutWrapper$2 = dojo.doc.createElement('div');
        this._leftReadout$2 = dojo.doc.createElement('div');
        this.domContent.appendChild(this._sliderReadoutWrapper$2);
        if (this.initValues.showFacets) {
            this._facetDiv$2 = dojo.doc.createElement('div');
            this._sliderReadoutWrapper$2.appendChild(this._facetDiv$2);
            dojo.addClass(this._facetDiv$2, 'facet');
        }
        this._sliderReadoutWrapper$2.appendChild(this._leftReadout$2);
        dojo.addClass(this._sliderReadoutWrapper$2, 'catSliderReadoutWrapper');
        dojo.addClass(this._leftReadout$2, 'leftReadOut');
        if (this._shouldShow$2(this._atterArrows$2)) {
            dojo.addClass(this.containerNode, 'Wide');
        }
        else {
            dojo.addClass(this.containerNode, 'Slider');
        }
        this._buildSlider$2();
        this.inherited(arguments);
    },
    
    _buildSlider$2: function tab_CategoricalSliderPopup$_buildSlider$2() {
        this.updateReadout(this.initValues.initialText, this.initValues.facet);
        this.initValues.bShowSlider = this._shouldShow$2(this._atterSlider$2);
        this.initValues.bShowArrows = this._shouldShow$2(this._atterArrows$2);
        this._singleSlider$2 = new tableau.mobile.widget.catmode.popup.SingleSlider(this.initValues);
        this._singleSlider$2.setParent(this);
        this._singleSlider$2.placeAt(this._sliderReadoutWrapper$2, 'after');
        var fireOnPopupSliderChange = ss.Delegate.create(this, function(index, propogate) {
            if (ss.isValue(this.__onPopupSliderChange$2)) {
                this.__onPopupSliderChange$2(parseInt(index), propogate);
            }
        });
        this._singleSlider$2.add_onPopupSliderChange(fireOnPopupSliderChange);
        this._disposableList$2.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._singleSlider$2.remove_onPopupSliderChange(fireOnPopupSliderChange);
        })));
    },
    
    _shouldShow$2: function tab_CategoricalSliderPopup$_shouldShow$2(attrName) {
        return (this._attributes$2[attrName[0]] !== 'false' && this._attributes$2[attrName[1]] !== 'true');
    },
    
    updateFromSearch: function tab_CategoricalSliderPopup$updateFromSearch(index) {
        this._singleSlider$2.setSliderIndex(index);
    },
    
    _refreshContent: function tab_CategoricalSliderPopup$_refreshContent(popupParams) {
        this.qf = popupParams.qf;
        this._attributes$2 = popupParams.attributes;
        this.initValues = popupParams.initValues;
        if (!!this._singleSlider$2) {
            this._disposableList$2.dispose();
            this._singleSlider$2.destroy();
        }
        this._buildSlider$2();
        this._singleSlider$2.startup();
    },
    
    updateReadout: function tab_CategoricalSliderPopup$updateReadout(text, facet) {
        if (this._shouldShow$2(this._atterReadout$2)) {
            this._leftReadout$2.innerHTML = text;
            if (this.initValues.showFacets && !!facet) {
                this._facetDiv$2.innerHTML = facet;
            }
        }
    },
    
    propogateChange: function tab_CategoricalSliderPopup$propogateChange(index) {
    },
    
    setParent: function tab_CategoricalSliderPopup$setParent(parentObjectArg) {
        this.parentObject = parentObjectArg;
    },
    
    dispose: function tab_CategoricalSliderPopup$dispose() {
        this._disposableList$2.dispose();
    },
    
    destroy: function tab_CategoricalSliderPopup$destroy() {
        this.dispose();
        this._singleSlider$2.destroy();
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ControlsToolbar

tab.ControlsToolbar = function tab_ControlsToolbar(initParams, sourceRefNode) {
    this.templateString = "<div dojoattachpoint='containerNode' class='ControlsToolbar'>" + '<ul>' + "<li style='margin-left:0;'>" + "<div class='tapArea' dojoAttachPoint='domResetBtn'></div>" + "<div class='controlIcon wcIconFiltered' dojoAttachPoint='domResetIcon'></div>" + '</li>' + '<li>' + "<div class='tapArea' dojoAttachPoint='domSearchBtn'></div>" + "<div class='controlIcon wcIconPopupSearch'></div>" + '</li>' + '<li>' + "<div class='tapArea' dojoAttachPoint='domDomainBtn'></div>" + "<div class='controlIcon wcIconDomainAll' dojoAttachPoint='domDomainIcon'></div>" + '</li>' + '<li>' + "<div class='tapArea' dojoAttachPoint='domMenuBtn'></div>" + "<div class='controlIcon wcIconPopupMenu'></div>" + '</li>' + '</ul>' + '</div>';
    tab.ControlsToolbar.initializeBase(this);
    this.touchHandlers = [];
}
tab.ControlsToolbar.prototype = {
    widgetsInTemplate: false,
    hasDomain: true,
    metricsOnly: false,
    domMenuBtn: null,
    domResetBtn: null,
    domResetIcon: null,
    domDomainBtn: null,
    domSearchBtn: null,
    domDomainIcon: null,
    optionsPressed: false,
    searchPressed: false,
    hideExclusiveVsInclusiveInMenu: false,
    hideSingleVsMultipleInMenu: false,
    hideNullControls: false,
    _resetDisabled$1: false,
    qf: null,
    touchHandlers: null,
    
    add_resetTapped: function tab_ControlsToolbar$add_resetTapped(value) {
        this.__resetTapped$1 = ss.Delegate.combine(this.__resetTapped$1, value);
    },
    remove_resetTapped: function tab_ControlsToolbar$remove_resetTapped(value) {
        this.__resetTapped$1 = ss.Delegate.remove(this.__resetTapped$1, value);
    },
    
    __resetTapped$1: null,
    
    add_domainTapped: function tab_ControlsToolbar$add_domainTapped(value) {
        this.__domainTapped$1 = ss.Delegate.combine(this.__domainTapped$1, value);
    },
    remove_domainTapped: function tab_ControlsToolbar$remove_domainTapped(value) {
        this.__domainTapped$1 = ss.Delegate.remove(this.__domainTapped$1, value);
    },
    
    __domainTapped$1: null,
    
    add_optionsTapped: function tab_ControlsToolbar$add_optionsTapped(value) {
        this.__optionsTapped$1 = ss.Delegate.combine(this.__optionsTapped$1, value);
    },
    remove_optionsTapped: function tab_ControlsToolbar$remove_optionsTapped(value) {
        this.__optionsTapped$1 = ss.Delegate.remove(this.__optionsTapped$1, value);
    },
    
    __optionsTapped$1: null,
    
    add_searchTapped: function tab_ControlsToolbar$add_searchTapped(value) {
        this.__searchTapped$1 = ss.Delegate.combine(this.__searchTapped$1, value);
    },
    remove_searchTapped: function tab_ControlsToolbar$remove_searchTapped(value) {
        this.__searchTapped$1 = ss.Delegate.remove(this.__searchTapped$1, value);
    },
    
    __searchTapped$1: null,
    
    postMixInProperties: function tab_ControlsToolbar$postMixInProperties(initParams, sourceRefNode) {
    },
    
    _quantitativeControlsPostCreate: function tab_ControlsToolbar$_quantitativeControlsPostCreate() {
        if (!this.metricsOnly) {
            var processButton = function(domNode, hide) {
                if (hide) {
                    dojo.style(domNode, 'display', 'none');
                }
            };
            this.hideNullControls = this.qf.shouldHideContextMenu();
            this.hideExclusiveVsInclusiveInMenu = true;
            this.hideSingleVsMultipleInMenu = true;
            processButton(this.domMenuBtn.parentNode, this.hideNullControls);
            processButton(this.domDomainBtn.parentNode, this.qf.shouldHideDomainButton());
            processButton(this.domSearchBtn.parentNode, true);
            processButton(this.domResetBtn.parentNode, this.qf.shouldHideResetButton());
        }
        this._updateDomainButton();
    },
    
    _relativeDateControlsPostCreate$1: function tab_ControlsToolbar$_relativeDateControlsPostCreate$1() {
        if (!this.metricsOnly) {
            var processButton = function(domNode, hide) {
                if (hide) {
                    dojo.style(domNode, 'display', 'none');
                }
            };
            this.hideNullControls = this.qf.shouldHideContextMenu();
            this.hideExclusiveVsInclusiveInMenu = true;
            this.hideSingleVsMultipleInMenu = true;
            processButton(this.domMenuBtn.parentNode, this.hideNullControls);
            processButton(this.domDomainBtn.parentNode, true);
            processButton(this.domSearchBtn.parentNode, true);
            processButton(this.domResetBtn.parentNode, true);
        }
    },
    
    _categoricalControlsPostCreate$1: function tab_ControlsToolbar$_categoricalControlsPostCreate$1() {
        if (!this.metricsOnly) {
            var cantShowExclusiveVsInclusive = this.qf.get_oFilter().catIsHier || (!!this.qf.get_oFilter().table && this.qf.get_oFilter().table.schema.length === 1 && tableau.types.isOm(this.qf.get_oFilter().table.schema[0]));
            var hideSearchButton = (this.qf.get_mode() === 'pattern' || this.qf.get_mode() === 'typeinlist' || this.qf.shouldHideSearchButton());
            var hideDomainButton = (this.qf.get_mode() === 'pattern' || this.qf.get_mode() === 'typeinlist' || this.qf.shouldHideDomainButton());
            var hideResetButton = (this.qf.get_mode() === 'pattern' || this.qf.get_mode() === 'typeinlist' || this.qf.shouldHideResetButton());
            var hideExVsIn = cantShowExclusiveVsInclusive || this.qf.shouldHideIncludeExclude();
            var hideSiVsMu = this.qf.shouldHideContextMenu();
            var hideMenuButton = (hideExVsIn && hideSiVsMu);
            this.processControlButtons(hideSearchButton, hideDomainButton, hideExVsIn, hideSiVsMu, hideMenuButton, hideResetButton);
            this.hideNullControls = true;
        }
    },
    
    _hierControlsPostCreate: function tab_ControlsToolbar$_hierControlsPostCreate() {
        if (!this.metricsOnly) {
            var processButton = function(domNode, hide) {
                if (hide) {
                    dojo.style(domNode, 'display', 'none');
                }
            };
            processButton(this.domMenuBtn.parentNode, this.qf.shouldHideContextMenu());
            processButton(this.domSearchBtn.parentNode, this.qf.shouldHideSearchButton());
            processButton(this.domDomainBtn.parentNode, true);
            processButton(this.domResetBtn.parentNode, true);
            this.hideExclusiveVsInclusiveInMenu = true;
            this.hideNullControls = true;
        }
    },
    
    postCreate: function tab_ControlsToolbar$postCreate() {
        if (this.qf.declaredClass === 'tableau.mobile.widget.QuantitativeFilterMobile' || this.qf.declaredClass === 'tableau.mobile.widget.QuantitativeDateFilterMobile') {
            this._quantitativeControlsPostCreate();
        }
        else if (this.qf.declaredClass === 'tableau.mobile.widget.RelativeDatePickFilterMobile' || this.qf.declaredClass === 'tableau.mobile.widget.RelativeDateFilterMobile') {
            this._relativeDateControlsPostCreate$1();
        }
        else if (this.qf.declaredClass === 'tableau.mobile.widget.HierarchicalFilterMobile') {
            this._hierControlsPostCreate();
        }
        else {
            this._categoricalControlsPostCreate$1();
        }
        var touchScpec = spiff.$create_EventHandleSpec();
        touchScpec.firstTouch = ss.Delegate.create(this, this._searchTap$1);
        this.touchHandlers.push(new spiff.TableauEventHandler(this.domSearchBtn, touchScpec));
        touchScpec = spiff.$create_EventHandleSpec();
        touchScpec.firstTouch = ss.Delegate.create(this, this._domainTap$1);
        this.touchHandlers.push(new spiff.TableauEventHandler(this.domDomainBtn, touchScpec));
        touchScpec = spiff.$create_EventHandleSpec();
        touchScpec.firstTouch = ss.Delegate.create(this, this._optionsTap$1);
        this.touchHandlers.push(new spiff.TableauEventHandler(this.domMenuBtn, touchScpec));
        touchScpec = spiff.$create_EventHandleSpec();
        touchScpec.firstTouch = ss.Delegate.create(this, this._resetTap$1);
        this.touchHandlers.push(new spiff.TableauEventHandler(this.domResetBtn, touchScpec));
        this._updateDomainButton();
        this._updateResetButton$1();
    },
    
    processControlButtons: function tab_ControlsToolbar$processControlButtons(hideSearchButton, hideDomainButton, hideExVsIn, hideSiVsMu, hideMenuButton, hideResetButton) {
        var processButton = function(domNode, hide) {
            if (hide) {
                dojo.style(domNode, 'display', 'none');
            }
        };
        processButton(this.domMenuBtn.parentNode, hideMenuButton);
        processButton(this.domDomainBtn.parentNode, hideDomainButton);
        processButton(this.domSearchBtn.parentNode, hideSearchButton);
        processButton(this.domResetBtn.parentNode, hideResetButton);
        if (!hideMenuButton) {
            if (hideExVsIn) {
                this.hideExclusiveVsInclusiveInMenu = true;
            }
            if (hideSiVsMu) {
                this.hideSingleVsMultipleInMenu = true;
            }
        }
    },
    
    _searchTap$1: function tab_ControlsToolbar$_searchTap$1(e) {
        this.optionsPressed = false;
        this.searchPressed = !this.searchPressed;
        this._setButtonsState();
        if (ss.isValue(this.__searchTapped$1)) {
            this.__searchTapped$1();
            e.stopPropagation();
        }
    },
    
    setSearchButtonState: function tab_ControlsToolbar$setSearchButtonState(state) {
        this.searchPressed = state;
        if (this.searchPressed) {
            this.optionsPressed = false;
        }
        this._setButtonsState();
    },
    
    setOptionsButtonState: function tab_ControlsToolbar$setOptionsButtonState(state) {
        this.optionsPressed = state;
        if (this.optionsPressed) {
            this.searchPressed = false;
        }
        this._setButtonsState();
    },
    
    _setButtonsState: function tab_ControlsToolbar$_setButtonsState() {
        dojo.toggleClass(this.domSearchBtn.parentNode, 'pressed', this.searchPressed);
        dojo.toggleClass(this.domMenuBtn.parentNode, 'pressed', this.optionsPressed);
    },
    
    _disableResetButton$1: function tab_ControlsToolbar$_disableResetButton$1() {
        if (!this.qf.shouldHideResetButton()) {
            dojo.removeClass(this.domResetIcon, 'wcIconNonfiltered');
            dojo.removeClass(this.domResetIcon, 'wcIconFiltered');
            dojo.addClass(this.domResetIcon, 'wcIconNonfiltered');
            this._resetDisabled$1 = true;
        }
    },
    
    _enableResetButton$1: function tab_ControlsToolbar$_enableResetButton$1() {
        if (!this.qf.shouldHideResetButton()) {
            dojo.removeClass(this.domResetIcon, 'wcIconNonfiltered');
            dojo.removeClass(this.domResetIcon, 'wcIconFiltered');
            dojo.addClass(this.domResetIcon, 'wcIconFiltered');
            this._resetDisabled$1 = false;
        }
    },
    
    updateResetCf: function tab_ControlsToolbar$updateResetCf(cf) {
        if (ss.isValue(cf.get_oFilter().all) && cf.get_oFilter().all) {
            this._disableResetButton$1();
        }
        else {
            this._enableResetButton$1();
        }
    },
    
    updateResetQf: function tab_ControlsToolbar$updateResetQf(qf) {
        if (qf.isMaxRange(qf.get_oCurrentMin().v, qf.get_oCurrentMax().v)) {
            this._disableResetButton$1();
        }
        else {
            this._enableResetButton$1();
        }
    },
    
    update: function tab_ControlsToolbar$update(filterArg) {
        this.qf = filterArg;
        this._updateDomainButton();
        this._updateResetButton$1();
    },
    
    _updateResetButton$1: function tab_ControlsToolbar$_updateResetButton$1() {
        if (this.qf.oFilter.type === 'C') {
            this.updateResetCf(this.qf);
        }
        else if (this.qf.oFilter.type === 'Q') {
            this.updateResetQf(this.qf);
        }
    },
    
    _domainTap$1: function tab_ControlsToolbar$_domainTap$1(e) {
        if (ss.isValue(this.__domainTapped$1)) {
            this.__domainTapped$1();
            e.stopPropagation();
        }
    },
    
    _resetTap$1: function tab_ControlsToolbar$_resetTap$1(e) {
        if (ss.isValue(this.__resetTapped$1) && !this._resetDisabled$1) {
            this.__resetTapped$1();
            e.stopPropagation();
        }
    },
    
    _getButtonCount: function tab_ControlsToolbar$_getButtonCount() {
        var count = 0;
        var display;
        dojo.query('li', this.domNode).forEach(function(node, index) {
            display = dojo.style(node, 'display');
            if (display !== 'none') {
                count++;
            }
        });
        return count;
    },
    
    _updateDomainButton: function tab_ControlsToolbar$_updateDomainButton() {
        if (!ss.isNullOrUndefined(this.qf) && (typeof(this.qf.shouldHideDomainButton) === 'function') && this.qf.shouldHideDomainButton()) {
            return;
        }
        dojo.removeClass(this.domDomainIcon, 'wcIconDomainAll');
        dojo.removeClass(this.domDomainIcon, 'wcIconDomainContext');
        dojo.removeClass(this.domDomainIcon, 'wcIconDomainRelevant');
        var values = (this.qf).get_attributes()['values'];
        if (values === tableau.types.QFDomain.QFD_RELEVANT) {
            dojo.addClass(this.domDomainIcon, 'wcIconDomainRelevant');
        }
        else if (values === tableau.types.QFDomain.QFD_CONTEXT) {
            dojo.addClass(this.domDomainIcon, 'wcIconDomainContext');
        }
        else {
            dojo.addClass(this.domDomainIcon, 'wcIconDomainAll');
        }
    },
    
    _optionsTap$1: function tab_ControlsToolbar$_optionsTap$1(e) {
        this.searchPressed = false;
        this.optionsPressed = !this.optionsPressed;
        this._setButtonsState();
        if (ss.isValue(this.__optionsTapped$1)) {
            this.__optionsTapped$1();
            e.stopPropagation();
        }
    },
    
    destroy: function tab_ControlsToolbar$destroy() {
        dojo.forEach(this.touchHandlers, function(th) {
            th.destroy();
        });
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PopupFormattedValueTypeInWidget

tab.PopupFormattedValueTypeInWidget = function tab_PopupFormattedValueTypeInWidget(targetDiv, style) {
    tab.PopupFormattedValueTypeInWidget.initializeBase(this, [ targetDiv, style ]);
}
tab.PopupFormattedValueTypeInWidget.prototype = {
    _editingDataValue$2: false,
    
    onQueryBoxFocus: function tab_PopupFormattedValueTypeInWidget$onQueryBoxFocus(evt) {
        tab.PopupFormattedValueTypeInWidget.callBaseMethod(this, 'onQueryBoxFocus', [ evt ]);
        this.queryBox.value = this.editableValue();
        this._editingDataValue$2 = true;
    },
    
    patternIsChanged: function tab_PopupFormattedValueTypeInWidget$patternIsChanged() {
        if (this._editingDataValue$2) {
            return this.editableValue() !== this.queryBox.value;
        }
        else {
            return this.pattern !== this.queryBox.value;
        }
    },
    
    setNewPattern: function tab_PopupFormattedValueTypeInWidget$setNewPattern() {
        var wasChanged = this.patternIsChanged();
        tab.PopupFormattedValueTypeInWidget.callBaseMethod(this, 'setNewPattern');
        if (!wasChanged) {
            this.resetPattern();
        }
        this._editingDataValue$2 = false;
    },
    
    resetPattern: function tab_PopupFormattedValueTypeInWidget$resetPattern() {
        this.queryBox.value = this.pattern;
        this.queryBox.blur();
        this._editingDataValue$2 = false;
        this.setButtonToProperState();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CustomValueListPopup

tab.CustomValueListPopup = function tab_CustomValueListPopup(pparams, srcRefNode) {
    tab.CustomValueListPopup.initializeBase(this);
    this._cvlDisposables$2 = new tab.DisposableHolder();
    this.listParams = pparams.listParams;
    this.listParams.isRemovable = true;
    this.set_title(pparams.title);
}
tab.CustomValueListPopup.prototype = {
    listParams: null,
    _cvlDisposables$2: null,
    typeInSearchWidget: null,
    list: null,
    clearAllButtonVisible: false,
    _SearchBoxWrapper: null,
    _Selection: null,
    _ButtonSeparator: null,
    _clearAllButtonContainer$2: null,
    _clearAll$2: null,
    
    get__asScrollListener$2: function tab_CustomValueListPopup$get__asScrollListener$2() {
        return this;
    },
    
    postCreate: function tab_CustomValueListPopup$postCreate() {
        this._SearchBoxWrapper = dojo.doc.createElement('div');
        this.domContent.appendChild(this._SearchBoxWrapper);
        this._Selection = dojo.doc.createElement('div');
        this.domContent.appendChild(this._Selection);
        var thisQf = tab.$create_SearchWidgetQfProperty();
        thisQf.qf = this.qf;
        this.typeInSearchWidget = new tableau.mobile.widget.SearchWidgetMobile(thisQf, null);
        this.typeInSearchWidget.placeAt(this._SearchBoxWrapper, 'after');
        this.typeInSearchWidget.startup();
        this.list = tab.ScrollingList.createScrollingList(this.listParams);
        this.list.placeAt(this._Selection, 'after');
        this.clearAllButtonVisible = false;
        this._ButtonSeparator = dojo.doc.createElement('div');
        this.domContent.appendChild(this._ButtonSeparator);
        this._clearAllButtonContainer$2 = dojo.doc.createElement('div');
        this.domContent.appendChild(this._clearAllButtonContainer$2);
        this._clearAll$2 = dojo.doc.createElement('div');
        this._clearAllButtonContainer$2.appendChild(this._clearAll$2);
        dojo.addClass(this._clearAllButtonContainer$2, 'ClearListButtonWrapper');
        dojo.addClass(this._clearAll$2, 'ClearListButton ');
        this._clearAll$2.innerHTML = tab.Strings.ClearAllButtonText;
        var config = spiff.$create_EventHandleSpec();
        config.potentialTap = ss.Delegate.create(this, this.removeAllRowFromList);
        this.touchHandler = new spiff.TableauEventHandler(this._clearAll$2, config);
        this.inherited(arguments);
        this.setupConnections();
        this.get__asScrollListener$2().setupScrollListener(this.list.iscrollObj);
    },
    
    setupConnections: function tab_CustomValueListPopup$setupConnections() {
        this._cvlDisposables$2.dispose();
        this._cvlDisposables$2 = new tab.DisposableHolder();
        this.typeInSearchWidget.add_onXButtonClickCalled(ss.Delegate.create(this, this.doResize));
        this.list.add_deleteRowCalled(ss.Delegate.create(this, this.rowDeleted));
        this.typeInSearchWidget.add_attachItemsChangedHandlerCalled(ss.Delegate.create(this, this._resizeResults$2));
        this._cvlDisposables$2.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.typeInSearchWidget.remove_onXButtonClickCalled(ss.Delegate.create(this, this.doResize));
            this.list.remove_deleteRowCalled(ss.Delegate.create(this, this.rowDeleted));
            this.typeInSearchWidget.remove_attachItemsChangedHandlerCalled(ss.Delegate.create(this, this._resizeResults$2));
        })));
    },
    
    _resizeResults$2: function tab_CustomValueListPopup$_resizeResults$2(refList) {
        var resultsList = this.typeInSearchWidget.get_list();
        var height = resultsList.getListSize();
        dojo.style(resultsList.scrollWrapper, 'height', Math.max(Math.min(200, height), 0) + 'px');
        resultsList.iscrollObj.refresh();
        this.doResize();
        this.get__asScrollListener$2().doScrollToLastPos();
    },
    
    _addClearAllButton$2: function tab_CustomValueListPopup$_addClearAllButton$2() {
        dojo.style(this._clearAllButtonContainer$2, 'height', 55 + 'px');
        dojo.style(this._clearAll$2, 'height', 25 + 'px');
    },
    
    _removeClearAllButton$2: function tab_CustomValueListPopup$_removeClearAllButton$2() {
        dojo.style(this._clearAllButtonContainer$2, 'height', '0px');
        dojo.style(this._clearAll$2, 'height', '0px');
    },
    
    update: function tab_CustomValueListPopup$update(popupParams) {
        this.inherited(arguments);
        this.listParams = popupParams.listParams;
        this.listParams.isRemovable = true;
        this.list.destroy();
        this.list = tab.ScrollingList.createScrollingList(this.listParams);
        this.list.placeAt(this._Selection, 'after');
        this.setupConnections();
        this.doResize();
        this.get__asScrollListener$2().setupScrollListener(this.list.iscrollObj);
        this.get__asScrollListener$2().doScrollToLastPos();
    },
    
    getContentDimensions: function tab_CustomValueListPopup$getContentDimensions(availableHeight) {
        var scrollWrapperHeight;
        var rowCount = this.list.getListRowCont();
        var searchDims = dojo.marginBox(this.typeInSearchWidget.domNode);
        var listDims = dojo.marginBox(this.list._scrollingListArea);
        var listHeight = Math.min(listDims.h, availableHeight - searchDims.h);
        if (rowCount > 4) {
            this._addClearAllButton$2();
            this.clearAllButtonVisible = true;
            scrollWrapperHeight = listHeight - 40;
        }
        else {
            if (!!this.clearAllButtonVisible) {
                this._removeClearAllButton$2();
                this.clearAllButtonVisible = false;
            }
            scrollWrapperHeight = listHeight;
        }
        dojo.style(this.list.scrollWrapper, 'height', scrollWrapperHeight + 'px');
        this.list.iscrollObj.refresh();
        this.get__asScrollListener$2().doScrollToLastPos();
        var toRet = tab.$create_DojoCoords();
        toRet.h = searchDims.h + listHeight;
        return toRet;
    },
    
    onSelect: function tab_CustomValueListPopup$onSelect(e) {
    },
    
    rowDeleted: function tab_CustomValueListPopup$rowDeleted() {
        if (ss.isValue(this.typeInSearchWidget.get_list())) {
            this.typeInSearchWidget.update(this.qf);
        }
        this.doResize();
    },
    
    removeAllRowFromList: function tab_CustomValueListPopup$removeAllRowFromList(e) {
        e.preventDefault();
        this.list.deleteAllRows();
    },
    
    dispose: function tab_CustomValueListPopup$dispose() {
        this._cvlDisposables$2.dispose();
        this.touchHandler.dispose();
        this.typeInSearchWidget.dispose();
    },
    
    destroy: function tab_CustomValueListPopup$destroy() {
        this.list.destroy();
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ListPopup

tab.ListPopup = function tab_ListPopup(parms, srcRefNode) {
    tab.ListPopup.initializeBase(this);
    this.listParams = parms.listParams;
    this.set_title(parms.title);
}
tab.ListPopup.prototype = {
    listParams: null,
    
    get__asScrollListener$2: function tab_ListPopup$get__asScrollListener$2() {
        return this;
    },
    
    startup: function tab_ListPopup$startup() {
        this.get_list().startup();
    },
    
    postCreate: function tab_ListPopup$postCreate() {
        if ((typeof(this.qf.isSingleSelect) === 'function')) {
            this.listParams.isMultiValue = !(this.qf).isSingleSelect();
        }
        else {
            this.listParams.isMultiValue = false;
        }
        this.set_list(tab.ScrollingList.createScrollingList(this.listParams));
        this.get_list().placeAt(this.domContent, 'after');
        this.get__asScrollListener$2().setupScrollListener(this.get_list().iscrollObj);
        this.inherited(arguments);
    },
    
    update: function tab_ListPopup$update(popupParams) {
        this.inherited(arguments);
    },
    
    destroy: function tab_ListPopup$destroy() {
        this.get_list().destroy();
        this.inherited(arguments);
    },
    
    getContentDimensions: function tab_ListPopup$getContentDimensions(availableHeight) {
        var listAreaDims = dojo.marginBox(this.get_list()._scrollingListArea);
        var newHeight = Math.min(listAreaDims.h, availableHeight);
        var toRet = tab.$create_DojoCoords();
        toRet.h = newHeight;
        return toRet;
    },
    
    resizeSpecificContent: function tab_ListPopup$resizeSpecificContent(size) {
        dojo.style(this.get_list().scrollWrapper, 'height', size.h + 'px');
        this.get_list().iscrollObj.refresh();
    },
    
    _refreshContent: function tab_ListPopup$_refreshContent(parms) {
        this.qf = parms.qf;
        this.listParams = parms.listParams;
        if ((typeof(this.qf.isSingleSelect) === 'function')) {
            this.listParams.isMultiValue = !(this.qf).isSingleSelect();
        }
        else {
            this.listParams.isMultiValue = false;
        }
        this.set_title(parms.title);
        if (!!this.get_list()) {
            this.get_list().destroy();
            this.set_list(tab.ScrollingList.createScrollingList(this.listParams));
            this.get_list().placeAt(this.domContent, 'after');
        }
        this.get__asScrollListener$2().setupScrollListener(this.get_list().iscrollObj);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PatternPopup

tab.PatternPopup = function tab_PatternPopup(newParam, srcRefNode) {
    tab.PatternPopup.initializeBase(this);
    this.params = newParam;
    this.set_title(newParam.title);
    this.type = newParam.type;
}
tab.PatternPopup.prototype = {
    params: null,
    patternWidget: null,
    type: null,
    _patternBoxWrapper$2: null,
    
    postCreate: function tab_PatternPopup$postCreate() {
        this._patternBoxWrapper$2 = dojo.doc.createElement('div');
        this.domContent.appendChild(this._patternBoxWrapper$2);
        if (this.type === 'Pattern') {
            this.patternWidget = new tableau.mobile.widget.catmode.popup.PopupTypeInWidget(this._patternBoxWrapper$2, this.type);
            this.patternWidget.instantiate(this.params.pattern, this.params.itemName);
        }
        else {
            if (this.params.isListDomain || ss.isValue(this.params.domain)) {
                var listWidget = new tableau.mobile.widget.catmode.popup.PopupListTypeInWidget(this._patternBoxWrapper$2, this.type);
                listWidget.instantiate(this.params.pattern, this.params.itemName, this.params.domain, ss.Delegate.create((this.params.qf).session, (this.params.qf).session.getAutocompleteInfo));
                this.patternWidget = listWidget;
            }
            else if (tab.PopupValueTypeInWidget.hasSeparateDisplayFormat(this.params.datavalue)) {
                var valueWidget = new tableau.mobile.widget.catmode.popup.PopupFormattedValueTypeInWidget(this._patternBoxWrapper$2, this.type);
                valueWidget.instantiate(this.params.pattern, this.params.itemName, this.params.datavalue, this.params.numberFormat);
                this.patternWidget = valueWidget;
            }
            else {
                var valueWidget = new tableau.mobile.widget.catmode.popup.PopupValueTypeInWidget(this._patternBoxWrapper$2, this.type);
                valueWidget.instantiate(this.params.pattern, this.params.itemName, this.params.datavalue, this.params.numberFormat);
                this.patternWidget = valueWidget;
            }
        }
        this.inherited(arguments);
    },
    
    update: function tab_PatternPopup$update(popupParams) {
        this.inherited(arguments);
        this.patternWidget.update(popupParams.pattern, popupParams.datavalue, popupParams.domain);
    },
    
    prepareToHide: function tab_PatternPopup$prepareToHide() {
        this.patternWidget.setNewPattern();
    },
    
    getContentDimensions: function tab_PatternPopup$getContentDimensions(availableHeight) {
        return dojo.marginBox(this._patternBoxWrapper$2);
    },
    
    destroy: function tab_PatternPopup$destroy() {
        this.dispose();
        this.inherited(arguments);
    },
    
    dispose: function tab_PatternPopup$dispose() {
        this.patternWidget.dispose();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PopupListTypeInWidget

tab.PopupListTypeInWidget = function tab_PopupListTypeInWidget(targetDiv, style) {
    tab.PopupListTypeInWidget.initializeBase(this, [ targetDiv, style ]);
    this.cssClass = 'revertButton';
}
tab.PopupListTypeInWidget.prototype = {
    domain: null,
    _cachedAutocomplete$1: null,
    autocomplete: false,
    _autocompleteFunc$1: null,
    _applyTimer$1: null,
    
    update: function tab_PopupListTypeInWidget$update(newPattern, unusedDataValue, newDomain) {
        this.domain = newDomain || [];
        tab.PopupListTypeInWidget.callBaseMethod(this, 'update', [ newPattern ]);
    },
    
    instantiate: function tab_PopupListTypeInWidget$instantiate(newPattern, newFieldname, newDomain, autocompleteFunction) {
        tab.PopupListTypeInWidget.callBaseMethod(this, 'instantiate', [ newPattern, newFieldname ]);
        this._initializeAutocomplete$1(newDomain, autocompleteFunction);
    },
    
    setNewState: function tab_PopupListTypeInWidget$setNewState() {
        this._cachedAutocomplete$1 = '';
        tab.PopupListTypeInWidget.callBaseMethod(this, 'setNewState');
    },
    
    _initializeAutocomplete$1: function tab_PopupListTypeInWidget$_initializeAutocomplete$1(d, f) {
        this._cachedAutocomplete$1 = '';
        this.autocomplete = true;
        this.domain = d || [];
        this._autocompleteFunc$1 = f;
    },
    
    _setApplyTimer$1: function tab_PopupListTypeInWidget$_setApplyTimer$1(func) {
        this._clearTimeout();
        this._applyTimer$1 = window.setTimeout(func, 500);
    },
    
    _clearTimeout: function tab_PopupListTypeInWidget$_clearTimeout() {
        if (!!this._applyTimer$1) {
            window.clearTimeout(this._applyTimer$1);
            this._applyTimer$1 = null;
        }
    },
    
    _startAutocomplete$1: function tab_PopupListTypeInWidget$_startAutocomplete$1() {
        if (!this.autocomplete) {
            return;
        }
        if (tab.MiscUtil.isNullOrEmpty(this.queryBox.value)) {
            return;
        }
        if (!this._cachedAutocomplete$1.toLowerCase().indexOf(this.queryBox.value.toLowerCase())) {
            this._onAutocompleteDone$1(this._cachedAutocomplete$1);
            return;
        }
        if (this.domain.length > 0) {
            var current = this.queryBox.value.toLowerCase();
            for (var i = 0, domainLength = this.domain.length; i < domainLength; i++) {
                if (!this.domain[i].toLowerCase().indexOf(current)) {
                    this._onAutocompleteDone$1(this.domain[i]);
                    return;
                }
            }
        }
        else if (ss.isValue(this._autocompleteFunc$1)) {
            var func = ss.Delegate.create(this, function() {
                this._autocompleteFunc$1(this.queryBox.value, ss.Delegate.create(this, this._onAutocompleteDone$1), this.fieldname);
            });
            this._setApplyTimer$1(func);
        }
    },
    
    _onAutocompleteDone$1: function tab_PopupListTypeInWidget$_onAutocompleteDone$1(newObj) {
        var newValue = newObj;
        if (tab.MiscUtil.isNullOrEmpty(newValue)) {
            return;
        }
        this._cachedAutocomplete$1 = newValue;
        var current = this.queryBox.value;
        this.queryBox.value = newValue;
        tableau.util.selectText(this.queryBox, current.length, newValue.length);
    },
    
    buttonShouldBeActive: function tab_PopupListTypeInWidget$buttonShouldBeActive() {
        return this.patternIsChanged();
    },
    
    onKeyUp: function tab_PopupListTypeInWidget$onKeyUp(e) {
        switch (e.which) {
            case 13:
            case 27:
            case 8:
            case 46:
                this._clearTimeout();
                break;
            case 16:
                break;
            default:
                if (this.keyCode === e.which) {
                    this._startAutocomplete$1();
                }
                break;
        }
        tab.PopupListTypeInWidget.callBaseMethod(this, 'onKeyUp', [ e ]);
    },
    
    doButtonAction: function tab_PopupListTypeInWidget$doButtonAction() {
        this.resetPattern();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PopupValueTypeInWidget

tab.PopupValueTypeInWidget = function tab_PopupValueTypeInWidget(targetDiv, style) {
    tab.PopupValueTypeInWidget.initializeBase(this, [ targetDiv, style ]);
    this.cssClass = 'revertButton';
}
tab.PopupValueTypeInWidget._getInputType$1 = function tab_PopupValueTypeInWidget$_getInputType$1(val) {
    var inputType = 'text';
    if (val.t === tableau.types.DataType.DT_DATE && tab.BrowserSupport.get_dateInput()) {
        inputType = 'date';
    }
    else if (val.t === tableau.types.DataType.DT_TIMESTAMP && tab.BrowserSupport.get_dateTimeLocalInput()) {
        inputType = 'datetime-local';
    }
    return inputType;
}
tab.PopupValueTypeInWidget.hasSeparateDisplayFormat = function tab_PopupValueTypeInWidget$hasSeparateDisplayFormat(val) {
    return !tab.PopupValueTypeInWidget._getInputType$1(val).startsWith('date');
}
tab.PopupValueTypeInWidget.prototype = {
    dataValue: null,
    _numberFormat$1: null,
    
    update: function tab_PopupValueTypeInWidget$update(newPattern, newDataValue, unusedDomain) {
        this.dataValue = newDataValue;
        tab.PopupValueTypeInWidget.callBaseMethod(this, 'update', [ newPattern ]);
        this.resetPattern();
    },
    
    instantiate: function tab_PopupValueTypeInWidget$instantiate(newPattern, newFieldname, newDataValue, numberFormatArg) {
        this.dataValue = newDataValue;
        this.inputType = tab.PopupValueTypeInWidget._getInputType$1(this.dataValue);
        this._numberFormat$1 = numberFormatArg;
        tab.PopupValueTypeInWidget.callBaseMethod(this, 'instantiate', [ newPattern, newFieldname ]);
        this.resetPattern();
    },
    
    setNewState: function tab_PopupValueTypeInWidget$setNewState() {
        if (this.inputType === 'date') {
            this.pattern = tableau.format.formatToJSCompliantFormat(this.queryBox.value, tableau.format.get_isO8601DateFormat(), tab.DateTimeAutoFormatMode.showFullDateTime, this.dataValue.t);
        }
        else if (this.inputType === 'datetime-local') {
            this.pattern = tableau.format.formatToJSCompliantFormat(this.queryBox.value, tableau.format.get_isO8601DateTimeFormat(), tab.DateTimeAutoFormatMode.showFullDateTime, this.dataValue.t);
        }
        else {
            tab.PopupValueTypeInWidget.callBaseMethod(this, 'setNewState');
        }
    },
    
    patternIsChanged: function tab_PopupValueTypeInWidget$patternIsChanged() {
        return this.editableValue() !== this.queryBox.value;
    },
    
    buttonShouldBeActive: function tab_PopupValueTypeInWidget$buttonShouldBeActive() {
        return this.patternIsChanged();
    },
    
    editableValue: function tab_PopupValueTypeInWidget$editableValue() {
        if (this.inputType === 'date') {
            return tableau.format.formatDataValue(this.dataValue, null, tableau.format.get_isO8601DateFormat(), null, tab.DateTimeAutoFormatMode.showFullDateTime);
        }
        else if (this.inputType === 'datetime-local') {
            return tableau.format.formatDataValue(this.dataValue, null, tableau.format.get_isO8601DateTimeFormat(), null, tab.DateTimeAutoFormatMode.showFullDateTime);
        }
        else {
            return tableau.format.formatDataValue(this.dataValue, null, tableau.format.deriveNumberEditingFormat(this._numberFormat$1), null, tab.DateTimeAutoFormatMode.showFullDateTime);
        }
    },
    
    resetPattern: function tab_PopupValueTypeInWidget$resetPattern() {
        this.queryBox.value = this.editableValue();
        this.setButtonToProperState();
    },
    
    doButtonAction: function tab_PopupValueTypeInWidget$doButtonAction() {
        this.resetPattern();
    },
    
    isLocalized: function tab_PopupValueTypeInWidget$isLocalized() {
        return (this.inputType !== 'date' && this.inputType !== 'datetime-local');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ScrollingList

tab.ScrollingList = function tab_ScrollingList(listParams, srcRefNode) {
    this.templateString = "<div dojoAttachPoint='containerNode' style='' class='scrollContainer'>" + "<div dojoAttachPoint='scrollWrapper' class='scrollWrapper'>" + "<div dojoAttachPoint='_scrollingListArea' class='scrollListArea'>" + '</div>' + '</div>' + '</div>';
    tab.ScrollingList.initializeBase(this);
    this._disposables$1 = new tab.DisposableHolder();
    this._filter$1 = listParams.filter;
    this.isRemovable = (listParams.isRemovable || false);
    if (ss.isValue(this._filter$1)) {
        this.bHasAll = !listParams.isSearchWidget && this._filter$1.get_modeContents().shouldUseAllItem() && this._filter$1.get_oFilter().table.tuples.length > 0 && !this.isRemovable;
        this._itemName$1 = tab.FilterItemUtil.getBaseItemName(this._filter$1, 'FIP');
        this._hideSel$1 = this._filter$1.get_oFilter().exclude && this._filter$1.get_oFilter().all;
    }
    else {
        this._itemName$1 = 'FIP';
        this._hideSel$1 = false;
    }
    this.itemList = (listParams.listItems || []);
    this.isMultiValue = listParams.isMultiValue;
    this.facet = (listParams.bFacet || '');
    this.itemFormatter = (listParams.itemFormatter || tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml);
}
tab.ScrollingList.createScrollingList = function tab_ScrollingList$createScrollingList(listParams) {
    return new tableau.mobile.widget.catmode.popup.ScrollingList(listParams, null);
}
tab.ScrollingList.prototype = {
    _hideSel$1: false,
    _filter$1: null,
    itemList: null,
    indices: null,
    _reversIndices$1: null,
    isMultiValue: false,
    bHasAll: false,
    isSearchWidget: false,
    isMsgOnly: false,
    _disposables$1: null,
    scrollOffset: 0,
    prevScrollPos: 0,
    _itemName$1: null,
    _tiledWidget$1: null,
    widgetsInTemplate: false,
    iscrollObj: null,
    scrollHandler: null,
    _isScrolling$1: false,
    _scrollStart$1: null,
    facet: null,
    isRemovable: false,
    itemFormatter: null,
    _scrollingListArea: null,
    scrollWrapper: null,
    isWide: false,
    
    add_dispatchItemsChanged: function tab_ScrollingList$add_dispatchItemsChanged(value) {
        this.__dispatchItemsChanged$1 = ss.Delegate.combine(this.__dispatchItemsChanged$1, value);
    },
    remove_dispatchItemsChanged: function tab_ScrollingList$remove_dispatchItemsChanged(value) {
        this.__dispatchItemsChanged$1 = ss.Delegate.remove(this.__dispatchItemsChanged$1, value);
    },
    
    __dispatchItemsChanged$1: null,
    
    add_deleteRowCalled: function tab_ScrollingList$add_deleteRowCalled(value) {
        this.__deleteRowCalled$1 = ss.Delegate.combine(this.__deleteRowCalled$1, value);
    },
    remove_deleteRowCalled: function tab_ScrollingList$remove_deleteRowCalled(value) {
        this.__deleteRowCalled$1 = ss.Delegate.remove(this.__deleteRowCalled$1, value);
    },
    
    __deleteRowCalled$1: null,
    
    startup: function tab_ScrollingList$startup() {
        this.iscrollObj.refresh();
    },
    
    postCreate: function tab_ScrollingList$postCreate() {
        if (ss.isValue(this._tiledWidget$1)) {
            this._tiledWidget$1.destroy();
            this._tiledWidget$1 = null;
        }
        this._scrollingListArea.innerHTML = '';
        if (this.bHasAll) {
            tab.Checklist.addAllItem($(this._scrollingListArea), this._filter$1, this._itemName$1, this.facet, tab.Checklist.shouldCheckAllItem(this._filter$1.get_oFilter(), this._filter$1.get_modeContents().pendingManager), this.itemFormatter);
        }
        if (ss.isValue(this._filter$1) && this._filter$1.get_oFilter().isTiled) {
            var contentFormatter = new tab.ChecklistContentFormatter(this._filter$1, this._itemName$1, this.itemFormatter);
            this._tiledWidget$1 = tab.TiledWidgetFactory.createListTiledWidget(this._filter$1, this.itemList, this._scrollingListArea, contentFormatter, 41);
        }
        else {
            var html = [];
            for (var i = 0; i < this.itemList.length; i++) {
                if (ss.isValue(this._filter$1)) {
                    html.push(this.itemFormatter(this._filter$1, this.itemList[i], this._itemName$1, i));
                }
                else {
                    var id = this._itemName$1 + '_' + i;
                    if (!this.isRemovable) {
                        html.push(tableau.mobile.FilterItemMobile.getScrollingListRowHtml(id, tableau.format.formatTupleDisplayName(this.itemList[i]), null, false, this.itemList[i].s, false, false));
                    }
                    else {
                        html.push(tableau.mobile.FilterItemMobile.getScrollingListRemovableRowHtml(id, tableau.format.formatTupleDisplayName(this.itemList[i])));
                    }
                }
            }
            this._scrollingListArea.innerHTML += html.join('');
        }
        this._enableTouchEvents();
        if (ss.isValue(this.indices)) {
            this._reversIndices$1 = [];
            for (var i = 0; i < this.indices.length; i++) {
                this._reversIndices$1[this.indices[i]] = i;
            }
        }
    },
    
    _enableTouchEvents: function tab_ScrollingList$_enableTouchEvents() {
        var config = spiff.$create_EventHandleSpec();
        config.tap = ss.Delegate.create(this, this.onSelect);
        this.scrollHandler = new spiff.TableauEventHandler(this._scrollingListArea, config);
        var scrollOptions = spiff.$create_MobileScrollerOptions();
        scrollOptions.displayPolicy = 'always';
        this.iscrollObj = new spiff.MobileScroller(this._scrollingListArea, this.scrollHandler, scrollOptions);
        this.iscrollObj.add_touchMoveCalled(ss.Delegate.create(this, this._onDrag$1));
        this.iscrollObj.add_touchStartCalled(ss.Delegate.create(this, this._onDragStart$1));
        this.iscrollObj.add_resetPositionCalled(ss.Delegate.create(this, this.resetPos));
        this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.iscrollObj.remove_touchMoveCalled(ss.Delegate.create(this, this._onDrag$1));
            this.iscrollObj.remove_touchStartCalled(ss.Delegate.create(this, this._onDragStart$1));
            this.iscrollObj.remove_resetPositionCalled(ss.Delegate.create(this, this.resetPos));
        })));
    },
    
    destroy: function tab_ScrollingList$destroy() {
        this.scrollHandler.destroy();
        this.iscrollObj.dispose();
        this.inherited(arguments);
        this._disposables$1.dispose();
    },
    
    onSelect: function tab_ScrollingList$onSelect(evt) {
        if (this.isMsgOnly) {
            evt.stopPropagation();
            evt.preventDefault();
            return;
        }
        var index = this._inferRowIndex$1(evt.target);
        if (!this.isRemovable) {
            this.hitTest(index);
        }
        else if (dojo.hasClass(evt.target, 'wcIconSearchRemove')) {
            this.deleteRow(index);
        }
    },
    
    hitTest: function tab_ScrollingList$hitTest(index) {
        if (this.isMultiValue) {
            this.multiValueHitTest(index);
        }
        else {
            this.singleValueHitTest(index);
        }
    },
    
    multiValueHitTest: function tab_ScrollingList$multiValueHitTest(index, searchState) {
        var isChecked = this.toggleSelectedAtIndex(index);
        var state = (!ss.isUndefined(searchState)) ? searchState : isChecked;
        if (index === tab.FilterItemUtil.allItemIndex) {
            var first = true;
            var otherItemState = (ss.isValue(this._filter$1)) ? (state ^ this._filter$1.get_oFilter().exclude) === 1 : state;
            var $enum1 = ss.IEnumerator.getEnumerator(this.getRowList().get());
            while ($enum1.moveNext()) {
                var row = $enum1.current;
                if (!first) {
                    this.setSelectedRow(row, otherItemState);
                }
                else {
                    first = false;
                }
            }
        }
        this._notifyItemChanged$1(index, state);
    },
    
    singleValueHitTest: function tab_ScrollingList$singleValueHitTest(index) {
        if (this.isSelectedAtIndex(index)) {
            return;
        }
        this.setSelectedAtIndex(index, true);
        var $enum1 = ss.IEnumerator.getEnumerator(this.getRowList().get());
        while ($enum1.moveNext()) {
            var row = $enum1.current;
            var rowIndex = this._inferRowIndex$1(row);
            if (index !== rowIndex) {
                this.setSelectedRow(row, false);
            }
        }
        this._notifyItemChanged$1(index, true);
    },
    
    _notifyItemChanged$1: function tab_ScrollingList$_notifyItemChanged$1(index, newState) {
        if (ss.isValue(this.__dispatchItemsChanged$1)) {
            var changedItemList = [];
            var changedItem = {};
            changedItem.rowIndex = index;
            changedItem.rowState = newState;
            changedItemList.push(changedItem);
            this.__dispatchItemsChanged$1(changedItemList, index);
        }
    },
    
    _onDrag$1: function tab_ScrollingList$_onDrag$1(e) {
        $(this._scrollingListArea).trigger('scroll');
        this.scrollOffset = this.prevScrollPos - (-this.iscrollObj.get_scrollPos().x);
        this._redrawAllXs$1(false);
        this.prevScrollPos = -this.iscrollObj.get_scrollPos().x;
    },
    
    _onDragStart$1: function tab_ScrollingList$_onDragStart$1(e) {
        this.prevScrollPos = -this.iscrollObj.get_scrollPos().x;
        this._isScrolling$1 = true;
        this._scrollStart$1 = Date.get_now();
        window.setTimeout(ss.Delegate.create(this, this._scrollTimer$1), 250);
    },
    
    _scrollTimer$1: function tab_ScrollingList$_scrollTimer$1() {
        $(this._scrollingListArea).trigger('scroll');
        if (this._isScrolling$1 && Date.get_now().getTime() - this._scrollStart$1.getTime() < 10000) {
            window.setTimeout(ss.Delegate.create(this, this._scrollTimer$1), 500);
        }
    },
    
    resetPos: function tab_ScrollingList$resetPos() {
        $(this._scrollingListArea).trigger('scroll');
        this._isScrolling$1 = false;
        this.scrollOffset = 245 - (-this.iscrollObj.get_scrollPos().x);
        this._redrawAllXs$1(true);
    },
    
    _redrawAllXs$1: function tab_ScrollingList$_redrawAllXs$1(useAbsolutePos) {
        if (!this.isRemovable) {
            return;
        }
        var heightOfSingleRow = this._getRowHeight();
        var totalRowsHeight = dojo.style(this.scrollWrapper, 'height');
        var numVisibleRows = Math.ceil(totalRowsHeight / heightOfSingleRow);
        var absYoffset = Math.abs(-this.iscrollObj.get_scrollPos().y);
        var numRowsOffscreen = Math.floor(absYoffset / heightOfSingleRow);
        for (var i = numRowsOffscreen; i < (numRowsOffscreen + numVisibleRows) && i < this.itemList.length; i++) {
            this._repositionX$1(this.getRowAtIndex(i), this.scrollOffset, useAbsolutePos);
        }
    },
    
    _repositionX$1: function tab_ScrollingList$_repositionX$1(row, offset, useAbsolutePos) {
        var left = (useAbsolutePos) ? '0' : dojo.style(row, 'left');
        dojo.style(row, 'left', left + offset + 'px');
    },
    
    deleteRow: function tab_ScrollingList$deleteRow(index) {
        this.iscrollObj.refresh();
        this._notifyItemChanged$1(index, false);
        if (ss.isValue(this.__deleteRowCalled$1)) {
            this.__deleteRowCalled$1();
        }
    },
    
    deleteAllRows: function tab_ScrollingList$deleteAllRows() {
        var changedItemList = [];
        for (var i = 0; i < this.itemList.length; i++) {
            var changedItem = {};
            changedItem.rowIndex = i;
            changedItem.rowState = false;
            changedItemList.push(changedItem);
        }
        this.iscrollObj.refresh();
        if (ss.isValue(this.__dispatchItemsChanged$1)) {
            this.__dispatchItemsChanged$1(changedItemList, tab.FilterItemUtil.unknownItemIndex);
        }
    },
    
    _inferRowIndex$1: function tab_ScrollingList$_inferRowIndex$1(node) {
        node = tab.FilterItemUtil.getClassElement(node, 'ListRow');
        if (ss.isValue(node)) {
            var index = tab.FilterItemUtil.getIndexFromId(node.id);
            return (ss.isValue(this.indices)) ? this.indices[index] : index;
        }
        return tab.FilterItemUtil.unknownItemIndex;
    },
    
    getRowList: function tab_ScrollingList$getRowList() {
        return $(this._scrollingListArea).find('.ListRow');
    },
    
    getRowAtIndex: function tab_ScrollingList$getRowAtIndex(index) {
        if (index === tab.FilterItemUtil.allItemIndex) {
            return (this.bHasAll) ? this._scrollingListArea.firstChild : null;
        }
        if (ss.isValue(this.indices)) {
            index = this._reversIndices$1[index];
        }
        if (ss.isValue(this._tiledWidget$1)) {
            return this._tiledWidget$1.getElement(index);
        }
        return this._scrollingListArea.children[(this.bHasAll) ? index + 1 : index];
    },
    
    clearAll: function tab_ScrollingList$clearAll() {
        for (var i = 0; i < this.itemList.length; i++) {
            this.setSelectedAtIndex(i, false);
        }
    },
    
    _setClassStateAtIndex$1: function tab_ScrollingList$_setClassStateAtIndex$1(index, className, state) {
        this._setClassStateForRow$1(this.getRowAtIndex(index), className, state);
    },
    
    _setClassStateForRow$1: function tab_ScrollingList$_setClassStateForRow$1(row, className, state) {
        dojo.toggleClass(row, className, state);
    },
    
    _toggleClassStateAtIndex$1: function tab_ScrollingList$_toggleClassStateAtIndex$1(index, className) {
        return tab.FilterItemUtil.toggleClassState(this.getRowAtIndex(index), className);
    },
    
    _getClassStateAtIndex$1: function tab_ScrollingList$_getClassStateAtIndex$1(index, className) {
        return this._getClassStateForRow$1(this.getRowAtIndex(index), className);
    },
    
    _getClassStateForRow$1: function tab_ScrollingList$_getClassStateForRow$1(row, className) {
        return dojo.hasClass(row, className);
    },
    
    setSelectedAtIndex: function tab_ScrollingList$setSelectedAtIndex(index, state) {
        this._setClassStateAtIndex$1(index, 'checked', state);
    },
    
    setSelectedRow: function tab_ScrollingList$setSelectedRow(row, state) {
        this._setClassStateForRow$1(row, 'checked', state);
    },
    
    isSelectedAtIndex: function tab_ScrollingList$isSelectedAtIndex(index) {
        return this._getClassStateAtIndex$1(index, 'checked');
    },
    
    isSelectedRow: function tab_ScrollingList$isSelectedRow(row) {
        return this._getClassStateForRow$1(row, 'checked');
    },
    
    toggleSelectedAtIndex: function tab_ScrollingList$toggleSelectedAtIndex(index) {
        return this._toggleClassStateAtIndex$1(index, 'checked');
    },
    
    toggleSelectedRow: function tab_ScrollingList$toggleSelectedRow(row) {
        return tab.FilterItemUtil.toggleClassState(row, 'checked');
    },
    
    togglePendingAtIndex: function tab_ScrollingList$togglePendingAtIndex(index) {
        this._toggleClassStateAtIndex$1(index, 'pending');
    },
    
    togglePendingRow: function tab_ScrollingList$togglePendingRow(row) {
        return tab.FilterItemUtil.toggleClassState(row, 'pending');
    },
    
    isPendingRow: function tab_ScrollingList$isPendingRow(row) {
        return this._getClassStateForRow$1(row, 'pending');
    },
    
    getListSize: function tab_ScrollingList$getListSize() {
        var rows = this.itemList.length + ((this.isMultiValue && !this.isSearchWidget) ? 1 : 0);
        return rows * this._getRowHeight();
    },
    
    _getRowHeight: function tab_ScrollingList$_getRowHeight() {
        var rowQuery = dojo.query('.ListRow:first-child', this._scrollingListArea);
        var firstRow = rowQuery.at(0);
        if (firstRow.length > 0) {
            var rowMarginBox = dojo.marginBox(firstRow[0]);
            return rowMarginBox.h;
        }
        return 0;
    },
    
    getListRowCont: function tab_ScrollingList$getListRowCont() {
        return this.itemList.length;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ScrollListener

tab.ScrollListener = function tab_ScrollListener() {
}
tab.ScrollListener.prototype = {
    _iScrollRef: null,
    _listPos: 0,
    _maxListPos: 0,
    _scrollListener: null,
    
    setupScrollListener: function tab_ScrollListener$setupScrollListener(scroller) {
        this._iScrollRef = scroller;
        if (ss.isNullOrUndefined(this._iScrollRef)) {
            return;
        }
        var scrollCallback = ss.Delegate.create(this, function() {
            this._maxListPos = -this._iScrollRef.get_maxScroll().y;
            this._listPos = Math.min(Math.max(this._iScrollRef.get_scrollPos().y, 0), this._maxListPos);
        });
        if (ss.isValue(this._scrollListener)) {
            this._scrollListener.dispose();
        }
        this._scrollListener = new tab.DisposableHolder();
        this._iScrollRef.add_touchEndCalled(scrollCallback);
        this._scrollListener.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._iScrollRef.remove_touchEndCalled(scrollCallback);
        })));
        scroller.set_onScrollEnd(scrollCallback);
        this.doScrollToLastPos();
    },
    
    doScrollToLastPos: function tab_ScrollListener$doScrollToLastPos() {
        if (this._listPos > 0) {
            this._iScrollRef.scrollTo(0, -this._listPos, 10);
        }
    },
    
    _resetScrollPos: function tab_ScrollListener$_resetScrollPos() {
        this._listPos = 0;
        this._maxListPos = 0;
    },
    
    dispose: function tab_ScrollListener$dispose() {
        if (ss.isValue(this._scrollListener)) {
            this._scrollListener.dispose();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TypeInMobile

tab.TypeInMobile = function tab_TypeInMobile(parent, div, attrs) {
    tab.TypeInMobile.initializeBase(this, [ parent, div, attrs ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.TypeInMobile.prototype = {
    contentNode: null,
    touchHandler: null,
    iscroller: null,
    domNode: null,
    domBox: null,
    _inplaceMobile$2: null,
    
    get_inplaceMobile: function tab_TypeInMobile$get_inplaceMobile() {
        return this._inplaceMobile$2;
    },
    set_inplaceMobile: function tab_TypeInMobile$set_inplaceMobile(value) {
        this._inplaceMobile$2 = value;
        return value;
    },
    
    get__popup$2: function tab_TypeInMobile$get__popup$2() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_TypeInMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_TypeInMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBox() : this.domBox;
    },
    
    instantiate: function tab_TypeInMobile$instantiate(t, itemName, isAll) {
        var itemHTML = [];
        for (var i = 0; i < t.length; i++) {
            if (t[i].s) {
                var id = itemName + '_' + i;
                itemHTML.push(tableau.mobile.FilterItemMobile.getTypeInHtml(id, this.formatTuple(t[i])));
            }
        }
        this.contentNode = dojo.doc.createElement('div');
        this.div.appendChild(this.contentNode);
        dojo.style(this.div, 'overflow', 'hidden');
        this.contentNode.innerHTML = itemHTML.join('');
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this.createPopup(t);
        this.iscroller = new spiff.MobileScroller(this.contentNode, this.touchHandler, null);
    },
    
    layout: function tab_TypeInMobile$layout(contentSize, horizontalLayout) {
        dojo.marginBox(this.div, contentSize);
        if (ss.isValue(this.iscroller)) {
            this.iscroller.refresh();
        }
    },
    
    destroy: function tab_TypeInMobile$destroy() {
        this.dispose();
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
        if (ss.isValue(this.iscroller)) {
            this.iscroller.dispose();
        }
    },
    
    _updateFromPopup$2: function tab_TypeInMobile$_updateFromPopup$2(changedItemList, listIndex) {
        var table = this.parent.get_oFilter().table;
        var currentState = {};
        currentState.schema = table.schema;
        currentState.tuples = [];
        var t = table.tuples;
        var len = changedItemList.length;
        for (var i = 0; i < len; i++) {
            var item = changedItemList[i];
            t[item.rowIndex].s = item.rowState;
            currentState.tuples.push(t[item.rowIndex]);
        }
        this.updateViz(currentState);
    },
    
    createPopup: function tab_TypeInMobile$createPopup(items) {
        var title = tableau.format.formatColumnDisplayName(this.parent.get_oFilter());
        var popupClass = tableau.mobile.widget.catmode.popup.CustomValueListPopup;
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.listItems = items;
        popupParams.listParams.isMultiValue = true;
        popupParams.title = title;
        popupParams.options = true;
        popupParams.lessMore = true;
        popupParams.search = true;
        popupParams.mode = 'typeIn';
        popupParams.qf = this.parent;
        popupParams.listParams.filter = this.parent;
        popupParams.listParams.itemFormatter = tableau.mobile.FilterItemMobile.formatRemovableListRowFilterItemHtml;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get__popup$2().get_list().add_dispatchItemsChanged(ss.Delegate.create(this, this._updateFromPopup$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get__popup$2().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._updateFromPopup$2));
        })));
        this.get__popup$2().createControls();
    },
    
    get_uniqueNodeId: function tab_TypeInMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    updateViz: function tab_TypeInMobile$updateViz(state) {
        var addAliases = [];
        var removeAliases = [];
        if (!!state.tuples.length) {
            this.parent.set_stateId(this.parent.get_stateId() + 1);
            var count = state.tuples.length;
            for (var i = 0; i < count; i++) {
                var alias = state.tuples[i].d || state.tuples[i].t[0].v;
                if (!!state.tuples[i].s) {
                    addAliases.push(alias);
                }
                else {
                    removeAliases.push(alias);
                }
            }
            tab.FilterClientCommands.modifyCategoricalFilterValues(this.parent.get_session().get_visualId(), this.parent.get_field(), addAliases, removeAliases);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PatternMobile

tab.PatternMobile = function tab_PatternMobile(parent, div, attrs) {
    tab.PatternMobile.initializeBase(this, [ parent, div, attrs ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.PatternMobile.prototype = {
    id: null,
    pattern: null,
    domNode: null,
    domBox: null,
    _inplaceMobile$2: null,
    
    get_inplaceMobile: function tab_PatternMobile$get_inplaceMobile() {
        return this._inplaceMobile$2;
    },
    set_inplaceMobile: function tab_PatternMobile$set_inplaceMobile(value) {
        this._inplaceMobile$2 = value;
        return value;
    },
    
    get__popup$2: function tab_PatternMobile$get__popup$2() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_PatternMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_PatternMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBox() : this.domBox;
    },
    
    instantiate: function tab_PatternMobile$instantiate(newPattern, itemName) {
        this.id = itemName;
        this.disposables = new tab.DisposableHolder();
        this.pattern = newPattern;
        if (ss.isUndefined(newPattern)) {
            this.pattern = '';
        }
        this.div.innerHTML = '<span class="FIMContainer FIMPattern" id="' + this.id + '"><span class="wcInplaceSearch" style="float:left; margin-left:2px; margin-right:3px;"></span>' + '<span class="FIMItem tab-ctrl-formatted-text">' + this.pattern + '</span></span>';
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this.createPopup();
    },
    
    destroy: function tab_PatternMobile$destroy() {
        this.dispose();
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
    },
    
    updateFromPopup: function tab_PatternMobile$updateFromPopup(newPattern) {
        this.parent.set_stateId(this.parent.get_stateId() + 1);
        this.parent.get_session().setPatternFilterState(newPattern, this.parent);
        this.parent.get_oFilter().pattern = newPattern;
    },
    
    createPopup: function tab_PatternMobile$createPopup() {
        var title = tableau.format.formatColumnDisplayName(this.parent.get_oFilter(), false);
        var popupClass = tableau.mobile.widget.catmode.popup.PatternPopup;
        var popupParams = {};
        popupParams.pattern = this.pattern;
        popupParams.title = title;
        popupParams.type = 'Pattern';
        popupParams.options = true;
        popupParams.lessMore = true;
        popupParams.search = true;
        popupParams.mode = 'pattern';
        popupParams.qf = this.parent;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get__popup$2().patternWidget.add_updatePattern(ss.Delegate.create(this, this.updateFromPopup));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get__popup$2().patternWidget.remove_updatePattern(ss.Delegate.create(this, this.updateFromPopup));
        })));
        this.get__popup$2().createControls();
    },
    
    get_uniqueNodeId: function tab_PatternMobile$get_uniqueNodeId() {
        return this.parent.id;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RadiolistMobile

tab.RadiolistMobile = function tab_RadiolistMobile(parent, div, attrs) {
    tab.RadiolistMobile.initializeBase(this, [ parent, div, attrs ]);
    this.set_itemFormatter(tableau.mobile.FilterItemMobile.formatRadiolistFilterItemHtml);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.RadiolistMobile.prototype = {
    iscroller: null,
    touchHandler: null,
    domNode: null,
    domBox: null,
    _inplaceMobile$3: null,
    
    get_inplaceMobile: function tab_RadiolistMobile$get_inplaceMobile() {
        return this._inplaceMobile$3;
    },
    set_inplaceMobile: function tab_RadiolistMobile$set_inplaceMobile(value) {
        this._inplaceMobile$3 = value;
        return value;
    },
    
    get__popup$3: function tab_RadiolistMobile$get__popup$3() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_RadiolistMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_RadiolistMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBox() : this.domBox;
    },
    
    instantiate: function tab_RadiolistMobile$instantiate(tuples, itemName, facet) {
        this.contentNode = dojo.doc.createElement('div');
        this.div.appendChild(this.contentNode);
        dojo.style(this.div, 'overflow', 'hidden');
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this.iscroller = new spiff.MobileScroller(this.contentNode, this.touchHandler, null);
        this.resetContent(tuples, itemName, facet);
    },
    
    resetContent: function tab_RadiolistMobile$resetContent(tuples, itemName, facet) {
        this._destroyPopup$3();
        tab.RadiolistMobile.callBaseMethod(this, 'resetContent', [ tuples, itemName, facet ]);
        tableau.util.defer(ss.Delegate.create(this, function() {
            this.createPopup(tuples, facet);
        }));
    },
    
    shouldNotReinstantiate: function tab_RadiolistMobile$shouldNotReinstantiate() {
        return ss.isValue(this.get__popup$3()) && ss.isValue(this.get__popup$3().get_searchWidget()) && this.get__popup$3().get_searchWidget().isShowingResults();
    },
    
    layout: function tab_RadiolistMobile$layout(contentSize, horizontalLayout) {
        dojo.marginBox(this.div, contentSize);
        if (ss.isValue(this.iscroller)) {
            this.iscroller.refresh();
        }
    },
    
    dispose: function tab_RadiolistMobile$dispose() {
        this._destroyPopup$3();
        tab.RadiolistMobile.callBaseMethod(this, 'dispose');
    },
    
    _destroyPopup$3: function tab_RadiolistMobile$_destroyPopup$3() {
        if (ss.isValue(this.iscroller)) {
            this.iscroller.dispose();
        }
    },
    
    destroy: function tab_RadiolistMobile$destroy() {
        this.dispose();
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
    },
    
    createPopup: function tab_RadiolistMobile$createPopup(items, facet) {
        var title = tableau.format.formatColumnDisplayName(this.parent.get_oFilter());
        var popupClass = tableau.mobile.widget.catmode.popup.ListPopup;
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.filter = this.parent;
        popupParams.listParams.listItems = items;
        popupParams.listParams.isMultiValue = false;
        popupParams.listParams.bFacet = facet;
        popupParams.title = title;
        popupParams.qf = this.parent;
        popupParams.listParams.itemFormatter = tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopupAndAttachHandler(ss.Delegate.create(this, this._applyChangesToItem$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get__popup$3().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$3));
        })));
        this.get__popup$3().createControls();
    },
    
    get_uniqueNodeId: function tab_RadiolistMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    _applyChangesToItem$3: function tab_RadiolistMobile$_applyChangesToItem$3(changedItemList, listIndex) {
        var table = this.parent.get_oFilter().table;
        var currentState = {};
        currentState.schema = table.schema;
        currentState.tuples = [];
        var t = table.tuples;
        if (!changedItemList.length) {
            return;
        }
        if (listIndex === tab.FilterItemUtil.allItemIndex) {
            var item = this.contentNode.firstChild;
            tableau.mobile.FilterItemMobile.setChecked(item, true);
            for (var j = 0; j < t.length; j++) {
                item = this.tiledWidget.getElement(j);
                tableau.mobile.FilterItemMobile.setChecked(item, false);
            }
            this.parent.doSelectAll(true);
        }
        else {
            for (var j = 0; j < t.length; j++) {
                var item = this.tiledWidget.getElement(j);
                if (listIndex === j && !tableau.mobile.FilterItemMobile.isChecked(item)) {
                    currentState.tuples.push(tableau.mobile.FilterItemMobile.setChecked(item, true, t[j]));
                }
                else if (listIndex !== j) {
                    tableau.mobile.FilterItemMobile.setChecked(item, false, t[j]);
                }
            }
            if (!!currentState.tuples.length) {
                this.parent.set_stateId(this.parent.get_stateId() + 1);
                var change = new tab.RawChange();
                var changelist = new tab.Changelist();
                change.setSingle(listIndex, true);
                changelist.addChange(change);
                this.applyChangesByChangelist(changelist, this.parent.get_mode());
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.DojoWidgetsMobile

tab.DojoWidgetsMobile = function tab_DojoWidgetsMobile() {
}


////////////////////////////////////////////////////////////////////////////////
// tab.DoubleSliderMobile

tab.DoubleSliderMobile = function tab_DoubleSliderMobile(sliderAttributes) {
    this.templateString = "<div dojoAttachPoint='_doubleSliderWrapper' class='doubleSliderWrapper'>" + "<div dojoAttachPoint='_sliderThumbtrackRail' class='sliderThumbtrackRail'>" + "<div dojoAttachPoint='_limitsRail' class='sliderLimitsRail'>" + "<div dojoAttachPoint='_completedRail' class='sliderRangeRail'></div>" + '</div>' + "<div id='leftThumbWrapper' dojoAttachPoint='_sliderThumbTrackLeft' class='leftThumbtrackWrapper'>" + "<div id='doubleSliderLeft' dojoAttachPoint='_sliderThumbTrackLeftImage' class='leftThumbtrack'></div>" + '</div>  ' + "<div id='rightThumbWrapper' dojoAttachPoint='_sliderThumbTrackRight' class='rightThumbtrackWrapper'>" + "<div id= 'doubleSliderRight' dojoAttachPoint='_sliderThumbTrackRightImage' class='rightThumbtrack'>" + '</div>' + '</div>' + '</div>' + '</div>';
    this._sliderTouchHandlers$1 = [];
    tab.DoubleSliderMobile.initializeBase(this);
    this._attributes$1 = sliderAttributes;
}
tab.DoubleSliderMobile.prototype = {
    _sliderRange$1: 0,
    _leftLimit$1: 0,
    _rightLimit$1: 0,
    _zoomFactor$1: 0,
    _max$1: null,
    _min$1: null,
    _newSliderLocationLeft$1: 0,
    _currentSliderLocationLeft$1: 0,
    _newSliderLocationRight$1: 0,
    _currentSliderLocationRight$1: 0,
    _scaleFactor$1: 0,
    _timer$1: null,
    _parentObject$1: null,
    _sliderHandleWidth$1: 0,
    _showLeftSlider$1: false,
    _showRightSlider$1: false,
    _showDataRangeRail$1: false,
    _rangeRailLeftLimit$1: 0,
    _rangeRailRightLimit$1: 0,
    _rangeRailOriginalStartPos$1: 0,
    _precision$1: 0,
    _attributes$1: null,
    _dataState$1: null,
    _dataType$1: null,
    _rangeMin$1: null,
    _rangeMax$1: null,
    _userMin$1: null,
    _userMax$1: null,
    _currentMin$1: null,
    _currentMax$1: null,
    _latestRailX$1: 0,
    _sliderThumbTrackLeft: null,
    _sliderThumbTrackRight: null,
    _sliderThumbTrackLeftImage: null,
    _sliderThumbTrackRightImage: null,
    _sliderThumbtrackRail: null,
    _limitsRail: null,
    _completedRail: null,
    
    add_updateLeftReadout: function tab_DoubleSliderMobile$add_updateLeftReadout(value) {
        this.__updateLeftReadout$1 = ss.Delegate.combine(this.__updateLeftReadout$1, value);
    },
    remove_updateLeftReadout: function tab_DoubleSliderMobile$remove_updateLeftReadout(value) {
        this.__updateLeftReadout$1 = ss.Delegate.remove(this.__updateLeftReadout$1, value);
    },
    
    __updateLeftReadout$1: null,
    
    add_updateRightReadout: function tab_DoubleSliderMobile$add_updateRightReadout(value) {
        this.__updateRightReadout$1 = ss.Delegate.combine(this.__updateRightReadout$1, value);
    },
    remove_updateRightReadout: function tab_DoubleSliderMobile$remove_updateRightReadout(value) {
        this.__updateRightReadout$1 = ss.Delegate.remove(this.__updateRightReadout$1, value);
    },
    
    __updateRightReadout$1: null,
    
    add_setReadoutState: function tab_DoubleSliderMobile$add_setReadoutState(value) {
        this.__setReadoutState$1 = ss.Delegate.combine(this.__setReadoutState$1, value);
    },
    remove_setReadoutState: function tab_DoubleSliderMobile$remove_setReadoutState(value) {
        this.__setReadoutState$1 = ss.Delegate.remove(this.__setReadoutState$1, value);
    },
    
    __setReadoutState$1: null,
    
    add_updateRange: function tab_DoubleSliderMobile$add_updateRange(value) {
        this.__updateRange$1 = ss.Delegate.combine(this.__updateRange$1, value);
    },
    remove_updateRange: function tab_DoubleSliderMobile$remove_updateRange(value) {
        this.__updateRange$1 = ss.Delegate.remove(this.__updateRange$1, value);
    },
    
    __updateRange$1: null,
    
    add_setCurrentMinMax: function tab_DoubleSliderMobile$add_setCurrentMinMax(value) {
        this.__setCurrentMinMax$1 = ss.Delegate.combine(this.__setCurrentMinMax$1, value);
    },
    remove_setCurrentMinMax: function tab_DoubleSliderMobile$remove_setCurrentMinMax(value) {
        this.__setCurrentMinMax$1 = ss.Delegate.remove(this.__setCurrentMinMax$1, value);
    },
    
    __setCurrentMinMax$1: null,
    
    add_onPopupSliderChange: function tab_DoubleSliderMobile$add_onPopupSliderChange(value) {
        this.__onPopupSliderChange$1 = ss.Delegate.combine(this.__onPopupSliderChange$1, value);
    },
    remove_onPopupSliderChange: function tab_DoubleSliderMobile$remove_onPopupSliderChange(value) {
        this.__onPopupSliderChange$1 = ss.Delegate.remove(this.__onPopupSliderChange$1, value);
    },
    
    __onPopupSliderChange$1: null,
    
    postCreate: function tab_DoubleSliderMobile$postCreate() {
    },
    
    startup: function tab_DoubleSliderMobile$startup() {
        this.setupInitValues();
        this.enableTouchHandling();
        this.drawRangeRail();
        this.setPopupReadouts();
    },
    
    setupInitValues: function tab_DoubleSliderMobile$setupInitValues() {
        this._showLeftSlider$1 = this._attributes$1['showLeftHandle'];
        this._showRightSlider$1 = this._attributes$1['showRightHandle'];
        this._dataState$1 = this._attributes$1['rangeMax'].s;
        this._dataType$1 = (this._attributes$1['rangeMax']).t;
        this._rangeMin$1 = (this._attributes$1['rangeMin']).v;
        this._rangeMax$1 = (this._attributes$1['rangeMax']).v;
        this._userMin$1 = (this._attributes$1['dataMin']).v;
        this._userMax$1 = (this._attributes$1['dataMax']).v;
        this._currentMin$1 = (this._attributes$1['currentMin']).v;
        this._currentMax$1 = (this._attributes$1['currentMax']).v;
        this._leftLimit$1 = -dojo.style(this._sliderThumbTrackLeft, 'width');
        this._rightLimit$1 = dojo.style(this._sliderThumbtrackRail, 'width');
        this._sliderRange$1 = this.calculateSliderRange();
        this.calculatePrecision();
        this._scaleFactor$1 = this._sliderRange$1 / this._rightLimit$1;
        this._sliderHandleWidth$1 = parseInt(dojo.style(this._sliderThumbTrackLeft, 'width'));
        this.setupSliders();
        this.setupLimitsIndicatorRail();
        this.setupDataRangeIndicatorRail();
    },
    
    updateData: function tab_DoubleSliderMobile$updateData(attrs) {
        this._attributes$1 = attrs;
        this.setupInitValues();
        this.drawRangeRail();
        this.setPopupReadouts();
        this.setupSliders();
    },
    
    setupSliders: function tab_DoubleSliderMobile$setupSliders() {
        var pixelPosition;
        ($(this._sliderThumbTrackLeft)).toggleClass('HFButtonHide', !this._showLeftSlider$1);
        if (!this._showLeftSlider$1) {
            this._newSliderLocationLeft$1 = this._leftLimit$1;
            if (ss.isValue(this.__setReadoutState$1)) {
                this.__setReadoutState$1('left', false);
            }
        }
        else {
            pixelPosition = this.convertIndexToPixels((this._currentMin$1 - this._rangeMin$1), 'left');
            this.setSliderPosition('left', pixelPosition);
            this._newSliderLocationLeft$1 = pixelPosition;
            this._currentSliderLocationLeft$1 = pixelPosition;
        }
        ($(this._sliderThumbTrackRight)).toggleClass('HFButtonHide', !this._showRightSlider$1);
        if (!this._showRightSlider$1) {
            this._newSliderLocationRight$1 = parseInt(dojo.style(this._sliderThumbtrackRail, 'width'));
            if (ss.isValue(this.__setReadoutState$1)) {
                this.__setReadoutState$1('right', false);
            }
        }
        else {
            pixelPosition = this.convertIndexToPixels((this._currentMax$1 - this._rangeMin$1), 'right');
            this.setSliderPosition('right', pixelPosition);
            this._newSliderLocationRight$1 = pixelPosition;
            this._currentSliderLocationRight$1 = pixelPosition;
        }
    },
    
    setParent: function tab_DoubleSliderMobile$setParent(parent) {
        this._parentObject$1 = parent;
    },
    
    setupLimitsIndicatorRail: function tab_DoubleSliderMobile$setupLimitsIndicatorRail() {
        var left = this._newSliderLocationLeft$1 + this._sliderHandleWidth$1;
        dojo.style(this._limitsRail, 'left', left + 'px');
        dojo.style(this._limitsRail, 'width', (this._newSliderLocationRight$1 - left) + 'px');
    },
    
    setupDataRangeIndicatorRail: function tab_DoubleSliderMobile$setupDataRangeIndicatorRail() {
        this._rangeRailOriginalStartPos$1 = 0;
        dojo.style(this._completedRail, 'left', '0px');
        if (this._userMin$1 == null && this._userMax$1 == null) {
            this._showDataRangeRail$1 = false;
        }
        else {
            this._showDataRangeRail$1 = true;
        }
        var dataMin = this._attributes$1['dataMin'];
        var rangeMinVal = this._attributes$1['rangeMin'];
        if (ss.isValue(dataMin.v)) {
            this._rangeRailLeftLimit$1 = this.convertIndexToPixels((dataMin.v - rangeMinVal.v), null);
        }
        var dataMax = this._attributes$1['dataMax'];
        if (ss.isValue(dataMax.v)) {
            this._rangeRailRightLimit$1 = this.convertIndexToPixels((dataMax.v - rangeMinVal.v), null);
        }
    },
    
    drag: function tab_DoubleSliderMobile$drag(elementID, pageX, railX) {
        var newPos;
        var minVal;
        var maxVal;
        pageX = Math.round(pageX * tableau.mobile.util.scaling.getZoomScaleFactor());
        newPos = pageX - railX - Math.abs(this._leftLimit$1);
        if (elementID === this._sliderThumbTrackLeft.id || elementID === this._sliderThumbTrackLeftImage.id) {
            if (newPos < this._leftLimit$1) {
                newPos = this._leftLimit$1;
                this._newSliderLocationLeft$1 = newPos;
            }
            else if ((newPos + this._sliderHandleWidth$1) > this._newSliderLocationRight$1) {
                newPos = this._newSliderLocationRight$1 - this._sliderHandleWidth$1;
                this._newSliderLocationLeft$1 = newPos;
            }
            else {
                this._newSliderLocationLeft$1 = newPos;
            }
            dojo.style(this._sliderThumbTrackLeft, 'left', this._newSliderLocationLeft$1 + 'px');
            this.drawRangeRail();
            if (ss.isValue(this.__updateLeftReadout$1)) {
                this.__updateLeftReadout$1(this.getSliderValue(this._newSliderLocationLeft$1, 'left'), this._dataType$1, this._dataState$1, this._precision$1);
            }
        }
        else if (elementID === this._sliderThumbTrackRight.id || elementID === this._sliderThumbTrackRightImage.id) {
            if (newPos < (this._newSliderLocationLeft$1 + this._sliderHandleWidth$1)) {
                newPos = this._newSliderLocationLeft$1 + this._sliderHandleWidth$1;
                this._newSliderLocationRight$1 = newPos;
            }
            else if (newPos > this._rightLimit$1) {
                newPos = this._rightLimit$1;
                this._newSliderLocationRight$1 = newPos;
            }
            else {
                this._newSliderLocationRight$1 = newPos;
            }
            dojo.style(this._sliderThumbTrackRight, 'left', this._newSliderLocationRight$1 + 'px');
            this.drawRangeRail();
            if (ss.isValue(this.__updateRightReadout$1)) {
                this.__updateRightReadout$1(this.getSliderValue(this._newSliderLocationRight$1, 'right'), this._dataType$1, this._dataState$1, this._precision$1);
            }
        }
        minVal = this.getSliderValue(this._newSliderLocationLeft$1, 'left');
        maxVal = this.getSliderValue(this._newSliderLocationRight$1, 'right');
        if (ss.isValue(this.__updateRange$1)) {
            this.__updateRange$1(minVal, maxVal);
        }
    },
    
    calculateSliderRange: function tab_DoubleSliderMobile$calculateSliderRange() {
        if (ss.isValue(this._currentMin$1)) {
            this._min$1 = (this._rangeMin$1 <= this._currentMin$1) ? this._attributes$1['rangeMin'] : this._attributes$1['currentMin'];
        }
        else {
            this._min$1 = this._attributes$1['rangeMin'];
        }
        if (ss.isValue(this._currentMax$1)) {
            this._max$1 = (this._rangeMax$1 >= this._currentMax$1) ? this._attributes$1['rangeMax'] : this._attributes$1['currentMax'];
        }
        else {
            this._max$1 = this._attributes$1['rangeMax'];
        }
        return (this._max$1.v - this._min$1.v);
    },
    
    getRange: function tab_DoubleSliderMobile$getRange() {
        return this._max$1.v - this._min$1.v;
    },
    
    calculatePrecision: function tab_DoubleSliderMobile$calculatePrecision() {
        var pixelValue = (!!this.getRange()) ? this.getRange() / this._rightLimit$1 : 1;
        var valueDigits = Math.log(pixelValue) / Math.log(10);
        this._precision$1 = (valueDigits > 0) ? Math.ceil(valueDigits) : Math.floor(valueDigits);
        if (this._precision$1 === Number.NEGATIVE_INFINITY || isNaN(this._precision$1)) {
            this._precision$1 = 5;
        }
    },
    
    convertIndexToPixels: function tab_DoubleSliderMobile$convertIndexToPixels(index, slider) {
        if (slider === 'right') {
            return Math.round(index / this._scaleFactor$1);
        }
        else if (slider === 'left') {
            return Math.round(index / this._scaleFactor$1) - this._sliderHandleWidth$1;
        }
        else {
            return Math.round(index / this._scaleFactor$1);
        }
    },
    
    _setTimer$1: function tab_DoubleSliderMobile$_setTimer$1() {
        this._timer$1 = window.setTimeout(ss.Delegate.create(this, this._timerCallback$1), 1000);
    },
    
    _killTimer$1: function tab_DoubleSliderMobile$_killTimer$1() {
        if (ss.isValue(this._timer$1)) {
            window.clearTimeout(this._timer$1);
            this._timer$1 = null;
        }
    },
    
    _timerCallback$1: function tab_DoubleSliderMobile$_timerCallback$1() {
        var leftValue;
        var rightValue;
        var changedFlag = false;
        if (this._newSliderLocationRight$1 !== this._currentSliderLocationRight$1) {
            this._currentSliderLocationRight$1 = this._newSliderLocationRight$1;
            rightValue = this.getSliderValue(this._currentSliderLocationRight$1, 'right');
            changedFlag = true;
        }
        else {
            rightValue = this._currentMax$1;
        }
        if (this._newSliderLocationLeft$1 !== this._currentSliderLocationLeft$1) {
            this._currentSliderLocationLeft$1 = this._newSliderLocationLeft$1;
            leftValue = this.getSliderValue(this._currentSliderLocationLeft$1, 'left');
            changedFlag = true;
        }
        else {
            leftValue = this._currentMin$1;
        }
        if (changedFlag && ss.isValue(this.__onPopupSliderChange$1)) {
            this.__onPopupSliderChange$1(leftValue, rightValue);
        }
    },
    
    setSliderPosition: function tab_DoubleSliderMobile$setSliderPosition(slider, pixelPosition) {
        if (pixelPosition >= this._leftLimit$1 && pixelPosition <= this._rightLimit$1) {
            if (slider === 'left') {
                if (!!this._attributes$1['showLeftHandle']) {
                    dojo.style(this._sliderThumbTrackLeft, 'left', pixelPosition + 'px');
                    this._newSliderLocationLeft$1 = pixelPosition;
                }
            }
            else if (slider === 'right') {
                if (!!this._attributes$1['showRightHandle']) {
                    dojo.style(this._sliderThumbTrackRight, 'left', pixelPosition + 'px');
                    this._newSliderLocationRight$1 = pixelPosition;
                }
            }
        }
    },
    
    drawRangeRail: function tab_DoubleSliderMobile$drawRangeRail() {
        this.setupLimitsIndicatorRail();
        if (!!this._showDataRangeRail$1) {
            var currentLeftLimit;
            var currentRightLimit;
            var leftNewPos;
            var leftCurrentPos;
            if ((this._newSliderLocationLeft$1 + this._sliderHandleWidth$1 > this._rangeRailRightLimit$1) || (this._newSliderLocationRight$1 < this._rangeRailLeftLimit$1)) {
                currentLeftLimit = currentRightLimit = this._rangeRailLeftLimit$1;
            }
            else {
                if (this._newSliderLocationLeft$1 + this._sliderHandleWidth$1 <= this._rangeRailLeftLimit$1) {
                    currentLeftLimit = this._rangeRailLeftLimit$1;
                }
                else {
                    currentLeftLimit = this._newSliderLocationLeft$1 + this._sliderHandleWidth$1;
                }
                if (this._newSliderLocationRight$1 >= this._rangeRailRightLimit$1) {
                    currentRightLimit = this._rangeRailRightLimit$1;
                }
                else {
                    currentRightLimit = this._newSliderLocationRight$1;
                }
            }
            leftNewPos = (this._rangeRailOriginalStartPos$1 + currentLeftLimit);
            leftCurrentPos = parseInt(dojo.style(this._limitsRail, 'left'));
            dojo.style(this._completedRail, 'left', (leftNewPos - leftCurrentPos) + 'px');
            dojo.style(this._completedRail, 'width', (currentRightLimit - currentLeftLimit) + 'px');
        }
        else {
            dojo.style(this._completedRail, 'width', '0' + 'px');
        }
    },
    
    getSliderValue: function tab_DoubleSliderMobile$getSliderValue(posInPixels, slider) {
        var factor;
        if (slider === 'right') {
            if (posInPixels === this._rightLimit$1) {
                return this._rangeMax$1;
            }
            else if (!posInPixels) {
                return this._rangeMin$1;
            }
            if (this._precision$1 < 0) {
                factor = Math.pow(10, -this._precision$1);
                return Math.round((this._rangeMin$1 + (posInPixels * this._scaleFactor$1)) * factor) / factor;
            }
            else {
                return this._rangeMin$1 + Math.round(posInPixels * this._scaleFactor$1);
            }
        }
        else if (slider === 'left') {
            if (posInPixels === this._leftLimit$1) {
                return this._rangeMin$1;
            }
            else if (posInPixels + Math.abs(this._leftLimit$1) === this._rightLimit$1) {
                return this._rangeMax$1;
            }
            var offsetFromStartOfRail = posInPixels + Math.abs(this._leftLimit$1);
            if (this._precision$1 < 0) {
                factor = Math.pow(10, -this._precision$1);
                return Math.round((this._rangeMin$1 + (offsetFromStartOfRail * this._scaleFactor$1)) * factor) / factor;
            }
            else {
                return this._rangeMin$1 + Math.round(offsetFromStartOfRail * this._scaleFactor$1);
            }
        }
        return undefined;
    },
    
    enableTouchHandling: function tab_DoubleSliderMobile$enableTouchHandling() {
        var config_left = spiff.$create_EventHandleSpec();
        config_left.dragMove = ss.Delegate.create(this, this.onDrag);
        config_left.dragStart = ss.Delegate.create(this, this.onDragStart);
        config_left.dragEnd = ss.Delegate.create(this, this.onDragEnd);
        var config_right = spiff.$create_EventHandleSpec();
        config_right.dragMove = ss.Delegate.create(this, this.onDrag);
        config_right.dragStart = ss.Delegate.create(this, this.onDragStart);
        config_right.dragEnd = ss.Delegate.create(this, this.onDragEnd);
        if (!!this._attributes$1['showLeftHandle']) {
            this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._sliderThumbTrackLeft, config_left));
            this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._sliderThumbTrackLeftImage, config_left));
        }
        else {
            dojo.addClass(this._sliderThumbTrackLeft, 'hide');
        }
        if (!!this._attributes$1['showRightHandle']) {
            this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._sliderThumbTrackRight, config_right));
            this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._sliderThumbTrackRightImage, config_left));
        }
        else {
            dojo.addClass(this._sliderThumbTrackRight, 'hide');
        }
    },
    
    getRailX: function tab_DoubleSliderMobile$getRailX() {
        var railFromPopupEdgeX;
        var popupEdgeX;
        var railX;
        var containerNode = this._parentObject$1.containerNode;
        railFromPopupEdgeX = tab.DomUtil.getElementRelativePosition($(this._sliderThumbtrackRail), $(containerNode)).x;
        popupEdgeX = tab.DomUtil.getElementClientPosition($(containerNode)).x;
        popupEdgeX = Math.round(popupEdgeX * tableau.mobile.util.scaling.getZoomScaleFactor());
        railX = popupEdgeX + railFromPopupEdgeX;
        return railX;
    },
    
    onDragStart: function tab_DoubleSliderMobile$onDragStart(e) {
        var currentMinVal;
        var currentMaxVal;
        if (ss.isValue(this._timer$1)) {
            this._killTimer$1();
        }
        this._latestRailX$1 = this.getRailX();
        if (this._showLeftSlider$1) {
            currentMinVal = this.getSliderValue(this._newSliderLocationLeft$1, 'left');
        }
        else {
            currentMinVal = null;
        }
        if (this._showRightSlider$1) {
            currentMaxVal = this.getSliderValue(this._newSliderLocationRight$1, 'right');
        }
        else {
            currentMaxVal = null;
        }
        if (ss.isValue(this.__setCurrentMinMax$1)) {
            this.__setCurrentMinMax$1(currentMinVal, currentMaxVal);
        }
    },
    
    onDrag: function tab_DoubleSliderMobile$onDrag(e) {
        this.drag(e.target.id, e.pageX, this._latestRailX$1);
        e.preventDefault();
    },
    
    onDragEnd: function tab_DoubleSliderMobile$onDragEnd(e) {
        if (ss.isValue(this._timer$1)) {
            this._killTimer$1();
        }
        this._setTimer$1();
    },
    
    setPopupReadouts: function tab_DoubleSliderMobile$setPopupReadouts() {
        if (this._currentMin$1 != null) {
            if (ss.isValue(this.__updateLeftReadout$1)) {
                this.__updateLeftReadout$1(this._currentMin$1, this._dataType$1, this._dataState$1, this._precision$1);
            }
        }
        else {
            var rangeMinVal = this._attributes$1['rangeMin'];
            if (ss.isValue(this.__updateLeftReadout$1) && ss.isValue(rangeMinVal.v)) {
                this.__updateLeftReadout$1(rangeMinVal.v, rangeMinVal.t, this._rangeMin$1.s, this._precision$1);
            }
        }
        if (this._currentMax$1 != null) {
            if (ss.isValue(this.__updateRightReadout$1)) {
                this.__updateRightReadout$1(this._currentMax$1, this._dataType$1, this._dataState$1, this._precision$1);
            }
        }
        else {
            var rangeMaxVal = this._attributes$1['rangeMax'];
            if (ss.isValue(this.__updateRightReadout$1) && ss.isValue(rangeMaxVal.v)) {
                this.__updateRightReadout$1(rangeMaxVal.v, rangeMaxVal.t, this._rangeMax$1.s, this._precision$1);
            }
        }
    },
    
    destroy: function tab_DoubleSliderMobile$destroy() {
        this._killTimer$1();
        var $enum1 = ss.IEnumerator.getEnumerator(this._sliderTouchHandlers$1);
        while ($enum1.moveNext()) {
            var h = $enum1.current;
            h.dispose();
        }
        this._sliderTouchHandlers$1 = [];
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FeedbackMobile

tab.FeedbackMobile = function tab_FeedbackMobile() {
}
tab.FeedbackMobile._tapDone = function tab_FeedbackMobile$_tapDone(tapFeedback) {
    delete tab.FeedbackMobile._currentTaps[tapFeedback.tapID];
    tab.FeedbackMobile._unusedTaps.push(tapFeedback);
}
tab.FeedbackMobile._sanityCheck = function tab_FeedbackMobile$_sanityCheck() {
    if (tab.FeedbackMobile._tapCreationCount >= 5) {
        var $dict1 = tab.FeedbackMobile._currentTaps;
        for (var $key2 in $dict1) {
            var elem = { key: $key2, value: $dict1[$key2] };
            if (tab.MiscUtil.hasOwnProperty(tab.FeedbackMobile._currentTaps, elem.key)) {
                tab.FeedbackMobile._currentTaps[elem.key].resetToInitialState();
                tab.FeedbackMobile._currentTaps[elem.key].destroy();
            }
        }
        tab.FeedbackMobile._currentTaps = {};
        tab.FeedbackMobile._tapCreationCount = 0;
    }
    if (tab.FeedbackMobile._unusedTaps.length >= 5) {
        for (var i = 5, len = tab.FeedbackMobile._unusedTaps.length; i < len; i++) {
            var f = tab.FeedbackMobile._unusedTaps.pop();
            f.destroy();
        }
    }
}
tab.FeedbackMobile._makeNewTapFeedback = function tab_FeedbackMobile$_makeNewTapFeedback(placeUnder, pseudoEvent) {
    var tapFeedback = new tableau.mobile.widget.feedback.TapFeedback(tab.$create_TapFeedbackArgs(placeUnder, pseudoEvent, tab.FeedbackMobile._tapDone));
    tab.FeedbackMobile._tapCreationCount += 1;
    tapFeedback.tapID = tab.FeedbackMobile._tapCreationCount.toString();
    tab.FeedbackMobile._currentTaps[tab.FeedbackMobile._tapCreationCount.toString()] = tapFeedback;
    return tapFeedback;
}
tab.FeedbackMobile._initTapFeedback = function tab_FeedbackMobile$_initTapFeedback(count) {
    for (var i = 0; i < count; i++) {
        tab.FeedbackMobile._unusedTaps.push(tab.FeedbackMobile._makeNewTapFeedback(null, null));
    }
}
tab.FeedbackMobile.createTapFeedback = function tab_FeedbackMobile$createTapFeedback(placeUnder, pseudoEvent) {
    var tapFeedback;
    tab.FeedbackMobile._sanityCheck();
    if (tab.FeedbackMobile._unusedTaps.length < 1) {
        tapFeedback = tab.FeedbackMobile._makeNewTapFeedback(placeUnder, pseudoEvent);
    }
    else {
        tapFeedback = tab.FeedbackMobile._unusedTaps.pop();
    }
    tapFeedback.init(placeUnder, pseudoEvent);
    tapFeedback.placeAt(placeUnder);
    window.setTimeout(ss.Delegate.create(tapFeedback, tapFeedback.startup), 0);
    return tapFeedback;
}
tab.FeedbackMobile.createPressFeedback = function tab_FeedbackMobile$createPressFeedback(placeUnder, pseudoEvent) {
    if (!!!tab.FeedbackMobile._pressFeedback) {
        tab.FeedbackMobile._pressFeedback = new tableau.mobile.widget.feedback.PressFeedback(tab.$create_PressFeedbackArgs(placeUnder, pseudoEvent));
    }
    else {
        tab.FeedbackMobile._pressFeedback.updateParent(placeUnder, pseudoEvent);
    }
    tab.FeedbackMobile._pressFeedback.placeAt(placeUnder);
    window.setTimeout(function() {
        tab.FeedbackMobile._pressFeedback.onPressStart(pseudoEvent);
    }, 0);
    return tab.FeedbackMobile._pressFeedback;
}


////////////////////////////////////////////////////////////////////////////////
// tab.TapFeedback

tab.TapFeedback = function tab_TapFeedback(args) {
    this.templateString = "<div class='TapFeedback'>" + "<div class='TapSplash' dojoAttachPoint='domSplash'>" + "<canvas class='TapSplashCanvas' dojoAttachPoint='domSplashCanvas' width='150' height='150'></canvas>" + '</div>' + "<div class='TapReticle' dojoAttachPoint='domReticle'>" + "<div style='position: relative;'>" + "<div class='TapReticleBarV'></div>" + "<div class='TapReticleBarH'></div>" + '</div>' + '</div>' + '</div>';
    tab.TapFeedback.initializeBase(this);
    this._parent$1 = args.parent;
    this._currentEvent$1 = args.event;
    this.finishedCallback = args.finishedCallback;
}
tab.TapFeedback.prototype = {
    domSplash: null,
    domSplashCanvas: null,
    domReticle: null,
    _parent$1: null,
    _currentEvent$1: null,
    tapID: null,
    _disposables$1: null,
    _parentCoords: null,
    _splashInProgress$1: false,
    _splashFadeoutInProgress$1: false,
    finishedCallback: null,
    
    postCreate: function tab_TapFeedback$postCreate() {
        var ctxSplash = this.domSplashCanvas.getContext('2d');
        ctxSplash.globalAlpha = 0.2;
        ctxSplash.fillStyle = this._makeSplashGradient$1(ctxSplash, 75);
        ctxSplash.fillRect(0, 0, 75 * 2, 75 * 2);
        this._disposables$1 = new tab.DisposableHolder();
        this._disposables$1.add(spiff.EventUtil.bindWithDispose($(this.domSplash), 'webkitTransitionEnd', ss.Delegate.create(this, this.onSplashTransitionEnd)));
        dojo.addClass(this.domSplash, 'PreStart');
    },
    
    init: function tab_TapFeedback$init(newParent, newEvent) {
        this._parent$1 = newParent;
        this._currentEvent$1 = newEvent;
        this._parentCoords = dojo.coords(this._parent$1, true);
    },
    
    _makeSplashGradient$1: function tab_TapFeedback$_makeSplashGradient$1(canvasContext, radius) {
        var gradient = canvasContext.createRadialGradient(radius, radius, 0, radius, radius, radius);
        gradient.addColorStop(0, 'rgba(0, 176, 240, 0.6)');
        gradient.addColorStop(0.85, 'rgba(0, 176, 240, 0.8)');
        gradient.addColorStop(0.9, 'rgba(0, 176, 240, 1.0)');
        gradient.addColorStop(1, 'rgba(0, 176, 240, 0.0)');
        gradient.addColorStop(1, '#FFFFFF');
        return gradient;
    },
    
    startup: function tab_TapFeedback$startup() {
        if (!!this._currentEvent$1) {
            this.onTouchStart(this._currentEvent$1);
        }
    },
    
    onTouchStart: function tab_TapFeedback$onTouchStart(e) {
        var localX = e.pageX - this._parentCoords.x;
        var localY = e.pageY - this._parentCoords.y;
        dojo.style(this.domNode, 'pointer-events', 'none');
        dojo.style(this.domNode, 'left', localX - 75 + 'px');
        dojo.style(this.domNode, 'top', localY - 75 + 'px');
        dojo.addClass(this.domReticle, 'InstantTransition');
        dojo.style(this.domReticle, 'opacity', 1);
        dojo.style(this.domReticle, 'display', 'block');
        this._splashInProgress$1 = true;
        dojo.style(this.domSplash, 'opacity', 1);
        dojo.style(this.domSplash, 'webkitTransform', 'scale(1.0)');
        window.setTimeout(ss.Delegate.create(this, function() {
            this.onSplashTransitionEnd(null);
        }), 600);
    },
    
    onSplashTransitionEnd: function tab_TapFeedback$onSplashTransitionEnd(newEvent) {
        if (this._splashInProgress$1) {
            dojo.style(this.domSplash, 'opacity', '0');
            this._splashInProgress$1 = false;
            this._splashFadeoutInProgress$1 = true;
            dojo.removeClass(this.domReticle, 'InstantTransition');
            dojo.addClass(this.domReticle, 'SlowTransition');
            dojo.style(this.domReticle, 'opacity', '0');
        }
        else if (this._splashFadeoutInProgress$1) {
            this.resetToInitialState();
            this._splashFadeoutInProgress$1 = false;
            this.finishedCallback(this);
        }
    },
    
    resetToInitialState: function tab_TapFeedback$resetToInitialState() {
        if (!!this.domNode) {
            this.domNode = this.domNode.parentNode.removeChild(this.domNode);
            dojo.style(this.domNode, 'left', -3000 + 'px');
            dojo.style(this.domSplash, 'webkitTransform', 'scale(0.05)');
            dojo.removeClass(this.domReticle, 'SlowTransition');
            dojo.addClass(this.domReticle, 'InstantTransition');
            dojo.style(this.domReticle, 'opacity', 1);
            dojo.style(this.domSplash, 'opacity', 1);
        }
    },
    
    dispose: function tab_TapFeedback$dispose() {
        this._disposables$1.dispose();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PressFeedback

tab.PressFeedback = function tab_PressFeedback(args) {
    this.templateString = "<div class='PressFeedback' dojoAttachPoint='domPressFeedback'>" + "<canvas class='PressFeedbackCanvas' dojoAttachPoint='domCanvas' width='141' height='141'></canvas>" + '</div>';
    tab.PressFeedback.initializeBase(this);
    this._parent$1 = args.parent;
    this._currentEvent$1 = args.event;
}
tab.PressFeedback.prototype = {
    domPressFeedback: null,
    domCanvas: null,
    _parent$1: null,
    _currentEvent$1: null,
    _animationFrameTimer: null,
    _clockAtPressTimerStart: null,
    _canvasContext: null,
    _disposables$1: null,
    _parentCoords: null,
    
    postCreate: function tab_PressFeedback$postCreate() {
        dojo.style(this.domPressFeedback, { width: 141 + 'px', height: 141 + 'px' });
        this.domCanvas.width = this.domCanvas.height = 141;
        this._canvasContext = this.domCanvas.getContext('2d');
        this._disposables$1 = new tab.DisposableHolder();
        this._disposables$1.add(spiff.EventUtil.bindWithDispose($(this.domPressFeedback), 'webkitTransitionEnd', ss.Delegate.create(this, this._onPressFeedbackTransitionEnd$1)));
        this.updateParent(this._parent$1, this._currentEvent$1);
    },
    
    updateParent: function tab_PressFeedback$updateParent(newParent, newEvent) {
        this._parent$1 = newParent;
        this._currentEvent$1 = newEvent;
        this._parentCoords = dojo.coords(newParent, true);
    },
    
    onPressStart: function tab_PressFeedback$onPressStart(e) {
        var localX = e.pageX - this._parentCoords.x;
        var localY = e.pageY - this._parentCoords.y;
        this._startPressComingAnimationAt$1(localX, localY);
    },
    
    onPressEnd: function tab_PressFeedback$onPressEnd() {
        this._onPressFeedbackTransitionEnd$1(null);
    },
    
    dispose: function tab_PressFeedback$dispose() {
        this._disposables$1.dispose();
    },
    
    _onPressFeedbackTransitionEnd$1: function tab_PressFeedback$_onPressFeedbackTransitionEnd$1(e) {
        this._resetPressFeedbackUI$1();
        if (!!this.domNode && !!this.domNode.parentNode) {
            this.domNode.parentNode.removeChild(this.domNode);
        }
    },
    
    _resetPressFeedbackUI$1: function tab_PressFeedback$_resetPressFeedbackUI$1() {
        if (!!this._animationFrameTimer) {
            window.clearInterval(this._animationFrameTimer);
            this._animationFrameTimer = null;
        }
        this._canvasContext.clearRect(0, 0, 141, 141);
        dojo.style(this.domPressFeedback, { display: 'none', webkitTransitionDuration: '0ms', webkitTransform: 'scale(1.0)' });
    },
    
    _startPressComingAnimationAt$1: function tab_PressFeedback$_startPressComingAnimationAt$1(x, y) {
        this._resetPressFeedbackUI$1();
        dojo.style(this.domPressFeedback, { left: (x - (120 / 2) - 10.5) + 'px', top: (y - (120 / 2) - 10.5) + 'px', display: 'block' });
        this._clockAtPressTimerStart = new Date();
        this._animationFrameTimer = window.setInterval(ss.Delegate.create(this, this._playNextPressComingFrame$1), 40);
    },
    
    _playNextPressComingFrame$1: function tab_PressFeedback$_playNextPressComingFrame$1() {
        var durationSoFar = new Date() - this._clockAtPressTimerStart;
        var percentComplete = Math.max(0, Math.min(1, durationSoFar / 500));
        this._drawPressComingFrameFor$1(percentComplete);
        if (percentComplete >= 1) {
            dojo.style(this.domPressFeedback, { webkitTransitionProperty: '-webkit-transform', webkitTransitionDuration: 250 + 'ms', webkitTransform: 'scale(0.05)' });
        }
    },
    
    _drawPressComingFrameFor$1: function tab_PressFeedback$_drawPressComingFrameFor$1(percentComplete) {
        var context = this._canvasContext;
        var hotspotX;
        var hotspotY;
        var hotspotSize = Math.floor(10.5) - 1;
        var halfHotspotSize = Math.floor(hotspotSize / 2);
        var bottomAndRightEdgeValue = 120 + 10.5;
        var drawHotspotAt = function(x, y) {
            context.fillStyle = 'rgba(0, 176, 240, 1.0)';
            context.fillRect(x - halfHotspotSize, y - halfHotspotSize, hotspotSize, hotspotSize);
        };
        percentComplete = Math.max(0, percentComplete);
        percentComplete = Math.min(1, percentComplete);
        context.clearRect(0, 0, 141, 141);
        context.beginPath();
        context.moveTo(10.5, 10.5);
        if (percentComplete <= 0.25) {
            hotspotX = (percentComplete * 4 * 120) + 10.5;
            context.lineTo(hotspotX, 10.5);
            drawHotspotAt(hotspotX, 10.5);
        }
        else if (percentComplete <= 0.5) {
            hotspotY = ((percentComplete - 0.25) * 4 * 120) + 10.5;
            context.lineTo(bottomAndRightEdgeValue, 10.5);
            context.lineTo(bottomAndRightEdgeValue, hotspotY);
            drawHotspotAt(bottomAndRightEdgeValue, hotspotY);
        }
        else if (percentComplete < 0.75) {
            hotspotX = bottomAndRightEdgeValue - ((percentComplete - 0.5) * 4 * 120);
            context.lineTo(bottomAndRightEdgeValue, 11);
            context.lineTo(bottomAndRightEdgeValue, bottomAndRightEdgeValue);
            context.lineTo(hotspotX, bottomAndRightEdgeValue);
            drawHotspotAt(hotspotX, bottomAndRightEdgeValue);
        }
        else if (percentComplete < 1) {
            hotspotY = bottomAndRightEdgeValue - ((percentComplete - 0.75) * 4 * 120);
            context.lineTo(bottomAndRightEdgeValue, 10.5);
            context.lineTo(bottomAndRightEdgeValue, bottomAndRightEdgeValue);
            context.lineTo(10.5, bottomAndRightEdgeValue);
            context.lineTo(10.5, hotspotY);
            drawHotspotAt(10.5, hotspotY);
        }
        else {
            context.rect(10.5, 10.5, 120, 120);
        }
        context.strokeStyle = 'rgba(0, 176, 240, 1.0)';
        context.stroke();
        context.fillStyle = 'rgba(0, 176, 240, ' + (percentComplete * 0.15) + ')';
        context.fillRect(10.5, 10.5, 120, 120);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.HierarchicalControlPopup

tab.HierarchicalControlPopup = function tab_HierarchicalControlPopup() {
    this._contentDisposables$2 = new tab.DisposableHolder();
    tab.HierarchicalControlPopup.initializeBase(this);
}
tab.HierarchicalControlPopup.prototype = {
    intervalCount: 0,
    intervalId: 0,
    suppressRefresh: false,
    params: null,
    
    add_onLevelClickInPopupCalled: function tab_HierarchicalControlPopup$add_onLevelClickInPopupCalled(value) {
        this.__onLevelClickInPopupCalled$2 = ss.Delegate.combine(this.__onLevelClickInPopupCalled$2, value);
    },
    remove_onLevelClickInPopupCalled: function tab_HierarchicalControlPopup$remove_onLevelClickInPopupCalled(value) {
        this.__onLevelClickInPopupCalled$2 = ss.Delegate.remove(this.__onLevelClickInPopupCalled$2, value);
    },
    
    __onLevelClickInPopupCalled$2: null,
    
    add_onExpandNodeCalled: function tab_HierarchicalControlPopup$add_onExpandNodeCalled(value) {
        this.__onExpandNodeCalled$2 = ss.Delegate.combine(this.__onExpandNodeCalled$2, value);
    },
    remove_onExpandNodeCalled: function tab_HierarchicalControlPopup$remove_onExpandNodeCalled(value) {
        this.__onExpandNodeCalled$2 = ss.Delegate.remove(this.__onExpandNodeCalled$2, value);
    },
    
    __onExpandNodeCalled$2: null,
    
    add_onCollapseNodeCalled: function tab_HierarchicalControlPopup$add_onCollapseNodeCalled(value) {
        this.__onCollapseNodeCalled$2 = ss.Delegate.combine(this.__onCollapseNodeCalled$2, value);
    },
    remove_onCollapseNodeCalled: function tab_HierarchicalControlPopup$remove_onCollapseNodeCalled(value) {
        this.__onCollapseNodeCalled$2 = ss.Delegate.remove(this.__onCollapseNodeCalled$2, value);
    },
    
    __onCollapseNodeCalled$2: null,
    
    add_notifyMemberChangeCalled: function tab_HierarchicalControlPopup$add_notifyMemberChangeCalled(value) {
        this.__notifyMemberChangeCalled$2 = ss.Delegate.combine(this.__notifyMemberChangeCalled$2, value);
    },
    remove_notifyMemberChangeCalled: function tab_HierarchicalControlPopup$remove_notifyMemberChangeCalled(value) {
        this.__notifyMemberChangeCalled$2 = ss.Delegate.remove(this.__notifyMemberChangeCalled$2, value);
    },
    
    __notifyMemberChangeCalled$2: null,
    
    get__hierarchicalContent$2: function tab_HierarchicalControlPopup$get__hierarchicalContent$2() {
        return this.get_content();
    },
    
    get_asScrollListener: function tab_HierarchicalControlPopup$get_asScrollListener() {
        return this;
    },
    
    getContentDimensions: function tab_HierarchicalControlPopup$getContentDimensions(availableHeight) {
        return this.get__hierarchicalContent$2().getContentDimensions(availableHeight);
    },
    
    postCreate: function tab_HierarchicalControlPopup$postCreate() {
        this.params.parentPopup = this;
        this.set_content(new tableau.mobile.widget.catmode.popup.HierarchicalControlContentMobile(this.params, null));
        this.get__hierarchicalContent$2().placeAt(this.domContent, 'after');
        this.inherited(arguments);
        this.get__hierarchicalContent$2().add_onTreeSizeChanged(ss.Delegate.create(this, this._onTreeSizeChanged));
        this._contentDisposables$2.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get__hierarchicalContent$2().remove_onTreeSizeChanged(ss.Delegate.create(this, this._onTreeSizeChanged));
        })));
        this.get_asScrollListener().setupScrollListener(this.get__hierarchicalContent$2()._iscrollObj);
    },
    
    update: function tab_HierarchicalControlPopup$update(popupParams) {
        this.inherited(arguments);
        this.get_asScrollListener().doScrollToLastPos();
    },
    
    show: function tab_HierarchicalControlPopup$show(newPageX, newPageY) {
        this.inherited(arguments);
        this.get__hierarchicalContent$2().treeSizeChanged();
        this.get__hierarchicalContent$2().tree.visible = true;
    },
    
    hide: function tab_HierarchicalControlPopup$hide() {
        this.get__hierarchicalContent$2().tree.visible = false;
        this.inherited(arguments);
    },
    
    _refreshContent: function tab_HierarchicalControlPopup$_refreshContent(popupParams) {
        if (!!this.get_content() && !this.suppressRefresh) {
            this.get__hierarchicalContent$2().destroy();
            this._contentDisposables$2.dispose();
            this._contentDisposables$2 = new tab.DisposableHolder();
            popupParams.parentPopup = this;
            this.set_content(new tableau.mobile.widget.catmode.popup.HierarchicalControlContentMobile(popupParams, null));
            this.get__hierarchicalContent$2().placeAt(this.domContent, 'after');
            this.get__hierarchicalContent$2().add_onTreeSizeChanged(ss.Delegate.create(this, this._onTreeSizeChanged));
            this._contentDisposables$2.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this.get__hierarchicalContent$2().remove_onTreeSizeChanged(ss.Delegate.create(this, this._onTreeSizeChanged));
            })));
            this.intervalCount = 0;
            window.clearInterval(this.intervalId);
            this.intervalId = window.setInterval(ss.Delegate.create(this, this.refreshTreeHeight), 100);
        }
        this.suppressRefresh = false;
        this.get_asScrollListener().setupScrollListener(this.get__hierarchicalContent$2()._iscrollObj);
    },
    
    refreshTreeHeight: function tab_HierarchicalControlPopup$refreshTreeHeight() {
        var treeDims = dojo.marginBox(this.get__hierarchicalContent$2()._scrollingTreeArea);
        if (treeDims.h > 5 || this.intervalCount > 20) {
            this.get__hierarchicalContent$2().treeSizeChanged();
            window.clearInterval(this.intervalId);
            this.get_asScrollListener().doScrollToLastPos();
        }
    },
    
    onExpandNode: function tab_HierarchicalControlPopup$onExpandNode(item, node) {
        if (ss.isValue(this.__onExpandNodeCalled$2)) {
            this.__onExpandNodeCalled$2(item, node);
        }
    },
    
    onCollapseNode: function tab_HierarchicalControlPopup$onCollapseNode(item, node) {
        if (ss.isValue(this.__onCollapseNodeCalled$2)) {
            this.__onCollapseNodeCalled$2(item, node);
        }
    },
    
    _onLevelClickInPopup: function tab_HierarchicalControlPopup$_onLevelClickInPopup(lvl, newState) {
        this.suppressRefresh = true;
        if (ss.isValue(this.__onLevelClickInPopupCalled$2)) {
            this.__onLevelClickInPopupCalled$2(lvl, newState);
        }
    },
    
    notifyMemberChange: function tab_HierarchicalControlPopup$notifyMemberChange(e) {
        this.suppressRefresh = true;
        if (ss.isValue(this.__notifyMemberChangeCalled$2)) {
            this.__notifyMemberChangeCalled$2(e);
        }
    },
    
    _onTreeSizeChanged: function tab_HierarchicalControlPopup$_onTreeSizeChanged() {
        this.doResize(null, null);
    },
    
    destroy: function tab_HierarchicalControlPopup$destroy() {
        this.get__hierarchicalContent$2().destroy();
        this._contentDisposables$2.dispose();
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.HierarchicalControlContentMobile

tab.HierarchicalControlContentMobile = function tab_HierarchicalControlContentMobile(options, srcRefNode) {
    this.templateString = '<div>' + "<div style='margin-left:30px;' dojoAttachPoint='_levelsWrapper'>" + "<table class='HFLevels'>" + "<tr dojoAttachPoint='_levelButtonsContainer'>" + '</tr>' + '</table>' + '</div>' + "<div dojoAttachPoint='_scrollWrapper' style='position:relative;'>" + "<div dojoAttachPoint='_scrollingTreeArea'></div>" + '</div>' + '</div>';
    this._disposables$1 = new tab.DisposableHolder();
    tab.HierarchicalControlContentMobile.initializeBase(this);
    this.params = options;
    this.title = options.title;
    this.mode = options.mode;
    this.levelButtonHanders = [];
}
tab.HierarchicalControlContentMobile.prototype = {
    _levelButtonsContainer: null,
    _scrollingTreeArea: null,
    parentPopup: null,
    _availableHeight: 0,
    _levelsWrapper: null,
    _scrollWrapper: null,
    params: null,
    title: null,
    mode: null,
    scrollHandler: null,
    _iscrollObj: null,
    levelButtonHanders: null,
    tree: null,
    
    add_onTreeSizeChanged: function tab_HierarchicalControlContentMobile$add_onTreeSizeChanged(value) {
        this.__onTreeSizeChanged$1 = ss.Delegate.combine(this.__onTreeSizeChanged$1, value);
    },
    remove_onTreeSizeChanged: function tab_HierarchicalControlContentMobile$remove_onTreeSizeChanged(value) {
        this.__onTreeSizeChanged$1 = ss.Delegate.remove(this.__onTreeSizeChanged$1, value);
    },
    
    __onTreeSizeChanged$1: null,
    
    postCreate: function tab_HierarchicalControlContentMobile$postCreate() {
        var options = {};
        options.model = this.params.model;
        options.showRoot = false;
        this.tree = new tableau.mobile.Tree(options);
        var tree = this.tree;
        dojo.forEach(this.tree.rootNode.getChildren(), function(treeNode) {
            var node = treeNode;
            if (node.isExpandable) {
                tree._expandNode(node);
            }
        });
        this.tree.add_notifyChangeCalled(ss.Delegate.create(this.parentPopup, this.parentPopup.notifyMemberChange));
        this.tree.add_treeSizeChangedCalled(ss.Delegate.create(this, this.treeSizeChanged));
        this.tree.add_onOpenCalled(ss.Delegate.create(this.parentPopup, this.parentPopup.onExpandNode));
        this.tree.add_onCloseCalled(ss.Delegate.create(this.parentPopup, this.parentPopup.onCollapseNode));
        this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.tree.remove_notifyChangeCalled(ss.Delegate.create(this.parentPopup, this.parentPopup.notifyMemberChange));
            this.tree.remove_treeSizeChangedCalled(ss.Delegate.create(this, this.treeSizeChanged));
            this.tree.remove_onOpenCalled(ss.Delegate.create(this.parentPopup, this.parentPopup.onExpandNode));
            this.tree.remove_onCloseCalled(ss.Delegate.create(this.parentPopup, this.parentPopup.onCollapseNode));
        })));
        if (this.params.isSingleSelect || !this.params.showLevels) {
            dojo.style(this._levelButtonsContainer, 'display', 'none');
        }
        else {
            this.formatLevelButtons();
        }
        this._enableTouchEvents();
        this.inherited(arguments);
    },
    
    getContentDimensions: function tab_HierarchicalControlContentMobile$getContentDimensions(currentAvailableHeight) {
        this._availableHeight = currentAvailableHeight;
        this._setTreeScrollerHeight();
        var levelButtonDims = dojo.marginBox(this._levelsWrapper);
        var scrollDims = dojo.marginBox(this._scrollWrapper);
        var height = tab.$create_DojoCoords();
        height.h = scrollDims.h + levelButtonDims.h;
        return height;
    },
    
    _setTreeScrollerHeight: function tab_HierarchicalControlContentMobile$_setTreeScrollerHeight() {
        var scrollHeight;
        var treeHeight;
        var levelButtonDims = dojo.marginBox(this._levelsWrapper);
        var treeDims = dojo.marginBox(this._scrollingTreeArea);
        treeHeight = Math.min(treeDims.h, this._availableHeight - levelButtonDims.h);
        scrollHeight = Math.min(treeHeight, this._availableHeight - levelButtonDims.h);
        dojo.style(this._scrollWrapper, 'height', scrollHeight + 'px');
        this._iscrollObj.refresh();
    },
    
    startup: function tab_HierarchicalControlContentMobile$startup() {
    },
    
    update: function tab_HierarchicalControlContentMobile$update(options) {
        this.params = options;
        this.title = options.title;
        this.mode = options.mode;
        dojox.data.dom.removeChildren(this._levelButtonsContainer);
        if (!this.params.isSingleSelect) {
            this.formatLevelButtons();
        }
        this.inherited(arguments);
    },
    
    _enableTouchEvents: function tab_HierarchicalControlContentMobile$_enableTouchEvents() {
        var config = spiff.$create_EventHandleSpec();
        config.tap = ss.Delegate.create(this, this.onSelect);
        this.scrollHandler = new spiff.TableauEventHandler(this._scrollingTreeArea, config);
        var scrollerOptions = spiff.$create_MobileScrollerOptions();
        scrollerOptions.displayPolicy = 'always';
        this._iscrollObj = new spiff.MobileScroller(this._scrollingTreeArea, this.scrollHandler, scrollerOptions);
        this._scrollingTreeArea.appendChild(this.tree.domNode);
    },
    
    onSelect: function tab_HierarchicalControlContentMobile$onSelect(e) {
    },
    
    treeSizeChanged: function tab_HierarchicalControlContentMobile$treeSizeChanged() {
        this._setTreeScrollerHeight();
        this.__onTreeSizeChanged$1();
    },
    
    formatLevelButtons: function tab_HierarchicalControlContentMobile$formatLevelButtons() {
        for (var i = 0; i < this.params.oFilter.levels.length; i++) {
            var domNode = dojo.doc.createElement('td');
            domNode.appendChild(dojo.doc.createTextNode(i.toString()));
            this._levelButtonsContainer.appendChild(domNode);
            if (this.mode !== 'radiolist') {
                if (!this.params.oFilter.levels[i]) {
                    dojo.addClass(domNode, 'HFLevelAllSelected');
                }
                else if (this.params.oFilter.levels[i] === 1) {
                    dojo.addClass(domNode, 'HFLevelNoneSelected');
                }
                else {
                    dojo.addClass(domNode, 'HFLevelSomeSelected');
                }
            }
            if (!i) {
                dojo.addClass(domNode, 'HFLevelFirst');
            }
            else {
                if (i < this.params.oFilter.levels.length - 1) {
                    dojo.addClass(domNode, 'HFLevelNonLeaf');
                }
                else {
                    dojo.addClass(domNode, 'HFLevelLast');
                }
            }
            var config = spiff.$create_EventHandleSpec();
            config.potentialTap = ss.Delegate.create(this, this.onLevelClick);
            this.levelButtonHanders.add(new spiff.TableauEventHandler(domNode, config));
        }
    },
    
    onLevelClick: function tab_HierarchicalControlContentMobile$onLevelClick(e) {
        var domNode = e.target;
        var newState;
        if (domNode.tagName.toLowerCase() !== 'td') {
            return;
        }
        e.preventDefault();
        if (this.params.isSingleSelect) {
            return;
        }
        var lvl = parseInt(dojox.data.dom.textContent(domNode), 10);
        if (!this.params.oFilter.levels[lvl]) {
            newState = false;
            dojo.removeClass(domNode, 'HFLevelAllSelected');
            dojo.removeClass(domNode, 'HFLevelSomeSelected');
            dojo.addClass(domNode, 'HFLevelNoneSelected');
            this.params.oFilter.levels[lvl] = 1;
        }
        else {
            newState = true;
            dojo.removeClass(domNode, 'HFLevelNoneSelected');
            dojo.removeClass(domNode, 'HFLevelSomeSelected');
            dojo.addClass(domNode, 'HFLevelAllSelected');
            this.params.oFilter.levels[lvl] = 0;
        }
        this.parentPopup._onLevelClickInPopup(lvl, newState);
    },
    
    dispose: function tab_HierarchicalControlContentMobile$dispose() {
        this._disposables$1.dispose();
        this.scrollHandler.dispose();
        this._iscrollObj.dispose();
    },
    
    destroy: function tab_HierarchicalControlContentMobile$destroy() {
        dojo.forEach(this.levelButtonHanders, function(th) {
            (th).destroy();
        });
        this.dispose();
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.InplaceMobilePopup

tab.InplaceMobilePopup = function tab_InplaceMobilePopup(widget) {
    this._inplaceMobilePopupWidget = widget;
}
tab.InplaceMobilePopup.prototype = {
    _inplaceMobilePopupWidget: null,
    popup: null,
    _touchHandler: null,
    _inplaceDiv: null,
    _dispatchItemsHandler: null,
    
    get_popup: function tab_InplaceMobilePopup$get_popup() {
        return this.popup;
    },
    
    get_touchHandler: function tab_InplaceMobilePopup$get_touchHandler() {
        return this._touchHandler;
    },
    
    createPopup: function tab_InplaceMobilePopup$createPopup(popupClass, popupParams) {
        var parentID = this._inplaceMobilePopupWidget.get_uniqueNodeId() + '_popup';
        var refNode = dojo.byId(parentID);
        if (!!!refNode) {
            refNode = dojo.doc.createElement('span');
            dojo.attr(refNode, 'id', parentID);
            dojo.body().appendChild(refNode);
        }
        var popupFactory = new tableau.mobile.widget.catmode.popup.PopupFactory();
        this.popup = popupFactory.getPopupObject(popupClass, popupParams, parentID);
    },
    
    destroyPopup: function tab_InplaceMobilePopup$destroyPopup() {
        if (!!this.popup) {
            if (!this.popup.isVisible()) {
                var popupFactory = new tableau.mobile.widget.catmode.popup.PopupFactory();
                popupFactory.removePopup(this.popup);
            }
        }
    },
    
    setupTouchHandler: function tab_InplaceMobilePopup$setupTouchHandler(itemElement) {
        if (!!this._touchHandler) {
            return;
        }
        var node = this._inplaceMobilePopupWidget.get_domBoxElement();
        if (!ss.isUndefined(node)) {
            this._inplaceDiv = node;
        }
        else {
            this._inplaceDiv = itemElement;
        }
        this._touchHandler = new spiff.TableauEventHandler(this._inplaceDiv, spiff.$create_EventHandleSpec());
    },
    
    connectPopup: function tab_InplaceMobilePopup$connectPopup() {
        this.connectPopupAndAttachHandler(null);
    },
    
    connectPopupAndAttachHandler: function tab_InplaceMobilePopup$connectPopupAndAttachHandler(dispatchItemsHandlerAction) {
        if (ss.isValue(this.popup) && ss.isValue(dispatchItemsHandlerAction)) {
            this._dispatchItemsHandler = dispatchItemsHandlerAction;
            this.popup.add_dispatchItemsChanged(dispatchItemsHandlerAction);
            this.popup.get_list().add_dispatchItemsChanged(dispatchItemsHandlerAction);
        }
        this.setupTouchHandler(this._inplaceMobilePopupWidget.get_domNodeElement());
        var spec = spiff.$create_EventHandleSpec();
        spec.firstTouch = ss.Delegate.create(this, this._onTouchStart);
        spec.lastTouch = ss.Delegate.create(this, this._onTouchEnd);
        spec.cancelPotentialTap = ss.Delegate.create(this, this._onTouchEnd);
        spec.cancelPotentialPress = ss.Delegate.create(this, this._onTouchEnd);
        spec.potentialTap = ss.Delegate.create(this, this.onFingerUp);
        this._touchHandler.update(spec);
    },
    
    _onTouchStart: function tab_InplaceMobilePopup$_onTouchStart(pseudoEvent) {
        $(this._inplaceDiv).siblings('.MobilePanelBorderOuter').addClass('tab-inplace-touched');
    },
    
    _onTouchEnd: function tab_InplaceMobilePopup$_onTouchEnd(pseudoEvent) {
        $(this._inplaceDiv).siblings('.MobilePanelBorderOuter').removeClass('tab-inplace-touched');
    },
    
    onFingerUp: function tab_InplaceMobilePopup$onFingerUp(pseudoEvent) {
        this._onTouchEnd(pseudoEvent);
        if (ss.isValue(this.popup)) {
            if (!this.popup.isVisible()) {
                var coords = dojo.coords(pseudoEvent.currentTarget);
                var x = coords.x;
                var y = coords.y;
                this.popup.show(x, y);
            }
            else {
                this.popup.hide();
            }
        }
    },
    
    disconnectPopup: function tab_InplaceMobilePopup$disconnectPopup() {
        if (ss.isValue(this._touchHandler)) {
            this._touchHandler.destroy();
            this._touchHandler = null;
        }
        if (ss.isValue(this._dispatchItemsHandler)) {
            this.popup.remove_dispatchItemsChanged(this._dispatchItemsHandler);
            this.popup.get_list().remove_dispatchItemsChanged(this._dispatchItemsHandler);
        }
    },
    
    isPopupVisible: function tab_InplaceMobilePopup$isPopupVisible() {
        return this.popup.isVisible();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.OptionsWidgetMobile

tab.OptionsWidgetMobile = function tab_OptionsWidgetMobile(parameters, srcRefNode) {
    tab.OptionsWidgetMobile.initializeBase(this, [ parameters, srcRefNode ]);
    this._touchHandlers$2 = [];
}
tab.OptionsWidgetMobile.prototype = {
    isMultiValue: false,
    bHasAll: false,
    isSearchWidget: false,
    iscrollObj: false,
    scrollHandler: null,
    single: false,
    baseClass: 'Options',
    qf: null,
    popup: null,
    _touchHandlers$2: null,
    _visible$2: false,
    
    add_hideUICalled: function tab_OptionsWidgetMobile$add_hideUICalled(value) {
        this.__hideUICalled$2 = ss.Delegate.combine(this.__hideUICalled$2, value);
    },
    remove_hideUICalled: function tab_OptionsWidgetMobile$remove_hideUICalled(value) {
        this.__hideUICalled$2 = ss.Delegate.remove(this.__hideUICalled$2, value);
    },
    
    __hideUICalled$2: null,
    
    add_handleOptionsSelection: function tab_OptionsWidgetMobile$add_handleOptionsSelection(value) {
        this.__handleOptionsSelection$2 = ss.Delegate.combine(this.__handleOptionsSelection$2, value);
    },
    remove_handleOptionsSelection: function tab_OptionsWidgetMobile$remove_handleOptionsSelection(value) {
        this.__handleOptionsSelection$2 = ss.Delegate.remove(this.__handleOptionsSelection$2, value);
    },
    
    __handleOptionsSelection$2: null,
    
    createMenuItemClickHander: function tab_OptionsWidgetMobile$createMenuItemClickHander(menuItem) {
        return menuItem.get_data();
    },
    
    postCreate: function tab_OptionsWidgetMobile$postCreate() {
        this.update(null);
        dojo.addClass(this.domNode, 'Options');
        this.hideUI();
    },
    
    destroy: function tab_OptionsWidgetMobile$destroy() {
        var $enum1 = ss.IEnumerator.getEnumerator(this._touchHandlers$2);
        while ($enum1.moveNext()) {
            var th = $enum1.current;
            th.dispose();
        }
    },
    
    toggleUI: function tab_OptionsWidgetMobile$toggleUI() {
        dojo.style(this.domNode, 'display', (this._visible$2) ? 'none' : '');
        this._visible$2 = !this._visible$2;
    },
    
    showUI: function tab_OptionsWidgetMobile$showUI() {
        this._visible$2 = true;
        dojo.style(this.domNode, 'display', '');
    },
    
    hideUI: function tab_OptionsWidgetMobile$hideUI() {
        this._visible$2 = false;
        dojo.style(this.domNode, 'display', 'none');
        if (ss.isValue(this.__hideUICalled$2)) {
            this.__hideUICalled$2();
        }
    },
    
    update: function tab_OptionsWidgetMobile$update(qfThatAppearsToNotGetUsed) {
        var commands = this.qf.getContextMenuCommands();
        var menuItems = [];
        var node = null;
        var that = this;
        var $enum1 = ss.IEnumerator.getEnumerator(this._touchHandlers$2);
        while ($enum1.moveNext()) {
            var th = $enum1.current;
            th.dispose();
        }
        this._touchHandlers$2 = [];
        if (this._scrollingListArea != null) {
            $(this._scrollingListArea).find('.ListRow').remove();
            tab.WidgetUtil.newMenuItemsFromCommands(menuItems, commands, function(c) {
                var cmdAction = function() {
                    var bExecuteServerCmd = false;
                    var cmd = tab.CommandSerializer.deserialize(tab.CommandItemWrapper.create(c).get_command());
                    if (cmd.commandName === 'set-quick-filter-mode') {
                        if ((!ss.isNullOrUndefined(cmd.commandParams['categoricalMode']) && that.qf.mode !== cmd.commandParams['categoricalMode']) || (!ss.isNullOrUndefined(cmd.commandParams['quantitativeMode']) && that.qf.mode !== cmd.commandParams['quantitativeMode'])) {
                            if (ss.isValue(that.__handleOptionsSelection$2)) {
                                that.__handleOptionsSelection$2();
                            }
                            bExecuteServerCmd = true;
                        }
                    }
                    else if (cmd.commandName === 'set-quick-filter-include-exclude') {
                        var exclude = cmd.commandParams['exclude'] === 'true';
                        if (that.qf.oFilter.exclude !== exclude) {
                            bExecuteServerCmd = true;
                        }
                    }
                    else {
                        bExecuteServerCmd = true;
                    }
                    if (bExecuteServerCmd) {
                        tab.ServerCommands.executeServerCommand(cmd, 'immediately');
                    }
                };
                return cmdAction;
            });
            var $enum2 = ss.IEnumerator.getEnumerator(menuItems);
            while ($enum2.moveNext()) {
                var mi = $enum2.current;
                if (mi.get_isDivider()) {
                    if (node == null) {
                        node = new tableau.mobile.widget.catmode.popup.ScrollingListRow(null, null);
                    }
                    dojo.style(node.domNode, 'borderBottom', '');
                }
                else {
                    var rowParams = {};
                    rowParams.formattedLabel = mi.get_name();
                    rowParams.checked = mi.get_checkState() > 0;
                    rowParams.uniqueId = '';
                    (node = new tableau.mobile.widget.catmode.popup.ScrollingListRow(rowParams, null)).placeAt(this._scrollingListArea, null);
                    var config = spiff.$create_EventHandleSpec();
                    config.firstTouch = this.createMenuItemClickHander(mi);
                    this._touchHandlers$2.add(new spiff.TableauEventHandler(node.domNode, config));
                    dojo.style(node.domNode, 'borderBottom', 'none');
                }
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MobileWindowAppender

tab.MobileWindowAppender = function tab_MobileWindowAppender() {
    tab.MobileWindowAppender.initializeBase(this);
}
tab.MobileWindowAppender.enableLogging = function tab_MobileWindowAppender$enableLogging(filter) {
    if (ss.isNullOrUndefined(tab.MobileWindowAppender._globalAppender$1)) {
        tab.MobileWindowAppender._globalAppender$1 = new tab.MobileWindowAppender();
        tab.Logger.addAppender(tab.MobileWindowAppender._globalAppender$1);
    }
    tab.MobileWindowAppender._globalAppender$1.addFilter((filter || function() {
        return true;
    }));
}
tab.MobileWindowAppender.disableLogging = function tab_MobileWindowAppender$disableLogging() {
    if (ss.isNullOrUndefined(tab.MobileWindowAppender._globalAppender$1)) {
        return;
    }
    tab.Logger.removeAppender(tab.MobileWindowAppender._globalAppender$1);
    tab.MobileWindowAppender._globalAppender$1 = null;
}
tab.MobileWindowAppender.prototype = {
    _scroller$1: null,
    _logDiv$1: null,
    
    dispose: function tab_MobileWindowAppender$dispose() {
        this._scroller$1.dispose();
    },
    
    logInternal: function tab_MobileWindowAppender$logInternal(source, level, message, args) {
        if (ss.isNullOrUndefined(this._logDiv$1)) {
            this._buildLogDiv$1();
        }
        message = this.formatMessage(message.replaceAll('\\n', '<br />'), args);
        this._logDiv$1.append("<div class='entry'><span class='name'>" + source.get_name() + '</span>' + message + '</div>');
        this._scroller$1.refresh();
    },
    
    _buildLogDiv$1: function tab_MobileWindowAppender$_buildLogDiv$1() {
        var logDivWrapper = $("<div id='tableauggerWrapper'>\n                    <div id='tableaugger'>Double Tap to Clear</div>\n                </div>");
        logDivWrapper.css({ position: 'absolute', bottom: '0px', right: '0px', backgroundColor: 'white', opacity: '.8', border: '1px solid black', width: '250px', height: '300px', overflow: 'auto', zIndex: '333' });
        this._logDiv$1 = logDivWrapper.find('#tableaugger');
        this._logDiv$1.css({ width: '100%', paddingBottom: '300px' });
        $('body').append(logDivWrapper);
        var config = spiff.$create_EventHandleSpec();
        spiff.TableauEventHandler.setHandler(config, 'doubleTap', ss.Delegate.create(this, this._handleDoubleTap$1));
        var handler = new spiff.TableauEventHandler(this._logDiv$1[0], config);
        var options = spiff.$create_MobileScrollerOptions();
        options.displayPolicy = 'active';
        this._scroller$1 = new spiff.MobileScroller(this._logDiv$1[0], handler, options);
    },
    
    _handleDoubleTap$1: function tab_MobileWindowAppender$_handleDoubleTap$1(e) {
        this._clear$1();
    },
    
    _clear$1: function tab_MobileWindowAppender$_clear$1() {
        this._logDiv$1.html(tab.Strings.noLoc('Double tap to clear<br />'));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ApplicationViewModelMobile

tab.ApplicationViewModelMobile = function tab_ApplicationViewModelMobile(skipInit, layoutSession) {
    tab.ApplicationViewModelMobile.initializeBase(this, [ skipInit, layoutSession ]);
    spiff.OrientationHandler.add_orientationChanged(ss.Delegate.create(this, this.onOrientationChange));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        spiff.OrientationHandler.remove_orientationChanged(ss.Delegate.create(this, this.onOrientationChange));
    })));
    this._enableBodyTouchHandler$2();
}
tab.ApplicationViewModelMobile.prototype = {
    _bodyTouchHandler$2: null,
    _tapToInteractTouchHandler$2: null,
    
    get__isMobileApp$2: function tab_ApplicationViewModelMobile$get__isMobileApp$2() {
        var appCookie = tsConfig.mobile_app_cookie;
        return (ss.isValue(appCookie) && appCookie.indexOf('TableauApp') >= 0) || tsConfig.is_mobile_app;
    },
    
    showShareDialog: function tab_ApplicationViewModelMobile$showShareDialog() {
        tab.ShareDialogUtil.toggleMobileClientVizDisplay(false);
        tab.ApplicationViewModelMobile.callBaseMethod(this, 'showShareDialog');
    },
    
    destroy: function tab_ApplicationViewModelMobile$destroy() {
        this._disableBodyTouchHandler$2();
        if (ss.isValue(this._tapToInteractTouchHandler$2)) {
            this._tapToInteractTouchHandler$2.dispose();
        }
        tab.ApplicationViewModelMobile.callBaseMethod(this, 'destroy');
    },
    
    makeExportPdfDialog: function tab_ApplicationViewModelMobile$makeExportPdfDialog(session) {
        return new tab.ExportPdfDialogMobile(session, false);
    },
    
    makeViewingToolbar: function tab_ApplicationViewModelMobile$makeViewingToolbar(isTop) {
        return new tab.ViewingToolbarMobile(this, isTop);
    },
    
    createTapToInteractTransition: function tab_ApplicationViewModelMobile$createTapToInteractTransition(animateTransition, initialDelay) {
        if (tsConfig.bootstrapOnMouseover) {
            return;
        }
        var fadeDuration = 450;
        if (animateTransition) {
            this._showTapToInteract$2();
            var tapToInteract = $('#tapToInteract');
            tapToInteract.delay(initialDelay).fadeTo(fadeDuration, 1, function() {
                tableau.util.performDeferredCalls();
            });
            tapToInteract.delay(2000).fadeTo(fadeDuration, 0, ss.Delegate.create(this, this._hideTapToInteract$2));
        }
        else {
            this._showTapToInteract$2();
            tableau.util.performDeferredCalls();
            window.setTimeout(ss.Delegate.create(this, this._hideTapToInteract$2), 2000);
        }
    },
    
    createTapToInteractTouchHandler: function tab_ApplicationViewModelMobile$createTapToInteractTouchHandler(tapToInteractElem) {
        if (tsConfig.bootstrapOnMouseover) {
            return;
        }
        if (ss.isValue(tapToInteractElem) && tapToInteractElem.length > 0 && !this.get__isMobileApp$2()) {
            var config = spiff.$create_EventHandleSpec();
            config.firstTouch = ss.Delegate.create(this, function() {
                this._hideTapToInteract$2();
            });
            this._tapToInteractTouchHandler$2 = new spiff.TableauEventHandler(tapToInteractElem.get(0), config);
        }
    },
    
    doMeasureMetrics: function tab_ApplicationViewModelMobile$doMeasureMetrics() {
    },
    
    _showTapToInteract$2: function tab_ApplicationViewModelMobile$_showTapToInteract$2() {
        var tapToInteract = $('#tapToInteract');
        if (tapToInteract.size() > 0 && !this.get__isMobileApp$2()) {
            tapToInteract.find('.wcTapToInteractBody').text(tab.Strings.MobileClientTapToInteract).end().css({ display: 'none', visibility: '' });
        }
    },
    
    _hideTapToInteract$2: function tab_ApplicationViewModelMobile$_hideTapToInteract$2() {
        var tapToInteract = $('#tapToInteract');
        if (tapToInteract.size() > 0 && !this.get__isMobileApp$2()) {
            tapToInteract.hide();
        }
    },
    
    _enableBodyTouchHandler$2: function tab_ApplicationViewModelMobile$_enableBodyTouchHandler$2() {
        this._bodyTouchHandler$2 = new spiff.TableauEventHandler($('body').get(0), null);
    },
    
    _disableBodyTouchHandler$2: function tab_ApplicationViewModelMobile$_disableBodyTouchHandler$2() {
        if (ss.isValue(this._bodyTouchHandler$2)) {
            this._bodyTouchHandler$2.dispose();
        }
        this._bodyTouchHandler$2 = null;
    },
    
    onOrientationChange: function tab_ApplicationViewModelMobile$onOrientationChange() {
        tabBootstrap.Utility.applySafari7CSSHackFix();
        this.resize(true);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyLegendViewMobile

tab.LegacyLegendViewMobile = function tab_LegacyLegendViewMobile(viewModel) {
    tab.LegacyLegendViewMobile.initializeBase(this, [ viewModel, new tab.LegacyLegendTemplateMobile() ]);
}
tab.LegacyLegendViewMobile.prototype = {
    scroller: null,
    _splash: null,
    
    allowHover: function tab_LegacyLegendViewMobile$allowHover() {
    },
    
    disallowHover: function tab_LegacyLegendViewMobile$disallowHover() {
    },
    
    onLegendMouseDown: function tab_LegacyLegendViewMobile$onLegendMouseDown() {
    },
    
    onBoxClick: function tab_LegacyLegendViewMobile$onBoxClick() {
    },
    
    hideControls: function tab_LegacyLegendViewMobile$hideControls() {
    },
    
    showControls: function tab_LegacyLegendViewMobile$showControls() {
    },
    
    makeViewerInputHandler: function tab_LegacyLegendViewMobile$makeViewerInputHandler(viewSession, element) {
        var config = spiff.$create_EventHandleSpec();
        config.potentialTap = ss.Delegate.create(this, this.onFingerUp);
        config.tap = ss.Delegate.create(this, this.onTap);
        var handler = new spiff.TableauEventHandler(this.get_domNode(), config);
        this.scroller = new spiff.MobileScroller(this.get_legendTemplate().domContent.get(0), handler, null);
        return handler;
    },
    
    layoutButtons: function tab_LegacyLegendViewMobile$layoutButtons(contentSize) {
        if (contentSize.w > 0) {
            if (this.get_serverRenderedModel().isVisuallyCat) {
                this.get_baseLegendTemplate().get_contentArea().css('width', contentSize.w + 'px');
            }
            else {
                this.get_legendTemplate().domContent.css('width', contentSize.w + 'px');
            }
        }
        if (contentSize.h > 0) {
            if (this.get_serverRenderedModel().isVisuallyCat) {
                this.get_baseLegendTemplate().get_contentArea().css('height', contentSize.h + 'px');
            }
            else {
                this.get_legendTemplate().domContent.css('height', contentSize.h + 'px');
            }
        }
        if (contentSize.h > 1) {
            var bodyW = this.bodySize.w;
            if (bodyW > contentSize.w && this.get_serverRenderedModel().legendLayout !== 'vertical') {
                this.get_domRoot().addClass('LegendHorizontal');
                this.get_legendTemplate().domContent.css('float', 'left');
            }
        }
        this.scroller.refresh();
    },
    
    onFingerUp: function tab_LegacyLegendViewMobile$onFingerUp(pseudoEvent) {
        this._splash = tab.FeedbackMobile.createTapFeedback(this.get_domRoot().closest('.tab-dashboard').get()[0], pseudoEvent);
    },
    
    documentPointToContentPoint: function tab_LegacyLegendViewMobile$documentPointToContentPoint(documentPoint) {
        var contentPosition = this.get_legendTemplate().get_contentArea().offset();
        return tab.$create_Point(documentPoint.x - contentPosition.left + this.scroller.get_scrollPos().x + this.bodyOffset.x, documentPoint.y - contentPosition.top + this.scroller.get_scrollPos().y + this.bodyOffset.y);
    },
    
    onTap: function tab_LegacyLegendViewMobile$onTap(pseudoEvent) {
        pseudoEvent.preventDefault();
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
    
    onDragStart: function tab_LegacyLegendViewMobile$onDragStart(e) {
    },
    
    onDragMove: function tab_LegacyLegendViewMobile$onDragMove(e) {
    },
    
    onDragEnd: function tab_LegacyLegendViewMobile$onDragEnd(e) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyLegendTemplateMobile

tab.LegacyLegendTemplateMobile = function tab_LegacyLegendTemplateMobile() {
    tab.LegacyLegendTemplateMobile.initializeBase(this, [ $(tab.LegacyLegendTemplateMobile._htmlTemplate$3) ]);
    this.legendContentArea = this.getElementBySelector('.LegendContentBox');
    this.domHighlighter.css('visibility', 'hidden');
}


////////////////////////////////////////////////////////////////////////////////
// tab.PageViewMobile

tab.PageViewMobile = function tab_PageViewMobile(viewModel) {
    tab.PageViewMobile.initializeBase(this, [ viewModel ]);
}
tab.PageViewMobile.prototype = {
    
    instantiateCurrentPagePanel: function tab_PageViewMobile$instantiateCurrentPagePanel(props) {
        return new tableau.mobile.widget.CurrentPagePanelMobile(props);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AccordionViewMobile

tab.AccordionViewMobile = function tab_AccordionViewMobile(viewModel) {
    tab.AccordionViewMobile.initializeBase(this, [ viewModel, new tab.AccordionTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalFilterMobile

tab.CategoricalFilterMobile = function tab_CategoricalFilterMobile(props) {
    this.templateString = "<div class='MobilePanel CategoricalFilterMobile'>" + "<div class='MobilePanelBox CategoricalFilterMobileBox' dojoAttachPoint='domBox'>" + "<div class='TitleAndControls' dojoAttachPoint='domControls'>" + "<div class='FilterTitle' dojoAttachPoint='domTitleBar'></div>" + '</div>' + "<div class='CFMContent' dojoAttachPoint='domContent'></div>" + "<div class='CFMHorizScroll' dojoAttachPoint='domHorizScroll' dojoAttachEvent='onscroll:doscrollHoriz'>" + "<div dojoAttachPoint='domHorizScrollContent'></div>" + '</div>' + "<div dojoType='tableau.base.widget.ConditionalsWidget' dojoAttachPoint='conditionals'></div>" + '</div>' + "<div class='MobilePanelBorderOuter'><div class='MobilePanelBorderInner'></div></div>" + '</div>';
    tab.CategoricalFilterMobile.initializeBase(this, [ props ]);
}
tab.CategoricalFilterMobile.prototype = {
    
    processControlButtons: function tab_CategoricalFilterMobile$processControlButtons(hideSearchButton, hideDomainButton, hideMenuButton, hideResetButton) {
    },
    
    getCheckDropdownCatmodeClass: function tab_CategoricalFilterMobile$getCheckDropdownCatmodeClass() {
        return tableau.mobile.widget.catmode.CheckDropdownMobile;
    },
    
    getChecklistCatmodeClass: function tab_CategoricalFilterMobile$getChecklistCatmodeClass() {
        return tableau.mobile.widget.catmode.ChecklistMobile;
    },
    
    getRadiolistCatmodeClass: function tab_CategoricalFilterMobile$getRadiolistCatmodeClass() {
        return tableau.mobile.widget.catmode.RadiolistMobile;
    },
    
    getSliderCatmodeClass: function tab_CategoricalFilterMobile$getSliderCatmodeClass() {
        return tableau.mobile.widget.catmode.SliderMobile;
    },
    
    getDropdownCatmodeClass: function tab_CategoricalFilterMobile$getDropdownCatmodeClass() {
        return tableau.mobile.widget.catmode.DropdownMobile;
    },
    
    getPatternCatmodeClass: function tab_CategoricalFilterMobile$getPatternCatmodeClass() {
        return tableau.mobile.widget.catmode.PatternMobile;
    },
    
    getTypeInListCatmodeClass: function tab_CategoricalFilterMobile$getTypeInListCatmodeClass() {
        return tableau.mobile.widget.catmode.TypeInMobile;
    },
    
    makePendingChangesManager: function tab_CategoricalFilterMobile$makePendingChangesManager() {
        return new tab.PendingChangesManagerMobile(this.get_modeContents(), this.get_oFilter().table.actual_size, this.get_oFilter().exclude, this.get_oFilter().all);
    },
    
    updateSearch: function tab_CategoricalFilterMobile$updateSearch() {
    },
    
    updateStateFromSearch: function tab_CategoricalFilterMobile$updateStateFromSearch(changed) {
    },
    
    updateDomainButton: function tab_CategoricalFilterMobile$updateDomainButton() {
    },
    
    updateMenuIcons: function tab_CategoricalFilterMobile$updateMenuIcons() {
    },
    
    _getContentFloatingElement: function tab_CategoricalFilterMobile$_getContentFloatingElement() {
        return this.get_domContent();
    },
    
    _layoutSearchWidget: function tab_CategoricalFilterMobile$_layoutSearchWidget(notTitleSize) {
    },
    
    _getSearchWidgetDim: function tab_CategoricalFilterMobile$_getSearchWidgetDim() {
        var toRet = tab.$create_DojoCoords();
        toRet.h = 0;
        toRet.w = 0;
        return toRet;
    },
    
    _layoutTypeInList: function tab_CategoricalFilterMobile$_layoutTypeInList(notTitleSize) {
        this.layoutVertical(notTitleSize);
    },
    
    getTheAllItemNode: function tab_CategoricalFilterMobile$getTheAllItemNode() {
        return this.get_domContent().firstChild.firstChild;
    },
    
    layoutVertical: function tab_CategoricalFilterMobile$layoutVertical(notTitleSize) {
        var contentHeight;
        var oConditionals;
        oConditionals = { h: 0 };
        contentHeight = notTitleSize.h - oConditionals['h'];
        this.get_modeContents().layout(tab.$create_Size(notTitleSize.w, contentHeight), false);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PopupTypeInWidget

tab.PopupTypeInWidget = function tab_PopupTypeInWidget(targetDiv, style) {
    this.div = targetDiv;
    this.style = style;
    this.inputType = 'text';
    this.cssClass = 'goButton';
    dojo.addClass(this.div, 'tableauWidgetUiTypeInMobile');
    this._disposables = new tab.DisposableHolder();
}
tab.PopupTypeInWidget.prototype = {
    style: null,
    cssClass: null,
    pattern: null,
    _isClickingOnActionButton: false,
    fieldname: null,
    keyCode: 0,
    _isHittingESC: false,
    div: null,
    outerDiv: null,
    queryBox: null,
    goButton: null,
    _goButtonTouchHandler: null,
    _disposables: null,
    inputType: null,
    
    add_updatePattern: function tab_PopupTypeInWidget$add_updatePattern(value) {
        this.__updatePattern = ss.Delegate.combine(this.__updatePattern, value);
    },
    remove_updatePattern: function tab_PopupTypeInWidget$remove_updatePattern(value) {
        this.__updatePattern = ss.Delegate.remove(this.__updatePattern, value);
    },
    
    __updatePattern: null,
    
    update: function tab_PopupTypeInWidget$update(newPattern, unusedValue, unusedDomain) {
        this.pattern = newPattern;
        this.queryBox.value = newPattern;
        this.setButtonToProperState();
    },
    
    instantiate: function tab_PopupTypeInWidget$instantiate(newPattern, newFieldname) {
        this.pattern = (ss.isValue(newPattern)) ? newPattern : '';
        this.fieldname = newFieldname;
        this.div.innerHTML = '<div id="typein_' + tableau.format.escapeHTML(newFieldname) + '" class="TypeInDiv">' + '<input type="' + this.inputType + '" class="QueryBox" autocapitalize="off" autocorrect="off" value="' + tableau.format.escapeHTML(this.pattern) + '"/>' + '<span class="' + this.cssClass + '" style="display:none"></span></div>';
        this.outerDiv = this.div.firstChild;
        this.queryBox = this.outerDiv.childNodes[0];
        this.goButton = this.outerDiv.childNodes[1];
        var jqueryQueryBox = $(this.queryBox);
        this._disposables.add(spiff.EventUtil.bindWithDispose(jqueryQueryBox, 'keydown', ss.Delegate.create(this, this._onKeyDown)));
        this._disposables.add(spiff.EventUtil.bindWithDispose(jqueryQueryBox, 'keyup', ss.Delegate.create(this, this.onKeyUp)));
        this._disposables.add(spiff.EventUtil.bindWithDispose(jqueryQueryBox, 'click', ss.Delegate.create(this, this._onQueryBoxClick)));
        this._disposables.add(spiff.EventUtil.bindWithDispose(jqueryQueryBox, 'focus', ss.Delegate.create(this, this.onQueryBoxFocus)));
        this._goButtonTouchHandler = new spiff.TableauEventHandler(this.goButton, { potentialTap: ss.Delegate.create(this, this.onButtonTap) });
        this.queryBox.focus();
        this._isClickingOnActionButton = false;
        this.setButtonToProperState();
    },
    
    destroy: function tab_PopupTypeInWidget$destroy() {
        this.dispose();
    },
    
    dispose: function tab_PopupTypeInWidget$dispose() {
        this._goButtonTouchHandler.dispose();
        this._disposables.dispose();
    },
    
    layout: function tab_PopupTypeInWidget$layout() {
        this._fixQueryWidth();
    },
    
    setNewState: function tab_PopupTypeInWidget$setNewState() {
        this.pattern = this.queryBox.value;
        this.setButtonToProperState();
    },
    
    onQueryBoxFocus: function tab_PopupTypeInWidget$onQueryBoxFocus(evt) {
        this.queryBox.isFocused = true;
    },
    
    _onQueryBoxClick: function tab_PopupTypeInWidget$_onQueryBoxClick(e) {
        if (this.queryBox.isFocused) {
            this.queryBox.select();
        }
        this.queryBox.focus();
        this.queryBox.isFocused = true;
        e.stopPropagation();
    },
    
    _fixQueryWidth: function tab_PopupTypeInWidget$_fixQueryWidth() {
        var subtract = 22;
        if (!!dojo.isIE) {
            if (dojo.isIE < 7) {
                subtract = 30;
            }
            else {
                subtract = 24;
            }
        }
        dojo.marginBox(this.queryBox, { w: dojo.marginBox(this.outerDiv).w - subtract });
    },
    
    patternIsChanged: function tab_PopupTypeInWidget$patternIsChanged() {
        return this.pattern !== this.queryBox.value;
    },
    
    setButtonToProperState: function tab_PopupTypeInWidget$setButtonToProperState() {
        if (this.buttonShouldBeActive()) {
            this._setButtonActive();
        }
        else {
            this._setButtonInactive();
        }
    },
    
    buttonShouldBeActive: function tab_PopupTypeInWidget$buttonShouldBeActive() {
        return !String.isNullOrEmpty(this.queryBox.value);
    },
    
    _setButtonActive: function tab_PopupTypeInWidget$_setButtonActive() {
        dojo.style(this.goButton, 'display', '');
        dojo.addClass(this.goButton, this.style + 'Active');
    },
    
    _setButtonInactive: function tab_PopupTypeInWidget$_setButtonInactive() {
        dojo.removeClass(this.goButton, this.style + 'Active');
        dojo.style(this.goButton, 'display', 'none');
    },
    
    onInputBlur: function tab_PopupTypeInWidget$onInputBlur(e) {
        this.queryBox.isFocused = false;
        if (!this._isClickingOnActionButton && !this._isHittingESC) {
            this.setNewPattern();
        }
        this._isHittingESC = false;
    },
    
    onButtonMouseDown: function tab_PopupTypeInWidget$onButtonMouseDown(e) {
        this._isClickingOnActionButton = true;
    },
    
    onButtonTap: function tab_PopupTypeInWidget$onButtonTap(e) {
        this.doButtonAction();
        this._isClickingOnActionButton = false;
    },
    
    _handleESC: function tab_PopupTypeInWidget$_handleESC(e) {
        this.resetPattern();
        if (dojo.isFF) {
            window.setTimeout(ss.Delegate.create(this, this.resetPattern), 10);
        }
        e.stopPropagation();
        e.preventDefault();
    },
    
    _onKeyDown: function tab_PopupTypeInWidget$_onKeyDown(e) {
        if (e.which === 27) {
            this._handleESC(e);
        }
        this.keyCode = e.which;
    },
    
    onKeyUp: function tab_PopupTypeInWidget$onKeyUp(e) {
        switch (e.which) {
            case 13:
                this.setNewPattern();
                this.queryBox.blur();
                e.stopPropagation();
                e.preventDefault();
                break;
            case 27:
                this._handleESC(e);
                this._isHittingESC = true;
                this.queryBox.blur();
                break;
            case 8:
            case 46:
                this.setButtonToProperState();
                break;
            case 16:
                this.setButtonToProperState();
                break;
            default:
                if (this.keyCode === e.which) {
                    this.setButtonToProperState();
                }
                break;
        }
    },
    
    setNewPattern: function tab_PopupTypeInWidget$setNewPattern() {
        if (this.patternIsChanged()) {
            this.setNewState();
            if (ss.isValue(this.__updatePattern)) {
                this.__updatePattern(this.pattern);
            }
        }
    },
    
    resetPattern: function tab_PopupTypeInWidget$resetPattern() {
        this.queryBox.value = this.pattern;
        this.setButtonToProperState();
    },
    
    doButtonAction: function tab_PopupTypeInWidget$doButtonAction() {
        this.queryBox.value = '';
        this.setNewPattern();
        this.setButtonToProperState();
    },
    
    isLocalized: function tab_PopupTypeInWidget$isLocalized() {
        return true;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ComboBoxViewMobile

tab.ComboBoxViewMobile = function tab_ComboBoxViewMobile(viewModel) {
    tab.ComboBoxViewMobile.initializeBase(this, [ viewModel, new tab.ComboBoxTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.CurrentPagePanelMobile

tab.CurrentPagePanelMobile = function tab_CurrentPagePanelMobile(oProps) {
    tab.CurrentPagePanelMobile.initializeBase(this, [ oProps ]);
    this.WIDGET_SPACE = 8;
    this.SCROLL_PAGES = 14;
    this.BUTTONS_HEIGHT = 26;
    this.ONLY_BUTTONS = 24;
    this.SLIDER_HEIGHT = 16;
    this.ONLY_SLIDER = 15;
    this.TOGGLE_HEIGHT = 16;
    this.TOGGLE_WIDTH_OFFSET = 90;
    this.RULE_OFFSET = 19;
    this.DOM_OFFSET = 4;
    this.baseClass = 'currentPagePanel mobile';
    this.templateString = tab.CurrentPagePanelMobile._mobileTemplateString$3;
    this.widgetsInTemplate = true;
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.CurrentPagePanelMobile.prototype = {
    layoutSession: null,
    id: 0,
    parent: null,
    domBox: null,
    trailsenabled: false,
    _disposables$3: null,
    _inplaceMobile$3: null,
    
    get_inplaceMobile: function tab_CurrentPagePanelMobile$get_inplaceMobile() {
        return this._inplaceMobile$3;
    },
    set_inplaceMobile: function tab_CurrentPagePanelMobile$set_inplaceMobile(value) {
        this._inplaceMobile$3 = value;
        return value;
    },
    
    get__popup$3: function tab_CurrentPagePanelMobile$get__popup$3() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_CurrentPagePanelMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_CurrentPagePanelMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBoxElement() : this.domBox;
    },
    
    layout: function tab_CurrentPagePanelMobile$layout() {
        var titleOffsetWidth = 0;
        var titleOffsetHeight = 0;
        var toggleOffsetHeight = 0;
        if (ss.isNullOrUndefined(this.titleSize) || (ss.isValue(this.lTitle) && !this.titleSize.w)) {
            return;
        }
        var oNode = dojo.marginBox(this.containerNode);
        var widgetWidth = oNode.w - this.DOM_OFFSET;
        var widgetHeight = 0;
        if (this.titleSize.w < oNode.w) {
            if (oNode.h < this.getWidgetOffset()) {
                this.cpOrientation = 'horizontal';
            }
            else {
                this.cpOrientation = 'vertical';
            }
            widgetWidth -= this.titleSize.w;
            titleOffsetWidth = this.titleSize.w;
        }
        else {
            if (oNode.h - this.titleSize.h < this.getWidgetOffset()) {
                this.cpOrientation = 'horizontal';
            }
            else {
                this.cpOrientation = 'vertical';
            }
            titleOffsetHeight = this.titleSize.h / 2;
        }
        if (this.cpOrientation === 'horizontal') {
            if (this.show_toggle) {
                widgetWidth -= this.TOGGLE_WIDTH_OFFSET;
            }
            widgetHeight = (this.show_dropdown) ? this.BUTTONS_HEIGHT : this.SLIDER_HEIGHT;
        }
        else {
            widgetHeight = (this.show_slider) ? this.SLIDER_HEIGHT : 0;
            widgetHeight += (this.show_dropdown) ? this.BUTTONS_HEIGHT : 0;
            toggleOffsetHeight = (this.show_toggle) ? this.TOGGLE_HEIGHT / 2 : 0;
        }
        this.innerWrapper.isHorizontal = this.cpOrientation === 'horizontal';
        dojo.marginBox(this.innerWrapper.domNode, { w: widgetWidth, h: widgetHeight });
        this.innerWrapper.resize();
        var oSlider = dojo.marginBox(this.sliderPane.domNode);
        if (this._horizontalRule != null && oSlider.w > 0) {
            dojo.marginBox(this._horizontalRule.domNode, { w: oSlider.w - this.RULE_OFFSET });
            if (this.pages.length * 2 > oSlider.w - this.RULE_OFFSET) {
                dojo.style(this._horizontalRule.domNode, 'display', 'none');
            }
            else {
                dojo.style(this._horizontalRule.domNode, 'display', '');
            }
        }
        var buttonOffset = Math.min(((oNode.h - widgetHeight) / 2) - titleOffsetHeight - toggleOffsetHeight, 6);
        var buttonTop = buttonOffset + (2 * titleOffsetHeight);
        dojo.style(this.innerWrapper.domNode, { top: Math.max(buttonTop, 0) + 'px', position: 'absolute', left: (titleOffsetWidth + (this.DOM_OFFSET / 2)) + 'px' });
        if (this.cpOrientation === 'vertical') {
            dojo.style(this.buttonsContainer.domNode, { height: this.ONLY_BUTTONS + 'px', position: 'relative', top: '', left: '', padding: '0 0 2px 0' });
            this.buttonsContainer.resize();
            dojo.style(this.sliderPane.domNode, { height: this.SLIDER_HEIGHT + 'px', position: 'relative', top: '', left: '' });
            dojo.style(this._checkboxPane.domNode, { width: Math.max(oNode.w - 1, 0) + 'px', top: Math.max(buttonTop, 0) + widgetHeight + buttonOffset + 'px', position: 'absolute', left: titleOffsetWidth + 'px' });
        }
        else {
            dojo.style(this._checkboxPane.domNode, { top: Math.max(buttonTop, 0) + 'px', position: 'absolute', left: titleOffsetWidth + widgetWidth + 'px' });
        }
    },
    
    postMixInProperties: function tab_CurrentPagePanelMobile$postMixInProperties() {
        this.display_dropdown = (this.show_dropdown) ? 'block' : 'none';
        this.display_slider = (this.show_slider) ? 'block' : 'none';
        this.display_toggle = (this.show_toggle) ? 'block' : 'none';
        var numPages = this.pages.length;
        this.maximum = numPages - 1;
        this.discrete_values = numPages;
        this.show_ruler = (this.show_slider) ? 'block' : 'none';
        this.ruler_count = numPages;
        this.popupClass = (numPages > this.SCROLL_PAGES) ? 'cpPopupEx' : 'cpPopup';
        this.cpOrientation = (this.cpHeight < this.getWidgetOffset()) ? 'horizontal' : 'vertical';
        this.trailsenabled = this.enable;
    },
    
    postCreate: function tab_CurrentPagePanelMobile$postCreate() {
        this.inherited(arguments);
        dojo.toggleClass(this._showHistoryCb, 'FIMChecked', this.enable);
        this._disposables$3 = new tab.DisposableHolder();
        this.get_inplaceMobile().setupTouchHandler(this.domNode);
        this.createPopup();
    },
    
    dispose: function tab_CurrentPagePanelMobile$dispose() {
        this._disposables$3.dispose();
    },
    
    destroy: function tab_CurrentPagePanelMobile$destroy(preserveDom) {
        this.dispose();
        this.get_inplaceMobile().destroyPopup();
        this.get_inplaceMobile().disconnectPopup();
        this.inherited(arguments);
    },
    
    refreshLayout: function tab_CurrentPagePanelMobile$refreshLayout(newPages, page, newEnable) {
        this.refreshed = false;
        this.current_page = page;
        this.pages = newPages;
        if (this.show_slider) {
            if (this._horizontalRule != null) {
                this._horizontalRule.destroy(false);
                this._horizontalRule = null;
            }
            this._slider.maximum = this.pages.length - 1;
            this._slider.discreteValues = this.pages.length;
            dijit.setWaiState(this._slider.focusNode, 'valuemax', this.pages.length);
            if (this.pages.length < 1200) {
                var rulesParams = { style: 'width:100%; height:3px; margin-left:4px;', count: this.pages.length };
                this._horizontalRule = new dijit.form.HorizontalRule(rulesParams, this._horizontalRuleNode);
                this._horizontalRule.placeAt(this.sliderPane.domNode, 2);
                this._horizontalRule.startup();
            }
            this._slider.startup();
            this._slider.onBarClick = null;
        }
        if (this.show_toggle && arguments.length > 2) {
            this.enable = newEnable;
        }
        this.setTitle();
        this.layout();
        this.refreshed = true;
        this.refreshWidget(this.current_page);
        this.get__popup$3()._refreshContent(this.pages, page, this.enable);
    },
    
    refreshWidget: function tab_CurrentPagePanelMobile$refreshWidget(page) {
        this.current_page = page;
        if (this.show_dropdown && this._dropdown != null) {
            this._dropdown.innerHTML = (this.pages[this.current_page] || '');
            this._rightBtn.setAttribute('disabled', this.current_page === (this.pages.length - 1));
            this._rightBtn.attr('iconClass', 'dijitIcon cpRightArrow' + ((this.current_page === (this.pages.length - 1)) ? 'Grey' : 'Black'));
            this._leftBtn.setAttribute('disabled', !this.current_page);
            this._leftBtn.attr('iconClass', 'dijitIcon cpLeftArrow' + ((!this.current_page) ? 'Grey' : 'Black'));
        }
        if (this.show_slider && this._slider != null) {
            this._slider.setValue(this.current_page);
        }
    },
    
    prevPage: function tab_CurrentPagePanelMobile$prevPage(e) {
        this.inherited(arguments);
        (this.get__popup$3().get_content()).syncEverything(this.current_page);
    },
    
    nextPage: function tab_CurrentPagePanelMobile$nextPage(e) {
        this.inherited(arguments);
        (this.get__popup$3().get_content()).syncEverything(this.current_page);
    },
    
    onCheckboxChange: function tab_CurrentPagePanelMobile$onCheckboxChange() {
        this.inherited(arguments);
        dojo.toggleClass(this._showHistoryCb, 'FIMChecked', this.enable);
    },
    
    onSelection: function tab_CurrentPagePanelMobile$onSelection(selectedPage, propagate) {
        if (propagate) {
            this.inherited(arguments);
        }
    },
    
    createPopup: function tab_CurrentPagePanelMobile$createPopup(items) {
        var popupClass = tableau.mobile.widget.catmode.popup.CurrentPagePanelPopup;
        var popupParams = {};
        popupParams.show_dropdown = this.show_dropdown;
        popupParams.show_slider = this.show_slider;
        popupParams.show_toggle = this.show_toggle;
        popupParams.trails_enabled = this.trailsenabled;
        popupParams.title = this.lTitle;
        popupParams.items = this.pages;
        popupParams.current_page = this.current_page;
        popupParams.viewModel = this.pageViewModel;
        this.parent = this;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get__popup$3().get_contentAsPagePanelContent().add_applyChangeFromSliderCalled(ss.Delegate.create(this, this.onSelection));
        this.get__popup$3().get_contentAsPagePanelContent().add_applyChangeCalled(ss.Delegate.create(this, this.onSelection));
        this.get__popup$3().get_contentAsPagePanelContent().add_rightPressed(ss.Delegate.create(this, this.nextPage));
        this.get__popup$3().get_contentAsPagePanelContent().add_leftPressed(ss.Delegate.create(this, this.prevPage));
        this.get__popup$3().get_contentAsPagePanelContent().add_toggleHistoryCalled(ss.Delegate.create(this, this.onCheckboxChange));
        this._disposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get__popup$3().get_contentAsPagePanelContent().remove_applyChangeFromSliderCalled(ss.Delegate.create(this, this.onSelection));
            this.get__popup$3().get_contentAsPagePanelContent().remove_applyChangeCalled(ss.Delegate.create(this, this.onSelection));
            this.get__popup$3().get_contentAsPagePanelContent().remove_rightPressed(ss.Delegate.create(this, this.nextPage));
            this.get__popup$3().get_contentAsPagePanelContent().remove_leftPressed(ss.Delegate.create(this, this.prevPage));
            this.get__popup$3().get_contentAsPagePanelContent().remove_toggleHistoryCalled(ss.Delegate.create(this, this.onCheckboxChange));
        })));
    },
    
    get_uniqueNodeId: function tab_CurrentPagePanelMobile$get_uniqueNodeId() {
        return this.id.toString();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CustomViewsPanelMobile

tab.CustomViewsPanelMobile = function tab_CustomViewsPanelMobile(viewModel, toolbarButton) {
    tab.CustomViewsPanelMobile.initializeBase(this, [ viewModel, toolbarButton ]);
    this.resizeHandle.hide();
    this.listPanelScroller = this.panel.find('.tab-cv-list-panel-scroller');
    var listPanelElement = this.listPanelScroller.get(0);
    var touchSpec = spiff.$create_EventHandleSpec();
    touchSpec.potentialTap = ss.Delegate.create(this, this.handlePotentialTap);
    this.touchHandler = new spiff.TableauEventHandler(listPanelElement, touchSpec);
    var scrollSpec = spiff.$create_MobileScrollerOptions();
    this.scroller = new spiff.MobileScroller(listPanelElement, this.touchHandler, scrollSpec);
}
tab.CustomViewsPanelMobile.prototype = {
    touchHandler: null,
    scroller: null,
    listPanelScroller: null,
    
    get_defaultPanelWidth: function tab_CustomViewsPanelMobile$get_defaultPanelWidth() {
        return 360;
    },
    
    get_defaultPanelHeight: function tab_CustomViewsPanelMobile$get_defaultPanelHeight() {
        return 370;
    },
    
    get_panelBorder: function tab_CustomViewsPanelMobile$get_panelBorder() {
        return 5;
    },
    
    show: function tab_CustomViewsPanelMobile$show() {
        tab.CustomViewsPanelMobile.callBaseMethod(this, 'show');
        tsConfig.getScale(ss.Delegate.create(this, function(scale) {
            this.panel.css({ '-webkit-transform': 'scale(' + (1 / scale).toString() + ')', '-webkit-transform-origin': (this.viewModel.get_isTop()) ? 'top left' : 'bottom left' });
        }));
    },
    
    appendListItemSeparatorHtml: function tab_CustomViewsPanelMobile$appendListItemSeparatorHtml(sb) {
        sb.append('<div unselectable="on" class="tab-cv-list-item-separator"></div>');
    },
    
    appendSelectListItemNameAndAuthorHtml: function tab_CustomViewsPanelMobile$appendSelectListItemNameAndAuthorHtml(sb, customViewName, ownerName, isDefault) {
        var nameClass = (ss.isValue(ownerName)) ? 'tab-cv-select-list-item-name' : 'tab-cv-select-list-item-name tab-cv-select-list-item-name-middle';
        sb.append('<span unselectable="on" class="').append(nameClass).append('">').append(customViewName);
        if (isDefault) {
            sb.append(' (').append(tab.Strings.CustomViewsDefault).append(')');
        }
        sb.append('</span>');
        if (ss.isValue(ownerName)) {
            sb.append('<span unselectable="on" class="tab-cv-select-list-item-name-owner">').append(ownerName).append('</span>');
        }
    },
    
    bindListItem: function tab_CustomViewsPanelMobile$bindListItem(item, cv) {
        this.disposables.add(spiff.ClickHandler.targetAndClick(item, ss.Delegate.create(this, function(e) {
            this.listItemClicked(e, cv);
        })));
    },
    
    handlePotentialTap: function tab_CustomViewsPanelMobile$handlePotentialTap(evt) {
        $(evt.target).trigger('tap');
    },
    
    rememberNamePlaceholderClicked: function tab_CustomViewsPanelMobile$rememberNamePlaceholderClicked(e) {
        this.rememberNamePlaceholder.hide();
        tab.CustomViewsPanelMobile.callBaseMethod(this, 'rememberNamePlaceholderClicked', [ e ]);
    },
    
    updateCustomViewsList: function tab_CustomViewsPanelMobile$updateCustomViewsList() {
        tab.CustomViewsPanelMobile.callBaseMethod(this, 'updateCustomViewsList');
        this.scroller.resetPosition();
        this.scroller.refresh();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ExportPdfDialogMobile

tab.ExportPdfDialogMobile = function tab_ExportPdfDialogMobile(sess, pngMode) {
    tab.ExportPdfDialogMobile.initializeBase(this, [ sess, pngMode ]);
    this.get_body().addClass('tab-pdfdlg-mobile');
}
tab.ExportPdfDialogMobile.prototype = {
    _touchHandler$4: null,
    _scroller$4: null,
    
    dispose: function tab_ExportPdfDialogMobile$dispose() {
        this._touchHandler$4.dispose();
        this._scroller$4.dispose();
        tab.ExportPdfDialogMobile.callBaseMethod(this, 'dispose');
    },
    
    initFromModel: function tab_ExportPdfDialogMobile$initFromModel() {
        var touchSpec = spiff.$create_EventHandleSpec();
        touchSpec.potentialTap = ss.Delegate.create(this, this._handleSheetContainerTouch$4);
        this._touchHandler$4 = new spiff.TableauEventHandler(this._getScrollElement$4(), touchSpec);
        var scrollSpec = spiff.$create_MobileScrollerOptions();
        scrollSpec.displayPolicy = 'always';
        this._scroller$4 = new spiff.MobileScroller(this._getScrollElement$4(), this._touchHandler$4, scrollSpec);
        tab.ExportPdfDialogMobile.callBaseMethod(this, 'initFromModel');
        this._refreshIScroll$4();
    },
    
    initEventHandlers: function tab_ExportPdfDialogMobile$initEventHandlers() {
        this.get_body().find('select').change(ss.Delegate.create(this, this.updateSelection)).end().find('.png-only input').change(ss.Delegate.create(this, this.updateImageDimension)).end();
        spiff.ClickHandler.targetAndClick(this.get_body().find('.tab-pdfdlg-group-orientation button'), ss.Delegate.create(this, this.updateOrientation));
        spiff.ClickHandler.targetAndClick(this.get_body().find('.tab-pdfdlg-dashboard-content-mode button'), ss.Delegate.create(this, this.handleContentModeSwitch));
        spiff.ClickHandler.targetAndClick(this.get_body().find('.tab-pdfdlg-worksheet-content-mode button'), ss.Delegate.create(this, this.handleContentModeSwitch));
        spiff.ClickHandler.targetAndClick(this.get_body().find('.tab-pdfdlg-story-content-mode button'), ss.Delegate.create(this, this.handleContentModeSwitch));
    },
    
    onWindowResize: function tab_ExportPdfDialogMobile$onWindowResize(e) {
        return;
    },
    
    showThumbList: function tab_ExportPdfDialogMobile$showThumbList() {
        tab.ExportPdfDialogMobile.callBaseMethod(this, 'showThumbList');
        this._refreshIScroll$4();
    },
    
    hideThumbList: function tab_ExportPdfDialogMobile$hideThumbList() {
        tab.ExportPdfDialogMobile.callBaseMethod(this, 'hideThumbList');
        this._refreshIScroll$4();
    },
    
    setSingleSheetSelected: function tab_ExportPdfDialogMobile$setSingleSheetSelected() {
        tab.ExportPdfDialogMobile.callBaseMethod(this, 'setSingleSheetSelected');
        this._refreshIScroll$4();
    },
    
    _handleSheetContainerTouch$4: function tab_ExportPdfDialogMobile$_handleSheetContainerTouch$4(evt) {
        var target = evt.target;
        var closest = $(target).closest('li button');
        if (closest.length > 0) {
            var thumbnail = null;
            var $enum1 = ss.IEnumerator.getEnumerator(this.thumbnails);
            while ($enum1.moveNext()) {
                var eachThumb = $enum1.current;
                if (eachThumb.button === closest) {
                    thumbnail = eachThumb;
                    break;
                }
            }
            if (ss.isValue(thumbnail)) {
                thumbnail.set_isSelected(!thumbnail.get_isSelected());
            }
        }
    },
    
    _getScrollElement$4: function tab_ExportPdfDialogMobile$_getScrollElement$4() {
        return this.dom.thumbList[0];
    },
    
    _refreshIScroll$4: function tab_ExportPdfDialogMobile$_refreshIScroll$4() {
        this._scroller$4.resetPosition();
        this._scroller$4.refresh();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tableau.mobile.FilterItemMobile

tableau.mobile.FilterItemMobile = function tableau_mobile_FilterItemMobile() {
}
tableau.mobile.FilterItemMobile.getSearchResultHtml = function tableau_mobile_FilterItemMobile$getSearchResultHtml(filter, tuple, itemName, itemIndex) {
    switch (filter.get_mode()) {
        case 'checklist':
        case 'checkdropdown':
        case 'typeinlist':
            return tableau.mobile.FilterItemMobile.formatChecklistFilterItemHtml(filter, tuple, itemName, itemIndex);
        case 'radiolist':
            return tableau.mobile.FilterItemMobile.formatRadiolistFilterItemHtml(filter, tuple, itemName, itemIndex);
        case 'dropdown':
            return tableau.mobile.FilterItemMobile.formatDropdownListFilterItemHtml(filter, tuple, itemName, itemIndex);
    }
    return '';
}
tableau.mobile.FilterItemMobile.formatChecklistFilterItemHtml = function tableau_mobile_FilterItemMobile$formatChecklistFilterItemHtml(filter, tuple, itemName, itemIndex) {
    var id = tab.FilterItemUtil.getItemId(itemName, itemIndex);
    var isChecked = tab.FilterItemUtil.shouldCheckFilterItemMultiValue(tuple, filter);
    var dname = tableau.format.formatTupleDisplayName(tuple, false, filter.get_oFilter().role);
    var facet = tableau.format.formatTupleDisplayFacet(tuple, false, filter.get_oFilter().role);
    var showFacets = tab.FilterItemUtil.showFacets(filter);
    var isPending = ss.isValue(filter.get_modeContents().pendingManager) && filter.get_modeContents().pendingManager.isPending(tuple, itemIndex);
    return tableau.mobile.FilterItemMobile.getCheckHtml(id, dname, isChecked, facet, showFacets, isPending);
}
tableau.mobile.FilterItemMobile.getCheckHtml = function tableau_mobile_FilterItemMobile$getCheckHtml(id, dname, ischecked, facet, showFacets, isPending) {
    var checkedClass = '';
    var pendingClass = (isPending) ? 'FIMPending' : '';
    var facetDiv = '';
    if ((ischecked && !isPending) || (!ischecked && isPending)) {
        checkedClass = ' FIMChecked';
    }
    if (showFacets) {
        facetDiv = facet;
    }
    return ([ '<div class="FIMContainer ' + pendingClass + ' facetOverflow" id="', id, '"><div class="facet">', facetDiv, '</div><span class="FIMCheckMark', checkedClass, '"></span><span class="FIMCheckLabel tab-ctrl-formatted-text', checkedClass, '">', dname, '</span></div>' ]).join('');
}
tableau.mobile.FilterItemMobile.formatRadiolistFilterItemHtml = function tableau_mobile_FilterItemMobile$formatRadiolistFilterItemHtml(filter, tuple, itemName, itemIndex) {
    var id = tab.FilterItemUtil.getItemId(itemName, itemIndex);
    var isChecked = tab.FilterItemUtil.shouldCheckFilterItemSingleValue(tuple, filter);
    var dname = tableau.format.formatTupleDisplayName(tuple, false, filter.get_oFilter().role);
    var facet = tableau.format.formatTupleDisplayFacet(tuple, false, filter.get_oFilter().role);
    var showFacets = tab.FilterItemUtil.showFacets(filter);
    return tableau.mobile.FilterItemMobile.getRadioHtml(id, dname, isChecked, facet, showFacets);
}
tableau.mobile.FilterItemMobile.getRadioHtml = function tableau_mobile_FilterItemMobile$getRadioHtml(id, dname, ischecked, facet, showFacets) {
    var checkedClass = '', facetDiv = '';
    if (ischecked) {
        checkedClass = ' FIMRadiolist FIMChecked';
    }
    if (showFacets) {
        facetDiv = facet;
    }
    return ([ '<div class="FIMContainer facetOverflow" id="', id, '"><div class="facet">', facetDiv, '</div><span class="FIMCheckMark', checkedClass, '"></span><span class="FIMCheckLabel tab-ctrl-formatted-text', checkedClass, '">', dname, '</span></div>' ]).join('');
}
tableau.mobile.FilterItemMobile.formatDropdownListFilterItemHtml = function tableau_mobile_FilterItemMobile$formatDropdownListFilterItemHtml(filter, tuple, itemName, itemIndex) {
    var id = tab.FilterItemUtil.getItemId(itemName, itemIndex);
    var dname = tableau.format.formatTupleDisplayName(tuple, false, filter.get_oFilter().role);
    var facet = tableau.format.formatTupleDisplayFacet(tuple, false, filter.get_oFilter().role);
    var showFacets = tab.FilterItemUtil.showFacets(filter);
    return tableau.mobile.FilterItemMobile.getDropdownHtml(id, dname, facet, showFacets);
}
tableau.mobile.FilterItemMobile.getDropdownHtml = function tableau_mobile_FilterItemMobile$getDropdownHtml(id, dname, facet, showFacets) {
    var facetDiv = '';
    if (showFacets) {
        facetDiv = facet;
    }
    return ([ '<div class="FIMContainer FIMDropdown" id="', id, '"><div class="facet">', facetDiv, '</div><span class="FIMCheckLabel tab-ctrl-formatted-fixedsize">', dname, '</span></div>' ]).join('');
}
tableau.mobile.FilterItemMobile.getTypeInHtml = function tableau_mobile_FilterItemMobile$getTypeInHtml(id, dname) {
    return ([ '<div class="FIMContainer FIMTypeIn" id="', id, '"><span class="FIMCheckLabel tab-ctrl-formatted-text">', dname, '</span></div>' ]).join('');
}
tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml = function tableau_mobile_FilterItemMobile$formatListRowFilterItemHtml(filter, tuple, itemName, itemIndex) {
    var id = tab.FilterItemUtil.getItemId(itemName, itemIndex);
    var isAllItem = itemIndex === tab.FilterItemUtil.allItemIndex;
    var isChecked;
    if (isAllItem) {
        isChecked = tuple.s;
    }
    else if (filter.isSingleSelect()) {
        isChecked = tab.FilterItemUtil.shouldCheckFilterItemSingleValue(tuple, filter);
    }
    else {
        isChecked = tab.FilterItemUtil.shouldCheckFilterItemMultiValue(tuple, filter);
    }
    var dname = tableau.format.formatTupleDisplayName(tuple, false, filter.get_oFilter().role);
    var showFacets = tab.FilterItemUtil.showFacets(filter);
    var facet = (showFacets) ? tableau.format.formatTupleDisplayFacet(tuple, false, filter.get_oFilter().role) : '';
    var isPending = ss.isValue(filter.get_modeContents()) && ss.isValue(filter.get_modeContents().pendingManager) && filter.get_modeContents().pendingManager.isPending(tuple, itemIndex);
    var shouldDisplayChecked = false;
    if (isAllItem) {
        var pendingManager = (ss.isValue(filter.get_modeContents())) ? filter.get_modeContents().pendingManager : null;
        shouldDisplayChecked = tab.Checklist.shouldCheckAllItem(filter.get_oFilter(), pendingManager);
    }
    else if ((isChecked && !isPending) || (!isChecked && isPending)) {
        shouldDisplayChecked = true;
    }
    return tableau.mobile.FilterItemMobile.getScrollingListRowHtml(id, dname, facet, isAllItem, shouldDisplayChecked, showFacets, isPending);
}
tableau.mobile.FilterItemMobile.getScrollingListRowHtml = function tableau_mobile_FilterItemMobile$getScrollingListRowHtml(id, dname, facet, isAllRow, isChecked, isWide, isPending) {
    return ([ '<div class="ListRow', (isAllRow) ? ' rowAll' : '', (isChecked) ? ' checked' : '', (isWide) ? ' Wide' : '', (isPending) ? ' pending' : '', '" id="_popup_', id, '">', '<div class="facet">', facet, '</div>', '<div class="checkArea">&nbsp;</div>', '<div class="labelArea" style="margin-left: 28px;">', dname, '</div></div>' ]).join('');
}
tableau.mobile.FilterItemMobile.formatRemovableListRowFilterItemHtml = function tableau_mobile_FilterItemMobile$formatRemovableListRowFilterItemHtml(filter, tuple, itemName, itemIndex) {
    var id = tab.FilterItemUtil.getItemId(itemName, itemIndex);
    var dname = tableau.format.formatTupleDisplayName(tuple, false, filter.get_oFilter().role);
    return tableau.mobile.FilterItemMobile.getScrollingListRemovableRowHtml(id, dname);
}
tableau.mobile.FilterItemMobile.getScrollingListRemovableRowHtml = function tableau_mobile_FilterItemMobile$getScrollingListRemovableRowHtml(id, dname) {
    return ([ '<div class="ListRow" id="_popup_', id, '" style="min-width: 270px; white-space: nowrap;">' + '<div class="wcIconSearchRemoveContainer" style="margin-right:10px">' + '<div class="wcIconSearchRemove" style="margin-right:10px">&nbsp;</div>' + '</div>' + '<div class="xRowlabelArea">', dname, '</div>' + '<div style="clear:both;"></div>' + '</div>' ]).join('');
}
tableau.mobile.FilterItemMobile._getCssNode = function tableau_mobile_FilterItemMobile$_getCssNode(node) {
    return tab.FilterItemUtil.getClassElement(node, 'FIMContainer');
}
tableau.mobile.FilterItemMobile.setChecked = function tableau_mobile_FilterItemMobile$setChecked(node, ischecked, tuple) {
    var checkMarkNode = $(node).find('.FIMCheckMark');
    var itemNode = $(node).find('.FIMCheckLabel');
    if (ss.isValue(checkMarkNode) && ss.isValue(itemNode)) {
        if (ischecked) {
            checkMarkNode.addClass('FIMChecked');
            itemNode.addClass('FIMChecked');
        }
        else {
            checkMarkNode.removeClass('FIMChecked');
            itemNode.removeClass('FIMChecked');
        }
    }
    if (ss.isValue(tuple)) {
        tuple.s = (!!ischecked);
    }
    return tuple;
}
tableau.mobile.FilterItemMobile.isChecked = function tableau_mobile_FilterItemMobile$isChecked(node) {
    if (ss.isValue(node) && dojo.hasClass(node, 'FIMContainer')) {
        var checkMarkNode = $(node).find('.FIMCheckMark');
        return (ss.isValue(checkMarkNode)) ? checkMarkNode.hasClass('FIMChecked') : false;
    }
    return false;
}
tableau.mobile.FilterItemMobile.isPending = function tableau_mobile_FilterItemMobile$isPending(node) {
    if (ss.isValue(node)) {
        return dojo.hasClass(node, 'FIMPending');
    }
    return false;
}
tableau.mobile.FilterItemMobile.togglePendingState = function tableau_mobile_FilterItemMobile$togglePendingState(node) {
    $(node).toggleClass('FIMPending');
}
tableau.mobile.FilterItemMobile.syncCssToCheckState = function tableau_mobile_FilterItemMobile$syncCssToCheckState(node) {
    var checkBoxOrRadio = tableau.FilterItem.getCheckboxOrRadio(node);
    if (ss.isValue(checkBoxOrRadio)) {
        tableau.mobile.FilterItemMobile.setChecked(node, checkBoxOrRadio.checked);
    }
}
tableau.mobile.FilterItemMobile.setSelected = function tableau_mobile_FilterItemMobile$setSelected(node, selected) {
    var cssNode = tableau.mobile.FilterItemMobile._getCssNode(node);
    if (selected) {
        dojo.addClass(cssNode, 'FIMSelected');
    }
    else {
        dojo.removeClass(cssNode, 'FIMSelected');
    }
}
tableau.mobile.FilterItemMobile.isSelected = function tableau_mobile_FilterItemMobile$isSelected(node) {
    var cssNode = tableau.mobile.FilterItemMobile._getCssNode(node);
    return dojo.hasClass(cssNode, 'FIMSelected');
}
tableau.mobile.FilterItemMobile.getNodeFromEvent = function tableau_mobile_FilterItemMobile$getNodeFromEvent(evt) {
    if (ss.isNullOrUndefined(evt) || ss.isNullOrUndefined(evt.target)) {
        return null;
    }
    var node = evt.target;
    while (ss.isValue(node) && node.tagName !== 'OPTION' && !dojo.hasClass(node, 'FIMContainer')) {
        node = node.parentNode;
    }
    return node;
}
tableau.mobile.FilterItemMobile.getIndex = function tableau_mobile_FilterItemMobile$getIndex(node) {
    return tab.FilterItemUtil.getIndexFromId(node.id);
}
tableau.mobile.FilterItemMobile.isTypeInListItem = function tableau_mobile_FilterItemMobile$isTypeInListItem(node) {
    var cssNode = tableau.mobile.FilterItemMobile._getCssNode(node);
    return dojo.hasClass(cssNode, 'FIMTypeIn');
}
tableau.mobile.FilterItemMobile.isAllItem = function tableau_mobile_FilterItemMobile$isAllItem(node) {
    if (tableau.mobile.FilterItemMobile.isTypeInListItem(node)) {
        return false;
    }
    return tab.FilterItemUtil.isAllItemId(node.id);
}


////////////////////////////////////////////////////////////////////////////////
// tab.FilterPanelMobile

tab.FilterPanelMobile = function tab_FilterPanelMobile(oProps) {
    tab.FilterPanelMobile.initializeBase(this, [ oProps ]);
}
tab.FilterPanelMobile.prototype = {
    
    makeCategoricalFilter: function tab_FilterPanelMobile$makeCategoricalFilter(filterProps) {
        return new tableau.mobile.widget.CategoricalFilterMobile(filterProps);
    },
    
    makeQuantitativeFilter: function tab_FilterPanelMobile$makeQuantitativeFilter(filterProps) {
        return new tableau.mobile.widget.QuantitativeFilterMobile(filterProps);
    },
    
    makeQuantitativeDateFilter: function tab_FilterPanelMobile$makeQuantitativeDateFilter(filterProps) {
        return new tableau.mobile.widget.QuantitativeDateFilterMobile(filterProps);
    },
    
    makeHierarchicalFilter: function tab_FilterPanelMobile$makeHierarchicalFilter(filterProps) {
        return new tableau.mobile.widget.HierarchicalFilterMobile(filterProps);
    },
    
    makeRelativeDateFilter: function tab_FilterPanelMobile$makeRelativeDateFilter(filterProps) {
        return new tableau.mobile.widget.RelativeDateFilterMobile(filterProps);
    },
    
    makeRelativeDatePickFilter: function tab_FilterPanelMobile$makeRelativeDatePickFilter(filterProps) {
        return new tableau.mobile.widget.RelativeDatePickFilterMobile(filterProps);
    },
    
    hideControls: function tab_FilterPanelMobile$hideControls() {
    },
    
    setupEventHandlers: function tab_FilterPanelMobile$setupEventHandlers() {
    },
    
    onMouseOut: function tab_FilterPanelMobile$onMouseOut() {
    },
    
    onMouseDown: function tab_FilterPanelMobile$onMouseDown() {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FloatingZoomToolbarMobile

tab.FloatingZoomToolbarMobile = function tab_FloatingZoomToolbarMobile(containerDiv, zoomFuncs, useAllButtons, addMapsSearchOffset) {
    tab.FloatingZoomToolbarMobile.initializeBase(this, [ containerDiv, zoomFuncs, useAllButtons, addMapsSearchOffset ]);
    if (!tab.FeatureParamsLookup.getBool(tab.FeatureParam.selectionToolsMobile)) {
        this.isFullToolbar = false;
    }
    this.init();
    if (!tab.FeatureParamsLookup.getBool(tab.FeatureParam.selectionToolsMobile) && addMapsSearchOffset) {
        this.zoomHomeBtn.addClass('FloatingZoomToolbar-MapsSearchOffset');
    }
}
tab.FloatingZoomToolbarMobile.prototype = {
    appendSelectBtn: null,
    singleSelectBtn: null,
    _isAppending$2: false,
    _inputHandlers$2: null,
    
    dispose: function tab_FloatingZoomToolbarMobile$dispose() {
        if (this._inputHandlers$2 != null) {
            var keys = Object.keys(this._inputHandlers$2);
            var $enum1 = ss.IEnumerator.getEnumerator(keys);
            while ($enum1.moveNext()) {
                var key = $enum1.current;
                this._inputHandlers$2[key].dispose();
                delete this._inputHandlers$2[key];
            }
        }
        tab.FloatingZoomToolbarMobile.callBaseMethod(this, 'dispose');
    },
    
    setZoomHomePossibility: function tab_FloatingZoomToolbarMobile$setZoomHomePossibility(state) {
        tab.FloatingZoomToolbarMobile.callBaseMethod(this, 'setZoomHomePossibility', [ state ]);
        if (this.isFullToolbar && this.zoomHomeBtn != null) {
            this.zoomHomeBtn.get_element().css('display', (state) ? '' : 'none');
        }
    },
    
    resetVisualState: function tab_FloatingZoomToolbarMobile$resetVisualState() {
        this.updateButtonState(this.get_currentToolMode(), true);
        tab.FloatingZoomToolbarMobile.callBaseMethod(this, 'resetVisualState');
    },
    
    createButtons: function tab_FloatingZoomToolbarMobile$createButtons() {
        if (!tab.FeatureParamsLookup.getBool(tab.FeatureParam.selectionToolsMobile)) {
            this.oldCreateButtons();
        }
        else {
            this.createButtonContainer();
            if (this.isFullToolbar) {
                this.flyOutBtn = this.addButton(this.buttonContainer, '', '');
                this.createButtonFlyOut();
                this._createFlyOutButtons$2();
                this.updateButtonState(this.api.defaultPointerToolMode(), true);
            }
            this.zoomHomeBtn = this.addButton(this.buttonContainer, 'buttonZoomHome', tab.Strings.PanZoomSelectToolsZoomHomeTooltip);
        }
        this.setupEventHandling();
    },
    
    showFlyout: function tab_FloatingZoomToolbarMobile$showFlyout() {
        if (this.flyOutContainer == null) {
            return;
        }
        if (this.flyOutContainer.css('display') !== 'none') {
            this.updateFlyOutVisibility(false);
            return;
        }
        tab.FloatingZoomToolbarMobile.callBaseMethod(this, 'showFlyout');
    },
    
    _createFlyOutButtons$2: function tab_FloatingZoomToolbarMobile$_createFlyOutButtons$2() {
        this.panBtn = this.addToggleButton(this.flyOutButtons, 'buttonPan', tab.Strings.PanZoomSelectToolsPanTooltip);
        this.radialSelectBtn = this.addToggleButton(this.flyOutButtons, 'buttonRadialSelect', tab.Strings.PanZoomSelectToolsRadialSelectionTooltip);
        this.lassoSelectBtn = this.addToggleButton(this.flyOutButtons, 'buttonLassoSelect', tab.Strings.PanZoomSelectToolsLassoSelectionTooltip);
        this.rectSelectBtn = this.addToggleButton(this.flyOutButtons, 'buttonRectSelect', tab.Strings.PanZoomSelectToolsRectangularSelectionTooltip);
        this.appendSelectBtn = this.addToggleButton(this.flyOutButtons, 'buttonAppendSelect', '');
    },
    
    setupEventHandling: function tab_FloatingZoomToolbarMobile$setupEventHandling() {
        tab.FloatingZoomToolbarMobile.callBaseMethod(this, 'setupEventHandling');
        this._inputHandlers$2 = {};
        if (this.isFullToolbar) {
            this._inputHandlers$2[this.panBtn] = new spiff.TableauEventHandler(this.panBtn.get_element().get(0), this._makeTouchSpec$2(this.panBtn));
            this._inputHandlers$2[this.radialSelectBtn] = new spiff.TableauEventHandler(this.radialSelectBtn.get_element().get(0), this._makeTouchSpec$2(this.radialSelectBtn));
            this._inputHandlers$2[this.lassoSelectBtn] = new spiff.TableauEventHandler(this.lassoSelectBtn.get_element().get(0), this._makeTouchSpec$2(this.lassoSelectBtn));
            this._inputHandlers$2[this.rectSelectBtn] = new spiff.TableauEventHandler(this.rectSelectBtn.get_element().get(0), this._makeTouchSpec$2(this.rectSelectBtn));
            this._inputHandlers$2[this.appendSelectBtn] = new spiff.TableauEventHandler(this.appendSelectBtn.get_element().get(0), this._makeTouchSpec$2(this.appendSelectBtn));
        }
        this._inputHandlers$2[this.zoomHomeBtn] = new spiff.TableauEventHandler(this.zoomHomeBtn.get_element().get(0), this._makeTouchSpec$2(this.zoomHomeBtn));
        if (this.flyOutBtn != null) {
            this.flyOutBtn.add_click(ss.Delegate.create(this, this.showFlyout));
            this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this.flyOutBtn.remove_click(ss.Delegate.create(this, this.showFlyout));
            })));
            this._inputHandlers$2[this.flyOutBtn] = new spiff.TableauEventHandler(this.flyOutBtn.get_element().get(0), this._makeTouchSpec$2(this.flyOutBtn));
        }
        if (this.appendSelectBtn != null) {
            this.appendSelectBtn.add_click(ss.Delegate.create(this, this._onAppendClicked$2));
            this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this.appendSelectBtn.remove_click(ss.Delegate.create(this, this._onAppendClicked$2));
            })));
        }
        if (this.singleSelectBtn != null) {
            this.singleSelectBtn.add_click(ss.Delegate.create(this, this._onSingleClicked$2));
            this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this.singleSelectBtn.remove_click(ss.Delegate.create(this, this._onSingleClicked$2));
            })));
        }
    },
    
    updateButtonState: function tab_FloatingZoomToolbarMobile$updateButtonState(mode, isSelected) {
        tab.FloatingZoomToolbarMobile.callBaseMethod(this, 'updateButtonState', [ mode, isSelected ]);
        if (this.flyOutBtn == null) {
            return;
        }
        switch (mode) {
            case 'pan':
                this._updateFlyOutBtnState$2('buttonPan', isSelected);
                break;
            case 'singleSelect':
                this.selectButton(this.singleSelectBtn, isSelected);
                this._updateFlyOutBtnState$2('buttonSingleSelect', isSelected);
                break;
            case 'rectSelect':
                this._updateFlyOutBtnState$2('buttonRectSelect', isSelected);
                break;
            case 'radialSelect':
                this._updateFlyOutBtnState$2('buttonRadialSelect', isSelected);
                break;
            case 'lassoSelect':
                this._updateFlyOutBtnState$2('buttonLassoSelect', isSelected);
                break;
            default:
                break;
        }
    },
    
    toolModeChanged: function tab_FloatingZoomToolbarMobile$toolModeChanged(oldMode) {
        if (this.get_currentToolMode() === 'pan') {
            this._isAppending$2 = false;
            this.api.setAppendMode(this._isAppending$2);
            this._updateAppendBtnState$2();
        }
        tab.FloatingZoomToolbarMobile.callBaseMethod(this, 'toolModeChanged', [ oldMode ]);
    },
    
    _updateFlyOutBtnState$2: function tab_FloatingZoomToolbarMobile$_updateFlyOutBtnState$2(klass, isSelected) {
        if (this.flyOutBtn != null) {
            if (this._isAppending$2 && isSelected) {
                this.flyOutBtn.get_element().addClass('append');
            }
            else {
                this.flyOutBtn.get_element().removeClass('append');
            }
            var child = this.flyOutBtn.get_element().children();
            if (isSelected) {
                child.addClass(klass);
            }
            else if (child.hasClass(klass)) {
                child.removeClass(klass);
            }
        }
    },
    
    _onAppendClicked$2: function tab_FloatingZoomToolbarMobile$_onAppendClicked$2() {
        this._isAppending$2 = !this._isAppending$2;
        this.api.setAppendMode(this._isAppending$2);
        this._updateAppendBtnState$2();
        this.updateButtonState(this.get_currentToolMode(), true);
        this.updateFlyOutVisibility(false);
    },
    
    _updateAppendBtnState$2: function tab_FloatingZoomToolbarMobile$_updateAppendBtnState$2() {
        if (this.appendSelectBtn != null) {
            this.appendSelectBtn.set_selected(this._isAppending$2);
        }
    },
    
    _onSingleClicked$2: function tab_FloatingZoomToolbarMobile$_onSingleClicked$2() {
        this.setToolMode('singleSelect', false);
    },
    
    _makeTouchSpec$2: function tab_FloatingZoomToolbarMobile$_makeTouchSpec$2(btn) {
        var spec = spiff.$create_EventHandleSpec();
        spec.firstTouch = ss.Delegate.create(this, function(e) {
            this._onTouchDown$2(btn, e);
        });
        spec.lastTouch = ss.Delegate.create(this, function(e) {
            this._onTouchUp$2(btn, e);
        });
        spec.potentialTap = ss.Delegate.create(this, function(e) {
            this._cancelEvent$2(e);
        });
        spec.potentialPress = ss.Delegate.create(this, function(e) {
            this._cancelEvent$2(e);
        });
        spec.press = ss.Delegate.create(this, function(e) {
            this._cancelEvent$2(e);
        });
        spec.touchMove = ss.Delegate.create(this, function(e) {
            this._cancelEvent$2(e);
        });
        return spec;
    },
    
    _cancelEvent$2: function tab_FloatingZoomToolbarMobile$_cancelEvent$2(pseudoEvent) {
        pseudoEvent.preventDefault();
        pseudoEvent.stopPropagation();
    },
    
    _onTouchDown$2: function tab_FloatingZoomToolbarMobile$_onTouchDown$2(btn, pseudoEvent) {
        this.api.anyButtonTouched();
        btn.get_element().addClass('pressed');
        this._cancelEvent$2(pseudoEvent);
    },
    
    _onTouchUp$2: function tab_FloatingZoomToolbarMobile$_onTouchUp$2(btn, pseudoEvent) {
        btn.get_element().removeClass('pressed');
        this._cancelEvent$2(pseudoEvent);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.HorizontalSliderMobile

tab.HorizontalSliderMobile = function tab_HorizontalSliderMobile(sliderParams, sliderDiv) {
    tab.HorizontalSliderMobile.initializeBase(this, [ sliderParams, sliderDiv ]);
}
tab.HorizontalSliderMobile.prototype = {
    
    postCreate: function tab_HorizontalSliderMobile$postCreate() {
        this.inherited(arguments);
        this._movable.destroy();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tableau.mobile.widget.ui.SliderDojoMobile

tableau.mobile.widget.ui.SliderDojoMobile = function tableau_mobile_widget_ui_SliderDojoMobile(sliderParams, sliderDiv) {
    tableau.mobile.widget.ui.SliderDojoMobile.initializeBase(this, [ sliderParams, sliderDiv ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParameterControlMobile

tab.ParameterControlMobile = function tab_ParameterControlMobile(oProps) {
    this.templateString = "<div class='MobilePanel ParameterControl'>" + "<div class='MobilePanelBox ParameterControlBox' dojoAttachPoint='domBox'>" + "<div class='TitleAndControls' dojoAttachPoint='domControls'>" + "<div class='ParamTitle' dojoAttachPoint='domTitleBar'></div>" + '</div>' + "<div class='PCContent' dojoAttachPoint='domContent'></div>" + '</div>' + "<div class='MobilePanelBorderOuter'><div class='MobilePanelBorderInner'></div></div>" + '</div>';
    tab.ParameterControlMobile.initializeBase(this, [ oProps ]);
}
tab.ParameterControlMobile.prototype = {
    
    getTypeInParamClass: function tab_ParameterControlMobile$getTypeInParamClass() {
        return tableau.mobile.widget.paramui.TypeIn;
    },
    
    getTypeInDateFieldParamClass: function tab_ParameterControlMobile$getTypeInDateFieldParamClass() {
        return tableau.mobile.widget.paramui.TypeIn;
    },
    
    getCompactParamClass: function tab_ParameterControlMobile$getCompactParamClass() {
        return tableau.mobile.widget.paramui.Compact;
    },
    
    getListParamClass: function tab_ParameterControlMobile$getListParamClass() {
        return tableau.mobile.widget.paramui.List;
    },
    
    getSliderParamClass: function tab_ParameterControlMobile$getSliderParamClass() {
        return tableau.mobile.widget.paramui.Slider;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParamUITypeInMobile

tab.ParamUITypeInMobile = function tab_ParamUITypeInMobile(parent, div, field, attrs, parameterViewModel) {
    tab.ParamUITypeInMobile.initializeBase(this, [ parent, div, field, attrs, parameterViewModel ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.ParamUITypeInMobile.prototype = {
    domNode: null,
    domBox: null,
    widget: null,
    mode: null,
    _inplaceMobile$2: null,
    
    get_inplaceMobile: function tab_ParamUITypeInMobile$get_inplaceMobile() {
        return this._inplaceMobile$2;
    },
    set_inplaceMobile: function tab_ParamUITypeInMobile$set_inplaceMobile(value) {
        this._inplaceMobile$2 = value;
        return value;
    },
    
    get_popup: function tab_ParamUITypeInMobile$get_popup() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_ParamUITypeInMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_ParamUITypeInMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBoxElement() : this.domBox;
    },
    
    instantiate: function tab_ParamUITypeInMobile$instantiate(isUpdate) {
        this.div.innerHTML = '<span>' + tableau.format.escapeHTML(this.get_legacyModel().alias) + '</span>';
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this._createPopup$2(isUpdate);
    },
    
    _createPopup$2: function tab_ParamUITypeInMobile$_createPopup$2(isUpdate) {
        var popupParams = {};
        popupParams.pattern = this.get_legacyModel().alias;
        popupParams.datavalue = this.get_legacyModel().value;
        popupParams.isListDomain = this.get_legacyModel().is_list_domain;
        popupParams.domain = this.get_legacyModel().domain;
        popupParams.title = this.get_legacyModel().title;
        popupParams.numberFormat = this.get_legacyModel().format;
        popupParams.type = 'TypeIn';
        popupParams.options = false;
        popupParams.lessMore = false;
        popupParams.search = false;
        popupParams.mode = this.mode;
        popupParams.qf = this.parent;
        this.get_inplaceMobile().createPopup(tableau.mobile.widget.catmode.popup.PatternPopup, popupParams);
        this.get_inplaceMobile().connectPopup();
        if (!isUpdate) {
            this.get_popup().patternWidget.add_updatePattern(ss.Delegate.create(this, this.updateFromPopup));
            this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                if (ss.isValue(this.get_popup())) {
                    this.get_popup().patternWidget.remove_updatePattern(ss.Delegate.create(this, this.updateFromPopup));
                }
            })));
        }
    },
    
    setNewState: function tab_ParamUITypeInMobile$setNewState() {
        this.instantiate(true);
    },
    
    get_uniqueNodeId: function tab_ParamUITypeInMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    destroy: function tab_ParamUITypeInMobile$destroy() {
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
        this.inherited(arguments);
    },
    
    updateFromPopup: function tab_ParamUITypeInMobile$updateFromPopup(newVal) {
        ++this.parent.stateId;
        tab.ParameterServerCommands.setParameterValue(this.field, newVal, !this.get_popup().patternWidget.isLocalized(), ss.Delegate.create(this, this._successCallback$2), ss.Delegate.create(this, this._errorCallback$2));
    },
    
    _errorCallback$2: function tab_ParamUITypeInMobile$_errorCallback$2(e) {
        this.widget.queryBox.value = this.get_legacyModel().alias;
    },
    
    _successCallback$2: function tab_ParamUITypeInMobile$_successCallback$2(data) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParamUICompactMobile

tab.ParamUICompactMobile = function tab_ParamUICompactMobile(parent, div, field, attrs, parameterViewModel) {
    tab.ParamUICompactMobile.initializeBase(this, [ parent, div, field, attrs, parameterViewModel ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.ParamUICompactMobile.prototype = {
    _t$2: null,
    domNode: null,
    domBox: null,
    _inplaceMobile$2: null,
    
    get_inplaceMobile: function tab_ParamUICompactMobile$get_inplaceMobile() {
        return this._inplaceMobile$2;
    },
    set_inplaceMobile: function tab_ParamUICompactMobile$set_inplaceMobile(value) {
        this._inplaceMobile$2 = value;
        return value;
    },
    
    get_popup: function tab_ParamUICompactMobile$get_popup() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_ParamUICompactMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_ParamUICompactMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBoxElement() : this.domBox;
    },
    
    instantiate: function tab_ParamUICompactMobile$instantiate(isUpdate) {
        var itemHTML = [];
        var field = this.field;
        var current = this.get_legacyModel().alias;
        var getter = tableau.mobile.FilterItemMobile.getDropdownHtml;
        var aliasedDataValues = this.get_legacyModel().domain;
        var len = aliasedDataValues.length;
        for (var i = 0; i < len; i++) {
            if (current === aliasedDataValues[i]) {
                var id = ([ field, '_', i.toString() ]).join('');
                itemHTML.add(getter(id, aliasedDataValues[i]));
            }
        }
        this.div.innerHTML = itemHTML.join('');
        this._t$2 = [];
        var domLen = this.get_legacyModel().domain.length;
        for (var j = 0; j < domLen; j++) {
            this._t$2.push(tab.$create_TupleStruct(this.get_legacyModel().domain[j], this.get_legacyModel().domain[j] === current, null));
        }
        if (!isUpdate) {
            this.get_inplaceMobile().setupTouchHandler(this.div);
            this._createPopup$2(this._t$2);
        }
    },
    
    _createPopup$2: function tab_ParamUICompactMobile$_createPopup$2(items) {
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.listItems = items;
        popupParams.listParams.isMultiValue = false;
        popupParams.title = this.get_legacyModel().title;
        popupParams.options = false;
        popupParams.lessMore = false;
        popupParams.search = false;
        popupParams.mode = 'compact';
        popupParams.qf = this.parent;
        this.get_inplaceMobile().createPopup(tableau.mobile.widget.catmode.popup.ListPopup, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get_popup().get_list().add_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get_popup().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$2));
        })));
    },
    
    get_uniqueNodeId: function tab_ParamUICompactMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    setNewState: function tab_ParamUICompactMobile$setNewState() {
        this.instantiate(true);
    },
    
    _applyChangesToItem$2: function tab_ParamUICompactMobile$_applyChangesToItem$2(changedItemList, listIndex) {
        if (!changedItemList.length) {
            return;
        }
        var target = changedItemList[0];
        var aliases = this.get_legacyModel().domain;
        if (target.rowIndex >= aliases.length || target.rowIndex < 0 || tab.MiscUtil.isNullOrEmpty(aliases)) {
            return;
        }
        var newAlias = this.get_legacyModel().domain[target.rowIndex];
        ++this.parent.stateId;
        tab.ParameterServerCommands.setParameterValue(this.field, newAlias);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParamUIListMobile

tab.ParamUIListMobile = function tab_ParamUIListMobile(parent, div, field, attrs, parameterViewModel) {
    tab.ParamUIListMobile.initializeBase(this, [ parent, div, field, attrs, parameterViewModel ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.ParamUIListMobile.prototype = {
    touchHandler: null,
    _t$2: null,
    _contentNode$2: null,
    _iscroller$2: null,
    _inplaceMobile$2: null,
    domNode: null,
    domBox: null,
    
    get_inplaceMobile: function tab_ParamUIListMobile$get_inplaceMobile() {
        return this._inplaceMobile$2;
    },
    set_inplaceMobile: function tab_ParamUIListMobile$set_inplaceMobile(value) {
        this._inplaceMobile$2 = value;
        return value;
    },
    
    get_uniqueNodeId: function tab_ParamUIListMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    get_domNodeElement: function tab_ParamUIListMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_ParamUIListMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBoxElement() : this.domBox;
    },
    
    instantiate: function tab_ParamUIListMobile$instantiate(isUpdate) {
        var itemHTML = [];
        var fieldLoc = this.field;
        var current = this.get_legacyModel().alias;
        var getter = tableau.mobile.FilterItemMobile.getRadioHtml;
        var aliasedDataValues = this.get_legacyModel().domain;
        var len = aliasedDataValues.length;
        for (var i = 0; i < len; i++) {
            var id = ([ fieldLoc, '_', i.toString() ]).join('');
            itemHTML.add(getter(id, aliasedDataValues[i], current === aliasedDataValues[i]));
        }
        if (!isUpdate) {
            this._contentNode$2 = document.createElement('div');
            this.div.appendChild(this._contentNode$2);
        }
        dojo.style(this.div, 'overflow', 'hidden');
        this._contentNode$2.innerHTML = itemHTML.join('');
        this._t$2 = [];
        var domLen = this.get_legacyModel().domain.length;
        for (var j = 0; j < domLen; j++) {
            this._t$2.push(tab.$create_TupleStruct(this.get_legacyModel().domain[j], this.get_legacyModel().domain[j] === current, null));
        }
        if (!isUpdate) {
            this.get_inplaceMobile().setupTouchHandler(this.div);
            this._createPopup$2(this._t$2);
        }
        this._iscroller$2 = new spiff.MobileScroller(this._contentNode$2, this.touchHandler, spiff.$create_MobileScrollerOptions());
    },
    
    layout: function tab_ParamUIListMobile$layout(contentSize) {
        dojo.marginBox(this.div, contentSize);
        if (ss.isValue(this._iscroller$2)) {
            this._iscroller$2.refresh();
        }
    },
    
    _createPopup$2: function tab_ParamUIListMobile$_createPopup$2(items) {
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.listItems = items;
        popupParams.listParams.isMultiValue = false;
        popupParams.title = this.get_legacyModel().title;
        popupParams.options = false;
        popupParams.lessMore = false;
        popupParams.search = false;
        popupParams.mode = 'compact';
        popupParams.qf = this.parent;
        this.get_inplaceMobile().createPopup(tableau.mobile.widget.catmode.popup.ListPopup, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get_inplaceMobile().get_popup().get_list().add_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$2));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get_inplaceMobile().get_popup().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$2));
        })));
    },
    
    setNewState: function tab_ParamUIListMobile$setNewState() {
        this.instantiate(true);
    },
    
    _applyChangesToItem$2: function tab_ParamUIListMobile$_applyChangesToItem$2(changedItemList, listIndex) {
        if (!changedItemList.length) {
            return;
        }
        var target = changedItemList[0];
        var newAlias = this.get_legacyModel().domain[target.rowIndex];
        ++this.parent.stateId;
        tab.ParameterServerCommands.setParameterValue(this.field, newAlias);
    },
    
    destroy: function tab_ParamUIListMobile$destroy() {
        tab.ParamUIListMobile.callBaseMethod(this, 'destroy');
        this._iscroller$2.dispose();
        this.dispose();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ParamUISliderMobile

tab.ParamUISliderMobile = function tab_ParamUISliderMobile(parent, div, field, attrs, parameterViewModel) {
    tab.ParamUISliderMobile.initializeBase(this, [ parent, div, field, attrs, parameterViewModel ]);
    this._inplaceMobile$3 = new tab.InplaceMobilePopup(this);
}
tab.ParamUISliderMobile.prototype = {
    _popupDisposables$3: null,
    _numValues$3: 0,
    _current$3: null,
    currentValue: 0,
    domNode: null,
    domBox: null,
    isPercentageMode: false,
    _inplaceMobile$3: null,
    
    get_popup: function tab_ParamUISliderMobile$get_popup() {
        return this._inplaceMobile$3.get_popup();
    },
    
    get_domNodeElement: function tab_ParamUISliderMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_ParamUISliderMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBoxElement() : this.domBox;
    },
    
    instantiate: function tab_ParamUISliderMobile$instantiate(isUpdate) {
        this.slider = new tableau.mobile.widget.ui.SliderMobile(this.div, this.attributes, false, null, ss.Delegate.create(this.parent, this.parent.getTitleOffset), ss.Delegate.create(this, this.getCurrentText), null, null, false);
        var d = this.get_legacyModel().domain;
        this._current$3 = this.get_legacyModel().alias;
        this._numValues$3 = 1;
        this.currentValue = 1;
        if (this.get_legacyModel().fake_continuous) {
            this.attributes['show-step-btns'] = 'false';
            this.attributes['show-ticks'] = 'false';
        }
        var iflist = ss.Delegate.create(this, function() {
            this.slider.instantiateFromDomain(d, this._current$3);
            this._numValues$3 = (this.slider).numValues;
            this.currentValue = (this.slider).currentlySelected;
        });
        var ifcontinuous = ss.Delegate.create(this, function() {
            this._numValues$3 = Number.POSITIVE_INFINITY;
            this.currentValue = this.modelValueOrRangeMin() * 100;
            this.attributes['show-step-btns'] = 'false';
            this.slider.instantiate(this._numValues$3, this.currentValue, this._current$3);
        });
        var ifdiscreteDate = ss.Delegate.create(this, function() {
            this._numValues$3 = this.numPeriods();
            this.currentValue = this.indexInDateRange(this.modelValueOrRangeMin());
            this._current$3 = this.formatValue(this.modelValueOrRangeMin());
            this.slider.instantiate(this._numValues$3, this.currentValue, this._current$3);
        });
        var ifdiscreteOther = ss.Delegate.create(this, function() {
            this._numValues$3 = this.sizeOfDiscreteRange();
            this.currentValue = this.indexInRange(this.modelValueOrRangeMin());
            this.slider.instantiate(this._numValues$3, this.currentValue, this._current$3);
        });
        this.behaviorPicker(iflist, ifcontinuous, ifdiscreteDate, ifdiscreteOther);
        this._inplaceMobile$3.setupTouchHandler(this.div);
        var initValues = {};
        if (!isFinite(this._numValues$3)) {
            initValues.length = 101;
            this.isPercentageMode = true;
        }
        else {
            initValues.length = this._numValues$3;
            this.isPercentageMode = false;
        }
        initValues.currentValue = this.currentValue;
        initValues.isPercentageMode = this.isPercentageMode;
        initValues.initialText = this._current$3;
        this._createPopup$3(initValues);
    },
    
    _createPopup$3: function tab_ParamUISliderMobile$_createPopup$3(initValues) {
        var popupParams = {};
        popupParams.attributes = this.attributes;
        popupParams.initValues = initValues;
        popupParams.title = this.get_legacyModel().title;
        popupParams.options = true;
        popupParams.lessMore = true;
        popupParams.search = true;
        popupParams.mode = 'slider';
        popupParams.qf = this.parent;
        this._inplaceMobile$3.createPopup(tableau.mobile.widget.catmode.popup.CategoricalSliderPopup, popupParams);
        this._inplaceMobile$3.connectPopup();
        if (ss.isValue(this._popupDisposables$3)) {
            this._popupDisposables$3.dispose();
        }
        this._popupDisposables$3 = new tab.DisposableHolder();
        this.get_popup().add_onPopupSliderChange(ss.Delegate.create(this, this._onPopupSliderChange$3));
        this._popupDisposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get_popup().remove_onPopupSliderChange(ss.Delegate.create(this, this._onPopupSliderChange$3));
        })));
    },
    
    get_uniqueNodeId: function tab_ParamUISliderMobile$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    _onPopupSliderChange$3: function tab_ParamUISliderMobile$_onPopupSliderChange$3(index, propogate) {
        var readoutText = this.getCurrentText(index);
        this.get_popup().updateReadout(readoutText);
        if (!!propogate) {
            this.doUpdateViz(index);
        }
    },
    
    applyChangesToItem: function tab_ParamUISliderMobile$applyChangesToItem(changedItemList, rowNum, listIndex) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PendingChangesManagerMobile

tab.PendingChangesManagerMobile = function tab_PendingChangesManagerMobile(parent, domainActualSize, exclusive, isAll) {
    tab.PendingChangesManagerMobile.initializeBase(this, [ parent, domainActualSize, exclusive, isAll ]);
}
tab.PendingChangesManagerMobile.prototype = {
    _list$1: null,
    
    handleMobileItemClicked: function tab_PendingChangesManagerMobile$handleMobileItemClicked(index, curList) {
        this._list$1 = curList;
        this.handleItemClicked(index, null);
    },
    
    hasAllItem: function tab_PendingChangesManagerMobile$hasAllItem() {
        return this._listHasAll$1() || tab.PendingChangesManagerMobile.callBaseMethod(this, 'hasAllItem');
    },
    
    hasItemAtIndex: function tab_PendingChangesManagerMobile$hasItemAtIndex(index) {
        return index < this.domainActualSize && ss.isValue(this.parent.fetchChildNodeByIndex(index));
    },
    
    setAllItemChecked: function tab_PendingChangesManagerMobile$setAllItemChecked(isChecked) {
        if (this._listHasAll$1()) {
            this._list$1.setSelectedAtIndex(tab.FilterItemUtil.allItemIndex, isChecked);
        }
        tab.PendingChangesManagerMobile.callBaseMethod(this, 'setAllItemChecked', [ isChecked ]);
    },
    
    setChecked: function tab_PendingChangesManagerMobile$setChecked(index, isChecked) {
        tab.PendingChangesManagerMobile.callBaseMethod(this, 'setChecked', [ index, isChecked ]);
        this._list$1.setSelectedAtIndex(index, isChecked);
    },
    
    togglePendingCss: function tab_PendingChangesManagerMobile$togglePendingCss(index) {
        tab.PendingChangesManagerMobile.callBaseMethod(this, 'togglePendingCss', [ index ]);
        this._list$1.togglePendingAtIndex(index);
    },
    
    isChecked: function tab_PendingChangesManagerMobile$isChecked(index) {
        var item = this._list$1.getRowAtIndex(index);
        if (ss.isValue(item)) {
            return this._list$1.isSelectedRow(item);
        }
        return tab.PendingChangesManagerMobile.callBaseMethod(this, 'isChecked', [ index ]);
    },
    
    _listHasAll$1: function tab_PendingChangesManagerMobile$_listHasAll$1() {
        return ss.isValue(this._list$1.getRowAtIndex(tab.FilterItemUtil.allItemIndex));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PopupFactory

tab.PopupFactory = function tab_PopupFactory() {
}
tab.PopupFactory.prototype = {
    
    getPopupObject: function tab_PopupFactory$getPopupObject(popupKlass, popupParams, srcRefNode) {
        var obj = this.getFromArray(popupKlass, srcRefNode);
        if (obj == null) {
            obj = new popupKlass(popupParams, srcRefNode);
            obj.startup();
            var item = {};
            item.popupObject = obj;
            item.div = srcRefNode;
            item.className = popupKlass;
            tab.PopupFactory._popupObjectArray.push(item);
        }
        else {
            if ((typeof(obj.update) === 'function')) {
                obj.update(popupParams);
            }
        }
        return obj;
    },
    
    getFromArray: function tab_PopupFactory$getFromArray(popupClass, parentDiv) {
        for (var i = 0; i < tab.PopupFactory._popupObjectArray.length; i++) {
            if (tab.PopupFactory._popupObjectArray[i].div === parentDiv) {
                if (tab.PopupFactory._popupObjectArray[i].className !== popupClass) {
                    this.removePopup(tab.PopupFactory._popupObjectArray[i].popupObject);
                    return null;
                }
                else {
                    return tab.PopupFactory._popupObjectArray[i].popupObject;
                }
            }
        }
        return null;
    },
    
    removeObject: function tab_PopupFactory$removeObject(obj) {
        for (var i = 0; i < tab.PopupFactory._popupObjectArray.length; i++) {
            if (tab.PopupFactory._popupObjectArray[i].popupObject === obj) {
                return tab.PopupFactory._popupObjectArray.splice(i, 1);
            }
        }
        return null;
    },
    
    removePopup: function tab_PopupFactory$removePopup(basePopupObj) {
        var obj = this.removeObject(basePopupObj);
        if (ss.isValue(obj) && ss.isValue(obj[0])) {
            obj[0].popupObject.destroyRecursive(false);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeDateFilterMobile

tab.QuantitativeDateFilterMobile = function tab_QuantitativeDateFilterMobile(props) {
    this._showFullDateTimes$4 = tab.DateTimeAutoFormatMode.showDateOnly;
    tab.QuantitativeDateFilterMobile.initializeBase(this, [ props ]);
}
tab.QuantitativeDateFilterMobile.prototype = {
    
    showFullDateTimes: function tab_QuantitativeDateFilterMobile$showFullDateTimes(dateFormat, val) {
        this._showFullDateTimes$4 = tab.QuantitativeDateFilter.getDateTimeFormatMode([this.oCurrentMin, this.oCurrentMax, this.oRangeMin, this.oRangeMax, val], this.get_presModel().aggregation, dateFormat, this._showFullDateTimes$4);
        return this._showFullDateTimes$4;
    },
    
    speciallyFormatDataValueForQuantitativeQF: function tab_QuantitativeDateFilterMobile$speciallyFormatDataValueForQuantitativeQF(val) {
        return tableau.format.formatDataValue(val, this.oFilter.role, this.oFilter.date_format, null, this.showFullDateTimes(this.oFilter.date_format, val));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeFilterMobile

tab.QuantitativeFilterMobile = function tab_QuantitativeFilterMobile(props) {
    tab.QuantitativeFilterMobile.initializeBase(this, [ props ]);
    this.templateString = tab.QuantitativeFilterMobile._mobileTemplateString$3;
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.QuantitativeFilterMobile.prototype = {
    parent: null,
    domBox: null,
    _disposables$3: null,
    classQFI_: 'QFMI_',
    div: null,
    qf: null,
    _inplaceMobile$3: null,
    
    get_inplaceMobile: function tab_QuantitativeFilterMobile$get_inplaceMobile() {
        return this._inplaceMobile$3;
    },
    set_inplaceMobile: function tab_QuantitativeFilterMobile$set_inplaceMobile(value) {
        this._inplaceMobile$3 = value;
        return value;
    },
    
    get__popup$3: function tab_QuantitativeFilterMobile$get__popup$3() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_QuantitativeFilterMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_QuantitativeFilterMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.domBox : this.domBox;
    },
    
    postCreate: function tab_QuantitativeFilterMobile$postCreate() {
        this.classQF = 'QFM';
        this.classQFButtonR = 'QFMButtonR';
        this.classQFDisabled = 'QFMDisabled';
        this.classQFCenterText = 'QFMCenterText';
        this.classQFHideSlider = 'QFMHideSlider';
        this.classQFHideReadout = 'QFMHideReadout';
        this._disposables$3 = new tab.DisposableHolder();
        this.timestamp = new Date().getTime();
        var title = tableau.format.formatColumnDisplayName(this.oFilter, false);
        dojo.attr(this.domTitleBar, 'title', title);
        this.updateTitleBar();
        this.initValues();
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this.createPopup(null);
    },
    
    layout: function tab_QuantitativeFilterMobile$layout() {
        var boundW, maxReadoutW = 200;
        if (this.hasCurrentMin()) {
            dojox.data.dom.textContent(this.domLowerText, this.getMinText());
            dojo.removeClass(this.domLowerText.parentNode, this.classQFDisabled);
        }
        else {
            dojox.data.dom.textContent(this.domLowerText, this.speciallyFormatDataValueForQuantitativeQF(this.oRangeMin));
            dojo.addClass(this.domLowerText.parentNode, this.classQFDisabled);
        }
        if (this.hasCurrentMax()) {
            dojox.data.dom.textContent(this.domUpperText, this.getMaxText());
            dojo.removeClass(this.domUpperText.parentNode, this.classQFDisabled);
        }
        else {
            dojox.data.dom.textContent(this.domUpperText, this.speciallyFormatDataValueForQuantitativeQF(this.oRangeMax));
            dojo.addClass(this.domUpperText.parentNode, this.classQFDisabled);
        }
        dojo.addClass(this.domNode, this.classQFHideButtons);
        dojo.removeClass(this.domNode, this.classQFCenterText);
        var oTitleBar = dojo.marginBox(this.domTitleBar);
        this.resetTitleSize();
        if (this.titleH > 0) {
            oTitleBar.h = this.titleH;
            dojo.marginBox(this.domTitleBar, { h: oTitleBar.h });
        }
        if (this.titleW > 0) {
            oTitleBar.w = this.titleW;
            dojo.marginBox(this.domTitleBar, { w: oTitleBar.w });
        }
        tableau.util.setupTitleEllipsis($(this.domTitleBar));
        var oZoneSize = dojo.contentBox(this.domNode);
        var notTitleSize = tab.$create_Size(oZoneSize.w, oZoneSize.h);
        if (!this.metricsOnly) {
            if (!this.hideEmptyTitlebar()) {
                if (this.titleW > 0) {
                    notTitleSize.w = oZoneSize.w - oTitleBar.w;
                    dojo.style(this.domContent, 'top', '');
                    dojo.style(this.domContent, 'left', oTitleBar.w + 'px');
                }
                else {
                    dojo.removeClass(this.domNode, this.classQFHideButtons);
                    notTitleSize.h = oZoneSize.h - oTitleBar.h;
                    dojo.style(this.domContent, 'top', oTitleBar.h + 'px');
                    dojo.style(this.domContent, 'left', '');
                }
            }
        }
        dojo.marginBox(this.domContent, tab.$create_Size(notTitleSize.w, notTitleSize.h));
        if (this.attributes['show-slider'] !== 'false' && this.attributes['show-readout'] !== 'false') {
            dojo.removeClass(this.domNode, this.classQFHideReadout);
            dojo.removeClass(this.domNode, this.classQFHideSlider);
            var twolineH = dojo.contentBox(this.domLowerBound).h + dojo.contentBox(this.domLowerImg).h + 8;
            if (notTitleSize.h < twolineH && notTitleSize.w > 200) {
                dojo.addClass(this.domNode, this.classQFCenterText);
                dojo.style(this.domLowerBound, 'width', '');
                dojo.style(this.domUpperBound, 'width', '');
                var lowerBoundNaturalWidth = this.contentBox(this.domLowerBound).w;
                var upperBoundNaturalWidth = this.contentBox(this.domUpperBound).w;
                dojo.style(this.domLowerBound, 'top', '2px');
                dojo.style(this.domUpperBound, 'top', '2px');
                var barW = ((((notTitleSize.w - (lowerBoundNaturalWidth + dojo.contentBox(this.domLowerImg).w)) - (upperBoundNaturalWidth + dojo.contentBox(this.domUpperImg).w)) - (2 * 8)) - 10);
                dojo.marginBox(this.domBar, { w: barW });
                dojo.style(this.domBar, 'top', '7px');
                dojo.style(this.domBar, 'left', (lowerBoundNaturalWidth + dojo.contentBox(this.domLowerImg).w + 4) + 'px');
            }
            else {
                boundW = Math.min(maxReadoutW, Math.floor((notTitleSize.w / 2) - 10));
                dojo.marginBox(this.domLowerBound, { w: boundW });
                dojo.marginBox(this.domUpperBound, { w: boundW });
                var off = this.domLowerBound.offsetTop + this.domLowerBound.offsetHeight;
                dojo.style(this.domBar, 'top', off + 'px');
                dojo.style(this.domBar, 'width', '');
                dojo.style(this.domBar, 'left', '');
            }
        }
        else if (this.attributes['show-slider'] !== 'false') {
            dojo.addClass(this.domNode, this.classQFHideReadout);
            dojo.removeClass(this.domNode, this.classQFHideSlider);
        }
        else if (this.attributes['show-readout'] !== 'false') {
            dojo.removeClass(this.domNode, this.classQFHideReadout);
            dojo.addClass(this.domNode, this.classQFHideSlider);
            boundW = Math.min(maxReadoutW, Math.floor((notTitleSize.w / 2) - 4));
            dojo.marginBox(this.domLowerBound, { w: boundW });
            dojo.marginBox(this.domUpperBound, { w: boundW });
        }
        else {
            dojo.addClass(this.domNode, this.classQFHideSlider);
            dojo.addClass(this.domNode, this.classQFHideReadout);
        }
        this.oMetrics.top = this.domBar.offsetTop;
        this.oMetrics.absOffset = this.domBar.offsetLeft;
        this.oMetrics.left = 0;
        this.oMetrics.right = this.domBar.offsetWidth;
        if (this.hasCurrentMin()) {
            dojo.style(this.domLowerImg, 'top', (this.oMetrics.top - 4) + 'px');
            dojo.style(this.domLowerImg, 'visibility', 'visible');
        }
        else {
            dojo.style(this.domLowerImg, 'visibility', 'hidden');
        }
        if (this.hasCurrentMax()) {
            dojo.style(this.domUpperImg, 'top', (this.oMetrics.top - 4) + 'px');
            dojo.style(this.domUpperImg, 'visibility', 'visible');
        }
        else {
            dojo.style(this.domUpperImg, 'visibility', 'hidden');
        }
        this.oMetrics.width = this.oMetrics.right - this.oMetrics.left;
        this.computePrecision(this.oMetrics.width);
        var showDataHighlight = (this.hasDataMin() || this.hasDataMax()) ? true : false;
        dojo.style(this.domHighlight, 'visibility', (showDataHighlight) ? 'visible' : 'hidden');
        this.updateUIByValue(this.getCurMin(), this.getCurMax());
        this.updateDomainButton();
    },
    
    dispose: function tab_QuantitativeFilterMobile$dispose() {
        this._disposables$3.dispose();
    },
    
    updateDomainButton: function tab_QuantitativeFilterMobile$updateDomainButton() {
        if (!!this.get__popup$3()) {
            this.get__popup$3().update(this.qf);
        }
    },
    
    clearDataRange: function tab_QuantitativeFilterMobile$clearDataRange() {
        if (this.hasDataMin()) {
            this.oDataMin.v = null;
        }
        if (this.hasDataMax()) {
            this.oDataMax.v = null;
        }
    },
    
    initValues: function tab_QuantitativeFilterMobile$initValues() {
        this.oRangeMin = dojo.mixin({}, this.oFilter.range.min);
        this.oRangeMax = dojo.mixin({}, this.oFilter.range.max);
        this.oDataMin = dojo.mixin({}, this.oFilter.data.min);
        this.oDataMax = dojo.mixin({}, this.oFilter.data.max);
        this.oCurrentMin = dojo.mixin({}, this.oFilter.table.min);
        if (!this.isRange()) {
            this.oCurrentMin = dojo.mixin({}, this.oFilter.range.min);
        }
        this.oCurrentMax = dojo.mixin({}, this.oFilter.table.max);
        if (!this.isRange()) {
            this.oCurrentMax = dojo.mixin({}, this.oFilter.range.max);
        }
        this.oMetrics = tab.$create_QFMetrics();
    },
    
    onUpdateFromPopup: function tab_QuantitativeFilterMobile$onUpdateFromPopup(lower, upper) {
        this.removeRangeOverride();
        this.updateUIByValue(lower, upper);
        this.notifyChange();
    },
    
    onUpdatePopupRange: function tab_QuantitativeFilterMobile$onUpdatePopupRange(minVal, maxVal) {
        this.applyQuantFilter(minVal, maxVal);
    },
    
    updateUIByValue: function tab_QuantitativeFilterMobile$updateUIByValue(lower, upper) {
        var lowerPos;
        var min = (this.hasCurrentMin() && ss.isValue(lower)) ? lower : -Number.MAX_VALUE;
        var max = (this.hasCurrentMax() && ss.isValue(upper)) ? upper : Number.MAX_VALUE;
        var vT;
        if (min > max) {
            vT = min;
            min = max;
            max = vT;
        }
        this.removeRangeOverride();
        if (this.hasCurrentMin() && !isNaN(min)) {
            this.setMinValue(min);
        }
        if (this.hasCurrentMax() && !isNaN(max)) {
            this.setMaxValue(max);
        }
        var range = this.getRange();
        lowerPos = this.oMetrics.left;
        if (this.hasCurrentMin()) {
            var lowerOffset = (ss.isValue(range) && !tab.FloatUtil.isEqual(range, 0)) ? Math.round((this.getCurMin() - this.getRangeMin()) * this.oMetrics.width / range) : 0;
            this.setLowerPos(this.oMetrics.left + lowerOffset);
            this.lastLowerOffset = this.domLowerImg.offsetLeft;
            dojo.style(this.domRange, 'left', (this.oMetrics.left + lowerOffset) + 'px');
            lowerPos = this.getLowerPos();
        }
        else {
            dojo.style(this.domRange, 'left', lowerPos + 'px');
        }
        if (this.hasCurrentMax()) {
            var rangeMin = (this.hasCurrentMin()) ? this.getCurMin() : this.getRangeMin();
            var rangeWidth = (ss.isValue(range) && !tab.FloatUtil.isEqual(range, 0)) ? Math.round((this.getCurMax() - rangeMin) * this.oMetrics.width / range) : this.oMetrics.width;
            this.setUpperPos(lowerPos + rangeWidth);
            this.lastUpperOffset = this.domUpperImg.offsetLeft;
            dojo.style(this.domRange, 'width', Math.max(rangeWidth, 0) + 'px');
        }
        else {
            dojo.style(this.domRange, 'width', Math.max(this.oMetrics.right - lowerPos, 0) + 'px');
        }
        this.updateDataBar();
    },
    
    updatePopup: function tab_QuantitativeFilterMobile$updatePopup() {
        var popupParams = {};
        popupParams.attributes = { rangeMin: { t: this.oRangeMin.t, v: this.getRangeMin(), s: this.oRangeMin.s }, rangeMax: { t: this.oRangeMax.t, v: this.getRangeMax(), s: this.oRangeMax.s }, dataMin: this.oDataMin, dataMax: this.oDataMax, currentMin: this.oCurrentMin, currentMax: this.oCurrentMax, showLeftHandle: this.hasCurrentMin(), showRightHandle: this.hasCurrentMax() };
        this.get__popup$3().updateData(popupParams);
    },
    
    createPopup: function tab_QuantitativeFilterMobile$createPopup(t) {
        var title = tableau.format.formatColumnDisplayName(this.oFilter, false);
        var attributes = { rangeMin: this.oRangeMin, rangeMax: this.oRangeMax, dataMin: this.oDataMin, dataMax: this.oDataMax, currentMin: this.oCurrentMin, currentMax: this.oCurrentMax, showLeftHandle: this.hasCurrentMin(), showRightHandle: this.hasCurrentMax() };
        var popupParams = {};
        popupParams.attributes = attributes;
        popupParams.oFilter = this.oFilter;
        popupParams.aggType = this.get_presModel().aggregation;
        popupParams.title = title;
        popupParams.options = true;
        popupParams.lessMore = true;
        popupParams.search = true;
        popupParams.mode = 'checklist';
        popupParams.qf = this;
        this.get_inplaceMobile().createPopup(tableau.mobile.widget.catmode.popup.QuantitativeSliderPopup, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get__popup$3().createControls();
        this.get__popup$3().add_onPopupSliderChange(ss.Delegate.create(this, this.onUpdateFromPopup));
        this.get__popup$3().add_onPopupSliderUpdateRange(ss.Delegate.create(this, this.onUpdatePopupRange));
        this.get__popup$3().add_setCurrentMinMax(ss.Delegate.create(this, this.setCurrentMinMax));
        this._disposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get__popup$3().remove_onPopupSliderChange(ss.Delegate.create(this, this.onUpdateFromPopup));
            this.get__popup$3().remove_onPopupSliderUpdateRange(ss.Delegate.create(this, this.onUpdatePopupRange));
            this.get__popup$3().remove_setCurrentMinMax(ss.Delegate.create(this, this.setCurrentMinMax));
        })));
    },
    
    onDestroy: function tab_QuantitativeFilterMobile$onDestroy() {
        this.dispose();
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
    },
    
    setCurrentMinMax: function tab_QuantitativeFilterMobile$setCurrentMinMax(min, max) {
        this.oCurrentMin.v = min;
        this.oCurrentMax.v = max;
        this.savePreviousMinAndMaxVals();
    },
    
    get_uniqueNodeId: function tab_QuantitativeFilterMobile$get_uniqueNodeId() {
        return this.id;
    },
    
    initFromState: function tab_QuantitativeFilterMobile$initFromState() {
        this.initValues();
        this.layout();
        this.updatePopup();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeSliderPopup

tab.QuantitativeSliderPopup = function tab_QuantitativeSliderPopup(parameters, srcRefNode) {
    this._aggType$2 = 'none';
    tab.QuantitativeSliderPopup.initializeBase(this);
    this.oFilter = parameters.oFilter;
    this.attributes = parameters.attributes;
    this.set_title(parameters.title);
    this._disposables$2 = new tab.DisposableHolder();
    var rangeMinDict = this.attributes['rangeMin'];
    this.typeOfData = rangeMinDict['t'];
    this._aggType$2 = parameters.aggType;
}
tab.QuantitativeSliderPopup.prototype = {
    attributes: null,
    _disposables$2: null,
    doubleSlider: null,
    quantReadouts: null,
    domNode: null,
    oFilter: null,
    typeOfData: null,
    
    add_onPopupSliderUpdateRange: function tab_QuantitativeSliderPopup$add_onPopupSliderUpdateRange(value) {
        this.__onPopupSliderUpdateRange$2 = ss.Delegate.combine(this.__onPopupSliderUpdateRange$2, value);
    },
    remove_onPopupSliderUpdateRange: function tab_QuantitativeSliderPopup$remove_onPopupSliderUpdateRange(value) {
        this.__onPopupSliderUpdateRange$2 = ss.Delegate.remove(this.__onPopupSliderUpdateRange$2, value);
    },
    
    __onPopupSliderUpdateRange$2: null,
    
    add_onPopupSliderChange: function tab_QuantitativeSliderPopup$add_onPopupSliderChange(value) {
        this.__onPopupSliderChange$2 = ss.Delegate.combine(this.__onPopupSliderChange$2, value);
    },
    remove_onPopupSliderChange: function tab_QuantitativeSliderPopup$remove_onPopupSliderChange(value) {
        this.__onPopupSliderChange$2 = ss.Delegate.remove(this.__onPopupSliderChange$2, value);
    },
    
    __onPopupSliderChange$2: null,
    
    add_setCurrentMinMax: function tab_QuantitativeSliderPopup$add_setCurrentMinMax(value) {
        this.__setCurrentMinMax$2 = ss.Delegate.combine(this.__setCurrentMinMax$2, value);
    },
    remove_setCurrentMinMax: function tab_QuantitativeSliderPopup$remove_setCurrentMinMax(value) {
        this.__setCurrentMinMax$2 = ss.Delegate.remove(this.__setCurrentMinMax$2, value);
    },
    
    __setCurrentMinMax$2: null,
    
    startup: function tab_QuantitativeSliderPopup$startup() {
        if (this.doubleSlider != null) {
            this.doubleSlider.startup();
        }
    },
    
    postCreate: function tab_QuantitativeSliderPopup$postCreate() {
        this.attributes['oFilter'] = this.oFilter;
        this.doubleSlider = new tableau.mobile.widget.catmode.popup.DoubleSlider(this.attributes);
        this.doubleSlider.placeAt(this.domContent, 'after');
        this.doubleSlider.setParent(this);
        this.quantReadouts = new tableau.mobile.widget.catmode.popup.QuantReadouts(this.oFilter, this.attributes['currentMin'], this.attributes['currentMax'], null, this._aggType$2);
        this.quantReadouts.placeAt(this.domContent, 'after');
        var bubbleUpdateRange = ss.Delegate.create(this, function(minVal, maxVal) {
            if (ss.isValue(this.__onPopupSliderUpdateRange$2)) {
                this.__onPopupSliderUpdateRange$2(minVal, maxVal);
            }
        });
        var bubbleOnPopupSliderChange = ss.Delegate.create(this, function(leftVal, rightVal) {
            if (ss.isValue(this.__onPopupSliderChange$2)) {
                this.__onPopupSliderChange$2(leftVal, rightVal);
            }
        });
        var bubbleSetCurrentMinMax = ss.Delegate.create(this, function(curMinVal, curMaxVal) {
            if (ss.isValue(this.__setCurrentMinMax$2)) {
                this.__setCurrentMinMax$2(curMinVal, curMaxVal);
            }
        });
        this.doubleSlider.add_updateLeftReadout(ss.Delegate.create(this, this._updateLeftReadout$2));
        this.doubleSlider.add_updateRightReadout(ss.Delegate.create(this, this._updateRightReadout$2));
        this.doubleSlider.add_onPopupSliderChange(bubbleOnPopupSliderChange);
        this.doubleSlider.add_setReadoutState(ss.Delegate.create(this, this._setReadoutState$2));
        this.doubleSlider.add_updateRange(bubbleUpdateRange);
        this.doubleSlider.add_setCurrentMinMax(bubbleSetCurrentMinMax);
        this.quantReadouts.add_onPopupReadoutChange(ss.Delegate.create(this, this.onPopupReadoutChange));
        this._disposables$2.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.doubleSlider.remove_updateLeftReadout(ss.Delegate.create(this, this._updateLeftReadout$2));
            this.doubleSlider.remove_updateRightReadout(ss.Delegate.create(this, this._updateRightReadout$2));
            this.doubleSlider.remove_onPopupSliderChange(bubbleOnPopupSliderChange);
            this.doubleSlider.remove_setReadoutState(ss.Delegate.create(this, this._setReadoutState$2));
            this.doubleSlider.remove_updateRange(bubbleUpdateRange);
            this.doubleSlider.remove_setCurrentMinMax(bubbleSetCurrentMinMax);
            this.quantReadouts.remove_onPopupReadoutChange(ss.Delegate.create(this, this.onPopupReadoutChange));
        })));
        dojo.addClass(this.domNode, 'Slider');
        this.inherited(arguments);
    },
    
    updateData: function tab_QuantitativeSliderPopup$updateData(parameters) {
        this.doubleSlider.updateData(parameters.attributes);
    },
    
    _updateLeftReadout$2: function tab_QuantitativeSliderPopup$_updateLeftReadout$2(text, type, state, precision) {
        this.quantReadouts.setMinValue(text, type, state, precision);
    },
    
    _updateRightReadout$2: function tab_QuantitativeSliderPopup$_updateRightReadout$2(text, type, state, precision) {
        this.quantReadouts.setMaxValue(text, type, state, precision);
    },
    
    _setReadoutState$2: function tab_QuantitativeSliderPopup$_setReadoutState$2(readout, state) {
        if (readout === 'left') {
            this.quantReadouts.setMinReadoutState(state);
        }
        else if (readout === 'right') {
            this.quantReadouts.setMaxReadoutState(state);
        }
    },
    
    onPopupReadoutChange: function tab_QuantitativeSliderPopup$onPopupReadoutChange(valLower, valUpper) {
        if (ss.isValue(this.__onPopupSliderChange$2)) {
            this.__onPopupSliderChange$2(valLower, valUpper);
        }
    },
    
    getContentDimensions: function tab_QuantitativeSliderPopup$getContentDimensions() {
        return tab.$create_Rect(0, 0, 0, 100);
    },
    
    destroy: function tab_QuantitativeSliderPopup$destroy() {
        this.doubleSlider.destroy();
        this.quantReadouts.destroy();
        this._disposables$2.dispose();
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantReadoutsMobile

tab.QuantReadoutsMobile = function tab_QuantReadoutsMobile(param, currentMin, currentMax, srcRefNode, aggTypeArg) {
    this.templateString = "<div class='QFPopupReadoutWrapper' dojoAttachPoint='_quantReadoutsWrapper'>" + "<div class='QFPopupReadout QFPopupLowerBound'" + " dojoAttachPoint='domLowerBound'>" + "<div class='readoutText' dojoAttachPoint='domLowerText'></div>" + "<input type='${inputType}' dojoAttachPoint='domLowerInput'></input></div>" + "<div class='QFPopupReadout QFPopupUpperBound'" + " dojoAttachPoint='domUpperBound'>" + "<div class='readoutText' dojoAttachPoint='domUpperText'></div>" + "<input type='${inputType}' dojoAttachPoint='domUpperInput'></input>" + '</div>' + "<a dojoAttachPoint='focusGrabber' href='#'></a>" + '</div>';
    this._showDateTimeMode$1 = tab.DateTimeAutoFormatMode.showDateOnly;
    this._aggType$1 = 'none';
    tab.QuantReadoutsMobile.initializeBase(this);
    this._oFilter$1 = param;
    this._oCurrentMax$1 = {};
    this._oCurrentMax$1.v = (ss.isValue(currentMax)) ? currentMax.v : 0;
    this._oCurrentMax$1.t = (ss.isValue(currentMax)) ? currentMax.t : '';
    this._oCurrentMin$1 = {};
    this._oCurrentMin$1.v = (ss.isValue(currentMin)) ? currentMin.v : 0;
    this._oCurrentMin$1.t = (ss.isValue(currentMin)) ? currentMin.t : '';
    this._aggType$1 = aggTypeArg;
    var monthOrYear = (this._aggType$1 === 'trunc-month' || this._aggType$1 === 'trunc-year');
    if (!monthOrYear && tab.QuantitativeDateFilter.isPureTime([this._oCurrentMin$1, this._oCurrentMax$1, param.range.min, param.range.max], this._aggType$1) && tab.BrowserSupport.get_timeInput()) {
        this.inputType = 'time';
    }
    else if (!monthOrYear && tab.FilterModel.isQuantitativeTimestampFilter(this._oFilter$1, this._oCurrentMin$1, this._oCurrentMax$1) && tab.BrowserSupport.get_dateTimeLocalInput()) {
        this.inputType = 'datetime-local';
    }
    else if (!monthOrYear && tab.FilterModel.isQuantitativeDateFilter(this._oFilter$1, this._oCurrentMin$1, this._oCurrentMax$1) && tab.BrowserSupport.get_dateInput()) {
        this.inputType = 'date';
    }
    else {
        this.inputType = 'text';
    }
}
tab.QuantReadoutsMobile.prototype = {
    widgetsInTemplate: true,
    domLowerInput: null,
    domUpperInput: null,
    domLowerText: null,
    domUpperText: null,
    domLowerBound: null,
    domUpperBound: null,
    focusGrabber: null,
    _oCurrentMax$1: null,
    _oCurrentMin$1: null,
    _precision$1: 5,
    _isLowerEnabled$1: true,
    _isUpperEnabled$1: true,
    _oFilter$1: null,
    _disposableEvtHandles$1: null,
    _inputTouchHandlerHandles$1: null,
    domNode: null,
    inputType: null,
    _editingFormat$1: null,
    
    add_onPopupReadoutChange: function tab_QuantReadoutsMobile$add_onPopupReadoutChange(value) {
        this.__onPopupReadoutChange$1 = ss.Delegate.combine(this.__onPopupReadoutChange$1, value);
    },
    remove_onPopupReadoutChange: function tab_QuantReadoutsMobile$remove_onPopupReadoutChange(value) {
        this.__onPopupReadoutChange$1 = ss.Delegate.remove(this.__onPopupReadoutChange$1, value);
    },
    
    __onPopupReadoutChange$1: null,
    
    get__editingFormat$1: function tab_QuantReadoutsMobile$get__editingFormat$1() {
        if (this._editingFormat$1 == null) {
            if (this.inputType === 'date') {
                this._editingFormat$1 = tableau.format.get_isO8601DateFormat();
            }
            else if (this.inputType === 'datetime-local') {
                this._editingFormat$1 = tableau.format.get_isO8601DateTimeFormat();
            }
            else if (this.inputType === 'time') {
                this._editingFormat$1 = tableau.format.get_isO8601TimeFormat();
            }
            else if (this._oCurrentMin$1.t === tableau.types.DataType.DT_DATE || this._oCurrentMin$1.t === tableau.types.DataType.DT_TIMESTAMP) {
                this._editingFormat$1 = this._oFilter$1.editing_format;
            }
            else {
                this._editingFormat$1 = tableau.format.deriveNumberEditingFormat(this._oFilter$1.format);
            }
        }
        return this._editingFormat$1;
    },
    
    get_precision: function tab_QuantReadoutsMobile$get_precision() {
        return this._precision$1;
    },
    set_precision: function tab_QuantReadoutsMobile$set_precision(value) {
        this._precision$1 = value;
        return value;
    },
    
    postCreate: function tab_QuantReadoutsMobile$postCreate() {
        this._inputTouchHandlerHandles$1 = new tab.DisposableHolder();
        var lowerInputTouchSpec = spiff.$create_EventHandleSpec();
        lowerInputTouchSpec.potentialTap = ss.Delegate.create(this, this.showLowerInput);
        this._inputTouchHandlerHandles$1.add(new spiff.TableauEventHandler(this.domLowerBound, lowerInputTouchSpec));
        var upperInputTouchSpec = spiff.$create_EventHandleSpec();
        upperInputTouchSpec.potentialTap = ss.Delegate.create(this, this.showUpperInput);
        this._inputTouchHandlerHandles$1.add(new spiff.TableauEventHandler(this.domUpperBound, upperInputTouchSpec));
        $(this.domLowerInput).change(ss.Delegate.create(this, function() {
            this._checkIfInputChanged$1(this.domLowerInput, this._oCurrentMin$1);
        }));
        $(this.domUpperInput).change(ss.Delegate.create(this, function() {
            this._checkIfInputChanged$1(this.domUpperInput, this._oCurrentMax$1);
        }));
    },
    
    _onGlobalTouchLower$1: function tab_QuantReadoutsMobile$_onGlobalTouchLower$1(e, cancelCallback) {
        this._onGlobalTouch$1(e, cancelCallback, ss.Delegate.create(this, this._hideLowerInput$1));
    },
    
    _onGlobalTouchUpper$1: function tab_QuantReadoutsMobile$_onGlobalTouchUpper$1(e, cancelCallback) {
        this._onGlobalTouch$1(e, cancelCallback, ss.Delegate.create(this, this._hideUpperInput$1));
    },
    
    _onGlobalTouch$1: function tab_QuantReadoutsMobile$_onGlobalTouch$1(e, cancelCallback, funcHide) {
        if (!(tab.DomUtil.isEqualOrAncestorOf(this.domLowerBound, e.target) || tab.DomUtil.isEqualOrAncestorOf(this.domUpperBound, e.target))) {
            funcHide(null);
            this._dismissVirtualKeyboard$1();
            cancelCallback(false);
        }
    },
    
    _dismissVirtualKeyboard$1: function tab_QuantReadoutsMobile$_dismissVirtualKeyboard$1() {
        this.focusGrabber.focus();
        document.activeElement.blur();
    },
    
    _selectAll$1: function tab_QuantReadoutsMobile$_selectAll$1(oInput) {
        tab.DomUtil.selectAllInputText(oInput);
        oInput.focus();
    },
    
    _setReadoutValue$1: function tab_QuantReadoutsMobile$_setReadoutValue$1(quantReadout, val) {
        var oOuter = $(quantReadout);
        var oReadout = oOuter.find('.readoutText');
        var oInput = oOuter.find('input');
        oReadout.text(this._speciallyFormatDataValueForQuantitativeQF$1(val, this._precision$1));
        var oldValue = oInput.val();
        var newValue = this._formatDataValueForEdit$1(val);
        if (oldValue !== newValue) {
            oInput.val(newValue);
            if (oOuter.hasClass('Editing')) {
                this._selectAll$1(oInput);
            }
        }
    },
    
    setMinValue: function tab_QuantReadoutsMobile$setMinValue(minVal, type, state, newPrecision) {
        this._oCurrentMin$1.v = minVal;
        this._oCurrentMin$1.t = type;
        if (!ss.isUndefined(state)) {
            this._oCurrentMin$1.s = state;
        }
        this.set_precision(newPrecision);
        this._setReadoutValue$1(this.domLowerBound, this._oCurrentMin$1);
    },
    
    setMaxValue: function tab_QuantReadoutsMobile$setMaxValue(maxValue, type, state, newPrecision) {
        this._oCurrentMax$1.v = maxValue;
        this._oCurrentMax$1.t = type;
        if (ss.isValue(state)) {
            this._oCurrentMax$1.s = state;
        }
        this.set_precision(newPrecision);
        this._setReadoutValue$1(this.domUpperBound, this._oCurrentMax$1);
    },
    
    showLowerInput: function tab_QuantReadoutsMobile$showLowerInput(e) {
        if (!this._isLowerEnabled$1) {
            return;
        }
        if (this._isUpperEnabled$1) {
            this._hideUpperInput$1(null);
        }
        this._showInput$1(e, this._oCurrentMin$1, this.domLowerInput, ss.Delegate.create(this, this._hideLowerInput$1), ss.Delegate.create(this, this._checkLowerEnter$1));
        spiff.GlobalTouchWatcher.add_firstTouch(ss.Delegate.create(this, this._onGlobalTouchLower$1));
    },
    
    showUpperInput: function tab_QuantReadoutsMobile$showUpperInput(e) {
        if (!this._isUpperEnabled$1) {
            return;
        }
        if (this._isLowerEnabled$1) {
            this._hideLowerInput$1(null);
        }
        this._showInput$1(e, this._oCurrentMax$1, this.domUpperInput, ss.Delegate.create(this, this._hideUpperInput$1), ss.Delegate.create(this, this._checkUpperEnter$1));
        spiff.GlobalTouchWatcher.add_firstTouch(ss.Delegate.create(this, this._onGlobalTouchUpper$1));
    },
    
    setMinReadoutState: function tab_QuantReadoutsMobile$setMinReadoutState(state) {
        if (!!state) {
            dojo.removeClass(this.domLowerText.parentNode, 'QFPopupDisabled');
            this._isLowerEnabled$1 = true;
        }
        else if (!state) {
            dojo.addClass(this.domLowerText.parentNode, 'QFPopupDisabled');
            this._isLowerEnabled$1 = false;
        }
    },
    
    setMaxReadoutState: function tab_QuantReadoutsMobile$setMaxReadoutState(state) {
        if (!!state) {
            dojo.removeClass(this.domUpperText.parentNode, 'QFPopupDisabled');
            this._isUpperEnabled$1 = true;
        }
        else if (!state) {
            dojo.addClass(this.domUpperText.parentNode, 'QFPopupDisabled');
            this._isUpperEnabled$1 = false;
        }
    },
    
    getMinText: function tab_QuantReadoutsMobile$getMinText(newPrecision) {
        return this._speciallyFormatDataValueForQuantitativeQF$1(this._oCurrentMin$1, newPrecision);
    },
    
    getMaxText: function tab_QuantReadoutsMobile$getMaxText(newPrecision) {
        return this._speciallyFormatDataValueForQuantitativeQF$1(this._oCurrentMax$1, newPrecision);
    },
    
    _speciallyFormatDataValueForQuantitativeQF$1: function tab_QuantReadoutsMobile$_speciallyFormatDataValueForQuantitativeQF$1(val, newPrecision) {
        var oF = this._oFilter$1;
        var format = (val.t === tableau.types.DataType.DT_TIMESTAMP || val.t === tableau.types.DataType.DT_DATE) ? oF.editing_format : oF.format;
        return tableau.format.formatDataValue(val, oF.role, format, newPrecision, this._showFullDateTimes$1(format, val));
    },
    
    _formatDataValueForEdit$1: function tab_QuantReadoutsMobile$_formatDataValueForEdit$1(val) {
        return tableau.format.formatDataValue(val, this._oFilter$1.role, this.get__editingFormat$1(), this._precision$1, this._showFullDateTimes$1(this.get__editingFormat$1(), val));
    },
    
    _showFullDateTimes$1: function tab_QuantReadoutsMobile$_showFullDateTimes$1(format, val) {
        this._showDateTimeMode$1 = tab.QuantitativeDateFilter.getDateTimeFormatMode([this._oCurrentMin$1, this._oCurrentMax$1, this._oFilter$1.range.min, this._oFilter$1.range.max, val], this._aggType$1, format, this._showDateTimeMode$1);
        return this._showDateTimeMode$1;
    },
    
    _showInput$1: function tab_QuantReadoutsMobile$_showInput$1(e, val, oInput, funcHide, funcKey) {
        var jqueryOInput = $(oInput);
        var parent = jqueryOInput.parent();
        if (parent.hasClass('Editing')) {
            return;
        }
        if (ss.isValue(e)) {
            e.stopPropagation();
            e.preventDefault();
        }
        this._disposableEvtHandles$1 = new tab.DisposableHolder();
        this._disposableEvtHandles$1.add(spiff.EventUtil.bindWithDispose(jqueryOInput, 'blur', funcHide));
        this._disposableEvtHandles$1.add(spiff.EventUtil.bindWithDispose(jqueryOInput, 'keypress', funcKey));
        jqueryOInput.val(this._formatDataValueForEdit$1(val));
        parent.addClass('Editing');
        this._selectAll$1(jqueryOInput);
    },
    
    _checkLowerEnter$1: function tab_QuantReadoutsMobile$_checkLowerEnter$1(e) {
        this._checkEnter$1(e, this.domLowerInput);
    },
    
    _checkUpperEnter$1: function tab_QuantReadoutsMobile$_checkUpperEnter$1(e) {
        this._checkEnter$1(e, this.domUpperInput);
    },
    
    _checkEnter$1: function tab_QuantReadoutsMobile$_checkEnter$1(e, oInput) {
        if (e.which === 13) {
            e.stopPropagation();
            e.preventDefault();
            oInput.blur();
        }
    },
    
    _hideLowerInput$1: function tab_QuantReadoutsMobile$_hideLowerInput$1(e) {
        spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this._onGlobalTouchLower$1));
        this._hideInput$1(e, this._oCurrentMin$1, this.domLowerInput);
    },
    
    _hideUpperInput$1: function tab_QuantReadoutsMobile$_hideUpperInput$1(e) {
        spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this._onGlobalTouchUpper$1));
        this._hideInput$1(e, this._oCurrentMax$1, this.domUpperInput);
    },
    
    _hideInput$1: function tab_QuantReadoutsMobile$_hideInput$1(e, oldDV, oInput) {
        this._checkIfInputChanged$1(oInput, oldDV);
        var parent = $(oInput).parent();
        if (!parent.hasClass('Editing')) {
            return;
        }
        parent.removeClass('Editing');
        if (ss.isValue(this._disposableEvtHandles$1)) {
            this._disposableEvtHandles$1.dispose();
        }
        if (ss.isValue(e)) {
            e.stopPropagation();
            e.preventDefault();
        }
    },
    
    _checkIfInputChanged$1: function tab_QuantReadoutsMobile$_checkIfInputChanged$1(input, oldDataValue) {
        var oldValue = $(input).text();
        var newValue = this._getValueFromInput$1(input, oldDataValue);
        var newDV = dojo.mixin({}, oldDataValue);
        if (isNaN(newValue)) {
            newValue = oldValue;
        }
        else {
            newDV.v = newValue;
            newValue = this._speciallyFormatDataValueForQuantitativeQF$1(newDV, null);
        }
        if (oldValue !== newValue.toString()) {
            $(input).siblings('.readoutText').text(newValue);
            var minVal = (this._isLowerEnabled$1) ? this._getValueFromInput$1(this.domLowerInput, this._oCurrentMin$1) : (-Number.MAX_VALUE);
            var maxVal = (this._isUpperEnabled$1) ? this._getValueFromInput$1(this.domUpperInput, this._oCurrentMax$1) : Number.MAX_VALUE;
            if (minVal > maxVal) {
                var vT = minVal;
                minVal = maxVal;
                maxVal = vT;
            }
            if (ss.isValue(this.__onPopupReadoutChange$1)) {
                this.__onPopupReadoutChange$1(minVal, maxVal);
            }
        }
    },
    
    _getValueFromInput$1: function tab_QuantReadoutsMobile$_getValueFromInput$1(oNode, oldValue) {
        return tableau.format.parseQuantitativeDataValue(oNode.value, oldValue.t, this.get__editingFormat$1(), this._showFullDateTimes$1(this.get__editingFormat$1()), oldValue);
    },
    
    destroy: function tab_QuantReadoutsMobile$destroy() {
        this._inputTouchHandlerHandles$1.dispose();
        if (ss.isValue(this._disposableEvtHandles$1)) {
            this._disposableEvtHandles$1.dispose();
        }
        spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this._onGlobalTouchLower$1));
        spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this._onGlobalTouchUpper$1));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RelativeDateFilterDialogMobile

tab.RelativeDateFilterDialogMobile = function tab_RelativeDateFilterDialogMobile(popupParams) {
    this.templateString = "<div class='RelativeDateFilterDialogMobile'>" + "<div class='RDFDMBody'>" + "<div class='RDFDMColumnWest RDFDMBorderRight' >" + "<div class='RDFDMButtonTapArea' dojoattachpoint='buttonYear' name='year'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel'>${buttonYearLabel}</span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='buttonQuarter' name='quarter'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel'>${buttonQuarterLabel}</span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='buttonMonth' name='month'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel'>${buttonMonthLabel}</span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='buttonWeek' name='week'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel'>${buttonWeekLabel}</span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='buttonDay' name='day'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel'>${buttonDayLabel}</span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='buttonHour' name='hour'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel'>${buttonHourLabel}</span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='buttonMinute' name='minute'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel'>${buttonMinuteLabel}</span>" + '</div>' + '</div>' + "<div class='RDFDMColumnEast'>" + "<div class='RDFDMButtonTapArea' dojoattachpoint='radioLast' name='last'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel' dojoattachpoint='textLast'></span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='radioCurr' name='curr'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel' dojoattachpoint='textCurr'></span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='radioNext' name='next'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel' dojoattachpoint='textNext'></span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='radioLastn' name='lastn'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel' dojoattachpoint='textLastn1'></span>" + "<span class='RDFDMInputWrapper'>" + "<input type='text' dojoattachpoint='inputLastn' value='3'" + "dojoattachevent='onkeyup:onTypingLast,onclick:setRLastn' />" + '</span>' + "<span class='RDFDMButtonLabel' dojoattachpoint='textLastn2'></span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='radioNextn' name='nextn'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel' dojoattachpoint='textNextn1'></span>" + "<span class='RDFDMInputWrapper'>" + "<input type='text' dojoattachpoint='inputNextn' value='3'" + "dojoattachevent='onkeyup:onTypingNext,onclick:setRNextn' />" + '</span>' + "<span class='RDFDMButtonLabel' dojoattachpoint='textNextn2'></span>" + '</div>' + "<div class='RDFDMButtonTapArea' dojoattachpoint='radioTodate' name='todate'>" + "<span class='RDFDMButtonCheckmark'></span>" + "<span class='RDFDMButtonLabel' dojoattachpoint='textTodate'></span>" + '</div>' + '</div>' + '</div>' + "<div class='RDFDMFooter'>" + "<span dojoattachpoint='domPreview'></span>" + '</div>' + '</div>';
    this._periodInputs$3 = [];
    this._rangeButtons$3 = [];
    this.buttonYearLabel = tab.Strings.RelDateFilterYears;
    this.buttonQuarterLabel = tab.Strings.RelDateFilterQuarters;
    this.buttonMonthLabel = tab.Strings.RelDateFilterMonths;
    this.buttonWeekLabel = tab.Strings.RelDateFilterWeeks;
    this.buttonDayLabel = tab.Strings.RelDateFilterDays;
    this.buttonHourLabel = tab.Strings.RelDateFilterHours;
    this.buttonMinuteLabel = tab.Strings.RelDateFilterMinutes;
    tab.RelativeDateFilterDialogMobile.initializeBase(this);
    this._subscriptions$3 = [];
    this._touchHandlers$3 = [];
}
tab.RelativeDateFilterDialogMobile.prototype = {
    widgetsInTemplate: true,
    session: null,
    field: '',
    stateId: 0,
    rid: 0,
    timestamp: 0,
    touchHandler: null,
    firstTouchOnMe: true,
    scaleFactor: 1,
    buttonYear: null,
    buttonQuarter: null,
    buttonMonth: null,
    buttonWeek: null,
    buttonDay: null,
    buttonHour: null,
    buttonMinute: null,
    radioLast: null,
    radioCurr: null,
    radioNext: null,
    radioLastn: null,
    radioNextn: null,
    domText: null,
    inputNextn: null,
    _subscriptions$3: null,
    _touchHandlers$3: null,
    getSID: null,
    
    postCreate: function tab_RelativeDateFilterDialogMobile$postCreate() {
        this.getSID = ss.Delegate.create(this, function() {
            return this.stateId;
        });
        if (!!this.oFilter.fy) {
            this.fy = this.oFilter.fy - 1;
        }
        if (!!this.oFilter.start_of_week) {
            this.startOfWeek = this.oFilter.start_of_week;
        }
        this.timestamp = new Date().getTime();
        this._rangeButtons$3 = [this.buttonYear, this.buttonQuarter, this.buttonMonth, this.buttonWeek, this.buttonDay];
        if (this.oFilter.noTime) {
            dojo.style(this.buttonHour, 'display', 'none');
            dojo.style(this.buttonMinute, 'display', 'none');
        }
        else {
            this._rangeButtons$3.push(this.buttonHour);
            this._rangeButtons$3.push(this.buttonMinute);
        }
        this._periodInputs$3 = [this.radioLast, this.radioCurr, this.radioNext, this.radioLastn, this.radioNextn, this.radioTodate];
        this._connectButtonsWithEventHandlers$3();
        this._initFromState$3();
        this.prepareToShow();
    },
    
    _connectButtonsWithEventHandlers$3: function tab_RelativeDateFilterDialogMobile$_connectButtonsWithEventHandlers$3() {
        var connectHelper = ss.Delegate.create(this, function(pair) {
            var config = spiff.$create_EventHandleSpec();
            config.potentialTap = function() {
                pair.second();
            };
            this._touchHandlers$3.push(new spiff.TableauEventHandler(pair.first, config));
        });
        var pairs = [ new ss.Tuple(this.buttonYear, ss.Delegate.create(this, this.setPYear)), new ss.Tuple(this.buttonQuarter, ss.Delegate.create(this, this.setPQuarter)), new ss.Tuple(this.buttonMonth, ss.Delegate.create(this, this.setPMonth)), new ss.Tuple(this.buttonWeek, ss.Delegate.create(this, this.setPWeek)), new ss.Tuple(this.buttonDay, ss.Delegate.create(this, this.setPDay)), new ss.Tuple(this.buttonHour, ss.Delegate.create(this, this.setPHour)), new ss.Tuple(this.buttonMinute, ss.Delegate.create(this, this.setPMinute)), new ss.Tuple(this.radioLast, ss.Delegate.create(this, this.setRLast)), new ss.Tuple(this.radioCurr, ss.Delegate.create(this, this.setRCurr)), new ss.Tuple(this.radioNext, ss.Delegate.create(this, this.setRNext)), new ss.Tuple(this.radioLastn, ss.Delegate.create(this, this.setRLastn)), new ss.Tuple(this.radioNextn, ss.Delegate.create(this, this.setRNextn)), new ss.Tuple(this.radioTodate, ss.Delegate.create(this, this.setRTodate)) ];
        var pairsCount = pairs.length;
        for (var i = 0; i < pairsCount; ++i) {
            connectHelper(pairs[i]);
        }
    },
    
    updateRangeButtons: function tab_RelativeDateFilterDialogMobile$updateRangeButtons(newPeriodType) {
        var len = this._rangeButtons$3.length;
        for (var i = 0; i < len; i++) {
            if (dojo.attr(this._rangeButtons$3[i], 'name') === newPeriodType) {
                dojo.addClass(this._rangeButtons$3[i], 'Selected');
                dojo.addClass($(this._rangeButtons$3[i]).find('.RDFDMButtonCheckmark').get(0), 'Checked');
            }
            else {
                dojo.removeClass(this._rangeButtons$3[i], 'Selected');
                dojo.removeClass($(this._rangeButtons$3[i]).find('.RDFDMButtonCheckmark').get(0), 'Checked');
            }
        }
    },
    
    destroy: function tab_RelativeDateFilterDialogMobile$destroy(preserveDom) {
        var destroyTH = function(th) {
            th.destroy();
        };
        dojo.forEach(this._touchHandlers$3, destroyTH);
        dojo.forEach(this._subscriptions$3, dojo.unsubscribe);
        if (!!this.domText) {
            this.domText.innerHTML = '';
        }
        this.inherited(arguments);
    },
    
    layout: function tab_RelativeDateFilterDialogMobile$layout() {
    },
    
    getMetrics: function tab_RelativeDateFilterDialogMobile$getMetrics() {
        var oSize = dojo.marginBox(this.domNode);
        return { fixed: tab.$create_Size(0, oSize.h) };
    },
    
    _initFromState$3: function tab_RelativeDateFilterDialogMobile$_initFromState$3() {
        var f = this.oFilter.table;
        this.periodType = f.periodType;
        this.rangeType = f.rangeType;
        this.rangeN = f.rangeN;
        if (!ss.isUndefined(f.anchor)) {
            var a = f.anchor;
            this.anchorDateTime = new Date(a.year, a.month - 1, a.day, a.hour, a.minute, a.second);
        }
        this.setRangeType(this.rangeType, this.rangeN);
    },
    
    applyChanges: function tab_RelativeDateFilterDialogMobile$applyChanges() {
        ++this.stateId;
        tab.FilterClientCommands.doRelativeDateQuickFilter(this.session.get_visualId(), this.field, this.periodType, this.rangeType, this.rangeN);
    },
    
    prepareToShow: function tab_RelativeDateFilterDialogMobile$prepareToShow() {
        this.setPeriodUI(this.periodType);
        this.setRangeUI(this.rangeType, this.rangeN);
        this.setPreviewUI();
    },
    
    onTypingLast: function tab_RelativeDateFilterDialogMobile$onTypingLast() {
        this.onTyping(this.inputLastn);
    },
    
    onTypingNext: function tab_RelativeDateFilterDialogMobile$onTypingNext() {
        this.onTyping(this.inputNextn);
    },
    
    setRLast: function tab_RelativeDateFilterDialogMobile$setRLast() {
        this.setRange('last');
    },
    
    setRCurr: function tab_RelativeDateFilterDialogMobile$setRCurr() {
        this.setRange('curr');
    },
    
    setRNext: function tab_RelativeDateFilterDialogMobile$setRNext() {
        this.setRange('next');
    },
    
    setRLastn: function tab_RelativeDateFilterDialogMobile$setRLastn() {
        this.setRange('lastn', this.inputLastn.value);
    },
    
    setRNextn: function tab_RelativeDateFilterDialogMobile$setRNextn() {
        this.setRange('nextn', this.inputNextn.value);
    },
    
    setRTodate: function tab_RelativeDateFilterDialogMobile$setRTodate() {
        this.setRange('todate');
    },
    
    setRangeUI: function tab_RelativeDateFilterDialogMobile$setRangeUI(range, n) {
        var len = this._periodInputs$3.length;
        for (var i = 0; i < len; i++) {
            if (dojo.attr(this._periodInputs$3[i], 'name') === range) {
                dojo.addClass(this._periodInputs$3[i], 'Selected');
                dojo.addClass($(this._periodInputs$3[i]).find('.RDFDMButtonCheckmark').get(0), 'Checked');
            }
            else {
                dojo.removeClass(this._periodInputs$3[i], 'Selected');
                dojo.removeClass($(this._periodInputs$3[i]).find('.RDFDMButtonCheckmark').get(0), 'Checked');
            }
        }
        switch (range) {
            case 'lastn':
                this.rangeN = n;
                this.inputLastn.value = n;
                break;
            case 'nextn':
                this.rangeN = n;
                this.inputNextn.value = n;
                break;
            default:
                this.inputLastn.blur();
                this.inputNextn.blur();
                break;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RelativeDateFilterMobile

tab.RelativeDateFilterMobile = function tab_RelativeDateFilterMobile(props) {
    tab.RelativeDateFilterMobile.initializeBase(this, [ props ]);
    this.templateString = tab.RelativeDateFilterMobile._mobileTemplateString$4;
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.RelativeDateFilterMobile.prototype = {
    parent: null,
    domBox: null,
    _popupShowHandle$4: null,
    div: null,
    domReadout: null,
    _inplaceMobile$4: null,
    
    get_inplaceMobile: function tab_RelativeDateFilterMobile$get_inplaceMobile() {
        return this._inplaceMobile$4;
    },
    set_inplaceMobile: function tab_RelativeDateFilterMobile$set_inplaceMobile(value) {
        this._inplaceMobile$4 = value;
        return value;
    },
    
    get_uniqueNodeId: function tab_RelativeDateFilterMobile$get_uniqueNodeId() {
        return this.domNode.id;
    },
    
    get_domNodeElement: function tab_RelativeDateFilterMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_RelativeDateFilterMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.domBox : this.domBox;
    },
    
    postCreate: function tab_RelativeDateFilterMobile$postCreate() {
        this.getSID = ss.Delegate.create(this, function() {
            return this.stateId;
        });
        this.initFromState();
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this._createPopup$4();
    },
    
    initFromState: function tab_RelativeDateFilterMobile$initFromState() {
        this._setReadout$4(this.oFilter.text);
        this.updateCurrentStateOfData();
        this.setTitle();
        this.updateTitleBar();
    },
    
    onDestroy: function tab_RelativeDateFilterMobile$onDestroy() {
        this._destroyPopup$4();
        this.inherited(arguments);
    },
    
    _setReadout$4: function tab_RelativeDateFilterMobile$_setReadout$4(text) {
        this.domReadout.innerHTML = text;
    },
    
    layout: function tab_RelativeDateFilterMobile$layout() {
    },
    
    onUpdateFromPopup: function tab_RelativeDateFilterMobile$onUpdateFromPopup(data) {
        this._updateViz$4(data);
    },
    
    _updateViz$4: function tab_RelativeDateFilterMobile$_updateViz$4(data) {
        ++this.stateId;
        var node = tableau.util.findDirectParentByClassName(this.domDialog, 'dijitPopup', dojo.body());
        if (!ss.isNullOrUndefined(node)) {
            dojo.style(node, 'zIndex', '980');
        }
    },
    
    _createPopup$4: function tab_RelativeDateFilterMobile$_createPopup$4() {
        var popupParams = {};
        popupParams.title = tableau.format.formatColumnDisplayName(this.oFilter);
        popupParams.inPlaceControl = this;
        popupParams.field = this.field;
        popupParams.oFilter = this.oFilter;
        popupParams.layoutSession = this.layoutSession;
        popupParams.zid = this.zid;
        popupParams.format = this.format;
        popupParams.attributes = this.attributes || {};
        popupParams.requestSetAttributes = this.requestSetAttributes;
        popupParams.session = this.session;
        popupParams.qf = this;
        var popupClass = tableau.mobile.widget.RelativeDateFilterPopup;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get_inplaceMobile().get_popup().createControls();
    },
    
    _destroyPopup$4: function tab_RelativeDateFilterMobile$_destroyPopup$4() {
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RelativeDateFilterPopup

tab.RelativeDateFilterPopup = function tab_RelativeDateFilterPopup(popupParams, srcRefNode) {
    tab.RelativeDateFilterPopup.initializeBase(this);
}
tab.RelativeDateFilterPopup.prototype = {
    params: null,
    
    postCreate: function tab_RelativeDateFilterPopup$postCreate() {
        this.set_content(new tableau.mobile.widget.RelativeDateFilterDialogMobile(this.params));
        (this.get_content()).placeAt(this.domContent, 'after');
        this.inherited(arguments);
        (this.get_content()).layout();
        dojo.addClass(this.domNode, 'RDFM');
    },
    
    prepareToShow: function tab_RelativeDateFilterPopup$prepareToShow() {
        (this.get_content()).prepareToShow();
    },
    
    destroy: function tab_RelativeDateFilterPopup$destroy() {
        (this.get_content()).destroy();
        this.inherited(arguments);
    },
    
    getContentDimensions: function tab_RelativeDateFilterPopup$getContentDimensions(availableHeight) {
        this._layoutContainer.resize({ h: 330 });
        return dojo.marginBox((this.get_content()).domNode);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.RelativeDatePickFilterMobile

tab.RelativeDatePickFilterMobile = function tab_RelativeDatePickFilterMobile(oProps) {
    tab.RelativeDatePickFilterMobile.initializeBase(this, [ oProps ]);
    this.templateString = tab.RelativeDatePickFilterMobile._mobileTemplate$3;
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.RelativeDatePickFilterMobile.prototype = {
    _tupleList$3: null,
    parent: null,
    domBox: null,
    _inplaceMobile$3: null,
    
    get_inplaceMobile: function tab_RelativeDatePickFilterMobile$get_inplaceMobile() {
        return this._inplaceMobile$3;
    },
    set_inplaceMobile: function tab_RelativeDatePickFilterMobile$set_inplaceMobile(value) {
        this._inplaceMobile$3 = value;
        return value;
    },
    
    get__popup$3: function tab_RelativeDatePickFilterMobile$get__popup$3() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_RelativeDatePickFilterMobile$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_RelativeDatePickFilterMobile$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.domBox : this.domBox;
    },
    
    postCreate: function tab_RelativeDatePickFilterMobile$postCreate() {
        this.disposables = new tab.DisposableHolder();
        this.getSID = ss.Delegate.create(this, function() {
            return this.stateId;
        });
        this.timestamp = new Date().getTime();
        this.initFromState();
    },
    
    initFromState: function tab_RelativeDatePickFilterMobile$initFromState() {
        var pickerDurations = tab.RelativeDatePickFilter.pickerDurations;
        var pickerStrings = tab.RelativeDatePickFilter.pickerStrings;
        var value = null;
        this.disposables = new tab.DisposableHolder();
        this.currentRange = this.oFilter.table;
        this.currentAbbrev = this.toAbbrev(this.currentRange);
        this.domPicker.innerHTML = '';
        var title = tableau.format.formatColumnDisplayName(this.oFilter);
        dojo.attr(this.domTitleBar, 'title', title);
        if (this.hideEmptyTitlebar()) {
            dojo.style(this.domTitleBar, 'display', 'none');
            dojo.marginBox(this.domTitleBar, { h: 0 });
        }
        else {
            this.domTitleBar.innerHTML = this.titleHTML;
        }
        this._tupleList$3 = [];
        var len = pickerDurations.length;
        for (var i = 0; i < len; i++) {
            var tuple = tab.$create_TupleStruct(pickerStrings[i], false, null);
            if (this.currentAbbrev === pickerDurations[i]) {
                value = pickerStrings[i];
                tuple.s = true;
            }
            this._tupleList$3.push(tuple);
        }
        this._updateWidget$3(value);
        this.layout();
        this.get_inplaceMobile().setupTouchHandler(this.domNode);
        this.createPopup(this._tupleList$3);
    },
    
    destroy: function tab_RelativeDatePickFilterMobile$destroy() {
        this.disposables.dispose();
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
        this.inherited(arguments);
    },
    
    createPopup: function tab_RelativeDatePickFilterMobile$createPopup(picks) {
        var popupClass = tableau.mobile.widget.catmode.popup.ListPopup;
        var title = tableau.format.formatColumnDisplayName(this.oFilter);
        var popupParams = {};
        popupParams.listParams = {};
        popupParams.listParams.listItems = picks;
        popupParams.listParams.isMultiValue = false;
        popupParams.title = title;
        popupParams.qf = this;
        popupParams.listParams.itemFormatter = tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml;
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get__popup$3().createControls();
        this.get__popup$3().get_list().add_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get__popup$3().get_list().remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$3));
        })));
    },
    
    get_uniqueNodeId: function tab_RelativeDatePickFilterMobile$get_uniqueNodeId() {
        return this.id;
    },
    
    adjustLabelPickWidth: function tab_RelativeDatePickFilterMobile$adjustLabelPickWidth(totalWidth) {
    },
    
    _applyChangesToItem$3: function tab_RelativeDatePickFilterMobile$_applyChangesToItem$3(changedItemList, listIndex) {
        if (changedItemList.length <= 0) {
            return;
        }
        var pickerDurationsInteger = tab.RelativeDatePickFilter.pickerDurationsInteger;
        for (var i = 0; i < changedItemList.length; i++) {
            if (!!changedItemList[i].rowState) {
                var selectedRowIndex = changedItemList[i].rowIndex;
                this._updateWidget$3(this._tupleList$3[selectedRowIndex].d);
                var data = pickerDurationsInteger[selectedRowIndex];
                ++this.stateId;
                tab.FilterClientCommands.doRelativeDateQuickFilter(this.session.get_visualId(), this.field, 'day', 'lastn', data);
                break;
            }
        }
    },
    
    _updateWidget$3: function tab_RelativeDatePickFilterMobile$_updateWidget$3(value) {
        if (ss.isValue(value)) {
            this.domPicker.innerHTML = tableau.format.escapeHTML(value);
        }
        else {
            this.domPicker.innerHTML = '';
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SearchWidgetMobile

tab.SearchWidgetMobile = function tab_SearchWidgetMobile(props, dom) {
    tab.SearchWidgetMobile.initializeBase(this, [ props, dom ]);
    this.templateString = tab.SearchWidgetMobile.mobileTemplateString;
}
tab.SearchWidgetMobile.prototype = {
    list: null,
    lastQuery: '',
    _disposables$3: null,
    _touchHandlers$3: null,
    
    add_hideUICalled: function tab_SearchWidgetMobile$add_hideUICalled(value) {
        this.__hideUICalled$3 = ss.Delegate.combine(this.__hideUICalled$3, value);
    },
    remove_hideUICalled: function tab_SearchWidgetMobile$remove_hideUICalled(value) {
        this.__hideUICalled$3 = ss.Delegate.remove(this.__hideUICalled$3, value);
    },
    
    __hideUICalled$3: null,
    
    add_onXButtonClickCalled: function tab_SearchWidgetMobile$add_onXButtonClickCalled(value) {
        this.__onXButtonClickCalled$3 = ss.Delegate.combine(this.__onXButtonClickCalled$3, value);
    },
    remove_onXButtonClickCalled: function tab_SearchWidgetMobile$remove_onXButtonClickCalled(value) {
        this.__onXButtonClickCalled$3 = ss.Delegate.remove(this.__onXButtonClickCalled$3, value);
    },
    
    __onXButtonClickCalled$3: null,
    
    add_attachItemsChangedHandlerCalled: function tab_SearchWidgetMobile$add_attachItemsChangedHandlerCalled(value) {
        this.__attachItemsChangedHandlerCalled$3 = ss.Delegate.combine(this.__attachItemsChangedHandlerCalled$3, value);
    },
    remove_attachItemsChangedHandlerCalled: function tab_SearchWidgetMobile$remove_attachItemsChangedHandlerCalled(value) {
        this.__attachItemsChangedHandlerCalled$3 = ss.Delegate.remove(this.__attachItemsChangedHandlerCalled$3, value);
    },
    
    __attachItemsChangedHandlerCalled$3: null,
    
    get__asScrollListener$3: function tab_SearchWidgetMobile$get__asScrollListener$3() {
        return this;
    },
    
    get_list: function tab_SearchWidgetMobile$get_list() {
        return this.list;
    },
    set_list: function tab_SearchWidgetMobile$set_list(value) {
        this.list = value;
        return value;
    },
    
    postCreate: function tab_SearchWidgetMobile$postCreate() {
        this._disposables$3 = new tab.DisposableHolder();
        this._touchHandlers$3 = new tab.DisposableHolder();
        var xButtonSpec = spiff.$create_EventHandleSpec();
        xButtonSpec.potentialTap = ss.Delegate.create(this, this.onXButtonClick);
        this._touchHandlers$3.add(new spiff.TableauEventHandler(this.get_domXButton(), xButtonSpec));
        var searchBusyImgSpec = spiff.$create_EventHandleSpec();
        searchBusyImgSpec.potentialTap = ss.Delegate.create(this, this.onSearchBusyImgClick);
        this._touchHandlers$3.add(new spiff.TableauEventHandler(this.domSearchBusyImg, searchBusyImgSpec));
        var searchButtonSpec = spiff.$create_EventHandleSpec();
        searchButtonSpec.potentialTap = ss.Delegate.create(this, this.onSearchButtonClick);
        this._touchHandlers$3.add(new spiff.TableauEventHandler(this.domSearchButton, searchButtonSpec));
        var searchAddButtonSpec = spiff.$create_EventHandleSpec();
        searchAddButtonSpec.potentialTap = ss.Delegate.create(this, this.onSearchAddButtonClick);
        this._touchHandlers$3.add(new spiff.TableauEventHandler(this.domSearchAddButton, searchAddButtonSpec));
        var resultsSpec = spiff.$create_EventHandleSpec();
        resultsSpec.potentialTap = ss.Delegate.create(this, function(e) {
            this.onListItemClick(e);
        });
        this._touchHandlers$3.add(new spiff.TableauEventHandler(this.domResults, resultsSpec));
        this.inherited(arguments);
        this._disposables$3.add(spiff.EventUtil.bindWithDispose($(this.domQueryBox), 'focus', ss.Delegate.create(this, this.testClick)));
    },
    
    postMixInProperties: function tab_SearchWidgetMobile$postMixInProperties() {
        this.inherited(arguments);
        this.busy_gif_url = tableau.util.assetUrl('/javascripts/tableau/mobile/images/Snake16x16.gif');
    },
    
    testClick: function tab_SearchWidgetMobile$testClick(evt) {
        this.focusQueryBox();
        this.setQueryIconsVisibility(true);
    },
    
    focusQueryBox: function tab_SearchWidgetMobile$focusQueryBox() {
        if (!tab.BrowserSupport.get_isSafari()) {
            this.domQueryBox.focus();
        }
    },
    
    dispose: function tab_SearchWidgetMobile$dispose() {
        this._touchHandlers$3.dispose();
        this._disposables$3.dispose();
    },
    
    destroy: function tab_SearchWidgetMobile$destroy() {
        this.dispose();
        this.inherited(arguments);
    },
    
    hideUI: function tab_SearchWidgetMobile$hideUI() {
        if (!this.get_isVisible()) {
            return;
        }
        tab.SearchWidgetMobile.callBaseMethod(this, 'hideUI');
        if (!!this.list) {
            this.list.destroy();
            this.list = null;
        }
        if (ss.isValue(this.__hideUICalled$3)) {
            this.__hideUICalled$3();
        }
    },
    
    onXButtonClick: function tab_SearchWidgetMobile$onXButtonClick(evt) {
        if (!this._isTypeInList && String.isNullOrEmpty(this.getQuery())) {
            this.hideUI();
        }
        else {
            this.clearSearch();
        }
        if (!!this.list) {
            this._disposables$3.dispose();
            this._disposables$3 = new tab.DisposableHolder();
            this.list.destroy();
            this.list = null;
        }
        if (ss.isValue(this.__onXButtonClickCalled$3)) {
            this.__onXButtonClickCalled$3();
        }
    },
    
    clearSearch: function tab_SearchWidgetMobile$clearSearch(preserveQueryBoxText, noFocus) {
        this.lastQuery = '';
        tab.SearchWidgetMobile.callBaseMethod(this, 'clearSearch', [ preserveQueryBoxText, noFocus ]);
    },
    
    addManualSearchItems: function tab_SearchWidgetMobile$addManualSearchItems(items) {
        var newTuples = [];
        if (this.get_qf().get_dijitDeclaredClass() !== 'tableau.mobile.widget.CategoricalFilterMobile') {
            return;
        }
        if (tab.MiscUtil.isNullOrUndefined(items)) {
            items = this.getQuery().split('\n');
        }
        if (tab.MiscUtil.isNullOrEmpty(items)) {
            return;
        }
        for (var i = 0, length = items.length; i < length; i++) {
            var item = items[i];
            if (!tab.MiscUtil.isNullOrEmpty(item)) {
                newTuples.push(tab.$create_TupleStruct(item, true, [ tab.$create_DataValueStruct('s', item) ]));
            }
            var changed = {};
            changed.schema = this.get_qf().get_oFilter().table.schema;
            changed.tuples = newTuples;
            this.notifyParentFilterOfChanged(changed, true);
            this.clearSearch();
        }
    },
    
    fixQueryWidth: function tab_SearchWidgetMobile$fixQueryWidth() {
    },
    
    setQueryIconsVisibility: function tab_SearchWidgetMobile$setQueryIconsVisibility(initialLoad) {
        var isTypeIn = this._isTypeInList;
        var resultsVisible = (initialLoad) ? false : !!this.list;
        var typeInSearchButtonsVisible = (!String.isNullOrEmpty(this.getQuery()) && isTypeIn && !resultsVisible);
        var addButtonVisible = typeInSearchButtonsVisible;
        var isFilterSearchable = true;
        var searchButtonsVisible;
        if (!!this.get_qf() && isTypeIn) {
            isFilterSearchable = this.get_qf().get_oFilter().is_searchable;
        }
        searchButtonsVisible = (typeInSearchButtonsVisible && isFilterSearchable);
        dojo.style(this.domSearchBusyImg, 'display', (searchButtonsVisible && this._bSearching) ? 'block' : 'none');
        dojo.style(this.domSearchButton, 'display', (searchButtonsVisible && !this._bSearching) ? 'block' : 'none');
        dojo.style(this.domSearchAddButton, 'display', (addButtonVisible) ? 'block' : 'none');
        var xButtonDisplay = (isTypeIn && !resultsVisible) ? 'none' : 'block';
        dojo.style(this.get_domXButton(), 'display', xButtonDisplay);
        this.fixQueryWidth();
    },
    
    searchWithQuery: function tab_SearchWidgetMobile$searchWithQuery(query) {
        this.lastQuery = query;
        this.inherited(arguments);
    },
    
    doCategoricalSearch: function tab_SearchWidgetMobile$doCategoricalSearch(query) {
        var filter = this.get_qf().get_oFilter();
        var indices = [];
        var resultsTransformer = function(t, display, index) {
            indices.push(index);
            return t;
        };
        var result = {};
        result.tuples = tab.LocalSearch.findMatches(query, filter, ss.Delegate.create(this, this.formatTuple), resultsTransformer);
        result.indices = indices;
        return result;
    },
    
    handleSearchResults: function tab_SearchWidgetMobile$handleSearchResults(data) {
        this.set_oResults(data);
        this.showSearchSpinner(false);
        if (!!data && data.dojoType === 'cancel') {
            return;
        }
        this.domResults.innerHTML = '';
        var config = {};
        if (ss.isValue(data.tuples)) {
            config.indices = data.indices;
            config.listItems = data.tuples;
        }
        else {
            config.listItems = data;
        }
        this.resultCount = config.listItems.length;
        if (!!this.list) {
            this.list.destroy();
            this.list = null;
        }
        config.isMultiValue = !this.get_qf().isSingleSelect();
        config.isWide = ss.isValue(tab.FilterItemUtil.getClassElement(this.domNode.parentNode, 'Wide'));
        config.isSearchWidget = true;
        if (!this.resultCount) {
            var noResultsRow = tab.$create_TupleStruct(this.NO_MATCHES, false, [ tab.$create_DataValueStruct('s', this.NO_MATCHES) ]);
            var noResultsList = [noResultsRow];
            config.listItems = noResultsList;
            config.isMsgOnly = true;
        }
        config.filter = this.get_qf();
        config.itemFormatter = tableau.mobile.FilterItemMobile.formatListRowFilterItemHtml;
        this.list = tab.ScrollingList.createScrollingList(config);
        this.placeList();
        this.attachItemsChangedHandler(this.list);
        this.get__asScrollListener$3().setupScrollListener(this.list.iscrollObj);
        this.setQueryIconsVisibility(false);
    },
    
    placeList: function tab_SearchWidgetMobile$placeList() {
        this.list.placeAt(this.domResults, 'after');
    },
    
    handleSearchResultsError: function tab_SearchWidgetMobile$handleSearchResultsError(response) {
    },
    
    update: function tab_SearchWidgetMobile$update(qf) {
        this.set_qf(qf);
        if (!!this.lastQuery) {
            this.searchWithQuery(this.lastQuery);
        }
    },
    
    _applyChangesToItem$3: function tab_SearchWidgetMobile$_applyChangesToItem$3(changedItemList, listIndex) {
        var table = this.get_oResults();
        var currentState = {};
        currentState.schema = table.schema;
        currentState.tuples = [];
        var t = table.tuples;
        if (changedItemList.length < 1) {
            return;
        }
        for (var i = 0; i < changedItemList.length; i++) {
            var changedItemIndex = changedItemList[i].rowIndex;
            if (changedItemList[i].rowState && !t[changedItemIndex].s) {
                t[changedItemIndex].s = true;
                currentState.tuples.push(t[changedItemIndex]);
            }
            else if (!changedItemList[i].rowState && t[changedItemIndex].s) {
                t[changedItemIndex].s = false;
                currentState.tuples.push(t[changedItemIndex]);
            }
        }
        if (!!currentState.tuples.length) {
            this.notifyParentFilterOfChanged(currentState, false, false);
        }
    },
    
    _applyChangesHier: function tab_SearchWidgetMobile$_applyChangesHier() {
        var currentState = {};
        currentState.schema = this.get_oResults().schema;
        currentState.tuples = [];
        var tuples = this.get_oResults().tuples;
        for (var i = 0, length = tuples.length; i < length; i++) {
            var row = this.list.getRowAtIndex(i);
            this.recordCheckedChanges(currentState, row, tuples[i]);
        }
        return currentState;
    },
    
    recordCheckedChanges: function tab_SearchWidgetMobile$recordCheckedChanges(changedList, item, tuple) {
        if (this.list.isSelectedRow(item) && !tuple.s) {
            tuple.s = true;
            changedList.tuples.push(tuple);
        }
        else if (!this.list.isSelectedRow(item) && tuple.s) {
            tuple.s = false;
            changedList.tuples.push(tuple);
        }
    },
    
    attachItemsChangedHandler: function tab_SearchWidgetMobile$attachItemsChangedHandler(refArg) {
        if (this._isTypeInList) {
            this.list.add_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$3));
            this._disposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this.list.remove_dispatchItemsChanged(ss.Delegate.create(this, this._applyChangesToItem$3));
            })));
        }
        if (ss.isValue(this.__attachItemsChangedHandlerCalled$3)) {
            this.__attachItemsChangedHandlerCalled$3(refArg);
        }
    },
    
    applyChanges: function tab_SearchWidgetMobile$applyChanges() {
        var changed = null;
        if (this.get_qf().get_dijitDeclaredClass() === 'tableau.mobile.widget.CategoricalFilter' && !this._isTypeInList) {
            changed = this.applyChangesCat();
        }
        else {
            changed = this.applyChangesHierOrTypeIn();
        }
        this.notifyParentFilterOfChanged(changed);
    },
    
    notifyParentFilterOfChanged: function tab_SearchWidgetMobile$notifyParentFilterOfChanged(changed, manualAdd, noServerCall) {
        if (!changed.tuples.length) {
            return;
        }
        this.get_qf().updateStateFromSearch(changed);
        if (noServerCall) {
            return;
        }
        this.get_qf().set_stateId(this.get_qf().get_stateId() + 1);
        if (manualAdd) {
            var handler = ss.Delegate.create(this, this.onManualAddSuccess);
            this.get_qf().get_session().addManualFilterItems(changed, this.get_qf(), handler);
        }
        else {
            var isTypeInAll = this._isTypeInList && this.get_qf().get_oFilter().all;
            if (isTypeInAll || this.get_qf().isSingleSelect()) {
                this.doSetCategoricalFilter(isTypeInAll, changed);
            }
            else {
                this.doModifyCategoricalFilter(changed);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.FilteringSearchWidgetMobile

tab.FilteringSearchWidgetMobile = function tab_FilteringSearchWidgetMobile(props, dom, updateListInPopover) {
    tab.FilteringSearchWidgetMobile.initializeBase(this, [ props, dom ]);
    this.templateString = tab.SearchWidgetMobile.mobileTemplateString;
    this._updateListInPopover$4 = updateListInPopover;
}
tab.FilteringSearchWidgetMobile.prototype = {
    _updateListInPopover$4: null,
    
    get__qfAsFilteringQf$4: function tab_FilteringSearchWidgetMobile$get__qfAsFilteringQf$4() {
        return this.get_qf();
    },
    
    clearSearch: function tab_FilteringSearchWidgetMobile$clearSearch() {
        this.resultCount = tab.SearchWidgetBase.noSearchPerformed;
        this.setQuery('');
        tab.FilteringSearchWidgetMobile.callBaseMethod(this, 'clearSearch');
        this.get__qfAsFilteringQf$4().filterBySearchResults(null);
    },
    
    placeList: function tab_FilteringSearchWidgetMobile$placeList() {
        this._updateListInPopover$4(this.get_list());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ScrollingListRow

tab.ScrollingListRow = function tab_ScrollingListRow(parameters, srcRefNode) {
    this.rowIndex = -1;
    this.templateString = '<div dojoAttachPoint="_listRow" class="ListRow ${extraClass}" ' + 'data-uniqueid="${uniqueId}" data-rowIndex="${rowIndex}">' + '<div class="facet">${facet}</div>' + '<div dojoAttachPoint="_check" class="checkArea">&nbsp;</div>' + '<div class="labelArea" style="margin-left: 28px;">${label}</div>' + '</div>';
    tab.ScrollingListRow.initializeBase(this);
    this.extraClass = parameters.extraClass || '';
    this.checked = (parameters.checked || false);
    this.label = parameters.formattedLabel || '';
    this.isWide = parameters.bIsWide;
    this.facet = parameters.bFacet || '';
}
tab.ScrollingListRow.prototype = {
    checked: false,
    widgetsInTemplate: false,
    uniqueId: '',
    extraClass: '',
    label: '',
    isWide: false,
    facet: '',
    _listRow: null,
    
    getUniqueId: function tab_ScrollingListRow$getUniqueId() {
        var id = dojo.attr(this.domNode, 'data-uniqueid');
        return id;
    },
    
    postCreate: function tab_ScrollingListRow$postCreate() {
        this.setState(this.checked);
        if (!!this.isWide) {
            dojo.addClass(this._listRow, 'Wide');
        }
    },
    
    getValue: function tab_ScrollingListRow$getValue() {
        return null;
    },
    
    setState: function tab_ScrollingListRow$setState(state) {
        this.checked = state;
        dojo.toggleClass(this._listRow, 'checked', state);
    },
    
    toggleState: function tab_ScrollingListRow$toggleState() {
        this.checked = !this.checked;
        dojo.toggleClass(this._listRow, 'checked', this.checked);
    },
    
    isSelected: function tab_ScrollingListRow$isSelected() {
        return this.checked;
    },
    
    isAll: function tab_ScrollingListRow$isAll() {
        return this.extraClass === 'rowAll';
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SharePopup

tab.SharePopup = function tab_SharePopup(facebookClickAction, twitterClickAction, mailClickAction) {
    tab.SharePopup.initializeBase(this, [ $('<div>').addClass('share-popup') ]);
    spiff.GlobalTouchWatcher.add_potentialTap(ss.Delegate.create(this, this.hide));
    this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
        spiff.GlobalTouchWatcher.remove_potentialTap(ss.Delegate.create(this, this.hide));
    })));
    this._createButton$1(facebookClickAction, 'Facebook', 'facebook');
    this._createButton$1(twitterClickAction, 'Twitter', 'twitter');
    this._createButton$1(mailClickAction, 'Mail', 'mail');
}
tab.SharePopup.prototype = {
    
    hide: function tab_SharePopup$hide(e, cancelCallback) {
        this.get_element().hide();
    },
    
    show: function tab_SharePopup$show() {
        if (this.get_element().offset().top < 0) {
            this.get_element().css('height', String.format('{0}px', this.get_element().height()));
            tab.DomUtil.setElementPosition(this.get_element(), this.get_element().offset().left, 0);
        }
        this.get_element().show();
    },
    
    _createButton$1: function tab_SharePopup$_createButton$1(clickAction, title, cssClass) {
        var html = String.format("<div class='share-popup-tap-area'>\n<div class='share-popup-title'>{0}</div>\n<div class='share-popup-icon tab-icon-{1}-popup'></div>\n</div>", title, cssClass);
        var button = $(html);
        this.disposables.add(spiff.ClickHandler.targetAndClick(button, clickAction));
        this.get_element().append(button);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SingleSliderMobile

tab.SingleSliderMobile = function tab_SingleSliderMobile(param) {
    this.templateString = "<div dojoAttachPoint='_singleSliderWrapper' class='singleSliderWrapper'>" + "<div dojoAttachPoint='_marksStrip' class='sliderMarksStrip'></div>" + "<div dojoAttachPoint='_singleSliderThumbtrackRailWrapper' class='sliderThumbtrackRailWrapper'>" + "<div dojoAttachPoint='_singleSliderThumbtrackRail' class='sliderThumbtrackRail'>" + "<div id='handleWrapper' dojoAttachPoint='_sliderThumbTrack' class='thumbtrackWrapper'>" + "<div id='left' dojoAttachPoint='_sliderThumbTrackImage' class='thumbtrack'></div>" + '</div>' + "<div dojoAttachPoint='_completedRail' class='sliderRangeRail'></div>" + '</div>' + '</div>' + "<div id='leftButton' dojoAttachPoint='_leftButton' class='leftButtonWrapper' style='margin-top:8px;'>" + "<div class='leftButton' style='margin:10px 0 0 14px'></div>" + '</div>' + "<div id='rightButton' dojoAttachPoint='_rightButton' class='rightButtonWrapper' style='margin-top:8px;'>" + "<div class='rightButton' style='margin:10px 0 0 14px'></div>" + '</div>' + '</div>';
    this._thumbTrackXPos$1 = -5;
    this._sliderTouchHandlers$1 = [];
    tab.SingleSliderMobile.initializeBase(this);
    this._showButtons$1 = param.bShowArrows;
    this._showSlider$1 = param.bShowSlider;
    this._sliderRange$1 = param.length;
    this.isPercentageMode = param.isPercentageMode;
    this.currentValue = (this.isPercentageMode) ? param.currentValue : param.currentlySelected;
}
tab.SingleSliderMobile.prototype = {
    widgetsInTemplate: true,
    _sliderThumbTrack: null,
    _sliderThumbTrackImage: null,
    _singleSliderThumbtrackRail: null,
    _completedRail: null,
    _leftButton: null,
    _rightButton: null,
    _marksStrip: null,
    _singleSliderWrapper: null,
    _singleSliderThumbtrackRailWrapper: null,
    _sliderRange$1: 0,
    _hasExtras$1: false,
    _showButtons$1: false,
    currentValue: 0,
    _markJump$1: 0,
    _enclosingDivNode$1: 0,
    _leftLimit$1: 0,
    _rightLimit$1: 0,
    _sliderRailWidth$1: 0,
    _zoomFactor$1: 0,
    _currentSliderLocation$1: 0,
    _newSliderLocation$1: 0,
    _currentSliderMark$1: 0,
    _newSliderMark$1: 0,
    _scaleFactor$1: 0,
    _timer$1: null,
    _parentObject$1: null,
    _parentContainerNode$1: null,
    _showSlider$1: false,
    isPercentageMode: false,
    _noMarksVisible$1: false,
    _latestRailX$1: 0,
    
    add_onPopupSliderChange: function tab_SingleSliderMobile$add_onPopupSliderChange(value) {
        this.__onPopupSliderChange$1 = ss.Delegate.combine(this.__onPopupSliderChange$1, value);
    },
    remove_onPopupSliderChange: function tab_SingleSliderMobile$remove_onPopupSliderChange(value) {
        this.__onPopupSliderChange$1 = ss.Delegate.remove(this.__onPopupSliderChange$1, value);
    },
    
    __onPopupSliderChange$1: null,
    
    add_onPopupSliderDragEnd: function tab_SingleSliderMobile$add_onPopupSliderDragEnd(value) {
        this.__onPopupSliderDragEnd$1 = ss.Delegate.combine(this.__onPopupSliderDragEnd$1, value);
    },
    remove_onPopupSliderDragEnd: function tab_SingleSliderMobile$remove_onPopupSliderDragEnd(value) {
        this.__onPopupSliderDragEnd$1 = ss.Delegate.remove(this.__onPopupSliderDragEnd$1, value);
    },
    
    __onPopupSliderDragEnd$1: null,
    
    startup: function tab_SingleSliderMobile$startup() {
        this.setupSliderComponents();
    },
    
    setupSliderComponents: function tab_SingleSliderMobile$setupSliderComponents() {
        if (this._showSlider$1) {
            var width = parseInt(dojo.style(this._sliderThumbTrack, 'width'));
            this._leftLimit$1 = -Math.round(width / 2);
            width = parseInt(dojo.style(this._singleSliderThumbtrackRail, 'width'));
            this._rightLimit$1 = width - Math.abs(this._leftLimit$1);
            this._sliderRailWidth$1 = width;
            this._scaleFactor$1 = this._sliderRailWidth$1 / (this._sliderRange$1 - 1);
            if (!this.isPercentageMode) {
                this.addMarksToSlider();
            }
            var pixelPosition = this.convertIndexToPixels(this.currentValue);
            this.setSliderPosition(pixelPosition);
            this._newSliderLocation$1 = pixelPosition;
            this._newSliderMark$1 = this.getCurrentPostionAsMark(pixelPosition);
            this._currentSliderMark$1 = this._newSliderMark$1;
        }
        else {
            this._newSliderMark$1 = this.currentValue;
            this._currentSliderMark$1 = this._newSliderMark$1;
            dojo.addClass(this._completedRail, 'HFButtonHide');
            dojo.addClass(this._singleSliderThumbtrackRail, 'HFButtonHide');
            dojo.addClass(this._marksStrip, 'HFButtonHide');
        }
        if (this._showButtons$1) {
            dojo.addClass(this._singleSliderWrapper, 'Wide');
            this.updateButtons();
        }
        else {
            dojo.addClass(this._leftButton, 'hide');
            dojo.addClass(this._rightButton, 'hide');
        }
        this.enableTouchHandling();
    },
    
    getElementRailX: function tab_SingleSliderMobile$getElementRailX(containerNode) {
        var railFromPopupEdgeX;
        var popupEdgeX;
        var railX;
        railFromPopupEdgeX = tab.DomUtil.getElementRelativePosition($(this._singleSliderThumbtrackRail), $(containerNode)).x;
        railFromPopupEdgeX = railFromPopupEdgeX * tableau.mobile.util.scaling.getZoomScaleFactor();
        popupEdgeX = tab.DomUtil.getElementClientPosition($(containerNode)).x;
        popupEdgeX = popupEdgeX * tableau.mobile.util.scaling.getZoomScaleFactor();
        railX = popupEdgeX + railFromPopupEdgeX;
        return parseInt(railX);
    },
    
    getRailX: function tab_SingleSliderMobile$getRailX() {
        if (ss.isValue(this._parentObject$1)) {
            return this.getElementRailX(this._parentObject$1.containerNode);
        }
        else {
            return this.getElementRailX(this._parentContainerNode$1);
        }
    },
    
    shortTapSliderRail: function tab_SingleSliderMobile$shortTapSliderRail(e) {
        var railX = this.getRailX();
        var clientX = e.clientX * tableau.mobile.util.scaling.getZoomScaleFactor();
        var newPos = (clientX - railX - Math.abs(this._leftLimit$1));
        this._newSliderLocation$1 = this.snapToMark(parseInt(newPos));
        if (this._newSliderLocation$1 < this._leftLimit$1) {
            this._newSliderLocation$1 = this._leftLimit$1;
        }
        if (this._newSliderLocation$1 > this._rightLimit$1) {
            this._newSliderLocation$1 = this._rightLimit$1;
        }
        dojo.style(this._sliderThumbTrack, 'left', this._newSliderLocation$1 + 'px');
        if (this._newSliderLocation$1 < 0) {
            dojo.style(this._completedRail, 'width', '0px');
        }
        else {
            dojo.style(this._completedRail, 'width', this._newSliderLocation$1 + 'px');
        }
        this._newSliderMark$1 = this.getCurrentPostionAsMark(this._newSliderLocation$1);
        if (ss.isValue(this._timer$1)) {
            this.killTimer();
        }
        this.setTimer();
        if (ss.isValue(this.__onPopupSliderChange$1)) {
            this.__onPopupSliderChange$1(this._newSliderMark$1, false);
        }
        if (ss.isValue(this.__onPopupSliderDragEnd$1)) {
            this.__onPopupSliderDragEnd$1(this._newSliderMark$1);
        }
        this.updateButtons();
    },
    
    shortTapButton: function tab_SingleSliderMobile$shortTapButton(e) {
        var newPos;
        if (e.currentTarget.id === this._leftButton.id) {
            if (this._newSliderMark$1 - 1 >= 0) {
                this._newSliderMark$1--;
                this.updateButtons();
                if (this._showSlider$1) {
                    newPos = this.convertIndexToPixels(this._newSliderMark$1);
                    dojo.style(this._sliderThumbTrack, 'left', newPos + 'px');
                    this._newSliderLocation$1 = newPos;
                    if (newPos < 0) {
                        newPos = 0;
                    }
                    dojo.style(this._completedRail, 'width', newPos + 'px');
                }
                if (ss.isValue(this.__onPopupSliderChange$1)) {
                    this.__onPopupSliderChange$1(this._newSliderMark$1, false);
                }
                if (ss.isValue(this.__onPopupSliderDragEnd$1)) {
                    this.__onPopupSliderDragEnd$1(this._newSliderMark$1);
                }
                if (ss.isValue(this._timer$1)) {
                    this.killTimer();
                }
                this.setTimer();
            }
        }
        else if (e.currentTarget.id === this._rightButton.id) {
            if (this._newSliderMark$1 + 1 < this._sliderRange$1) {
                this._newSliderMark$1++;
                this.updateButtons();
                if (this._showSlider$1) {
                    newPos = this.convertIndexToPixels(this._newSliderMark$1);
                    dojo.style(this._sliderThumbTrack, 'left', newPos + 'px');
                    this._newSliderLocation$1 = newPos;
                    if (newPos < 0) {
                        newPos = 0;
                    }
                    dojo.style(this._completedRail, 'width', newPos + 'px');
                }
                if (ss.isValue(this.__onPopupSliderChange$1)) {
                    this.__onPopupSliderChange$1(this._newSliderMark$1, false);
                }
                if (ss.isValue(this._timer$1)) {
                    this.killTimer();
                }
                this.setTimer();
            }
        }
    },
    
    drag: function tab_SingleSliderMobile$drag(pageX, railX) {
        pageX = pageX * tableau.mobile.util.scaling.getZoomScaleFactor();
        var newPos = pageX - railX - Math.abs(this._leftLimit$1);
        this._newSliderLocation$1 = this.snapToMark(newPos);
        if (this._newSliderLocation$1 < this._leftLimit$1) {
            this._newSliderLocation$1 = this._leftLimit$1;
        }
        if (this._newSliderLocation$1 > this._rightLimit$1) {
            this._newSliderLocation$1 = this._rightLimit$1;
        }
        dojo.style(this._sliderThumbTrack, 'left', this._newSliderLocation$1 + 'px');
        if (this._newSliderLocation$1 < 0) {
            dojo.style(this._completedRail, 'width', '0px');
        }
        else {
            dojo.style(this._completedRail, 'width', this._newSliderLocation$1 + 'px');
        }
        this._newSliderMark$1 = this.getCurrentPostionAsMark(this._newSliderLocation$1);
        this.updateButtons();
        if (ss.isValue(this.__onPopupSliderChange$1)) {
            this.__onPopupSliderChange$1(this._newSliderMark$1, false);
        }
    },
    
    addMarksToSlider: function tab_SingleSliderMobile$addMarksToSlider() {
        this._markJump$1 = this._sliderRailWidth$1 / (this._sliderRange$1 - 1);
        if (this._markJump$1 < 5) {
            this._noMarksVisible$1 = true;
            return;
        }
        else {
            this._noMarksVisible$1 = false;
        }
        var mark = document.createElement('div');
        dojo.addClass(mark, 'rulerMark');
        this._marksStrip.appendChild(mark);
        mark = document.createElement('div');
        dojo.addClass(mark, 'rulerMark');
        dojo.style(mark, 'left', dojo.style(this._marksStrip, 'width') + 'px');
        this._marksStrip.appendChild(mark);
        for (var i = 1; i <= (this._sliderRange$1 - 2); i++) {
            mark = document.createElement('div');
            dojo.addClass(mark, 'rulerMark');
            dojo.style(mark, 'left', Math.round(i * this._markJump$1) + 'px');
            this._marksStrip.appendChild(mark);
        }
    },
    
    getCurrentPostionAsMark: function tab_SingleSliderMobile$getCurrentPostionAsMark(xPos) {
        var offsetFromStartOfRail = xPos + Math.abs(this._leftLimit$1);
        return Math.round(offsetFromStartOfRail / this._scaleFactor$1);
    },
    
    convertIndexToPixels: function tab_SingleSliderMobile$convertIndexToPixels(index) {
        if (this._showSlider$1) {
            var pixelPosition = Math.round(index * this._scaleFactor$1) - Math.abs(this._leftLimit$1);
            if (pixelPosition < this._leftLimit$1) {
                pixelPosition = this._leftLimit$1;
            }
            else if (pixelPosition > this._rightLimit$1) {
                pixelPosition = this._rightLimit$1;
            }
            return pixelPosition;
        }
        return undefined;
    },
    
    snapToMark: function tab_SingleSliderMobile$snapToMark(xPos) {
        if (!this.isPercentageMode) {
            var offsetFromStartOfRail = (xPos / tableau.mobile.util.scaling.getZoomScaleFactor()) + Math.abs(this._leftLimit$1);
            var markIndex = Math.round(offsetFromStartOfRail / this._scaleFactor$1);
            var newPos = Math.round(this._scaleFactor$1 * markIndex) - Math.abs(this._leftLimit$1);
            return newPos;
        }
        else {
            return xPos;
        }
    },
    
    setTimer: function tab_SingleSliderMobile$setTimer() {
        this._timer$1 = window.setTimeout(ss.Delegate.create(this, this.timerCallback), 1000);
    },
    
    killTimer: function tab_SingleSliderMobile$killTimer() {
        if (this._timer$1 != null) {
            window.clearTimeout(this._timer$1);
            this._timer$1 = null;
        }
    },
    
    timerCallback: function tab_SingleSliderMobile$timerCallback() {
        if (this._newSliderMark$1 !== this._currentSliderMark$1) {
            this._currentSliderMark$1 = this._newSliderMark$1;
            if (ss.isValue(this.__onPopupSliderChange$1)) {
                this.__onPopupSliderChange$1(this._newSliderMark$1, true);
            }
        }
    },
    
    updateButtons: function tab_SingleSliderMobile$updateButtons() {
        if (this._sliderRange$1 > 1) {
            dojo.removeClass(this._rightButton, 'disabled');
            dojo.removeClass(this._leftButton, 'disabled');
            if (this._showButtons$1) {
                if (this._newSliderMark$1 === this._sliderRange$1 - 1) {
                    dojo.addClass(this._rightButton, 'disabled');
                }
                else if (!this._newSliderMark$1) {
                    dojo.addClass(this._leftButton, 'disabled');
                }
            }
        }
        else {
            dojo.addClass(this._rightButton, 'disabled');
            dojo.addClass(this._leftButton, 'disabled');
        }
    },
    
    setSliderIndex: function tab_SingleSliderMobile$setSliderIndex(index) {
        var pixelPosition = this.convertIndexToPixels(index);
        this.setSliderPosition(pixelPosition);
        if (ss.isValue(this.__onPopupSliderChange$1)) {
            this.__onPopupSliderChange$1(index, true);
        }
        this._newSliderMark$1 = this._currentSliderMark$1 = index;
        this.updateButtons();
    },
    
    setSliderPosition: function tab_SingleSliderMobile$setSliderPosition(pixelPosition) {
        if (pixelPosition >= this._leftLimit$1 && pixelPosition <= this._rightLimit$1) {
            dojo.style(this._sliderThumbTrack, 'left', pixelPosition + 'px');
            this._newSliderLocation$1 = pixelPosition;
            if (pixelPosition < 0) {
                pixelPosition = 0;
            }
            dojo.style(this._completedRail, 'width', pixelPosition + 'px');
        }
    },
    
    enableTouchHandling: function tab_SingleSliderMobile$enableTouchHandling() {
        if (this._sliderRange$1 > 1) {
            if (this._showSlider$1) {
                var configDragSlider = spiff.$create_EventHandleSpec();
                configDragSlider.dragMove = ss.Delegate.create(this, this.onDrag);
                configDragSlider.dragStart = ss.Delegate.create(this, this.onDragStart);
                configDragSlider.dragEnd = ss.Delegate.create(this, this.onDragEnd);
                var configTouchSliderRail = spiff.$create_EventHandleSpec();
                configTouchSliderRail.tap = ss.Delegate.create(this, this.shortTapSliderRail);
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._sliderThumbTrack, configDragSlider));
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._sliderThumbTrackImage, configDragSlider));
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._singleSliderThumbtrackRail, configTouchSliderRail));
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._singleSliderThumbtrackRailWrapper, configTouchSliderRail));
            }
            if (this._showButtons$1) {
                var configButtons_left = spiff.$create_EventHandleSpec();
                configButtons_left.firstTouch = ss.Delegate.create(this, this.shortTapButton);
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._leftButton, configButtons_left));
                var configButtons_right = spiff.$create_EventHandleSpec();
                configButtons_right.firstTouch = ss.Delegate.create(this, this.shortTapButton);
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._rightButton, configButtons_right));
                var buttonConfigPreventDefault = spiff.$create_EventHandleSpec();
                buttonConfigPreventDefault.doubleTap = function(e) {
                    e.preventDefault();
                };
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._leftButton, buttonConfigPreventDefault));
                this._sliderTouchHandlers$1.push(new spiff.TableauEventHandler(this._rightButton, buttonConfigPreventDefault));
            }
        }
    },
    
    onTap: function tab_SingleSliderMobile$onTap(e) {
    },
    
    onDragStart: function tab_SingleSliderMobile$onDragStart(e) {
        this._latestRailX$1 = this.getRailX();
        if (ss.isValue(this._timer$1)) {
            this.killTimer();
        }
    },
    
    onDrag: function tab_SingleSliderMobile$onDrag(e) {
        this.drag(e.pageX, this._latestRailX$1);
        e.preventDefault();
    },
    
    onDragEnd: function tab_SingleSliderMobile$onDragEnd(e) {
        if (ss.isValue(this.__onPopupSliderDragEnd$1)) {
            this.__onPopupSliderDragEnd$1(this._newSliderMark$1);
        }
        if (ss.isValue(this._timer$1)) {
            this.killTimer();
        }
        this.setTimer();
    },
    
    setParent: function tab_SingleSliderMobile$setParent(parentObj) {
        this._parentObject$1 = parentObj;
    },
    
    setParentContainerNode: function tab_SingleSliderMobile$setParentContainerNode(parentNode) {
        this._parentContainerNode$1 = parentNode;
    },
    
    destroy: function tab_SingleSliderMobile$destroy() {
        this.killTimer();
        var $enum1 = ss.IEnumerator.getEnumerator(this._sliderTouchHandlers$1);
        while ($enum1.moveNext()) {
            var h = $enum1.current;
            h.dispose();
        }
        this._sliderTouchHandlers$1 = [];
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SliderDojo

tab.SliderDojo = function tab_SliderDojo() {
}


////////////////////////////////////////////////////////////////////////////////
// tab.SliderMobile

tab.SliderMobile = function tab_SliderMobile(targetDiv, attrs, isAll, doUpdateFunc, getTitleOffsetFunc, getCurrentTextFunc, onIntermediateChangeFunc, getCurrentFacetFunc, showFacets) {
    this._attrreadout = [ 'show-readout', 'hide-readout' ];
    this._attrslider = [ 'show-slider', 'hide-slider' ];
    this._attrarrows = [ 'show-step-btns', 'hide-buttons' ];
    this._attrticks = [ 'show-ticks', 'hide-ticks' ];
    this._div = targetDiv;
    this._attributes = attrs;
    this._isAll = isAll;
    this._getTitleOffset = getTitleOffsetFunc;
    this._getCurrentText = getCurrentTextFunc;
    this.onIntermediateChange = onIntermediateChangeFunc;
    this._getCurrentFacet = getCurrentFacetFunc || function() {
        return null;
    };
    this._showFacets = showFacets;
    dojo.addClass(this._div, 'tableauWidgetUiSliderMobile');
    this.currentlySelected = -1;
    this.numValues = 0;
}
tab.SliderMobile.prototype = {
    styleid: 0,
    _sliderRules: null,
    currentlySelected: 0,
    numValues: 0,
    _startSub: null,
    _stopSub: null,
    slider: null,
    _isContinuous: false,
    readout: null,
    _textDiv: null,
    _facetDiv: null,
    _getTitleOffset: null,
    tooltipTimer: 0,
    shouldShowTooltip: false,
    _getCurrentText: null,
    _isAll: false,
    doUpdate: null,
    onIntermediateChange: null,
    _showFacets: false,
    _getCurrentFacet: null,
    _attributes: null,
    _div: null,
    
    shouldShow: function tab_SliderMobile$shouldShow(attrName) {
        return (this._attributes[attrName[0]] !== 'false' && this._attributes[attrName[1]] !== 'true');
    },
    
    calculateStyleID: function tab_SliderMobile$calculateStyleID() {
        this.styleid = 0;
        if (!this.shouldShow(this._attrreadout)) {
            this.styleid += 4;
        }
        if (!this.shouldShow(this._attrslider)) {
            this.styleid += 2;
        }
        this.styleid += 1;
        if (this.styleid > 5) {
            this.styleid = 3;
        }
    },
    
    destroy: function tab_SliderMobile$destroy() {
        dojo.unsubscribe(this._startSub);
        dojo.unsubscribe(this._stopSub);
        if (ss.isValue(this.slider) && (typeof(this.slider.destroy) === 'function')) {
            this.slider.destroy();
        }
        if (ss.isValue(this._sliderRules) && (typeof(this._sliderRules.destroy) === 'function')) {
            this._sliderRules.destroy();
        }
    },
    
    instantiateFromDomain: function tab_SliderMobile$instantiateFromDomain(domain, current) {
        var tuples = [];
        var len = domain.length;
        for (var i = 0; i < len; i++) {
            tuples[i] = tab.$create_TupleStruct(domain[i], current === domain[i], new Array(0));
        }
        this._instantiateFromTuples(tuples, null);
    },
    
    _instantiateFromTuples: function tab_SliderMobile$_instantiateFromTuples(t, text) {
        var currentlySelected = -1;
        var initialText = tab.Strings.QuickFilterUnknown;
        var facet = null;
        if (t.length > 0) {
            var len = t.length;
            for (var i = 0; i < len; i++) {
                if (!!t[i].s && !this._isAll) {
                    if (currentlySelected > -1) {
                        initialText = tab.Strings.QuickFilterMultipleValues;
                    }
                    else {
                        currentlySelected = i;
                        initialText = this._getCurrentText(i);
                    }
                }
            }
        }
        if (currentlySelected < 0) {
            currentlySelected = 0;
            if (ss.isValue(text)) {
                initialText = text;
            }
        }
        facet = this._getCurrentFacet(currentlySelected);
        this.instantiate(t.length, currentlySelected, initialText, facet);
    },
    
    instantiate: function tab_SliderMobile$instantiate(numValues, currentlySelectedArg, initialText, facet) {
        var rulesNode = null;
        this.numValues = numValues;
        this.currentlySelected = currentlySelectedArg;
        this.calculateStyleID();
        if (this.shouldShow(this._attrreadout)) {
            this.readout = document.createElement('div');
            dojo.addClass(this.readout, 'sliderTextReadout');
            dojo.addClass(this.readout, 'tab-ctrl-formatted-fixedsize');
            this._textDiv = document.createElement('div');
            dojo.addClass(this._textDiv, 'sliderText');
            this._textDiv.innerHTML = tableau.format.escapeHTML(initialText);
            if (this._showFacets) {
                this._facetDiv = document.createElement('div');
                dojo.addClass(this._facetDiv, 'facet');
                this._facetDiv.innerHTML = tableau.format.escapeHTML(facet);
                this.readout.appendChild(this._facetDiv);
            }
            this.readout.appendChild(this._textDiv);
            this._div.appendChild(this.readout);
        }
        if (this.styleid === 3) {
            return;
        }
        var sliderDiv = document.createElement('div');
        if (this.shouldShow(this._attrslider)) {
            rulesNode = document.createElement('div');
            sliderDiv.appendChild(rulesNode);
        }
        this._div.appendChild(sliderDiv);
        if (numValues < 1) {
            numValues = 1;
        }
        this._isContinuous = (!isFinite(numValues));
        if (this.shouldShow(this._attrslider) && numValues < 1200 && this.shouldShow(this._attrticks)) {
            var rulesParams = { count: numValues };
            this._sliderRules = new dijit.form.HorizontalRule(rulesParams, rulesNode);
        }
        var sliderParams = tab.$create_SliderParams();
        sliderParams.templateString = tab.Slider.tableauSliderTemplate;
        sliderParams.onChange = function() {
        };
        sliderParams.value = this.currentlySelected;
        sliderParams.slideDuration = 0;
        sliderParams.intermediateChanges = true;
        sliderParams.showButtons = false;
        sliderParams.pageIncrement = 1;
        sliderParams._onBarClick = function() {
        };
        sliderParams._onHandleClick = function() {
        };
        if (isFinite(numValues)) {
            sliderParams.minimum = 0;
            sliderParams.maximum = numValues - 1;
            sliderParams.discreteValues = numValues;
        }
        this.slider = new tableau.mobile.widget.ui.SliderDojoMobile(sliderParams, sliderDiv);
        this.slider.startup();
        if (ss.isValue(this._sliderRules)) {
            this._sliderRules.startup();
        }
        this._initialLayout();
    },
    
    refreshSliderMarksForIE: function tab_SliderMobile$refreshSliderMarksForIE() {
        if (dojo.isIE <= 7) {
            if (ss.isValue(this._sliderRules)) {
                this._sliderRules.domNode.className = this._sliderRules.domNode.className + ' ';
            }
        }
    },
    
    setNewState: function tab_SliderMobile$setNewState(newSelected) {
        this.currentlySelected = newSelected;
        if (ss.isValue(this.slider)) {
            this.slider._setValueAttr(this.currentlySelected);
        }
        this.refreshSliderMarksForIE();
    },
    
    _getRealIndex: function tab_SliderMobile$_getRealIndex(index) {
        var realIndex;
        if (ss.isNullOrUndefined(index) || isNaN(index)) {
            return 0;
        }
        if (this._isContinuous) {
            realIndex = index;
        }
        else {
            realIndex = parseInt(index.toString(), 10);
        }
        if (realIndex < 0) {
            realIndex = 0;
        }
        return realIndex;
    },
    
    updateByIndex: function tab_SliderMobile$updateByIndex(index) {
        if (ss.isValue(this.slider)) {
            this.slider._setValueAttr(this._getRealIndex(index));
        }
        this.updateReadout(this._getCurrentText(index));
    },
    
    updateReadout: function tab_SliderMobile$updateReadout(text) {
        if (this.styleid < 4) {
            this.readout.innerHTML = text;
        }
    },
    
    _initialLayout: function tab_SliderMobile$_initialLayout() {
        if (!this.shouldShow(this._attrslider)) {
            dojo.addClass(this._div, 'HideSlider');
        }
        if (this.styleid > 3) {
            dojo.style(this._div, 'height', '15px');
        }
    },
    
    layout: function tab_SliderMobile$layout() {
        var arrow_width = 34;
        var overall_height = dojo.marginBox(this._div).h;
        var overall_width = parseInt(dojo.style(this._div, 'width'), 10);
        if (overall_width < arrow_width) {
            return;
        }
        if (ss.isValue(this.readout)) {
            dojo.style(this.readout, 'width', '');
            dojo.style(this.readout, 'float', 'none');
        }
        if (ss.isValue(this.slider)) {
            dojo.style(this.slider.tableauSlider, 'width', '');
            dojo.style(this.slider.tableauSlider, 'float', 'none');
        }
        if (ss.isValue(this._sliderRules) && (this._sliderRules.count * 2 > overall_width)) {
            dojo.style(this._sliderRules.domNode, 'display', 'none');
        }
        if (overall_height < 38 && this.styleid <= 1) {
            var split = (!this.styleid) ? (overall_width - arrow_width) : overall_width;
            split = Math.floor((split - 14) / 2);
            dojo.style(this.readout, 'width', split + 'px');
            dojo.style(this.slider.tableauSlider, 'width', split + 'px');
            dojo.style(this.readout, 'float', 'left');
            dojo.style(this.slider.tableauSlider, 'float', 'left');
        }
        else if (!this.styleid || this.styleid === 4) {
            dojo.style(this.slider.tableauSlider, 'width', overall_width - arrow_width + 'px');
        }
        else if (this.styleid === 1 || this.styleid === 5) {
            dojo.style(this.slider.tableauSlider, 'width', overall_width + 'px');
        }
        else if (this.styleid === 2) {
            dojo.style(this.readout, 'width', overall_width - arrow_width - 4 + 'px');
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.SliderMobileCatmode

tab.SliderMobileCatmode = function tab_SliderMobileCatmode(parent, div, attrs) {
    tab.SliderMobileCatmode.initializeBase(this, [ parent, div, attrs ]);
    this.set_inplaceMobile(new tab.InplaceMobilePopup(this));
}
tab.SliderMobileCatmode.prototype = {
    _catIsHier$2: false,
    _tuples$2: null,
    _popupDisposables$2: null,
    _widget$2: null,
    domNode: null,
    domBox: null,
    _inplaceMobile$2: null,
    
    get_inplaceMobile: function tab_SliderMobileCatmode$get_inplaceMobile() {
        return this._inplaceMobile$2;
    },
    set_inplaceMobile: function tab_SliderMobileCatmode$set_inplaceMobile(value) {
        this._inplaceMobile$2 = value;
        return value;
    },
    
    get_uniqueNodeId: function tab_SliderMobileCatmode$get_uniqueNodeId() {
        return this.parent.id;
    },
    
    get_popup: function tab_SliderMobileCatmode$get_popup() {
        return this.get_inplaceMobile().get_popup();
    },
    
    get_domNodeElement: function tab_SliderMobileCatmode$get_domNodeElement() {
        return this.domNode;
    },
    
    get_domBoxElement: function tab_SliderMobileCatmode$get_domBoxElement() {
        return (ss.isValue(this.parent)) ? this.parent.get_domBox() : this.domBox;
    },
    
    instantiate: function tab_SliderMobileCatmode$instantiate(tuples, itemName, facet) {
        var isAll = tab.FilterItemUtil.isAllOrAllChecked(this.parent);
        this._popupDisposables$2 = new tab.DisposableHolder();
        this._tuples$2 = tuples;
        if (this.shouldUseAllItem()) {
            this._tuples$2.unshift(tab.$create_TupleStruct(tab.Strings.QuickFilterAll, isAll, [ tab.$create_DataValueStruct('i', facet) ]));
        }
        this._widget$2 = new tableau.mobile.widget.ui.SliderMobile(this.div, this.attributes, isAll, ss.Delegate.create(this, this.updateViz), ss.Delegate.create(this.parent, this.parent.getTitleOffset), ss.Delegate.create(this, this.getCurrentText), ss.Delegate.create(this, this.onIntermediateChange), ss.Delegate.create(this, this.getCurrentFacet), this.parent.get_oFilter().showFacets);
        var initValues = this._getInitValues$2(this._tuples$2, this.getSummaryText(), isAll, this.parent.get_oFilter().showFacets);
        this._widget$2._instantiateFromTuples(this._tuples$2, this.getSummaryText());
        this.get_inplaceMobile().setupTouchHandler(this.div);
        this.createPopup(initValues);
    },
    
    _getInitValues$2: function tab_SliderMobileCatmode$_getInitValues$2(t, text, isAll, showFacets) {
        var output = {};
        output.initialText = tab.Strings.QuickFilterUnknown;
        output.currentlySelected = -1;
        if (t.length > 0) {
            var len = t.length;
            for (var i = 0; i < len; i++) {
                if (!!t[i].s && !isAll) {
                    if (output.currentlySelected > -1) {
                        output.initialText = tab.Strings.QuickFilterMultipleValues;
                    }
                    else {
                        output.currentlySelected = i;
                        output.initialText = this.formatTuple(t[i]);
                    }
                }
            }
        }
        if (output.currentlySelected < 0 || this._catIsHier$2) {
            output.currentlySelected = 0;
            if (ss.isValue(text)) {
                output.initialText = text;
            }
        }
        output.showFacets = showFacets;
        output.facet = this.getCurrentFacet(output.currentlySelected);
        output.length = t.length;
        return output;
    },
    
    destroy: function tab_SliderMobileCatmode$destroy() {
        this._popupDisposables$2.dispose();
        this.get_inplaceMobile().disconnectPopup();
        this.get_inplaceMobile().destroyPopup();
    },
    
    createPopup: function tab_SliderMobileCatmode$createPopup(initValues) {
        var popupClass = tableau.mobile.widget.catmode.popup.CategoricalSliderPopup;
        var title = tableau.format.formatColumnDisplayName(this.parent.get_oFilter(), false);
        var popupParams = {};
        popupParams.attributes = this.attributes;
        popupParams.initValues = initValues;
        popupParams.title = title;
        popupParams.mode = 'slider';
        popupParams.qf = this.parent;
        popupParams.hasAllValue = this.shouldUseAllItem();
        popupParams.catIsHier = this._catIsHier$2;
        popupParams.hasExtraControls = { exclInclOnly: true };
        this.get_inplaceMobile().createPopup(popupClass, popupParams);
        this.get_inplaceMobile().connectPopup();
        this.get_popup().setParent(this);
        this.get_popup().add_onPopupSliderChange(ss.Delegate.create(this, this._onPopupSliderChange$2));
        this._popupDisposables$2.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.get_popup().remove_onPopupSliderChange(ss.Delegate.create(this, this._onPopupSliderChange$2));
        })));
        this.get_inplaceMobile().get_popup().createControls();
    },
    
    _onPopupSliderChange$2: function tab_SliderMobileCatmode$_onPopupSliderChange$2(index, propogate) {
        var readoutText = this.getCurrentText(index);
        var facet = this.getCurrentFacet(index);
        this.get_popup().updateReadout(readoutText, facet);
        if (!!propogate) {
            this.updateViz(index);
        }
    },
    
    layout: function tab_SliderMobileCatmode$layout(contentSize, horizontalLayout) {
        this.inherited(arguments);
    },
    
    showOrHide: function tab_SliderMobileCatmode$showOrHide(elem, show) {
        dojo.style(elem, 'display', ((show) ? '' : 'none'));
    },
    
    onSmallSearchUI: function tab_SliderMobileCatmode$onSmallSearchUI(searchIsOn, searchDiv) {
        var show = false;
        var w = this._widget$2;
        if (w.styleid === 2 || w.styleid === 4) {
            this.showOrHide(w.slider.decrementButton, show);
            this.showOrHide(w.slider.incrementButton, show);
        }
        if (w.styleid === 3) {
            this.showOrHide(w._div, show);
            dojo.style(searchDiv, 'marginBottom', '2px');
        }
        else if (w.styleid < 3) {
            this.showOrHide(w.readout, show);
        }
        else {
            this.showOrHide(w.slider.tableauSlider, show);
        }
    },
    
    getRealIndex: function tab_SliderMobileCatmode$getRealIndex(index) {
        if (ss.isNullOrUndefined(index) || isNaN(index)) {
            return 0;
        }
        var intIndex = parseInt(index.toString(), 10);
        if (intIndex < 0) {
            intIndex = 0;
        }
        return intIndex;
    },
    
    updateViz: function tab_SliderMobileCatmode$updateViz(index) {
        var currentState = { schema: this.parent.get_oFilter().table.schema, tuples: [] };
        var aliases = [];
        var realIndex = this.getRealIndex(index);
        if (this.shouldUseAllItem() && !realIndex) {
            this.parent.doSelectAll(true);
            return;
        }
        this._tuples$2[realIndex].s = true;
        (currentState['tuples']).add(this._tuples$2[realIndex]);
        var alias = (this._tuples$2[realIndex].d || this._tuples$2[realIndex].t[0].v);
        aliases.push(alias);
        this.parent.set_stateId(this.parent.get_stateId() + 1);
        tab.FilterClientCommands.setCategoricalFilterValues(this.parent.get_session().get_visualId(), this.parent.get_field(), 'filter-replace', aliases);
    },
    
    onIntermediateChange: function tab_SliderMobileCatmode$onIntermediateChange() {
        if (this.parent.get_searchWidget().get_isVisible()) {
            this.parent.get_searchWidget().toggleUI();
        }
    },
    
    getCurrentText: function tab_SliderMobileCatmode$getCurrentText(index) {
        var realIndex = this.getRealIndex(index);
        var tuple = this._tuples$2[realIndex];
        return this.formatTuple(tuple);
    },
    
    getCurrentFacet: function tab_SliderMobileCatmode$getCurrentFacet(index) {
        var realIndex = this.getRealIndex(index);
        var tuple = this._tuples$2[realIndex];
        return tableau.format.formatTupleDisplayFacet(tuple, true, this.parent.get_oFilter().role);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TiledViewerRegionMobile

tab.TiledViewerRegionMobile = function tab_TiledViewerRegionMobile(regionPart, domNode, session, allowPanZoom, sheetID, viewModel) {
    tab.TiledViewerRegionMobile.initializeBase(this, [ regionPart, domNode, session, allowPanZoom, sheetID, viewModel ]);
    this._scrollContainer$1 = $('.tvMScrolledNode', domNode);
    this._imageContainer$1 = $('.tvimagesContainer', domNode);
    if (regionPart === 'viz') {
        if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.lassoSelection)) {
            this.set_defaultPointerToolMode('lassoSelect');
        }
        else if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.radialSelection)) {
            this.set_defaultPointerToolMode('radialSelect');
        }
        else {
            this.set_defaultPointerToolMode('pan');
        }
        this.set_currentPointerToolMode(this.get_defaultPointerToolMode());
        this.makeDomDrag();
        this.get_shapeSelector().createDomAndAppend(this._scrollContainer$1);
        this.get_shapeSelector().get_dom().css('z-index', '16');
        this.setPointerToolMode(this.get_currentPointerToolMode());
    }
    this._resetDelta$1();
}
tab.TiledViewerRegionMobile.prototype = {
    _scrollContainer$1: null,
    _imageContainer$1: null,
    _delta$1: null,
    
    destroy: function tab_TiledViewerRegionMobile$destroy() {
        this._scrollContainer$1.empty();
        this._scrollContainer$1 = null;
        this._imageContainer$1.empty();
        this._imageContainer$1 = null;
        tab.TiledViewerRegionMobile.callBaseMethod(this, 'destroy');
    },
    
    setGeometry: function tab_TiledViewerRegionMobile$setGeometry(regionGeometry, viewSize, tileSize) {
        tab.TiledViewerRegionMobile.callBaseMethod(this, 'setGeometry', [ regionGeometry, viewSize, tileSize ]);
        this._scrollContainer$1.width(regionGeometry.w);
        this._scrollContainer$1.height(regionGeometry.h);
        (this.scroller).refresh();
    },
    
    setScroller: function tab_TiledViewerRegionMobile$setScroller(newScroller) {
        this.scroller = newScroller;
    },
    
    _areaSelectStart: function tab_TiledViewerRegionMobile$_areaSelectStart(e) {
        this.get_shapeSelector().show();
        var info = e.get_gestureInfo();
        this.get_shapeSelector().dragStarted(info.startX, info.startY, tab.RecordCast.dojoCoordsAsRectXY(this.getLocalOffset(true)));
    },
    
    _areaSelectMove: function tab_TiledViewerRegionMobile$_areaSelectMove(e) {
        this.onMarqueeMouseMove(e);
    },
    
    _areaSelectEnd: function tab_TiledViewerRegionMobile$_areaSelectEnd(e, pane) {
        var selRect = tab.DomUtil.getDojoCoordsJQ(this.get_shapeSelector().get_dom());
        var p = this.toLocalCoords(tab.RecordCast.dojoCoordsAsPoint(selRect));
        this._delta$1 = tab.$create_Delta(p.x, p.y, 1);
        this._delta$1.w = selRect.w;
        this._delta$1.h = selRect.h;
        this.get_shapeSelector().hide();
    },
    
    _panScaleStart: function tab_TiledViewerRegionMobile$_panScaleStart(e, pane) {
        e.preventDefault();
        if (this.waitingOnPanZoomServerResponse !== 'normal' && this.waitingOnPanZoomServerResponse !== 'inProgress') {
            return;
        }
        this.waitingOnPanZoomServerResponse = 'inProgress';
        if (this._allowFeedbackImage$1()) {
            this.setViewportBorderVisibility(true);
            this.backgroundMap.splatOverlayToMapForTransition(tab.TiledViewerRegion.getCanvasElement(this.connectNode));
            this._prepareContainerForPanZoom$1();
        }
    },
    
    _panScale: function tab_TiledViewerRegionMobile$_panScale(e, pane, paneGeometry) {
        if (this.waitingOnPanZoomServerResponse !== 'inProgress') {
            e.preventDefault();
            return;
        }
        var transform = tab.$create_TransformSpec();
        var gestureInfo = e.get_gestureInfo();
        if (this.allowPanZoom()) {
            transform.translateX = (pane.canDragH) ? this._delta$1.x : 0;
            transform.translateY = (pane.canDragV) ? this._delta$1.y : 0;
            transform.translateX += (pane.canDragH) ? gestureInfo.deltaX : 0;
            transform.translateY += (pane.canDragV) ? gestureInfo.deltaY : 0;
            var scaleAdjust = this._getScaleAdjustment$1(e, paneGeometry, false);
            transform.translateX += (pane.canDragH) ? parseInt(scaleAdjust.x) : 0;
            transform.translateY += (pane.canDragV) ? parseInt(scaleAdjust.y) : 0;
            transform.scaleX = (pane.canDragH) ? this._delta$1.scale * gestureInfo.scale : 1;
            transform.scaleY = (pane.canDragV) ? this._delta$1.scale * gestureInfo.scale : 1;
        }
        if (!!transform.translateX || !!transform.translateY) {
            e.preventDefault();
        }
        if (this.allowPanZoom()) {
            if (this.backgroundMap.get_enabled()) {
                this.backgroundMap.touchMove(transform.translateX, transform.translateY, transform.scaleX);
            }
            else {
                tableau.util.transform(this._imageContainer$1.get(0), transform);
            }
        }
    },
    
    _panScaleEnd: function tab_TiledViewerRegionMobile$_panScaleEnd(e, pane, paneGeometry) {
        if (this.waitingOnPanZoomServerResponse !== 'inProgress') {
            e.preventDefault();
            return;
        }
        if (this.allowPanZoom()) {
            this._delta$1.x += (pane.canDragH) ? e.get_gestureInfo().deltaX : 0;
            this._delta$1.y += (pane.canDragV) ? e.get_gestureInfo().deltaY : 0;
            this._delta$1.scale *= e.get_gestureInfo().scale;
            var scaleAdjust = null;
            if (this._delta$1.scale !== 1) {
                if (this.backgroundMap.get_enabled()) {
                }
                else {
                    var transform = tab.$create_TransformSpec();
                    transform.time = 250;
                    var mapDataPM = this.paneTableViewModel.get_mapServerModel().get_mapServerPresModel();
                    transform.scale = tab.ZoomComputer.resolveDesiredScale(mapDataPM, this._delta$1.scale);
                    this._delta$1.scale = transform.scale;
                    e.get_gestureInfo().scale = transform.scale;
                    scaleAdjust = this._getScaleAdjustment$1(e, paneGeometry, false);
                    transform.translateX = this._delta$1.x + ((pane.canDragH) ? parseInt(scaleAdjust.x) : 0);
                    transform.translateY = this._delta$1.y + ((pane.canDragV) ? parseInt(scaleAdjust.y) : 0);
                    tableau.util.transform(this._imageContainer$1.get(0), transform);
                }
            }
            scaleAdjust = this._getScaleAdjustment$1(e, paneGeometry, true);
            this._delta$1.x += (pane.canDragH) ? parseInt(scaleAdjust.x) : 0;
            this._delta$1.y += (pane.canDragV) ? parseInt(scaleAdjust.y) : 0;
        }
    },
    
    _getAndResetDelta: function tab_TiledViewerRegionMobile$_getAndResetDelta() {
        var temp = this._delta$1;
        this._resetDelta$1();
        if (this.waitingOnPanZoomServerResponse === 'inProgress') {
            this.backgroundMap.touchEnd(temp.x, temp.y, temp.scale);
            this.waitingOnPanZoomServerResponse = 'waitingOnServer';
        }
        return temp;
    },
    
    _getCoords: function tab_TiledViewerRegionMobile$_getCoords() {
        return tab.DomUtil.getDojoCoordsJQ(this.connectNode);
    },
    
    _setScrollerScrollTargetToRegionContent: function tab_TiledViewerRegionMobile$_setScrollerScrollTargetToRegionContent() {
        if (this.scroller != null && this.regionContent != null) {
            var scrollableHack = Type.safeCast(this.regionContent, tab.TiledWindow);
            if (scrollableHack == null) {
                scrollableHack = Type.safeCast(this.regionContent, tab.VisualRegionCanvasView);
            }
            (this.scroller).setScrollTarget(scrollableHack);
        }
    },
    
    stopScrolling: function tab_TiledViewerRegionMobile$stopScrolling() {
    },
    
    startScrolling: function tab_TiledViewerRegionMobile$startScrolling(scrollX, scrollY, scrollSpeed) {
    },
    
    determineScrollDirection: function tab_TiledViewerRegionMobile$determineScrollDirection(scrollAxis, outsideViz) {
        return 0;
    },
    
    onRegionContentLoadComplete: function tab_TiledViewerRegionMobile$onRegionContentLoadComplete(sender, e) {
        tab.TiledViewerRegionMobile.callBaseMethod(this, 'onRegionContentLoadComplete', [ sender, e ]);
        this._resetFeedbackImage$1();
    },
    
    _getScaleAdjustment$1: function tab_TiledViewerRegionMobile$_getScaleAdjustment$1(e, paneGeometry, isWithRespectToIndividualPane) {
        var info = e.get_gestureInfo();
        var coords = this._getCoords();
        var mult = 1 - info.scale;
        var xWidths = paneGeometry.xWidths;
        var yHeights = paneGeometry.yHeights;
        var numColumns = xWidths.length;
        var numRows = yHeights.length;
        var paneW = paneGeometry.xWidths[0];
        var paneH = paneGeometry.yHeights[0];
        var allPanesW = paneW * numColumns;
        var allPanesH = paneH * numRows;
        var vizX = info.pageX - coords.x;
        var vizY = info.pageY - coords.y;
        if (isWithRespectToIndividualPane || !tab.ApplicationModel.get_instance().get_isLocalRenderMode()) {
            vizX += this.scroller.get_scrollPos().x;
            vizY += this.scroller.get_scrollPos().y;
        }
        var centerOffsetX = (isWithRespectToIndividualPane) ? (vizX % paneW) - (paneW / 2) : vizX - (allPanesW / 2);
        var centerOffsetY = (isWithRespectToIndividualPane) ? (vizY % paneH) - (paneH / 2) : vizY - (allPanesH / 2);
        return tab.$create_PointF((mult * (centerOffsetX - info.deltaX)), (mult * (centerOffsetY - info.deltaY)));
    },
    
    _resetDelta$1: function tab_TiledViewerRegionMobile$_resetDelta$1() {
        this._delta$1 = tab.$create_Delta(0, 0, 1);
    },
    
    _allowFeedbackImage$1: function tab_TiledViewerRegionMobile$_allowFeedbackImage$1() {
        return this.allowPanZoom();
    },
    
    _resetFeedbackImage$1: function tab_TiledViewerRegionMobile$_resetFeedbackImage$1() {
        this._imageContainer$1.css('clip', 'auto');
        tableau.util.transform(this._imageContainer$1.get(0));
        this.setViewportBorderVisibility(false);
    },
    
    _prepareContainerForPanZoom$1: function tab_TiledViewerRegionMobile$_prepareContainerForPanZoom$1() {
        if (!this._imageContainer$1.size()) {
            return;
        }
        var Px = 'px';
        var BorderInset = 2;
        var coords = tab.DomUtil.getMarginBoxJQ(this._imageContainer$1);
        var clipRect = [BorderInset + Px, (coords.w - BorderInset) + Px, (coords.h - BorderInset) + Px, BorderInset + Px].join(', ');
        clipRect = 'rect(' + clipRect + ')';
        this._imageContainer$1.css('clip', clipRect);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LegacyTooltipBehavior

tab.LegacyTooltipBehavior = function tab_LegacyTooltipBehavior(tooltip) {
    this._disposables = new tab.DisposableHolder();
    tab.Param.verifyValue(tooltip, 'tooltip');
    this._tooltip = tooltip;
    this._tooltip.set_defaultShowCloseButton(false);
}
tab.LegacyTooltipBehavior.prototype = {
    _tooltip: null,
    _isFrozen: false,
    
    attach: function tab_LegacyTooltipBehavior$attach() {
        this._tooltip.add_showed(ss.Delegate.create(this, this._onShowed));
        this._tooltip.add_closed(ss.Delegate.create(this, this._onClose));
        this._tooltip.add_disposed(ss.Delegate.create(this, this._tooltipDisposed));
        spiff.GlobalTouchWatcher.add_firstTouch(ss.Delegate.create(this, this._handleGlobalFirstTouch));
        var config = spiff.$create_EventHandleSpec();
        spiff.TableauEventHandler.setHandler(config, 'potentialTap', ss.Delegate.create(this, this._handlePotentialTap));
        this._disposables.add(new spiff.TableauEventHandler(this._tooltip.get_element()[0], config));
    },
    
    detach: function tab_LegacyTooltipBehavior$detach() {
        this._disposables.dispose();
        if (ss.isValue(this._tooltip)) {
            this._tooltip.remove_showed(ss.Delegate.create(this, this._onShowed));
            this._tooltip.remove_closed(ss.Delegate.create(this, this._onClose));
            this._tooltip.remove_disposed(ss.Delegate.create(this, this._tooltipDisposed));
        }
        spiff.GlobalTouchWatcher.remove_firstTouch(ss.Delegate.create(this, this._handleGlobalFirstTouch));
        this._disposables.dispose();
    },
    
    dispose: function tab_LegacyTooltipBehavior$dispose() {
        this.detach();
    },
    
    shownTooltipIsStatic: function tab_LegacyTooltipBehavior$shownTooltipIsStatic() {
        return true;
    },
    
    isHoverAllowed: function tab_LegacyTooltipBehavior$isHoverAllowed(pageCoords) {
        return false;
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
    },
    
    hoverOverWhitespace: function tab_LegacyTooltipBehavior$hoverOverWhitespace(pageCoords) {
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
    },
    
    showTooltip: function tab_LegacyTooltipBehavior$showTooltip(pageCoords) {
        tab.Log.get(this).debug('ShowTooltip: position=%o', pageCoords);
        if (this._tooltip.get_isShown() && tab.PointUtil.equals(this._tooltip.get_location(), pageCoords)) {
            return;
        }
        this._tooltip.show(this._tooltip.get_body().children()[0], pageCoords);
    },
    
    _onShowed: function tab_LegacyTooltipBehavior$_onShowed(sender, e) {
    },
    
    _onClose: function tab_LegacyTooltipBehavior$_onClose() {
    },
    
    _tooltipDisposed: function tab_LegacyTooltipBehavior$_tooltipDisposed(sender, e) {
        this.dispose();
    },
    
    _handleGlobalFirstTouch: function tab_LegacyTooltipBehavior$_handleGlobalFirstTouch(e, cancelCallback) {
        if (e.target === this._tooltip.get_element()[0]) {
            return;
        }
        tab.Log.get(this).debug(tab.Strings.noLoc('Close if click is outside tooltip'));
        if (!this._tooltip.get_isShown() || ss.isNullOrUndefined(e) || tab.DomUtil.isAncestorOf(this._tooltip.get_element()[0], e.target) || this._isFrozen) {
            return;
        }
        this._tooltip.close();
    },
    
    _handlePotentialTap: function tab_LegacyTooltipBehavior$_handlePotentialTap(e) {
        e.preventDefault();
        e.stopPropagation();
        this._tooltip.close();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TreeModelMobile

tab.TreeModelMobile = function tab_TreeModelMobile(session, field, levels, isSingleSelect) {
    tab.TreeModelMobile.initializeBase(this, [ session, field, levels, isSingleSelect ]);
    this.session = session;
    this.field = field;
    this.isSingleSelect = isSingleSelect;
    this.root = {};
    this.root.schema = null;
    this.root.tuple = tab.$create_TupleStruct('', false, null);
    this.root.label = '$ROOT$';
    this.root.level = -1;
    this.root.children = null;
}
tab.TreeModelMobile.prototype = {
    
    itemsFromTable: function tab_TreeModelMobile$itemsFromTable(data, level) {
        var items = [];
        var tuples = (!!data.table) ? data.table.tuples : null;
        if (!!!data.table) {
            return items;
        }
        for (var i = 0; i < tuples.length; i++) {
            var tuple = tuples[i];
            var displayName = tableau.format.formatTupleDisplayName(tuple);
            var children = null;
            if (!!data.children) {
                children = this.itemsFromTable(data.children[i], level + 1);
            }
            var child = {};
            child.id = tableau.format.formatTupleUniqueName(tuple, null);
            child.schema = data.table.schema;
            child.tuple = tuple;
            child.label = displayName;
            child.level = level;
            child.children = children;
            items.push(child);
        }
        return items;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TreeNodeMobile

tab.TreeNodeMobile = function tab_TreeNodeMobile(options) {
    tab.TreeNodeMobile.initializeBase(this, [ options ]);
}
tab.TreeNodeMobile.prototype = {
    isChecked: false,
    touchHandler: null,
    wipeIn: null,
    wipeOut: null,
    tree: null,
    
    destroy: function tab_TreeNodeMobile$destroy(preserveDom) {
        if (ss.isValue(this.touchHandler)) {
            this.touchHandler.dispose();
        }
        this.inherited(arguments);
    },
    
    updateCheckState: function tab_TreeNodeMobile$updateCheckState() {
        this.isChecked = this.tree.model.isChecked(this.item);
        var checkbox = $(this.labelNode).find('.checkArea');
        if (this.isChecked) {
            checkbox.addClass('checked');
        }
        else {
            checkbox.removeClass('checked');
        }
    },
    
    setLabelNode: function tab_TreeNodeMobile$setLabelNode(label) {
        this.isChecked = this.tree.model.isChecked(this.item);
        var selected = "class='checkArea " + ((this.isChecked) ? " checked'" : "'");
        var html = "<span style='display: inline-block; vertical-align: middle;'";
        if (this.tree.model.isSingleSelect) {
            var itemName = (this.tree.model).field;
            if (!!(this.tree.model).session) {
                itemName += (this.tree.model).session.get_viewId();
            }
            html += " name='FI_" + itemName + "'";
        }
        html += selected;
        html += "></span><a title='" + label + "'>" + label + '</a>';
        this.labelNode.innerHTML = html;
        if (ss.isNullOrUndefined(this.touchHandler)) {
            var spec = spiff.$create_EventHandleSpec();
            spec.potentialTap = ss.Delegate.create(this, this.onFingerUp);
            this.touchHandler = new spiff.TableauEventHandler(this.rowNode, spec);
        }
    },
    
    onFingerUp: function tab_TreeNodeMobile$onFingerUp(e) {
        if (tab.DomUtil.isEqualOrAncestorOf(this.labelNode, e.target)) {
            this._handleLabelTap$3(e);
        }
        else if (tab.DomUtil.isEqualOrAncestorOf(this.expandoNode, e.target)) {
            this.handleExpandoTap(e);
        }
    },
    
    _handleLabelTap$3: function tab_TreeNodeMobile$_handleLabelTap$3(e) {
        this.labelNode.firstChild.checked = !this.tree.model.isChecked(this.item);
        this.isChecked = !dojo.hasClass(this.labelNode.firstChild, 'checked');
        dojo.toggleClass(this.labelNode.firstChild, 'checked', this.isChecked);
        e.level = this.item.level;
        e.isChecked = this.isChecked;
        this.tree.notifyChange(e);
    },
    
    handleExpandoTap: function tab_TreeNodeMobile$handleExpandoTap(e) {
        if (this.isExpanded) {
            this.tree._collapseNode(this);
        }
        else {
            this.tree._expandNode(this);
        }
    },
    
    expand: function tab_TreeNodeMobile$expand() {
        if (this.isExpanded) {
            return;
        }
        if (!!this.wipeOut) {
            this.wipeOut.stop();
        }
        this.isExpanded = true;
        dijit.setWaiState(this.labelNode, 'expanded', 'true');
        dijit.setWaiRole(this.containerNode, 'group');
        this.contentNode.className = 'dijitTreeContent dijitTreeContentExpanded';
        this._setExpando();
        this._updateItemClasses(this.item);
        if (ss.isNullOrUndefined(this.wipeIn)) {
            var options = {};
            options.node = this.containerNode;
            options.duration = dijit.defaultDuration;
            options.onEnd = ss.Delegate.create(this, this.animationCompletionCallback);
            this.wipeIn = dojo.fx.wipeIn(options);
        }
        this.wipeIn.play();
    },
    
    animationCompletionCallback: function tab_TreeNodeMobile$animationCompletionCallback() {
        if (!!this.tree) {
            this.tree.treeSizeChanged();
        }
    },
    
    collapse: function tab_TreeNodeMobile$collapse() {
        if (!this.isExpanded) {
            return;
        }
        if (!!this.wipeIn) {
            this.wipeIn.stop();
        }
        this.isExpanded = false;
        dijit.setWaiState(this.labelNode, 'expanded', 0);
        this.contentNode.className = 'dijitTreeContent';
        this._setExpando();
        this._updateItemClasses(this.item);
        if (ss.isNullOrUndefined(this.wipeOut)) {
            var options = {};
            options.node = this.containerNode;
            options.duration = dijit.defaultDuration;
            options.onEnd = ss.Delegate.create(this, this.animationCompletionCallback);
            this.wipeOut = dojo.fx.wipeOut(options);
        }
        this.wipeOut.play();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.InPlaceTreeNode

tab.InPlaceTreeNode = function tab_InPlaceTreeNode(options) {
    tab.InPlaceTreeNode.initializeBase(this, [ options ]);
}
tab.InPlaceTreeNode.prototype = {
    _checkClass$4: 'HFIMChecked',
    
    updateCheckState: function tab_InPlaceTreeNode$updateCheckState() {
        this.isChecked = this.tree.model.isChecked(this.item);
        var label = $(this.labelNode);
        var checkbox = label.find('.HFIMCheckMark');
        var item = label.find('HFIMItem');
        if (this.isChecked) {
            checkbox.addClass(this._checkClass$4);
            item.addClass(this._checkClass$4);
        }
        else {
            checkbox.removeClass(this._checkClass$4);
            item.removeClass(this._checkClass$4);
        }
    },
    
    setLabelNode: function tab_InPlaceTreeNode$setLabelNode(label) {
        var html = "<span class='HFIMCheckMark __0'>__1</span><span class='HFIMItem __0' title='__2'>__2</span>";
        this.isChecked = this.tree.model.isChecked(this.item);
        html = html.replace(new RegExp('__0', 'g'), (this.isChecked) ? 'HFIMChecked' : '').replace(new RegExp('__1', 'g'), '&nbsp;').replace(new RegExp('__2', 'g'), label);
        this.labelNode.innerHTML = html;
    },
    
    _setExpando: function tab_InPlaceTreeNode$_setExpando() {
        dojo.addClass(this.domNode, 'inplaceTree');
        this.inherited(arguments);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.TreeMobile

tab.TreeMobile = function tab_TreeMobile(param) {
    tab.TreeMobile.initializeBase(this, [ param ]);
}
tab.TreeMobile.prototype = {
    visible: false,
    
    add_treeSizeChangedCalled: function tab_TreeMobile$add_treeSizeChangedCalled(value) {
        this.__treeSizeChangedCalled$3 = ss.Delegate.combine(this.__treeSizeChangedCalled$3, value);
    },
    remove_treeSizeChangedCalled: function tab_TreeMobile$remove_treeSizeChangedCalled(value) {
        this.__treeSizeChangedCalled$3 = ss.Delegate.remove(this.__treeSizeChangedCalled$3, value);
    },
    
    __treeSizeChangedCalled$3: null,
    
    add_onOpenCalled: function tab_TreeMobile$add_onOpenCalled(value) {
        this.__onOpenCalled$3 = ss.Delegate.combine(this.__onOpenCalled$3, value);
    },
    remove_onOpenCalled: function tab_TreeMobile$remove_onOpenCalled(value) {
        this.__onOpenCalled$3 = ss.Delegate.remove(this.__onOpenCalled$3, value);
    },
    
    __onOpenCalled$3: null,
    
    add_onCloseCalled: function tab_TreeMobile$add_onCloseCalled(value) {
        this.__onCloseCalled$3 = ss.Delegate.combine(this.__onCloseCalled$3, value);
    },
    remove_onCloseCalled: function tab_TreeMobile$remove_onCloseCalled(value) {
        this.__onCloseCalled$3 = ss.Delegate.remove(this.__onCloseCalled$3, value);
    },
    
    __onCloseCalled$3: null,
    
    _createTreeNode: function tab_TreeMobile$_createTreeNode(options) {
        options.isChecked = this.model.isChecked(options.item);
        var node = new tableau.mobile._TreeNode(options);
        options.item.node = node;
        return node;
    },
    
    getIconClass: function tab_TreeMobile$getIconClass(item, opened) {
        return 'HFTreeNodeIcon';
    },
    
    getLabelClass: function tab_TreeMobile$getLabelClass(item, opened) {
        return (this.model.isSingleSelect) ? 'HFTreeNodeLabelSS' : 'HFTreeNodeLabel';
    },
    
    focusNode: function tab_TreeMobile$focusNode(node) {
    },
    
    treeSizeChanged: function tab_TreeMobile$treeSizeChanged() {
        if (ss.isValue(this.__treeSizeChangedCalled$3)) {
            this.__treeSizeChangedCalled$3();
        }
    },
    
    onOpen: function tab_TreeMobile$onOpen(item, node) {
        if (ss.isValue(this.__onOpenCalled$3)) {
            this.__onOpenCalled$3(item, node);
        }
    },
    
    onClose: function tab_TreeMobile$onClose(item, node) {
        if (ss.isValue(this.__onCloseCalled$3)) {
            this.__onCloseCalled$3(item, node);
        }
    },
    
    findEarlierNode: function tab_TreeMobile$findEarlierNode(node1, node2, level) {
        return this.rEarlierContained(this.rootNode, 0, node1, node2, level);
    },
    
    rEarlierContained: function tab_TreeMobile$rEarlierContained(searchNode, searchLevel, n1, n2, targetLevel) {
        if (searchLevel > targetLevel) {
            return null;
        }
        else if (searchLevel < targetLevel) {
            var kids = (searchNode).getChildren();
            var $enum1 = ss.IEnumerator.getEnumerator(kids);
            while ($enum1.moveNext()) {
                var node = $enum1.current;
                var result = this.rEarlierContained(node, searchLevel + 1, n1, n2, targetLevel);
                if (!!result) {
                    return result;
                }
            }
        }
        else {
            if (searchNode === n1) {
                return n1;
            }
            if (searchNode === n2) {
                return n2;
            }
        }
        return null;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.InPlaceTree

tab.InPlaceTree = function tab_InPlaceTree(options) {
    tab.InPlaceTree.initializeBase(this, [ options ]);
}
tab.InPlaceTree.prototype = {
    
    _createTreeNode: function tab_InPlaceTree$_createTreeNode(options) {
        options.isChecked = this.model.isChecked(options.item);
        var node = new tableau.mobile._InPlaceTreeNode(options);
        options.item.node2 = node;
        return node;
    },
    
    _onClick: function tab_InPlaceTree$_onClick(e) {
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ViewingToolbarMobile

tab.ViewingToolbarMobile = function tab_ViewingToolbarMobile(app, isTop) {
    tab.ViewingToolbarMobile.initializeBase(this, [ app, isTop ]);
    this._touchFeedback$1 = $('<div>').addClass('tab-toolbar-button-feedback');
}
tab.ViewingToolbarMobile.prototype = {
    _touchFeedback$1: null,
    _sharePopup$1: null,
    
    bindEvents: function tab_ViewingToolbarMobile$bindEvents() {
        tab.ViewingToolbarMobile.callBaseMethod(this, 'bindEvents');
        var $enum1 = ss.IEnumerator.getEnumerator(spiff.Widget.getWidgets(this.toolbarElement.find('.tab-toolbar-button'), tab.ToolbarButton));
        while ($enum1.moveNext()) {
            var button = $enum1.current;
            button.get_clickHandler().onPress(ss.Delegate.create(this, this._showTouchFeedback$1));
        }
    },
    
    makeCustomViewsPanel: function tab_ViewingToolbarMobile$makeCustomViewsPanel(viewModel, toolbarButton) {
        return new tab.CustomViewsPanelMobile(viewModel, toolbarButton);
    },
    
    makeMenuView: function tab_ViewingToolbarMobile$makeMenuView(viewModel) {
        return new spiff.MenuViewMobile(viewModel);
    },
    
    makeShareButtons: function tab_ViewingToolbarMobile$makeShareButtons() {
        var buttons = [];
        var shareButton;
        if (tsConfig.isPublic) {
            shareButton = new tab.ToolbarTextButton(ss.Delegate.create(this, this._showSharePopup$1));
        }
        else {
            shareButton = new tab.ToolbarTextButton(ss.Delegate.create(this, this.shareButtonClicked));
        }
        shareButton.setLeftIcon('tab-icon-share').setText(tab.Strings.ToolbarShare);
        shareButton.get_element().addClass('wcShareButton');
        if (tsConfig.isPublic) {
            shareButton.get_element().addClass('tab-toolbar-share-text-button-public');
        }
        buttons.add(shareButton);
        if (tsConfig.isPublic) {
            var facebookButton = new tab.ToolbarIconButton(ss.Delegate.create(this, this._showSharePopup$1));
            facebookButton.setIcon('tab-icon-facebook');
            facebookButton.get_element().addClass('tab-icon-public');
            buttons.add(facebookButton);
            var twitterButton = new tab.ToolbarIconButton(ss.Delegate.create(this, this._showSharePopup$1));
            twitterButton.setIcon('tab-icon-twitter');
            twitterButton.get_element().addClass('tab-icon-public');
            buttons.add(twitterButton);
            var mailButton = new tab.ToolbarIconButton(ss.Delegate.create(this, this._showSharePopup$1));
            mailButton.setIcon('tab-icon-mail');
            mailButton.get_element().addClass('tab-icon-public');
            buttons.add(mailButton);
        }
        buttons.forEach(ss.Delegate.create(this.disposables, this.disposables.add));
        return buttons;
    },
    
    _showSharePopup$1: function tab_ViewingToolbarMobile$_showSharePopup$1() {
        if (!ss.isValue(this._sharePopup$1)) {
            this._sharePopup$1 = new tab.SharePopup(ss.Delegate.create(this, this.facebookButtonClicked), ss.Delegate.create(this, this.twitterButtonClicked), ss.Delegate.create(this, this.mailButtonClicked));
            this.leftElement.append(this._sharePopup$1.get_element());
        }
        this._sharePopup$1.show();
    },
    
    _showTouchFeedback$1: function tab_ViewingToolbarMobile$_showTouchFeedback$1(e) {
        this._touchFeedback$1.css({ opacity: '1' });
        this._touchFeedback$1.appendTo($(e.target));
        this._touchFeedback$1.animate({ opacity: '0' }, 'slow', 'swing', ss.Delegate.create(this, function() {
            this._touchFeedback$1.detach();
        }));
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CurrentPagePanelPopup

tab.CurrentPagePanelPopup = function tab_CurrentPagePanelPopup() {
    tab.CurrentPagePanelPopup.initializeBase(this);
}
tab.CurrentPagePanelPopup.prototype = {
    params: null,
    srcRefNode: null,
    
    get_contentAsPagePanelContent: function tab_CurrentPagePanelPopup$get_contentAsPagePanelContent() {
        return this.get_content();
    },
    
    get__asScrollListener$2: function tab_CurrentPagePanelPopup$get__asScrollListener$2() {
        return this;
    },
    
    postCreate: function tab_CurrentPagePanelPopup$postCreate() {
        this.params.parentPopup = this;
        this.set_content(new tableau.mobile.widget.catmode.popup.CurrentPagePanelContent(this.params, this.domContent));
        this.inherited(arguments);
        dojo.addClass(this.domNode, 'Medium');
        if (ss.isNullOrUndefined(this.params.title)) {
            dojo.style(this.get_title(), 'display', 'none');
            dojo.style(this._layoutContainer.domNode, 'border', 'none');
        }
        this.get__asScrollListener$2().setupScrollListener(this.get_contentAsPagePanelContent().dropdown.iscrollObj);
    },
    
    destroy: function tab_CurrentPagePanelPopup$destroy() {
        this.get_contentAsPagePanelContent().destroy();
        this.inherited(arguments);
    },
    
    prepareToHide: function tab_CurrentPagePanelPopup$prepareToHide() {
        this.get_contentAsPagePanelContent().prepareToHide();
    },
    
    _refreshContent: function tab_CurrentPagePanelPopup$_refreshContent(pages, page, enable) {
        this.get_contentAsPagePanelContent().refreshContent(pages, page, enable);
        this.get__asScrollListener$2().setupScrollListener(this.get_contentAsPagePanelContent().dropdown.iscrollObj);
    },
    
    getContentDimensions: function tab_CurrentPagePanelPopup$getContentDimensions() {
        return dojo.marginBox(this.get_contentAsPagePanelContent().domNode);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CurrentPagePanelContent

tab.CurrentPagePanelContent = function tab_CurrentPagePanelContent(popupParams, srcRefNode) {
    this.templateString = "<div class='CurrentPagePanelContent'>" + "<div style='height:50px; width:100%;' dojoAttachPoint='_buttonsPane'>" + "<div dojoAttachPoint='_leftButton' style='width:44px; height:44px; display:${show_dropdown}; float:left;'>" + "<div class='leftButton' style='margin:10px 0 0 14px;'></div>" + '</div>' + "<div dojoAttachPoint='_dropDownButton' class='' style='display:${show_dropdown} width: 50%; float:left; height:44px; width:65%;'>" + "<div class='CurrentPageTitle' style='padding-top:13px; overflow:hidden; color:#3b3f42;' dojoAttachPoint='_currentTitle'>${current_page_label}</div>" + '</div>' + "<div dojoAttachPoint='_rightButton' style='display:${show_dropdown}; float:right; width:44px; height:44px;'>" + "<div class='rightButton' style='margin:10px 0 0 14px;'></div>" + '</div>' + "<span style='clear:both;'></span>" + '</div>' + "<div style='width:100%;'>" + "<div dojoAttachPoint='_dropdownPane' style='background-color:white; border:1px solid grey; width:99%;'>" + "<div dojoAttachPoint='_scrollAttachPoint'></div>" + '</div>' + '</div>' + "<div style='width:100%; height:65px;' dojoAttachPoint='_sliderWrapper'>" + "<div dojoAttachPoint='_sliderAttachPoint'></div>" + '</div>' + "<div style='height: 39px; width:100%;' class='History' dojoAttachPoint='_historyWrapper'>" + "<div dojoAttachPoint='_history'></div>" + '</div>' + '</div>';
    this._disposables$1 = new tab.DisposableHolder();
    tab.CurrentPagePanelContent.initializeBase(this);
    this._pageViewModel$1 = popupParams.viewModel;
    this.touchHandlers = [];
    this.historyTouchHandler = null;
    this.subscriptions = [];
    this.items = popupParams.items;
    this._dropDownVisible = false;
    this.show_dropdown = false;
    this.dropdown_display = 'none';
    this.trails_enabled = false;
}
tab.CurrentPagePanelContent.prototype = {
    current_page: 0,
    dropdown_display: null,
    show_dropdown: false,
    trails_enabled: false,
    title: '',
    current_page_label: '',
    items: null,
    itemsAsTupleStruct: null,
    dropdown: null,
    singleSlider: null,
    parentPopup: null,
    touchHandlers: null,
    historyTouchHandler: null,
    subscriptions: null,
    _dropDownVisible: false,
    toggle: null,
    _rightButton: null,
    _leftButton: null,
    _history: null,
    _historyWrapper: null,
    _scrollAttachPoint: null,
    _dropDownButton: null,
    _dropdownPane: null,
    _buttonsPane: null,
    _sliderAttachPoint: null,
    show_slider: false,
    _sliderWrapper: null,
    _currentTitle: null,
    _pageViewModel$1: null,
    
    add_leftPressed: function tab_CurrentPagePanelContent$add_leftPressed(value) {
        this.__leftPressed$1 = ss.Delegate.combine(this.__leftPressed$1, value);
    },
    remove_leftPressed: function tab_CurrentPagePanelContent$remove_leftPressed(value) {
        this.__leftPressed$1 = ss.Delegate.remove(this.__leftPressed$1, value);
    },
    
    __leftPressed$1: null,
    
    add_rightPressed: function tab_CurrentPagePanelContent$add_rightPressed(value) {
        this.__rightPressed$1 = ss.Delegate.combine(this.__rightPressed$1, value);
    },
    remove_rightPressed: function tab_CurrentPagePanelContent$remove_rightPressed(value) {
        this.__rightPressed$1 = ss.Delegate.remove(this.__rightPressed$1, value);
    },
    
    __rightPressed$1: null,
    
    add_toggleHistoryCalled: function tab_CurrentPagePanelContent$add_toggleHistoryCalled(value) {
        this.__toggleHistoryCalled$1 = ss.Delegate.combine(this.__toggleHistoryCalled$1, value);
    },
    remove_toggleHistoryCalled: function tab_CurrentPagePanelContent$remove_toggleHistoryCalled(value) {
        this.__toggleHistoryCalled$1 = ss.Delegate.remove(this.__toggleHistoryCalled$1, value);
    },
    
    __toggleHistoryCalled$1: null,
    
    add_applyChangeCalled: function tab_CurrentPagePanelContent$add_applyChangeCalled(value) {
        this.__applyChangeCalled$1 = ss.Delegate.combine(this.__applyChangeCalled$1, value);
    },
    remove_applyChangeCalled: function tab_CurrentPagePanelContent$remove_applyChangeCalled(value) {
        this.__applyChangeCalled$1 = ss.Delegate.remove(this.__applyChangeCalled$1, value);
    },
    
    __applyChangeCalled$1: null,
    
    add_applyChangeFromSliderCalled: function tab_CurrentPagePanelContent$add_applyChangeFromSliderCalled(value) {
        this.__applyChangeFromSliderCalled$1 = ss.Delegate.combine(this.__applyChangeFromSliderCalled$1, value);
    },
    remove_applyChangeFromSliderCalled: function tab_CurrentPagePanelContent$remove_applyChangeFromSliderCalled(value) {
        this.__applyChangeFromSliderCalled$1 = ss.Delegate.remove(this.__applyChangeFromSliderCalled$1, value);
    },
    
    __applyChangeFromSliderCalled$1: null,
    
    postMixInProperties: function tab_CurrentPagePanelContent$postMixInProperties() {
        this.current_page_label = (this.items[this.current_page] || '');
        this.dropdown_display = (this.show_dropdown) ? '' : 'none';
    },
    
    postCreate: function tab_CurrentPagePanelContent$postCreate() {
        this.inherited(arguments);
        this.itemsAsTupleStruct = this._formatAsTuples$1(this.items);
        this._setupDropdown$1();
        this._history.innerHTML = tableau.mobile.FilterItemMobile.getScrollingListRowHtml(null, tab.Strings.CurrentPagePanelShowHistory, null, false, this.trails_enabled, false, false);
        this.toggle = this._history.firstChild;
        var historyToggleConfig = spiff.$create_EventHandleSpec();
        historyToggleConfig.firstTouch = ss.Delegate.create(this, this._toggleHistory$1);
        this.historyTouchHandler = new spiff.TableauEventHandler(this.toggle, historyToggleConfig);
        if (!this._pageViewModel$1.get_showHistoryToggleForPopup()) {
            dojo.style(this._historyWrapper, 'display', 'none');
        }
        this._setupSlider$1();
        this._updateButtons$1(this.current_page);
    },
    
    syncEverything: function tab_CurrentPagePanelContent$syncEverything(index) {
        if (index < this.itemsAsTupleStruct.length) {
            var label = this.itemsAsTupleStruct[index].d;
            this._setDropdownState$1(label, index);
        }
        this._setSliderPos$1(index);
        this._updateButtons$1(index);
    },
    
    refreshContent: function tab_CurrentPagePanelContent$refreshContent(pages, page, enable) {
        dojo.forEach(this.touchHandlers, function(th) {
            th.destroy();
        });
        this._disposables$1.dispose();
        this.items = pages;
        this.itemsAsTupleStruct = this._formatAsTuples$1(pages);
        this.current_page = page;
        this._setupDropdown$1();
        this._setupSlider$1();
        if (ss.isValue(enable)) {
            dojo.toggleClass(this.toggle, 'checked', enable);
            this.trails_enabled = enable;
        }
        this._updateButtons$1(this.current_page);
        this.syncEverything(this.current_page);
        if (this._dropDownVisible) {
            this._showDropdown$1();
        }
    },
    
    _setupDropdown$1: function tab_CurrentPagePanelContent$_setupDropdown$1() {
        if (ss.isValue(this.dropdown)) {
            dojo.forEach(this.touchHandlers, function(th) {
                th.destroy();
            });
            this.dropdown.destroy();
        }
        var config = {};
        config.listItems = this.itemsAsTupleStruct;
        this.dropdown = tab.ScrollingList.createScrollingList(config);
        this.dropdown.placeAt(this._scrollAttachPoint, 'after');
        dojo.style(this._dropdownPane, 'display', 'none');
        var buttonConfigLeft = spiff.$create_EventHandleSpec();
        buttonConfigLeft.firstTouch = this.__leftPressed$1;
        this.touchHandlers.push(new spiff.TableauEventHandler(this._leftButton, buttonConfigLeft));
        var buttonConfigRight = spiff.$create_EventHandleSpec();
        buttonConfigRight.firstTouch = this.__rightPressed$1;
        this.touchHandlers.push(new spiff.TableauEventHandler(this._rightButton, buttonConfigRight));
        var buttonConfigPreventDefault = spiff.$create_EventHandleSpec();
        buttonConfigPreventDefault.doubleTap = function(e) {
            e.preventDefault();
        };
        this.touchHandlers.push(new spiff.TableauEventHandler(this._leftButton, buttonConfigPreventDefault));
        this.touchHandlers.push(new spiff.TableauEventHandler(this._rightButton, buttonConfigPreventDefault));
        var buttonConfigToggle = spiff.$create_EventHandleSpec();
        buttonConfigToggle.firstTouch = ss.Delegate.create(this, this._toggleDropdown$1);
        this.touchHandlers.push(new spiff.TableauEventHandler(this._dropDownButton, buttonConfigToggle));
        var callback = ss.Delegate.create(this, function(changedListItem, listIndex) {
            this._applyChange$1(listIndex, true);
        });
        this.dropdown.add_dispatchItemsChanged(callback);
        this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.dropdown.remove_dispatchItemsChanged(callback);
        })));
        if (!this.show_dropdown) {
            dojo.style(this._dropdownPane, 'display', 'none');
            dojo.style(this._buttonsPane, 'display', 'none');
        }
    },
    
    _setupSlider$1: function tab_CurrentPagePanelContent$_setupSlider$1() {
        if (ss.isValue(this.singleSlider)) {
            this.singleSlider.destroy();
        }
        var sliderParams = {};
        sliderParams.bShowSlider = true;
        sliderParams.length = this.items.length;
        sliderParams.currentlySelected = this.current_page;
        this.singleSlider = new tableau.mobile.widget.catmode.popup.SingleSlider(sliderParams);
        this.singleSlider.placeAt(this._sliderAttachPoint, 'after');
        this.singleSlider.setParent(this.parentPopup);
        this.singleSlider.startup();
        this.singleSlider.add_onPopupSliderChange(ss.Delegate.create(this, this._applyChangeFromSlider$1));
        this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.singleSlider.remove_onPopupSliderChange(ss.Delegate.create(this, this._applyChangeFromSlider$1));
        })));
        dojo.style(this.singleSlider._leftButton, 'display', 'none');
        dojo.style(this.singleSlider._rightButton, 'display', 'none');
        dojo.style(this.singleSlider._singleSliderWrapper, 'width', '300px');
        if (!this.show_slider) {
            dojo.style(this._sliderWrapper, 'display', 'none');
        }
    },
    
    _toggleDropdown$1: function tab_CurrentPagePanelContent$_toggleDropdown$1(e) {
        if (this._dropDownVisible) {
            this._hideDropdown$1();
        }
        else {
            this._showDropdown$1();
        }
    },
    
    _hideDropdown$1: function tab_CurrentPagePanelContent$_hideDropdown$1() {
        this._dropDownVisible = false;
        dojo.style(this._dropdownPane, 'display', 'none');
        this.dropdown.iscrollObj.refresh();
        this.parentPopup.doResize(null, null);
    },
    
    _showDropdown$1: function tab_CurrentPagePanelContent$_showDropdown$1() {
        this._dropDownVisible = true;
        dojo.style(this._dropdownPane, 'display', '');
        var height = this.dropdown.getListSize();
        var computedHeight = Math.max(Math.min(44 * 4, height), 0) + 'px';
        dojo.style(this.dropdown.scrollWrapper, 'height', computedHeight);
        this.dropdown.iscrollObj.refresh();
        this.parentPopup.doResize(null, null);
    },
    
    _updateButtons$1: function tab_CurrentPagePanelContent$_updateButtons$1(index) {
        dojo.toggleClass(this._rightButton, 'disabled', index >= this.items.length - 1);
        dojo.toggleClass(this._leftButton, 'disabled', !index);
    },
    
    _toggleHistory$1: function tab_CurrentPagePanelContent$_toggleHistory$1(e) {
        tab.FilterItemUtil.toggleClassState(this.toggle, 'checked');
        if (ss.isValue(this.__toggleHistoryCalled$1)) {
            this.__toggleHistoryCalled$1();
        }
    },
    
    _applyChange$1: function tab_CurrentPagePanelContent$_applyChange$1(index, propagate) {
        this.syncEverything(index);
        if (ss.isValue(this.__applyChangeCalled$1)) {
            this.__applyChangeCalled$1(index, propagate);
        }
    },
    
    _applyChangeFromSlider$1: function tab_CurrentPagePanelContent$_applyChangeFromSlider$1(idx, propagate) {
        var index = idx;
        var label = this.itemsAsTupleStruct[index].d;
        this._setDropdownState$1(label, index);
        this._updateButtons$1(index);
        if (ss.isValue(this.__applyChangeFromSliderCalled$1)) {
            this.__applyChangeFromSliderCalled$1(index, propagate);
        }
    },
    
    _setDropdownState$1: function tab_CurrentPagePanelContent$_setDropdownState$1(label, index) {
        this._currentTitle.innerHTML = label;
        this.dropdown.clearAll();
        this.dropdown.setSelectedAtIndex(index, true);
    },
    
    _setSliderPos$1: function tab_CurrentPagePanelContent$_setSliderPos$1(index) {
        var pixelPosition = this.singleSlider.convertIndexToPixels(index);
        this.singleSlider.setSliderPosition(pixelPosition);
    },
    
    _formatAsTuples$1: function tab_CurrentPagePanelContent$_formatAsTuples$1(itemsList) {
        var l = itemsList.length;
        var tuples = [];
        for (var i = 0; i < l; i++) {
            tuples.push(tab.$create_TupleStruct(itemsList[i], i === this.current_page, [ tab.$create_DataValueStruct('s', itemsList[i]) ]));
        }
        return tuples;
    },
    
    destroy: function tab_CurrentPagePanelContent$destroy() {
        this.historyTouchHandler.destroy();
        dojo.forEach(this.touchHandlers, function(th) {
            th.destroy();
        });
        this._disposables$1.dispose();
        dojo.forEach(this.subscriptions, dojo.unsubscribe);
        this.dropdown.destroy();
        this.singleSlider.destroy();
        this.inherited(arguments);
    },
    
    prepareToHide: function tab_CurrentPagePanelContent$prepareToHide() {
        this._hideDropdown$1();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.IPopupMobile

tab.IPopupMobile = function() { };
tab.IPopupMobile.prototype = {
    add_dispatchItemsChanged : null,
    remove_dispatchItemsChanged : null,
    get_searchWidget : null,
    get_title : null,
    get_list : null,
    get_content : null,
    update : null,
    postMixInProperties : null,
    createControls : null,
    dispose : null,
    destroy : null,
    isVisible : null,
    doResize : null,
    hide : null,
    show : null,
    layoutPopupUsingAsyncHelpers : null,
    layoutPopup : null
}
tab.IPopupMobile.registerInterface('tab.IPopupMobile');


////////////////////////////////////////////////////////////////////////////////
// tab.StepperControlViewMobile

tab.StepperControlViewMobile = function tab_StepperControlViewMobile(viewModel) {
    tab.StepperControlViewMobile.initializeBase(this, [ viewModel, new tab.MobileStepperControlTemplate() ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.MobileStepperControlTemplate

tab.MobileStepperControlTemplate = function tab_MobileStepperControlTemplate() {
    tab.MobileStepperControlTemplate.initializeBase(this, [ "<div class='tabStepperControl'>\n            <div class='tabDecrementButton' />\n            <input class='tabStepCountValue' type='text'></input>\n            <div class='tabIncrementButton' />\n        </div>" ]);
    this.decrementButton = this.getElementBySelector('.tabDecrementButton');
    this.incrementButton = this.getElementBySelector('.tabIncrementButton');
    this.valueText = this.getElementBySelector('.tabStepCountValue');
}


tableau.mobile.util.scaling.registerClass('tableau.mobile.util.scaling');
tab.CategoricalLegendViewMobile.registerClass('tab.CategoricalLegendViewMobile', tab.CategoricalLegendView);
tab.CategoricalLegendTemplateMobile.registerClass('tab.CategoricalLegendTemplateMobile', tab.CategoricalLegendTemplate);
tab.MapsSearchViewMobile.registerClass('tab.MapsSearchViewMobile', tab.MapsSearchView);
tab.DragDropAndScrollHandler.registerClass('tab.DragDropAndScrollHandler', null, ss.IDisposable);
tab.TooltipLegacyMode.registerClass('tab.TooltipLegacyMode', tab.TooltipBaseLegacyMode);
tab.ContinuousSliderMobile.registerClass('tab.ContinuousSliderMobile', tab.ContinuousSlider);
tab.PaneTableViewMobile.registerClass('tab.PaneTableViewMobile', tab.PaneTableView);
tab.FZTOpsMobile.registerClass('tab.FZTOpsMobile', null, tab.IFloatingZoomToolbarOps);
tab.PaneTableTemplateMobile.registerClass('tab.PaneTableTemplateMobile', tab.PaneTableTemplate);
tab.ParameterControlViewMobile.registerClass('tab.ParameterControlViewMobile', tab.ParameterControlView);
tab.QuickFilterDisplayViewMobile.registerClass('tab.QuickFilterDisplayViewMobile', tab.QuickFilterDisplayView);
tab.BasePopupMobile.registerClass('tab.BasePopupMobile', dijit._Widget, ss.IDisposable, tab.IPopupMobile);
tab.DropdownMobile.registerClass('tab.DropdownMobile', tab.BaseMode, tab.IInplaceMobilePopupWidget);
tab.CheckDropdownMobile.registerClass('tab.CheckDropdownMobile', tab.DropdownMobile);
tab.ChecklistMobile.registerClass('tab.ChecklistMobile', tab.Checklist, tab.IInplaceMobilePopupWidget);
tab.HierarchicalFilterMobile.registerClass('tab.HierarchicalFilterMobile', tab.HierarchicalFilter, ss.IDisposable, tab.IInplaceMobilePopupWidget);
tab.CategoricalSliderPopup.registerClass('tab.CategoricalSliderPopup', tab.BasePopupMobile);
tab.ControlsToolbar.registerClass('tab.ControlsToolbar', dijit._Widget);
tab.PopupTypeInWidget.registerClass('tab.PopupTypeInWidget', null, ss.IDisposable);
tab.PopupValueTypeInWidget.registerClass('tab.PopupValueTypeInWidget', tab.PopupTypeInWidget);
tab.PopupFormattedValueTypeInWidget.registerClass('tab.PopupFormattedValueTypeInWidget', tab.PopupValueTypeInWidget);
tab.CustomValueListPopup.registerClass('tab.CustomValueListPopup', tab.BasePopupMobile);
tab.ListPopup.registerClass('tab.ListPopup', tab.BasePopupMobile);
tab.PatternPopup.registerClass('tab.PatternPopup', tab.BasePopupMobile);
tab.PopupListTypeInWidget.registerClass('tab.PopupListTypeInWidget', tab.PopupTypeInWidget);
tab.ScrollingList.registerClass('tab.ScrollingList', dijit._Widget);
tab.ScrollListener.registerClass('tab.ScrollListener', null, ss.IDisposable);
tab.TypeInMobile.registerClass('tab.TypeInMobile', tab.BaseMode, tab.IInplaceMobilePopupWidget);
tab.PatternMobile.registerClass('tab.PatternMobile', tab.BaseMode, tab.IInplaceMobilePopupWidget);
tab.RadiolistMobile.registerClass('tab.RadiolistMobile', tab.Radiolist, tab.IInplaceMobilePopupWidget);
tab.DojoWidgetsMobile.registerClass('tab.DojoWidgetsMobile');
tab.DoubleSliderMobile.registerClass('tab.DoubleSliderMobile', dijit._Widget);
tab.FeedbackMobile.registerClass('tab.FeedbackMobile');
tab.TapFeedback.registerClass('tab.TapFeedback', dijit._Widget, ss.IDisposable);
tab.PressFeedback.registerClass('tab.PressFeedback', dijit._Widget, ss.IDisposable);
tab.HierarchicalControlPopup.registerClass('tab.HierarchicalControlPopup', tab.BasePopupMobile);
tab.HierarchicalControlContentMobile.registerClass('tab.HierarchicalControlContentMobile', dijit._Widget, ss.IDisposable);
tab.InplaceMobilePopup.registerClass('tab.InplaceMobilePopup', null, tab.IInplaceMobile);
tab.OptionsWidgetMobile.registerClass('tab.OptionsWidgetMobile', tab.ScrollingList);
tab.MobileWindowAppender.registerClass('tab.MobileWindowAppender', tab.BaseLogAppender, ss.IDisposable);
tab.ApplicationViewModelMobile.registerClass('tab.ApplicationViewModelMobile', tab.ApplicationViewModel);
tab.LegacyLegendViewMobile.registerClass('tab.LegacyLegendViewMobile', tab.LegacyLegendView);
tab.LegacyLegendTemplateMobile.registerClass('tab.LegacyLegendTemplateMobile', tab.LegacyLegendTemplate);
tab.PageViewMobile.registerClass('tab.PageViewMobile', tab.PageView);
tab.AccordionViewMobile.registerClass('tab.AccordionViewMobile', tab.AccordionView);
tab.CategoricalFilterMobile.registerClass('tab.CategoricalFilterMobile', tab.CategoricalFilter);
tab.ComboBoxViewMobile.registerClass('tab.ComboBoxViewMobile', tab.ComboBoxView);
tab.CurrentPagePanelMobile.registerClass('tab.CurrentPagePanelMobile', tab.CurrentPagePanel, ss.IDisposable, tab.IInplaceMobilePopupWidget);
tab.CustomViewsPanelMobile.registerClass('tab.CustomViewsPanelMobile', tab.CustomViewsPanel);
tab.ExportPdfDialogMobile.registerClass('tab.ExportPdfDialogMobile', tab.ExportPdfDialog);
tableau.mobile.FilterItemMobile.registerClass('tableau.mobile.FilterItemMobile');
tab.FilterPanelMobile.registerClass('tab.FilterPanelMobile', tab.FilterPanel);
tab.FloatingZoomToolbarMobile.registerClass('tab.FloatingZoomToolbarMobile', tab.FloatingZoomToolbar);
tab.HorizontalSliderMobile.registerClass('tab.HorizontalSliderMobile', dijit.form.HorizontalSlider);
tableau.mobile.widget.ui.SliderDojoMobile.registerClass('tableau.mobile.widget.ui.SliderDojoMobile', tab.HorizontalSliderMobile);
tab.ParameterControlMobile.registerClass('tab.ParameterControlMobile', tab.ParameterControl);
tab.ParamUITypeInMobile.registerClass('tab.ParamUITypeInMobile', tab.ParamUIBase, tab.IInplaceMobilePopupWidget);
tab.ParamUICompactMobile.registerClass('tab.ParamUICompactMobile', tab.ParamUIBase, tab.IInplaceMobilePopupWidget);
tab.ParamUIListMobile.registerClass('tab.ParamUIListMobile', tab.ParamUIBase, tab.IInplaceMobilePopupWidget);
tab.ParamUISliderMobile.registerClass('tab.ParamUISliderMobile', tab.ParamUISlider, tab.IInplaceMobilePopupWidget);
tab.PendingChangesManagerMobile.registerClass('tab.PendingChangesManagerMobile', tab.PendingChangesManager);
tab.PopupFactory.registerClass('tab.PopupFactory');
tab.QuantitativeFilterMobile.registerClass('tab.QuantitativeFilterMobile', tab.QuantitativeFilter, ss.IDisposable, tab.IInplaceMobilePopupWidget);
tab.QuantitativeDateFilterMobile.registerClass('tab.QuantitativeDateFilterMobile', tab.QuantitativeFilterMobile);
tab.QuantitativeSliderPopup.registerClass('tab.QuantitativeSliderPopup', tab.BasePopupMobile);
tab.QuantReadoutsMobile.registerClass('tab.QuantReadoutsMobile', dijit._Widget);
tab.RelativeDateFilterDialogMobile.registerClass('tab.RelativeDateFilterDialogMobile', tab.DateFilterWidget);
tab.RelativeDateFilterMobile.registerClass('tab.RelativeDateFilterMobile', tab.RelativeDateFilter, tab.IInplaceMobilePopupWidget);
tab.RelativeDateFilterPopup.registerClass('tab.RelativeDateFilterPopup', tab.BasePopupMobile);
tab.RelativeDatePickFilterMobile.registerClass('tab.RelativeDatePickFilterMobile', tab.RelativeDatePickFilter, tab.IInplaceMobilePopupWidget);
tab.SearchWidgetMobile.registerClass('tab.SearchWidgetMobile', tab.SearchWidget, tab.ISearchWidgetMobile, ss.IDisposable);
tab.FilteringSearchWidgetMobile.registerClass('tab.FilteringSearchWidgetMobile', tab.SearchWidgetMobile);
tab.ScrollingListRow.registerClass('tab.ScrollingListRow', dijit._Widget);
tab.SharePopup.registerClass('tab.SharePopup', spiff.Widget);
tab.SingleSliderMobile.registerClass('tab.SingleSliderMobile', dijit._Widget);
tab.SliderDojo.registerClass('tab.SliderDojo');
tab.SliderMobile.registerClass('tab.SliderMobile', null, tab.ISlider);
tab.SliderMobileCatmode.registerClass('tab.SliderMobileCatmode', tab.BaseMode, tab.IInplaceMobilePopupWidget);
tab.TiledViewerRegionMobile.registerClass('tab.TiledViewerRegionMobile', tab.TiledViewerRegion);
tab.LegacyTooltipBehavior.registerClass('tab.LegacyTooltipBehavior', null, tab.ITooltipBehavior, ss.IDisposable);
tab.TreeModelMobile.registerClass('tab.TreeModelMobile', tab.TreeSupport);
tab.TreeNodeMobile.registerClass('tab.TreeNodeMobile', tab.TreeNode);
tab.InPlaceTreeNode.registerClass('tab.InPlaceTreeNode', tab.TreeNodeMobile);
tab.TreeMobile.registerClass('tab.TreeMobile', tab.Tree);
tab.InPlaceTree.registerClass('tab.InPlaceTree', tab.TreeMobile);
tab.ViewingToolbarMobile.registerClass('tab.ViewingToolbarMobile', tab.ViewingToolbar);
tab.CurrentPagePanelPopup.registerClass('tab.CurrentPagePanelPopup', tab.BasePopupMobile);
tab.CurrentPagePanelContent.registerClass('tab.CurrentPagePanelContent', dijit._Widget);
tab.StepperControlViewMobile.registerClass('tab.StepperControlViewMobile', tab.StepperControlView);
tab.MobileStepperControlTemplate.registerClass('tab.MobileStepperControlTemplate', tab.StepperControlTemplate);
tableau.mobile.util.scaling._scaleFactor = null;
tableau.mobile.util.scaling._scaleToFactor = null;
(function () {
    spiff.ObjectRegistry.registerType(tab.CategoricalLegendView, tab.CategoricalLegendViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.MapsSearchView, tab.MapsSearchViewMobile);
})();
tab.DragDropAndScrollHandler._touchBecomesGestureDistanceSquared = 12 * 12;
tab.DragDropAndScrollHandler._dragInProgress = false;
tab.DragDropAndScrollHandler._scrollInProgress = false;
(function () {
    spiff.ObjectRegistry.registerType(tab.TooltipBaseLegacyMode, tab.TooltipLegacyMode);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ContinuousSlider, tab.ContinuousSliderMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.PaneTableView, tab.PaneTableViewMobile);
})();
tab.PaneTableTemplateMobile.htmlTemplate = "<div class='tab-tiledViewer placeholder'>" + "<div class='tab-clip'>" + "<div class='tab-tvTLSpacer tvMobileRegion'><img></img></div>" + "<div class='tab-tvTRSpacer tvMobileRegion'><img></img></div>" + "<div class='tab-tvBLSpacer tvMobileRegion'><img></img></div>" + "<div class='tab-tvBRSpacer tvMobileRegion'><img></img></div>" + "<div class='tab-tvYLabel tvMobileRegion'><div class='tvMScrollContainer'>" + "<div class='tvMScrolledNode'><div class='tvimagesContainer'></div></div></div></div>" + "<div class='tab-tvLeftAxis tvMobileRegion'><div class='tvMScrollContainer'>" + "<div class='tvMScrolledNode'><div class='tvimagesContainer'></div></div></div></div>" + "<div class='tab-tvRightAxis tvMobileRegion'><div class='tvMScrollContainer'>" + "<div class='tvMScrolledNode'><div class='tvimagesContainer'></div></div></div></div>" + "<div class='tab-tvXLabel tvMobileRegion'><div class='tvMScrollContainer'>" + "<div class='tvMScrolledNode'><div class='tvimagesContainer'></div></div></div></div>" + "<div class='tab-tvBottomAxis tvMobileRegion'><div class='tvMScrollContainer'>" + "<div class='tvMScrolledNode'><div class='tvimagesContainer'></div></div></div></div>" + "<div class='tab-tvTopAxis tvMobileRegion'><div class='tvMScrollContainer'>" + "<div class='tvMScrolledNode'><div class='tvimagesContainer'></div></div></div></div>" + "<div class='tab-tvView tvMobileRegion'>" + "<div class='tvMScrollContainer'>" + "<div class='tvMScrolledNode'>" + "<div class='tvBackgroundContainer'></div>" + "<div class='tvimagesContainer'></div>" + '</div>' + "<div class='tvViewportBorders'></div>" + '</div>' + '</div>' + "<div class='tab-tvTitle tvMobileRegion'></div>" + "<div class='tab-tvCaption tvMobileRegion'></div>" + '</div>' + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.ParameterControlView, tab.ParameterControlViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.QuickFilterDisplayView, tab.QuickFilterDisplayViewMobile);
})();
tab.BasePopupMobile.basePopupTemplate = "<div class='BasePopup' dojoAttachPoint='containerNode'>" + "<div class='PopupShadow' dojoAttachPoint='_shadowNode'></div>" + "<div class='PopupOuterContainer'>" + "<div class='PopupBorder' dojoAttachPoint='_borderNode'></div>" + "<div class='PopupContainer' dojoAttachPoint='contentContainerNode'>" + "<div class='BasePopupTitleBar' dojoAttachPoint='_title'>" + "<div class='BasePopupTitle' dojoAttachPoint='_titleContents'>${title}</div>" + "<span dojoAttachPoint='_tools'></span>" + '</div>' + "<div dojoType='dijit.layout.LayoutContainer' style='height:280px; border-top: 1px solid #FAFBFC;' dojoAttachPoint='_layoutContainer'>" + "<div class='SearchPane' dojoType='dijit.layout.ContentPane' layoutAlign='top'" + "dojoAttachPoint='_searchPane'>" + "<div dojoAttachPoint='domSearch'></div>" + "<div dojoAttachPoint='domOptions'></div>" + '</div>' + "<div dojoType='dijit.layout.ContentPane' layoutAlign='client'>" + "<div dojoAttachPoint='domContent'></div>" + '</div>' + "<div class='ApplyPane' dojoType='dijit.layout.ContentPane' layoutAlign='bottom'" + "dojoAttachPoint='_applyPane'>" + "<div dojoAttachPoint='domApplyButton'></div>" + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
(function () {
    dojo.require('tableau.mobile.MobileClient');
    var superClasses = null;
    superClasses = [ dijit._Widget, dijit._Contained, dijit._Templated ];
    (tab.BasePopupMobile).prototype.templateString = tab.BasePopupMobile.basePopupTemplate;
    dojo.declare('tableau.mobile.widget.catmode.popup.BasePopup', superClasses, (tab.BasePopupMobile).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.ScrollingList', superClasses, (tab.ScrollingList).prototype);
    dojo.declare('tableau.mobile.widget.catmode.popup.ScrollListener', null, (tab.ScrollListener).prototype);
    superClasses = [ tableau.mobile.widget.catmode.popup.BasePopup ];
    dojo.declare('tableau.mobile.widget.catmode.popup.CategoricalSliderPopup', superClasses, (tab.CategoricalSliderPopup).prototype);
    superClasses = [ tableau.mobile.widget.catmode.popup.BasePopup, tableau.mobile.widget.catmode.popup.ScrollListener ];
    dojo.declare('tableau.mobile.widget.catmode.popup.CustomValueListPopup', superClasses, (tab.CustomValueListPopup).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.feedback.TapFeedback', superClasses, (tab.TapFeedback).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.feedback.PressFeedback', superClasses, (tab.PressFeedback).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.ControlsToolbar', superClasses, (tab.ControlsToolbar).prototype);
    superClasses = [ tableau.base.widget.QuantitativeFilter ];
    dojo.declare('tableau.mobile.widget.QuantitativeFilterMobile', superClasses, (tab.QuantitativeFilterMobile).prototype);
    superClasses = [ tableau.mobile.widget.QuantitativeFilterMobile ];
    dojo.declare('tableau.mobile.widget.QuantitativeDateFilterMobile', superClasses, (tab.QuantitativeDateFilterMobile).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.QuantReadouts', superClasses, (tab.QuantReadoutsMobile).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.SingleSlider', superClasses, (tab.SingleSliderMobile).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.DoubleSlider', superClasses, (tab.DoubleSliderMobile).prototype);
    dojo.declare('tableau.mobile.widget.catmode.popup.PopupTypeInWidget', new Array(0), (tab.PopupTypeInWidget).prototype);
    dojo.declare('tableau.mobile.widget.catmode.popup.PopupListTypeInWidget', [ tableau.mobile.widget.catmode.popup.PopupTypeInWidget ], (tab.PopupListTypeInWidget).prototype);
    dojo.declare('tableau.mobile.widget.catmode.popup.PopupValueTypeInWidget', [ tableau.mobile.widget.catmode.popup.PopupTypeInWidget ], (tab.PopupValueTypeInWidget).prototype);
    dojo.declare('tableau.mobile.widget.catmode.popup.PopupFormattedValueTypeInWidget', [ tableau.mobile.widget.catmode.popup.PopupValueTypeInWidget ], (tab.PopupFormattedValueTypeInWidget).prototype);
    dojo.declare('tableau.mobile.widget.catmode.popup.PatternPopup', [ tableau.mobile.widget.catmode.popup.BasePopup ], (tab.PatternPopup).prototype);
    superClasses = [ tableau.mobile.widget.catmode.popup.BasePopup ];
    dojo.declare('tableau.mobile.widget.catmode.popup.QuantitativeSliderPopup', superClasses, (tab.QuantitativeSliderPopup).prototype);
    superClasses = [ tableau.mobile.widget.catmode.popup.BasePopup, tableau.mobile.widget.catmode.popup.ScrollListener ];
    dojo.declare('tableau.mobile.widget.catmode.popup.CurrentPagePanelPopup', superClasses, (tab.CurrentPagePanelPopup).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.CurrentPagePanelContent', superClasses, (tab.CurrentPagePanelContent).prototype);
    dojo.declare('tableau.mobile.widget.CategoricalFilterMobile', [ tableau.base.widget.CategoricalFilter ], (tab.CategoricalFilterMobile).prototype);
    superClasses = [ tableau.base.widget.CurrentPagePanel ];
    dojo.declare('tableau.mobile.widget.CurrentPagePanelMobile', superClasses, (tab.CurrentPagePanelMobile).prototype);
    dojo.declare('tableau.mobile.widget.ui.SliderMobile', new Array(0), (tab.SliderMobile).prototype);
    dojo.declare('tableau.mobile.widget.ui.SliderDojoMobile', [ dijit.form.HorizontalSlider ], (tab.HorizontalSliderMobile).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.ScrollingListRow', superClasses, (tab.ScrollingListRow).prototype);
    dojo.declare('tableau.mobile.widget.OptionsWidgetMobile', [ tableau.mobile.widget.catmode.popup.ScrollingList ], (tab.OptionsWidgetMobile).prototype);
    dojo.declare('tableau.mobile.widget.catmode.popup.PopupFactory', null, (tab.PopupFactory).prototype);
    superClasses = [ tableau.base.widget.catmode.BaseMode ];
    dojo.declare('tableau.mobile.widget.catmode.SliderMobile', superClasses, (tab.SliderMobileCatmode).prototype);
    superClasses = [ tableau.base.widget.catmode.BaseMode ];
    dojo.declare('tableau.mobile.widget.catmode.RadiolistMobile', superClasses, (tab.RadiolistMobile).prototype);
    superClasses = [ tableau.base.widget.catmode.BaseMode ];
    dojo.declare('tableau.mobile.widget.catmode.DropdownMobile', superClasses, (tab.DropdownMobile).prototype);
    superClasses = [ tableau.base.widget.catmode.Checklist ];
    dojo.declare('tableau.mobile.widget.catmode.ChecklistMobile', superClasses, (tab.ChecklistMobile).prototype);
    superClasses = [ tableau.base.widget.catmode.BaseMode ];
    dojo.declare('tableau.mobile.widget.catmode.TypeInMobile', superClasses, (tab.TypeInMobile).prototype);
    superClasses = [ tableau.base.widget.catmode.BaseMode ];
    dojo.declare('tableau.mobile.widget.catmode.PatternMobile', superClasses, (tab.PatternMobile).prototype);
    dojo.declare('tableau.mobile.widget.ParameterControlMobile', [ tableau.base.widget.ParameterControl ], (tab.ParameterControlMobile).prototype);
    superClasses = [ tableau.base.widget.paramui.Base ];
    dojo.declare('tableau.mobile.widget.paramui.TypeIn', superClasses, (tab.ParamUITypeInMobile).prototype);
    superClasses = [ tableau.base.widget.paramui.Base ];
    dojo.declare('tableau.mobile.widget.paramui.Compact', superClasses, (tab.ParamUICompactMobile).prototype);
    superClasses = [ tableau.base.widget.paramui.Base ];
    dojo.declare('tableau.mobile.widget.paramui.List', superClasses, (tab.ParamUIListMobile).prototype);
    superClasses = [ tableau.base.widget.paramui.Slider ];
    dojo.declare('tableau.mobile.widget.paramui.Slider', superClasses, (tab.ParamUISliderMobile).prototype);
    superClasses = [ tableau.base.widget.SearchWidget, tableau.mobile.widget.catmode.popup.ScrollListener ];
    dojo.declare('tableau.mobile.widget.SearchWidgetMobile', superClasses, (tab.SearchWidgetMobile).prototype);
    dojo.declare('tableau.mobile.widget.FilteringSearchWidgetMobile', [ tableau.mobile.widget.SearchWidgetMobile ], (tab.FilteringSearchWidgetMobile).prototype);
    superClasses = [ dijit._Widget, dijit._Contained, dijit._Templated, tableau.base.widget.RelativeDateFilter ];
    dojo.declare('tableau.mobile.widget.RelativeDateFilterMobile', superClasses, (tab.RelativeDateFilterMobile).prototype);
    superClasses = [ tableau.base.widget.RelativeDatePickFilter ];
    dojo.declare('tableau.mobile.widget.RelativeDatePickFilterMobile', superClasses, (tab.RelativeDatePickFilterMobile).prototype);
    superClasses = [ dijit.layout._LayoutWidget, dijit._Templated, tableau.base.widget.FilterPanel ];
    dojo.declare('tableau.mobile.widget.FilterPanelMobile', superClasses, (tab.FilterPanelMobile).prototype);
    superClasses = [ tableau.base.widget.HierarchicalFilter ];
    dojo.declare('tableau.mobile.widget.HierarchicalFilterMobile', superClasses, (tab.HierarchicalFilterMobile).prototype);
    dojo.declare('tableau.mobile.Tree', tableau.base.widget.hsm.Tree, (tab.TreeMobile).prototype);
    dojo.declare('tableau.mobile._TreeNode', dijit._TreeNode, (tab.TreeNodeMobile).prototype);
    dojo.declare('tableau.mobile._InPlaceTreeNode', tableau.mobile._TreeNode, (tab.InPlaceTreeNode).prototype);
    dojo.declare('tableau.mobile.InPlaceTree', tableau.mobile.Tree, (tab.InPlaceTree).prototype);
    dojo.declare('tableau.mobile.TreeModel', tableau.base.widget.hsm.TreeModel, (tab.TreeModelMobile).prototype);
    superClasses = [ tableau.mobile.widget.catmode.popup.BasePopup, tableau.mobile.widget.catmode.popup.ScrollListener ];
    dojo.declare('tableau.mobile.widget.catmode.popup.ListPopup', superClasses, (tab.ListPopup).prototype);
    superClasses = [ tableau.mobile.widget.catmode.popup.BasePopup, tableau.mobile.widget.catmode.popup.ScrollListener ];
    dojo.declare('tableau.mobile.widget.catmode.popup.HierarchicalControlPopup', superClasses, (tab.HierarchicalControlPopup).prototype);
    superClasses = [ dijit._Widget, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.catmode.popup.HierarchicalControlContentMobile', superClasses, (tab.HierarchicalControlContentMobile).prototype);
    superClasses = [ tableau.mobile.widget.catmode.DropdownMobile ];
    dojo.declare('tableau.mobile.widget.catmode.CheckDropdownMobile', superClasses, (tab.CheckDropdownMobile).prototype);
    superClasses = [ tableau.mobile.widget.catmode.popup.BasePopup ];
    dojo.declare('tableau.mobile.widget.RelativeDateFilterPopup', superClasses, (tab.RelativeDateFilterPopup).prototype);
    superClasses = [ tab.DateFilterWidget, dijit._Contained, dijit._Templated ];
    dojo.declare('tableau.mobile.widget.RelativeDateFilterDialogMobile', superClasses, (tab.RelativeDateFilterDialogMobile).prototype);
})();
tab.FeedbackMobile._tapCreationCount = 0;
tab.FeedbackMobile._currentTaps = {};
tab.FeedbackMobile._unusedTaps = [];
tab.FeedbackMobile._pressFeedback = null;
(function () {
    window.setTimeout(function() {
        tab.FeedbackMobile._initTapFeedback(2);
    }, 500);
})();
tab.MobileWindowAppender._globalAppender$1 = null;
(function () {
    spiff.ObjectRegistry.registerType(tab.LegacyLegendView, tab.LegacyLegendViewMobile);
})();
tab.LegacyLegendTemplateMobile._htmlTemplate$3 = "<div class='LegendPanel'>" + "<div class='LegendBox'>" + "<div class='tabLegendTitle'></div>" + "<div class='LegendContentBox'>" + "<div class='LegendContent'>" + "<img class='LegendImageBody'/>" + '</div>' + '</div>' + '</div>' + "<div class='" + tab.LegendTemplate.legendHighlighterClass + "'/>" + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.PageView, tab.PageViewMobile);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.AccordionView, tab.AccordionViewMobile);
})();
tab.PopupTypeInWidget.dateInputType = 'date';
tab.PopupTypeInWidget.datetimeLocalInputType = 'datetime-local';
tab.PopupTypeInWidget.textInputType = 'text';
(function () {
    spiff.ObjectRegistry.registerType(tab.ComboBoxView, tab.ComboBoxViewMobile);
})();
tab.CurrentPagePanelMobile._mobileTemplateString$3 = "<div class='MobilePanel' dojoAttachPoint='containerNode'>" + "<div class='MobilePanelBox' dojoAttachPoint='domBox'>" + "<div dojoAttachPoint='_titlePane' style='border:0; float:left;'></div>" + "<div dojoType='dijit.layout.SplitContainer' persist='false' dojoAttachPoint='innerWrapper' orientation='${cpOrientation}' sizerWidth='0' dragRestriction='true' activeSizing='false' style='float:left;'>" + "<div dojoType='dijit.layout.LayoutContainer' sizeShare='24' sizeMin='24' style='display:${display_dropdown};' dojoAttachPoint='buttonsContainer'>" + "<button dojoType='dijit.form.Button' layoutAlign='left' style='margin:0; margin-right:2px;' iconClass='dijitIcon cpLeftArrowBlack' showLabel='false' dojoAttachPoint='_leftBtn'></button>" + "<div dojoAttachPoint='_dropdown' layoutAlign='client' style='margin:3px 26px 0 26px; overflow:hidden;'></div>" + "<button dojoType='dijit.form.Button' layoutAlign='right' style='clear: left; margin:0; margin-left:2px;' iconClass='dijitIcon cpRightArrowBlack' showLabel='false' dojoAttachPoint='_rightBtn'></button>" + '</div>' + "<div dojoType='dijit.layout.ContentPane' sizeShare='24' sizeMin='24' style='display:${display_slider}; padding:6px 5px 0 10px; border:0; overflow:hidden;' dojoAttachPoint='sliderPane'>" + "<div dojoType='dijit.form.HorizontalSlider' slideDuration='0'" + "pageIncrement='1' minimum='0' maximum='${maximum}' discreteValues='${discrete_values}' intermediateChanges='true' showButtons='false'" + "dojoAttachPoint='_slider'></div>" + "<div dojoAttachPoint='_horizontalRuleNode'></div>" + '</div>' + '</div>' + "<div dojoType='dijit.layout.ContentPane' dojoAttachPoint='_checkboxPane' style='padding:0; height:16px; width:110px; display:${display_toggle}; border:0; position:relative; float:left;'>" + "<div style='display:inline-block;height:16px'><span id='_showHistoryCb' dojoAttachPoint='_showHistoryCb' class='FIMCheckMark' style='margin-left:5px; height:15px;'></span></div>" + '</div>' + '</div>' + "<div class='MobilePanelBorderOuter'><div class='MobilePanelBorderInner'></div></div" + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.ExportPdfDialog, tab.ExportPdfDialogMobile);
})();
(function () {
    tableau.FilterItem = tableau.mobile.FilterItemMobile;
})();
tab.PopupFactory._popupObjectArray = [];
tab.QuantitativeFilterMobile._mobileTemplateString$3 = "<div class='MobilePanel QuantitativeFilterMobile'>" + "<div class='MobilePanelBox QuantitativeFilterMobileBox' dojoAttachPoint='domBox'>" + "<div class='TitleAndControls' dojoAttachPoint='domControls'>" + "<div class='QFMTitle' dojoAttachPoint='domTitleBar'></div>" + '</div>' + "<div class='QFMContent' dojoAttachPoint='domContent'>" + "<div class='QFMReadout QFMLowerBound tab-ctrl-formatted-fixedsize' dojoAttachPoint='domLowerBound'>" + "<div dojoAttachPoint='domLowerText' class='QFMReadoutText'></div>" + '</div>' + "<div class='QFMReadout QFMUpperBound tab-ctrl-formatted-fixedsize' dojoAttachPoint='domUpperBound'>" + "<div dojoAttachPoint='domUpperText' class='QFMReadoutText'></div>" + '</div>' + "<div dojoAttachPoint='domBar' class='QFMSlider QFMBar'>" + "<div dojoAttachPoint='domRange' class='QFMRange'>" + "<div dojoAttachPoint='domHighlight' class='QFMRangeHighlight'></div>" + '</div>' + '</div>' + "<span dojoAttachPoint='domLowerImg' class='QFMSlider QFMImg'></span>" + "<span dojoAttachPoint='domUpperImg' class='QFMSlider QFMImg'></span>" + '</div>' + '</div>' + "<div class='MobilePanelBorderOuter'><div class='MobilePanelBorderInner'></div></div>" + '</div>';
tab.RelativeDateFilterMobile._mobileTemplateString$4 = "<div class='MobilePanel RelativeDateFilter'>" + "<div class='MobilePanelBox RelativeDateFilterBox' dojoAttachPoint='domBox'>" + "<div class='TitleAndControls' dojoAttachPoint='domControls'>" + "<div class='FilterTitle' dojoAttachPoint='domTitleBar'></div>" + '</div>' + "<div class='Readout tab-ctrl-formatted-fixedsize' dojoAttachPoint='domReadout'></div>" + '</div>' + "<div class='MobilePanelBorderOuter'><div class='MobilePanelBorderInner'></div></div>" + '</div>';
tab.RelativeDatePickFilterMobile._mobileTemplate$3 = "<div class='MobilePanel RelativeDatePickFilter'>" + "<div class='MobilePanelBox RelativeDatePickFilterBox' dojoAttachPoint='domBox'>" + "<div class='TitleAndControls' dojoAttachPoint='domControls'>" + "<div class='FilterTitle' dojoAttachPoint='domTitleBar'></div>" + "<div class='PicklistContentDiv tab-ctrl-formatted-fixedsize' dojoAttachPoint='domPicker'></div>" + '</div>' + '</div>' + "<div class='MobilePanelBorderOuter'><div class='MobilePanelBorderInner'></div></div>" + '</div>';
tab.SearchWidgetMobile.mobileTemplateString = "<div class='Search'>" + "<div class='SearchBox' dojoAttachPoint='domQuerySection' style='height:30px;'>" + "<input type='text' class='QueryBox' spellcheck='false' autocapitalize='off' autocorrect='off' style='padding-top:5px; font-size:12pt; font-weight:bold;'" + "dojoAttachPoint='domQueryBox'" + "dojoAttachEvent='onkeydown:onQueryBoxKeyDown,onpaste:onQueryBoxPaste' />" + "<span class='wcSearchX' title='${XBUTTON_CLOSE_TOOLTIP}'" + "dojoAttachPoint='domXButton'></span>" + "<img class='searchBusyImg' title='${CANCEL_SEARCH_TOOLTIP}' src='${busy_gif_url}'" + "dojoAttachPoint='domSearchBusyImg'></img>" + "<span class='wcIconSearch' title='${SEARCH_TOOLTIP}'" + "dojoAttachPoint='domSearchButton'></span>" + "<span class='wcIconSearchAdd' title='${ADD_ITEM_CTRL_ENTER}'" + "dojoAttachPoint='domSearchAddButton'></span>" + '</div>' + "<div class='SearchResults' dojoAttachPoint='domResults'></div>" + '</div>';
(function () {
    spiff.ObjectRegistry.registerType(tab.ITooltipBehavior, tab.LegacyTooltipBehavior);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.StepperControlView, tab.StepperControlViewMobile);
})();
tab.MobileStepperControlTemplate.template = "<div class='tabStepperControl'>\n            <div class='tabDecrementButton' />\n            <input class='tabStepCountValue' type='text'></input>\n            <div class='tabIncrementButton' />\n        </div>";
});

//! This script was generated using Script# v0.7.4.0
