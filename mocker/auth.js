export default (router) => {
  router.post('/nlu/edit/auth/login', (request, response) => {
    response.cookie('JSESSIONID', 'test').status(204).send();
  });

  router.get('/nlu/edit/user/mine', (request, response) => {
    response.status(200).send({
      data: {
        username: 'Test Username',
        name: 'Test Name',
      },
    });
  });
};
