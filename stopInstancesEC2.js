const AWS = require('aws-sdk');
const ec2 = new AWS.EC2(
  {
    apiVersion: '2016-11-15',
    region: 'us-west-1',
  }
);

var params = {
  Filters: [
    {
      Name: "tag:downscaler/uptime",
      Values: [
        "True"
      ]
    }
  ]
};

exports.handler = (event, context, callback) => { 
  ec2.describeTags(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else data.Tags.forEach(instances => {
      ec2.stopInstances({InstanceIds:[instances.ResourceId]}, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log('shutdown', data.StoppingInstances[0].InstanceId);
      });
    });
  });

  setTimeout(function () {
    console.log('Timeout complete.')
  }, 8000)
};
