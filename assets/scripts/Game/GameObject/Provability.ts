import { Button, instantiate, Label, Prefab, tween, UIOpacity, game, Game as CCGame } from "cc";
import { Vec3 } from "cc";
import { Tween } from "cc";
import { _decorator } from "cc";
import AnimatedPage from "../../Toolkit/Components/Page/AnimatedPage";
import AudioManager from "../AudioManager";
import { SoundEffect } from "../Config/audio.config";
import { StartUp, GameEventType } from "../StartUp";
import { Node } from "cc";
import { HiloPokerTool } from "../Hilo/HiloPokerTool";
import { HiloGameData } from "../Hilo/HiloGameData";
import { SpriteFrame } from "cc";
import { Sprite } from "cc";
const { ccclass, property } = _decorator;

enum ButtonIconType {
	NHASH = "nextHash",
	CLASS = "class",
	JSON = "json",
	LHASH = "lastHash",
}
@ccclass("ResultData")
export class ResultData {
	public Card: number = -1;
	public Secret: string = "";
}

@ccclass("Provability")
export class Provability extends AnimatedPage {
	@property(Button)
	private copyHashNextGameButton: Button = null;
	@property(Label)
	private hashNextGame: Label = null;
	@property(Node)
	private lastGameNode: Node = null;
	@property(Button)
	private copyJsonButton: Button = null;
	@property(Label)
	private json: Label = null;
	@property(Button)
	private copyHashLastGameButton: Button = null;
	@property(Label)
	private hashLastGame: Label = null;
	@property(Label)
	private finalResult: Label = null;
	@property(Button)
	private verifyButton: Button = null;
	@property(Node)
	private successfulMessage: Node = null;
	@property(Prefab)
	private copiedMessagePrefab: Prefab = null;
	@property(SpriteFrame)
	private tickIcon: SpriteFrame = null;
	@property(SpriteFrame)
	private copyIcon: SpriteFrame = null;
	private nextHash: string = "";
	private lastHash: string = "";
	private resultMessage: string = "";

	private msgTween: Tween<UIOpacity> = null;

	protected onLoad() {
		super.onLoad();
		this.verifyButton.node.on("click", this.verify.bind(this));
		StartUp.getInstance().node.on(
			GameEventType.NEXT_HASH,
			(hash) => this.setNextResultHash(hash),
			this
		);
		StartUp.getInstance().node.on(
			GameEventType.RESULT,
			(data) => this.setResult(data),
			this
		);
		StartUp.getInstance().node.on(
			GameEventType.ON_ENTER_TABLE,
			() => this.onEnterTable(),
			this
		);

		this.copyHashNextGameButton.node.on(
			`click`,
			this.copyHashNextGame.bind(this)
		);
		this.copyHashLastGameButton.node.on(
			`click`,
			this.copyHashLastGame.bind(this)
		);
		this.copyJsonButton.node.on(`click`, this.copyJson.bind(this));
		game.on(CCGame.EVENT_HIDE, () => {
			this.buttonImageTransformation(ButtonIconType.CLASS);
		})
	}

	protected start() {
		this.onEnterTable();
		StartUp.getInstance().node.emit(
			GameEventType.NEXT_HASH,
			HiloGameData.getInstance().getNextHash()
		);
	}

	public async open() {
		super.open();
		this.buttonImageTransformation(ButtonIconType.CLASS);
	}

	private updateUI() {
		this.hashNextGame.string = this.nextHash;
		this.json.string = this.resultMessage;
		let cardIndex: number = HiloGameData.getInstance().getCardIndex();
		this.finalResult.string = HiloPokerTool.getInstance()
			.getPokerValue(cardIndex)
			.toString();
	}

	private verify() {
		// const cryptor = new Cryptor("", 0);
		// const hash = cryptor.getSHA256Hash(this.resultMessage);
		if (this.lastHash === this.nextHash) {
			if (this.msgTween) {
				this.msgTween.stop();
			}
			this.msgTween = tween(this.successfulMessage.getComponent(UIOpacity))
				.to(0.2, { opacity: 255 })
				.delay(2)
				.to(0.2, { opacity: 0 })
				.start();
		}
	}

	private onEnterTable() {
		this.lastHash = this.nextHash;
		this.lastGameNode.active = false;
	}

	private setNextResultHash(hash: string) {
		this.lastHash = this.lastHash == "" || !this.lastHash ? hash : this.lastHash;
		this.nextHash = hash;
		this.hashLastGame.string = this.lastHash;
		this.updateUI();
	}

	private setResult(result: ResultData) {
		this.lastGameNode.active = true;
		this.lastHash = this.nextHash;
		const resultData = {
			Card: result.Card,
			Secret: result.Secret,
		};
		this.resultMessage = JSON.stringify(resultData);
		this.updateUI();
	}
	private buttonImageTransformation(type: ButtonIconType) {
		let _nextHash = (icon: SpriteFrame, click: boolean) => {
			this.copyHashNextGameButton.node.children[0].getComponent(
				Sprite
			).spriteFrame = icon;
			this.copyHashNextGameButton.node.getComponent(Button).interactable =
				click;
		};
		let _lastHash = (icon: SpriteFrame, click: boolean) => {
			this.copyHashLastGameButton.node.children[0].getComponent(
				Sprite
			).spriteFrame = icon;
			this.copyHashLastGameButton.node.getComponent(Button).interactable =
				click;
		};
		let _json = (icon: SpriteFrame, click: boolean) => {
			this.copyJsonButton.node.children[0].getComponent(Sprite).spriteFrame =
				icon;
			this.copyJsonButton.node.getComponent(Button).interactable = click;
		};
		switch (type) {
			case ButtonIconType.NHASH:
				_nextHash(this.tickIcon, false);
				_lastHash(this.copyIcon, true);
				_json(this.copyIcon, true);
				break;
			case ButtonIconType.LHASH:
				_nextHash(this.copyIcon, true);
				_lastHash(this.tickIcon, false);
				_json(this.copyIcon, true);
				break;
			case ButtonIconType.JSON:
				_nextHash(this.copyIcon, true);
				_lastHash(this.copyIcon, true);
				_json(this.tickIcon, false);
				break;
			case ButtonIconType.CLASS:
				_nextHash(this.copyIcon, true);
				_lastHash(this.copyIcon, true);
				_json(this.copyIcon, true);
				break;
			default:
				break;
		}
	}
	private copyHashNextGame() {
		this.copyToClipboard(this.nextHash);
		const msg = instantiate(this.copiedMessagePrefab);
		this.buttonImageTransformation(ButtonIconType.NHASH);
		msg.setPosition(
			this.copyHashNextGameButton.node.position.x,
			this.copyHashNextGameButton.node.position.y + 10
		);
		tween(msg.getComponent(UIOpacity))
			.to(0.3, { opacity: 255 })
			.delay(0.6)
			.to(0.3, { opacity: 0 })
			.call(() => msg.destroy())
			.start();
		tween(msg)
			.to(1.2, {
				position: new Vec3(msg.position.x, msg.position.y + 60, msg.position.z),
			})
			.start();
		this.view.addChild(msg);
	}

	private copyHashLastGame() {
		this.copyToClipboard(this.hashLastGame.string);
		const msg = instantiate(this.copiedMessagePrefab);
		this.buttonImageTransformation(ButtonIconType.LHASH);
		msg.setPosition(
			this.copyHashLastGameButton.node.position.x,
			this.copyHashLastGameButton.node.position.y + 10
		);
		tween(msg.getComponent(UIOpacity))
			.to(0.3, { opacity: 255 })
			.delay(0.6)
			.to(0.3, { opacity: 0 })
			.call(() => msg.destroy())
			.start();
		tween(msg)
			.to(1.2, {
				position: new Vec3(msg.position.x, msg.position.y + 60, msg.position.z),
			})
			.start();
		this.view.addChild(msg);
	}

	private copyJson() {
		this.copyToClipboard(this.resultMessage);
		const msg = instantiate(this.copiedMessagePrefab);
		this.buttonImageTransformation(ButtonIconType.JSON);
		msg.setPosition(
			this.copyJsonButton.node.position.x,
			this.copyJsonButton.node.position.y + 10
		);
		tween(msg.getComponent(UIOpacity))
			.to(0.3, { opacity: 255 })
			.delay(0.6)
			.to(0.3, { opacity: 0 })
			.call(() => msg.destroy())
			.start();
		tween(msg)
			.to(1.2, {
				position: new Vec3(msg.position.x, msg.position.y + 60, msg.position.z),
			})
			.start();
		this.view.addChild(msg);
	}

	private copyToClipboard(text: string) {
		AudioManager.Instance.playEffect(SoundEffect.BUTTON_CLICK);
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(text);
		} else {
			let textArea = document.createElement("textarea");
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand("copy");
				textArea.remove();
			} catch (err) {
				console.error(err);
			}
		}
	}
}
