// 100 IndexDictionaries Concept Hooks bifurcated into Evergreen and Trending
export interface DetailedConcept {
  num: string;
  id: string;
  name: string;
  description: string;
  theme: string;
  category: 'evergreen' | 'trending';
  bookId?: string;
}

export const CONCEPTS_100: DetailedConcept[] = [
  {
    "num": "001",
    "id": "confirmation-bias",
    "name": "The Confirmation Bias",
    "description": "Why do we seek evidence that proves us right and ignore what challenges us?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-001"
  },
  {
    "num": "002",
    "id": "education-paradox",
    "name": "The Education Paradox",
    "description": "Why can educated people still make irrational decisions?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-002"
  },
  {
    "num": "003",
    "id": "map-is-not-the-territory",
    "name": "The Map Is Not the Territory",
    "description": "Why is our understanding of reality never the same as reality itself?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-003"
  },
  {
    "num": "004",
    "id": "attention",
    "name": "The Attention Economy",
    "description": "Who controls your attention, and who profits from it?",
    "theme": "Human Nature & Thinking",
    "category": "trending",
    "bookId": "book-004"
  },
  {
    "num": "005",
    "id": "illusion-of-understanding",
    "name": "The Illusion of Understanding",
    "description": "Why do we believe we understand something until we try to explain it?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-005"
  },
  {
    "num": "006",
    "id": "dunning-kruger-effect",
    "name": "The Dunning–Kruger Effect",
    "description": "Why can limited knowledge make people overestimate their ability?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-006"
  },
  {
    "num": "007",
    "id": "availability-heuristic",
    "name": "The Availability Heuristic",
    "description": "Why do vivid or recent events seem more common than they really are?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-007"
  },
  {
    "num": "008",
    "id": "sunk-cost-fallacy",
    "name": "The Sunk Cost Fallacy",
    "description": "Why do we keep investing in choices that no longer make sense?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-008"
  },
  {
    "num": "009",
    "id": "framing-effect",
    "name": "The Framing Effect",
    "description": "How can the same facts lead to different decisions when presented differently?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-009"
  },
  {
    "num": "010",
    "id": "cognitive-dissonance",
    "name": "The Cognitive Dissonance",
    "description": "Why is it uncomfortable when our beliefs and actions contradict each other?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-010"
  },
  {
    "num": "011",
    "id": "fundamental-attribution-error",
    "name": "The Fundamental Attribution Error",
    "description": "Why do we blame personality for others’ actions while excusing our own circumstances?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-011"
  },
  {
    "num": "012",
    "id": "negativity-bias",
    "name": "The Negativity Bias",
    "description": "Why do bad experiences often affect us more than equally strong good ones?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-012"
  },
  {
    "num": "013",
    "id": "planning-fallacy",
    "name": "The Planning Fallacy",
    "description": "Why do we consistently underestimate how long tasks will take?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-013"
  },
  {
    "num": "014",
    "id": "status-quo-bias",
    "name": "The Status Quo Bias",
    "description": "Why do we prefer familiar arrangements even when better options exist?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-014"
  },
  {
    "num": "015",
    "id": "choice-overload",
    "name": "The Choice Overload",
    "description": "Why can too many options make decisions harder rather than easier?",
    "theme": "Human Nature & Thinking",
    "category": "evergreen",
    "bookId": "book-015"
  },
  {
    "num": "016",
    "id": "fundamental-problem-solved-by-money",
    "name": "The Fundamental Problem Solved by Money",
    "description": "How did money transform exchange, cooperation, and economic coordination?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-016"
  },
  {
    "num": "017",
    "id": "money-illusion",
    "name": "The Money Illusion",
    "description": "Why can earning more money fail to make us richer?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-017"
  },
  {
    "num": "018",
    "id": "wealth-inequality-paradox",
    "name": "The Wealth Inequality Paradox",
    "description": "How can a society become richer while many people remain economically insecure?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-018"
  },
  {
    "num": "019",
    "id": "incentives",
    "name": "The Incentive Trap",
    "description": "How can rewards designed to improve behavior end up making it worse?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-019"
  },
  {
    "num": "020",
    "id": "tragedy-of-the-commons",
    "name": "The Tragedy of the Commons",
    "description": "Why do individuals acting in their own interests sometimes destroy a shared resource?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-020"
  },
  {
    "num": "021",
    "id": "opportunity-cost",
    "name": "The Opportunity Cost",
    "description": "What do we give up whenever we choose one option over another?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-021"
  },
  {
    "num": "022",
    "id": "inflation-puzzle",
    "name": "The Inflation Puzzle",
    "description": "Why can prices rise even when people feel no richer?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-022"
  },
  {
    "num": "023",
    "id": "compound-growth-effect",
    "name": "The Compound Growth Effect",
    "description": "How can small gains or losses become enormous over time?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-023"
  },
  {
    "num": "024",
    "id": "debt-trap",
    "name": "The Debt Trap",
    "description": "When does borrowing help people progress, and when does it restrict their future?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-024"
  },
  {
    "num": "025",
    "id": "productivity-wage-gap",
    "name": "The Productivity–Wage Gap",
    "description": "Why might economic output rise faster than typical workers’ pay?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-025"
  },
  {
    "num": "026",
    "id": "scarcity-mindset",
    "name": "The Scarcity Mindset",
    "description": "How does having too little time or money change the way we think?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-026"
  },
  {
    "num": "027",
    "id": "externality-problem",
    "name": "The Externality Problem",
    "description": "Why can private decisions impose hidden costs on everyone else?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-027"
  },
  {
    "num": "028",
    "id": "principal-agent-problem",
    "name": "The Principal–Agent Problem",
    "description": "Why might someone hired to serve our interests act in their own interests instead?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-028"
  },
  {
    "num": "029",
    "id": "market-failure",
    "name": "The Market Failure",
    "description": "When do markets fail to allocate resources in ways that serve society well?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-029"
  },
  {
    "num": "030",
    "id": "paradox-of-thrift",
    "name": "The Paradox of Thrift",
    "description": "Why can everyone saving more at once sometimes weaken the wider economy?",
    "theme": "Money, Wealth & Economics",
    "category": "evergreen",
    "bookId": "book-030"
  },
  {
    "num": "031",
    "id": "one-person-one-vote-paradox",
    "name": "The One Person, One Vote Paradox",
    "description": "Why doesn't equal voting power guarantee equal political influence?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-031"
  },
  {
    "num": "032",
    "id": "meritocracy-myth",
    "name": "The Meritocracy Myth",
    "description": "How much of success comes from talent, effort, privilege, networks, and luck?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-032"
  },
  {
    "num": "033",
    "id": "social-hierarchy",
    "name": "The Social Hierarchy",
    "description": "Why do societies create status differences, and how do they persist?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-033"
  },
  {
    "num": "034",
    "id": "banana-democracy",
    "name": "The Banana Democracy",
    "description": "How can a country retain elections while democratic accountability weakens?",
    "theme": "Society, Power & Democracy",
    "category": "trending",
    "bookId": "book-034"
  },
  {
    "num": "035",
    "id": "collective-action-problem",
    "name": "The Collective Action Problem",
    "description": "Why do people struggle to act together even when cooperation benefits everyone?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-035"
  },
  {
    "num": "036",
    "id": "social-contract",
    "name": "The Social Contract",
    "description": "What makes people accept rules, authority, and shared obligations?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-036"
  },
  {
    "num": "037",
    "id": "representation-gap",
    "name": "The Representation Gap",
    "description": "Why may elected representatives fail to reflect the needs of the people they represent?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-037"
  },
  {
    "num": "038",
    "id": "majority-minority-problem",
    "name": "The Majority–Minority Problem",
    "description": "How can majority rule coexist with protection for minority rights?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-038"
  },
  {
    "num": "039",
    "id": "power-of-institutions",
    "name": "The Power of Institutions",
    "description": "How do rules and organizations shape behavior beyond individual intentions?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-039"
  },
  {
    "num": "040",
    "id": "corruption-loop",
    "name": "The Corruption Loop",
    "description": "How can corruption weaken institutions and make further corruption easier?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-040"
  },
  {
    "num": "041",
    "id": "network-effect-of-power",
    "name": "The Network Effect of Power",
    "description": "How do connections and relationships amplify access to influence?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-041"
  },
  {
    "num": "042",
    "id": "public-goods-problem",
    "name": "The Public Goods Problem",
    "description": "Why are essential shared services often difficult to fund through individual choices alone?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-042"
  },
  {
    "num": "043",
    "id": "polarization-spiral",
    "name": "The Polarization Spiral",
    "description": "How can disagreement turn into hostility between social or political groups?",
    "theme": "Society, Power & Democracy",
    "category": "trending",
    "bookId": "book-043"
  },
  {
    "num": "044",
    "id": "legitimacy-problem",
    "name": "The Legitimacy Problem",
    "description": "What makes people see authority as rightful rather than merely powerful?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-044"
  },
  {
    "num": "045",
    "id": "social-mobility-question",
    "name": "The Social Mobility Question",
    "description": "What helps people move beyond the social and economic conditions into which they are born?",
    "theme": "Society, Power & Democracy",
    "category": "evergreen",
    "bookId": "book-045"
  },
  {
    "num": "046",
    "id": "algorithmic-mirror",
    "name": "The Algorithmic Mirror",
    "description": "Do algorithms reflect human preferences, or reshape them?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-046"
  },
  {
    "num": "047",
    "id": "automation-paradox",
    "name": "The Automation Paradox",
    "description": "Why can technology make work more productive while creating new dependencies and risks?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-047"
  },
  {
    "num": "048",
    "id": "ai-alignment-problem",
    "name": "The AI Alignment Problem",
    "description": "How do we ensure AI systems pursue what humans actually value?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-048"
  },
  {
    "num": "049",
    "id": "knowledge-graph",
    "name": "The Knowledge Graph",
    "description": "How are ideas connected, and how can those connections improve learning?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-049"
  },
  {
    "num": "050",
    "id": "information-overload-paradox",
    "name": "The Information Overload Paradox",
    "description": "Why does having access to more information not necessarily make us wiser?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-050"
  },
  {
    "num": "051",
    "id": "black-box-problem",
    "name": "The Black Box Problem",
    "description": "How can we trust a system when its decisions are difficult to explain?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-051"
  },
  {
    "num": "052",
    "id": "digital-divide",
    "name": "The Digital Divide",
    "description": "How does unequal access to technology create unequal opportunities?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-052"
  },
  {
    "num": "053",
    "id": "privacy-convenience-trade-off",
    "name": "The Privacy–Convenience Trade-off",
    "description": "What do we give up when we exchange personal data for convenience?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-053"
  },
  {
    "num": "054",
    "id": "feedback-loop",
    "name": "The Feedback Loop",
    "description": "How can a system’s outputs change the inputs that shape its future behavior?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-054"
  },
  {
    "num": "055",
    "id": "goodhart-s-law",
    "name": "The Goodhart’s Law",
    "description": "Why does a measure often become less useful when it becomes a target?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-055"
  },
  {
    "num": "056",
    "id": "recommender-trap",
    "name": "The Recommender Trap",
    "description": "How can personalized recommendations narrow what we discover?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-056"
  },
  {
    "num": "057",
    "id": "open-source-paradox",
    "name": "The Open Source Paradox",
    "description": "How can shared technology create enormous value while its maintenance remains difficult to fund?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-057"
  },
  {
    "num": "058",
    "id": "data-bias-problem",
    "name": "The Data Bias Problem",
    "description": "How can biased data produce unfair or unreliable automated decisions?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-058"
  },
  {
    "num": "059",
    "id": "network-effect",
    "name": "The Network Effect",
    "description": "Why do some platforms become more valuable as more people use them?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-059"
  },
  {
    "num": "060",
    "id": "digital-memory-problem",
    "name": "The Digital Memory Problem",
    "description": "What changes when information can be stored, searched, copied, and retrieved indefinitely?",
    "theme": "Technology, AI & Knowledge",
    "category": "trending",
    "bookId": "book-060"
  },
  {
    "num": "061",
    "id": "freedom-paradox",
    "name": "The Freedom Paradox",
    "description": "Can having more choices sometimes make us less free?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-061"
  },
  {
    "num": "062",
    "id": "trolley-problem",
    "name": "The Trolley Problem",
    "description": "When every available choice causes harm, how should we decide?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-062"
  },
  {
    "num": "063",
    "id": "progress-paradox",
    "name": "The Progress Paradox",
    "description": "Why can technological and economic progress coexist with new forms of suffering?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "trending",
    "bookId": "book-063"
  },
  {
    "num": "064",
    "id": "prisoner-s-dilemma",
    "name": "The Prisoner’s Dilemma",
    "description": "Why can rational individuals produce irrational collective outcomes?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-064"
  },
  {
    "num": "065",
    "id": "meaning-of-life",
    "name": "The Meaning of Life",
    "description": "How do we decide what makes a life valuable, meaningful, and worth living?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-065"
  },
  {
    "num": "066",
    "id": "ship-of-theseus",
    "name": "The Ship of Theseus",
    "description": "When every part of something changes, in what sense does it remain the same thing?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-066"
  },
  {
    "num": "067",
    "id": "problem-of-other-minds",
    "name": "The Problem of Other Minds",
    "description": "How can we know what another person is experiencing internally?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-067"
  },
  {
    "num": "068",
    "id": "ethics-of-intention",
    "name": "The Ethics of Intention",
    "description": "Should actions be judged by their motives, their consequences, or both?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-068"
  },
  {
    "num": "069",
    "id": "future-generations-problem",
    "name": "The Future Generations Problem",
    "description": "What duties do people today have toward people who do not yet exist?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-069"
  },
  {
    "num": "070",
    "id": "paradox-of-tolerance",
    "name": "The Paradox of Tolerance",
    "description": "How should an open society respond to movements that seek to destroy openness?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-070"
  },
  {
    "num": "071",
    "id": "free-will-debate",
    "name": "The Free Will Debate",
    "description": "How much control do we have over choices shaped by biology and environment?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-071"
  },
  {
    "num": "072",
    "id": "knowledge-problem",
    "name": "The Knowledge Problem",
    "description": "How can decisions be made when relevant knowledge is dispersed across many people?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-072"
  },
  {
    "num": "073",
    "id": "unintended-consequences",
    "name": "The Unintended Consequences",
    "description": "Why do actions intended to solve a problem sometimes create new problems?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-073"
  },
  {
    "num": "074",
    "id": "precautionary-principle",
    "name": "The Precautionary Principle",
    "description": "When should society act to prevent a serious risk despite uncertainty?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-074"
  },
  {
    "num": "075",
    "id": "good-life",
    "name": "The Good Life",
    "description": "What does it mean to live well beyond wealth, status, or pleasure?",
    "theme": "Philosophy, Ethics & The Future",
    "category": "evergreen",
    "bookId": "book-075"
  },
  {
    "num": "076",
    "id": "trust-paradox",
    "name": "The Trust Paradox",
    "description": "Why is trust essential for cooperation yet vulnerable to betrayal?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-076"
  },
  {
    "num": "077",
    "id": "empathy-gap",
    "name": "The Empathy Gap",
    "description": "Why is it difficult to understand feelings and needs we have not experienced ourselves?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-077"
  },
  {
    "num": "078",
    "id": "identity-loop",
    "name": "The Identity Loop",
    "description": "How do our identities shape our choices, and how do our choices reinforce identity?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-078"
  },
  {
    "num": "079",
    "id": "belonging-need",
    "name": "The Belonging Need",
    "description": "Why do people seek group acceptance even when it conflicts with personal judgment?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-079"
  },
  {
    "num": "080",
    "id": "cultural-lens",
    "name": "The Cultural Lens",
    "description": "How does culture influence what people consider normal, valuable, or true?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-080"
  },
  {
    "num": "081",
    "id": "language-boundary",
    "name": "The Language Boundary",
    "description": "How does language shape what we notice, communicate, and understand?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-081"
  },
  {
    "num": "082",
    "id": "generational-divide",
    "name": "The Generational Divide",
    "description": "Why do people from different generations interpret the same world differently?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-082"
  },
  {
    "num": "083",
    "id": "reputation-economy",
    "name": "The Reputation Economy",
    "description": "How does social reputation influence behavior when formal rules are weak?",
    "theme": "Relationships, Culture & Identity",
    "category": "trending",
    "bookId": "book-083"
  },
  {
    "num": "084",
    "id": "bystander-effect",
    "name": "The Bystander Effect",
    "description": "Why may people be less likely to help when others are present?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-084"
  },
  {
    "num": "085",
    "id": "conflict-spiral",
    "name": "The Conflict Spiral",
    "description": "How can small misunderstandings escalate into lasting conflict?",
    "theme": "Relationships, Culture & Identity",
    "category": "evergreen",
    "bookId": "book-085"
  },
  {
    "num": "086",
    "id": "prevention-paradox",
    "name": "The Prevention Paradox",
    "description": "Why can actions that help a whole population seem to offer little benefit to each individual?",
    "theme": "Health, Environment & Human Systems",
    "category": "evergreen",
    "bookId": "book-086"
  },
  {
    "num": "087",
    "id": "public-health-trade-off",
    "name": "The Public Health Trade-off",
    "description": "How should societies balance individual choice and collective protection?",
    "theme": "Health, Environment & Human Systems",
    "category": "evergreen",
    "bookId": "book-087"
  },
  {
    "num": "088",
    "id": "climate-coordination-problem",
    "name": "The Climate Coordination Problem",
    "description": "Why is it difficult for countries to cooperate on a shared environmental threat?",
    "theme": "Health, Environment & Human Systems",
    "category": "trending",
    "bookId": "book-088"
  },
  {
    "num": "089",
    "id": "rebound-effect",
    "name": "The Rebound Effect",
    "description": "Why can efficiency improvements sometimes lead to more total consumption?",
    "theme": "Health, Environment & Human Systems",
    "category": "trending",
    "bookId": "book-089"
  },
  {
    "num": "090",
    "id": "carrying-capacity",
    "name": "The Carrying Capacity",
    "description": "How many people or activities can an environment sustain over time?",
    "theme": "Health, Environment & Human Systems",
    "category": "evergreen",
    "bookId": "book-090"
  },
  {
    "num": "091",
    "id": "resilience-principle",
    "name": "The Resilience Principle",
    "description": "What helps a person or system recover from shocks without collapsing?",
    "theme": "Health, Environment & Human Systems",
    "category": "evergreen",
    "bookId": "book-091"
  },
  {
    "num": "092",
    "id": "risk-compensation-effect",
    "name": "The Risk Compensation Effect",
    "description": "Why can people take greater risks when they feel safer?",
    "theme": "Health, Environment & Human Systems",
    "category": "evergreen",
    "bookId": "book-092"
  },
  {
    "num": "093",
    "id": "sleep-performance-loop",
    "name": "The Sleep–Performance Loop",
    "description": "How does sleep influence attention, decisions, health, and productivity?",
    "theme": "Health, Environment & Human Systems",
    "category": "evergreen",
    "bookId": "book-093"
  },
  {
    "num": "094",
    "id": "urban-density-trade-off",
    "name": "The Urban Density Trade-off",
    "description": "How can cities create opportunity while increasing pressure on space and services?",
    "theme": "Health, Environment & Human Systems",
    "category": "trending",
    "bookId": "book-094"
  },
  {
    "num": "095",
    "id": "waste-problem",
    "name": "The Waste Problem",
    "description": "Why is it often easier to produce waste than to prevent or recover it?",
    "theme": "Health, Environment & Human Systems",
    "category": "trending",
    "bookId": "book-095"
  },
  {
    "num": "096",
    "id": "learning-transfer-problem",
    "name": "The Learning Transfer Problem",
    "description": "Why can knowing something in a lesson fail to help us use it in real life?",
    "theme": "Learning, Work & Personal Growth",
    "category": "evergreen",
    "bookId": "book-096"
  },
  {
    "num": "097",
    "id": "expertise-trap",
    "name": "The Expertise Trap",
    "description": "When can experience improve judgment, and when can it create blind spots?",
    "theme": "Learning, Work & Personal Growth",
    "category": "evergreen",
    "bookId": "book-097"
  },
  {
    "num": "098",
    "id": "deliberate-practice-principle",
    "name": "The Deliberate Practice Principle",
    "description": "What distinguishes purposeful practice from simply repeating an activity?",
    "theme": "Learning, Work & Personal Growth",
    "category": "evergreen",
    "bookId": "book-098"
  },
  {
    "num": "099",
    "id": "motivation-gap",
    "name": "The Motivation Gap",
    "description": "Why do intentions often fail to become consistent action?",
    "theme": "Learning, Work & Personal Growth",
    "category": "evergreen",
    "bookId": "book-099"
  },
  {
    "num": "100",
    "id": "feedback-paradox",
    "name": "The Feedback Paradox",
    "description": "Why can feedback improve performance in some situations and damage it in others?",
    "theme": "Learning, Work & Personal Growth",
    "category": "evergreen",
    "bookId": "book-100"
  }
];
