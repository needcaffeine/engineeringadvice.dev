import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb:
    "A weekly podcast about engineering leadership with Keyur, Louie, Mitra, Thiago, and Vic.",
  description:
    "Engineering Advice You Didn't Ask For is a podcast about engineering leadership, management, and team dynamics. Each episode covers practical perspectives on building software teams and navigating modern engineering organizations.",
  hosts: [
    {
      name: 'Keyur Hindocha',
      bio: "Co-host of Engineering Advice You Didn't Ask For.",
      img: 'avatar-light.png'
    },
    {
      name: 'Louie Bacaj',
      bio: "Co-host of Engineering Advice You Didn't Ask For.",
      img: 'avatar-light.png'
    },
    {
      name: 'Mitra Raman',
      bio: "Co-host of Engineering Advice You Didn't Ask For.",
      img: 'avatar-light.png'
    },
    {
      name: 'Thiago Ghisi',
      bio: "Co-host of Engineering Advice You Didn't Ask For.",
      img: 'avatar-light.png'
    },
    {
      name: 'Vic Vijayakumar',
      bio: "Co-host of Engineering Advice You Didn't Ask For.",
      img: 'avatar-light.png'
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
