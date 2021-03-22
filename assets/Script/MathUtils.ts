
/**
 * 数学工具类
 */

export default class MathUtils{
    /**
     * 获取贝塞尔曲线的差值坐标点(0-1)
     */
    static lerpBezierPos(posArr: cc.Vec2[], percent: number) {
        while(posArr.length > 3) {
            var newPosArr = [];
            var lastOne = posArr[0];
            for (var i = 1; i < posArr.length; i++) {
                var currOne = posArr[i];
                var vec = cc.pSub(currOne, lastOne);
                var newPos = cc.pAdd(lastOne, cc.pMult(vec, percent));
                newPosArr.push(newPos);
                lastOne = currOne;
            }
            posArr = newPosArr;
        }

        var p1 = posArr[0];
        var p2 = posArr[1];
        var p3 = posArr[2];
        var v1 = cc.pSub(p2, p1);
        var v2 = cc.pSub(p3, p2);
        var vp1 = cc.pAdd(p1, cc.pMult(v1, percent));
        var vp2 = cc.pAdd(p2, cc.pMult(v2, percent));
        return cc.pLerp(vp1, vp2, percent);
    }

    /**
     * 获取直线的差值坐标点(0-1)
     */
    static lerpLinePos(posArr: cc.Vec2[], percent: number) {
        var p1 = posArr[0];
        var p2 = posArr[1];
        return cc.pLerp(p1, p2, percent);
    }

    /**
     * 获取组合曲线的差值坐标点
     */
    static lerpCurves(curveArr: any, disCur: number) {
        var pos = null;
        var base = 0;
        
        for (var curveIndex = 0; curveIndex < curveArr.length; curveIndex++) {
            var curve = curveArr[curveIndex];
            var {dis, points, type} = curve;
            var percent = (disCur - base) / dis;
            if (percent < 1) {
                switch(type) {
                    case 0: 
                        pos = MathUtils.lerpLinePos(points, percent);
                        break;
                    case 1: 
                        pos = MathUtils.lerpBezierPos(points, percent);
                        break;
                }
                break;
            }
            base += dis;
        }

        if (pos == null) {
            var lastCurve = curveArr[curveArr.length - 1];
            pos = lastCurve.points[lastCurve.points.length - 1];
        }
        return pos;
    }
}
