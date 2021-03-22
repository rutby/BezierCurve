import MathUtils from "./MathUtils";
import RouteEditorCurveLine from "./RouteEditorCurveLine";
import RouteEditorCurveBezier from "./RouteEditorCurveBezier";

const {ccclass, property, menu, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
@menu('Scripts/RouteEditor/RouteEditor')
export default class RouteEditor extends cc.Component {
    @property(cc.Node) nodeGhost: cc.Node = null;

    dis: number = 0;
    curves: any = [];

    onLoad() {
    }

    update(dt) {
        this.dis += dt * 60 * 20;

        this.curves = [];
        var curves = this.node.children.filter(ele => ele.name.match('RouteEditor'));
        curves.forEach(element => {
            var compBezier = element.getComponent(RouteEditorCurveBezier);
            var compLine = element.getComponent(RouteEditorCurveLine);
            var comp = compBezier? compBezier: compLine;
            var type = compBezier? 1: 0;
            this.curves.push({
                type    : type,
                points  : comp.getKeyPoints(),
                dis     : comp.getTotalDistance(),
            });
        });

        this.nodeGhost.position = MathUtils.lerpCurves(this.curves, this.dis);

        if (this.dis > this.getTotalDistance()) {
            this.dis = 0;
        }
    }

    //================================================ private
    private getTotalDistance() {
        var sum = 0;
        this.curves.forEach(element => {
            sum += element.dis;
        });
        return sum;
    }
}
