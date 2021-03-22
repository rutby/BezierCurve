
const {ccclass, property, menu, executeInEditMode} = cc._decorator;

@ccclass
export default class RouteEditorCurveBase extends cc.Component {
    public getKeyPoints(): cc.Vec2[] {
        return [];
    }

    public getTotalDistance(): number {
        return 0;
    }
}
