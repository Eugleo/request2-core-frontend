choice('TAG STRATEGY', 'What TAG strategy did you use?', [
  'Anti TAG Ab',
  'nanobody',
  'Polyclonal Ab',
  'Monoclonal Ab',
  'Streptavidin',
  'Tandem IP',
]),
  when(
    value('TAG STRATEGY'),
    equals('Anti TAG Ab').then(
      choice('ANTI TAG AB STRATEGY', 'Which Anti TAG Ab strategy did you use?', [
        'FLAG',
        'GFP',
        'HA',
        'Myc',
        'Other',
      ]),
      when(
        value('ANTI TAG AB STRATEGY'),
        equals('Other').then(text('ANTI TAG AB STRATEGY SPECIFICATION', 'Please specify'))
      )
    )
  );

question('tag_strategy', 'What TAG strategy did you use?').withChoices(
  choice('Anti TAG Ab').then(
    question('anti_tag_ab_strategy', 'Which Anti TAG Ab strategy did you use?')
      .withChoices(
        choice('FLAG'),
        choice('GFP'),
        choice('HA'),
        choice('Myc'),
        choice('Other').then(text('anti_tag_ab_strategy_specification', 'Please specify'))
      )
      .withOptions([Opt.Requred, Opt.Warning]),

    when(value('ANTI TAG AB STRATEGY').equals('Other')).then(
      text('ANTI TAG AB STRATEGY SPECIFICATION', 'Please specify')
    )
  ),
  choice('nanobody'),
  choice('Polyclonal Ab'),
  choice('Monoclonal Ab'),
  choice('Streptavidin'),
  choice('Tandem IP')
);
