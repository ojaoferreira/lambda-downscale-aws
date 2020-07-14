const AWS = require('aws-sdk');

const rds = new AWS.RDS({
    apiVersion: '2014-10-31',
    region: 'us-west-1',
});

exports.handler = (event, context, callback) => {
  rds.describeDBInstances(params = {}, function(err, data) {
    if (err) console.log(err, err.stack);
    else data.DBInstances.forEach(DBInstances => {
      var dbInstanceIdentifier = DBInstances.DBInstanceIdentifier;
      var dbInstanceStatus = DBInstances.DBInstanceStatus;
      var dbInstanceArn = DBInstances.DBInstanceArn;
  
      if (dbInstanceStatus === 'available') {
        rds.listTagsForResource({ResourceName: dbInstanceArn}, function(err, data) {
          if (err) console.log(err.stack);
          else data.TagList.forEach(tag => {
            if (tag.Key === 'downscaler/uptime' && tag.Value === 'True') {
              rds.stopDBInstance({DBInstanceIdentifier: dbInstanceIdentifier}, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log('stopping', dbInstanceIdentifier);
              });
            }
          });
        });
      }
    });
  });

  setTimeout(function () {
    console.log('Timeout complete.')
  }, 8000)
};
