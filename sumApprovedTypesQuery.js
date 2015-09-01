function get_results (result) {
    print(tojson(result));
}

db.manualevaluations
  .aggregate([
    {$project: {numberOfApproved: {$size: { "$ifNull": [ "$approvedTypes", [] ] }}}},
    {$group: {_id: "sum", sumNumberOfApproved: {$sum: "$numberOfApproved"}}}
  ])
  .forEach(get_results)
