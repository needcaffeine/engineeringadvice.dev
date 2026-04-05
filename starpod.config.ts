import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb:
    "A weekly podcast about engineering leadership with Keyur, Louie, Mitra, Thiago, and Vic.",
  description:
    "Engineering Advice You Didn't Ask For is a podcast about engineering leadership, management, and team dynamics. Each episode covers practical perspectives on building software teams and navigating modern engineering organizations.",
  hosts: [
    {
      name: 'Keyur Hindocha',
      bio: 'Engineering leader in 🇨🇦, Co-host @EngAdvicePod, Ex-CTO and co-founder at Flyta',
      img: 'keyur-hindocha.jpg',
      twitter: 'https://x.com/keyurhindocha'
    },
    {
      name: 'Louie Bacaj',
      bio: 'Engineer turned Entrepreneur, turned Engineer, and the cycle continues.',
      img: 'louie-bacaj.jpg',
      twitter: 'https://x.com/LBacaj'
    },
    {
      name: 'Mitra Raman',
      bio: 'rebuilding the care economy @rosiematch. ex @yc @cmu @amazon',
      img: 'mitra-raman.jpg',
      twitter: 'https://x.com/ramannoodlez'
    },
    {
      name: 'Thiago Ghisi',
      bio: '🧑‍🏫 (Former) Director of Eng at @Nubank, @Apple, @AmericanExpress. 🇧🇷 in 🗽. I share career growth strategies, leadership insights & my many reads. 📚🦕👇',
      img: 'thiago-ghisi.jpg',
      twitter: 'https://x.com/thiagoghisi'
    },
    {
      name: 'Vic Vijayakumar',
      bio: '3x dad, 6.2x runner, 0.5x violinist, 1x principal engineer. my projects: onetimefax.com everyoak.com mailtimer.com',
      img: 'vic-vijayakumar.jpg',
      twitter: 'https://x.com/VicVijayakumar'
    }
  ],
  platforms: {
    apple:
      'https://podcasts.apple.com/us/podcast/engineering-advice-you-didnt-ask-for/id1615785335',
    appleIdNumber: '1615785335',
    spotify: 'https://podcasters.spotify.com/pod/show/engineeringadvice'
  },
  rssFeed: 'https://anchor.fm/s/8c2900b8/podcast/rss'
});
