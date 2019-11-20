
enchant();

//素材のパス
var IMAGE_PATH_CHARA		= "space3.png";
var IMAGE_PATH_SECRET		= "bigmonster1.gif";
var IMAGE_PATH_BAR			= "bar.png";
var IMAGE_PATH_BAR_2		= "bar2.png";
var IMAGE_PATH_BEAM			= "icon0.png";
var IMAGE_PATH_MAP			= "map2.png";
var IMAGE_PATH_BACKGROUND	= "avatarBg1.png";
var IMAGE_PATH_EFFECT		= "effect0.png";
var IMAGE_PATH_GAME_OVER	= "end.png";
var IMAGE_PATH_CLEAR		= "clear.png";

//ゲームサイズ、FPS
var SCREEN_WIDTH	= 320;	//ゲーム画面の幅
var SCREEN_HEIGHT	= 240;	//ゲーム画面の高さ
var FRAME_RATE		= 24;	//フレームレート

//ステージセレクト画面
var BOSS_NUM		= 4;	//ボスの数
var ICON_SIZE		= 52;	//アイコンのサイズ

//パラメータ
var BG_TILE_WIDTH	= 32;
var BG_TILE_HEIGHT	= 128;
var BG_TILE_TYPE	= 2;
var FLOOR_TILE_SIZE	= 16;
var FLOOR_LEFT		= FLOOR_TILE_SIZE;
var FLOOR_RIGHT		= SCREEN_WIDTH - FLOOR_TILE_SIZE;
var FLOOR_TOP		= FLOOR_TILE_SIZE;
var FLOOR_BOTTOM	= SCREEN_HEIGHT - FLOOR_TILE_SIZE * 3;
var FLOOR_WIDTH		= SCREEN_WIDTH - FLOOR_TILE_SIZE * 2;
var FLOOR_HEIGHT	= SCREEN_HEIGHT - FLOOR_TILE_SIZE * 2;
var FLOOR_GRAVITY	= 0.5;
var INPUT_UP_HOLD	= 0;
var INPUT_PUSH		= 1;
var INPUT_PUSH_HOLD	= 2;
var INPUT_UP		= 3;
//ビーム
var BEAM_TILE_NO				= 54;
var BEAM_SPEED					= 6;
//プレイヤーのパラメータ
var PLAYER_REST					= 2;
var PLAYER_SPEED				= 2;
var PLAYER_IMAGE_CHANGE_FRAME	= 2;
var PLAYER_HIT_POINT			= 32;
var PLAYER_JUMP_POWER			= 10;
var PLAYER_BEAM_POWER			= 1;
var PLAYER_INVINCIBLE_TIME		= FRAME_RATE * 2;
var PLAYER_BEAM_TILE_NO			= BEAM_TILE_NO;
//敵キャラのパラメータ
var ENEMY_SPEED					= 2;
var ENEMY_HIT_POINT				= 64;
var ENEMY_JUMP_POWER			= 12;
var ENEMY_BEAM_POWER			= 8;
var ENEMY_BEAM_TILE_NO			= BEAM_TILE_NO + 8;
//シロクマのパラメータ
var WHITE_SPEED					= 8;
var WHITE_HIT_POINT				= 10;
var WHITE_IMAGE_CHANGE_FRAME	= 1;
//ガールクマのパラメータ
var GIRL_SPEED					= 3;
var GIRL_HIT_POINT				= 20;
var GIRL_BEAM_POWER				= 2;
var GIRL_JUMP_POWER				= 10;
var GIRL_IMAGE_CHANGE_FRAME		= PLAYER_IMAGE_CHANGE_FRAME;
//ドラゴンのパラメータ
var DRAGON_HIT_POINT			= 128;	//体力
var DRAGON_BITE_POWER			= 10;
var DRAGON_BEAM_POWER			= 6;	//ビーム
var DRAGON_EXPLOSION_POWER		= 16;	//爆発
var DRAGON_ROUND_2				= Math.floor(DRAGON_HIT_POINT / 4);	//第2形態になる体力(以下で)
var DRAGON_BITE_TIME			= 20;

var DRAGON_DEBUG				= false;

var game = null;

window.onload = function(){

	game = new Core(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.fps = FRAME_RATE;
	game.preload(
		IMAGE_PATH_CHARA,
		IMAGE_PATH_SECRET,
		IMAGE_PATH_BAR,
		IMAGE_PATH_BAR_2,
		IMAGE_PATH_MAP,
		IMAGE_PATH_BACKGROUND,
		IMAGE_PATH_BEAM,
		IMAGE_PATH_EFFECT,
		IMAGE_PATH_GAME_OVER,
		IMAGE_PATH_CLEAR
	);
	
	//キー設定
	game.keybind(' '.charCodeAt(0), "attack");
	game.input.space = INPUT_UP_HOLD;
	game.on("attackbuttondown", function(){
		var input = game.input;
		if(input.space === INPUT_PUSH || input.space === INPUT_PUSH_HOLD){
			input.space = INPUT_PUSH_HOLD;
		} else {
			input.space = INPUT_PUSH;
		}
	});
	game.on("attackbuttonup", function(){
		game.input.space = INPUT_UP;
	});
	game.on("enterframe", function(){
		if(game.input.space === INPUT_PUSH){
			game.input.space = INPUT_PUSH_HOLD;
		} else if(game.input.space == INPUT_UP){
			game.input.space = INPUT_UP_HOLD;
		}
	});
	
	/**
	 * メイン処理
	 */
	game.onload = function(){

		var scene = game.rootScene;
		
		this.title = new Title();
		this.stageSelect = new StageSelect();

		game.pushScene(this.title);
		
		game.on("enterframe", function(){
		});
	};
	
	/**
	 * タイトル
	 */
	var Title = Class.create(Scene, {
		//初期化
		initialize: function(){
			Scene.call(this);
			this.backgroundColor = "#AA8866";
			
			this.kuma = [];
			
			for(var i=0; i<4; i++){
				this.kuma[i] = new Sprite(32, 32);
				this.kuma[i].image = game.assets[IMAGE_PATH_CHARA];
				this.kuma[i].frame = i * 5;
				this.kuma[i].scale(3.0, 3.0);
				this.kuma[i].moveTo(16, 16);	//左上を0,0に合わせた
				this.addChild(this.kuma[i]);
			}
			
			this.kuma[0].moveBy(20, 140);
			this.kuma[1].moveBy(170, 100);
			this.kuma[1].scaleX *= -1;
			this.kuma[2].moveBy(205, 120);
			this.kuma[2].scaleX *= -1;
			this.kuma[3].moveBy(240, 140);
			this.kuma[3].scaleX *= -1;
			
			var rogo = new Label("ロッ熊ン");
			rogo.color = "#442200";
			rogo.font = "50px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
			rogo.moveTo(50, 20);
			this.addChild(rogo);

			var label = new Label();
			label.text = "";
			label.text += "space	決定、弾を撃つ" + "<br />";
			label.text += "左右キー　	移動" + "<br />";
			label.text += "上キー　	ジャンプ" + "<br />";
			label.color = "#000";
			label.font = "10px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
			var x = game.width / 2 - 60;
			var y = 180;
			label.moveTo(x, y);
			
			this.addChild(label);
		},
		onenterframe: function(){
			var input = game.input;
			if(input.space === INPUT_PUSH){
				game.replaceScene(new StoryLine());
			}
		}
	});
	
	/**
	 * 流れる文章を扱うScene
	 */
	var ScrollSentenceScene = Class.create(Scene, {
		//初期化
		initialize: function(scrollSpeed){
			Scene.call(this);
			this.scrollSpeed = scrollSpeed;
			
			//実際の文章を格納しておくラベル
			this.sentence = new Label();
			this.sentence.text = "";
			//↓デフォルトのフォントなので好きなように変更して扱う
			this.sentence.color = "black";
			this.sentence.font = "13px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
			
		},
		onenterframe: function(){
			this.update();
			this.scroll();
		},
		update: function(){
			//継承先ではここに必要な更新処理を追加する
		},
		//文章のスクロール
		scroll: function(){
			this.sentence.y -= this.scrollSpeed;
		}
	});
	
	/**
	 * あらすじ
	 */
	var StoryLine = Class.create(ScrollSentenceScene, {
		initialize: function(){
			ScrollSentenceScene.call(this, 0.5);
			
			this.frameTime = 0;
			this.frameList = [0, 1, 0, 2];
			
			this.sprite = new Sprite(32, 32);
			this.sprite.image = game.assets[IMAGE_PATH_CHARA];
			this.sprite.scale(5.0, 5.0);
			this.sprite.moveTo(32, 32); //左上を0,0へ移動
			this.sprite.moveBy(10, 50);
			this.sprite.opacity = 0.3;
			this.addChild(this.sprite);
			
			this.sentence.moveTo(10, game.height);
			this.sentence.text = "";
			this.sentence.text += "村の平和を守るロッ熊ン！" + "<br />";
			this.sentence.text += "今日もパトロールをしていると" + "<br />";
			this.sentence.text += "なにやら村が騒がしい" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "慌てて駆けつけると・・・" + "<br />";
			this.sentence.text += "とても温厚な熊村の熊達が暴れている！" + "<br />";
			this.sentence.text += "なんとか自体を収集させようとするロッ熊ン！！" + "<br />";
			this.sentence.text += "そこに3匹の影が・・・" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "全身真っ白な白熊の「ホワイト」" + "<br />";
			this.sentence.text += "リボンを付けた女の子「ベア子」" + "<br />";
			this.sentence.text += "熊の中で唯一NASAで勤めている「クマ三郎」" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "「この騒ぎは俺たちが引き起こしたんだ」" + "<br />";
			this.sentence.text += "「止めたければ私達と戦うことね」" + "<br />";
			this.sentence.text += "「待っているでござる」" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "3匹は好き勝手言ってそそくさと逃げていく" + "<br />";
			this.sentence.text += "平和な熊村の安泰を守るため！" + "<br />";
			this.sentence.text += "3匹の元へ向かうロッ熊ン！！" + "<br />";
			this.addChild(this.sentence);
			
			var topSurface = new Surface(game.width, 15);
			topSurface.context.fillStyle = "#DDBB99";
			topSurface.context.fillRect(0, 0, game.width, 15);
			var topSprite = new Sprite(game.width, 15);
			topSprite.image = topSurface;
			topSprite.moveTo(0, 0);
			this.addChild(topSprite);
			
			this.skipInfo = new Label();
			this.skipInfo.text = "spaceキーでスキップできるよ";
			this.skipInfo.color = "black";
			this.skipInfo.font = "10px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";;
			this.skipInfo.moveTo(game.width - 130 ,2);
			this.addChild(this.skipInfo);
		},
		update: function(){
			var index = Math.floor(this.frameTime/4) % 4;				
			var input = game.input;
			if(input.left === true){
				this.sprite.scaleX = -5.0;
				this.sprite.frame = this.frameList[index];
				this.frameTime++;
			} else if(input.right === true){
				this.sprite.scaleX = 5.0;
				this.sprite.frame = this.frameList[index];
				this.frameTime++;
			} else if(input.up === true){
				this.sprite.frame = 3;
				this.frameTime = 0;
			} else if(input.down === true){
				this.sprite.frame = 4;
				this.frameTime = 0;
			} else {
				this.sprite.frame = 0;
				this.frameTime = 0;
			}
			
			if(input.space === INPUT_PUSH){
				game.replaceScene(game.stageSelect);
			}
		}
	});
	
	/**
	 * ドラゴン出現イベント
	 */
	var EventAppearDragon = Class.create(ScrollSentenceScene, {
		//初期化
		initialize: function(){
			ScrollSentenceScene.call(this, 1.0);

			//熊達
			this.kuma = [];
			for(var i=0; i<4; i++){
				this.kuma[i] = new Sprite(32, 32);
				this.kuma[i].image = game.assets[IMAGE_PATH_CHARA];
				this.kuma[i].frame = i * 5;
				this.kuma[i].opacity = 0.5;
				this.addChild(this.kuma[i]);
			}
			this.kuma[0].scaleX = -1;	//ノーマル熊だけ左向き
			this.kuma[0].moveTo(200, 180);
			this.kuma[1].moveTo(84, 116);
			this.kuma[2].moveTo(52, 148);
			this.kuma[3].moveTo(20, 180);
			
			this.sentence.text += "３匹の熊を倒したロッ熊ン" + "<br />";
			this.sentence.text += "しかし３匹の話を聞くとこの騒動は" + "<br />";
			this.sentence.text += "ドラゴンが引き起こしたのだった！！" + "<br />";
			this.sentence.text += "３匹はドラゴンに操られていただけ・・・" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "ロッ熊ンは元凶のドラゴンの元へ向かうのであった・・・" + "<br />";
			this.sentence.moveBy(0, game.height);	//画面外へ移動
			this.addChild(this.sentence);
		},
		update: function(){
			if(game.input.space === INPUT_PUSH){
				game.replaceScene(game.stageSelect);
			}
		}
	});
	
	/**
	 * ゲームクリア
	 */
	var GameClearScene = Class.create(ScrollSentenceScene, {
		initialize: function(){
			ScrollSentenceScene.call(this, 0.5);
			
			this.sentence = new Label();
			this.sentence.color = "black";
			this.sentence.font = "13px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
			this.sentence.moveTo(10, game.height);
			this.sentence.text = "";
			this.sentence.text += "ロッ熊ンはついに凶悪なドラゴン倒した" + "<br />";
			this.sentence.text += "ボロボロになりながらも熊村に戻ると" + "<br />";
			this.sentence.text += "そこにはいつもの平和な熊村があった" + "<br />";
			this.sentence.text += "傷ついたロッ熊ンを暖かく迎える村の熊達" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "今日もロッ熊ンは村の平和を守っている・・・" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "" + "<br />";
			this.sentence.text += "最後までプレイしてくれてありがとう！" + "<br />";
			this.sentence.text += "実はあらすじで背景のロッ熊ンを動かせるよ" + "<br />";
			this.addChild(this.sentence);

			this.sprite = new Sprite(32, 32);
			this.sprite.image = game.assets[IMAGE_PATH_CHARA];
			this.sprite.frame = 0;
			var x = (game.width-this.sprite.width)/2;
			var y = (game.height-this.sprite.height)/2;
			this.sprite.moveTo(x, y);
			this.addChild(this.sprite);
			
			this.notice = new Sprite(267, 48);
			this.notice.image = game.assets[IMAGE_PATH_CLEAR];
			this.addChild(this.notice);
			
		},
		update: function(){
		
			if(game.input.space === INPUT_PUSH){
				var score = (game.stageSelect.playerRest+1) * 20000 - game.fps;
				if(score <= 1000){
					score = 1000;
				}
				game.end(score, "クリアおめでとう！");
			}
		}
	});
	
	/**
	 * ゲームオーバー
	 */
	var GameOverScene = Class.create(Scene, {
		initialize: function(){
			Scene.call(this);
			this.backgroundColor = "black";
			

			//絶望したクマ
			this.kuma = new Sprite(32, 32);
			this.kuma.image = game.assets[IMAGE_PATH_CHARA];
			this.kuma.frame = 0;
			var x = (game.width-this.kuma.width)/2;
			var y = (game.height-this.kuma.height)/2;
			this.kuma.moveTo(x, y);
			this.kuma.scale(5.0, 5.0);
			this.addChild(this.kuma);
			
			//ゲームオーバーの画像
			this.notice = new Sprite(189, 97);
			this.notice.image = game.assets[IMAGE_PATH_GAME_OVER];
			this.notice.opacity = 0.0;
			var x2 = (game.width-this.notice.width)/2;
			var y2 = (game.height-this.notice.height)/2;
			this.notice.moveTo(x2, y2);
			this.addChild(this.notice);
			
		},
		onenterframe: function(){
			this.kuma.tl
				.delay(30)
				.then(function(){ this.frame = 3; })
				.fadeOut(1).fadeIn(1).fadeOut(1).fadeIn(1).fadeOut(1).fadeIn(1).fadeOut(1).fadeIn(1)
				.fadeOut(1).fadeIn(1).fadeOut(1).fadeIn(1).fadeOut(1).fadeIn(1).fadeOut(1).fadeIn(1)
				.delay(10)
				.rotateTo(180, 180).and().scaleTo(0.0, 0.0, 180).and().fadeOut(180);
				
			this.notice.tl
				.delay(60)
				.fadeIn(240);
					
			if(game.input.space === INPUT_PUSH){
				game.end(0, "残念！！");
			}
		}
	});
	
	/**
	 * ビーム
	 */
	var  Beam = Class.create(Group, {
		//初期化
		//	param	x			X軸
		//	param	y			Y軸
		//	param	direction	向き	-1:左 1:右
		initialize: function(x, y, direction, power){
			Group.call(this);
			
			//ビーム本体の画像
			this.sprite = new Sprite(16, 16);
			this.sprite.image = game.assets[IMAGE_PATH_BEAM];
			this.sprite.scaleX = direction;
			this.addChild(this.sprite);
			
			//ビームの当たり判定の矩形
			var surface = new Surface(16, 4);
			surface.context.fillStyle = "white";
			surface.context.fillRect(0, 0, 16, 4);
			this.collision = new Sprite(16, 4);
			this.collision.image = surface;
			this.collision.opacity = 0.0;
			this.collision.moveTo(0, 6);
			this.addChild(this.collision);
			
			this.moveTo(x, y);
			this.vx = BEAM_SPEED;
			this.power = power;
		},
		onenterframe: function(){
			this.update();
		},
		//更新処理
		update: function(){
			this.x += (this.vx * this.sprite.scaleX);			
		}
	});
	
	/**
	 * 動作キャラ(敵も同じ)
	 */
	var Chara = Class.create(Group, {
		initialize: function(){
			Group.call(this);
			
			this.sprite = new Sprite(32, 32);
			this.sprite.image = game.assets[IMAGE_PATH_CHARA];
			this.sprite.frame = 0;
			this.sprite.moveTo(0, 0);
			this.addChild(this.sprite);
			
			var surface = new Surface(16, 32);
			surface.context.fillStyle = "white";
			surface.context.fillRect(0, 0, 16, 32);
		
			this.collision = new Sprite(16, 32);
			this.collision.image = surface;
			this.collision.opacity = 0.0;
			this.collision.moveTo(8, 0);
			this.addChild(this.collision);
			
			this.moveFlag = false;
			this.jumpFlag = false;
			this.vx = 0;
			this.vy = 1;
			this.jumpPower;

			this.moveFrame = 0;
			this.frameIndexMove = 0;
			this.frameListMove = [];
			this.imageChageInterval = PLAYER_IMAGE_CHANGE_FRAME;
			
			this.beamMax = 3;	//ビームの最大表示数
			this.beamNum = 0;
			this.beamList = [];
			
			this.frameDamage = 3;
			this.maxInvincibleTime = 0;
			this.isInvincible = false;
			this.invincibleTimer = 0;
		},
		onenterframe: function(){
			this.update();
			this.animation();
		},
		//更新処理
		update: function(){
			//継承先で記述する
		},
		//アニメーション
		animation: function(){
		
		
			if(this.isInvincible === true){
				if(this.invincibleTimer >= this.maxInvincibleTime/4){
					if(this.moveFlag === true){
						if(this.moveFrame >= this.imageChageInterval){
							this.frameIndexMove++;
							this.moveFrame = 0;
						}
						this.frameIndexMove %= this.frameListMove.length;
						this.sprite.frame = this.frameListMove[this.frameIndexMove];
						this.moveFrame++;
					} else {
						this.moveFrame = 0;
						this.sprite.frame = this.frameListMove[0];
					}					
				} else {
					this.sprite.frame = this.frameDamage;
					this.moveFrame = 0;
				}
				
				this.sprite.opacity = this.sprite.age % 2 ? 1.0 : 0.5;
			} else {
				if(this.moveFlag === true){
					if(this.moveFrame >= this.imageChageInterval){
						this.frameIndexMove++;
						this.moveFrame = 0;
					}
					this.frameIndexMove %= this.frameListMove.length;
					this.sprite.frame = this.frameListMove[this.frameIndexMove];
					this.moveFrame++;
				} else {
					this.moveFrame = 0;
					this.sprite.frame = this.frameListMove[0];
				}
				
				this.sprite.opacity = 1.0;
			}
		},
		//移動
		//	param	direction	マイナス:左 プラス:右 0:移動してない
		move: function(direction){
			if(direction < 0){
				this.x -= this.vx;
				this.sprite.scaleX = -1;
				this.moveFlag = true;
			} else if(direction > 0){
				this.x += this.vx;
				this.sprite.scaleX = 1;
				this.moveFlag = true;
			} else {
				this.moveFlag = false;
			}
			this.moveControl();
		},
		//移動後の制御
		moveControl: function(){
			var left	= FLOOR_LEFT - this.collision.x;
			var right	= FLOOR_RIGHT - (this.sprite.width - 8);
			
			if(this.x < left) 		{ this.x = left; }
			else if(this.x > right)	{ this.x = right; }
		},
		//ジャンプ
		//	param	isJump	ジャンプ入力されたか
		jump: function(isJump){
			var bottom = FLOOR_BOTTOM - this.collision.height;
			if(this.jumpFlag){
				//重力をかける
				if(isJump != true && this.vy < 0){
					//上昇中
					this.vy = 0;
				}
				this.vy += FLOOR_GRAVITY;
				this.y += this.vy
				
			} else {
				if(isJump == true){
					//ジャンプの開始
					this.jumpFlag = true;
					this.vy = -this.jumpPower;
				} else {
					if(this.y < bottom){
						this.jumpFlag = true;
						this.vy = 0;
					}
				}
			}
			this.vy += FLOOR_GRAVITY;
			this.y += this.vy
			
			if(this.y > bottom){
				this.y = bottom;
				this.jumpFlag = false;
				this.vy = 0;
			}
		},
		//攻撃
		//	param	attackPower	攻撃力
		//	param	frameNo		画像のフレーム番号
		attack: function(attackPower, frameNo){
			if(this.beamNum < this.beamMax){
				for(var i=0; i<this.beamMax; i++){
					if((this.beamList[i] === null) || this.beamList[i] === undefined){
						var x;
						if(this.sprite.scaleX === 1){
							var x = this.x + 16;
						} else {
							var x = this.x;
						}
						var y = this.y + 8;

						this.beamList[i] = new Beam(x, y, this.sprite.scaleX, attackPower);
						this.beamList[i].sprite.frame = frameNo;
						this.parentNode.addChild(this.beamList[i]);
						this.beamNum++;
						break;
					}
				}
			}

		},
		//死んだときの処理
		die: function(){
			this.onenterframe = null;
		
			var sprite = new Sprite(16, 16);
			sprite.image = game.assets[IMAGE_PATH_EFFECT];
			sprite.frame = 0;
			
			this.addChild(sprite);
			
			sprite.tl
				.then( function(){
					var x = Math.floor(Math.random()*5) + 8;
					var y = Math.floor(Math.random()*5) + 8;
					this.moveTo(x, y);
					this.frame = 0;
				})
				.delay(4).then(function(){ this.frame++; })
				.delay(4).then(function(){ this.frame++; })
				.delay(4).then(function(){ this.frame++; })
				.delay(4)
				.loop();
		},
	});

	//プレイヤークラス
	var Player = Class.create(Chara, {
		initialize: function(){
			Chara.call(this);
			
			this.vx = PLAYER_SPEED;
			this.initPosition();
			
			this.jumpPower = PLAYER_JUMP_POWER;
			
			this.frameListMove = [0, 1, 0, 2];
			
			this.beamMax = 3;	//ビームの最大表示数
			this.beamNum = 0;
			this.beamList = [];
			for(var i=0; i<this.beamMax; i++){
				this.beamList[i] = null;
			}
			
			this.frameDamage = 3;
			this.maxInvincibleTime = PLAYER_INVINCIBLE_TIME;
		},
		//更新処理
		update: function(){
			var input = game.input;
			
			if((this.isInvincible === false)){
				//横移動
				if(input.left)		{ this.move(-1); }
				else if(input.right){ this.move( 1); }
				else 				{ this.move( 0); }
				this.jump(input.up);	//ジャンプ
				//攻撃
				if(input.space === INPUT_PUSH){
					this.attack(PLAYER_BEAM_POWER, PLAYER_BEAM_TILE_NO);
				}
			} else if(this.isInvincible === true){
				if(this.invincibleTimer >= this.maxInvincibleTime){
					this.isInvincible = false;
					this.invincibleTimer = 0;
				} else if(this.invincibleTimer >= this.maxInvincibleTime/4){
					//横移動
					if(input.left)		{ this.move(-1); }
					else if(input.right){ this.move( 1); }
					else 				{ this.move( 0); }
					this.jump(input.up);	//ジャンプ
					//攻撃
					if(input.space === INPUT_PUSH){
						this.attack(PLAYER_BEAM_POWER, PLAYER_BEAM_TILE_NO);
					}
				} else {
					this.jump(false);	//ジャンプ
				}

				this.invincibleTimer++;
			}
		},
		//初期位置
		initPosition: function(){
			var x = 32;
			var y = game.height - (FLOOR_TILE_SIZE*3) - this.sprite.height;
			this.moveTo(x, y);
		}
	});
	
	
	//敵キャラ
	//白クマ　速い
	var WhiteKuma = Class.create(Chara, {
		//初期化
		initialize: function(){
			Chara.call(this);
			
			this.sprite.frame = 5;
			
			this.pattern = 0;
			var x = game.width - this.sprite.width - 32;
			var y = game.height - (FLOOR_TILE_SIZE*3) - this.sprite.height;
			this.moveTo(x, y);
			this.sprite.scaleX = -1;
			this.imageChageInterval = WHITE_IMAGE_CHANGE_FRAME;
			
			this.beamMax = 30;	//ビームの最大表示数

			this.vx = WHITE_SPEED;
			this.frameListMove = [5, 6, 5, 7];
			this.jumpPower = ENEMY_JUMP_POWER;

			this.frameDamage = 8;
			
			this.setAttackInterval();
			this.setJumpInterval();
		},
		//更新処理
		update: function(){
			
			this.move(this.sprite.scaleX);
 			
			if(this.jumpFlag === true){
				//ジャンプ中
				this.jump(true);
				
				if(this.jumpFlag === false){
					//ジャンプが終わった
					this.setJumpInterval();
				}
			} else {
				if((this.jumpTimer >= this.jumpIntervalTime) && (this.jumpTimer != 0)){
					this.jump(true);
					this.jumpTimer = 0;
				} else {
					this.jump(false);
					this.jumpTimer++;
				}
			}
 
			if((this.attackTimer >= this.attackIntervalTime) && (this.attackTimer !== 0)){
				this.attack(1, ENEMY_BEAM_TILE_NO);
				this.setAttackInterval();
			} else {
				this.attackTimer++;
			}
			
			this.isInvincible = false;
		},
		//移動後の制御
		moveControl: function(){
			var left	= FLOOR_LEFT - this.collision.x;
			var right	= FLOOR_RIGHT - (this.sprite.width - 8);
			
			if(this.x < left) 		{ this.x = left;	this.sprite.scaleX =  1; }
			else if(this.x > right)	{ this.x = right;	this.sprite.scaleX = -1; }
		},
		//攻撃のインターバルをセット
		setAttackInterval: function(){
			this.attackIntervalTime = 1;
			this.attackTimer = 0;
		},
		//ジャンプのインターバルをセット
		setJumpInterval: function(){
			this.jumpIntervalTime = 3;
			this.jumpTimer = 0;
		}
	});

	//ガールクマ
	var GirlKuma = Class.create(Chara, {
		//初期化
		initialize: function(){
			Chara.call(this);
			
			this.sprite.frame = 10;
			
			var x = game.width - this.sprite.width - 32;
			var y = game.height - (FLOOR_TILE_SIZE*3) - this.sprite.height;
			this.moveTo(x, y);
			this.sprite.scaleX = -1;
			this.imageChageInterval = WHITE_IMAGE_CHANGE_FRAME;
			
			this.jumpPower = GIRL_JUMP_POWER;
			
			this.beamMax = 3;	//ビームの最大表示数

			this.vx = GIRL_SPEED;
			this.frameListMove = [10, 11, 10, 12];
			this.jumpPower = ENEMY_JUMP_POWER;

			this.frameDamage = 13;
			
			this.setAttackInterval();
			this.setJumpInterval();
		},
		//更新処理
		update: function(){
			
			this.move(this.sprite.scaleX);
 			
			if(this.jumpFlag === true){
				//ジャンプ中
				this.jump(true);
				
				if(this.jumpFlag === false){
					//ジャンプが終わった
					this.setJumpInterval();
				}
			} else {
				if((this.jumpTimer >= this.jumpIntervalTime) && (this.jumpTimer != 0)){
					this.jump(true);
					this.jumpTimer = 0;
				} else {
					this.jump(false);
					this.jumpTimer++;
				}
			}
 
			if((this.attackTimer >= this.attackIntervalTime) && (this.attackTimer !== 0)){
				this.attack(GIRL_BEAM_POWER, ENEMY_BEAM_TILE_NO);
				this.setAttackInterval();
			} else {
				this.attackTimer++;
			}

			this.isInvincible = false;
		},
		//移動後の制御
		moveControl: function(){
			var left	= FLOOR_LEFT - this.collision.x;
			var right	= FLOOR_RIGHT - (this.sprite.width - 8);
			
			if(this.x < left) 		{ this.x = left;	this.sprite.scaleX =  1; }
			else if(this.x > right)	{ this.x = right;	this.sprite.scaleX = -1; }
		},
		//攻撃のインターバルをセット
		setAttackInterval: function(){
			this.attackIntervalTime = 10;
			this.attackTimer = 0;
		},
		//ジャンプのインターバルをセット
		setJumpInterval: function(){
			this.jumpIntervalTime = 10;
			this.jumpTimer = 0;
		}
	});
	
	//スペースクマ
	var SpaceKuma = Class.create(Chara, {
		//初期化
		initialize: function(){
			Chara.call(this);
			
			this.sprite.frame = 15;
			
			this.pattern = 0;
			var x = game.width - this.sprite.width - 32;
			var y = game.height - (FLOOR_TILE_SIZE*3) - this.sprite.height;
			this.moveTo(x, y);
			this.sprite.scaleX = -1;
			
			this.beamMax = 10;	//ビームの最大表示数

			this.vx = ENEMY_SPEED;
			this.frameListMove = [15, 16, 15, 17];
			this.jumpPower = ENEMY_JUMP_POWER;
			
			this.frameDamage = 18;
			
			this.attackIntervalTime = Math.floor(Math.random()*game.fps);
			this.attackTimer = 0;
			this.jumpIntervalTime = Math.floor(Math.random()*50);
			this.jumpTimer = 0;
			this.flipIntervalTime = game.fps * 3;
			this.flipTimer = 0;
		},
		//更新処理
		update: function(){
			
			this.flip();
			this.move(this.sprite.scaleX);
			
			if(this.jumpFlag === true){
				//ジャンプ中
				this.jump(true);
				
				if(this.jumpFlag === false){
					//ジャンプが終わった
					this.jumpIntervalTime = Math.floor(Math.random()*100);
				}
			} else {
				if((this.jumpTimer >= this.jumpIntervalTime) && (this.jumpTimer != 0)){
					this.jump(true);
					this.jumpTimer = 0;
				} else {
					this.jump(false);
					this.jumpTimer++;
				}
			}
			
			if((this.attackTimer >= this.attackIntervalTime) && (this.attackTimer !== 0)){
				this.attack(ENEMY_BEAM_POWER, ENEMY_BEAM_TILE_NO);
				this.attackIntervalTime = Math.floor(Math.random()*game.fps);
				this.attackTimer = 0;
			} else {
				this.attackTimer++;
			}

			this.isInvincible = false;
		},
		//移動後の制御
		moveControl: function(){
			var left	= FLOOR_LEFT - this.collision.x;
			var right	= FLOOR_RIGHT - (this.sprite.width - 8);
			
			if(this.x < left) 		{ this.x = left;	this.sprite.scaleX =  1; }
			else if(this.x > right)	{ this.x = right;	this.sprite.scaleX = -1; }
		},
		//振り向き
		flip: function(){
			
			
			if((this.flipTimer >= this.flipIntervalTime) && (this.flipTimer !== 0)){
				this.flipIntervalTime = game.fps * Math.floor(Math.random()*10);;
				this.flipTimer = 0;
				this.sprite.scaleX *= -1;
			} else {
				this.flipTimer++;
			}
		}
	});
	
	/**
	 * ドラゴンの攻撃
	 */
	var Attack = Class.create(Group, {
		initialize: function(x, y, direction, power){
			Group.call(this);
			
			this.sprite		= null;
			this.collision	= null;
			
			this.moveTo(x, y);
			this.power = power;
		},
		onenterframe: function(){
		},
		remove: function(){
			this.parentNode.removeChild(this);
		}
	});
	
	/**
	 * 噛みつき
	 */
	var Bite = Class.create(Attack, {
		initialize: function(x, y, direction, power){
			Attack.call(this, x, y, direction, power);
			
			var surface = new Surface(30, 20);
			surface.context.fillStyle = "green";
			surface.context.fillRect(0, 0, 30, 20);
			this.collision = new Sprite(30, 20);
			this.collision.image = surface;
			this.collision.opacity = 0.0;

			this.sprite = new Sprite(30, 20);
			this.sprite.image = surface;
			this.sprite.opacity = 0.0;
			
			this.addChild(this.sprite);
			this.addChild(this.collision);
		}
	});
	/**
	 * ドラゴン用ビーム
	 */
	var DragonBeam = Class.create(Attack, {
		initialize: function(x, y, direction, power){
			Attack.call(this, x, y, direction, power);
			
			var surface = new Surface(32, 8);
			surface.context.fillStyle = "green";
			surface.context.fillRect(0, 0, 32, 8);
			this.collision = new Sprite(32, 8);
			this.collision.image = surface;
			this.collision.opacity = 0.0;
			this.collision.moveTo(0, 12);
			
			var scaleUp = new Surface(32, 32);
			var image = game.assets[IMAGE_PATH_BEAM];
			var x = 14 * 16;
			var y =  3 * 16;
			scaleUp.draw(image, x, y, 16, 16, 0, 0, 32, 32);
			this.sprite = new Sprite(32, 32);
			this.sprite.image = scaleUp;
			this.sprite.scaleX = direction;
			
			this.addChild(this.sprite);
			this.addChild(this.collision);
		},
		onenterframe: function(){
			this.x += (15 * this.sprite.scaleX);
		}
	});
	
	/**
	 * 爆発
	 */
	var Explosion = Class.create(Attack, {
		initialize: function(x, y, direction, power){
			Attack.call(this, x, y, direction, power);
			
			var surface = new Surface(60, 60);
			surface.context.fillStyle = "green";
			surface.context.fillRect(0, 0, 60, 60);
			this.collision = new Sprite(60, 60);
			this.collision.image = surface;
			this.collision.opacity = 0.0;
			this.collision.moveTo(2, 2);
			
			this.sprite = new Sprite(80, 80);
			this.sprite.image = game.assets[IMAGE_PATH_SECRET];
			this.sprite.frame = 0;
			this.sprite.moveTo(-8, -8);
			
			this.addChild(this.sprite);
			this.addChild(this.collision);
		}
	});
	
	/**
	 * ドラゴン
	 */
	var Dragon = Class.create(Group, {
		//初期化
		initialize: function(){
			Group.call(this);

			//画像
			this.sprite = new Sprite(80, 80);
			this.sprite.image = game.assets[IMAGE_PATH_SECRET];
			this.sprite.frame = 0;
			this.sprite.moveTo(0, 0);
			this.addChild(this.sprite);
			//画像2
			this.sprite2 = new Sprite(80, 80);
			this.sprite2.image = game.assets[IMAGE_PATH_SECRET];
			this.sprite2.frame = 1;
			this.sprite2.moveTo(0, 0);
			this.sprite2.on("enterframe", function(){
				this.opacity = (Math.cos(this.age*20*Math.PI/180)+1)*0.5;
			});
			//当たり判定の矩形
			var surface = new Surface(60, 70);
			surface.context.fillStyle = "white";
			surface.context.fillRect(0, 0, 60, 70);
			this.collision = new Sprite(60, 70);
			this.collision.image = surface;
			this.collision.opacity = 0.0;
			this.collision.moveTo(15, 2);
			this.addChild(this.collision);
			
			this.moveTo(200, 100);
			
			this.invalidGravity = false;	//重力無視状態か
			this.jumpFlag = false;
			this.jumpPower = 10;
			this.vy = 0;

			this.round2 = false;
			
			this.isInvincible = false;
			
			//攻撃リスト
			this.beamList = [];
			
			//出現アニメーション用フラグ
			this.appearFlag = false;
			
			//パターン関連
			this.pattern = 0;
			this.patternTime = 0;
			
			//パターン0何もしない時間
			this.waitTime;
			this.setPattern_0();
			
			//パターン1　噛みつき
			this.biteMoveTimer = 0;
			this.biteMoveList = [2, 3, 4, 4, 3, 2];
			this.biteMoveRange = [0, 2, 4, 0, 2, 4];
			this.biteMoveList2 = [2, 3, 4, 3];
			this.biteMoveRange2 = [3, 5, 3, 5];
			//攻撃時
			this.isBite = false;
			
			//パターン2　ビーム
			
			//dedug
			this.label = new Label();
			this.label.color = "green";
			this.addChild(this.label);
		},
		onenterframe: function(){
			if(this.appearFlag === false){
				this.update();
				this.animation();
			}
			
			// this.label.text = "";
			// this.label.text += this.pattern + "<br />";
			// this.label.text += this.biteMoveTimer + "<br />";
			// this.label.text += this.appearFlag + "<br />";
			// this.label.text += this.round2 + "<br />";
			// this.label.text += this.parentNode.enemyHp.rest + "<br />";
		},
		//更新処理
		update: function(){
		
			switch(this.pattern){
				case 0:	//様子見で何もしない
					if(this.patternTime >= this.waitTime){
						this.selectPattern();
					}
					break;
				case 1:
					this.updatePattern_1();
					break;
				case 2:
					break;
			}
			if(this.invalidGravity === false){
				this.gravityFall();
			}
						
			this.patternTime++;
			this.isInvincible = false;
		},
		//重力落下
		gravityFall: function(){
			var bottom = FLOOR_BOTTOM - this.collision.height;
			var gravity = FLOOR_GRAVITY + 3;	//体重があるので速く落下するように
			var isJump = false;
			
			if(this.jumpFlag){
				//重力をかける
				if(isJump != true && this.vy < 0){
					//上昇中
					this.vy = 0;
				}
				this.vy += FLOOR_GRAVITY;
				this.y += this.vy
				
			} else {
				if(isJump == true){
					//ジャンプの開始
					this.jumpFlag = true;
					this.vy = -this.jumpPower;
				} else {
					if(this.y < bottom){
						this.jumpFlag = true;
						this.vy = 0;
					}
				}
			}
			this.vy += FLOOR_GRAVITY;
			this.y += this.vy
			
			if(this.y > bottom){
				this.y = bottom;
				this.jumpFlag = false;
				this.vy = 0;
			}
		},
		//パターンの選択
		selectPattern: function(){
			if(this.round2 === false){
				if(this.parentNode.enemyHp.rest <= DRAGON_ROUND_2){
					this.round2 = true;
					this.initRound2();
				}
			}

			var rnd = Math.floor(Math.random()*(200));
			this.sprite.frame = 2;
			
			if(this.round2 === true){
				//第2形態
				if(rnd <= 60){
					this.setPattern_1();
				} else if(rnd <= 140){
					this.setPattern_2();
				} else {
					this.setPattern_3();
				}
			} else {
				if(rnd <= 60){
					this.setPattern_0();
				} else if(rnd <= 120){
					this.setPattern_1();
				} else if(rnd <= 170){
					this.setPattern_2();
				} else {
					this.setPattern_3();
				}
			}
		},
		//第2形態開始時の初期化
		initRound2: function(){
			this.addChild(this.sprite2);
		},
		//パターン0 待ち時間セット
		setPattern_0: function(){
			this.pattern = 0;
			this.waitTime = Math.floor(Math.random()*(game.fps));
			this.patternTime = 2;
		},
		//パターン1 噛みつき
		setPattern_1: function(){
			this.pattern = 1;
			this.patternTime = 0;
			this.biteMoveTimer = 0;
			this.isBite = false;
		},
		updatePattern_1: function(){
		
			if(this.isBite === true){
				;//何もしない
			} else {
				if(this.x - game.stageSelect.player.x >= 32){
					//距離が遠いので近づく
					if(this.round2 === true){
						var len = this.biteMoveList2.length;
						var index = Math.floor(this.biteMoveTimer/len) % 2;
						this.sprite.frame = this.biteMoveList2[index];
						this.x -= this.biteMoveRange2[index];
					
					} else {
						var len = this.biteMoveList.length;
						var index = Math.floor(this.biteMoveTimer/len) % 2;
						this.sprite.frame = this.biteMoveList[index];
						this.x -= this.biteMoveRange[index];
					}
					this.biteMoveTimer++;
				} else {
					//噛みつき
					this.isBite = true;
					this.biteMoveTimer = 0;
					
					if(this.round2 === true){
						//第2形態
						this.tl.delay(2)
							.then(function(){ this.sprite.frame = 5; })
							.then(function(){
								this.sprite.frame = 6;
								var x = this.x;
								var y = this.y + 23;
								this.beamList[0] = new Bite(x, y, -1, DRAGON_BITE_POWER);
								this.parentNode.addChild(this.beamList[0]);
								this.beamList[0].tl.moveBy(-30, 0, 3);
							})
							.moveBy(-30, 0, 3).delay(5)
							.then(function(){
								if(this.beamList[0] !== null){
									this.beamList[0].remove();
									this.beamList[0] = null;
								}
							})
							.then(function(){ this.sprite.frame = 7; this.invalidGravity = true; }).moveTo(200, 50, 3)
							.then(function(){ this.invalidGravity = false; })
							.then(function(){ this.sprite.frame = 0; this.selectPattern() });
					} else {
						this.tl.delay(2)
							.then(function(){ this.sprite.frame = 5; }).delay(20)
							.then(function(){
								this.sprite.frame = 6;
								var x = this.x;
								var y = this.y + 23;
								this.beamList[0] = new Bite(x, y, -1, DRAGON_BITE_POWER);
								this.parentNode.addChild(this.beamList[0]);
								this.beamList[0].tl.moveBy(-30, 0, 3);
							})
							.moveBy(-30, 0, 3).delay(DRAGON_BITE_TIME)
							.then(function(){
								if(this.beamList[0] !== null){
									this.beamList[0].remove();
									this.beamList[0] = null;
								}
							})
							.then(function(){ this.sprite.frame = 7; this.invalidGravity = true; }).moveTo(200, 50, 7).delay(3)
							.then(function(){ this.invalidGravity = false; }).delay(5)
							.then(function(){ this.sprite.frame = 0; this.selectPattern() });
					}
				}
			}
		},
		//パターン2　ビーム
		setPattern_2: function(){
			this.pattern = 2;
			this.patternTime = 0;

			var interval;
			if(this.round2 === true){
				//第2形態
				interval = 5;
			} else {
				interval = 10;
			}
			
			this.tl.delay(5)
				.then(function(){ this.sprite.frame = 8; }).delay(interval)
				.then(function(){ this.sprite.frame = 9; }).delay(interval)
				.then(function(){
					this.sprite.frame = 10;
					var x = this.x;
					var y = this.y;
					this.beamList[1] = new DragonBeam(x, y, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[1]);
					this.beamList[2] = new DragonBeam(x, y+15, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[2]);
					this.beamList[3] = new DragonBeam(x, y+30, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[3]);
				}).delay(10)
				.then(function(){ this.sprite.frame = 8; }).delay(interval)
				.then(function(){ this.sprite.frame = 9; }).delay(interval)
				.then(function(){
					this.sprite.frame = 10;
					var x = this.x;
					var y = this.y;
					this.beamList[4] = new DragonBeam(x, y, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[4]);
					this.beamList[5] = new DragonBeam(x, y+15, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[5]);
					this.beamList[6] = new DragonBeam(x, y+30, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[6]);
				}).delay(10)
				.then(function(){ this.sprite.frame = 8; }).delay(interval)
				.then(function(){ this.sprite.frame = 9; }).delay(interval)
				.then(function(){
					this.sprite.frame = 10;
					var x = this.x;
					var y = this.y;
					this.beamList[7] = new DragonBeam(x, y, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[7]);
					this.beamList[8] = new DragonBeam(x, y+15, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[8]);
					this.beamList[9] = new DragonBeam(x, y+30, -1, DRAGON_BEAM_POWER);
					this.parentNode.addChild(this.beamList[9]);
				}).delay(10)
				.then(function(){ this.sprite.frame = 2; this.selectPattern(); });
		},
		//爆発
		setPattern_3: function(){
			var x = game.stageSelect.player.x - (game.stageSelect.player.sprite.width/2);
			var y = game.stageSelect.player.y - 30;
			this.pattern = 3;
			this.patternTime = 0;
			this.tl
				.then(function(){ this.sprite.frame = 5; })
				.moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1)
				.moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1)
				.moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1)
				.then(function(){
					if(this.round2 === true){
						x = game.stageSelect.player.x - (game.stageSelect.player.sprite.width/2);
						y = game.stageSelect.player.y - 30;
					}
				})
				.moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1)
				.moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1).moveBy(0, -1, 1).moveBy(0, 1, 1)
				.then(function(){
					this.beamList[10] = new Explosion(x, y, 1, DRAGON_EXPLOSION_POWER);
					this.parentNode.addChild(this.beamList[10]);

					var sprite = new Sprite(16, 16);
					sprite.image = game.assets[IMAGE_PATH_EFFECT];
					sprite.frame = 0;
					sprite.scale(4.0, 4.0);
					var nx = (4.0-1) * (16/2) + x;
					var ny = (4.0-1) * (16/2) + y;
					sprite.moveTo(nx, ny);
					sprite.on("enterframe", function(){
						var time = this.age;
						
						if((time%2 === 0) && (time !== 0)){
							if(this.frame === 3){
								this.parentNode.removeChild(this);
							} else {
								this.frame++;
							}
						}
					});
					this.parentNode.addChild(sprite);

				}).delay(10)
				.then(function(){
					if(this.beamList[10] !== null){
						this.parentNode.removeChild(this.beamList[10]);
						this.beamList[10] = null;
					}
				})
				.then(function(){ this.sprite.frame = 2; this.selectPattern(); });
		},
		//アニメーション
		animation: function(){
			
		},
		//出現時のアニメーション
		appearAnimation: function(){
			this.tl.then(function(){ this.appearFlag = true; this.sprite.frame = 0; })
				.moveBy(2, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2)
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame--; })
				.moveBy(-4, 0, 1).moveBy(4, 0, 1).then(function(){ this.sprite.frame++; })
				.delay(40)
				.then(function(){ this.appearFlag = false; });
				// .loop();
				// .moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame++; });	
				// .moveBy(-4, 0, 2).moveBy(4, 0, 2).then(function(){ this.sprite.frame-; });


		},
		//死んだとき
		die: function(){
			this.onenterframe = null;
		
			var sprite = new Sprite(16, 16);
			sprite.image = game.assets[IMAGE_PATH_EFFECT];
			sprite.scale(3.0, 3.0);
			sprite.frame = 0;
			sprite.moveTo(24, 24);
			
			this.addChild(sprite);
			
			sprite.tl
				.then( function(){
					var x = Math.floor(Math.random()*30)-15;
					var y = Math.floor(Math.random()*30)-15;
					this.moveBy(x, y);
					this.frame = 0;
				})
				.delay(4).then(function(){ this.frame++; })
				.delay(4).then(function(){ this.frame++; })
				.delay(4).then(function(){ this.frame++; })
				.delay(4).then(function(){ this.moveTo(24, 24) })
				.loop();
		}
	});
	
	//体力を示すバー
	var HpBar = Class.create(Group, {
		//初期化
		//	param	maxHp	初期HP
		initialize: function(maxHp, imagePath){
			Group.call(this);
			
			this.max = maxHp;
			this.imagePath = imagePath;
			this.rest = 0;
			this.bar = [];
			
			var width = this.max+2;
			var height = 16 + 2;
			var bgSurface = new Surface(width, height);
			bgSurface.context.fillStyle = "white";
			bgSurface.context.fillRect(0, 0, width, height);
			bgSurface.context.fillStyle = "black";
			bgSurface.context.fillRect(1, 1, width-2, 16);

			var bgSprite = new Sprite(width, height);
			bgSprite.image = bgSurface;
			bgSprite.rotation = 90;
			bgSprite.moveTo(this.x - (this.max/2)-1, this.y - (this.max/2));
			this.addChild(bgSprite);
			
			for(var i=0; i<this.max; i++){
				this.bar[i] = new Sprite(1,16);
				this.bar[i].image = game.assets[this.imagePath];
				this.bar[i].rotation = 90;
				var x = this.x;
				var y = this.y - i;
				this.bar[i].moveTo(x, y);
			}
			
			this.add(this.max);
		},
		//体力が増えるとき
		//	param	n	増える量
		add: function(n){
			var afterHp = this.rest + n;
			if(afterHp > this.max){
				afterHp = this.max;
			}
			for(var i=this.rest; i<afterHp; i++){
				this.addChild(this.bar[i]);
			}
			
			this.rest = afterHp;
		},
		//体力が減ったとき
		//	param	n	減る量
		sub: function(n){
			var afterHp = this.rest - n;
			if(afterHp < 0){
				afterHp = 0;
			}
			for(var i=this.rest; i>afterHp; i--){
				this.removeChild(this.bar[i-1]);
			}
			
			this.rest = afterHp;
		}
	});
	
	//背景
	var BackGround = Class.create(Sprite, {
		/**
		 * 初期化
		 *	param	tileNo
		 */
		initialize: function(tileNo){
			Sprite.call(this, game.width, game.height);
			
			var surface = new Surface(game.width, game.height);
			var bgImage = game.assets[IMAGE_PATH_BACKGROUND];
			var mapImage = game.assets[IMAGE_PATH_MAP];
			for(var i=0; i<game.width; i+=BG_TILE_WIDTH){
				var x = tileNo * BG_TILE_WIDTH;
				surface.draw(bgImage, x, 0, BG_TILE_WIDTH, BG_TILE_HEIGHT,
								i, 0, BG_TILE_WIDTH, game.height);
			}
			this.image = surface;
		}
	});
	
	
	/**
	 * StageSelectで使うボスキャラアイコン
	 */
	var StageIcon = Class.create(Group, {
		/**
		 * 初期化
		 *	param	frameNo	画像番号
		 */
		initialize: function(frameNo){
			Group.call(this);
			
			var surface = new Surface(ICON_SIZE, ICON_SIZE);
			surface.context.fillStyle = "black"
			surface.context.fillRect(0, 0, ICON_SIZE, ICON_SIZE);
			surface.context.fillStyle = "white"
			surface.context.fillRect(1, 1, ICON_SIZE-2, ICON_SIZE-2);
			var image = game.assets[IMAGE_PATH_CHARA];
			var x = (frameNo%5)*32 + 10;
			var y = Math.floor(frameNo/4)*32 + 4;
			surface.draw(image, x, y, 16, 16, 2, 2, ICON_SIZE-4, ICON_SIZE-4);
			
			this.sprite = new Sprite(ICON_SIZE, ICON_SIZE);
			this.sprite.image = surface
			this.sprite.moveTo(0, 0);

			this.width = ICON_SIZE;
			this.height = ICON_SIZE;
			
			this.addChild(this.sprite);
		}
	});
	
	/**
	 * StageSelectで使うボスキャラアイコン(隠しボス用)
	 */
	var SecretStageIcon = Class.create(Group, {
		/**
		 * 初期化
		 */
		initialize: function(){
			Group.call(this);
			
			var surface = new Surface(ICON_SIZE, ICON_SIZE);
			surface.context.fillStyle = "black"
			surface.context.fillRect(0, 0, ICON_SIZE, ICON_SIZE);
			surface.context.fillStyle = "yellow"
			surface.context.fillRect(1, 1, ICON_SIZE-2, ICON_SIZE-2);
			var image = game.assets[IMAGE_PATH_SECRET];
			var x = 0;
			var y = 100;
			surface.draw(image, x, y, 22, 22, 2, 2, ICON_SIZE-4, ICON_SIZE-4);
			
			this.sprite = new Sprite(ICON_SIZE, ICON_SIZE);
			this.sprite.image = surface
			this.sprite.moveTo(0, 0);

			this.width = ICON_SIZE;
			this.height = ICON_SIZE;
			
			this.addChild(this.sprite);
		}
	});
	
	/**
	 * ステージセレクト
	 */
	var StageSelect = Class.create(Scene, {
		//初期化
		initialize: function(){
			Scene.call(this);
			this.backgroundColor = "black";
			
			//残機表示
			this.status = new Group();
			var icon = new Sprite(16, 16);
			icon.image = game.assets[IMAGE_PATH_BEAM];
			icon.frame = 10;
			this.status.life = new Group();
			this.status.life.icon = icon;
			this.status.life.num = new Sprite(16, 16);
			this.status.life.num.image = game.assets[IMAGE_PATH_BEAM];
			this.status.life.num.frame = 1;
			this.status.life.addChild(this.status.life.icon);
			this.status.life.addChild(this.status.life.num);
			this.status.moveTo(50, 180);
			this.status.life.num.moveTo(30, 0);
			this.status.addChild(this.status.life);
			this.addChild(this.status);
			
			//プレイヤーはステージセレクトに置いておく
			this.player = new Player();
			this.playerHp = new HpBar(PLAYER_HIT_POINT, IMAGE_PATH_BAR);
			var x = 30;
			var y = 70;
			this.playerHp.moveTo(x, y);
			this.playerRest = PLAYER_REST;	//残機
			
			this.icon = [];
			this.clear = [];
			this.position = [
				[50 + ICON_SIZE * 0,		(game.height-ICON_SIZE)/2],
				[50 + ICON_SIZE * 1,		(game.height-ICON_SIZE)/2],
				[50 + ICON_SIZE * 2,		(game.height-ICON_SIZE)/2],
				[game.width-ICON_SIZE-10,	(game.height-ICON_SIZE)-20]
			];
			for(var i=0; i<BOSS_NUM; i++){
				var frameNo = i * 5 + 5;	//マジックナンバー多すぎぃ！！
				//最後の一人は隠しボスなので表示させない
				if(i === BOSS_NUM-1){
					this.icon[i] = new SecretStageIcon(frameNo);
					this.icon[i].sprite.opacity = 0.0;
				} else {
					this.icon[i] = new StageIcon(frameNo);
				}

				var x = this.position[i][0];
				var y = this.position[i][1];
				this.icon[i].moveTo(x, y);
				this.addChild(this.icon[i]);
				
				this.clear[i] = DRAGON_DEBUG;
			}
			this.clear[BOSS_NUM-1] = false;
						
			var w = ICON_SIZE - 2;
			var h = ICON_SIZE - 2;
			var surface = new Surface(w, h);
			surface.context.fillStyle = "blue";
			surface.context.fillRect(0, 0, w, h);
			this.selectSprite = new Sprite(w, h);
			this.selectSprite.image = surface;
			this.selectSprite.opacity = 1.0;
			this.moveTo(ICON_SIZE+1, ICON_SIZE+1);
			this.addChild(this.selectSprite);

			this.selected = 0;				//選択中のボスアイコン
			this.appeaDragonEvent = false;	//ドラゴン出現イベントを行ったか
		},
		onenterframe: function(){
		
			//残機確認、無くなったらゲームオーバー
			if(this.playerRest < 0){
				game.replaceScene(new GameOverScene());
			}
			//ゲームクリア確認 クリアしていたらエンディングへ
			if(this.clear[BOSS_NUM-1] === true){
				game.replaceScene(new GameClearScene());
			}
		
			var secret = this.isAppearSecretBoss();
			var input = game.input;
			var len =  (secret === true) ? (this.icon.length) : (this.icon.length - 1);

			//ドラゴン出現イベント
			if((this.appeaDragonEvent === false) && (secret === true)){
				this.appeaDragonEvent = true;
				game.replaceScene(new EventAppearDragon());
			}
			
			//ボス選択
			if((input.left === true)){
				this.selected = (this.selected - 1 + len) % len;
			} else if(input.right === true){
				this.selected = (this.selected + 1) % len;
			} else if(input.space === INPUT_PUSH){
				//ボス戦へ
				switch(this.selected){
					case 0:	if(this.clear[0] === false){ game.replaceScene(new BattleWhiteKuma(this.player, this.playerHp, 0)); }	break;
					case 1:	if(this.clear[1] === false){ game.replaceScene(new BattleGirlKuma (this.player, this.playerHp, 1)); }	break;
					case 2:	if(this.clear[2] === false){ game.replaceScene(new BattleSpaceKuma(this.player, this.playerHp, 2)); }	break;
					case 3:	if(this.clear[3] === false){ game.replaceScene(new BattleDragon(this.player, this.playerHp, 3)); }	break;
				}
			}

			//隠しボスの出現
			if(secret === true){
				this.icon[BOSS_NUM-1].sprite.opacity = 1.0;
			} else {
				this.icon[BOSS_NUM-1].sprite.opacity = 0.0;
			}
			
			//倒した敵のアイコンを薄くする
			for(var i=0; i<BOSS_NUM-1; i++){
				if(this.clear[i]){
					this.icon[i].sprite.opacity = 0.2;
				}
			}
			//残機表示更新
			this.status.life.num.frame = ((this.playerRest % 10) + 9) % 10;

			this.flash();
		},
		//選択場所を点滅させる
		flash: function(){
			var index = this.selected;
			var sprite = this.selectSprite;
			sprite.moveTo(this.position[index][0]+1, this.position[index][1]+1);
			
			sprite.opacity = (Math.cos(game.frame*10*Math.PI/180)+1)*0.1 + 0.4;
		},
		//隠しボス出現か？
		//	return	隠しボス出現ならtrue
		isAppearSecretBoss: function(){
			for(var i=0; i<BOSS_NUM-1; i++){
				if(this.clear[i] === false){
					return false;
				}
			}
			
			return true;
		}
	});
	
	/**
	 * バトルステージ
	 */
	var BattleStage = Class.create(Scene, {
		/**
		 * 初期化
		 *	param	player		プレイヤー
		 *	param	playerHp	プレイヤーのHP
		 */
		initialize: function(player, playerHp, stageNo){
			Scene.call(this);
			
			this.stageNo = stageNo;
			this.battleEnd = false;
			this.endTimer = 0;
			
			this.map		= null;		//マップ
			this.player		= player;	//プレイヤー
			this.playerHp	= playerHp;	//プレイヤーのHP
			this.enemy		= null;		//敵キャラ
			this.enemyHp	= null;		//敵キャラのHP
		},
		onenterframe: function(){
			//攻撃処理
			this.attack(this.player, this.enemy, this.enemyHp);
			this.attack(this.enemy, this.player, this.playerHp);
			
			if(this.battleEnd === false){
				//勝敗判定
				//同時だったら敵が優先で勝利に
				if(this.playerHp.rest <= 0){
					this.player.die();
					game.stageSelect.clear[this.stageNo] = false;
					game.stageSelect.playerRest--;
					this.battleEnd = true;
				} else if(this.enemyHp.rest <= 0){
					this.enemy.die();
					game.stageSelect.clear[this.stageNo] = true;
					this.battleEnd = true;
				}
			} else {
				if(this.endTimer >= 100){
					game.replaceScene(game.stageSelect);
					if(this.playerHp.rest >= 0){
						game.stageSelect.player = new Player();
						game.stageSelect.playerHp.add(PLAYER_HIT_POINT);
					}
				}
				this.endTimer++;
			}
		},
		//攻撃の処理
		//	param	attacker	攻撃者
		//	param	defender	防御側
		//	param	defHp		防御側のHP
		attack: function(attacker, defender, defHp){
			for(var i=0, max = attacker.beamList.length; i<max; i++){
				if((attacker.beamList[i] === null) || (attacker.beamList[i] === undefined)){
					continue;
				}
				var left	= 0 - attacker.beamList[i].sprite.width;
				var right	= game.width;
				//敵に当たったら消す
				if(attacker.beamList[i].collision.intersect(defender.collision) === true){
					if(defender.isInvincible === false){
						defHp.sub(attacker.beamList[i].power);
					}
					defender.isInvincible = true;
					this.removeChild(attacker.beamList[i]);
					attacker.beamList[i] = null;
					attacker.beamNum--;

				//画面外まで行ったら消す
				} else if((attacker.beamList[i].x < left) || (attacker.beamList[i].x > right)){
					this.removeChild(attacker.beamList[i]);
					attacker.beamList[i] = null;
					attacker.beamNum--;
				}
			}
		}
	});
	
	/**
	 * 白熊ステージ
	 */
	var BattleWhiteKuma = Class.create(BattleStage, {
		//初期化
		initialize: function(player, playerHp, stageNo){
			BattleStage.call(this, player, playerHp, stageNo);
			//背景
			this.addChild(new BackGround(0));
			//ステージ
			this.map = new Map(16, 16);
			this.map.image = game.assets[IMAGE_PATH_MAP];
			this.map.loadData([
				[ 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1],
				[ 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1],
				[ 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1]
			]);
			this.addChild(this.map);

			//プレイヤー
			this.player.initPosition();
			this.addChild(this.player);
			this.addChild(this.playerHp);		
			
			//敵キャラ
			this.enemy = new WhiteKuma();
			this.addChild(this.enemy);
			this.enemyHp = new HpBar(WHITE_HIT_POINT, IMAGE_PATH_BAR_2);
			var x = game.width - 30;
			var y = 70;
			this.enemyHp.moveTo(x, y);
			this.addChild(this.enemyHp);
		}		
	});
	
	/**
	 * クマ子ステージ
	 */
	var BattleGirlKuma = Class.create(BattleStage, {
		//初期化
		initialize: function(player, playerHp, stageNo){
			BattleStage.call(this, player, playerHp, stageNo);
			//背景
			this.addChild(new BackGround(1));
			//ステージ
			this.map = new Map(16, 16);
			this.map.image = game.assets[IMAGE_PATH_MAP];
			this.map.loadData([
				[ 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 1],
				[ 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1],
				[ 1,18,18,18,18, 18,18,18,18,18, 18,18,18,18,18, 18,18,18,18, 1],
				[ 1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1,  1, 1, 1, 1, 1]
			]);
			this.addChild(this.map);
			//プレイヤー
			this.player.initPosition();
			this.addChild(this.player);
			this.addChild(this.playerHp);		
			
			//敵キャラ
			this.enemy = new GirlKuma();
			this.addChild(this.enemy);
			this.enemyHp = new HpBar(GIRL_HIT_POINT, IMAGE_PATH_BAR_2);
			var x = game.width - 30;
			var y = 70;
			this.enemyHp.moveTo(x, y);
			this.addChild(this.enemyHp);
		}		
	});

	/**
	 * スペースクマステージ
	 */
	var BattleSpaceKuma = Class.create(BattleStage, {
		//初期化
		initialize: function(player, playerHp, stageNo){
			BattleStage.call(this, player, playerHp, stageNo);
			//背景
			this.addChild(new BackGround(2));
			//ステージ
			this.map = new Map(16, 16);
			this.map.image = game.assets[IMAGE_PATH_MAP];
			this.map.loadData([
				[ 2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 2],
				[ 2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2],
				[ 2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2],
				[ 2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2,  2, 2, 2, 2, 2]
			]);
			this.addChild(this.map);

			//プレイヤー
			this.player.initPosition();
			this.addChild(this.player);
			this.addChild(this.playerHp);
			
			//敵キャラ
			this.enemy = new SpaceKuma();
			this.addChild(this.enemy);
			this.enemyHp = new HpBar(ENEMY_HIT_POINT, IMAGE_PATH_BAR_2);
			var x = game.width - 30;
			var y = 70;
			this.enemyHp.moveTo(x, y);
			this.addChild(this.enemyHp);
		}
	});
	
	/**
	 * ドラゴンとの対決
	 */
	var BattleDragon = Class.create(BattleStage, {
		//初期化
		initialize: function(player, playerHp, stageNo){
			BattleStage.call(this, player, playerHp, stageNo);
			//背景
			this.addChild(new BackGround(2));
			//ステージ
			var blackTile = new Surface(16, 16);
			blackTile.context.fillStyle = "black";
			blackTile.context.fillRect(0, 0, 16, 16);
			this.blackMap = new Map(16, 16);
			this.blackMap.image = blackTile;
			this.blackMap.loadData([
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0],
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0],
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0]
			]);
			this.blackMap.on("enterframe", function(){
				this.opacity = (Math.cos(this.age*22*Math.PI/180)+1)*0.2;
			});
			this.addChild(this.blackMap);
			//赤タイル
			var redTile = new Surface(16, 16);
			redTile.context.fillStyle = "red";
			redTile.context.fillRect(0, 0, 16, 16);
			this.redMap = new Map(16, 16);
			this.redMap.image = redTile;
			this.redMap.loadData([
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1, 0],
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0],
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0],
				[ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0]
			]);
			this.redMap.on("enterframe", function(){
				this.opacity = (Math.sin(this.age*15*Math.PI/180)+1)*0.2;
			});
			this.addChild(this.redMap);

			//プレイヤー
			this.player.initPosition();
			this.addChild(this.player);
			this.addChild(this.playerHp);
			
			//敵キャラ
			this.enemy = new Dragon();
			this.addChild(this.enemy);
			this.enemyHp = new HpBar(DRAGON_HIT_POINT, IMAGE_PATH_BAR_2);
			var x = game.width - 30;
			var y = 135;
			this.enemyHp.moveTo(x, y);
			this.addChild(this.enemyHp);
			
			this.enemy.appearAnimation();
		},
	});

	game.start();
};
