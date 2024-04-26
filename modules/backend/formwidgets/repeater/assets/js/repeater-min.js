"use strict";oc.Modules.register("backend.formwidget.repeater.base",(function(){class e extends oc.ControlBase{init(){this.itemCount=0,this.canAdd=!0,this.canRemove=!0,this.repeaterId=$.oc.domIdManager.generate("repeater"),this.initDefaults()}initDefaults(){const e={useReorder:!0,sortableHandle:".repeater-item-handle",removeHandler:"onRemoveItem",useDuplicate:!0,duplicateHandler:"onDuplicateItem",removeConfirm:"Are you sure?",itemsExpanded:!0,titleFrom:null,minItems:null,maxItems:null};for(const t in e)void 0===this.config[t]&&(this.config[t]=e[t])}connect(){this.config.useReorder&&this.bindSorting(),this.$el=$(this.element),this.$itemContainer=$("> .field-repeater-items",this.$el);var e=this.selectorHeader;this.$el.on("change",e+" input[type=checkbox]",this.proxy(this.clickItemCheckbox)),this.$el.on("click",e+" [data-repeater-move-up]",this.proxy(this.clickMoveItemUp)),this.$el.on("click",e+" [data-repeater-move-down]",this.proxy(this.clickMoveItemDown)),this.$el.on("click",e+" [data-repeater-remove]",this.proxy(this.clickRemoveItem)),this.$el.on("click",e+" [data-repeater-duplicate]",this.proxy(this.clickDuplicateItem)),this.$el.on("show.bs.dropdown",e+" .repeater-item-dropdown",this.proxy(this.showItemMenu)),this.$toolbar=$(this.selectorToolbar,this.$el),this.$toolbar.on("click","> [data-repeater-cmd=add-group]",this.proxy(this.clickAddGroupButton)),this.$toolbar.on("click","> [data-repeater-cmd=add]",this.proxy(this.onAddItemButton)),this.$toolbar.on("ajaxDone","> [data-repeater-cmd=add]",this.proxy(this.onAddItemSuccess)),this.countItems(),this.togglePrompt(),setTimeout((()=>{this.initToolbarExtensionPoint(),this.mountExternalToolbarEventBusEvents(),this.extendExternalToolbar()}),0)}disconnect(){this.config.useReorder&&this.sortable.destroy();var e=this.selectorHeader;this.$el.off("change",e+" input[type=checkbox]",this.proxy(this.clickItemCheckbox)),this.$el.off("click",e+" [data-repeater-move-up]",this.proxy(this.clickMoveItemUp)),this.$el.off("click",e+" [data-repeater-move-down]",this.proxy(this.clickMoveItemDown)),this.$el.off("click",e+" [data-repeater-remove]",this.proxy(this.clickRemoveItem)),this.$el.off("click",e+" [data-repeater-duplicate]",this.proxy(this.clickDuplicateItem)),this.$el.off("show.bs.dropdown",e+" .repeater-item-dropdown",this.proxy(this.showItemMenu)),this.$toolbar.off("click","> [data-repeater-cmd=add-group]",this.proxy(this.clickAddGroupButton)),this.$toolbar.off("click","> [data-repeater-cmd=add]",this.proxy(this.onAddItemButton)),this.$toolbar.off("ajaxDone","> [data-repeater-cmd=add]",this.proxy(this.onAddItemSuccess)),this.$el.removeData("oc.repeater"),this.unmountExternalToolbarEventBusEvents(),this.$el=null,this.$toolbar=null,this.$sortableBody=null,this.sortable=null}bindSorting(){this.$sortableBody=$(this.selectorSortable,this.$el),this.sortable=Sortable.create(this.$sortableBody.get(0),{animation:150,multiDrag:!0,avoidImplicitDeselect:!0,handle:this.config.sortableHandle,onEnd:this.proxy(this.onSortableEnd),forceAutoScrollFallback:!0,scrollSensitivity:60,scrollSpeed:20})}onSortableEnd(e){this.eventSortableOnEnd()}clickItemCheckbox(e){var t=$(e.target),i=t.closest("li"),r=t.is(":checked");i.toggleClass("is-checked",r),r?Sortable.utils.select(i.get(0)):Sortable.utils.deselect(i.get(0))}showItemMenu(e){var t=$("> [data-item-menu-template]",this.$el).html(),i=$(e.target),r=i.closest("li"),a=$(".dropdown-menu:first",i.closest(".dropdown"));a.html(t),this.eventMenuFilter(r,a)}clickRemoveItem(e){$(e.target).closest("li").hasClass("disabled")||this.onRemoveItem(this.findItemFromTarget(e.target))}onRemoveItem(e){var t=this,i=this.getCheckedItemsOrItem(e),r=[];$.each(i,(function(e,t){r.push({repeater_index:$(t).data("repeater-index"),repeater_group:$(t).data("repeater-group")})})),e.request(this.config.removeHandler,{data:{_repeater_items:r},confirm:this.config.removeConfirm,afterUpdate:function(){t.onRemoveItemSuccess(i)}})}onRemoveItemSuccess(e){var t=this;$.each(e,(function(e,i){var r=$(i);t.disposeItem(r),r.remove(),t.eventOnRemoveItem(r),t.countItems(),t.triggerChange()}))}clickDuplicateItem(e){$(e.target).closest("li").hasClass("disabled")||(this.eventOnAddItem(),this.onDuplicateItem(this.findItemFromTarget(e.target)))}onDuplicateItem(e){var t=this,i={_repeater_index:e.data("repeater-index"),_repeater_group:e.data("repeater-group")};e.request(this.config.duplicateHandler,{data:i,afterUpdate:function(i){i.result?t.onDuplicateItemSuccess(e,i.result.duplicateIndex):t.eventOnErrorAddItem()}})}onDuplicateItemSuccess(e,t){var i=e.data("repeater-index"),r=$("> li[data-repeater-index="+t+"]",this.$itemContainer);this.findItemFromIndex(i).after(r),this.countItems(),this.triggerChange()}clickMoveItemUp(e){var t=this.findItemFromTarget(e.target);t.prev().before(t),this.onSortableEnd()}clickMoveItemDown(e){var t=this.findItemFromTarget(e.target);t.next().after(t),this.onSortableEnd()}onAddItemButton(e){this.eventOnAddItem()}clickAddGroupButton(e){var t=this,i=$("> [data-group-palette-template]",this.$el).html(),r=$(e.target),a=this.$el.closest("form");r.ocPopover({content:i});var s=r.data("oc.popover").$container;oc.Events.dispatch("render"),s.on("click","a",(function(e){setTimeout((function(){$(e.target).trigger("close.oc.popover")}),2)})).on("ajaxSetup","[data-repeater-add]",(function(e,i){i.options.form=a.get(0),r.addClass("oc-loading"),a.one("ajaxComplete",(function(){r.removeClass("oc-loading"),t.itemCount++,t.triggerChange()})),t.eventOnAddItem()}))}onAddItemSuccess(e){this.itemCount++,this.triggerChange()}triggerChange(){this.togglePrompt(),this.$el.closest("[data-field-name]").trigger("change.oc.formwidget"),this.eventOnChange()}togglePrompt(){this.config.minItems&&this.config.minItems>0&&(this.canRemove=this.itemCount>this.config.minItems),this.config.maxItems&&this.config.maxItems>0&&(this.canAdd=this.itemCount<this.config.maxItems),this.$toolbar.toggle(this.canAdd),$("> [data-repeater-pointer-input]:first",this.$el).attr("disabled",!!this.itemCount)}getCollapseTitle(e){var t=e,i=this.getTitleFromAttribute(e),r=this.$el.data("default-title"),a=e.data("item-title"),s=!1;if(a&&!i)return a;if(i){var o=$('[data-field-name="'+i+'"]',e);o.length&&(t=o,s=!0)}if(a&&!s)return a;var l="",n=$("input[type=text]:first, select:first, textarea:first",t).first();if(n.length)l=n.is("select")?n.find("option:selected").text():n.is("textarea")?$("<div />").html(n.val()).text().substring(0,255):n.val();else{var d=$(".text-field:first > .form-control",t);d.length&&(l=d.text())}return l||r}getTitleFromAttribute(e){if(this.config.titleFrom)return this.config.titleFrom;var t=e.data("title-from");return t||null}findItemFromIndex(e){return $("> li[data-repeater-index="+e+"]:first",this.$itemContainer)}findItemFromTarget(e){return $(e).closest(".repeater-header").closest("li")}disposeItem(e){$("[data-disposable]",e).each((function(){var e=$(this),t=e.data("control"),i=e.data("oc."+t);i&&"function"==typeof i.dispose&&i.dispose()}))}getCheckedItemsOrItem(e){var t=this.getCheckedItems();return t.length||(t=[e]),t}getCheckedItems(){var e=$(this.selectorChecked,this.$el),t=[];return $.each(e,(function(e,i){t.push(i.closest("li"))})),t}countItems(){this.itemCount=$("> .field-repeater-item",this.$itemContainer).length,this.$el.toggleClass("repeater-empty",0===this.itemCount)}initToolbarExtensionPoint(){if(!this.config.externalToolbarAppState)return;const e=$.oc.vueUtils.getToolbarExtensionPoint(this.config.externalToolbarAppState,this.$el.get(0));e&&(this.toolbarExtensionPoint=e.state,this.externalToolbarEventBusObj=e.bus)}mountExternalToolbarEventBusEvents(){this.externalToolbarEventBusObj&&(this.externalToolbarEventBusObj.$on("toolbarcmd",this.proxy(this.onToolbarExternalCommand)),this.externalToolbarEventBusObj.$on("extendapptoolbar",this.proxy(this.extendExternalToolbar)))}unmountExternalToolbarEventBusEvents(){this.externalToolbarEventBusObj&&(this.externalToolbarEventBusObj.$off("toolbarcmd",this.proxy(this.onToolbarExternalCommand)),this.externalToolbarEventBusObj.$off("extendapptoolbar",this.proxy(this.extendExternalToolbar)))}onToolbarExternalCommand(e){var t="repeater-toolbar-";if(e.command.substring(0,t.length)==t){if(/^repeater-toolbar-add,/.test(e.command))return this.onAddItemClick(e.command);var i=e.command.substring(t.length);this.$el.find("> .field-repeater-builder > .field-repeater-toolbar, > .field-repeater-toolbar").find("[data-repeater-cmd="+i+"]").get(0).click(e.ev)}}onAddItemClick(e){var t=e.split(",");if(t[1]==this.repeaterId){var i=oc.parseJSON("{"+t[3]+"}"),r=this;this.externalToolbarEventBusObj.$emit("documentloadingstart"),this.$el.request(t[2],{data:i}).always((function(){r.externalToolbarEventBusObj.$emit("documentloadingend"),r.countItems()}))}}buildAddMenuItems(){if(this.addMenuItems)return this.addMenuItems;var e=$("> [data-group-palette-template]",this.$el).html(),t=$(e),i=this;return this.addMenuItems=[],t.find("ul > li > a").each((function(){var e=$(this),t=e.find("i.list-icon");i.addMenuItems.push({type:"text",label:e.find(".title").text(),icon:t.attr("class"),command:"repeater-toolbar-add,"+i.repeaterId+","+e.data("request")+","+e.data("requestData")})})),this.addMenuItems}extendExternalToolbar(){if(this.$el.is(":visible")&&this.toolbarExtensionPoint){this.toolbarExtensionPoint.splice(0,this.toolbarExtensionPoint.length),this.toolbarExtensionPoint.push({type:"separator"});var e=this;this.$el.find("> .field-repeater-builder > .field-repeater-toolbar a, > .field-repeater-toolbar a").each((function(){var t=$(this),i=t.find("i[class*=icon]"),r=[],a="add-group"==t.data("repeaterCmd");r=!!a&&e.buildAddMenuItems(),e.toolbarExtensionPoint.push({type:a?"dropdown":"button",icon:i.attr("class"),label:t.text(),command:"repeater-toolbar-"+t.attr("data-repeater-cmd"),disabled:void 0!==t.attr("disabled"),menuitems:r})}))}}eventSortableOnEnd(){}eventOnChange(){}eventOnAddItem(){}eventOnRemoveItem(){}eventOnErrorAddItem(){}eventMenuFilter(){}}return e})),oc.Modules.register("backend.formwidget.repeater.builder",(function(){const e=oc.Modules.import("backend.formwidget.repeater.base");oc.registerControl("repeaterbuilder",class extends e{init(){this.selectorToolbar="> .field-repeater-builder > .field-repeater-toolbar:first",this.selectorHeader="> .field-repeater-builder > .field-repeater-groups > .field-repeater-group > .repeater-header",this.selectorSortable="> .field-repeater-builder > .field-repeater-groups",this.selectorChecked="> .field-repeater-builder > .field-repeater-groups > .field-repeater-group > .repeater-header input[type=checkbox]:checked",super.init()}connect(){this.$el=$(this.element),this.$itemContainer=$("> .field-repeater-items",this.$el),this.$sidebar=$("> .field-repeater-builder > .field-repeater-groups:first",this.$el),this.$sidebar.on("click","> li:not(.is-placeholder)",this.proxy(this.clickBuilderItem)),$(document).on("render",this.proxy(this.builderOnRender)),this.transferBuilderItemHeaders(),this.selectBuilderItem(),super.connect()}disconnect(){this.$sidebar.off("click","> li:not(.is-placeholder)",this.proxy(this.clickBuilderItem)),$(document).off("render",this.proxy(this.builderOnRender)),this.$sidebar=null,super.disconnect()}builderOnRender(){this.transferBuilderItemHeaders()}clickBuilderItem(e){var t=$(e.target).closest(".field-repeater-group");$(e.target).closest(".group-controls").length||(this.selectBuilderItem(t.data("repeater-index")),$(window).trigger("oc.updateUi"))}selectBuilderItem(e){void 0===e&&(e=$("> li:first",this.$sidebar).data("repeater-index")),$("> li.is-selected",this.$sidebar).removeClass("is-selected"),$("> li[data-repeater-index="+e+"]",this.$sidebar).addClass("is-selected"),$("> li.is-selected",this.$itemContainer).removeClass("is-selected"),$("> li[data-repeater-index="+e+"]",this.$itemContainer).addClass("is-selected"),this.setCollapsedTitles()}setCollapsedTitles(){var e=this;$("> .field-repeater-item",this.$itemContainer).each((function(){var t=$(this),i=t.data("repeater-index"),r=$("> li[data-repeater-index="+i+"]",e.$sidebar);$("[data-group-title]:first",r).html(e.getCollapseTitle(t))}))}transferBuilderItemHeaders(){var e=this,t=$("> [data-group-template]",this.$el).html();$("> .field-repeater-item > .repeater-header",this.$itemContainer).each((function(){var i=$(t),r=$(this).closest("li");e.$sidebar.append(i),$("[data-group-controls]:first",i).replaceWith($(this).addClass("group-controls")),$("[data-group-image]:first > i",i).addClass(r.data("item-icon")),$("[data-group-title]:first",i).html(r.data("item-title")),$("[data-group-description]:first",i).html(r.data("item-description")),i.attr("data-repeater-index",r.data("repeater-index")),i.attr("data-repeater-group",r.data("repeater-group")),$("li.is-placeholder:first",e.$sidebar).remove(),e.selectBuilderItem(r.data("repeater-index"))}))}eventMenuFilter(e,t){$("[data-repeater-duplicate]",t).closest("li").toggleClass("disabled",!this.canAdd),$("[data-repeater-remove]",t).closest("li").toggleClass("disabled",!this.canRemove),$("[data-repeater-move-up]",t).closest("li").toggle(!!e.prev().length),$("[data-repeater-move-down]",t).closest("li").toggle(!!e.next().length),$("[data-repeater-expand]",t).closest("li").hide(),$("[data-repeater-collapse]",t).closest("li").hide()}eventSortableOnEnd(){this.sortable.option("disabled",!0),$("> li",this.$sidebar).each(((e,t)=>{var i=$(t).data("repeater-index"),r=this.findItemFromIndex(i);this.$itemContainer.append(r)})),this.sortable.option("disabled",!1)}eventOnAddItem(){var e=$("> [data-group-loading-template]",this.$el).html(),t=$(e);this.$sidebar.append(t)}eventOnErrorAddItem(){$("li.is-placeholder:first",this.$sidebar).remove()}eventOnRemoveItem(e){var t=e.data("repeater-index"),i=this.findItemFromIndex(t);this.disposeItem(i),i.remove()}})})),oc.Modules.register("backend.formwidget.repeater.accordion",(function(){const e=oc.Modules.import("backend.formwidget.repeater.base");oc.registerControl("repeateraccordion",class extends e{init(){this.selectorToolbar="> .field-repeater-toolbar:first",this.selectorHeader="> .field-repeater-items > .field-repeater-item > .repeater-header",this.selectorSortable="> .field-repeater-items",this.selectorChecked="> .field-repeater-items > .field-repeater-item > .repeater-header input[type=checkbox]:checked",super.init()}connect(){var e=this.selectorHeader;this.$el=$(this.element),this.$el.on("click",e,this.proxy(this.clickItemHeader)),this.$el.on("click",e+" [data-repeater-expand]",this.proxy(this.toggleCollapse)),this.$el.on("click",e+" [data-repeater-collapse]",this.proxy(this.toggleCollapse)),this.applyExpandedItems(),super.connect()}disconnect(){var e=this.selectorHeader;this.$el.off("click",e,this.proxy(this.clickItemHeader)),this.$el.off("click",e+" [data-repeater-expand]",this.proxy(this.toggleCollapse)),this.$el.off("click",e+" [data-repeater-collapse]",this.proxy(this.toggleCollapse)),super.disconnect()}clickItemHeader(e){var t=$(e.target);if(t.hasClass("repeater-header")||t.hasClass("repeater-item-title")||t.hasClass("repeater-item-checkbox")){var i=t.closest(".field-repeater-item"),r=i.hasClass("collapsed");this.config.itemsExpanded||this.collapseAll(),r?this.expand(i):this.collapse(i)}}applyExpandedItems(){if(!this.config.itemsExpanded){var e=$(this.$el).children(".field-repeater-items").children(".field-repeater-item"),t=this;$.each(e,(function(e,i){t.collapse($(i))}))}}toggleCollapse(e){var t=this,i=$(e.target).closest(".field-repeater-item"),r=i.hasClass("collapsed");e.preventDefault();var a=this.getCheckedItemsOrItem(i);$.each(a,(function(e,i){r?t.expand($(i)):t.collapse($(i))}))}collapseAll(){var e=this,t=$("> .field-repeater-item",this.$itemContainer);$.each(t,(function(t,i){e.collapse($(i))}))}expandAll(){var e=this,t=$("> .field-repeater-item",this.$itemContainer);$.each(t,(function(t,i){e.expand($(i))}))}collapse(e){e.addClass("collapsed"),$("> .repeater-header > .repeater-item-title",e).text(this.getCollapseTitle(e))}expand(e){e.removeClass("collapsed"),$(window).trigger("oc.updateUi")}eventOnAddItem(){this.config.itemsExpanded||this.collapseAll()}eventMenuFilter(e,t){$("[data-repeater-duplicate]",t).closest("li").toggleClass("disabled",!this.canAdd),$("[data-repeater-remove]",t).closest("li").toggleClass("disabled",!this.canRemove),$("[data-repeater-move-up]",t).closest("li").toggle(!!e.prev().length),$("[data-repeater-move-down]",t).closest("li").toggle(!!e.next().length),$("[data-repeater-expand]",t).closest("li").toggle(e.hasClass("collapsed")),$("[data-repeater-collapse]",t).closest("li").toggle(!e.hasClass("collapsed"))}})}));