import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { UserSkill } from '../models/UserSkill';
import { SocialLink } from '../models/SocialLink';
import { Listing } from '../models/Listing';
import { Escrow } from '../models/Escrow';
import { Review } from '../models/Review';

// Utility to fetch unified profile details
async function getUnifiedProfileData(userId: string) {
  const user = await User.findById(userId);
  if (!user) return null;

  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    profile = new Profile({ user: userId });
    await profile.save();
  }

  let skillsDoc = await UserSkill.findOne({ user: userId });
  if (!skillsDoc) {
    skillsDoc = new UserSkill({ user: userId });
    await skillsDoc.save();
  }

  let socials = await SocialLink.findOne({ user: userId });
  if (!socials) {
    socials = new SocialLink({ user: userId });
    await socials.save();
  }

  return {
    userId: user._id,
    name: user.name,
    username: user.username || '',
    email: user.email,
    walletAddress: user.walletAddress,
    role: user.role,
    avatar: user.avatar || '',
    trustScore: user.trustScore,
    badge: user.badge,
    bio: profile.bio || '',
    location: profile.location || '',
    profileImage: profile.profileImage || '',
    skills: skillsDoc.skills || [],
    website: socials.website || '',
    twitter: socials.twitter || '',
    github: socials.github || '',
    portfolio: socials.portfolio || ''
  };
}

// Get user profile details (unified)
export async function getProfileDetails(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profileData = await getUnifiedProfileData(userId);
    if (!profileData) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(profileData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Update user profile and check username uniqueness
export async function updateProfileDetails(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name,
      username,
      bio,
      location,
      profileImage,
      skills, // Array of strings or comma-separated string
      website,
      twitter,
      github,
      portfolio
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. Validation - Enforce Unique Username
    if (username) {
      const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (sanitizedUsername !== user.username) {
        const usernameTaken = await User.findOne({ username: sanitizedUsername, _id: { $ne: userId } });
        if (usernameTaken) {
          return res.status(400).json({ error: 'Username is already taken by another account.' });
        }
        user.username = sanitizedUsername;
      }
    }

    // 2. Update User Model
    if (name) user.name = name;
    if (profileImage !== undefined) user.avatar = profileImage;
    await user.save();

    // 3. Update Profile Model
    await Profile.findOneAndUpdate(
      { user: userId },
      { bio: bio || '', location: location || '', profileImage: profileImage || '' },
      { upsert: true, new: true }
    );

    // 4. Update UserSkill Model
    let parsedSkills: string[] = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    await UserSkill.findOneAndUpdate(
      { user: userId },
      { skills: parsedSkills },
      { upsert: true, new: true }
    );

    // 5. Update SocialLink Model
    await SocialLink.findOneAndUpdate(
      { user: userId },
      {
        website: website || '',
        twitter: twitter || '',
        github: github || '',
        portfolio: portfolio || ''
      },
      { upsert: true, new: true }
    );

    // Fetch and return the newly updated unified profile
    const updatedProfile = await getUnifiedProfileData(userId);
    return res.json(updatedProfile);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Get public profile by username
export async function getPublicProfileByUsername(req: AuthRequest, res: Response) {
  try {
    const { username } = req.params;
    const sanitizedUsername = username.toLowerCase();

    const user = await User.findOne({ username: sanitizedUsername });
    if (!user) {
      return res.status(404).json({ error: `User "${username}" not found` });
    }

    const unifiedProfile = await getUnifiedProfileData(user._id.toString());
    if (!unifiedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Fetch active listings created by this user
    const listings = await Listing.find({ createdBy: user._id, status: 'active' }).sort({ createdAt: -1 });

    // Fetch escrows completed
    const escrowsCompleted = await Escrow.countDocuments({
      $or: [{ client: user._id }, { freelancer: user._id }],
      status: 'COMPLETED'
    });

    // Fetch reviews for user
    // (Query reviews where the user was the freelancer)
    const reviews = await Review.find({ escrowId: { $in: await Escrow.find({ freelancer: user._id }).distinct('_id') } })
      .populate('reviewer', 'name username avatar')
      .sort({ createdAt: -1 });

    return res.json({
      profile: unifiedProfile,
      listings,
      stats: {
        escrowsCompleted,
        listingsCreated: listings.length,
        joinedDate: user.createdAt
      },
      reviews
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
