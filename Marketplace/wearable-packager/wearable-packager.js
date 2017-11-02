(function(){
    var APP_NAME = "WEARPKGR";
    var APP_URL = Script.resolvePath("app.html");
    var APP_ICON;

    var export_properties = {
        type: "Model",
        clientOnly: 1,
        parentID: "{00000000-0000-0000-0000-000000000001}",
        owningAvatarID: "{00000000-0000-0000-0000-000000000000}",
        visible: 0,
        collidesWith: ""
    }

    var tablet = Tablet.getTablet('com.highfidelity.interface.tablet.system');
    var button = tablet.addButton({
        text: APP_NAME
    });

    function clicked(){
        tablet.gotoWebScreen(APP_URL);
    }
    button.clicked.connect(clicked);

    function onWebEventReceived(event){
        print(JSON.stringify(event));
        if (typeof(event) === "string") {
            event = JSON.parse(event);
        }
        if (event.type === "submit") {
            var entityID = event.entityID;
            var joint = event.joint;

            var newExportProperties = export_properties;
            var properties = Entities.getEntityProperties(entityID, ['modelURL', 'dimensions', 'script']);

            newExportProperties.modelURL = properties.modelURL;
            newExportProperties.dimensions = properties.dimensions;
            newExportProperties.script = properties.script;

            var tempEntity = Entities.addEntity(newExportProperties, 1);
            var success = Clipboard.exportEntities("Wearable_" + tempEntity + ".json", tempEntity );
            if (success) {
                Entities.deleteEntity(tempEntity);
            } else {
                print("Error exporting entity");
            }
            

        }
    }

    tablet.webEventReceived.connect(onWebEventReceived);
    function cleanup(){
        tablet.removeButton(button);
    }

    Script.scriptEnding.connect(cleanup);
}());