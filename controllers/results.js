const Results = require('../models/results');
const Users = require('../models/users');
const Answers = require('../models/answers');
const Domains = require('../models/domains');
const DCourses = require('../models/dcourses');

// Create a Result
exports.create = async (req, res) => {
  try {
    const { last_answer, user_id, disc_answers } = req.body;

    const user = await Users.findById(user_id); //Finding User in DB
    if (!user) return res.status(404).send('User Not Found');

    const answer = await Answers.findById(last_answer).populate('job'); //Finding answer for Job and Domain Id's

    const domain = await Domains.findById(answer.domain); //Finding Domain name for result

    const desc_answers_in_db = await Answers.find({
      _id: { $in: disc_answers }
    }).populate('question'); //Finding all discriminatory Answers In Db
    console.log('user ', user);
    console.log('last_answer', answer);
    // console.log('domain', domain);
    // console.log('desc_answers_in_db', desc_answers_in_db);

    let planQuestion = desc_answers_in_db.filter((d) => {
      return (
        d?.question?.question ===
        "Dernière question, étudier à l'étranger est pour toi:"
      );
    });
    let englishLanguage = desc_answers_in_db.filter((d) => {
      return (
        d?.question?.question ===
        "Let's speak English! Veux-tu inclure les formations 100% en Anglais?"
      );
    });
    let arabicLanguage = desc_answers_in_db.filter((d) => {
      return (
        d?.question?.question ===
        'Veux-tu inclure les formations 100% en Arabe?'
      );
    });
    let criteria = desc_answers_in_db.filter((d) => {
      return (
        d?.question?.question ===
        'Quel est le critère le plus important dans le choix de ta formation?'
      );
    });

    let dcourses = await DCourses.find({});
    console.log('dcourses length', dcourses.length);

    // filter by language
    if (
      englishLanguage[0]?.answer === 'Oui' &&
      arabicLanguage[0]?.answer === 'Oui'
    ) {
      dcourses = dcourses.filter((dcourse, i) => {
        return (
          dcourse.language === 'Français' ||
          dcourse.language === 'English' ||
          dcourse.language === 'Arabe'
        );
      });
    } else if (
      englishLanguage[0]?.answer === 'Non' &&
      arabicLanguage[0]?.answer === 'Oui'
    ) {
      dcourses = dcourses.filter((dcourse) => {
        return dcourse.language === 'Français' || dcourse.language === 'Arabe';
      });
    } else if (
      englishLanguage[0]?.answer === 'Oui' &&
      arabicLanguage[0]?.answer === 'Non'
    ) {
      dcourses = dcourses.filter((dcourse) => {
        return (
          dcourse.language === 'Français' || dcourse.language === 'English'
        );
      });
    } else {
      dcourses = dcourses.filter((dcourse) => {
        return dcourse.language === 'Français';
      });
    }
    console.log('dcourses length after language filter', dcourses.length);
    //Filter1 filter result on the base of subdomains, bacserie,and wilaya eligibility
    let newDcourse = [];
    dcourses.map((dcourse) => {
      if (
        dcourse.sub_domains === domain.subdomain &&
        (dcourse.bacSerie.includes(user.Bac_Serie) ||
          dcourse.bacSerie.includes('Toutes Séries de Baccalauréat')) &&
        (dcourse.WilayaofEligibility.includes(user.wilaya.code) ||
          dcourse.WilayaofEligibility.includes('Recrutement national'))
      ) {
        newDcourse.push(dcourse);
      }
    });
    console.log('lenghth selected courses to show', newDcourse.length);

    // filter on the base of curses
    if (user?.lastDiploma) {
      if (user.lastDiploma == 'Doctorat') {
        newDcourse.filter((dcourse) => {
          return (
            dcourse.Curriculum == 'Doctorat (BAC+6)' ||
            dcourse.Curriculum == 'Doctorat (BAC+7)' ||
            dcourse.Curriculum == 'LMD (BAC+5)'
          );
        });
      } else if (user.lastDiploma == 'Master') {
        newDcourse.filter((dcourse) => {
          return (
            dcourse.Curriculum == 'École' ||
            dcourse.Curriculum == 'Licence et master' ||
            dcourse.Curriculum == 'LMD (BAC+5)' ||
            dcourse.Curriculum == 'Master à cursus intégré de licence (BAC+5)'
          );
        });
      } else if (user.lastDiploma == 'Licence') {
        newDcourse.filter((dcourse) => {
          return (
            dcourse.Curriculum == 'Formation professionnalisante' ||
            dcourse.Curriculum == 'Licence' ||
            dcourse.Curriculum == 'Licence et Master' ||
            dcourse.Curriculum == 'Licence professionnalisante (BAC+3)' ||
            dcourse.Curriculum == 'LMD (BAC+5)' ||
            dcourse.Curriculum == 'Master à cursus intégré de licence (BAC+5)'
          );
        });
      } else {
        newDcourse;
      }
    }
    // filter on the base of elegibilty score
    if (user?.score != 'score') {
      newDcourse = newDcourse.filter((dcourse) => {
        return (
          user?.score >= dcourse.EligibilityAverage ||
          dcourse.EligibilityAverage == 10
        );
      });
    }
    console.log('lenghth after eligibilty or lastDiploma', newDcourse.length);

    //Filter1 End
    // Filter on the base of coast
    if (criteria[0]?.answer === 'Coût') {
      newDcourse?.sort((a, b) => parseInt(b.cost) - parseInt(a.cost));
    } else if (criteria[0]?.answer === 'Durée') {
      newDcourse?.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    } else if (criteria[0]?.answer === 'Langue') {
      newDcourse?.sort(
        (a, b) => parseInt(b.languagestar) - parseInt(a.languagestar)
      );
    } else {
      newDcourse?.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    }

    // make id of each course according to schema
    newDcourse = newDcourse.map((item) => ({
      dcourseId: item._id
    }));

    const result = new Results({
      user: user_id,
      last_answer: answer.answer,
      example_of_job: answer.job.example_of_job,
      type_of_job: answer.job.type_of_job,
      domain: domain.name,
      desc_answers: disc_answers,
      // courses,
      dcourses: newDcourse
    });
    const savedResult = await result.save();

    // Saving result to user Schema in DB
    await Users.findByIdAndUpdate(
      user_id,
      {
        $addToSet: {
          results: savedResult
        }
      },
      { new: true }
    );
    // console.log("savedResult22", savedResult);
    const resultForResponse = await Results.findById(savedResult._id).populate(
      'dcourses.dcourseId'
    );

    let newResult = {
      example_of_job: answer.job.example_of_job,
      type_of_job: answer.job.type_of_job,
      domain: domain.name,
      data: resultForResponse.dcourses,
      planQuestion
    };
    // console.log("end result issss", newResult.data);

    res.status(200).send({
      msg: 'Ok',
      // result: resultForResponse,
      result: newResult
    });
  } catch (error) {
    console.log('Error ----> ', error);
    res.status(500).send('Something Failed');
  }
};
