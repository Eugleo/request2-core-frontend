import { choice, note, question, section } from '../FormConstruction';

const experimentScope = section('Scope of the experiment').withItems(
  question('analysis_type', 'What type of the analysis do you want to perform?').withChoices(
    choice('Identification of all proteins in my sample').whenChosen(
      question('protein_form', 'What form are your proteins in?').withChoices(
        choice('Purified proteins').whenChosen(
          // TODO Zde možná chceme spíše selection s choices
          question('purification_type', 'What type of purification did you use?').withChoices(
            choice('SDS PAGE').whenChosen(
              note('We accept only Coomasie blue stained gels'),
              question('sds_page_has_image', 'Do you have the image?').withChoices(
                choice('Yes').whenChosen(
                  question(
                    'sds_page_image',
                    'Upload the image with the band(s) marked'
                  ).withFileInput()
                ),
                choice('No')
              )
            ),
            choice('SEC chromatography'),
            choice('TAG purification').whenChosen(
              // TODO Má zde být pouze jedna možnost?
              question(
                'tag_purification_tag_strategy',
                'What TAG strategy did you use?'
              ).withChoices(
                choice('Anti TAG antibody').whenChosen(
                  question('ant_tag_ab_kind', 'Please specify which kind').withSelection(
                    'FLAG',
                    'GFP',
                    'HA',
                    'Myc'
                  )
                ),
                choice('Anti TAG nanobody'),
                choice('Polyclonal Ab'),
                choice('Monoclonal Ab'),
                choice('Streptavidin'),
                choice('BioID'),
                choice('Tandem IP'),
                choice('His TAG strategy')
              )
            ),
            choice('Native PAGE').whenChosen(
              question('native_page_has_image', 'Do you have the image?').withChoices(
                choice('Yes').whenChosen(
                  question(
                    'native_page_image',
                    'Upload the image with the band(s) marked'
                  ).withFileInput()
                ),
                choice('No')
              )
            ),
            choice('Other').whenChosen(
              question(
                'purification_type_other_specification',
                'Please specify which one'
              ).withTextField()
            )
          )
        ),
        choice('Cell lysate').whenChosen(
          question('cell_type', 'What cell type did you use?').withTextField(),
          question(
            'cell_lysate_buffer_conditions',
            'What buffer conditions did you use for the lysis?'
          ).withTextField('long-text')
        ),
        choice('Tissue lysate').whenChosen(
          question('tissue_type', 'What tissue did you use?').withTextField(),
          question(
            'tissue_lysate_buffer_conditions',
            'What buffer conditions did you use for the lysis?'
          ).withTextField('long-text')
        ),
        choice('Immunoprecipitated proteins').whenChosen(
          question('immunoprecipitated_tag_strategy', 'What TAG strategy did you use?').withChoices(
            choice('Anti TAG antibody').whenChosen(
              question('ant_tag_ab_kind', 'Please specify which kind').withSelection(
                'FLAG',
                'GFP',
                'HA',
                'Myc'
              )
            ),
            choice('Anti TAG nanobody'),
            choice('Polyclonal Ab'),
            choice('Monoclonal Ab'),
            choice('Streptavidin'),
            choice('BioID'),
            choice('Tandem IP'),
            choice('His TAG strategy')
          ),
          question('bead_type', 'What type of beads did you use?').withChoices(
            choice('Sepharose'),
            choice('Magnetic beads')
          ),
          question(
            'bead_washing_buffer',
            'What buffer did you use for washing strategy the beads?'
          ).withTextField()
        )
      )
    ),
    choice('Protein quantification').whenChosen(
      note('We accept samples in at least the triplicates of treated and control samples'),
      question('did_label_protein', 'Did you use a labeling of your proteins?').withChoices(
        choice('No, I prefer Label-free experiment (LFQ)'),
        choice('Yes, I used metabolic labeling').whenChosen(
          question('metabolic_labeling_kind', 'Which kind?').withChoices(
            choice('SILAC double').whenChosen(
              question('heavy_label', 'Specify the Heavy label').withTextField()
            ),
            choice('SILAC triple').whenChosen(
              question(
                'heavy_and_medium_labels',
                'Specify the Heavy and Medium labels'
              ).withTextField()
            ),
            choice('SILAC NeuCode').whenChosen(
              question('neucode_labels', 'Specify the NeuCode labels').withTextField()
            )
          )
        )
      )
    ),
    choice('Intact Protein Mass measurement').whenChosen(
      question('ionization_technique', 'What ionization technique do you prefer?').withChoices(
        choice('MALDI'),
        choice('ESI'),
        choice('both ESI and MALDI'),
        choice("operator's choice")
      )
    )
  )
);

const samplePreparation = section('Sample preparation').withItems(
  question('sample_buffer_composition', 'What is a composition of a sample buffer?').withSelection(
    'SDS PAGE band stained by Coomasie blue'
  ),
  question('does_contain_detergent', 'Does your sample buffer contain detergent?').withChoices(
    choice('Yes').whenChosen(
      question('detergent_type', 'What type?').withSelection(
        'SDS',
        'Triton X100',
        'Tween',
        'Digitonin',
        'NP-40',
        'Dodecylmaltosid',
        'Octylglucopyranosid',
        'Deoxycholate',
        'CHAPS',
        'RIPA'
      )
    ),
    choice('No')
  ),
  question('is_sample_digested', 'Has your sample already been digested?').withChoices(
    choice('Yes').whenChosen(
      question('used_protease', 'What protease has been used?').withSelection(
        'Trypsin',
        'Lys-C',
        'Arg-C',
        'Asp-N',
        'Glu-C',
        'Chymotrypsin',
        'Pepsin',
        'CNBr'
      ),
      question('was_sample_reduced', 'Was your sample reduced?').withChoices(
        choice('Yes').whenChosen(
          question('used_reducing_agent', 'What reducing agent did you use?').withSelection(
            'DTT',
            'TCEP',
            'Beta-mercaptoethanol'
          )
        ),
        choice('No')
      ),
      question('was_sample_alkylated', 'Was your sample alkylated').withChoices(
        choice('Yes').whenChosen(
          question('used_alkylating_agent', 'What alkylating agent did you use?').withSelection(
            'Iodoacetamide',
            'Iodoacetate',
            'Chloroacetamide',
            'MMTS',
            'N-ethlymaleimide'
          )
        ),
        choice('No')
      )
    ),
    choice('No').whenChosen(
      // TODO Zde potřebujeme multiple choice + zadávání vlastního vstupu
      question('preferred_protease', 'What protease do you prefer?').withSelection(
        "Operator's choice",
        'Trypsin',
        'Chymotrypsin',
        'Asp-N',
        'Glu-C',
        'Lys-C',
        'Lys-N',
        'Arg-C',
        'Pepsin',
        'CNBr',
        'Combination',
        // TODO Zde chceme speciální červeno barvu nebo speciální umístění
        'None, I want to analyse intact proteins/peptides'
      ),
      question('preferred_reducing_agent', 'What reducing agent do you prefer?').withSelection(
        'DTT',
        'TCEP',
        'None'
      ),
      question('preferred_alkylating_agent', 'What alkylating agent do you prefer?').withSelection(
        'Iodoacetamide',
        'Iodoacetate',
        'Chloracetamide',
        'MMTS',
        'Acrylamide',
        'N-ethylmaleimide',
        'Other',
        'None'
      )
    )
  ),
  question(
    'other_sample_treatment',
    'Was your sample treated in any other way? (e.g. deglycosylation)'
  ).withChoices(
    choice('Yes').whenChosen(
      question('other_treatment_specification', 'Please specify the treatment').withTextField(
        'long-text'
      )
    ),
    choice('No')
  )
);
