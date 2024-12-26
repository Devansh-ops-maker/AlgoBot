const companyTopics = {
    google: ['arrays', 'strings', 'dynamic programming', 'graphs', 'trees', 'system design'],
    amazon: ['arrays', 'strings', 'trees', 'graphs', 'dynamic programming', 'system design', 'object-oriented design'],
    facebook: ['arrays', 'strings', 'graphs', 'dynamic programming', 'system design'],
    microsoft: ['arrays', 'strings', 'trees', 'dynamic programming', 'design patterns'],
    apple: ['arrays', 'strings', 'linked lists', 'trees', 'algorithms']
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const searchButton = document.getElementById('getProblems');
    const resultsBox = document.getElementById('results');
    const loader = document.getElementById('loader');
  
    searchButton.addEventListener('click', async () => {
      const input = userInput.value.trim();
      if (!input) {
        updateResults('Please enter your interview preparation goal.');
        return;
      }
      try {
        await searchProblems(input);
      } catch (error) {
        console.error('Error:', error);
        updateResults(`Error: ${error.message}. Please check the console for details.`);
      }
    });
  
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchButton.click();
      }
    });
  
    function updateResults(message) {
      resultsBox.innerHTML = `<p>${message}</p>`;
      resultsBox.style.animation = 'none';
      resultsBox.offsetHeight; 
      resultsBox.style.animation = null;
    }
  
    async function searchProblems(userInput) {
      const apiUrl = `https://alfa-leetcode-api.onrender.com/problems?limit=100`;
  
      try {
        loader.style.display = 'block'; 
        updateResults('Searching for problems...');
  
        const { company, keywords } = extractKeywordsAndCompany(userInput);
  
        console.log('Extracted company:', company);
        console.log('Extracted keywords:', keywords);
  
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('LeetCode API response:', JSON.stringify(data, null, 2));
  
        const problems = data.problemsetQuestionList || [];
        const relevantProblems = problems.filter((problem) =>
          keywords.some((keyword) =>
            problem.topicTags.some((tag) => tag.name.toLowerCase().includes(keyword)) ||
            problem.title.toLowerCase().includes(keyword)
          )
        );
  
        console.log(`Relevant problems found: ${relevantProblems.length}`);
        displayProblems(relevantProblems, company, keywords);
      } catch (error) {
        console.error('Error:', error);
        updateResults(`Error: ${error.message}. Please check the console for details.`);
      } finally {
        loader.style.display = 'none'; 
      }
    }
  
    function extractKeywordsAndCompany(input) {
      const inputLower = input.toLowerCase();
      let company = null;
      let keywords = [];
  
      for (const [companyName, topics] of Object.entries(companyTopics)) {
        if (inputLower.includes(companyName)) {
          company = companyName;
          keywords = topics;
          break;
        }
      }
  
      if (!company) {
        const generalTopics = [
          'array', 'string', 'linked list', 'tree', 'graph', 'dynamic programming',
          'sorting', 'searching', 'hash table', 'stack', 'queue', 'heap', 'greedy',
          'backtracking', 'bit manipulation', 'math', 'recursion', 'system design'
        ];
        keywords = generalTopics.filter((topic) => inputLower.includes(topic));
      }
  
      return { company, keywords };
    }
  
    function displayProblems(problems, company, keywords) {
      if (problems.length === 0) {
        updateResults('No problems found related to your query.');
        return;
      }
  
      let header = company
        ? `<h2>Recommended problems for ${company.toUpperCase()} interview preparation (${problems.length}):</h2>`
        : `<h2>Recommended problems based on your query (${problems.length}):</h2>`;
  
      let content = header + `<p>Focus areas: ${keywords.join(', ')}</p>`;
  
      problems.forEach((problem) => {
        const title = problem.title || 'Untitled Problem';
        const titleSlug = problem.titleSlug || '';
        const difficulty = problem.difficulty || 'Unknown';
        const tags = problem.topicTags.map((tag) => tag.name).join(', ');
        const problemUrl = `https://leetcode.com/problems/${titleSlug}`;
  
        content += `
          <p><a href="${problemUrl}" target="_blank">${title}</a> - ${difficulty}</p>
          <p><small>Tags: ${tags}</small></p>
        `;
      });
  
      updateResults(content);
    }
  });
  