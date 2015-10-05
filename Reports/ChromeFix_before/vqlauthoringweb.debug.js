//! vqlauthoringweb.debug.js
//

dojo.addOnLoad(function() {

Type.registerNamespace('tab');

////////////////////////////////////////////////////////////////////////////////
// tab.CalculationDialogViewWeb

tab.CalculationDialogViewWeb = function tab_CalculationDialogViewWeb(viewModel) {
    tab.CalculationDialogViewWeb.initializeBase(this, [ viewModel ]);
    this.initDom();
    this.disposables.add(spiff.EventUtil.bindWithDispose($(window), 'resize', ss.Delegate.create(this, function() {
        this.ensureDialogIsOnScreen();
    })));
}


////////////////////////////////////////////////////////////////////////////////
// tab.CategoricalColorOptionViewWeb

tab.CategoricalColorOptionViewWeb = function tab_CategoricalColorOptionViewWeb(viewModel) {
    tab.CategoricalColorOptionViewWeb.initializeBase(this, [ viewModel ]);
    this.createTransparencyControl();
}
tab.CategoricalColorOptionViewWeb.prototype = {
    
    createTransparencyControl: function tab_CategoricalColorOptionViewWeb$createTransparencyControl() {
        this.set_colorTransparencyControlView(spiff.ObjectRegistry.newView(tab.ColorTransparencyControlView, this.colorOptionViewModel.get_colorTransparencyControlViewModel()));
        this.get_colorTransparencyControlView().createTransparencySettings(this.colorOptionViewModel.get_colorTransparencyControlViewModel());
    },
    
    commitChangesInView: function tab_CategoricalColorOptionViewWeb$commitChangesInView() {
        this.get_colorTransparencyControlView().commitTransparencyPercentageText();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorTransparencyControlViewWeb

tab.ColorTransparencyControlViewWeb = function tab_ColorTransparencyControlViewWeb(viewModel) {
    tab.ColorTransparencyControlViewWeb.initializeBase(this, [ viewModel ]);
}
tab.ColorTransparencyControlViewWeb.prototype = {
    _transparencyTextValue$3: null,
    _transparencyTextField$3: null,
    
    createSlider: function tab_ColorTransparencyControlViewWeb$createSlider(rangeModel) {
        tab.ColorTransparencyControlViewWeb.callBaseMethod(this, 'createSlider', [ rangeModel ]);
        this.sliderViewModel.set_pixelWidth(100);
        this.sliderViewModel.set_ruleTickCount(4);
        this.sliderViewModel.add_intermediateChange(ss.Delegate.create(this, this._updateTransparencyText$3));
        this.disposables.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this.sliderViewModel.remove_intermediateChange(ss.Delegate.create(this, this._updateTransparencyText$3));
        })));
        this._createTransparencyTextBox$3();
    },
    
    _createTransparencyTextBox$3: function tab_ColorTransparencyControlViewWeb$_createTransparencyTextBox$3() {
        this._transparencyTextField$3 = $("<input type='text'>").addClass('tabAuthTransparencyPercentageText');
        this._transparencyTextField$3.attr('maxlength', '3');
        this._updateTransparencyText$3(this.sliderViewModel.get_currentFraction());
        this._transparencyTextField$3.keydown(tableau.util.preventNonNumericInput);
        this._transparencyTextField$3.keyup(ss.Delegate.create(this, this._keyUpHandler$3)).blur(ss.Delegate.create(this, function() {
            this.commitTransparencyPercentageText();
        }));
    },
    
    onAddedToDom: function tab_ColorTransparencyControlViewWeb$onAddedToDom() {
        tab.ColorTransparencyControlViewWeb.callBaseMethod(this, 'onAddedToDom');
        var sliderView = spiff.ObjectRegistry.newView(tab.ContinuousSlider, this.sliderViewModel);
        var transparencyControlHolder = $('<div>').addClass('tabAuthTransparencyControlHolder');
        var transparencySliderContainer = $('<span>').addClass('tabAuthTransparencySliderContainer').append(sliderView.get_element());
        transparencyControlHolder.append(transparencySliderContainer);
        transparencyControlHolder.append(this._transparencyTextField$3);
        transparencyControlHolder.append($('<span>%</span>').addClass('tabAuthTransparencyPercentageSign'));
        this.get_element().append(transparencyControlHolder);
        sliderView.onAddedToDom();
    },
    
    _keyUpHandler$3: function tab_ColorTransparencyControlViewWeb$_keyUpHandler$3(e) {
        if (e.which === 13) {
            this.commitTransparencyPercentageText();
        }
    },
    
    commitTransparencyPercentageText: function tab_ColorTransparencyControlViewWeb$commitTransparencyPercentageText() {
        var textValue = this._transparencyTextField$3.val();
        if (this._transparencyTextValue$3 === textValue) {
            return;
        }
        var transparencyPercent = parseInt(textValue);
        if (isNaN(transparencyPercent) || transparencyPercent > 100) {
            this._transparencyTextField$3.val(this._transparencyTextValue$3);
            return;
        }
        var transform = new tab.LinearRangeTransform(0, 100);
        var alphaValue = transform.valueToFraction(transparencyPercent);
        this.sliderViewModel.set_currentFraction(alphaValue);
        this._transparencyTextValue$3 = this._transparencyTextField$3.val();
    },
    
    _updateTransparencyText$3: function tab_ColorTransparencyControlViewWeb$_updateTransparencyText$3(value) {
        var transform = new tab.LinearRangeTransform(0, 100);
        var intVal = Math.round(transform.fractionToValue(value));
        this._transparencyTextField$3.val(intVal.toString());
        this._transparencyTextValue$3 = this._transparencyTextField$3.val();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LinePatternPickerViewWeb

tab.LinePatternPickerViewWeb = function tab_LinePatternPickerViewWeb(viewModel) {
    tab.LinePatternPickerViewWeb.initializeBase(this, [ viewModel ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.StrokeWidthPickerViewWeb

tab.StrokeWidthPickerViewWeb = function tab_StrokeWidthPickerViewWeb(viewModel) {
    tab.StrokeWidthPickerViewWeb.initializeBase(this, [ viewModel ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorOptionViewWeb

tab.QuantitativeColorOptionViewWeb = function tab_QuantitativeColorOptionViewWeb(viewModel) {
    tab.QuantitativeColorOptionViewWeb.initializeBase(this, [ viewModel, new tab.QuantitativeColorOptionTemplateWeb() ]);
    this.createColorControls();
    this.createTransparencyControl();
}
tab.QuantitativeColorOptionViewWeb.prototype = {
    
    createTransparencyControl: function tab_QuantitativeColorOptionViewWeb$createTransparencyControl() {
        this.set_colorTransparencyControlView(spiff.ObjectRegistry.newView(tab.ColorTransparencyControlView, this.colorOptionViewModel.get_colorTransparencyControlViewModel()));
        this.get_colorTransparencyControlView().createTransparencySettings(this.colorOptionViewModel.get_colorTransparencyControlViewModel());
    },
    
    commitChangesInView: function tab_QuantitativeColorOptionViewWeb$commitChangesInView() {
        this.get_stepperControlView().commitStepValueText();
        this.get_colorTransparencyControlView().commitTransparencyPercentageText();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.QuantitativeColorOptionTemplateWeb

tab.QuantitativeColorOptionTemplateWeb = function tab_QuantitativeColorOptionTemplateWeb() {
    tab.QuantitativeColorOptionTemplateWeb.initializeBase(this, [ $("<div class='tabAuthQuantitativeColorOptionContent'>\n    <div class='tabColorPalettePickerContainer'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthColorReverseControl'/>\n    <div class='tabColorSteps'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthTransparencyControlContainer'/>\n</div>") ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarkSizePickerViewWeb

tab.MarkSizePickerViewWeb = function tab_MarkSizePickerViewWeb(viewModel) {
    tab.MarkSizePickerViewWeb.initializeBase(this, [ viewModel ]);
    var sliderView = spiff.ObjectRegistry.newView(tab.ContinuousSlider, this.sliderViewModel);
    this.get_element().append(sliderView.get_element());
}


////////////////////////////////////////////////////////////////////////////////
// tab.TextEncodingOptionViewWeb

tab.TextEncodingOptionViewWeb = function tab_TextEncodingOptionViewWeb(vm) {
    tab.TextEncodingOptionViewWeb.initializeBase(this, [ vm ]);
    this.dom.get_domRoot().append(tableau.util.createCheckBox(ss.Delegate.create(this, this.handleToggleLabel), this.textOptionViewModel.get_controlLabel(), tab.TextEncodingOptionView.marksLabelCheckClass, 3, this.textOptionViewModel.get_labelsOn(), this.disposables));
}
tab.TextEncodingOptionViewWeb.prototype = {
    
    handleToggleLabel: function tab_TextEncodingOptionViewWeb$handleToggleLabel(e) {
        this.textOptionViewModel.toggleLabels();
    },
    
    handleLabelsOnChanged: function tab_TextEncodingOptionViewWeb$handleLabelsOnChanged(labelsOn) {
        this.dom.getElementBySelector('input').prop('checked', labelsOn);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab._scrollBounds

tab.$create__scrollBounds = function tab__scrollBounds() { return {}; }


////////////////////////////////////////////////////////////////////////////////
// tab.PanelState

tab.PanelState = function() { };
tab.PanelState.prototype = {
    collapsed: 0, 
    expanded: 1
}
tab.PanelState.registerEnum('tab.PanelState', false);


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringMastheadViewWeb

tab.AuthoringMastheadViewWeb = function tab_AuthoringMastheadViewWeb(vm) {
    tab.AuthoringMastheadViewWeb.initializeBase(this, [ vm ]);
}
tab.AuthoringMastheadViewWeb.prototype = {
    
    layout: function tab_AuthoringMastheadViewWeb$layout() {
        var windowHelper = new tab.WindowHelper(window.self);
        var maxWorkbookNameDomWidth = windowHelper.get_innerWidth() - this.logoDom.outerWidth() - this.userLinksAreaDom.outerWidth() - this.workbookNameDom.parent().offset().left;
        this.workbookNameDom.css('max-width', maxWorkbookNameDomWidth + 'px');
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringTabNavViewWeb

tab.AuthoringTabNavViewWeb = function tab_AuthoringTabNavViewWeb(viewModel) {
    tab.AuthoringTabNavViewWeb.initializeBase(this, [ viewModel ]);
    this.updateContent();
    this.disposables.add(spiff.ClickHandler.targetAndClick(this.dom.menuButton, ss.Delegate.create(this, function(e) {
        this._menuButtonClicked$3(this.dom.menuButton);
    })));
    this.disposables.add(spiff.ClickHandler.targetAndClick(this.dom.leftButton, ss.Delegate.create(this, function(e) {
        this._scrollLeft$3();
    })));
    this.disposables.add(spiff.ClickHandler.targetAndClick(this.dom.rightButton, ss.Delegate.create(this, function(e) {
        this._scrollRight$3();
    })));
}
tab.AuthoringTabNavViewWeb.prototype = {
    
    get__scroll$3: function tab_AuthoringTabNavViewWeb$get__scroll$3() {
        return -this.dom.tabContainer.position().left;
    },
    set__scroll$3: function tab_AuthoringTabNavViewWeb$set__scroll$3(value) {
        var bounds = this.get__scrollBounds$3();
        var scroll = Math.min(Math.max(value, bounds.min), bounds.max);
        var newLeft = (-scroll) + 'px';
        if (newLeft !== this.dom.tabContainer.css('left')) {
            this.dom.tabContainer.animate({ left: newLeft }, 'fast', 'swing', ss.Delegate.create(this, function() {
                this._updateControls$3();
            }));
        }
        return value;
    },
    
    get__scrollBounds$3: function tab_AuthoringTabNavViewWeb$get__scrollBounds$3() {
        var result = tab.$create__scrollBounds();
        var containerWidth = this.get_availableWidth();
        var tabsWidth = this.get_tabsWidth();
        result.max = tabsWidth;
        result.min = 0;
        if (tabsWidth > containerWidth) {
            result.max = tabsWidth - containerWidth;
        }
        return result;
    },
    
    onAddedToDom: function tab_AuthoringTabNavViewWeb$onAddedToDom() {
        tab.AuthoringTabNavViewWeb.callBaseMethod(this, 'onAddedToDom');
        this._scrollToActiveTab$3();
    },
    
    onViewModelPropertyChanged: function tab_AuthoringTabNavViewWeb$onViewModelPropertyChanged(sender, e) {
        tab.AuthoringTabNavViewWeb.callBaseMethod(this, 'onViewModelPropertyChanged', [ sender, e ]);
        if (e.get_propertyName() === tab.AuthoringTabNavViewModel.currentTabProperty) {
            this._scrollToActiveTab$3();
        }
    },
    
    updateContent: function tab_AuthoringTabNavViewWeb$updateContent() {
        tab.AuthoringTabNavViewWeb.callBaseMethod(this, 'updateContent');
        this._updateControls$3();
        this._scrollToActiveTab$3();
    },
    
    _scrollToActiveTab$3: function tab_AuthoringTabNavViewWeb$_scrollToActiveTab$3() {
        if (!this.get_addedToDom()) {
            return;
        }
        var sheetCount = 0;
        var $enum1 = ss.IEnumerator.getEnumerator(spiff.Widget.getWidgets(this.dom.tabContainer.children(), tab.AuthoringTabView));
        while ($enum1.moveNext()) {
            var w = $enum1.current;
            if (w.get_viewModel() === this.authoringTabNavViewModel.get_currentTab()) {
                if (sheetCount === this.dom.tabContainer.children().length - 2) {
                    this._scrollToTab$3(this.dom.newButton);
                }
                else {
                    this._scrollToTab$3(w.get_element());
                }
            }
            sheetCount++;
        }
    },
    
    _menuButtonClicked$3: function tab_AuthoringTabNavViewWeb$_menuButtonClicked$3(buttonDom) {
        var tabItems = [];
        var $enum1 = ss.IEnumerator.getEnumerator(this.authoringTabNavViewModel.get_workbookTabs());
        while ($enum1.moveNext()) {
            var t = $enum1.current;
            var chk = spiff.MenuItemCheckState.none;
            if (t === this.authoringTabNavViewModel.get_currentTab()) {
                chk = spiff.MenuItemCheckState.radio;
            }
            var tabItem = spiff.MenuItem.newItem(t, t.get_name(), chk);
            tabItems.add(tabItem);
        }
        var vm = spiff.MenuViewModel.createForMenu(new spiff.Menu(tabItems), ss.Delegate.create(this, this._tabSelectionMenuItemClicked$3));
        vm.show(spiff.ShowMenuOptions.create(buttonDom, true));
    },
    
    _tabSelectionMenuItemClicked$3: function tab_AuthoringTabNavViewWeb$_tabSelectionMenuItemClicked$3(arg) {
        this.authoringTabNavViewModel.selectTab(arg.get_data());
    },
    
    _shouldShowButtons$3: function tab_AuthoringTabNavViewWeb$_shouldShowButtons$3() {
        var tabsWidth = this.get_tabsWidth();
        var availableWidth = this.get_availableWidth();
        return tabsWidth > availableWidth;
    },
    
    _toggleControls$3: function tab_AuthoringTabNavViewWeb$_toggleControls$3(shouldShow) {
        if (shouldShow) {
            this.dom.controlsArea.show();
        }
        else {
            this.dom.controlsArea.hide();
        }
    },
    
    _scrollToTab$3: function tab_AuthoringTabNavViewWeb$_scrollToTab$3(tabDom) {
        var posLeft = tabDom.position().left;
        var posRight = posLeft + tabDom.outerWidth(true);
        var minScroll = this.get__scroll$3();
        var maxScroll = this.get__scroll$3() + this.get_availableWidth();
        if (posLeft < minScroll || posRight > maxScroll) {
            this.set__scroll$3(this._getScrollForTab$3(tabDom));
        }
    },
    
    _updateControls$3: function tab_AuthoringTabNavViewWeb$_updateControls$3() {
        if (!this._shouldShowButtons$3()) {
            this._toggleControls$3(false);
            this.set__scroll$3(0);
            return;
        }
        else {
            this._toggleControls$3(true);
        }
        var scroll = this.get__scroll$3();
        var bounds = this.get__scrollBounds$3();
        var canScrollLeft = scroll > bounds.min;
        var canScrollRight = scroll < bounds.max;
        this.dom.menuButton.toggleClass('tabEnabled', true);
        this.dom.leftButton.toggleClass('tabEnabled', canScrollLeft);
        this.dom.leftButton.toggleClass('tabDisabled', !canScrollLeft);
        this.dom.rightButton.toggleClass('tabEnabled', canScrollRight);
        this.dom.rightButton.toggleClass('tabDisabled', !canScrollRight);
    },
    
    _getScrollForTab$3: function tab_AuthoringTabNavViewWeb$_getScrollForTab$3(tabDom) {
        var leftPos = tabDom.position().left;
        var rightPos = leftPos + tabDom.outerWidth(true);
        var min = this.get__scroll$3();
        var max = min + this.get_availableWidth();
        if (leftPos < min) {
            return leftPos - 5;
        }
        if (rightPos > max) {
            return min + rightPos - max + tabDom.outerWidth(true) + 5;
        }
        return this.get__scroll$3();
    },
    
    _doSlide$3: function tab_AuthoringTabNavViewWeb$_doSlide$3(toRight) {
        var width = this.get_availableWidth();
        var diff = width * 0.5 * ((toRight) ? 1 : -1);
        this.set__scroll$3(this.get__scroll$3() + diff);
    },
    
    _scrollRight$3: function tab_AuthoringTabNavViewWeb$_scrollRight$3() {
        this._doSlide$3(true);
    },
    
    _scrollLeft$3: function tab_AuthoringTabNavViewWeb$_scrollLeft$3() {
        this._doSlide$3(false);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.AuthoringViewWeb

tab.AuthoringViewWeb = function tab_AuthoringViewWeb(authoringViewModel) {
    this._disposables$1 = new tab.DisposableHolder();
    tab.AuthoringViewWeb.initializeBase(this, [ authoringViewModel ]);
    this.buildDom();
    var s = spiff.$create_EventHandleSpec();
    s.firstTouch = ss.Delegate.create(this, this.leftAreaResizerTouch);
    s.dragStart = ss.Delegate.create(this, this.leftAreaResizeStart);
    s.dragMove = ss.Delegate.create(this, this.leftAreaHandleResizeDrag);
    s.dragEnd = ss.Delegate.create(this, this.leftAreaResizeEnd);
    new spiff.TableauEventHandler(this.leftViewResizeAffordance.get(0), s);
    this.leftViewResizeAffordance.dblclick(ss.Delegate.create(this, this.leftAreaHandleAutoResize));
}
tab.AuthoringViewWeb.prototype = {
    _topShelvesDom$1: null,
    _leftShelvesDom$1: null,
    
    get__leftPanelViewWeb$1: function tab_AuthoringViewWeb$get__leftPanelViewWeb$1() {
        return this.leftPanelView;
    },
    
    _setPanelPosition$1: function tab_AuthoringViewWeb$_setPanelPosition$1(panelState) {
        var topTransition = String.format('left {0}ms ease-out', this.get__leftPanelViewWeb$1().get_collapseDuration());
        var cssTransitionSelector = tab.BrowserSupport.get_cssTransitionName();
        var leftPanelCss = {};
        var leftShelvesCss = {};
        var topShelvesCss = {};
        var tabAreaCss = {};
        var tabViewerCss = {};
        leftPanelCss[cssTransitionSelector] = topTransition;
        leftShelvesCss[cssTransitionSelector] = topTransition;
        topShelvesCss[cssTransitionSelector] = topTransition;
        tabAreaCss[cssTransitionSelector] = topTransition;
        tabViewerCss[cssTransitionSelector] = topTransition;
        var schemaWidth = this.leftViewArea.width();
        var leftShelfWidth = $('.tabAuthLeftShelves').width();
        var TopShelvesPaddingAndMarginOffset = 5;
        var resizeAffordance = this.leftViewResizeAffordance.width();
        var collapsedSidePanelWidth = this.get__leftPanelViewWeb$1().get_collapsedWidth();
        if (panelState === 1) {
            leftPanelCss['left'] = String.format('{0}px', 0);
            leftShelvesCss['left'] = String.format('{0}px', schemaWidth + resizeAffordance);
            topShelvesCss['left'] = String.format('{0}px', schemaWidth + leftShelfWidth + resizeAffordance);
            tabAreaCss['left'] = String.format('{0}px', schemaWidth + resizeAffordance);
            tabViewerCss['left'] = String.format('{0}px', leftShelfWidth + schemaWidth + resizeAffordance + TopShelvesPaddingAndMarginOffset);
            this.leftViewResizeAffordance.show();
        }
        else {
            leftPanelCss['left'] = String.format('{0}px', -schemaWidth);
            leftShelvesCss['left'] = String.format('{0}px', collapsedSidePanelWidth + resizeAffordance);
            topShelvesCss['left'] = String.format('{0}px', leftShelfWidth + collapsedSidePanelWidth + resizeAffordance);
            tabAreaCss['left'] = String.format('{0}px', collapsedSidePanelWidth + resizeAffordance);
            tabViewerCss['left'] = String.format('{0}px', leftShelfWidth + collapsedSidePanelWidth + resizeAffordance + TopShelvesPaddingAndMarginOffset);
            this.leftViewResizeAffordance.hide();
        }
        window.setTimeout(ss.Delegate.create(this, function() {
            this.authoringViewModel.updatePortSizeAfterManualLayout();
            leftPanelCss[cssTransitionSelector] = '';
            leftShelvesCss[cssTransitionSelector] = '';
            topShelvesCss[cssTransitionSelector] = '';
            tabAreaCss[cssTransitionSelector] = '';
            tabViewerCss[cssTransitionSelector] = '';
            this.tabArea.css(tabAreaCss);
            this.leftPanelView.get_element().css(leftPanelCss);
            $('.tabAuthLeftShelves').css(leftShelvesCss);
            $('.tabAuthTopShelves').css(topShelvesCss);
            $('#tabViewer').css(tabViewerCss);
        }), this.get__leftPanelViewWeb$1().get_collapseDuration());
        this.tabArea.css(tabAreaCss);
        this.leftViewArea.css(leftPanelCss);
        $('.tabAuthLeftShelves').css(leftShelvesCss);
        $('.tabAuthTopShelves').css(topShelvesCss);
        $('#tabViewer').css(tabViewerCss);
    },
    
    dispose: function tab_AuthoringViewWeb$dispose() {
        this._disposables$1.dispose();
        tab.AuthoringViewWeb.callBaseMethod(this, 'dispose');
    },
    
    leftAreaResizeTo: function tab_AuthoringViewWeb$leftAreaResizeTo(newWidth) {
        newWidth = this.leftPanelView.getBracketWidth(newWidth);
        tab.AuthoringViewWeb.callBaseMethod(this, 'leftAreaResizeTo', [ newWidth ]);
        this._leftShelvesDom$1.css('left', (newWidth + 1).toString() + 'px');
        this._topShelvesDom$1.css('left', (newWidth + 2 + this._leftShelvesDom$1.width()).toString() + 'px');
        this.layout();
    },
    
    calculateDropTargetOffset: function tab_AuthoringViewWeb$calculateDropTargetOffset() {
        var topOffset = this._topShelvesDom$1.offset().top + this._topShelvesDom$1.height();
        var leftOffset = this._leftShelvesDom$1.offset().left + this._leftShelvesDom$1.width();
        return tab.$create_Point(leftOffset, topOffset);
    },
    
    _collapseSidePanelButtonClicked$1: function tab_AuthoringViewWeb$_collapseSidePanelButtonClicked$1(panelState) {
        this._setPanelPosition$1(panelState);
    },
    
    _addSchemaCollapsedViewAndHandlersToDom$1: function tab_AuthoringViewWeb$_addSchemaCollapsedViewAndHandlersToDom$1() {
        if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
            this.get__leftPanelViewWeb$1().add_collapseButtonClicked(ss.Delegate.create(this, this._collapseSidePanelButtonClicked$1));
            this._disposables$1.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                this.get__leftPanelViewWeb$1().remove_collapseButtonClicked(ss.Delegate.create(this, this._collapseSidePanelButtonClicked$1));
            })));
        }
    },
    
    addContentToAreas: function tab_AuthoringViewWeb$addContentToAreas() {
        if (ss.isValue(this.authoringMastheadView)) {
            this.mastheadArea.append(this.authoringMastheadView.get_element());
        }
        this.leftViewArea.append(this.leftPanelView.get_element());
        this.toolbarArea.append(this.toolbar.get_element());
        this.tabArea.append(this.tabNav.get_element());
        var shelvesDom = $("<div class='tabAuthShelves'></div>");
        this.insideViewArea.append(shelvesDom);
        this._topShelvesDom$1 = $("<div class='tabAuthTopShelves'></div>");
        var $enum1 = ss.IEnumerator.getEnumerator(this.cards['top']);
        while ($enum1.moveNext()) {
            var topShelf = $enum1.current;
            this._topShelvesDom$1.append(topShelf.get_element());
        }
        shelvesDom.append(this._topShelvesDom$1);
        this._leftShelvesDom$1 = $("<div class='tabAuthLeftShelves'></div>");
        var shelvesHolderDom = $('<div>').appendTo(this._leftShelvesDom$1);
        var $enum2 = ss.IEnumerator.getEnumerator(this.cards['left']);
        while ($enum2.moveNext()) {
            var leftShelf = $enum2.current;
            shelvesHolderDom.append(leftShelf.get_element());
        }
        shelvesDom.append(this._leftShelvesDom$1);
        this._addSchemaCollapsedViewAndHandlersToDom$1();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.CardViewWeb

tab.CardViewWeb = function tab_CardViewWeb(viewModel) {
    tab.CardViewWeb.initializeBase(this, [ viewModel, new tab.CardViewTemplate() ]);
    this.dom.expandoTarget.bind('mouseenter' + this.get_eventNamespace(), ss.Delegate.create(this, function() {
        this.dom.expando.toggleClass('tabAuthCardExpandoHover', true);
    }));
    this.dom.expandoTarget.bind('mouseleave' + this.get_eventNamespace(), ss.Delegate.create(this, function() {
        this.dom.expando.toggleClass('tabAuthCardExpandoHover', false);
    }));
    new spiff.HoverBehavior(this, '.tabAuthCardContent', ss.Delegate.create(this, function() {
        this.get_element().addClass('tabAuthCardHover');
    }), ss.Delegate.create(this, function() {
        this.get_element().removeClass('tabAuthCardHover');
    }));
    spiff.HoverAddClassBehavior.attach(this, 'tabAuthCardMenuBtnHover', '.tabAuthCardMenuBtn');
}


////////////////////////////////////////////////////////////////////////////////
// tab.ColorPickerViewWeb

tab.ColorPickerViewWeb = function tab_ColorPickerViewWeb(viewModel) {
    tab.ColorPickerViewWeb.initializeBase(this, [ viewModel, new tab.ColorPickerTemplate() ]);
    this.updateContent();
    this.createTransparencyControl();
}
tab.ColorPickerViewWeb.prototype = {
    
    createTransparencyControl: function tab_ColorPickerViewWeb$createTransparencyControl() {
        this.set_colorTransparencyControlView(spiff.ObjectRegistry.newView(tab.ColorTransparencyControlView, this.colorOptionViewModel.get_colorTransparencyControlViewModel()));
        this.get_colorTransparencyControlView().createTransparencySettings(this.colorOptionViewModel.get_colorTransparencyControlViewModel());
    },
    
    _createLinePatternPicker$4: function tab_ColorPickerViewWeb$_createLinePatternPicker$4() {
        this.set_linePatternPickerView(spiff.ObjectRegistry.newView(tab.LinePatternPickerView, this.colorOptionViewModel.get_linePatternPickerViewModel()));
    },
    
    _createStrokeWidthPicker$4: function tab_ColorPickerViewWeb$_createStrokeWidthPicker$4() {
        this.set_strokeWidthPickerView(spiff.ObjectRegistry.newView(tab.StrokeWidthPickerView, this.colorOptionViewModel.get_strokeWidthPickerViewModel()));
    },
    
    commitChangesInView: function tab_ColorPickerViewWeb$commitChangesInView() {
        if (ss.isValue(this.get_colorTransparencyControlView())) {
            this.get_colorTransparencyControlView().commitTransparencyPercentageText();
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LayerEncodingViewWeb

tab.LayerEncodingViewWeb = function tab_LayerEncodingViewWeb(viewModel) {
    tab.LayerEncodingViewWeb.initializeBase(this, [ viewModel, new tab.LayerEncodingTemplate() ]);
    this.update();
}
tab.LayerEncodingViewWeb.prototype = {
    
    attachEventHandlers: function tab_LayerEncodingViewWeb$attachEventHandlers(button, et) {
        button.get_element().addClass('gradient');
        if (this.leViewModel.isEncodingClickable(et)) {
            button.set_hoverClass('tabHover');
        }
    },
    
    removeEncodingButtonEvents: function tab_LayerEncodingViewWeb$removeEncodingButtonEvents() {
        this.dom.get_encodingButtons().unbind(this.get_eventNamespace());
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.MarksContentViewWeb

tab.MarksContentViewWeb = function tab_MarksContentViewWeb(viewModel) {
    tab.MarksContentViewWeb.initializeBase(this, [ viewModel, new tab.MarksContentTemplate() ]);
    this.handleLayersChanged();
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillViewWeb

tab.PillViewWeb = function tab_PillViewWeb(viewModel) {
    tab.PillViewWeb.initializeBase(this, [ viewModel, new tab.PillViewWebTemplate() ]);
    this.disposables.add(new spiff.HoverBehavior(this, '.tabAuthPillContent', ss.Delegate.create(this, this._handlePillEnter$3), ss.Delegate.create(this, this._handlePillExit$3)));
}
tab.PillViewWeb.prototype = {
    
    _handlePillExit$3: function tab_PillViewWeb$_handlePillExit$3(e) {
        $(e.currentTarget).removeClass('hover');
        this.dom.icons.css('display', '');
        this.updateLabelSizeForIcons();
    },
    
    _handlePillEnter$3: function tab_PillViewWeb$_handlePillEnter$3(e) {
        if (spiff.DragDropManager.get_isDragging()) {
            return;
        }
        $(e.currentTarget).addClass('hover');
        this.dom.icons.css('display', 'none');
        this.updateLabelSizeForIcons();
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.PillViewWebTemplate

tab.PillViewWebTemplate = function tab_PillViewWebTemplate() {
    tab.PillViewWebTemplate.initializeBase(this, [ tab.PillViewTemplate.htmlTemplate ]);
}


////////////////////////////////////////////////////////////////////////////////
// tab.DataSchemaViewWeb

tab.DataSchemaViewWeb = function tab_DataSchemaViewWeb(viewModel) {
    tab.DataSchemaViewWeb.initializeBase(this, [ viewModel ]);
    this.disposables.add(new spiff.HoverBehavior(this, '.tab-schema-field-label-area', ss.Delegate.create(this, this._handleItemEnter$3), ss.Delegate.create(this, this._handleItemExit$3)));
    if (ss.isValue(this.get_dataSchemaViewModel().get_selectedDataSource())) {
        this.initFromModel();
    }
}
tab.DataSchemaViewWeb.prototype = {
    
    get_scrollTop: function tab_DataSchemaViewWeb$get_scrollTop() {
        return this.dom.contentAreaScroll.scrollTop();
    },
    set_scrollTop: function tab_DataSchemaViewWeb$set_scrollTop(value) {
        if (value === this.get_scrollTop() || value < 0 || value > this.dom.contentArea.height()) {
            return;
        }
        this.dom.contentAreaScroll.animate({ scrollTop: value + 'px' }, 'fast', 'swing');
        return value;
    },
    
    _handleItemExit$3: function tab_DataSchemaViewWeb$_handleItemExit$3(e) {
        $(e.currentTarget).removeClass('hover');
    },
    
    _handleItemEnter$3: function tab_DataSchemaViewWeb$_handleItemEnter$3(e) {
        if (spiff.DragDropManager.get_isDragging()) {
            return;
        }
        $(e.currentTarget).addClass('hover');
    },
    
    attachFieldEventHandlers: function tab_DataSchemaViewWeb$attachFieldEventHandlers(field, dragField, ft, isHidden) {
        tab.DataSchemaViewWeb.callBaseMethod(this, 'attachFieldEventHandlers', [ field, dragField, ft, isHidden ]);
        if (tab.FeatureFlags.isEnabled('NonModalCalculationDialog') && field.hasContextMenu) {
            ft.getMenuClickHandler(this.perInitDisposables).onClick(ss.Delegate.create(this, function(e) {
                this._handleFieldContextMenu$3(ft);
            }));
            ft.getLabelClickHandler(this.perInitDisposables).onRightClick(ss.Delegate.create(this, function(e) {
                this._handleFieldContextMenu$3(ft);
            }));
        }
    },
    
    _handleFieldContextMenu$3: function tab_DataSchemaViewWeb$_handleFieldContextMenu$3(ft) {
        if (!this.get_dataSchemaViewModel().isSelected(ft.get_node()) || this.get_dataSchemaViewModel().get_selectedNodes().length === 1) {
            this.get_dataSchemaViewModel().showFieldContextMenu(ft.get_node(), ft.pill);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.LeftPanelViewWeb

tab.LeftPanelViewWeb = function tab_LeftPanelViewWeb(dataSchemaViewModel, analyticsPaneViewModel) {
    this._disposables$3 = new tab.DisposableHolder();
    tab.LeftPanelViewWeb.initializeBase(this, [ dataSchemaViewModel, analyticsPaneViewModel ]);
    if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
        this._leftAreaTabControl$3 = new spiff.TabControl();
        var dataTabLabel = $('<span/>').text(tab.Strings.AuthSchemaViewerHeaderData);
        this._leftAreaTabControl$3.addTab(tab.Strings.AuthSchemaViewerHeaderData, dataTabLabel, this.get_dataSchemaView().get_element());
        var analyticsTabLabel = $('<span/>').text(tab.Strings.AuthLeftPaneTabLabelAnalytics);
        this._leftAreaTabControl$3.addTab(tab.Strings.AuthLeftPaneTabLabelAnalytics, analyticsTabLabel, this.get_analyticsPaneView().get_element());
        this._addCollapseButtonToTabs$3();
        this._leftAreaTabControl$3.selectTab(tab.Strings.AuthSchemaViewerHeaderData);
        this.dom.get_domRoot().append(this._leftAreaTabControl$3.get_domRoot());
    }
    else {
        this.dom.get_domRoot().append(this.get_dataSchemaView().get_element());
    }
    this._setUpCollapsedPanel$3();
    this.dom.get_domRoot().append(this._schemaCollapsedWidget$3.get_element());
    this._hideCollapsedPanel$3();
}
tab.LeftPanelViewWeb.prototype = {
    _collapseButtonAreaWidth$3: 30,
    _collapseDuration$3: 200,
    _leftAreaTabControl$3: null,
    _schemaCollapsedWidget$3: null,
    _currPanelState$3: 0,
    
    add_collapseButtonClicked: function tab_LeftPanelViewWeb$add_collapseButtonClicked(value) {
        this.__collapseButtonClicked$3 = ss.Delegate.combine(this.__collapseButtonClicked$3, value);
    },
    remove_collapseButtonClicked: function tab_LeftPanelViewWeb$remove_collapseButtonClicked(value) {
        this.__collapseButtonClicked$3 = ss.Delegate.remove(this.__collapseButtonClicked$3, value);
    },
    
    __collapseButtonClicked$3: null,
    
    get_width: function tab_LeftPanelViewWeb$get_width() {
        if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
            if (this.get_panelState() === 1) {
                return this._leftAreaTabControl$3.get_contentArea().width();
            }
            else {
                return this._schemaCollapsedWidget$3.get_width();
            }
        }
        else {
            return this.get_dataSchemaView().get_width();
        }
    },
    set_width: function tab_LeftPanelViewWeb$set_width(value) {
        if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
            this.resizeTabs(value);
            this._updateCollapsedPanelPosition$3(this.get_dataSchemaView().get_width());
        }
        else {
            this.get_dataSchemaView().set_width(value);
        }
        return value;
    },
    
    get_panelState: function tab_LeftPanelViewWeb$get_panelState() {
        return this._currPanelState$3;
    },
    
    get_collapseDuration: function tab_LeftPanelViewWeb$get_collapseDuration() {
        return this._collapseDuration$3;
    },
    
    get_collapsedWidth: function tab_LeftPanelViewWeb$get_collapsedWidth() {
        return this._schemaCollapsedWidget$3.get_width();
    },
    
    _setUpCollapsedPanel$3: function tab_LeftPanelViewWeb$_setUpCollapsedPanel$3() {
        this._schemaCollapsedWidget$3 = new tab.SidebarCollapsedWidget();
        this._schemaCollapsedWidget$3.add_expandButtonClicked(ss.Delegate.create(this, this._expandButtonClickedHandler$3));
        this._disposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._schemaCollapsedWidget$3.remove_expandButtonClicked(ss.Delegate.create(this, this._expandButtonClickedHandler$3));
        })));
        this._schemaCollapsedWidget$3.add_tabButtonClicked(ss.Delegate.create(this, this._collapsedTabButtonClickedHandler$3));
        this._disposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
            this._schemaCollapsedWidget$3.remove_tabButtonClicked(ss.Delegate.create(this, this._collapsedTabButtonClickedHandler$3));
        })));
        this._currPanelState$3 = 1;
    },
    
    _updateCollapsedPanelPosition$3: function tab_LeftPanelViewWeb$_updateCollapsedPanelPosition$3(expandedPanelWidth) {
        var collapsedPanelCss = {};
        collapsedPanelCss['left'] = String.format('{0}px', expandedPanelWidth);
        this._schemaCollapsedWidget$3.get_element().css(collapsedPanelCss);
    },
    
    _collapsedTabButtonClickedHandler$3: function tab_LeftPanelViewWeb$_collapsedTabButtonClickedHandler$3(tabId) {
        this._leftAreaTabControl$3.selectTab(tabId);
        this._expandButtonClickedHandler$3();
    },
    
    _collapsedButtonClickedHandler$3: function tab_LeftPanelViewWeb$_collapsedButtonClickedHandler$3() {
        if (ss.isValue(this.__collapseButtonClicked$3)) {
            this.__collapseButtonClicked$3(0);
            this._showCollapsedPanel$3();
        }
    },
    
    _expandButtonClickedHandler$3: function tab_LeftPanelViewWeb$_expandButtonClickedHandler$3() {
        if (ss.isValue(this.__collapseButtonClicked$3)) {
            this.__collapseButtonClicked$3(1);
            this._hideCollapsedPanel$3();
        }
    },
    
    onAddedToDom: function tab_LeftPanelViewWeb$onAddedToDom() {
        tab.LeftPanelViewWeb.callBaseMethod(this, 'onAddedToDom');
        if (tsConfig.features['AnalyticsPane'] && !!tab.FeatureParamsLookup.getBool(tab.FeatureParam.aoPaneUI)) {
            this.resizeTabs(this.get_width());
        }
    },
    
    dispose: function tab_LeftPanelViewWeb$dispose() {
        if (ss.isValue(this._schemaCollapsedWidget$3)) {
            this._schemaCollapsedWidget$3.dispose();
            this._schemaCollapsedWidget$3 = null;
        }
        if (ss.isValue(this._leftAreaTabControl$3)) {
            this._leftAreaTabControl$3.dispose();
        }
        tab.LeftPanelViewWeb.callBaseMethod(this, 'dispose');
    },
    
    _addCollapseButtonToTabs$3: function tab_LeftPanelViewWeb$_addCollapseButtonToTabs$3() {
        if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.collapseSidePane)) {
            var collapseButton = new spiff.IconButton();
            collapseButton.setIcon('tabAuthCollapseIcon');
            collapseButton.set_hoverTooltipText(tab.Strings.CollapseSchemaPane);
            collapseButton.addClass('tabCollapseSidebar');
            collapseButton.add_click(ss.Delegate.create(this, this._collapsedButtonClickedHandler$3));
            this._disposables$3.add(new tab.CallOnDispose(ss.Delegate.create(this, function() {
                collapseButton.remove_click(ss.Delegate.create(this, this._collapsedButtonClickedHandler$3));
            })));
            this._leftAreaTabControl$3.get_tabs().append(collapseButton.get_element());
        }
    },
    
    resizeTabs: function tab_LeftPanelViewWeb$resizeTabs(newWidth) {
        if (newWidth > this.leftAreaMaxWidth) {
            newWidth = this.leftAreaMaxWidth;
        }
        else if (newWidth < this.leftAreaMinWidth) {
            newWidth = this.leftAreaMinWidth;
        }
        var spaceOnRight = 0;
        var TabPadding = 10;
        var TabBorders = 2;
        if (!!tab.FeatureParamsLookup.getBool(tab.FeatureParam.collapseSidePane)) {
            spaceOnRight = this._collapseButtonAreaWidth$3;
            spaceOnRight += TabPadding;
        }
        this._leftAreaTabControl$3.get_contentArea().width(newWidth - 1);
        var tabs = this.get_element().find('.tabTabLabels .tabTabLabel');
        tabs.width('');
        var totalWidth = (newWidth - TabPadding - spaceOnRight);
        var totalTabWidth = 0;
        for (var i = 0; i < tabs.length; i++) {
            var thisTab = tabs.eq(i);
            totalTabWidth += thisTab.width();
        }
        var leftOffsetSoFar = 0;
        for (var i = 0; i < tabs.length; i++) {
            var thisTab = tabs.eq(i);
            var widthRatio = thisTab.width() / totalTabWidth;
            var thisTabWidth = totalWidth * widthRatio;
            thisTab.width(parseInt(thisTabWidth));
            thisTab.css('left', leftOffsetSoFar + 'px');
            leftOffsetSoFar += parseInt(thisTabWidth) + TabPadding + TabBorders;
        }
    },
    
    _showCollapsedPanel$3: function tab_LeftPanelViewWeb$_showCollapsedPanel$3() {
        window.setTimeout(ss.Delegate.create(this, function() {
            this._schemaCollapsedWidget$3.get_element().show();
        }), this._collapseDuration$3 - 25);
        this._currPanelState$3 = 0;
    },
    
    _hideCollapsedPanel$3: function tab_LeftPanelViewWeb$_hideCollapsedPanel$3() {
        this._schemaCollapsedWidget$3.get_element().hide();
        this._currPanelState$3 = 1;
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShapePickerViewWeb

tab.ShapePickerViewWeb = function tab_ShapePickerViewWeb(viewModel) {
    tab.ShapePickerViewWeb.initializeBase(this, [ viewModel, new tab.ShapePickerTemplate() ]);
    this.updateContent();
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfViewWeb

tab.ShelfViewWeb = function tab_ShelfViewWeb(viewModel) {
    tab.ShelfViewWeb.initializeBase(this, [ viewModel, new tab.ShelfCardTemplate() ]);
    this._scrollerDom$4 = new tab.ShelfScrollTemplate();
    $(window).bind(this.createNamespacedEventName('resize'), ss.Delegate.create(this, this._handleWindowResize$4));
    this.initFromModel(viewModel);
}
tab.ShelfViewWeb.prototype = {
    _scrollerDom$4: null,
    _prevButton$4: null,
    _nextButton$4: null,
    
    get_scrollContainerSize: function tab_ShelfViewWeb$get_scrollContainerSize() {
        return (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? this.dom.pillHolder.outerHeight() : this.dom.pillHolder.outerWidth();
    },
    
    get__scrollSize$4: function tab_ShelfViewWeb$get__scrollSize$4() {
        return (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? this.get_scrollableContentPreferredHeight() : this.get_preferredWidth();
    },
    
    get__canScrollPrev$4: function tab_ShelfViewWeb$get__canScrollPrev$4() {
        return this.get_scroll() > 0;
    },
    
    get__canScrollNext$4: function tab_ShelfViewWeb$get__canScrollNext$4() {
        return this.get_scroll() < this.get__scrollBounds$4().max;
    },
    
    get_scroll: function tab_ShelfViewWeb$get_scroll() {
        return (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? this.dom.pillHolder.scrollTop() : this.dom.pillHolder.scrollLeft();
    },
    set_scroll: function tab_ShelfViewWeb$set_scroll(value) {
        var bounds = this.get__scrollBounds$4();
        var scroll = Math.min(Math.max(value, bounds.min), bounds.max);
        if (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) {
            this.dom.pillHolder.scrollTop(scroll);
        }
        else {
            this.dom.pillHolder.scrollLeft(scroll);
        }
        this._updateScroller$4();
        return value;
    },
    
    get__scrollBounds$4: function tab_ShelfViewWeb$get__scrollBounds$4() {
        var containerSize = this.get_scrollContainerSize();
        var scrollSize = this.get__scrollSize$4();
        var result = tab.$create__scrollBounds();
        result.max = 0;
        result.min = 0;
        if (scrollSize > containerSize) {
            result.max = scrollSize - containerSize + 15;
        }
        return result;
    },
    
    onAddedToDom: function tab_ShelfViewWeb$onAddedToDom() {
        tab.ShelfViewWeb.callBaseMethod(this, 'onAddedToDom');
        this._updateScroller$4();
    },
    
    dispose: function tab_ShelfViewWeb$dispose() {
        $(window).unbind(this.get_eventNamespace());
        tab.ShelfViewWeb.callBaseMethod(this, 'dispose');
    },
    
    setScrollableContentActualHeight: function tab_ShelfViewWeb$setScrollableContentActualHeight(height) {
        tab.ShelfViewWeb.callBaseMethod(this, 'setScrollableContentActualHeight', [ height ]);
        this._clearScoll$4();
        this._updateScroller$4();
    },
    
    initFromModel: function tab_ShelfViewWeb$initFromModel(vm) {
        var prevScroll = this.get_scroll();
        tab.ShelfViewWeb.callBaseMethod(this, 'initFromModel', [ vm ]);
        this.set_scroll(prevScroll);
        this._updateScroller$4();
        if (ss.isNullOrUndefined(this._prevButton$4)) {
            this._prevButton$4 = this._createButton$4(this._scrollerDom$4.prev, ss.Delegate.create(this, this._prevClicked$4));
        }
        if (ss.isNullOrUndefined(this._nextButton$4)) {
            this._nextButton$4 = this._createButton$4(this._scrollerDom$4.next, ss.Delegate.create(this, this._nextClicked$4));
        }
        this.get_element().append(this._scrollerDom$4.get_domRoot());
    },
    
    _createButton$4: function tab_ShelfViewWeb$_createButton$4(element, action) {
        var button = new spiff.Button(element);
        button.add_click(action);
        this.disposables.add(new tab.CallOnDispose(function() {
            button.remove_click(action);
            button.dispose();
        }));
        return button;
    },
    
    _clearScoll$4: function tab_ShelfViewWeb$_clearScoll$4() {
        this.set_scroll(0);
    },
    
    _updateScroller$4: function tab_ShelfViewWeb$_updateScroller$4() {
        var outerSize = this.get_scrollContainerSize();
        var scrollSize = this.get__scrollSize$4();
        if (outerSize < scrollSize) {
            this._scrollerDom$4.prev.html((this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? '&#9650;' : '&#9664;');
            this._scrollerDom$4.next.html((this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? '&#9660;' : '&#9654;');
            this._scrollerDom$4.prev.toggleClass('tabDisabled', !this.get__canScrollPrev$4());
            this._scrollerDom$4.next.toggleClass('tabDisabled', !this.get__canScrollNext$4());
            this._scrollerDom$4.get_domRoot().show();
        }
        else {
            this._scrollerDom$4.get_domRoot().hide();
        }
    },
    
    _handleWindowResize$4: function tab_ShelfViewWeb$_handleWindowResize$4(e) {
        this._clearScoll$4();
        this._updateScroller$4();
    },
    
    _nextClicked$4: function tab_ShelfViewWeb$_nextClicked$4() {
        if (!this.get__canScrollNext$4()) {
            return;
        }
        this._doScroll$4(true);
    },
    
    _prevClicked$4: function tab_ShelfViewWeb$_prevClicked$4() {
        if (!this.get__canScrollPrev$4()) {
            return;
        }
        this._doScroll$4(false);
    },
    
    _doScroll$4: function tab_ShelfViewWeb$_doScroll$4(forward) {
        var scrollAmount = (this.shelfViewModel.get_orientation() === tab.CardOrientation.vertical) ? 40 : 100;
        var diff = scrollAmount * ((forward) ? 1 : -1);
        this.set_scroll(this.get_scroll() + diff);
    }
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShelfScrollTemplate

tab.ShelfScrollTemplate = function tab_ShelfScrollTemplate() {
    tab.ShelfScrollTemplate.initializeBase(this, [ $(tab.ShelfScrollTemplate.template) ]);
    this.prev = this.getElementBySelector('.tabAuthShelfScrollPrev');
    this.next = this.getElementBySelector('.tabAuthShelfScrollNext');
}
tab.ShelfScrollTemplate.prototype = {
    prev: null,
    next: null
}


////////////////////////////////////////////////////////////////////////////////
// tab.ShowMeViewWeb

tab.ShowMeViewWeb = function tab_ShowMeViewWeb(viewModel) {
    tab.ShowMeViewWeb.initializeBase(this, [ viewModel ]);
    this.initContent();
}
tab.ShowMeViewWeb.prototype = {
    
    attachEventHandlers: function tab_ShowMeViewWeb$attachEventHandlers(c, showMeDom) {
        showMeDom.mouseover(this._createHoverHandler$3(c, showMeDom));
        if (this.smViewModel.isCommandEnabled(c)) {
            this.perUpdateDisposables.add(spiff.TableauClickHandler.targetAndClick(showMeDom[0], this._createClickHandler$3(c)));
        }
    },
    
    _createClickHandler$3: function tab_ShowMeViewWeb$_createClickHandler$3(c) {
        return ss.Delegate.create(this, function() {
            this.smViewModel.applyShowMeCommand(c);
        });
    },
    
    _createHoverHandler$3: function tab_ShowMeViewWeb$_createHoverHandler$3(c, showMeDom) {
        return ss.Delegate.create(this, function() {
            this.setActiveItem(c, showMeDom);
        });
    }
}


tab.CalculationDialogViewWeb.registerClass('tab.CalculationDialogViewWeb', tab.CalculationDialogView);
tab.CategoricalColorOptionViewWeb.registerClass('tab.CategoricalColorOptionViewWeb', tab.CategoricalColorOptionView);
tab.ColorTransparencyControlViewWeb.registerClass('tab.ColorTransparencyControlViewWeb', tab.ColorTransparencyControlView);
tab.LinePatternPickerViewWeb.registerClass('tab.LinePatternPickerViewWeb', tab.LinePatternPickerView);
tab.StrokeWidthPickerViewWeb.registerClass('tab.StrokeWidthPickerViewWeb', tab.StrokeWidthPickerView);
tab.QuantitativeColorOptionViewWeb.registerClass('tab.QuantitativeColorOptionViewWeb', tab.QuantitativeColorOptionView);
tab.QuantitativeColorOptionTemplateWeb.registerClass('tab.QuantitativeColorOptionTemplateWeb', tab.QuantitativeColorOptionTemplate);
tab.MarkSizePickerViewWeb.registerClass('tab.MarkSizePickerViewWeb', tab.MarkSizePickerView);
tab.TextEncodingOptionViewWeb.registerClass('tab.TextEncodingOptionViewWeb', tab.TextEncodingOptionView);
tab.AuthoringMastheadViewWeb.registerClass('tab.AuthoringMastheadViewWeb', tab.AuthoringMastheadView);
tab.AuthoringTabNavViewWeb.registerClass('tab.AuthoringTabNavViewWeb', tab.AuthoringTabNavView);
tab.AuthoringViewWeb.registerClass('tab.AuthoringViewWeb', tab.AuthoringView);
tab.CardViewWeb.registerClass('tab.CardViewWeb', tab.CardView);
tab.ColorPickerViewWeb.registerClass('tab.ColorPickerViewWeb', tab.ColorPickerView);
tab.LayerEncodingViewWeb.registerClass('tab.LayerEncodingViewWeb', tab.LayerEncodingView);
tab.MarksContentViewWeb.registerClass('tab.MarksContentViewWeb', tab.MarksContentView);
tab.PillViewWeb.registerClass('tab.PillViewWeb', tab.PillView);
tab.PillViewWebTemplate.registerClass('tab.PillViewWebTemplate', tab.PillViewTemplate);
tab.DataSchemaViewWeb.registerClass('tab.DataSchemaViewWeb', tab.DataSchemaView);
tab.LeftPanelViewWeb.registerClass('tab.LeftPanelViewWeb', tab.LeftPanelView);
tab.ShapePickerViewWeb.registerClass('tab.ShapePickerViewWeb', tab.ShapePickerView);
tab.ShelfViewWeb.registerClass('tab.ShelfViewWeb', tab.ShelfView);
tab.ShelfScrollTemplate.registerClass('tab.ShelfScrollTemplate', spiff.Template);
tab.ShowMeViewWeb.registerClass('tab.ShowMeViewWeb', tab.ShowMeView);
(function () {
    spiff.ObjectRegistry.registerType(tab.CalculationDialogView, tab.CalculationDialogViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.CategoricalColorOptionView, tab.CategoricalColorOptionViewWeb);
})();
tab.ColorTransparencyControlViewWeb.transparencyPercentageTextClassName = 'tabAuthTransparencyPercentageText';
(function () {
    spiff.ObjectRegistry.registerType(tab.ColorTransparencyControlView, tab.ColorTransparencyControlViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.LinePatternPickerView, tab.LinePatternPickerViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.StrokeWidthPickerView, tab.StrokeWidthPickerViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.QuantitativeColorOptionView, tab.QuantitativeColorOptionViewWeb);
})();
tab.QuantitativeColorOptionTemplateWeb.htmlTemplate = "<div class='tabAuthQuantitativeColorOptionContent'>\n    <div class='tabColorPalettePickerContainer'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthColorReverseControl'/>\n    <div class='tabColorSteps'/>\n    <div class='tabAuthDivider'/>\n    <div class='tabAuthTransparencyControlContainer'/>\n</div>";
(function () {
    spiff.ObjectRegistry.registerType(tab.MarkSizePickerView, tab.MarkSizePickerViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.TextEncodingOptionView, tab.TextEncodingOptionViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.AuthoringMastheadView, tab.AuthoringMastheadViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.AuthoringTabNavView, tab.AuthoringTabNavViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.AuthoringView, tab.AuthoringViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.CardView, tab.CardViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ColorPickerView, tab.ColorPickerViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.LayerEncodingView, tab.LayerEncodingViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.MarksContentView, tab.MarksContentViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.PillView, tab.PillViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.DataSchemaView, tab.DataSchemaViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.LeftPanelView, tab.LeftPanelViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ShapePickerView, tab.ShapePickerViewWeb);
})();
(function () {
    spiff.ObjectRegistry.registerType(tab.ShelfView, tab.ShelfViewWeb);
})();
tab.ShelfScrollTemplate.template = "<div class='tabAuthShelfScroll'><span class='tabAuthShelfScrollPrev'/><span class='tabAuthShelfScrollNext'/></div>";
(function () {
    spiff.ObjectRegistry.registerType(tab.ShowMeView, tab.ShowMeViewWeb);
})();
});

//! This script was generated using Script# v0.7.4.0
