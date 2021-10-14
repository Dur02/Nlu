import React from 'react';
import { map } from 'lodash/fp';

export const iconPaths = [
  '/images/icons/icon-skill-ico_xiaolv_1.png',
  '/images/icons/icon-skill-ico_life_2.png',
  '/images/icons/icon-skill-ico_traffic_3.png',
  '/images/icons/icon-skill-ico_movie_4.png',
  '/images/icons/icon-skill-ico_social_5.png',
  '/images/icons/icon-skill-ico_news_6.png',
  '/images/icons/icon-skill-ico_quiz_7.png',
  '/images/icons/icon-skill-ico_home_8.png',
  '/images/icons/icon-skill-ico_car_9.png',
  '/images/icons/icon-skill-ico_finance_10.png',
  '/images/icons/icon-skill-ico_sports_11.png',
  '/images/icons/icon-skill-ico_shopping_12.png',
  '/images/icons/icon-skill-ico_game_13.png',
  '/images/icons/icon-skill-ico_education_14.png',
];

export const iconPathOptions = map((iconPath) => ({
  label: <img alt="Icon" src={iconPath} style={{ width: 50, marginBottom: 10 }} />,
  value: iconPath,
}))(iconPaths);
