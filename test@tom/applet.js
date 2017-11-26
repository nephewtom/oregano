const Applet = imports.ui.applet;
const Main = imports.ui.main;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;
const Lang = imports.lang;
const GLib = imports.gi.GLib;// ++ Needed for starting programs and translations
const PopupMenu = imports.ui.popupMenu;

const EXTENSION_UUID = "test@tom";

function MyApplet(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);

        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);

        this.demo = new PopupMenu.PopupMenuItem("Awesome Text!");
        this.menu.addMenuItem(this.demo);
        
        // TODO: Entender que iconos se cargan
        // No sé como misteriosamente usa los iconos
        // Ficheros de iconos con ese nombre
        // /usr/share/app-install/icons/krfb.png
        // /usr/share/icons/oxygen/64x64/apps/krfb.png
        // /usr/share/icons/oxygen/22x22/apps/krfb.png
        // /usr/share/icons/oxygen/128x128/apps/krfb.png
        // /usr/share/icons/oxygen/16x16/apps/krfb.png
        // /usr/share/icons/oxygen/32x32/apps/krfb.png
        // /usr/share/icons/oxygen/48x48/apps/krfb.png
        
        this.set_applet_icon_name("krfb");
        this.set_applet_tooltip(_("Tom Applet Test"));
        this.flag = true;
        this.update_interval = 60000;
        this._update();
    },
    
    _update: function() {

        // TODO: Añadir ejecución de script que haga ping y ver que valore sacar (TTL, etc...)
        // global.log("_update:", this.update_interval);
        // No sé pq, si recargas, sigue logueando lo anterior... misterios de Cinnamon...
        
        if (this.flag == true) {
            this.set_applet_icon_name("user-desktop");
            this.flag = false;
        } else {
            this.set_applet_icon_name("krfb");
            this.flag = true;
        }

        // GLib.spawn_command_line_async('sh ' + this.appletPath + '/tomScript');

        // https://gist.github.com/buzztaiki/1487781/74ea93d3a30f20c7f094327db9cb263a6286f6d6

        let [res, out, err, status] = GLib.spawn_command_line_sync('pwd');
        global.log(out.toString());
        
        Mainloop.timeout_add(this.update_interval, Lang.bind(this, this._update));
    },
    
    on_applet_clicked: function(event) {
        // global.screen.toggle_desktop(global.get_current_time());
        //Util.spawn(['xeyes'])
        global.log("you clicked!")
        if (this.flag == true) {
            this.set_applet_icon_name("user-desktop");
            this.flag = false;
        } else {
            this.set_applet_icon_name("krfb");
            this.flag = true;
        }
        this.menu.toggle();
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    let myApplet = new MyApplet(orientation, panel_height, instance_id);
    return myApplet;
}
