from gensim import corpora
from gensim.models import LdaModel
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Sample text
text = """
This template guides you through CRUD operations (GET, POST, PUT, DELETE), variables, and tests. 
RESTful APIs allow you to perform CRUD operations using the POST, GET, PUT, and DELETE HTTP methods. 
(GET, POST, PUT, DELETE)
"""

# Tokenization, stop word removal, and stemming
stop_words = set(stopwords.words('english'))
ps = PorterStemmer()
tokens = [ps.stem(word) for word in word_tokenize(text.lower()) if word.isalnum() and word not in stop_words]

# Create a dictionary and a bag-of-words representation of the text
dictionary = corpora.Dictionary([tokens])
corpus = [dictionary.doc2bow(tokens)]

# Train the LDA model
lda_model = LdaModel(corpus, num_topics=1, id2word=dictionary)

# Get the topics and occurrences
topics = lda_model.show_topics()
topic_occurrences = lda_model.get_document_topics(corpus[0], minimum_probability=0.0)

# Print the topics and occurrences
print("Topics:")
for topic in topics:
    print(topic)

print("\nTopic Occurrences:")
for topic_occurrence in topic_occurrences:
    print(f"Topic {topic_occurrence[0]}: {topic_occurrence[1]} occurrences")
