import { single } from 'shared/mocker-utiles';

export default (router) => {
  router.post('/nlu/edit/auth/login', (request, response) => {
    response.cookie('JSESSIONID', 'test').status(200).send(single()());
  });

  router.get('/nlu/edit/user/mine', (request, response) => {
    response.status(200).send(single()({
      username: 'Test Username',
      name: 'Test Name',
    }));
  });
};
