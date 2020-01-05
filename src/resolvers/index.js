import { extractFragmentReplacements } from 'prisma-binding';

import Post from './Post';
import User from './User';
import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';

const resolvers = { Post, User, Query, Mutation, Subscription };

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
