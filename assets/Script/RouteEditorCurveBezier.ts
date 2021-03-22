import MathUtils from "./MathUtils";
import RouteEditorCurveBase from "./RouteEditorCurveBase";

const {ccclass, property, menu, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
@menu('Scripts/RouteEditor/RouteEditorCurveBezier')
export default class RouteEditorCurveBezier extends RouteEditorCurveBase {
    @property(cc.PolygonCollider) collider: cc.PolygonCollider = null;
    @property(cc.Graphics) graphicsCurve: cc.Graphics = null;
    @property(cc.Graphics) graphicsLength: cc.Graphics = null;
    @property(cc.Node) nodeGhost: cc.Node = null;
    @property(cc.Integer) splitCount: number = 20;
    @property({
        type: cc.Boolean,
    }) showSplitSegments: boolean = false;

    time: number = 0;

    //================================================ cc.Component
    update(dt) {
        this.time += dt;

        this.viewCurve(this.collider);
        this.viewPos();
        this.viewDistance(this.splitCount);
    }

    //================================================ RouteEditorCurveBase
    public getKeyPoints(): cc.Vec2[] {
        return this.collider.points;
    }

    public getTotalDistance(): number {
        var posArr = this.collider.points;
        var step = this.splitCount;
        var dis = 0;
        var lastOne = posArr[0];
        for (var i = 1; i < step; i++) {
            var pos = MathUtils.lerpBezierPos(posArr, i / step);
            dis += cc.pDistance(pos, lastOne);
            lastOne = pos;
        }
        return dis;
    }

    //================================================ private
    private viewCurve(collider: cc.PolygonCollider) {
        var p1 = collider.points[0] as cc.Vec2;
        var p2 = collider.points[1] as cc.Vec2;
        var p3 = collider.points[2] as cc.Vec2;
        var p4 = collider.points[3] as cc.Vec2;
        this.graphicsCurve.clear();
        this.graphicsCurve.moveTo(p1.x, p1.y);
        var isCubic = p4 != null;
        isCubic? this.graphicsCurve.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y): this.graphicsCurve.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
        this.graphicsCurve.stroke();
    }

    private viewPos() {
        var posArr = this.collider.points;
        var percent = this.time - Math.floor(this.time);
        var pos = MathUtils.lerpBezierPos(posArr, percent);
        this.nodeGhost.active = false;
        this.nodeGhost.position = pos;
    }

    private viewDistance(step: number) {
        if (!this.showSplitSegments) {
            this.graphicsLength.clear();
            return;
        }

        var posArr = this.collider.points;
        this.graphicsLength.clear();
        this.graphicsLength.moveTo(posArr[0].x, posArr[0].y);
        for (var i = 0; i < step; i++) {
            var pos = MathUtils.lerpBezierPos(posArr, i / step);
            this.graphicsLength.lineTo(pos.x, pos.y);
        }
        this.graphicsLength.lineTo(posArr[posArr.length - 1].x, posArr[posArr.length - 1].y);
        this.graphicsLength.stroke();
    }
}
