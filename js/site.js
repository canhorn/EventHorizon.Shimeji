const createAvatar = (config, x, y) => {
    const avatar = new Shimeji(config);

    // Create Div container for Shimeji
    const containerDiv = document.createElement('div');
    containerDiv.className = 'shimeji';
    $('zbox').appendChild(containerDiv);
    avatar.init(containerDiv, x, y);

    const avatarEnvironment = [$('zbox')];
    avatar.makeEnvironment(avatarEnvironment);

    avatar.behavior('zbox', Actions.standard(avatar));
    avatar.act('fall', 40);

    // For debugging/tracking of existing avatars.
    const avatarList = window.avatarList ? window.avatarList : [];
    avatarList.push(avatar);
    window.avatarList = avatarList;

    // Keep track of last generated avatar.
    window.avatar = avatar;
    return avatar;
};
