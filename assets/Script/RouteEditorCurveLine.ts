import MathUtils from "./MathUtils";
import RouteEditorCurveBase from "./RouteEditorCurveBase";

const {ccclass, property, menu, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
@menu('Scripts/RouteEditor/RouteEditorCurveLine')
export default class RouteEditorCurveLine extends RouteEditorCurveBase {
    @property(cc.PolygonCollider) collider: cc.PolygonCollider = null;
    @property(cc.Graphics) graphicsLine: cc.Graphics = null;
    @property(cc.Node) nodeGhost: cc.Node = null;

    time: number = 0;

    //================================================ cc.Component
    update(dt) {
        this.time += dt;

        this.viewCurve();
        this.viewPos();
    }

    //================================================ RouteEditorCurveBase
    public getKeyPoints(): cc.Vec2[] {
        return this.collider.points;
    }

    public getTotalDistance(): number {
        var points = this.getKeyPoints();
        return cc.pDistance(points[0], points[1]);
    }

    //================================================ private
    private viewCurve() {
        var points = this.getKeyPoints();
        this.graphicsLine.clear();
        this.graphicsLine.moveTo(points[0].x, points[0].y);
        this.graphicsLine.lineTo(points[1].x, points[1].y);
        this.graphicsLine.stroke();
    }

    private viewPos() {
        var points = this.getKeyPoints();
        var percent = this.time - Math.floor(this.time);
        // this.nodeGhost.active = false;
        this.nodeGhost.position = MathUtils.lerpLinePos(points, percent);
    }
}
