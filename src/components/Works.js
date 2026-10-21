// Works.js
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Container, Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import kick_pop_send from '../img/kick-pop-send.png';
import check_in_dash from '../img/check-in-dash.png';
import rocket_punch from '../img/rocket-punch.png';
import patchwork_space_escape from '../img/patchwork-space-escape.png';
import junk_alchemist from '../img/junkalchemist.png';
import furufuru_gamman_splash from '../img/furufuru-gamman-splash.png';
import visity from '../img/Visity.png';
import bonsai from '../img/bonsai.png';
import hello_dash from '../img/HelloDash.png';
import ar_character from '../img/AR_character.png';
import sugosuba from '../img/sugosuba.png';
import ashiart from '../img/AshiArt.jpg';
import '../styles/Works.css';
import github_icon from '../img/github-icon.png';
import game_icon from '../img/game-icon.png';
import webpage_icon from '../img/webpage-icon.png';

function Works() {
  const worksData = [
    {
      title: 'AhiArt',
      lines: [
        'JPHACKS 2025 Best Hack Award受賞作品',
        '一筆書きで描いた絵から独自のアルゴリズムで実際に走れる最適なコースを設計し、GPS アートによる、いつもと違ったランニング体験を提供する',
        '', // 空白行
        'Best Hack Award, Best Audience Award, スポンサー賞(ディップ株式会社, ロート製薬株式会社, 三菱重工業株式会社)受賞',
        ''
      ],
      image: ashiart,
      chips: [
        {
          label: 'Product Page',
          href: 'https://ashiart.vercel.app/home',
          icon: webpage_icon,
        },
        {
          label: 'Github',
          href: 'https://github.com/jphacks/sp_2509',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'すごいすばやいすぴーど',
      lines: [
        'unity1week「ひく」投稿作品',
        '急降下からの地表すれすれの"低"空飛行でスコアを稼ぐアクションランゲーム',
        '', // 空白行
        '共同制作',
        'Unity, C#',
      ],
      image: sugosuba,
      chips: [
        {
          label: 'UnityRoom',
          href: 'https://unityroom.com/games/low_altitude_flight',
          icon: game_icon,
        },
        {
          label: 'Github',
          href: 'https://github.com/Gamma-HU/u1w_gliding',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'Preferred Networks 夏期インターンシップ おしゃべりARキャラクター',
      lines: [
        '株式会社Preferred Networks 2024年夏期インターンシップ成果物',
        '',
        'ARとAIを用いてあらゆる物体を喋るキャラクターにするプロダクト.',
        'その物体の特性を反映した性格を持ち、ユーザの発話や行動、周囲の環境に反応する(CHI 2025 LBWにて発表).', // 空白行
        '',
        'Unity, C#',
      ],
      image: ar_character,
      chips: [
        {
          label: 'Project Page',
          href: 'https://tech.preferred.jp/ja/blog/%e3%81%8a%e3%81%97%e3%82%83%e3%81%b9%e3%82%8aar%e3%82%ad%e3%83%a3%e3%83%a9%e3%82%af%e3%82%bf%e3%83%bc/',
          icon: webpage_icon,
        }
      ],
    },
    {
      title: 'HelloDash!',
      lines: [
        'unity1week「あい」投稿作品',
        'タイミングよく挨拶をしていくランゲーム',
        '', // 空白行
        '共同制作',
        'Unity, C#',
      ],
      image: hello_dash,
      chips: [
        {
          label: 'UnityRoom',
          href: 'https://unityroom.com/games/hello_dash',
          icon: game_icon,
        },
        {
          label: 'Github',
          href: 'https://github.com/NI-yy/Unity1WeekGameJam_AI',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'BONSAI',
      lines: [
        'Apple Vision Proハッカソン参加作品',
        'Gitbhubの作業履歴を盆栽として可視化し、ユーザのモチベーション向上を目的として制作したプロダクト',
        '', // 空白行
        '2位受賞(14チーム中)',
        '共同制作',
        'Unity, C# (Apple Vision Pro)',
      ],
      image: bonsai,
      chips: [

      ],
    },
    {
      title: 'つぎはぎエスケープ',
      lines: [
        'unity1week「ない」投稿作品',
        '何も無い状態から素材を集め、自分だけの宇宙船をつくりだし、ブラックホールから脱出を目指すゲーム',
        '', // 空白行
        '共同制作',
        'Unity, C#',
      ],
      image: patchwork_space_escape,
      chips: [
        {
          label: 'UnityRoom',
          href: 'https://unityroom.com/games/patchwork_space_escape',
          icon: game_icon,
        },
        {
          label: 'Github',
          href: 'https://github.com/Gamma-HU/1week_Nai_Taiyo',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'がらくた錬金術師',
      lines: [
        'unity1week「かわる」投稿作品',
        'ダンジョン攻略に必要な装備を様々な素材を組み合わせながら試行錯誤でつくりだしていくゲーム',
        '', // 空白行
        '共同制作',
        'Unity, C#',
      ],
      image: junk_alchemist,
      chips: [
        {
          label: 'UnityRoom',
          href: 'https://unityroom.com/games/junkalchemist',
          icon: game_icon,
        },
        {
          label: 'Github',
          href: 'https://github.com/Gamma-HU/OneWeek_Alchemy',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'Kick Pop Send !',
      lines: [
        'unity1week「おくる」投稿作品',
        'できるだけ多くのプレゼントをできるだけ短い時間で送り届けるゲーム',
        '', // 空白行
        '共同制作',
        'Unity, C#',
      ],
      image: kick_pop_send,
      chips: [
        {
          label: 'UnityRoom',
          href: 'https://unityroom.com/games/kick_pop_send',
          icon: game_icon,
        },
        {
          label: 'Github',
          href: 'https://github.com/NI-yy/1WeekGameJam_Send',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'チェックインダッシュ',
      lines: [
        '第42回あほげー「ホテル」投稿作品',
        '部屋番号を入力してボタン連打でダッシュ, チェックイン最速を目指すゲーム',
        '', // 空白行
        '個人制作',
        'Unity, C#',
      ],
      image: check_in_dash,
      chips: [
        {
          label: 'UnityRoom',
          href: 'https://unityroom.com/games/check_in_dash',
          icon: game_icon,
        },
        {
          label: 'Github',
          href: 'https://github.com/NI-yy/Ahoge_2023_11',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'フルフル・Gammaン・スプラッシュ',
      lines: [
        'unity1week「ふる」投稿作品',
        '弾幕を避けながら左右にマウスをふることでチャージショットを放つギミックを使ったシューティングゲーム',
        '', // 空白行
        '共同制作',
        'Unity, C#',
      ],
      image: furufuru_gamman_splash,
      chips: [
        {
          label: 'UnityRoom',
          href: 'https://unityroom.com/games/furufuru_gamman_splash',
          icon: game_icon,
        },
      ],
    },
    {
      title: 'Rocket Punch',
      lines: [
        '大学祭の展示用に作成した作品',
        'パンチを飛ばして的に当てるVRゲーム. パンチの速さによって壊せる的が変わる',
        '', // 空白行
        '個人制作',
        'Unity, C# (Meta Quest 2)',
      ],
      image: rocket_punch,
      chips: [
        {
          label: 'Github',
          href: 'https://github.com/NI-yy/RocketPunch',
          icon: github_icon,
        },
      ],
    },
    {
      title: 'Visity',
      lines: [
        'TOMAKOMAI CITY HACK 2022 参加作品',
        '市の新たな視点での駅前開発の支援を目的とした、保持する人流データをスマホARでビジュアル化するプロダクト',
        '', // 空白行
        '優秀賞受賞', 
        '共同制作',
        'Unity, C# (Android)',
      ],
      image: visity,
    },
  ];

  return (
    <section id="works" className="works-section">
      <Container maxWidth={false}>
        <h2>Works</h2>
        <div className="works-container">
          <Grid container spacing={3}>
            {worksData.map((work, index) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                <Card className="work-card">
                  <CardMedia
                    component="img"
                    alt={work.title}
                    height="200"
                    image={work.image}
                    className="work-image"
                  />
                  <CardContent>
                    <Typography variant="h5" component="h3">
                      {work.title}
                    </Typography>
                    {work.lines.map((line, lineIndex) => (
                      line === '' ? (
                        <Box key={lineIndex} sx={{ height: '1em' }} />
                      ) : (
                        <Typography
                          key={lineIndex}
                          variant="body2"
                          color="text.secondary"
                          sx={line === 'JPHACKS 2025 Best Hack Award受賞作品' ? { fontWeight: 'bold' } : {}}
                        >
                          {line}
                        </Typography>
                      )
                    ))}
                    {work.chips && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {work.chips.map((chip, chipIndex) => (
                          <Chip
                            key={chipIndex}
                            avatar={<Avatar alt={chip.label} src={chip.icon} />}
                            label={chip.label}
                            variant="outlined"
                            component="a"
                            href={chip.href}
                            clickable
                          />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}

export default Works;
