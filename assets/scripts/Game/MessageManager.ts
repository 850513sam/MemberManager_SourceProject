import { Component, instantiate, Node, NodePool, Prefab, _decorator } from "cc";
import { StartUp } from "./StartUp";
import MessageDialog from "./GameObject/MessageDialog";
import Application from "../Application/Application";

const { ccclass, property } = _decorator;

@ccclass("MessageManager")
export default class MessageManager extends Component {
  @property(Node)
  private readonly messageDialogRoot: Node = null;

  @property(Prefab)
  private messageDialogPrefab: Prefab = null;

  private messageDialogPool: NodePool = new NodePool();

  private fatalErrorMessage: MessageDialog = null;
  private gameStateErrorMessage: MessageDialog = null;

  protected onLoad() {
    StartUp.getInstance().attachMessageManager(this);
  }

  public async showFatalError(message: string) {
    if (this.fatalErrorMessage) {
      return;
    }
    this.fatalErrorMessage = await this.getMessageDialog();
    this.fatalErrorMessage.node.once(MessageDialog.EventType.CLOSE, () => {
      this.fatalErrorMessage = null;
      StartUp.getInstance().closeGame();
    });
    if (Application.Instance.config.hideExit) {
      // hide exit button if needed
      this.fatalErrorMessage.closeButton.node.active = false;
    }
    this.fatalErrorMessage.node.setSiblingIndex(
      this.messageDialogRoot.children.length - 1
    );
    this.fatalErrorMessage.display(message);

    // if (this.messageDialogRoot) {
    //     this.messageDialogRoot.children.forEach((node) => node.getComponent(MessageDialog).close());
    // }
  }

  public async showGameStateError(message: string) {
    // can't open when displaying fatal error message
    if (this.fatalErrorMessage) {
      return;
    }
    if (this.gameStateErrorMessage) {
      return;
    }
    this.gameStateErrorMessage = await this.getMessageDialog();
    this.gameStateErrorMessage.node.once(MessageDialog.EventType.CLOSE, () => {
      this.gameStateErrorMessage = null;
    });
    this.gameStateErrorMessage.node.setSiblingIndex(
      this.messageDialogRoot.children.length - 1
    );
    this.gameStateErrorMessage.display(message);
  }

  public hideGameStateError() {
    this.gameStateErrorMessage?.close();
  }

  public async showHint(message: string) {
    // can't open when displaying fatal error message
    if (this.fatalErrorMessage) {
      return;
    }
    (await this.getMessageDialog()).display(message);
  }

  private async getMessageDialog() {
    const node =
      this.messageDialogPool.get() ?? (await this.spawnMessageDialog());
    this.messageDialogRoot.addChild(node);
    return node.getComponent(MessageDialog);
  }

  private async spawnMessageDialog() {
    const node = instantiate(this.messageDialogPrefab);
    node.on(MessageDialog.EventType.CLOSE, () =>
      this.messageDialogPool.put(node)
    );
    return node;
  }
}
