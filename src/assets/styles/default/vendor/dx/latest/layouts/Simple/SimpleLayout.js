(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(require("jquery"), require("core/class"), require("framework/html/presets").layoutSets, require("framework/html/layout_controller").DefaultLayoutController, require("core/devices"), require("core/errors").log, require("ui/toolbar"))
        })
    }
    else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.SimpleLayout = factory(jQuery, DevExpress.Class, DevExpress.framework.html.layoutSets, DevExpress.framework.html.DefaultLayoutController, DevExpress.devices, DevExpress.errors.log);
        root.DevExpress.framework.html.SimpleLayoutController = root.DevExpress.layouts.SimpleLayout.SimpleLayoutController;
        root.DevExpress.framework.html.Win8SimpleLayoutController = root.DevExpress.layouts.SimpleLayout.Win8SimpleLayoutController
    }
}(this, function($, Class, layoutSets, DefaultLayoutController, devices, log) {
    var exports = {};
    var SimpleLayoutController = DefaultLayoutController.inherit({
            ctor: function(options) {
                options = options || {};
                options.name = options.name || "simple";
                this.callBase(options);
                var device = devices.current();
                if (device.win && device.phone || options.Win8SimpleLayoutControllerFroced) {
                    this.impl = new Win8SimpleLayoutImpl($.proxy(this._getViewFrame, this))
                }
                else {
                    this.impl = new SimpleLayoutImpl
                }
            }, _onRenderComplete: function(viewInfo) {
                    this.impl.onRenderComplete(viewInfo);
                    this.callBase.apply(this, arguments)
                }, disposeView: function(viewInfo) {
                    this.impl.disposeView(viewInfo);
                    this.callBase.apply(this, arguments)
                }, _changeView: function(viewInfo) {
                    var that = this,
                        result = this.callBase.apply(this, arguments);
                    result.done(function() {
                        that.impl.changeView(viewInfo)
                    });
                    return result
                }
        });
    var SimpleLayoutImpl = Class.inherit({
            ctor: $.noop, onRenderComplete: $.noop, disposeView: $.noop, changeView: $.noop
        });
    var HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        LAYOUT_TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom";
    var Win8SimpleLayoutImpl = SimpleLayoutImpl.inherit({
            ctor: function(viewFrameGetter) {
                this._getViewFrame = viewFrameGetter;
                this.callBase.apply(this, arguments);
                this._toolbarOptionChangedHandler = $.proxy(this._onToolbarOptionChanged, this)
            }, _onToolbarOptionChanged: function(args) {
                    if (args.name === "items") {
                        var appbar = args.component;
                        if (appbar) {
                            this._refreshAppbarVisibility(appbar)
                        }
                        this._refreshHasToolbarClass()
                    }
                }, _getAppbar: function($markup) {
                    var $appbar = $markup.find(LAYOUT_TOOLBAR_BOTTOM_SELECTOR);
                    if ($appbar.length !== 1) {
                        return
                    }
                    return $appbar.dxToolbar("instance")
                }, _getCurrentAppbar: function() {
                    return this._getAppbar(this._getViewFrame().find(".dx-active-view "))
                }, onRenderComplete: function(viewInfo) {
                    var appbar = this._getAppbar(viewInfo.renderResult.$markup);
                    if (appbar) {
                        this._refreshAppbarVisibility(appbar);
                        appbar.on("optionChanged", this._toolbarOptionChangedHandler)
                    }
                }, disposeView: function(viewInfo) {
                    var appbar = this._getAppbar(viewInfo.renderResult.$markup);
                    if (appbar) {
                        appbar.off("optionChanged", this._toolbarOptionChangedHandler)
                    }
                }, changeView: function(viewInfo) {
                    this._refreshHasToolbarClass()
                }, _refreshAppbarVisibility: function(appbar) {
                    var isAppbarNotEmpty = false;
                    $.each(appbar.option("items"), function(index, item) {
                        if (item.visible) {
                            isAppbarNotEmpty = true;
                            return false
                        }
                    });
                    appbar.option("visible", isAppbarNotEmpty)
                }, _refreshHasToolbarClass: function() {
                    var appbar = this._getCurrentAppbar(),
                        hasToolbar = appbar ? appbar.option("visible") : false;
                    this._getViewFrame().toggleClass(HAS_TOOLBAR_BOTTOM_CLASS, hasToolbar)
                }
        });
    var Win8SimpleLayoutController = SimpleLayoutController.inherit({ctor: function(options) {
                options = options || {};
                options.Win8SimpleLayoutControllerFroced = true;
                log("W0000", "Layouts", "Win8SimpleLayoutController", "15.1", "Use the SimpleLayoutController instead");
                this.callBase.apply(this, arguments)
            }});
    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({
        platform: "win", root: false, phone: true, controller: new SimpleLayoutController
    });
    layoutSets["navbar"].push({
        platform: "android", root: false, controller: new SimpleLayoutController
    });
    layoutSets["simple"] = layoutSets["simple"] || [];
    layoutSets["simple"].push({controller: new SimpleLayoutController});
    layoutSets["simple"].push({
        platform: "win", phone: true, controller: new SimpleLayoutController
    });
    layoutSets["split"] = layoutSets["split"] || [];
    layoutSets["split"].push({
        platform: "win", requireCustomResolve: true, controller: new SimpleLayoutController
    });
    layoutSets["split"].push({
        platform: "win", root: false, phone: true, controller: new SimpleLayoutController
    });
    exports.SimpleLayoutController = SimpleLayoutController;
    exports.Win8SimpleLayoutController = Win8SimpleLayoutController;
    return exports
}));