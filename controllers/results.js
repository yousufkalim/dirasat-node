const Results = require('../models/results');
const Users = require('../models/users');
const Answers = require('../models/answers');
const Domains = require('../models/domains');
const Courses = require('../models/courses');
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
    console.log('domain', domain);
    console.log('desc_answers_in_db', desc_answers_in_db);

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
    console.log('englishLanguage', englishLanguage);
    console.log('arabicLanguage', arabicLanguage);
    console.log('criteria', criteria);

    let dcourses = await DCourses.find({});
    console.log('dcourses length', dcourses.length);

    // filter by language
    if (
      englishLanguage[0]?.answer == 'Oui' &&
      arabicLanguage[0]?.answer == 'Oui'
    ) {
      dcourses = dcourses.filter((dcourse, index) => {
        return dcourse.language == 'Français' || 'English' || 'Arabe';
      });
    } else if (
      englishLanguage[0]?.answer == 'Non' &&
      arabicLanguage[0]?.answer == 'Oui'
    ) {
      dcourses = dcourses.filter((dcourse, index) => {
        return dcourse.language == 'Français' || 'Arabe';
      });
    } else if (
      englishLanguage[0]?.answer == 'Oui' &&
      arabicLanguage[0]?.answer == 'Non'
    ) {
      dcourses = dcourses.filter((dcourse, index) => {
        return dcourse.language == 'Français' || 'English';
      });
    } else {
      dcourses = dcourses.filter((dcourse, index) => {
        return dcourse.language == 'Français';
      });
    }
    //Filter1 filter result on the base of subdomains, bacserie,and wilaya eligibility
    let newDcourse = [];
    dcourses.map((dcourse, index) => {
      if (
        dcourse.sub_domains == domain.subdomain &&
        (dcourse.bacSerie.includes(user.Bac_Serie) ||
          dcourse.bacSerie.includes('Toutes Séries de Baccalauréat')) &&
        (dcourse.WilayaofEligibility.includes(user.wilaya.code) ||
          dcourse.WilayaofEligibility.includes('Recrutement national'))
      ) {
        newDcourse.push(dcourse);
      }
    });
    console.log('lenghth selected courses to show', newDcourse.length);

    //Filter1 End

    // Filter on the base of coast
    if (criteria[0]?.answer == 'Coût') {
      newDcourse?.sort((a, b) => parseInt(a.cost) - parseInt(b.cost));
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
      data: resultForResponse.dcourses
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
