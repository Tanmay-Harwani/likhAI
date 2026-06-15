-- Generated from src/data/corpus.ts. Re-run scripts/gen-seed.ts after corpus changes.
-- Uses dollar-quoting so quotes/backslashes inside snippets never cause parse errors.

insert into public.snippets (id, domain, format, concept, text) values (
  'st-clt', 'stats', 'theory', 'Central Limit Theorem', $snip_0$The central limit theorem says the sampling distribution of the mean approaches a normal distribution as sample size grows, regardless of the population's shape, provided the variance is finite. This is why we can build confidence intervals around means even from non normal data.$snip_0$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-hypothesis', 'stats', 'theory', 'Hypothesis Testing', $snip_1$A hypothesis test assumes the null is true, then asks how surprising the observed data would be under that assumption. A type one error rejects a true null, a type two error fails to reject a false one, and power is the probability of detecting a real effect.$snip_1$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-ab-testing', 'stats', 'theory', 'A/B Testing', $snip_2$In an A/B test we randomize users into control and treatment so confounders balance out in expectation. Before launch, fix the metric, run a power analysis to size the sample, and avoid peeking, since checking results repeatedly inflates the false positive rate.$snip_2$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-p-value', 'stats', 'interview', 'P-Values', $snip_3$A p value is the probability of observing data at least this extreme if the null hypothesis were true. It is not the probability that the null is true. With a threshold of 0.05, one in twenty true nulls will still look significant purely by chance.$snip_3$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-confidence-interval', 'stats', 'interview', 'Confidence Intervals', $snip_4$A 95 percent confidence interval means that if we repeated the sampling procedure many times, 95 percent of intervals built this way would contain the true parameter. It is a statement about the procedure, not a 95 percent probability for any single interval.$snip_4$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-corr-causation', 'stats', 'interview', 'Correlation vs Causation', $snip_5$Correlation alone cannot establish causation because of confounders, reverse causality, and selection bias. To claim causality I would want a randomized experiment, or failing that, quasi experimental methods like difference in differences or instrumental variables.$snip_5$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-linreg-assumptions', 'ml', 'theory', 'Linear Regression', $snip_6$Linear regression assumes a linear relationship between features and target, independent errors, constant error variance, and normally distributed residuals. Multicollinearity does not bias the coefficients but inflates their variance, which is why we check VIF before trusting individual weights.$snip_6$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-logreg', 'ml', 'theory', 'Logistic Regression', $snip_7$Logistic regression models the log odds of the positive class as a linear function of the features. It is trained by maximizing the likelihood, has no closed form solution, and each coefficient is read as the change in log odds per unit increase in that feature.$snip_7$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-bias-variance', 'ml', 'theory', 'Bias-Variance Tradeoff', $snip_8$The bias variance tradeoff describes how model complexity affects generalization. High bias models underfit because they make strong assumptions, while high variance models overfit by memorizing noise. Expected error decomposes into bias squared plus variance plus irreducible noise.$snip_8$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-regularization', 'ml', 'theory', 'L1 vs L2 Regularization', $snip_9$L1 regularization adds the absolute value of the weights to the loss and drives some coefficients exactly to zero, performing feature selection. L2 adds squared weights and shrinks them smoothly toward zero without eliminating them. Elastic net combines both penalties.$snip_9$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-gradient-descent', 'ml', 'theory', 'Gradient Descent', $snip_10$Gradient descent updates parameters in the direction of the negative gradient, scaled by the learning rate. Too large a rate diverges, too small converges slowly. Stochastic variants trade noisy updates for cheaper iterations and often escape shallow local minima.$snip_10$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-random-forest', 'ml', 'theory', 'Random Forest', $snip_11$A random forest averages many deep decision trees, each trained on a bootstrap sample with a random subset of features considered at every split. Bagging plus feature randomness decorrelates the trees, so averaging cuts variance without adding much bias.$snip_11$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-gradient-boosting', 'ml', 'theory', 'Gradient Boosting', $snip_12$Gradient boosting builds shallow trees sequentially, each one fit to the negative gradient of the loss with respect to the current predictions. The learning rate shrinks each tree's contribution, trading more trees for better generalization.$snip_12$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-precision-recall', 'ml', 'interview', 'Precision vs Recall', $snip_13$Precision is the share of predicted positives that are actually positive, while recall is the share of actual positives we caught. I would optimize recall for fraud or cancer screening, and precision when false alarms are expensive, like a spam filter blocking real mail.$snip_13$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-overfitting', 'ml', 'interview', 'Overfitting', $snip_14$Overfitting means the model learned noise specific to the training data, so it performs well in training but poorly on new data. I detect it through the gap between training and validation scores, and fight it with regularization, more data, simpler models, or early stopping.$snip_14$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-modeling-strategy', 'ml', 'interview', 'Modeling Strategy', $snip_15$I would start with a simple baseline like logistic regression to set a floor and validate the data pipeline end to end, then iterate toward gradient boosted trees, comparing every model on the same cross validation folds before tuning the winner.$snip_15$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-train-test-split', 'ml', 'python', 'Train/Test Split', $snip_16$from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
model.fit(X_train, y_train)
print(model.score(X_test, y_test))$snip_16$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-attention', 'ai', 'theory', 'Attention', $snip_17$Attention computes a weighted sum of value vectors, where the weights come from the similarity between a query and each key. Scaled dot product attention divides by the square root of the key dimension to keep the softmax gradients stable.$snip_17$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-transformer', 'ai', 'theory', 'Transformers', $snip_18$A transformer block stacks multi head self attention and a position wise feed forward network, each wrapped in residual connections and layer normalization. Because self attention has no notion of order, positional encodings are added to the token embeddings.$snip_18$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-rag', 'ai', 'theory', 'Retrieval Augmented Generation', $snip_19$Retrieval augmented generation grounds an LLM by retrieving relevant chunks from a vector store and injecting them into the prompt. It reduces hallucinations and keeps answers current without retraining, but quality depends heavily on chunking and retrieval relevance.$snip_19$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-embeddings', 'ai', 'theory', 'Embeddings', $snip_20$An embedding maps text into a dense vector space where semantic similarity becomes geometric closeness, usually measured with cosine similarity. Chunk size, overlap, and the choice of embedding model jointly determine retrieval quality in a RAG system.$snip_20$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-ft-vs-rag', 'ai', 'interview', 'Fine-Tuning vs RAG', $snip_21$I reach for RAG when the problem is missing knowledge, since it is cheaper, auditable, and easy to update. I fine tune when the problem is behavior, like enforcing a strict output format or a specialized tone that prompting cannot reliably achieve.$snip_21$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-pandas-groupby', 'coding', 'python', 'Pandas GroupBy', $snip_22$monthly = (
    df.groupby(["region", "month"])["revenue"]
    .sum()
    .reset_index()
    .sort_values("revenue", ascending=False)
)
top = monthly.head(10)$snip_22$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sliding-window', 'coding', 'python', 'Sliding Window', $snip_23$def max_window_sum(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        best = max(best, window)
    return best$snip_23$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-requests-api', 'coding', 'python', 'Calling REST APIs', $snip_24$import requests

resp = requests.get(
    "https://api.example.com/v1/users",
    params={"page": 1, "limit": 50},
    timeout=10,
)
resp.raise_for_status()
users = resp.json()["data"]$snip_24$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sql-join-having', 'coding', 'sql', 'Joins + HAVING', $snip_25$SELECT c.region, COUNT(o.id) AS orders
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= '2026-01-01'
GROUP BY c.region
HAVING COUNT(o.id) > 100
ORDER BY orders DESC;$snip_25$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sql-window-rank', 'coding', 'sql', 'Window Functions', $snip_26$SELECT user_id, amount,
  RANK() OVER (
    PARTITION BY user_id
    ORDER BY amount DESC
  ) AS rnk
FROM payments;$snip_26$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sql-rolling-avg', 'coding', 'sql', 'Rolling Averages', $snip_27$WITH daily AS (
  SELECT DATE(created_at) AS day,
         SUM(revenue) AS revenue
  FROM sales
  GROUP BY DATE(created_at)
)
SELECT day, revenue,
  AVG(revenue) OVER (
    ORDER BY day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d
FROM daily;$snip_27$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-law-large-numbers', 'stats', 'theory', 'Law of Large Numbers', $snip_28$The law of large numbers says the sample mean converges to the true population mean as sample size grows. The weak version gives convergence in probability, the strong version gives almost sure convergence. It is why casinos always win in the long run and why small samples are untrustworthy.$snip_28$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-sampling-bias', 'stats', 'theory', 'Sampling Bias', $snip_29$Sampling bias occurs when the sample is not representative of the population, so estimates are systematically off no matter how large the sample gets. Survivorship bias, self-selection, and non-response bias are common forms. Larger samples cannot fix a biased sampling procedure.$snip_29$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-bayes-theorem', 'stats', 'theory', 'Bayes Theorem', $snip_30$Bayes theorem updates a prior belief with evidence to produce a posterior: P(A|B) equals P(B|A) times P(A) divided by P(B). The base rate P(A) matters enormously. A test that is 99 percent accurate still produces mostly false positives when the condition is rare in the population.$snip_30$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-bootstrap', 'stats', 'theory', 'Bootstrap Resampling', $snip_31$Bootstrapping estimates the sampling distribution of a statistic by repeatedly drawing samples with replacement from the observed data and computing the statistic each time. The spread of those estimates approximates the standard error without any distributional assumptions.$snip_31$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-simpsons-paradox', 'stats', 'theory', 'Simpson''s Paradox', $snip_32$Simpson's paradox occurs when a trend present in every subgroup reverses or disappears when the groups are combined, because a confounding variable is unevenly distributed across groups. The classic example is a treatment that looks harmful overall but helps every individual subgroup.$snip_32$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-type-errors', 'stats', 'interview', 'Type I vs Type II Errors', $snip_33$A type I error is a false positive: we reject the null when it is actually true, with probability equal to alpha. A type II error is a false negative: we fail to reject a false null, with probability beta. Power is 1 minus beta. Lowering alpha reduces type I errors but increases type II errors, so the tradeoff depends on the cost of each mistake in context.$snip_33$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-median-vs-mean', 'stats', 'interview', 'When to Use Median over Mean', $snip_34$I use the median when the distribution is skewed or has heavy tails, because the mean gets pulled toward outliers while the median stays near the center of mass. For income, house prices, or response times, the median is almost always the more honest summary statistic.$snip_34$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'st-statistical-power', 'stats', 'interview', 'Statistical Power', $snip_35$Power is the probability that a test detects a real effect when one exists. It increases with sample size, effect size, and alpha. I run a power analysis before any experiment to confirm the sample is large enough to detect the minimum effect size that would actually matter to the business.$snip_35$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-kmeans', 'ml', 'theory', 'K-Means Clustering', $snip_36$K-means partitions data into k clusters by alternating between assigning each point to its nearest centroid and recomputing centroids as cluster means. It minimizes within-cluster sum of squared distances but is sensitive to initialization and assumes convex, similarly sized clusters.$snip_36$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-decision-trees', 'ml', 'theory', 'Decision Trees', $snip_37$A decision tree recursively splits the feature space by choosing the feature and threshold that maximize information gain or minimize Gini impurity at each node. Trees are highly interpretable but prone to overfitting, which is why they are almost always used inside ensembles.$snip_37$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-svm', 'ml', 'theory', 'Support Vector Machines', $snip_38$A support vector machine finds the hyperplane that maximizes the margin between classes, defined by the support vectors closest to the boundary. The kernel trick maps data into higher dimensions implicitly, letting SVMs learn nonlinear boundaries without computing the transformation explicitly.$snip_38$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-cross-validation', 'ml', 'theory', 'Cross Validation', $snip_39$K-fold cross validation splits data into k folds, trains on k minus 1 and evaluates on the held-out fold, repeating k times. Averaging the k scores gives a lower-variance estimate of generalization error than a single train/val split. Stratified k-fold preserves class proportions in each fold.$snip_39$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-feature-scaling', 'ml', 'theory', 'Feature Scaling', $snip_40$Gradient-based models and distance-based models are sensitive to feature scale. Standardization subtracts the mean and divides by standard deviation, producing zero mean and unit variance. Min-max scaling maps features to a fixed range. Tree-based models are invariant to monotone transformations so they need neither.$snip_40$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-class-imbalance', 'ml', 'theory', 'Class Imbalance', $snip_41$When one class is rare, accuracy is a misleading metric because predicting the majority class always achieves high accuracy. Solutions include reweighting the loss by inverse class frequency, oversampling the minority with SMOTE, undersampling the majority, or optimizing precision-recall AUC instead of ROC AUC.$snip_41$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-pca', 'ml', 'theory', 'Principal Component Analysis', $snip_42$PCA projects data onto the directions of maximum variance, found by computing the eigenvectors of the covariance matrix. The first principal component captures the most variance, each subsequent one is orthogonal to all prior ones. It is used for dimensionality reduction, visualization, and removing multicollinearity before regression.$snip_42$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-missing-data', 'ml', 'interview', 'Handling Missing Data', $snip_43$I first check whether data is missing completely at random, at random, or not at random, because the mechanism determines the right fix. For MCAR I might drop rows. For MAR I use model-based imputation. For MNAR I try to understand why it is missing, since imputation cannot fix a systematic information gap.$snip_43$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-feature-selection', 'ml', 'interview', 'Feature Selection Strategy', $snip_44$I start with domain knowledge to remove obviously irrelevant features, then use filter methods like correlation and mutual information to rank the rest cheaply. I follow with a wrapper method such as recursive feature elimination on the final model family to confirm, and always check VIF to catch multicollinearity before trusting coefficient estimates.$snip_44$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-eval-metrics', 'ml', 'interview', 'Choosing Evaluation Metrics', $snip_45$I choose metrics before looking at results and tie them directly to the business cost of each error type. For fraud detection I optimize recall to catch more fraud even at the cost of false alarms. For content ranking I use NDCG. For regression I prefer MAE when large errors are not disproportionately worse than small ones, and RMSE when they are.$snip_45$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-cross-val-python', 'ml', 'python', 'Cross Validation with Sklearn', $snip_46$from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import GradientBoostingClassifier

model = GradientBoostingClassifier(n_estimators=100, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
print(f'AUC: {scores.mean():.3f} +/- {scores.std():.3f}')$snip_46$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-pipeline-python', 'ml', 'python', 'Sklearn Pipeline', $snip_47$from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression

num_pipe = Pipeline([("scaler", StandardScaler())])
preprocessor = ColumnTransformer([("num", num_pipe, num_cols)])
clf = Pipeline([("prep", preprocessor), ("model", LogisticRegression())])
clf.fit(X_train, y_train)$snip_47$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ml-confusion-matrix', 'ml', 'python', 'Confusion Matrix', $snip_48$from sklearn.metrics import classification_report, confusion_matrix
import pandas as pd

y_pred = model.predict(X_test)
cm = confusion_matrix(y_test, y_pred)
print(pd.DataFrame(cm, index=["actual_0", "actual_1"],
                       columns=["pred_0", "pred_1"]))
print(classification_report(y_test, y_pred))$snip_48$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-tokenization', 'ai', 'theory', 'Tokenization', $snip_49$Tokenization splits text into sub-word units using algorithms like BPE or WordPiece. Rare words are broken into known sub-tokens, letting models handle unseen vocabulary. Token count drives both latency and cost, and the same text tokenizes differently across model families, so benchmarks are not always directly comparable.$snip_49$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-temperature', 'ai', 'theory', 'Temperature and Sampling', $snip_50$Temperature scales the logits before the softmax, sharpening or flattening the probability distribution over next tokens. Temperature zero is greedy decoding and always picks the most likely token. Higher values increase diversity at the cost of coherence. Top-p sampling draws from the smallest set of tokens whose cumulative probability exceeds p.$snip_50$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-context-window', 'ai', 'theory', 'Context Windows', $snip_51$The context window is the maximum number of tokens a model can attend to in a single forward pass, covering both input and output. Attention is quadratic in sequence length, so longer contexts are computationally expensive. For tasks that exceed the window, retrieval or summarization must compress the input before it enters the model.$snip_51$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-lora', 'ai', 'theory', 'LoRA Fine-Tuning', $snip_52$LoRA freezes the pretrained weights and injects trainable low-rank matrices into each attention layer. Because rank is much smaller than the full weight dimension, the number of trainable parameters drops by orders of magnitude. At inference the adapters are merged back into the base weights, adding zero latency.$snip_52$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-vector-db', 'ai', 'theory', 'Vector Databases', $snip_53$Vector databases store embeddings and serve approximate nearest-neighbor queries efficiently using index structures like HNSW or IVF. They trade a small recall penalty for orders-of-magnitude speedup over brute-force search. The right index depends on dataset size, query latency budget, and how often the index is updated.$snip_53$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-tool-calling', 'ai', 'theory', 'Agent Tool Calling', $snip_54$Tool calling lets an LLM emit a structured request for an external function, receive the result, and reason over it before responding. The model does not execute code itself; the host application runs the tool and appends the result to the context. Multi-step agents chain tool calls, with each result informing the next decision.$snip_54$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-hallucination', 'ai', 'interview', 'Reducing Hallucinations', $snip_55$I reduce hallucinations by grounding the model in retrieved context rather than relying on parametric memory, lowering temperature to reduce randomness, and prompting the model to cite its sources so gaps are visible. For high-stakes outputs I add a verification step where a second LLM call checks the first response against the source documents.$snip_55$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-llm-eval', 'ai', 'interview', 'Evaluating LLM Outputs', $snip_56$I evaluate LLM outputs on a combination of automated metrics (RAGAS faithfulness, answer relevancy, context recall for RAG) and human spot-checks. I maintain a golden test set of questions with expected answers and run it on every prompt change. LLM-as-judge works for relative comparisons but needs calibration against human ratings to catch systematic blind spots.$snip_56$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-chunking', 'ai', 'interview', 'Chunking Strategy for RAG', $snip_57$Chunking strategy directly determines retrieval quality. I start with recursive character splitting at 512 tokens with 10 percent overlap to preserve context across boundaries, then evaluate retrieval precision on a golden set. If a concept spans multiple chunks, I add parent document retrieval so the full section is available to the model even when only a child chunk is matched.$snip_57$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-llm-api-python', 'ai', 'python', 'Calling an LLM API', $snip_58$import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain gradient descent in one paragraph."}
    ],
)
print(message.content[0].text)$snip_58$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'ai-cosine-sim-python', 'ai', 'python', 'Cosine Similarity Search', $snip_59$import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9))

def top_k(query_emb, doc_embs, k=5):
    scores = [cosine_similarity(query_emb, d) for d in doc_embs]
    return sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]$snip_59$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-two-pointers', 'coding', 'python', 'Two Pointers', $snip_60$def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1
    return []$snip_60$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-binary-search', 'coding', 'python', 'Binary Search', $snip_61$def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1$snip_61$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-hashmap-freq', 'coding', 'python', 'Hash Map Frequency Count', $snip_62$from collections import Counter

def top_k_frequent(nums, k):
    counts = Counter(nums)
    return [item for item, _ in counts.most_common(k)]

words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
print(top_k_frequent(words, 2))$snip_62$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-try-except', 'coding', 'python', 'Error Handling', $snip_63$import requests

def fetch_user(user_id: int) -> dict:
    try:
        resp = requests.get(f'https://api.example.com/users/{user_id}', timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.Timeout:
        raise RuntimeError('Request timed out')
    except requests.exceptions.HTTPError as e:
        raise RuntimeError(f'HTTP error: {e.response.status_code}')$snip_63$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sql-row-number', 'coding', 'sql', 'Deduplication with ROW_NUMBER', $snip_64$WITH ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY email
      ORDER BY created_at DESC
    ) AS rn
  FROM users
)
SELECT id, email, created_at
FROM ranked
WHERE rn = 1;$snip_64$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sql-case-when', 'coding', 'sql', 'CASE WHEN Aggregation', $snip_65$SELECT
  product_id,
  COUNT(*) AS total_orders,
  SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) AS returns,
  ROUND(
    100.0 * SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) / COUNT(*), 1
  ) AS return_rate_pct
FROM orders
GROUP BY product_id
ORDER BY return_rate_pct DESC;$snip_65$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sql-date-trunc', 'coding', 'sql', 'Date Truncation and Grouping', $snip_66$SELECT
  DATE_TRUNC('week', created_at) AS week_start,
  COUNT(DISTINCT user_id) AS active_users,
  SUM(amount) AS revenue
FROM events
WHERE created_at >= '2026-01-01'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week_start;$snip_66$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;

insert into public.snippets (id, domain, format, concept, text) values (
  'cd-sql-left-join-null', 'coding', 'sql', 'LEFT JOIN with NULL Checks', $snip_67$SELECT u.id, u.email
FROM users u
LEFT JOIN orders o
  ON o.user_id = u.id
  AND o.created_at >= NOW() - INTERVAL '90 days'
WHERE o.id IS NULL;$snip_67$
) on conflict (id) do update set
  domain = excluded.domain,
  format = excluded.format,
  concept = excluded.concept,
  text = excluded.text;
