import { _decorator, Component, Node, __private } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BindRotation')
export class BindRotation extends Component {
    @property(Node)
    private readonly referencedNode: Node = null;

    onLoad() {
        this.referencedNode.on(Node.EventType.TRANSFORM_CHANGED, (type: __private._cocos_core_scene_graph_node_enum__TransformBit) => {
            if (type === Node.TransformBit.ROTATION) {
                this.node.worldRotation = this.referencedNode.worldRotation;
            }
        });
    }
}
