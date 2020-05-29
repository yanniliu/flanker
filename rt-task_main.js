
	
	/* Change 1: Adding the image hosting site */
    // define the site that hosts stimuli images
    // usually https://<your-github-username>.github.io/<your-experiment-name>/
    var repo_site = "https://yanniliu.github.io/flanker/"; 

        /* experiment parameters */
        var reps_per_trial_type = 2;

        /*set up welcome block*/
        var welcome = {
          type: "html-keyboard-response",
          stimulus: "Welcome to the experiment. Press any key to begin."
        };

        /*set up instructions block*/
        var instructions = {
          type: "html-keyboard-response",
          stimulus: "<p>In this task, you will see five arrows on the screen, like the example below.</p>"+
            "<img src='" + repo_site + "img/inc1.png'></img>"+
            "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>"+
            "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>"+
            "<p>Press any key to begin.</p>",
          post_trial_gap: 1000
        };

        /*defining stimuli*/
        var test_stimuli = [
          {
            stimulus: repo_site + "img/con1.png",
            data: { stim_type: 'congruent', direction: 'left'}
          },
          {
            stimulus: repo_site + "img/con2.png",
            data: { stim_type: 'congruent', direction: 'right'}
          },
          {
            stimulus: repo_site + "img/inc1.png",
            data: { stim_type: 'incongruent', direction: 'right'}
          },
          {
            stimulus: repo_site + "img/inc2.png",
            data: { stim_type: 'incongruent', direction: 'left'}
          }
        ];

   /*defining fixation*/ 
   var fixation = {
      type: 'html-keyboard-response',
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: function(){
        return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
      },
      data: {test_part: 'fixation'}
    }
    
        /* defining test timeline */
        var test = {
          timeline: [{
            type: 'image-keyboard-response',
            choices: [37, 39],
            trial_duration: 1500,
            stimulus: jsPsych.timelineVariable('stimulus'),
            data: jsPsych.timelineVariable('data'),
            on_finish: function(data){
              var correct = false;
              if(data.direction == 'left' &&  data.key_press == 37 && data.rt > -1){
                correct = true;
              } else if(data.direction == 'right' && data.key_press == 39 && data.rt > -1){
                correct = true;
              }
              data.correct = correct;
            },
            post_trial_gap: function() {
                return Math.floor(Math.random() * 1500) + 100;
            }
          }],
          timeline_variables: test_stimuli,
          sample: {type: 'fixed-repetitions', size: reps_per_trial_type}
        };

    var test_procedure = {
      timeline: [fixation, test],
      timeline_variables: test_stimuli,
      repetitions: 3,
      randomize_order: true
    }
        /*defining debriefing block*/
        var debrief = {
          type: "html-keyboard-response",
          stimulus: function() {
            var total_trials = jsPsych.data.get().filter({trial_type: 'image-keyboard-response'}).count();
            var accuracy = Math.round(jsPsych.data.get().filter({correct: true}).count() / total_trials * 100);
            var congruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'congruent'}).select('rt').mean());
            var incongruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'incongruent'}).select('rt').mean());
            return "<p>You responded correctly on <strong>"+accuracy+"%</strong> of the trials.</p> " +
            "<p>Your average response time for congruent trials was <strong>" + congruent_rt + "ms</strong>.</p>"+
            "<p>Your average response time for incongruent trials was <strong>" + incongruent_rt + "ms</strong>.</p>"+
            "<p>Press any key to complete the experiment. Thank you!</p>";
          }
        };
		
		// generate a random subject ID with 15 characters
var subject_id = jsPsych.randomization.randomID(15);

// this adds a property called 'subject' and a property called 'condition' to every trial
jsPsych.data.addProperties({
  subject: subject_id,

});

        /*set up experiment structure*/
        var timeline = [];
        timeline.push(welcome);
        timeline.push(instructions);
        timeline.push(test_procedure);
        timeline.push(debrief);



